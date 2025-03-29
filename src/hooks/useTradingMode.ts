
import { useContext } from 'react';
import { TradingModeContext } from '@/contexts/TradingModeContext';

export const useTradingMode = () => {
  const context = useContext(TradingModeContext);
  
  if (context === undefined) {
    throw new Error('useTradingMode must be used within a TradingModeProvider');
  }
  
  return context;
};
