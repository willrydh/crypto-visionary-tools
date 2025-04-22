
import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchCurrentPrice, fetchHistoricalPrices, fetchHighLowData } from '@/services/priceDataService';

type PriceData = {
  [key: string]: {
    price: number;
    change24h: number;
    volume24h?: number;
    timestamp?: number;
    lastUpdated?: Date;
    hourlyHigh?: number;
    hourlyLow?: number;
    dailyHigh?: number;
    dailyLow?: number;
    weeklyHigh?: number;
    weeklyLow?: number;
  }
};

type PriceContextType = {
  priceData: PriceData;
  loadPriceData: (symbol: string) => Promise<any>;
  loadHistoricalData: (symbol: string, interval: string, limit: number) => Promise<any[]>;
  loadHighLowData: (symbol: string) => Promise<void>;
  isLoading: boolean;
};

interface PriceProviderProps {
  children: React.ReactNode;
  refreshInterval?: number;
}

export const PriceContext = createContext<PriceContextType | undefined>(undefined);

export const PriceProvider: React.FC<PriceProviderProps> = ({ children, refreshInterval = 30000 }) => {
  const [priceData, setPriceData] = useState<PriceData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const lastUpdatedRef = useRef<{[key: string]: number}>({});
  const minimumUpdateInterval = 1000; // Minimum 1 second between updates per symbol

  // Load current price data with throttling
  const loadPriceData = useCallback(async (symbol: string) => {
    try {
      const now = Date.now();
      const lastUpdated = lastUpdatedRef.current[symbol] || 0;
      
      // Skip if it's been less than minimumUpdateInterval milliseconds since last update
      if (now - lastUpdated < minimumUpdateInterval) {
        // Return the existing data if available
        return priceData[symbol.replace('/', '')];
      }
      
      // Mark this symbol as being updated now
      lastUpdatedRef.current[symbol] = now;
      setIsLoading(true);
      
      const data = await fetchCurrentPrice(symbol);
      
      setPriceData(prev => ({
        ...prev,
        [symbol.replace('/', '')]: {
          ...prev[symbol.replace('/', '')],
          price: data.price,
          change24h: data.change24h,
          volume24h: data.volume24h,
          timestamp: data.timestamp,
          lastUpdated: data.lastUpdated
        }
      }));
      
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error(`Error loading price data for ${symbol}:`, error);
      setIsLoading(false);
      return null;
    }
  }, [priceData]);

  // Load historical price data
  const loadHistoricalData = useCallback(async (symbol: string, interval: string, limit: number) => {
    try {
      return await fetchHistoricalPrices(symbol, interval, limit);
    } catch (error) {
      console.error(`Error loading historical data for ${symbol}:`, error);
      return [];
    }
  }, []);

  // Load high/low data
  const loadHighLowData = useCallback(async (symbol: string) => {
    try {
      const data = await fetchHighLowData(symbol);
      
      setPriceData(prev => ({
        ...prev,
        [symbol.replace('/', '')]: {
          ...prev[symbol.replace('/', '')],
          hourlyHigh: data.hourlyHigh,
          hourlyLow: data.hourlyLow,
          dailyHigh: data.dailyHigh,
          dailyLow: data.dailyLow,
          weeklyHigh: data.weeklyHigh,
          weeklyLow: data.weeklyLow
        }
      }));
    } catch (error) {
      console.error(`Error loading high/low data for ${symbol}:`, error);
    }
  }, []);

  // Set up auto-refresh for active symbols
  useEffect(() => {
    // This effect handles automatic refresh of price data based on the provided interval
    if (refreshInterval <= 0) return;
    
    const activeSymbols = Object.keys(priceData);
    if (activeSymbols.length === 0) return;
    
    const intervalId = setInterval(() => {
      activeSymbols.forEach(symbol => {
        // For each active symbol, refresh its data
        const formattedSymbol = symbol.includes('/') ? symbol : `${symbol.slice(0, -4)}/${symbol.slice(-4)}`;
        loadPriceData(formattedSymbol);
      });
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [priceData, refreshInterval, loadPriceData]);

  return (
    <PriceContext.Provider 
      value={{ 
        priceData, 
        loadPriceData, 
        loadHistoricalData,
        loadHighLowData,
        isLoading
      }}
    >
      {children}
    </PriceContext.Provider>
  );
};
