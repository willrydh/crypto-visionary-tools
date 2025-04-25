
import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { fetchCurrentPrice } from '@/services/priceDataService';

export interface PriceLevel {
  price: number;
  type: 'support' | 'resistance';
  strength: 'weak' | 'strong';
  timeframe?: string;
  touchCount?: number;
  timestamp?: number;
}

export interface MarketStructure {
  type?: 'uptrend' | 'downtrend' | 'range' | 'accumulation' | 'distribution';
  description?: string;
  confidence: number;
  volatility?: 'high' | 'medium' | 'low';
  trend?: string;
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
  
  // Function to generate realistic support and resistance levels based on current price
  const generateRealisticLevels = async (symbol: string): Promise<PriceLevel[]> => {
    try {
      // Fetch the current price from Bybit API
      const priceData = await fetchCurrentPrice(symbol);
      const currentPrice = priceData.price;
      
      // Use more realistic volatility percentage for level spacing
      // For BTC, using smaller percentages to create realistic levels
      const volatility = currentPrice * 0.015; // 1.5% volatility for level spacing
      
      // Generate resistance levels (above current price)
      const resistanceLevels = [
        {
          price: Math.round(currentPrice + (volatility * 1.5)),
          type: 'resistance' as const,
          strength: 'weak' as const,
          timeframe: '1h'
        },
        {
          price: Math.round(currentPrice + (volatility * 3)),
          type: 'resistance' as const,
          strength: 'strong' as const,
          timeframe: '4h'
        },
        {
          price: Math.round(currentPrice + (volatility * 4.5)),
          type: 'resistance' as const,
          strength: 'weak' as const,
          timeframe: '1d'
        }
      ];
      
      // Generate support levels (below current price)
      const supportLevels = [
        {
          price: Math.round(currentPrice - (volatility * 1.5)),
          type: 'support' as const,
          strength: 'weak' as const,
          timeframe: '1h'
        },
        {
          price: Math.round(currentPrice - (volatility * 3)),
          type: 'support' as const,
          strength: 'strong' as const,
          timeframe: '4h'
        },
        {
          price: Math.round(currentPrice - (volatility * 4.5)),
          type: 'support' as const,
          strength: 'weak' as const,
          timeframe: '1d'
        }
      ];
      
      return [...resistanceLevels, ...supportLevels].sort((a, b) => b.price - a.price);
    } catch (error) {
      console.error('Error generating support/resistance levels:', error);
      throw error;
    }
  };
  
  // Function to determine market structure based on current price
  const determineMarketStructure = async (symbol: string): Promise<MarketStructure> => {
    try {
      // Fetch the current price
      const priceData = await fetchCurrentPrice(symbol);
      const price = priceData.price;
      const change24h = priceData.change24h;
      
      // Use 24h change to determine market structure more realistically
      if (change24h > 3) {
        return {
          type: 'uptrend',
          description: 'Strong Uptrend',
          confidence: 80
        };
      } else if (change24h > 1) {
        return {
          type: 'uptrend',
          description: 'Moderate Uptrend',
          confidence: 65
        };
      } else if (change24h > -1 && change24h < 1) {
        return {
          type: 'range',
          description: 'Consolidation Range',
          confidence: 70
        };
      } else if (change24h > -3) {
        return {
          type: 'downtrend',
          description: 'Moderate Downtrend',
          confidence: 65
        };
      } else {
        return {
          type: 'downtrend',
          description: 'Strong Downtrend',
          confidence: 75
        };
      }
    } catch (error) {
      console.error('Error determining market structure:', error);
      return {
        type: 'range',
        description: 'Undetermined',
        confidence: 50
      };
    }
  };
  
  // Fetch support and resistance levels
  const fetchLevels = useCallback(async (symbol: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Normalize the symbol format
      const formattedSymbol = symbol.replace('/', '');
      
      // Generate levels and market structure based on current price from API
      const generatedLevels = await generateRealisticLevels(formattedSymbol);
      const marketStructure = await determineMarketStructure(formattedSymbol);
      
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
