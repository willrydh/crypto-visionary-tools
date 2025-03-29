import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { fetchMarketSessions } from '@/services/marketService';

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
}

export const MarketsContext = createContext<MarketsContextType | undefined>(undefined);

interface MarketsProviderProps {
  children: ReactNode;
}

export const MarketsProvider: React.FC<MarketsProviderProps> = ({ children }) => {
  const [marketSessions, setMarketSessions] = useState<MarketSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const updateMarketSessions = async () => {
    setIsLoading(true);
    try {
      const sessions = await fetchMarketSessions();
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
        lastUpdated 
      }}
    >
      {children}
    </MarketsContext.Provider>
  );
};
