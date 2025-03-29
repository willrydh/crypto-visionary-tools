import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, AlertTriangle, Info } from 'lucide-react';
import { fetchHistoricalPrices } from '@/services/priceDataService';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PriceChartProps {
  symbol?: string;
  coinId?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({
  symbol = 'BTC/USD',
  coinId = 'bitcoin'
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeframe, setTimeframe] = useState<string>('1d');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const loadChartData = async (days: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const candleData = await fetchHistoricalPrices(symbol, timeframe as any, days);

      const data = candleData.map(candle => ({
        time: new Date(candle.timestamp).toLocaleString(),
        price: candle.close,
        date: new Date(candle.timestamp)
      }));

      setChartData(data);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Error loading chart data:', error);
      setError('Failed to load price data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const days = timeframe === '1d' ? 1 :
      timeframe === '7d' ? 7 :
      timeframe === '30d' ? 30 : 90;

    loadChartData(days);

    const interval = setInterval(() => {
      loadChartData(days);
    }, timeframe === '1d' ? 60000 : 300000);

    return () => clearInterval(interval);
  }, [timeframe, coinId]);

  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    if (timeframe === '1d') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
          <h3 className="font-medium">{symbol} Price Chart</h3>
          <div className="flex items-center gap-2">
            <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
              <TabsList className="h-7">
                <TabsTrigger value="1d" className="text-xs px-2 h-6">1D</TabsTrigger>
                <TabsTrigger value="7d" className="text-xs px-2 h-6">1W</TabsTrigger>
                <TabsTrigger value="30d" className="text-xs px-2 h-6">1M</TabsTrigger>
                <TabsTrigger value="90d" className="text-xs px-2 h-6">3M</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center text-muted-foreground text-xs ml-2 gap-1">
              <Info className="h-3 w-3" />
              Updated: {lastUpdated}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="h-64 flex flex-col items-center justify-center text-destructive">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p className="text-sm">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const days = timeframe === '1d' ? 1 :
                  timeframe === '7d' ? 7 :
                  timeframe === '30d' ? 30 : 90;
                loadChartData(days);
              }}
            >
              Try again
            </Button>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  tickFormatter={formatXAxis}
                  tickCount={5}
                  minTickGap={20}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => formatCurrency(value)}
                  width={60}
                />
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <Tooltip
                  labelFormatter={(value) => `${value}`}
                  formatter={(value) => [formatCurrency(value as number), "Price"]}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  fill="url(#colorPrice)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceChart;
