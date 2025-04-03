
import { useContext } from 'react';
import { TechnicalAnalysisContext } from '@/contexts/TechnicalAnalysisContext';

export const useTechnicalAnalysis = () => {
  const context = useContext(TechnicalAnalysisContext);
  
  if (context === undefined) {
    throw new Error('useTechnicalAnalysis must be used within a TechnicalAnalysisProvider');
  }
  
  // Make sure we always return a valid indicators array
  return {
    ...context,
    indicators: context.indicators || []
  };
};
