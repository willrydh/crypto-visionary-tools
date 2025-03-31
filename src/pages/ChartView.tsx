
import React, { useEffect } from 'react';
import { useSupportResistance } from '@/hooks/useSupportResistance';
import { PriceChart } from '@/components/charts/PriceChart';
import { IndicatorBreakdown } from '@/components/analysis/IndicatorBreakdown';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { Button } from '@/components/ui/button';
import { RefreshCw, BarChartHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DataSourceIndicator } from '@/components/ui/data-source-indicator';
import CoinInfo from '@/components/crypto/CoinInfo';
import { Link } from 'react-router-dom';

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
    <div className="space-y-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Chart View</h1>
          <p className="text-muted-foreground">
            Advanced price analysis and indicators
          </p>
        </div>
        
        <div className="flex gap-2 items-center">
          <Link to="/market-dashboard">
            <Button variant="outline" className="gap-2">
              <BarChartHorizontal className="h-4 w-4" />
              Market Dashboard
            </Button>
          </Link>
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
          <div className="hidden md:block">
            <DataSourceIndicator 
              source="Bybit API" 
              isLive={true} 
            />
          </div>
        </div>
      </div>
      
      <CoinInfo 
        symbol="BTC/USDT" 
        price={82500}
        change24h={1.8}
      />
      
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
