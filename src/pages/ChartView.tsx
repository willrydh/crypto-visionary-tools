
import React, { useEffect } from 'react';
import { useSupportResistance } from '@/hooks/useSupportResistance';
import { PriceChart } from '@/components/charts/PriceChart';
import { IndicatorBreakdown } from '@/components/analysis/IndicatorBreakdown';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TradingModeSelector } from '@/components/trading/TradingModeSelector';

const ChartView = () => {
  const { toast } = useToast();
  const { indicators, isLoading, generateAnalysis } = useTechnicalAnalysis();
  const { levels, updateLevels } = useSupportResistance();
  
  useEffect(() => {
    if (indicators.length === 0) {
      generateAnalysis('BTC/USDT');
    }
    updateLevels('BTC/USDT');
  }, []);
  
  const handleRefresh = async () => {
    try {
      await generateAnalysis('BTC/USDT', true);
      await updateLevels('BTC/USDT');
      toast({
        title: "Chart Updated",
        description: "Chart data and indicators have been refreshed.",
      });
    } catch (error) {
      console.error('Error refreshing chart data:', error);
      toast({
        title: "Update Failed",
        description: "Could not refresh chart data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Chart View</h1>
          <p className="text-muted-foreground">
            Advanced price analysis and indicators
          </p>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="md:hidden">
            <TradingModeSelector />
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={isLoading} 
            variant="outline"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          {/* Full-featured price chart with support/resistance levels */}
          <PriceChart showLevels={true} levels={levels} />
        </div>
        
        <div>
          {/* Indicator breakdown showing details of all indicators */}
          <IndicatorBreakdown indicators={indicators} />
        </div>
      </div>
    </div>
  );
};

export default ChartView;
