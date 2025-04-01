
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { fetchMarketSessions } from '@/services/marketService';
import { fetchAlphaVantageMarketSessions } from '@/services/alphaVantageService';

export interface MarketSession {
  name: string;
  status: 'open' | 'closed' | 'opening-soon';
  hours: string;
  nextEvent: {
    type: 'open' | 'close';
    time: Date;
  };
  timezone: string;
}

interface MarketsContextType {
  marketSessions: MarketSession[];
  isLoading: boolean;
  updateMarketSessions: () => Promise<void>;
  lastUpdated: Date | null;
  dataSource: 'alpha-vantage' | 'internal';
}

export const MarketsContext = createContext<MarketsContextType | undefined>(undefined);

interface MarketsProviderProps {
  children: ReactNode;
}

export const MarketsProvider: React.FC<MarketsProviderProps> = ({ children }) => {
  const [marketSessions, setMarketSessions] = useState<MarketSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<'alpha-vantage' | 'internal'>('alpha-vantage');

  const updateMarketSessions = async () => {
    setIsLoading(true);
    try {
      // Try Alpha Vantage first
      let sessions;
      try {
        sessions = await fetchAlphaVantageMarketSessions();
        setDataSource('alpha-vantage');
      } catch (avError) {
        console.error('Alpha Vantage error, falling back to internal data:', avError);
        sessions = await fetchMarketSessions();
        setDataSource('internal');
      }
      
      setMarketSessions(sessions);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching market sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and periodic update
  useEffect(() => {
    updateMarketSessions();
    
    // Update every minute to keep session statuses current
    const interval = setInterval(() => {
      updateMarketSessions();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <MarketsContext.Provider 
      value={{ 
        marketSessions, 
        isLoading, 
        updateMarketSessions, 
        lastUpdated,
        dataSource 
      }}
    >
      {children}
    </MarketsContext.Provider>
  );
};
