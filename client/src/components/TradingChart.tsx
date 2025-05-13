import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDrift } from "@/lib/driftAdapter";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface TradingChartProps {
  market: string;
}

interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  date?: string;
}

export default function TradingChart({ market }: TradingChartProps) {
  const [timeframe, setTimeframe] = useState("15m");
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getMarketHistory, getMarketPrice } = useDrift();
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  // Fetch market data when market or timeframe changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch historical data
        const data = await getMarketHistory(market, timeframe);
        
        // Format data for Recharts
        const formattedData = data.map((item: ChartData) => ({
          ...item,
          date: new Date(item.timestamp).toLocaleTimeString(),
        }));
        
        setChartData(formattedData);
        
        // Get the latest price
        const price = await getMarketPrice(market);
        setCurrentPrice(price);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        setError("Failed to load chart data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up interval to refresh data
    const intervalId = setInterval(fetchData, 15000);
    
    return () => clearInterval(intervalId);
  }, [market, timeframe, getMarketHistory, getMarketPrice]);

  const timeframes = [
    { label: "1m", value: "1m" },
    { label: "5m", value: "5m" },
    { label: "15m", value: "15m" },
    { label: "1h", value: "1h" },
    { label: "4h", value: "4h" },
  ];
  
  // Price formatter for tooltips
  const formatPrice = (value: number) => {
    return `$${value.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };
  
  // Get price change data
  const getPriceChange = () => {
    if (chartData.length < 2) return { value: 0, percentage: 0 };
    
    const firstPrice = chartData[0].close;
    const lastPrice = chartData[chartData.length - 1].close;
    const change = lastPrice - firstPrice;
    const percentage = (change / firstPrice) * 100;
    
    return {
      value: change,
      percentage: percentage
    };
  };
  
  const priceChange = getPriceChange();
  const isPriceUp = priceChange.value >= 0;

  return (
    <Card className="gradient-card rounded-xl p-4 border border-neutral/20 mb-6">
      <CardContent className="p-0">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h3 className="font-medium">{market}</h3>
            {currentPrice && (
              <span className="ml-3 font-mono font-medium">
                {formatPrice(currentPrice)}
                <span className={`ml-2 text-sm ${isPriceUp ? 'text-profit' : 'text-loss'}`}>
                  {isPriceUp ? '+' : ''}{priceChange.percentage.toFixed(2)}%
                </span>
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                size="sm"
                variant="ghost"
                className={`text-xs ${timeframe === tf.value ? "bg-accent-primary/20 text-accent-primary" : "bg-bg-primary"}`}
                onClick={() => setTimeframe(tf.value)}
              >
                {tf.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="h-72 rounded-lg overflow-hidden bg-bg-primary/50 p-2">
          {isLoading && chartData.length === 0 ? (
            <div className="chart-placeholder h-full rounded-lg flex items-center justify-center">
              <div className="text-center">
                <i className="ri-line-chart-line text-4xl text-accent-primary mb-2"></i>
                <p className="text-text-secondary text-sm">Loading chart...</p>
              </div>
            </div>
          ) : error ? (
            <div className="chart-placeholder h-full rounded-lg flex items-center justify-center">
              <div className="text-center">
                <i className="ri-error-warning-line text-4xl text-loss mb-2"></i>
                <p className="text-text-secondary text-sm">{error}</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={isPriceUp ? "rgb(74, 222, 128)" : "rgb(248, 113, 113)"} 
                      stopOpacity={0.3} 
                    />
                    <stop 
                      offset="95%" 
                      stopColor={isPriceUp ? "rgb(74, 222, 128)" : "rgb(248, 113, 113)"} 
                      stopOpacity={0} 
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: '#A0A0B0' }}
                  tickLine={{ stroke: '#A0A0B0' }}
                  axisLine={{ stroke: '#A0A0B0' }}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 10, fill: '#A0A0B0' }}
                  tickLine={{ stroke: '#A0A0B0' }}
                  axisLine={{ stroke: '#A0A0B0' }}
                  tickFormatter={formatPrice}
                />
                <Tooltip 
                  formatter={(value: number) => [formatPrice(value), 'Price']}
                  labelFormatter={(label) => `Time: ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    borderColor: '#374151',
                    color: '#f3f4f6'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="close" 
                  stroke={isPriceUp ? "rgb(74, 222, 128)" : "rgb(248, 113, 113)"} 
                  fillOpacity={1}
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
