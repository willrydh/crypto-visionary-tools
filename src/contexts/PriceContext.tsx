
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { fetchCurrentPrice, fetchHighLowData } from '@/services/priceDataService';

interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: number;
  dailyHigh: number;
  dailyLow: number;
  weeklyHigh: number;
  weeklyLow: number;
  lastUpdated: Date;
}

interface PriceContextType {
  priceData: Record<string, PriceData>;
  loadPriceData: (symbol: string) => Promise<PriceData | undefined>;
  isLoading: boolean;
  lastUpdated: Date | null;
}

export const PriceContext = createContext<PriceContextType | undefined>(undefined);

interface PriceProviderProps {
  children: ReactNode;
  refreshInterval?: number;
}

export const PriceProvider: React.FC<PriceProviderProps> = ({ 
  children, 
  refreshInterval = 30000 
}) => {
  const [priceData, setPriceData] = useState<Record<string, PriceData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load price data for a specific symbol
  const loadPriceData = async (symbol: string): Promise<PriceData | undefined> => {
    const formattedSymbol = symbol.replace('/', '');
    
    setIsLoading(true);
    try {
      console.log(`Loading price data for ${formattedSymbol}`);
      
      // Fetch current price data
      const currentPrice = await fetchCurrentPrice(formattedSymbol);
      
      // Fetch high/low data
      const highLowData = await fetchHighLowData(formattedSymbol);
      
      // Combine the data
      const combinedData: PriceData = {
        symbol: formattedSymbol,
        price: currentPrice.price,
        change24h: currentPrice.change24h,
        volume24h: currentPrice.volume24h,
        timestamp: currentPrice.timestamp,
        dailyHigh: highLowData.dailyHigh,
        dailyLow: highLowData.dailyLow,
        weeklyHigh: highLowData.weeklyHigh,
        weeklyLow: highLowData.weeklyLow,
        lastUpdated: new Date()
      };
      
      // Update state
      setPriceData(prev => ({
        ...prev,
        [formattedSymbol]: combinedData
      }));
      
      setLastUpdated(new Date());
      console.log(`Updated price data for ${formattedSymbol}:`, combinedData);
      
      return combinedData;
    } catch (error) {
      console.error(`Error loading price data for ${formattedSymbol}:`, error);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PriceContext.Provider
      value={{
        priceData,
        loadPriceData,
        isLoading,
        lastUpdated
      }}
    >
      {children}
    </PriceContext.Provider>
  );
};
