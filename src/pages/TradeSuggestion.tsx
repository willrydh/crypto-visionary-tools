
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedTechnicalAnalysis from '@/components/analysis/EnhancedTechnicalAnalysis';
import { TradeSuggestionCard } from '@/components/analysis/TradeSuggestionCard';
import { PriceChart } from '@/components/charts/PriceChart';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wallet } from 'lucide-react';
import CoinInfo from '@/components/crypto/CoinInfo';
import InitiateTrade from '@/components/trading/InitiateTrade';

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Trade Suggestions</h1>
          <p className="text-muted-foreground">
            Advanced trade analysis and execution
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isLoading} 
          className="gap-2"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh Analysis
        </Button>
      </div>
      
      <CoinInfo 
        symbol="BTC/USDT" 
        price={currentPrice}
        change24h={2.1}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <PriceChart symbol="BTC/USDT" />
          
          <div className="grid grid-cols-1 gap-6">
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
        </div>
        
        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          <InitiateTrade 
            currentPrice={currentPrice}
            tradeSuggestion={tradeSuggestion}
            coinSymbol="BTC/USDT"
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trading Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p className="text-muted-foreground">
                  Recommendations for successful trading:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Always use stop losses to manage risk</li>
                  <li>Never risk more than 1-2% of your portfolio per trade</li>
                  <li>Confirm signals across multiple timeframes</li>
                  <li>Consider fundamental factors alongside technical analysis</li>
                  <li>Track your trades and learn from outcomes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradeSuggestion;
