
import React, { useEffect, useState } from 'react';
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
import { fetchCurrentPrice } from '@/services/priceDataService';
import { useCrypto } from '@/hooks/useCrypto';

const TradeSuggestion = () => {
  const { toast } = useToast();
  const [currentPrice, setCurrentPrice] = useState<number>(68648);
  const [priceChange, setPriceChange] = useState<number>(2.1);
  const { tradingMode } = useTradingMode();
  const { selectedCrypto } = useCrypto();
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
    
    // Fetch real price
    const fetchPrice = async () => {
      try {
        const priceData = await fetchCurrentPrice(selectedCrypto.pairSymbol.replace('/', ''));
        if (priceData) {
          setCurrentPrice(priceData.price);
          setPriceChange(priceData.change24h);
        }
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };
    
    fetchPrice();
    
    const priceInterval = setInterval(fetchPrice, 30000);
    
    return () => {
      clearInterval(priceInterval);
    };
  }, [selectedCrypto]);
  
  // Refresh analysis when trading mode changes
  useEffect(() => {
    if (!isLoading) {
      generateAnalysis(selectedCrypto.pairSymbol, true);
    }
  }, [tradingMode, selectedCrypto]);
  
  const handleRefresh = async () => {
    try {
      await generateAnalysis(selectedCrypto.pairSymbol, true);
      
      // Also refresh price
      try {
        const priceData = await fetchCurrentPrice(selectedCrypto.pairSymbol.replace('/', ''));
        if (priceData) {
          setCurrentPrice(priceData.price);
          setPriceChange(priceData.change24h);
        }
      } catch (error) {
        console.error('Error refreshing price:', error);
      }
      
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
          symbol={selectedCrypto.pairSymbol}
          name={selectedCrypto.name}
          price={currentPrice}
          change24h={priceChange}
          description={selectedCrypto.description}
        />
        
        <div className="space-y-6">
          <div className="w-full overflow-hidden rounded-lg border border-border">
            <PriceChart symbol={selectedCrypto.pairSymbol} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          
          <div className="mt-8">
            <TradingEducation />
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
};

export default TradeSuggestion;
