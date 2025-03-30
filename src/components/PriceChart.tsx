
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, AlertTriangle, Info, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';
import { fetchHistoricalPrices, fetchCurrentPrice } from '@/services/priceDataService';
import { formatCurrency } from '@/lib/utils';
import { applySMA } from '@/utils/chartUtils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
  Line
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PriceChartProps {
  symbol?: string;
  coinId?: string;
  showLevels?: boolean;
  levels?: any[];
  excludeTimeframes?: string[];
}

const PriceChart: React.FC<PriceChartProps> = ({
  symbol = 'BTC/USDT',
  coinId = 'bitcoin',
  showLevels = false,
  levels = [],
  excludeTimeframes = []
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState<{
    price: number;
    change24h: number;
    volume24h: number;
    timestamp: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeframe, setTimeframe] = useState<string>('1d');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const [showMA200, setShowMA200] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

  const loadChartData = async (days: number = 1) => {
    setIsLoading(true);
    setError(null);
    setConnectionStatus('connecting');
    try {
      const candleData = await fetchHistoricalPrices(symbol, timeframe as any, days);
      const sortedData = [...candleData].sort((a, b) => a.timestamp - b.timestamp);
      
      const data = sortedData.map(candle => ({
        time: new Date(candle.timestamp).toLocaleString(),
        timestamp: candle.timestamp,
        price: candle.close,
        open: candle.open,
        close: candle.close,
        high: candle.high,
        low: candle.low,
        volume: candle.volume,
        color: candle.close >= candle.open ? "#16a34a" : "#dc2626",
        date: new Date(candle.timestamp)
      }));

      setChartData(data);
      
      // Process data for chart display
      if (chartType === 'line') {
        const lineData = data.map(item => ({
          timestamp: item.timestamp,
          price: item.price,
          time: item.time
        }));
        
        // Apply MA 200
        const dataWithMA200 = applySMA(lineData, 200);
        setProcessedData(dataWithMA200);
      } else {
        setProcessedData(data);
      }
      
      setLastUpdated(new Date().toLocaleString());
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error loading chart data:', error);
      setError('Failed to load price data. Please try again later.');
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrentPrice = async () => {
    try {
      const price = await fetchCurrentPrice(symbol);
      setCurrentPrice(price);
    } catch (error) {
      console.error('Failed to fetch current price:', error);
    }
  };

  useEffect(() => {
    const days = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    loadChartData(days);
    loadCurrentPrice();

    const chartInterval = setInterval(() => loadChartData(days), timeframe === '1d' ? 60000 : 300000);
    const priceInterval = setInterval(loadCurrentPrice, 30000);

    return () => {
      clearInterval(chartInterval);
      clearInterval(priceInterval);
    };
  }, [timeframe, symbol, chartType]);

  useEffect(() => {
    // Update processed data when chart type changes
    if (chartData.length > 0) {
      if (chartType === 'line') {
        const lineData = chartData.map(item => ({
          timestamp: item.timestamp,
          price: item.price,
          time: item.time
        }));
        
        // Apply MA 200
        const dataWithMA200 = applySMA(lineData, 200);
        setProcessedData(dataWithMA200);
      } else {
        setProcessedData(chartData);
      }
    }
  }, [chartType, chartData]);

  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    if (timeframe === '1d') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const toggleChartType = () => {
    setChartType(chartType === 'line' ? 'candle' : 'line');
  };

  const toggleMA200 = () => {
    setShowMA200(!showMA200);
  };

  const renderLineChart = () => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={processedData}
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
            formatter={(value, name) => {
              if (name === 'sma') return [formatCurrency(value as number), 'MA 200'];
              return [formatCurrency(value as number), typeof name === 'string' ? name === 'price' ? 'Price' : name.charAt(0).toUpperCase() + name.slice(1) : name];
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            fill="url(#colorPrice)"
            isAnimationActive={false}
          />
          
          {showMA200 && (
            <Line
              type="monotone"
              dataKey="sma"
              stroke="#ff0000"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              name="MA 200"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderCandleChart = () => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
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
            formatter={(value, name) => {
              if (name === 'volume') return [value, 'Volume'];
              return [formatCurrency(value as number), typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : name];
            }}
          />
          <Bar
            dataKey="high"
            fill="#8884d8"
            isAnimationActive={false}
            name="High"
            hide={true}
          />
          <Bar
            dataKey="low"
            fill="#8884d8"
            isAnimationActive={false}
            name="Low"
            hide={true}
          />
          <Bar
            dataKey={(data) => data.high - data.low}
            name="Range"
            fill="transparent"
            stroke="#888"
            isAnimationActive={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} strokeWidth={1} stroke={entry.color} />
            ))}
          </Bar>
          <Bar
            dataKey={(data) => Math.abs(data.close - data.open)}
            name="Body"
            isAnimationActive={false}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`body-${index}`} 
                fill={entry.color} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{symbol} Price Chart</h3>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <span>Bybit API</span>
                  {connectionStatus === 'connected' && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                  {connectionStatus === 'connecting' && (
                    <RefreshCw className="h-3 w-3 animate-spin text-yellow-500" />
                  )}
                  {connectionStatus === 'disconnected' && (
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                  )}
                </Badge>
              </div>
            </div>
            <div className="text-xl font-bold">
              {currentPrice !== null ? formatCurrency(currentPrice.price) : 'Loading...'}
              {currentPrice && currentPrice.change24h !== 0 && (
                <Badge 
                  className={`ml-2 ${currentPrice.change24h > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                >
                  {currentPrice.change24h > 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(currentPrice.change24h).toFixed(2)}%
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2 mr-2">
              <Switch id="chart-ma200" checked={showMA200} onCheckedChange={toggleMA200} />
              <Label htmlFor="chart-ma200" className="text-xs">MA 200</Label>
            </div>
          
            <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
              <TabsList className="h-7">
                <TabsTrigger value="1d" className="text-xs px-2 h-6">1D</TabsTrigger>
                <TabsTrigger value="7d" className="text-xs px-2 h-6">1W</TabsTrigger>
                <TabsTrigger value="30d" className="text-xs px-2 h-6">1M</TabsTrigger>
                <TabsTrigger value="90d" className="text-xs px-2 h-6">3M</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-2" 
              onClick={toggleChartType}
            >
              {chartType === 'line' ? 'Candle' : 'Line'}
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => {
                const days = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
                loadChartData(days);
                loadCurrentPrice();
              }}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Chart Data Status</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <span>Bybit API</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>{lastUpdated || 'Never'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={
                        connectionStatus === 'connected' ? 'text-green-500' : 
                        connectionStatus === 'connecting' ? 'text-yellow-500' : 
                        'text-red-500'
                      }>
                        {connectionStatus === 'connected' ? 'Connected' : 
                         connectionStatus === 'connecting' ? 'Connecting' : 
                         'Disconnected'}
                      </span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
                const days = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
                loadChartData(days);
              }}
            >
              Try again
            </Button>
          </div>
        ) : (
          <div className="h-64">
            {chartType === 'line' ? renderLineChart() : renderCandleChart()}
          </div>
        )}
        
        <div className="flex items-center text-muted-foreground text-xs mt-2 gap-1 justify-end">
          <Info className="h-3 w-3" />
          Updated: {lastUpdated}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
