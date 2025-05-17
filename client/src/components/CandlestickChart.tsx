import { useEffect, useRef } from "react";
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

    // Map and sort candles by time ascending
    const chartData: CandlestickData[] = candles
      .map((candle) => ({
        time: (candle.time / 1000) as Time, // Convert ms to seconds
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }))
      .sort((a, b) => (a.time as number) - (b.time as number))  // Sort ascending
      .filter((candle, index, arr) => {
        // Remove duplicate times by keeping only the first occurrence
        if (index === 0) return true;
        return (candle.time as number) > (arr[index - 1].time as number);
      });
    // Sort ascending by time

    candleSeries.setData(chartData);

    // Handle chart container resizing
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
  }, [candles, interval]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
}

