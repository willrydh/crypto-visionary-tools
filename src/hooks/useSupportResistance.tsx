
import { useContext, useCallback } from 'react';
import { SupportResistanceContext } from '@/contexts/SupportResistanceContext';

export const useSupportResistance = () => {
  const context = useContext(SupportResistanceContext);
  
  if (!context) {
    throw new Error('useSupportResistance must be used within a SupportResistanceProvider');
  }
  
  const { levels, structure, isLoading, error, lastUpdated, fetchLevels, updateLevels } = context;
  
  // Create a stabilized version of fetchLevels with the same signature
  const fetchLevelsStable = useCallback((symbol: string) => {
    return fetchLevels(symbol);
  }, [fetchLevels]);
  
  // Create a stabilized version of updateLevels with the same signature
  const updateLevelsStable = useCallback((symbol: string) => {
    return updateLevels(symbol);
  }, [updateLevels]);
  
  return {
    levels,
    structure,
    isLoading,
    error,
    lastUpdated,
    fetchLevels: fetchLevelsStable,
    updateLevels: updateLevelsStable
  };
};
