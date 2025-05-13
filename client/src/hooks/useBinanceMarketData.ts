// src/hooks/useBinanceAllMarketData.ts
import { useEffect, useState } from 'react';

// Custom hook to get live market data for BTC/USDC and SOL/USDC
export const useBinanceAllMarketData = () => {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket(
      'wss://stream.binance.com:9443/stream?streams=btcusdc@ticker/solusdc@ticker'
    );

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Extract individual stream data
      const streamData = message.data;

      setMarketData((prevData) => {
        // Replace the old data for this symbol or add new
        const updatedData = [...prevData];
        const index = updatedData.findIndex(item => item.s === streamData.s);
        if (index !== -1) {
          updatedData[index] = streamData;
        } else {
          updatedData.push(streamData);
        }
        return updatedData;
      });
    };

    socket.onerror = (err) => {
      setError("Error connecting to Binance WebSocket.");
      console.error("WebSocket error: ", err);
    };

    return () => {
      socket.close();
    };
  }, []);

  return { marketData, error };
};
