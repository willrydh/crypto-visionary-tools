
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedTechnicalAnalysis from '@/components/analysis/EnhancedTechnicalAnalysis';
import { TradeSuggestionCard } from '@/components/analysis/TradeSuggestionCard';
import { PriceChart } from '@/components/charts/PriceChart';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import CoinInfo from '@/components/crypto/CoinInfo';
import TradingEducation from '@/components/education/TradingEducation';
import { TradingModeSelector } from '@/components/trading/TradingModeSelector';

const TradeSuggestion = () => {
  const { toast } = useToast();
  const [currentPrice, setCurrentPrice] = useState(82450);
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
  
  const handleRefresh = async () => {
    try {
      await generateAnalysis('BTC/USDT', true);
      toast({
        title: "Analysis Updated",
        description: "Trade suggestions and technical analysis have been refreshed.",
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
    <div className="space-y-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Trade Suggestions</h1>
          <p className="text-muted-foreground">
            Advanced trade analysis and execution
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-full md:w-72">
            <TradingModeSelector />
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={isLoading} 
            size="icon"
            className="h-10 w-10 flex-shrink-0"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
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
        
        <div>
          <TradingEducation />
        </div>
      </div>
    </div>
  );
};

export default TradeSuggestion;
