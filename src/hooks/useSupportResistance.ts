
import { useContext } from 'react';
import { SupportResistanceContext } from '@/contexts/SupportResistanceContext';

export const useSupportResistance = () => {
  const context = useContext(SupportResistanceContext);
  
  if (context === undefined) {
    throw new Error('useSupportResistance must be used within a SupportResistanceProvider');
  }
  
  return context;
};
