
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { fetchCurrentPrice, fetchHighLowData } from '@/services/priceDataService';
import { useCrypto } from '@/hooks/useCrypto';
import { toast } from "@/components/ui/use-toast";

interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: number;
  hourlyHigh: number;
  hourlyLow: number;
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
  refreshInterval = 10000 // 10 seconds to reduce jumping (changed from 5000)
}) => {
  const [priceData, setPriceData] = useState<Record<string, PriceData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const loadPriceData = async (symbol: string): Promise<PriceData | undefined> => {
    const formattedSymbol = symbol.replace('/', '');
    
    setIsLoading(true);
    try {
      console.log(`Loading price data for ${formattedSymbol}`);
      
      const currentPrice = await fetchCurrentPrice(formattedSymbol);
      
      const highLowData = await fetchHighLowData(formattedSymbol);
      
      const combinedData: PriceData = {
        symbol: formattedSymbol,
        price: currentPrice.price,
        change24h: currentPrice.change24h,
        volume24h: currentPrice.volume24h,
        timestamp: currentPrice.timestamp,
        hourlyHigh: highLowData.hourlyHigh,
        hourlyLow: highLowData.hourlyLow,
        dailyHigh: highLowData.dailyHigh,
        dailyLow: highLowData.dailyLow,
        weeklyHigh: highLowData.weeklyHigh,
        weeklyLow: highLowData.weeklyLow,
        lastUpdated: new Date()
      };
      
      setPriceData(prev => ({
        ...prev,
        [formattedSymbol]: combinedData
      }));
      
      setLastUpdated(new Date());
      console.log(`Updated price data for ${formattedSymbol}:`, combinedData);
      
      return combinedData;
    } catch (error) {
      console.error(`Error loading price data for ${formattedSymbol}:`, error);
      setError(error as Error);
      
      toast({
        title: "Error loading price data",
        description: `Could not load price data for ${symbol}. ${(error as Error).message}`,
        variant: "destructive",
      });
      
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          loadPriceData('BTC/USDT'),
          loadPriceData('ETH/USDT'),
          loadPriceData('SOL/USDT')
        ]);
      } catch (error) {
        console.error('Error loading initial price data:', error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
    
    const intervalId = setInterval(() => {
      console.log("Refreshing price data at interval:", new Date().toISOString());
      Object.keys(priceData).forEach(symbol => {
        const apiSymbol = symbol.includes('/') ? symbol : symbol + '/USDT';
        loadPriceData(apiSymbol);
      });
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

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
