
import React, { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { LineChart, Cloud, BarChartHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { useTradingMode } from '@/hooks/useTradingMode';
import EnhancedTechnicalAnalysis from '@/components/analysis/EnhancedTechnicalAnalysis';
import { MarketStatus } from '@/components/markets/MarketStatus';
import { PriceThermometer } from '@/components/charts/PriceThermometer';
import { PriceChart } from '@/components/charts/PriceChart';
import { ImprovedEconomicCalendar } from '@/components/calendar/ImprovedEconomicCalendar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CoinInfo from '@/components/crypto/CoinInfo';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { toast } = useToast();
  const { tradingMode } = useTradingMode();
  const { 
    indicators, 
    currentBias, 
    confidenceScore, 
    isLoading, 
    lastUpdated, 
    generateAnalysis 
  } = useTechnicalAnalysis();

  // Generate analysis when trading mode changes
  useEffect(() => {
    if (indicators.length === 0) {
      generateAnalysis('BTCUSDT');
    }
  }, [tradingMode, indicators.length, generateAnalysis]);

  const handleAnalysisGeneration = async () => {
    try {
      await generateAnalysis('BTCUSDT', true);
      toast({
        title: "Analysis Complete",
        description: "Technical analysis has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not generate technical analysis. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <WelcomeHeader />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Market overview and trading signals
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/market-dashboard">
            <Button 
              variant="outline" 
              className={cn(
                "gap-2 backdrop-blur-sm bg-card/30 border-border/50",
                "hover:bg-primary/10 transition-all duration-200"
              )}
            >
              <Cloud className="h-4 w-4" />
              Forecast
            </Button>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleAnalysisGeneration} 
                  disabled={isLoading} 
                  className="gap-2"
                >
                  {isLoading ? (
                    <LineChart className="h-4 w-4 animate-pulse" />
                  ) : (
                    <LineChart className="h-4 w-4" />
                  )}
                  Generate Analysis
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Data Source: Bybit API</p>
                <div className="flex items-center mt-1">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-xs">Live data</span>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <CoinInfo 
        symbol="BTC/USDT" 
        price={82500}
        change24h={2.3}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="max-w-full overflow-hidden rounded-lg border border-border">
           <PriceChart symbol="BTC/USDT" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EnhancedTechnicalAnalysis 
              currentBias={currentBias}
              indicators={indicators}
              confidenceScore={confidenceScore}
              lastUpdated={lastUpdated}
              isLoading={isLoading}
              onRefresh={handleAnalysisGeneration}
            />
            
            <MarketStatus showDetails={true} />
          </div>
        </div>
        
        <div className="space-y-6">
          <PriceThermometer />
          
          <div className="hidden lg:block">
            <div className="import">
              {(() => {
                const DataInsights = React.lazy(() => import('@/components/analysis/DataInsights'));
                return (
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <DataInsights />
                  </React.Suspense>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-span-full w-full">
        <ImprovedEconomicCalendar compact={true} />
      </div>
    </div>
  );
};

export default Dashboard;
