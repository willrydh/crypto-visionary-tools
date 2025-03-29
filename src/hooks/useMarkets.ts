
import { useContext } from 'react';
import { MarketsContext } from '@/contexts/MarketsContext';

export const useMarkets = () => {
  const context = useContext(MarketsContext);
  
  if (context === undefined) {
    throw new Error('useMarkets must be used within a MarketsProvider');
  }
  
  return context;
};
