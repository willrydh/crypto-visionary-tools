
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
  loadPriceData: (symbol: string) => Promise<void>;
  loadHistoricalData: (symbol: string, interval: string, limit: number) => Promise<any[]>;
  loadHighLowData: (symbol: string) => Promise<void>;
};

export const PriceContext = createContext<PriceContextType | undefined>(undefined);

export const PriceProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [priceData, setPriceData] = useState<PriceData>({});
  const lastUpdatedRef = useRef<{[key: string]: number}>({});
  const minimumUpdateInterval = 1000; // Minimum 1 second between updates per symbol

  // Load current price data with throttling
  const loadPriceData = useCallback(async (symbol: string) => {
    try {
      const now = Date.now();
      const lastUpdated = lastUpdatedRef.current[symbol] || 0;
      
      // Skip if it's been less than minimumUpdateInterval milliseconds since last update
      if (now - lastUpdated < minimumUpdateInterval) {
        return;
      }
      
      // Mark this symbol as being updated now
      lastUpdatedRef.current[symbol] = now;
      
      const data = await fetchCurrentPrice(symbol);
      
      setPriceData(prev => ({
        ...prev,
        [symbol]: {
          ...prev[symbol],
          price: data.price,
          change24h: data.change24h,
          volume24h: data.volume24h,
          timestamp: data.timestamp,
          lastUpdated: data.lastUpdated
        }
      }));
    } catch (error) {
      console.error(`Error loading price data for ${symbol}:`, error);
    }
  }, []);

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
        [symbol]: {
          ...prev[symbol],
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

  return (
    <PriceContext.Provider 
      value={{ 
        priceData, 
        loadPriceData, 
        loadHistoricalData,
        loadHighLowData
      }}
    >
      {children}
    </PriceContext.Provider>
  );
};

