
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { fetchHistoricalPrices } from '@/services/priceDataService';
import { formatCurrency } from '@/lib/utils';
import {
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

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
  
  const loadChartData = async (days: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      // For 1d, we should use different parameters due to CoinGecko API limitations
      // (hourly data is for Enterprise plan only)
      const interval = days === 1 ? undefined : days > 1 ? 'daily' : 'hourly';
      
      const { timestamps, prices } = await fetchHistoricalPrices(
        coinId, 
        days,
        interval
      );
      
      // Format data for chart
      const data = timestamps.map((timestamp, i) => ({
        time: new Date(timestamp).toLocaleString(),
        price: prices[i],
        date: new Date(timestamp)
      }));
      
      setChartData(data);
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
    // Set up refresh interval - every 1 minute for 1d, 5 minutes for other timeframes
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
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">{symbol} Price Chart</h3>
          <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
            <TabsList className="h-7">
              <TabsTrigger value="1d" className="text-xs px-2 h-6">1D</TabsTrigger>
              <TabsTrigger value="7d" className="text-xs px-2 h-6">1W</TabsTrigger>
              <TabsTrigger value="30d" className="text-xs px-2 h-6">1M</TabsTrigger>
              <TabsTrigger value="90d" className="text-xs px-2 h-6">3M</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="h-64 flex flex-col items-center justify-center text-destructive">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => {
                const days = timeframe === '1d' ? 1 : 
                          timeframe === '7d' ? 7 : 
                          timeframe === '30d' ? 30 : 90;
                loadChartData(days);
              }} 
              className="mt-4 text-xs underline text-muted-foreground"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="h-64">
            <ChartContainer
              config={{
                price: {
                  theme: {
                    light: 'hsl(var(--primary))',
                    dark: 'hsl(var(--primary))'
                  }
                }
              }}
            >
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
                <ChartTooltip
                  content={
                    <ChartTooltipContent labelFormatter={(value) => `${value}`} />
                  }
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="hsl(var(--primary))" 
                  fill="url(#colorPrice)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceChart;
