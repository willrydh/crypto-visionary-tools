
import React, { createContext, useState, useCallback, ReactNode } from 'react';

export interface PriceLevel {
  price: number;
  type: 'support' | 'resistance';
  strength: 'weak' | 'strong';
  timeframe: string;
}

export interface MarketStructure {
  type: 'uptrend' | 'downtrend' | 'range' | 'accumulation' | 'distribution';
  description: string;
  confidence: number;
}

interface SupportResistanceContextType {
  levels: PriceLevel[];
  structure: MarketStructure | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  fetchLevels: (symbol: string) => Promise<void>;
  updateLevels: (symbol: string) => Promise<void>;
}

export const SupportResistanceContext = createContext<SupportResistanceContextType | undefined>(undefined);

interface SupportResistanceProviderProps {
  children: ReactNode;
}

export const SupportResistanceProvider: React.FC<SupportResistanceProviderProps> = ({ children }) => {
  const [levels, setLevels] = useState<PriceLevel[]>([]);
  const [structure, setStructure] = useState<MarketStructure | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Function to generate realistic support and resistance levels
  const generateRealisticLevels = (currentPrice: number): PriceLevel[] => {
    const levels: PriceLevel[] = [];
    const volatility = currentPrice * 0.01; // 1% volatility for level spacing
    
    // Generate resistance levels (above current price)
    const resistanceLevels = [
      {
        price: currentPrice + (volatility * 1.5),
        type: 'resistance' as const,
        strength: 'weak' as const,
        timeframe: '1h'
      },
      {
        price: currentPrice + (volatility * 3),
        type: 'resistance' as const,
        strength: 'strong' as const,
        timeframe: '4h'
      },
      {
        price: currentPrice + (volatility * 5),
        type: 'resistance' as const,
        strength: 'weak' as const,
        timeframe: '1d'
      }
    ];
    
    // Generate support levels (below current price)
    const supportLevels = [
      {
        price: currentPrice - (volatility * 1.5),
        type: 'support' as const,
        strength: 'weak' as const,
        timeframe: '1h'
      },
      {
        price: currentPrice - (volatility * 3),
        type: 'support' as const,
        strength: 'strong' as const,
        timeframe: '4h'
      },
      {
        price: currentPrice - (volatility * 5),
        type: 'support' as const,
        strength: 'weak' as const,
        timeframe: '1d'
      }
    ];
    
    return [...resistanceLevels, ...supportLevels].sort((a, b) => b.price - a.price);
  };
  
  // Function to determine market structure
  const determineMarketStructure = (price: number): MarketStructure => {
    // In a real app, this would analyze price data
    // For demo, we'll simulate based on the current price
    const priceLastDigit = Math.floor(price) % 10;
    
    if (priceLastDigit >= 7) {
      return {
        type: 'uptrend',
        description: 'Strong Uptrend',
        confidence: 80
      };
    } else if (priceLastDigit >= 5) {
      return {
        type: 'range',
        description: 'Consolidation Range',
        confidence: 65
      };
    } else if (priceLastDigit >= 2) {
      return {
        type: 'downtrend',
        description: 'Bearish Downtrend',
        confidence: 72
      };
    } else {
      return {
        type: 'accumulation',
        description: 'Accumulation Phase',
        confidence: 60
      };
    }
  };
  
  // Fetch support and resistance levels
  const fetchLevels = useCallback(async (symbol: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would call an API
      // For demo, we'll generate random levels
      const currentPrice = 68000 + (Math.random() * 1000);
      const generatedLevels = generateRealisticLevels(currentPrice);
      const marketStructure = determineMarketStructure(currentPrice);
      
      setLevels(generatedLevels);
      setStructure(marketStructure);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error('Error fetching support/resistance levels:', error);
      setError('Failed to load support and resistance levels. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Update existing levels (refresh)
  const updateLevels = useCallback(async (symbol: string) => {
    return fetchLevels(symbol);
  }, [fetchLevels]);
  
  return (
    <SupportResistanceContext.Provider value={{
      levels,
      structure,
      isLoading,
      error,
      lastUpdated,
      fetchLevels,
      updateLevels
    }}>
      {children}
    </SupportResistanceContext.Provider>
  );
};
