
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useTradingMode } from '@/hooks/useTradingMode';
import { fetchTechnicalIndicators, generateTradeSuggestion } from '@/services/analysisService';

export type MarketBias = 'bullish' | 'bearish' | 'neutral';

export interface TechnicalIndicator {
  name: string;
  value: number | string;
  signal: 'bullish' | 'bearish' | 'neutral';
  timeframe: string;
  category: 'trend' | 'momentum' | 'volume' | 'volatility';
  description?: string;
}

export interface TradeSuggestion {
  direction: 'long' | 'short' | 'neutral';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  probability: number;
  confidence: number;
  timeframe: string;
  indicators: TechnicalIndicator[];
  summary: string;
  createdAt: Date;
}

interface TechnicalAnalysisContextType {
  indicators: TechnicalIndicator[];
  currentBias: MarketBias;
  tradeSuggestion: TradeSuggestion | null;
  confidenceScore: number;
  isLoading: boolean;
  lastUpdated: Date | null;
  generateAnalysis: (symbol: string, force?: boolean) => Promise<void>;
}

export const TechnicalAnalysisContext = createContext<TechnicalAnalysisContextType | undefined>(undefined);

interface TechnicalAnalysisProviderProps {
  children: ReactNode;
}

export const TechnicalAnalysisProvider: React.FC<TechnicalAnalysisProviderProps> = ({ children }) => {
  const { tradingMode, getTimeframes, getIndicators } = useTradingMode();
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([]);
  const [currentBias, setCurrentBias] = useState<MarketBias>('neutral');
  const [tradeSuggestion, setTradeSuggestion] = useState<TradeSuggestion | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [biasLocked, setBiasLocked] = useState<boolean>(false);

  // Generate technical analysis for the selected symbol and trading mode
  const generateAnalysis = async (symbol: string, force: boolean = false) => {
    setIsLoading(true);
    try {
      // Fetch indicators based on current trading mode
      const timeframes = getTimeframes();
      const indicatorTypes = getIndicators();
      
      console.log(`Generating analysis for ${symbol} with mode ${tradingMode}`);
      console.log(`Timeframes: ${timeframes.join(', ')}`);
      console.log(`Indicator types: ${indicatorTypes.join(', ')}`);
      
      // This would normally call a real API
      const fetchedIndicators = await fetchTechnicalIndicators(
        symbol, 
        timeframes, 
        indicatorTypes
      );
      
      console.log(`Fetched ${fetchedIndicators ? fetchedIndicators.length : 0} indicators`);
      
      // Ensure we have indicators before setting them
      if (fetchedIndicators && fetchedIndicators.length > 0) {
        // Set indicators first
        setIndicators(fetchedIndicators);
        
        // Determine market bias based on indicators
        let updatedBias = currentBias;
        
        // Only change bias if it's not locked or if force = true
        if (!biasLocked || force) {
          updatedBias = calculateMarketBias(fetchedIndicators);
          setCurrentBias(updatedBias);
          setBiasLocked(true);
        }
        
        console.log(`Calculated market bias: ${updatedBias}`);
        
        // Make sure we have a valid bias before generating the suggestion
        if (updatedBias) {
          // Now generate trade suggestion using the updated bias
          const suggestion = await generateTradeSuggestion(
            symbol, 
            fetchedIndicators, 
            updatedBias, // Use the updated bias here
            tradingMode
          );
          
          console.log(`Generated trade suggestion: ${suggestion ? suggestion.direction : 'none'}`);
          
          // Update trade suggestion and related state
          setTradeSuggestion(suggestion);
          setConfidenceScore(suggestion.confidence);
          setLastUpdated(new Date());
        } else {
          console.error('Invalid market bias detected');
        }
      } else {
        // If no indicators were returned, log an error
        console.error('No indicators returned from fetchTechnicalIndicators');
      }
    } catch (error) {
      console.error('Error generating analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate market bias based on indicators
  const calculateMarketBias = (indicators: TechnicalIndicator[]): MarketBias => {
    if (!indicators || indicators.length === 0) {
      console.warn('No indicators provided to calculateMarketBias');
      return 'neutral';
    }
    
    let bullishCount = 0;
    let bearishCount = 0;
    let totalCount = 0;
    
    // Count bullish and bearish signals
    indicators.forEach(indicator => {
      if (indicator.signal === 'bullish') bullishCount++;
      if (indicator.signal === 'bearish') bearishCount++;
      totalCount++;
    });
    
    // Calculate percentage
    const bullishPercentage = (bullishCount / totalCount) * 100;
    const bearishPercentage = (bearishCount / totalCount) * 100;
    
    console.log(`Bias calculation: Bullish ${bullishPercentage.toFixed(1)}%, Bearish ${bearishPercentage.toFixed(1)}%`);
    
    // Determine bias
    if (bullishPercentage >= 60) return 'bullish';
    if (bearishPercentage >= 60) return 'bearish';
    return 'neutral';
  };

  // Reset bias lock when trading mode changes
  useEffect(() => {
    setBiasLocked(false);
  }, [tradingMode]);

  return (
    <TechnicalAnalysisContext.Provider 
      value={{ 
        indicators, 
        currentBias, 
        tradeSuggestion, 
        confidenceScore, 
        isLoading, 
        lastUpdated, 
        generateAnalysis 
      }}
    >
      {children}
    </TechnicalAnalysisContext.Provider>
  );
};
