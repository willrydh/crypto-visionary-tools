
import { useContext } from 'react';
import { TechnicalAnalysisContext } from '@/contexts/TechnicalAnalysisContext';

export const useTechnicalAnalysis = () => {
  const context = useContext(TechnicalAnalysisContext);
  
  if (context === undefined) {
    throw new Error('useTechnicalAnalysis must be used within a TechnicalAnalysisProvider');
  }
  
  return context;
};
