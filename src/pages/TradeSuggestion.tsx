
import React, { useEffect, useState } from 'react';
import EnhancedTechnicalAnalysis from '@/components/analysis/EnhancedTechnicalAnalysis';
import { TradeSuggestionCard } from '@/components/analysis/TradeSuggestionCard';
import { PriceChart } from '@/components/charts/PriceChart';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { useToast } from '@/hooks/use-toast';
import CoinInfo from '@/components/crypto/CoinInfo';
import TradingEducation from '@/components/education/TradingEducation';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { useTradingMode } from '@/hooks/useTradingMode';
import { TradePageHeader } from '@/components/trading/TradePageHeader';

const TradeSuggestion = () => {
  const { toast } = useToast();
  const [currentPrice, setCurrentPrice] = useState(82450);
  const { tradingMode } = useTradingMode();
  const { 
    indicators,
    currentBias,
    confidenceScore,
    tradeSuggestion,
    isLoading,
    lastUpdated,
    generateAnalysis
  } = useTechnicalAnalysis();
  
  useEffect(() => {
    if (indicators.length === 0) {
      generateAnalysis('BTC/USDT');
    }
    
    // Simulate price updates
    const interval = setInterval(() => {
      setCurrentPrice(prev => prev + (Math.random() * 200 - 100));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Refresh analysis when trading mode changes
  useEffect(() => {
    if (!isLoading) {
      generateAnalysis('BTC/USDT', true);
    }
  }, [tradingMode]);
  
  const handleRefresh = async () => {
    try {
      await generateAnalysis('BTC/USDT', true);
      toast({
        title: "Analysis Updated",
        description: `Trade suggestions and technical analysis have been refreshed for ${tradingMode} trading.`,
      });
    } catch (error) {
      console.error('Error refreshing analysis:', error);
      toast({
        title: "Update Failed",
        description: "Could not refresh analysis. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6">
        <TradePageHeader 
          isLoading={isLoading} 
          onRefresh={handleRefresh} 
        />
        
        <CoinInfo 
          symbol="BTC/USDT" 
          price={currentPrice}
          change24h={2.1}
        />
        
        <div className="space-y-6">
          <div className="w-full overflow-hidden rounded-lg border border-border">
            <PriceChart symbol="BTC/USDT" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedTechnicalAnalysis 
              currentBias={currentBias}
              indicators={indicators}
              confidenceScore={confidenceScore}
              lastUpdated={lastUpdated}
              isLoading={isLoading}
              onRefresh={handleRefresh}
            />
            
            <TradeSuggestionCard 
              tradeSuggestion={tradeSuggestion} 
              isLoading={isLoading} 
            />
          </div>
          
          <div className="mt-8">
            <TradingEducation />
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
};

export default TradeSuggestion;
