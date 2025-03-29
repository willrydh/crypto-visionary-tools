
import { useContext } from 'react';
import { TimeframeContext } from '@/contexts/TimeframeContext';

export const useTimeframe = () => {
  const context = useContext(TimeframeContext);
  
  if (context === undefined) {
    throw new Error('useTimeframe must be used within a TimeframeProvider');
  }
  
  return context;
};
