
import React, { useState, useEffect } from 'react';
import { TradeSuggestionCard } from '@/components/analysis/TradeSuggestionCard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { TradingModeSelector } from '@/components/trading/TradingModeSelector';
import { useTradingMode } from '@/hooks/useTradingMode';
import { generateTradeSuggestion } from '@/services/priceDataService';
import { useToast } from '@/hooks/use-toast';

// Define the TradeSuggestion type to match the type expected by TradeSuggestionCard
interface TradeSuggestion {
  type: 'buy' | 'sell' | 'wait';
  direction: string;
  entry: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  confidence: number;
  probability: number;
  reasoning: string;
  timeframe: string;
  tradingStyle: 'scalp' | 'day' | 'swing';
  leverage: number;
  summary?: string;
  createdAt: Date;
  // Adding the indicators property required by TradeSuggestionCard
  indicators: any[];
}

const TradeSuggestion = () => {
  const { toast } = useToast();
  const { tradingMode } = useTradingMode();
  const [suggestion, setSuggestion] = useState<TradeSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Get trade suggestion based on current mode
  const getTradeSuggestion = async () => {
    setIsLoading(true);
    try {
      const tradingStyle = tradingMode === 'scalp' ? 'scalp' : (tradingMode === 'day' ? 'day' : 'swing');
      const response = await generateTradeSuggestion('BTC/USDT', tradingStyle);
      
      // Create a complete suggestion object with all required properties
      const suggestionWithData = {
        ...response,
        entryPrice: response.entry || response.entryPrice,
        createdAt: new Date(),
        indicators: [] // Empty array to satisfy the type requirement
      } as TradeSuggestion;
      
      setSuggestion(suggestionWithData);
      
      toast({
        title: "Trade Suggestion Updated",
        description: `New ${tradingStyle} trading suggestion for BTC/USDT has been generated.`,
      });
    } catch (error) {
      console.error('Error generating trade suggestion:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate trade suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate suggestion when trading mode changes
  useEffect(() => {
    getTradeSuggestion();
  }, [tradingMode]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Trade Suggestion</h1>
          <p className="text-muted-foreground">
            AI-generated trade setup based on current market conditions
          </p>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="md:hidden">
            <TradingModeSelector />
          </div>
          <Button
            onClick={getTradeSuggestion}
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
      
      <div className="grid grid-cols-1 gap-6">
        {suggestion ? (
          <TradeSuggestionCard tradeSuggestion={suggestion} isLoading={isLoading} />
        ) : (
          <div className="flex items-center justify-center h-[400px]">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeSuggestion;
