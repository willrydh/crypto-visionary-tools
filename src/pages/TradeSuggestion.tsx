
import React, { useState, useEffect } from 'react';
import { TradeSuggestionCard } from '@/components/analysis/TradeSuggestionCard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { TradingModeSelector } from '@/components/trading/TradingModeSelector';
import { useTradingMode } from '@/hooks/useTradingMode';
import { generateTradeSuggestion } from '@/services/analysisService';
import { useToast } from '@/hooks/use-toast';
import DataInsights from '@/components/analysis/DataInsights';
import { logTradingSignal } from '@/services/dataLoggingService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define our own complete type that includes all properties we need
interface TradeSuggestionType {
  direction: 'long' | 'short' | 'neutral';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  probability: number;
  confidence: number;
  timeframe: string;
  indicators: any[];
  summary: string;
  createdAt: Date;
}

const TradeSuggestion = () => {
  const { toast } = useToast();
  const { tradingMode } = useTradingMode();
  const [suggestion, setSuggestion] = useState<TradeSuggestionType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("BTCUSDT");
  
  // Available symbols
  const availableSymbols = [
    { value: "BTCUSDT", label: "Bitcoin (BTC/USDT)" },
    { value: "ETHUSDT", label: "Ethereum (ETH/USDT)" },
    { value: "SOLUSDT", label: "Solana (SOL/USDT)" },
    { value: "BNBUSDT", label: "Binance Coin (BNB/USDT)" },
  ];
  
  // Get trade suggestion based on current mode
  const getTradeSuggestion = async () => {
    setIsLoading(true);
    try {
      // Get trading bias from trading mode
      const tradingBias = tradingMode === 'scalp' ? 'neutral' : tradingMode === 'day' ? 'bullish' : 'bearish';
      const response = await generateTradeSuggestion(selectedSymbol, [], tradingBias, tradingMode);
      
      // Create a complete suggestion object with all required properties
      const suggestionWithData: TradeSuggestionType = {
        direction: response.direction as 'long' | 'short' | 'neutral',
        entry: response.entry,
        stopLoss: response.stopLoss,
        takeProfit: response.takeProfit,
        probability: response.probability || 50,
        confidence: response.confidence || 50,
        timeframe: response.timeframe || '1h',
        indicators: response.indicators || [],
        summary: response.summary || 'Suggestion based on current market conditions',
        createdAt: new Date()
      };
      
      setSuggestion(suggestionWithData);
      
      // Log the trading signal
      const triggeredIndicators = suggestionWithData.indicators.map(i => i.name.toLowerCase());
      logTradingSignal(
        suggestionWithData.direction,
        suggestionWithData.entry,
        suggestionWithData.stopLoss,
        suggestionWithData.takeProfit,
        tradingMode,
        triggeredIndicators,
        selectedSymbol
      );
      
      toast({
        title: "Trade Suggestion Updated",
        description: `New trading suggestion for ${selectedSymbol} has been generated.`,
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
        
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <Select
              value={selectedSymbol}
              onValueChange={(value) => setSelectedSymbol(value)}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select symbol" />
              </SelectTrigger>
              <SelectContent>
                {availableSymbols.map((symbol) => (
                  <SelectItem key={symbol.value} value={symbol.value}>
                    {symbol.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:hidden w-full">
            <TradingModeSelector />
          </div>
          
          <Button
            onClick={getTradeSuggestion}
            disabled={isLoading}
            variant="outline"
            className="w-full sm:w-auto"
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {suggestion ? (
            <TradeSuggestionCard tradeSuggestion={suggestion} isLoading={isLoading} />
          ) : (
            <div className="flex items-center justify-center h-[400px] rounded-lg border border-border bg-card">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        
        <div>
          <DataInsights />
        </div>
      </div>
    </div>
  );
};

export default TradeSuggestion;
