
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { fetchSupportResistanceLevels } from '@/services/priceAnalysisService';
import { useTimeframe } from '@/hooks/useTimeframe';

export interface PriceLevel {
  price: number;
  type: 'support' | 'resistance';
  strength: 'weak' | 'medium' | 'strong';
  timeframe: string;
  source: 'pivot' | 'swing' | 'volume' | 'historical';
  description?: string;
}

export interface MarketStructure {
  trend: 'uptrend' | 'downtrend' | 'range';
  description: string;
  hh?: number; // Higher high
  lh?: number; // Lower high
  hl?: number; // Higher low
  ll?: number; // Lower low
  timeframe: string;
}

interface SupportResistanceContextType {
  levels: PriceLevel[];
  marketStructure: MarketStructure | null;
  structure: MarketStructure | null; // Alias for marketStructure to maintain compatibility
  isLoading: boolean;
  updateLevels: (symbol: string) => Promise<void>;
  fetchLevels: (symbol: string) => Promise<void>; // Alias for updateLevels to maintain compatibility
  lastUpdated: Date | null;
}

export const SupportResistanceContext = createContext<SupportResistanceContextType | undefined>(undefined);

interface SupportResistanceProviderProps {
  children: ReactNode;
}

export const SupportResistanceProvider: React.FC<SupportResistanceProviderProps> = ({ children }) => {
  const { currentTimeframe } = useTimeframe();
  const [levels, setLevels] = useState<PriceLevel[]>([]);
  const [marketStructure, setMarketStructure] = useState<MarketStructure | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const updateLevels = async (symbol: string) => {
    setIsLoading(true);
    try {
      const { levels, structure } = await fetchSupportResistanceLevels(symbol, currentTimeframe);
      setLevels(levels);
      setMarketStructure(structure);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching support/resistance levels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update when timeframe changes
  useEffect(() => {
    if (lastUpdated) {
      updateLevels('BTC/USDT');
    }
  }, [currentTimeframe]);

  return (
    <SupportResistanceContext.Provider 
      value={{ 
        levels, 
        marketStructure,
        structure: marketStructure, // Add structure as an alias to marketStructure
        isLoading, 
        updateLevels, 
        fetchLevels: updateLevels, // Add fetchLevels as an alias to updateLevels
        lastUpdated 
      }}
    >
      {children}
    </SupportResistanceContext.Provider>
  );
};
