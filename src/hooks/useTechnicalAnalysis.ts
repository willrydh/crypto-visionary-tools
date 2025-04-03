
import { useContext } from 'react';
import { TechnicalAnalysisContext } from '@/contexts/TechnicalAnalysisContext';

export const useTechnicalAnalysis = () => {
  const context = useContext(TechnicalAnalysisContext);
  
  if (context === undefined) {
    throw new Error('useTechnicalAnalysis must be used within a TechnicalAnalysisProvider');
  }
  
  // Always ensure we return valid data with fallbacks
  return {
    ...context,
    indicators: context.indicators || [],
    currentBias: context.currentBias || 'neutral',
    confidenceScore: context.confidenceScore || 0,
    tradeSuggestion: context.tradeSuggestion || null,
    lastUpdated: context.lastUpdated || null
  };
};
