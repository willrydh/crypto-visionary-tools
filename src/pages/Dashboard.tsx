
import React, { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { LineChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { useTradingMode } from '@/hooks/useTradingMode';
import EnhancedTechnicalAnalysis from '@/components/analysis/EnhancedTechnicalAnalysis';
import { MarketStatus } from '@/components/markets/MarketStatus';
import { PriceThermometer } from '@/components/charts/PriceThermometer';
import { PriceChart } from '@/components/charts/PriceChart';
import { ImprovedEconomicCalendar } from '@/components/calendar/ImprovedEconomicCalendar';
import CoinInfo from '@/components/crypto/CoinInfo';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import { Card } from '@/components/ui/card';

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

  // Description based on trading mode
  const getTradingDescription = () => {
    switch (tradingMode) {
      case 'scalp':
        return "Ultra-short term market overview for scalping opportunities";
      case 'day':
        return "Intraday market analysis and day trading signals";
      case 'night':
        return "Overnight market overview and medium-term signals";
      default:
        return "Market overview and trading signals";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <WelcomeHeader />
      
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          {getTradingDescription()}
        </p>
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
