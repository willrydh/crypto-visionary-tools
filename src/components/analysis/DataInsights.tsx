
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, TrendingUp, TrendingDown, Minus, LineChart } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { fetchMarketTrends, fetchVolatilityEvents } from '@/services/dataLoggingService';
import { useToast } from '@/hooks/use-toast';

const DataInsights = () => {
  const { toast } = useToast();
  const [volatilityPeriod, setVolatilityPeriod] = useState('10');
  const [trendPeriod, setTrendPeriod] = useState('30');
  const [isLoading, setIsLoading] = useState(false);
  
  // Market volatility data - this would be fetched from API in a real app
  const [marketData, setMarketData] = useState({
    openEvents: {
      dumps: 3,
      pumps: 5,
      flat: 2,
      total: 10
    },
    closeEvents: {
      dumps: 4,
      pumps: 4,
      flat: 2,
      total: 10
    },
    trendAnalysis: {
      bias: 'Neutral Market Bias',
      signals: 12,
      period: 30,
      successRate: 58.5,
      topIndicator: 'MACD',
      bestTimeframe: '4h'
    }
  });
  
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, these would fetch actual data from the backend
      const volatilityData = await fetchVolatilityEvents(parseInt(volatilityPeriod));
      const trendData = await fetchMarketTrends(parseInt(trendPeriod));
      
      setMarketData({
        openEvents: volatilityData.openEvents,
        closeEvents: volatilityData.closeEvents,
        trendAnalysis: trendData
      });
      
      toast({
        title: "Data Refreshed",
        description: "Market insights have been updated with the latest data."
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Refresh Failed",
        description: "Could not update market insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const EventBox = ({ type, count, total }: { type: 'pumps' | 'dumps' | 'flat', count: number, total: number }) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    
    const getColors = () => {
      switch(type) {
        case 'pumps': return {
          bg: 'bg-green-500/10',
          text: 'text-green-500',
          border: 'border-green-500/30',
          progress: 'bg-green-500'
        };
        case 'dumps': return {
          bg: 'bg-red-500/10',
          text: 'text-red-500',
          border: 'border-red-500/30',
          progress: 'bg-red-500'
        };
        case 'flat': return {
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-500',
          border: 'border-yellow-500/30',
          progress: 'bg-yellow-500'
        };
      }
    };
    
    const colors = getColors();
    
    const getIcon = () => {
      switch(type) {
        case 'pumps': return <TrendingUp className="h-3.5 w-3.5" />;
        case 'dumps': return <TrendingDown className="h-3.5 w-3.5" />;
        case 'flat': return <Minus className="h-3.5 w-3.5" />;
      }
    };
    
    return (
      <div className={`rounded-lg ${colors.bg} ${colors.text} ${colors.border} border p-3`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {getIcon()}
            <span className="capitalize text-sm font-medium">{type}</span>
          </div>
          <span className="text-sm font-bold">{count}/{total}</span>
        </div>
        <Progress 
          value={percentage} 
          className={`h-1.5 ${colors.progress} [&>div]:${colors.progress}`}
        />
        <div className="mt-1 text-xs text-right font-mono">{percentage}%</div>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Market Insights</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">NYSE Volatility Period</h3>
              <Select 
                value={volatilityPeriod}
                onValueChange={setVolatilityPeriod}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Days</SelectItem>
                  <SelectItem value="10">10 Days</SelectItem>
                  <SelectItem value="20">20 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Market Open Events: {marketData.openEvents.total} total</div>
                <div className="grid grid-cols-3 gap-2">
                  <EventBox type="dumps" count={marketData.openEvents.dumps} total={marketData.openEvents.total} />
                  <EventBox type="pumps" count={marketData.openEvents.pumps} total={marketData.openEvents.total} />
                  <EventBox type="flat" count={marketData.openEvents.flat} total={marketData.openEvents.total} />
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-2">Market Close Events: {marketData.closeEvents.total} total</div>
                <div className="grid grid-cols-3 gap-2">
                  <EventBox type="dumps" count={marketData.closeEvents.dumps} total={marketData.closeEvents.total} />
                  <EventBox type="pumps" count={marketData.closeEvents.pumps} total={marketData.closeEvents.total} />
                  <EventBox type="flat" count={marketData.closeEvents.flat} total={marketData.closeEvents.total} />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Trend Analysis Period</h3>
              <Select 
                value={trendPeriod}
                onValueChange={setTrendPeriod}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 bg-muted/30 rounded-md p-3">
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                <div className="font-medium">{marketData.trendAnalysis.bias}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                Based on {marketData.trendAnalysis.signals} signals over {marketData.trendAnalysis.period} days
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Signal Success Rate</div>
                  <div className="font-medium">{marketData.trendAnalysis.successRate}%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Top Indicator</div>
                  <div className="font-medium">{marketData.trendAnalysis.topIndicator}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Best Timeframe</div>
                  <div className="font-medium">{marketData.trendAnalysis.bestTimeframe}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground text-center pt-2">
            Collecting data to improve signal accuracy
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataInsights;
