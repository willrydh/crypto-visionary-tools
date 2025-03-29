import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  ArrowDown,
  ArrowUp,
  RefreshCw,
  AlertTriangle,
  LineChart,
  CandlestickChart,
  Info
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchCurrentPrice, fetchHistoricalPrices, PriceCandle } from '@/services/priceDataService';
import { formatCurrency } from '@/utils/numberUtils';
import { formatChartTime } from '@/utils/dateUtils';
import { useTimeframe } from '@/hooks/useTimeframe';
import { Timeframe } from '@/contexts/TimeframeContext';
import { PriceLevel } from '@/contexts/SupportResistanceContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  ReferenceLine
} from 'recharts';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface PriceChartProps {
  symbol?: string;
  showLevels?: boolean;
  levels?: PriceLevel[];
}

export const PriceChart: React.FC<PriceChartProps> = ({ 
  symbol = 'BTC/USDT',
  showLevels = false,
  levels = []
}) => {
  const { currentTimeframe, setCurrentTimeframe } = useTimeframe();
  const [chartData, setChartData] = useState<PriceCandle[]>([]);
  const [currentPrice, setCurrentPrice] = useState<{
    price: number;
    change24h: number;
    volume24h: number;
    timestamp: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const [dataStatus, setDataStatus] = useState<{
    source: string;
    lastFetched: Date | null;
    status: 'success' | 'error' | 'cached';
  }>({
    source: 'API / Local Mock',
    lastFetched: null,
    status: 'cached'
  });
  
  const loadChartData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const price = await fetchCurrentPrice(symbol);
      setCurrentPrice(price);
      
      const data = await fetchHistoricalPrices(symbol, currentTimeframe, 100);
      setChartData(data);
      
      setDataStatus({
        source: 'ProfitPilot API',
        lastFetched: new Date(),
        status: 'success'
      });
    } catch (error) {
      console.error('Error loading chart data:', error);
      setError('Failed to load price data. Please try again later.');
      setDataStatus({
        ...dataStatus,
        lastFetched: new Date(),
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadChartData();
    
    const interval = setInterval(() => {
      loadChartData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [currentTimeframe, symbol]);
  
  const formatXAxis = (timestamp: number) => {
    return formatChartTime(timestamp, currentTimeframe);
  };
  
  const tooltipFormatter = (value: number) => {
    return formatCurrency(value);
  };
  
  const handleTimeframeChange = (timeframe: string) => {
    setCurrentTimeframe(timeframe as Timeframe);
  };
  
  const getCandlestickData = (candle: PriceCandle) => {
    return {
      ...candle,
      color: candle.close > candle.open ? "rgba(0, 255, 0, 0.7)" : "rgba(255, 0, 0, 0.7)",
      openToClose: candle.close - candle.open,
      openToCloseY: Math.min(candle.open, candle.close),
      highToLow: candle.high - candle.low,
      highToLowY: candle.low
    };
  };
  
  const getChartData = () => {
    if (chartType === 'line') {
      return chartData.map(candle => ({
        timestamp: candle.timestamp,
        price: candle.close
      }));
    } else {
      return chartData.map(getCandlestickData);
    }
  };
  
  const renderWickColor = (entry: any) => entry.color || "#000";
  const renderBodyColor = (entry: any) => entry.color || "#000";
  
  return (
    <Card className="h-full max-w-5xl mx-auto">
      <CardHeader className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {symbol} Chart
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Chart Data Status</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Source:</span>
                        <span>{dataStatus.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span>{dataStatus.lastFetched ? dataStatus.lastFetched.toLocaleTimeString() : 'Never'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={dataStatus.status === 'success' ? 'text-green-500' : dataStatus.status === 'error' ? 'text-red-500' : 'text-amber-500'}>
                          {dataStatus.status.charAt(0).toUpperCase() + dataStatus.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </CardTitle>
            {currentPrice && (
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold font-mono">
                  {formatCurrency(currentPrice.price)}
                </span>
                <Badge 
                  className={currentPrice.change24h >= 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                >
                  {currentPrice.change24h >= 0 ? 
                    <ArrowUp className="h-3 w-3 mr-1" /> : 
                    <ArrowDown className="h-3 w-3 mr-1" />
                  }
                  {Math.abs(Math.round(currentPrice.change24h * 100) / 100)}%
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <ToggleGroup type="single" value={chartType} onValueChange={(value) => value && setChartType(value as 'line' | 'candle')}>
              <ToggleGroupItem value="line" aria-label="Line chart">
                <LineChart className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="candle" aria-label="Candlestick chart">
                <CandlestickChart className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={loadChartData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        <Tabs value={currentTimeframe} onValueChange={handleTimeframeChange} className="w-full">
          <TabsList className="w-full grid grid-cols-8">
            <TabsTrigger value="1m" className="text-xs">1m</TabsTrigger>
            <TabsTrigger value="5m" className="text-xs">5m</TabsTrigger>
            <TabsTrigger value="15m" className="text-xs">15m</TabsTrigger>
            <TabsTrigger value="30m" className="text-xs">30m</TabsTrigger>
            <TabsTrigger value="1h" className="text-xs">1h</TabsTrigger>
            <TabsTrigger value="4h" className="text-xs">4h</TabsTrigger>
            <TabsTrigger value="1d" className="text-xs">1d</TabsTrigger>
            <TabsTrigger value="1w" className="text-xs">1w</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-0 pt-2">
        {isLoading && chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-destructive">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p className="text-sm">{error}</p>
            <Button 
              onClick={loadChartData} 
              className="mt-4 text-xs"
              variant="outline"
              size="sm"
            >
              Try again
            </Button>
          </div>
        ) : (
          <div className="h-[300px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <AreaChart
                  data={getChartData()}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatXAxis} 
                    minTickGap={30}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    tick={{ fontSize: 10 }}
                    tickFormatter={tooltipFormatter}
                    width={60}
                  />
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.1} />
                  <Tooltip 
                    labelFormatter={(label) => formatXAxis(label as number)}
                    formatter={tooltipFormatter}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#colorPrice)" 
                    isAnimationActive={false}
                  />
                  
                  {showLevels && levels.map((level, idx) => (
                    <ReferenceLine 
                      key={idx}
                      y={level.price}
                      stroke={level.type === 'support' ? "rgba(0, 255, 0, 0.5)" : "rgba(255, 0, 0, 0.5)"}
                      strokeDasharray={level.strength === 'strong' ? "0" : "5 5"}
                      strokeWidth={level.strength === 'strong' ? 2 : 1}
                      label={{ 
                        value: `${level.type} (${level.price.toFixed(1)})`, 
                        position: 'insideBottomRight',
                        fill: level.type === 'support' ? "rgba(0, 255, 0, 0.8)" : "rgba(255, 0, 0, 0.8)",
                        fontSize: 10
                      }}
                    />
                  ))}
                </AreaChart>
              ) : (
                <ComposedChart
                  data={getChartData()}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatXAxis} 
                    minTickGap={30}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    tick={{ fontSize: 10 }}
                    tickFormatter={tooltipFormatter}
                    width={60}
                  />
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.1} />
                  <Tooltip 
                    labelFormatter={(label) => formatXAxis(label as number)}
                    formatter={tooltipFormatter}
                  />
                  
                  <Bar 
                    dataKey="highToLow"
                    fill="transparent"
                    stroke={renderWickColor}
                    barSize={5}
                    yAxisId={0}
                    stackId="stack"
                    isAnimationActive={false}
                  />
                  
                  <Bar 
                    dataKey="openToClose"
                    fill={renderBodyColor}
                    stroke={renderBodyColor}
                    barSize={15}
                    yAxisId={0}
                    isAnimationActive={false}
                  />
                  
                  {showLevels && levels.map((level, idx) => (
                    <ReferenceLine 
                      key={idx}
                      y={level.price}
                      stroke={level.type === 'support' ? "rgba(0, 255, 0, 0.5)" : "rgba(255, 0, 0, 0.5)"}
                      strokeDasharray={level.strength === 'strong' ? "0" : "5 5"}
                      strokeWidth={level.strength === 'strong' ? 2 : 1}
                      label={{ 
                        value: `${level.type} (${level.price.toFixed(1)})`, 
                        position: 'insideBottomRight',
                        fill: level.type === 'support' ? "rgba(0, 255, 0, 0.8)" : "rgba(255, 0, 0, 0.8)",
                        fontSize: 10
                      }}
                    />
                  ))}
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
