
import React, { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { LineChart, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { useTradingMode } from '@/hooks/useTradingMode';
import { TechnicalAnalysisSummary } from '@/components/analysis/TechnicalAnalysisSummary';
import { TradeSuggestionCard } from '@/components/analysis/TradeSuggestionCard';
import { MarketStatus } from '@/components/markets/MarketStatus';
import { PriceThermometer } from '@/components/charts/PriceThermometer';
import { PriceChart } from '@/components/charts/PriceChart';
import { ImprovedEconomicCalendar } from '@/components/calendar/ImprovedEconomicCalendar';

const Dashboard = () => {
  const { toast } = useToast();
  const { tradingMode } = useTradingMode();
  const { 
    indicators, 
    currentBias, 
    tradeSuggestion, 
    confidenceScore, 
    isLoading, 
    lastUpdated, 
    generateAnalysis 
  } = useTechnicalAnalysis();

  // Generate analysis when trading mode changes
  useEffect(() => {
    if (indicators.length === 0) {
      generateAnalysis('BTC/USDT');
    }
  }, [tradingMode, indicators.length, generateAnalysis]);

  const handleAnalysisGeneration = async () => {
    try {
      await generateAnalysis('BTC/USDT', true);
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
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Market overview and trading signals
          </p>
        </div>
      <div className="w-full">
  <Button 
    onClick={handleAnalysisGeneration} 
    disabled={isLoading} 
    className="w-full sm:w-auto gap-2"
  >
    {isLoading ? (
      <LineChart className="h-4 w-4 animate-pulse" />
    ) : (
      <LineChart className="h-4 w-4" />
    )}
    Generate Analysis
  </Button>
</div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content - 2/3 width */}
        <div className="md:col-span-2 space-y-6">
          {/* Price chart */}
          <div className="max-w-full overflow-hidden">
            <PriceChart />
          </div>
          
          {/* Analysis cards - 2 columns on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TechnicalAnalysisSummary 
              currentBias={currentBias}
              indicators={indicators}
              confidenceScore={confidenceScore}
              lastUpdated={lastUpdated}
              isLoading={isLoading}
              onRefresh={handleAnalysisGeneration}
            />
            
            <TradeSuggestionCard 
              tradeSuggestion={tradeSuggestion} 
              isLoading={isLoading} 
            />
          </div>
        </div>
        
        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Market status card */}
          <MarketStatus />
          
          {/* Price thermometer */}
          <PriceThermometer />
          
          {/* Economic calendar (improved version) */}
          <ImprovedEconomicCalendar compact={true} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
