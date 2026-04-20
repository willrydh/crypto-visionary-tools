
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, AlertTriangle, Info, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fetchHistoricalPrices } from '@/services/priceDataService';
import { useCrypto } from '@/hooks/useCrypto';
import { usePrice } from '@/hooks/usePrice';
import { formatCurrency } from '@/utils/numberUtils';
import PriceChartDisplay from './PriceChartDisplay';

interface PriceChartContainerProps {
  symbol?: string;
  showLevels?: boolean;
  levels?: any[];
  excludeTimeframes?: string[];
}

const TIMEFRAME_CONFIG = {
  '1d': { interval: '60', limit: 24 },
  '7d': { interval: '240', limit: 42 },
  '30d': { interval: 'D', limit: 30 },
  '90d': { interval: 'D', limit: 90 },
};

const PriceChartContainer: React.FC<PriceChartContainerProps> = ({
  symbol = 'BTC/USDT',
  showLevels = false,
  levels = [],
  excludeTimeframes = [],
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
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const { selectedCrypto } = useCrypto();
  const { loadPriceData, priceData } = usePrice();

  const actualSymbol = symbol || `${selectedCrypto.symbol}/USDT`;
  const formattedSymbol = actualSymbol.replace('/', '');

  // Ladda diagramdata från API
  const loadChartData = useCallback(async () => {
    const config = TIMEFRAME_CONFIG[timeframe] || TIMEFRAME_CONFIG['1d'];
    const interval = config.interval;
    const limit = config.limit;

    const now = Date.now();
    if (now - lastFetchTime < 30000 && processedData.length > 0) {
      return;
    }

    setLastFetchTime(now);
    setIsLoading(true);
    setError(null);
    setConnectionStatus('connecting');

    try {
      const candleData = await fetchHistoricalPrices(formattedSymbol, interval, limit);

      if (!candleData || candleData.length === 0) {
        throw new Error('No data returned from API');
      }

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
        color: candle.close >= candle.open ? "hsl(var(--bullish))" : "hsl(var(--bearish))",
        date: new Date(candle.timestamp)
      }));

      setChartData(data);
      setProcessedData(
        data.map(item => ({
          timestamp: item.timestamp,
          price: item.price,
          time: item.time
        }))
      );

      setLastUpdated(new Date().toLocaleString());
      setConnectionStatus('connected');
    } catch (error) {
      setError('Failed to load price data. Please try again later.');
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  }, [timeframe, formattedSymbol, lastFetchTime, processedData.length]);

  // Nuvarande pris-data
  const updateCurrentPrice = useCallback(async () => {
    try {
      if (priceData[formattedSymbol]) {
        setCurrentPrice({
          price: priceData[formattedSymbol].price,
          change24h: priceData[formattedSymbol].change24h,
          volume24h: priceData[formattedSymbol].volume24h || 0,
          timestamp: priceData[formattedSymbol].timestamp || Date.now()
        });
        return;
      }
      const freshData = await loadPriceData(formattedSymbol);
      if (freshData) {
        setCurrentPrice({
          price: freshData.price,
          change24h: freshData.change24h,
          volume24h: freshData.volume24h || 0,
          timestamp: freshData.timestamp || Date.now()
        });
      }
    } catch (error) {
      //
    }
  }, [priceData, formattedSymbol, loadPriceData]);

  useEffect(() => {
    loadChartData();
    updateCurrentPrice();

    const chartInterval = setInterval(() => loadChartData(), 60000);
    const priceInterval = setInterval(updateCurrentPrice, 30000);

    return () => {
      clearInterval(chartInterval);
      clearInterval(priceInterval);
    };
  }, [timeframe, formattedSymbol, loadChartData, updateCurrentPrice]);

  // Available timeframes (exclude any provided via props)
  const timeframes = [
    { key: '1d', label: '1D' },
    { key: '7d', label: '1W' },
    { key: '30d', label: '1M' },
    { key: '90d', label: '3M' }
  ].filter(tf => !excludeTimeframes.includes(tf.key));

  return (
    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{actualSymbol} Price Chart</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <span>Bybit API</span>
                  {connectionStatus === 'connected' && (
                    <CheckCircle className="h-3 w-3 text-bullish" />
                  )}
                  {connectionStatus === 'connecting' && (
                    <RefreshCw className="h-3 w-3 animate-spin text-warning" />
                  )}
                  {connectionStatus === 'disconnected' && (
                    <AlertTriangle className="h-3 w-3 text-bearish" />
                  )}
                </Badge>
              </div>
            </div>
            <div className="text-xl font-bold">
              {currentPrice !== null ? formatCurrency(currentPrice.price) : 'Loading...'}
              {currentPrice && currentPrice.change24h !== 0 && (
                <Badge
                  className={`ml-2 ${currentPrice.change24h > 0 ? 'bg-bullish text-primary-foreground' : 'bg-bearish text-primary-foreground'}`}
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
            <Tabs value={timeframe} onValueChange={(value) => {
              setTimeframe(value);
              setIsLoading(true);
            }} className="w-auto">
              <TabsList className="h-7">
                {timeframes.map(tf => (
                  <TabsTrigger key={tf.key} value={tf.key} className="text-xs px-2 h-6">{tf.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                loadChartData();
                updateCurrentPrice();
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
                        connectionStatus === 'connected' ? 'text-bullish' :
                          connectionStatus === 'connecting' ? 'text-warning' :
                            'text-bearish'
                      }>
                        {connectionStatus === 'connected' ? 'Connected' :
                          connectionStatus === 'connecting' ? 'Connecting' :
                            'Disconnected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data Points:</span>
                      <span>{processedData.length}</span>
                    </div>
                    {currentPrice && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Price:</span>
                        <span>{formatCurrency(currentPrice.price)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {isLoading && processedData.length === 0 ? (
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
                loadChartData();
              }}
            >
              Try again
            </Button>
          </div>
        ) : (
          <PriceChartDisplay processedData={processedData} timeframe={timeframe} />
        )}
        <div className="flex items-center text-muted-foreground text-xs mt-2 gap-1 justify-end">
          <Info className="h-3 w-3" />
          Updated: {lastUpdated}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChartContainer;
