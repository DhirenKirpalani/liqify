import { useEffect, useState } from "react";

export interface Candle {
  time: number;  // time in milliseconds
  open: number;
  high: number;
  low: number;
  close: number;
}

export const useBinanceCandlestickChart = (symbol: string, interval: string) => {
  const [candles, setCandles] = useState<Candle[]>([]);

  useEffect(() => {
    let socket: WebSocket;

    const fetchHistorical = async () => {
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=100`
      );
      const data = await res.json();
      const formatted = data.map((d: any) => {
        const timeInMs = d[0]; // Binance returns time in milliseconds
        console.log("Raw Time (ms):", timeInMs);  // Log to verify the time
        return {
          time: timeInMs,  // Keep the time in milliseconds
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        };
      });
      setCandles(formatted);
    };

    const subscribeToWebSocket = () => {
      socket = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
      );

      socket.onmessage = (event) => {
        const json = JSON.parse(event.data);
        const k = json.k;
        const newCandle: Candle = {
          time: k.t,  // time in milliseconds
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
        };

        console.log("WebSocket Raw Time (ms):", newCandle.time);  // Log to verify the WebSocket time

        setCandles((prev) => {
          const last = prev[prev.length - 1];
          if (last?.time === newCandle.time) {
            return [...prev.slice(0, -1), newCandle]; // update last
          } else {
            return [...prev, newCandle]; // append new
          }
        });
      };
    };

    fetchHistorical().then(subscribeToWebSocket);

    return () => {
      if (socket) socket.close();
    };
  }, [symbol, interval]);

  // Convert UTC timestamp to local time
  const formatTime = (time: number) => {
    const date = new Date(time); // Convert timestamp to Date object
    // Adjust for local time zone difference
    const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localTime.toLocaleString(); // Return the localized time
  };

  const formattedCandles = candles.map((candle) => ({
    ...candle,
    formattedTime: formatTime(candle.time), // Add formatted time to candles
  }));

  // Log the candles with formatted time
  console.log("Formatted Candles:", formattedCandles);

  return formattedCandles;
};
