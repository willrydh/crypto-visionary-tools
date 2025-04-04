
import React, { useEffect } from 'react';
import EnhancedTechnicalAnalysis from '@/components/analysis/EnhancedTechnicalAnalysis';
import { TradeSuggestionCard } from '@/components/analysis/TradeSuggestionCard';
import PriceChart from '@/components/charts/PriceChart';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { useToast } from '@/hooks/use-toast';
import CoinInfo from '@/components/crypto/CoinInfo';
import TradingEducation from '@/components/education/TradingEducation';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { useTradingMode } from '@/hooks/useTradingMode';
import { TradePageHeader } from '@/components/trading/TradePageHeader';
import { useCrypto } from '@/hooks/useCrypto';
import { usePrice } from '@/hooks/usePrice';
import { getModeAlertClass } from '@/components/trading/TradingModeStyles';
import { cn } from '@/lib/utils';

const TradeSuggestion = () => {
  const { toast } = useToast();
  const { tradingMode } = useTradingMode();
  const { selectedCrypto } = useCrypto();
  const { loadPriceData, priceData } = usePrice();
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
      generateAnalysis(selectedCrypto.pairSymbol);
    }
    
    // Load price data for the selected crypto
    const formattedSymbol = selectedCrypto.pairSymbol.replace('/', '');
    if (!priceData[formattedSymbol]) {
      loadPriceData(formattedSymbol);
    }
  }, [selectedCrypto]);
  
  // Refresh analysis when trading mode changes
  useEffect(() => {
    if (!isLoading) {
      generateAnalysis(selectedCrypto.pairSymbol, true);
      
      // Also refresh price data
      const formattedSymbol = selectedCrypto.pairSymbol.replace('/', '');
      loadPriceData(formattedSymbol);
    }
  }, [tradingMode, selectedCrypto]);
  
  // Get current price data for the selected crypto
  const formattedSymbol = selectedCrypto.pairSymbol.replace('/', '');
  const cryptoPriceData = priceData[formattedSymbol] || { price: 68648, change24h: 2.1 };
  
  const handleRefresh = async () => {
    try {
      await generateAnalysis(selectedCrypto.pairSymbol, true);
      
      // Also refresh price data
      await loadPriceData(formattedSymbol);
      
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
  
  // Check if we're on an iOS device
  const isIOS = () => {
    if (typeof window !== 'undefined') {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
             (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    }
    return false;
  };
  
  const iOSClass = isIOS() ? "mt-8" : "mt-2";
  
  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className={cn(`space-y-5 ${iOSClass}`, getModeAlertClass(tradingMode))}>
        <TradePageHeader 
          isLoading={isLoading} 
          onRefresh={handleRefresh} 
        />
        
        <CoinInfo 
          symbol={selectedCrypto.pairSymbol}
          name={selectedCrypto.name}
          price={cryptoPriceData.price}
          change24h={cryptoPriceData.change24h}
          description={selectedCrypto.description}
        />
        
        <div className="space-y-5">
          <div className="w-full overflow-hidden rounded-lg border border-border">
            <PriceChart symbol={selectedCrypto.pairSymbol} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <EnhancedTechnicalAnalysis 
              currentBias={currentBias}
              indicators={indicators}
              confidenceScore={confidenceScore}
              lastUpdated={lastUpdated}
              isLoading={isLoading}
              onRefresh={handleRefresh}
              title="Enhanced TA"
            />
            
            <TradeSuggestionCard 
              tradeSuggestion={tradeSuggestion} 
              isLoading={isLoading} 
            />
          </div>
          
          <div className="mt-6">
            <TradingEducation />
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
};

export default TradeSuggestion;
