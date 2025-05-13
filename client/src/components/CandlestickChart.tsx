import { useEffect, useRef, useState } from "react";
import { createChart, IChartApi, CandlestickData, Time } from "lightweight-charts";
import { useBinanceCandlestickChart } from "@/hooks/useBinanceCandlestickChart";

interface Props {
  symbol: string;
  interval: string;  // interval is now passed dynamically
}

export default function CandlestickChart({ symbol, interval }: Props) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candles = useBinanceCandlestickChart(symbol, interval);

  useEffect(() => {
    if (!chartContainerRef.current || candles.length === 0) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "black" },
        textColor: "#000000",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: interval === "1m",
      },
    });

    chartRef.current = chart;

    const candleSeries = chart.addCandlestickSeries();

    const chartData: CandlestickData[] = candles.map((candle) => ({
      time: (candle.time / 1000) as Time, // Convert milliseconds to seconds and cast to Time
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    candleSeries.setData(chartData);

    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [candles, interval]); // Re-run whenever `candles` or `interval` changes

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
}
