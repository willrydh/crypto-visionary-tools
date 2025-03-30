
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, TrendingUp, TrendingDown, Activity, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getNyseVolatilityStats, getTrendTracking } from '@/services/dataLoggingService';
import { Progress } from '@/components/ui/progress';

const DataInsights: React.FC = () => {
  const [volatilityPeriod, setVolatilityPeriod] = useState<'5' | '10' | '20'>('10');
  const [trendPeriod, setTrendPeriod] = useState<'7' | '30' | '90'>('30');
  const [volatilityStats, setVolatilityStats] = useState({
    open: { dumpCount: 0, pumpCount: 0, flatCount: 0, averageMagnitude: 0 },
    close: { dumpCount: 0, pumpCount: 0, flatCount: 0, averageMagnitude: 0 }
  });
  const [trendData, setTrendData] = useState({
    predominantBias: 'neutral',
    averageSignalSuccess: 0,
    topPerformingIndicator: 'none',
    topPerformingTimeframe: 'none',
    totalSignals: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadData = () => {
    setIsLoading(true);
    try {
      // Get NYSE volatility data
      const openStats = getNyseVolatilityStats(Number(volatilityPeriod) as 5 | 10 | 20, 'open');
      const closeStats = getNyseVolatilityStats(Number(volatilityPeriod) as 5 | 10 | 20, 'close');
      setVolatilityStats({ open: openStats, close: closeStats });
      
      // Get trend tracking data
      const trends = getTrendTracking(Number(trendPeriod) as 7 | 30 | 90);
      setTrendData(trends);
    } catch (error) {
      console.error('Error loading insights data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount and when periods change
  useEffect(() => {
    loadData();
  }, [volatilityPeriod, trendPeriod]);

  const getBiasIcon = () => {
    switch (trendData.predominantBias) {
      case 'bullish':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Market Insights</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>
          Data-driven insights from historical patterns
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center gap-4 mb-4">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">NYSE Volatility Period</span>
            <Select
              value={volatilityPeriod}
              onValueChange={(value) => setVolatilityPeriod(value as '5' | '10' | '20')}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Days</SelectItem>
                <SelectItem value="10">10 Days</SelectItem>
                <SelectItem value="20">20 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Trend Analysis Period</span>
            <Select
              value={trendPeriod}
              onValueChange={(value) => setTrendPeriod(value as '7' | '30' | '90')}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* NYSE Volatility Section */}
        <div>
          <h3 className="font-medium text-sm mb-2">NYSE Market Volatility</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Market Open Events</span>
                <span className="text-xs font-medium">{volatilityStats.open.dumpCount + volatilityStats.open.pumpCount + volatilityStats.open.flatCount} total</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-center text-xs">
                <div className="bg-red-100 dark:bg-red-900/20 p-1 rounded">
                  <span className="text-red-600 dark:text-red-400 font-medium">{volatilityStats.open.dumpCount}</span>
                  <span className="block text-muted-foreground">Dumps</span>
                </div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">
                  <span className="text-green-600 dark:text-green-400 font-medium">{volatilityStats.open.pumpCount}</span>
                  <span className="block text-muted-foreground">Pumps</span>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded">
                  <span className="font-medium">{volatilityStats.open.flatCount}</span>
                  <span className="block text-muted-foreground">Flat</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Market Close Events</span>
                <span className="text-xs font-medium">{volatilityStats.close.dumpCount + volatilityStats.close.pumpCount + volatilityStats.close.flatCount} total</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-center text-xs">
                <div className="bg-red-100 dark:bg-red-900/20 p-1 rounded">
                  <span className="text-red-600 dark:text-red-400 font-medium">{volatilityStats.close.dumpCount}</span>
                  <span className="block text-muted-foreground">Dumps</span>
                </div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">
                  <span className="text-green-600 dark:text-green-400 font-medium">{volatilityStats.close.pumpCount}</span>
                  <span className="block text-muted-foreground">Pumps</span>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded">
                  <span className="font-medium">{volatilityStats.close.flatCount}</span>
                  <span className="block text-muted-foreground">Flat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trend Analysis Section */}
        <div>
          <h3 className="font-medium text-sm mb-2">Trend Analysis</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-muted">
                {getBiasIcon()}
              </div>
              <div>
                <span className="text-sm font-medium capitalize">
                  {trendData.predominantBias} Market Bias
                </span>
                <span className="block text-xs text-muted-foreground">
                  Based on {trendData.totalSignals} signals over {trendPeriod} days
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span>Signal Success Rate</span>
                <span className="font-medium">{trendData.averageSignalSuccess.toFixed(1)}%</span>
              </div>
              <Progress value={trendData.averageSignalSuccess} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block">Top Indicator</span>
                <span className="font-medium">{trendData.topPerformingIndicator}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Best Timeframe</span>
                <span className="font-medium capitalize">{trendData.topPerformingTimeframe}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <span className="text-xs text-muted-foreground">
          {trendData.totalSignals > 0 
            ? `Analysis based on ${trendData.totalSignals} signals` 
            : 'Collecting data to improve signal accuracy'}
        </span>
      </CardFooter>
    </Card>
  );
};

export default DataInsights;
