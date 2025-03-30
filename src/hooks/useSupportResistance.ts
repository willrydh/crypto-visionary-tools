
import { useContext, useCallback, useState, useEffect } from 'react';
import { SupportResistanceContext } from '@/contexts/SupportResistanceContext';
import { useToast } from '@/hooks/use-toast';

export const useSupportResistance = () => {
  const context = useContext(SupportResistanceContext);
  const { toast } = useToast();
  const [isRetrying, setIsRetrying] = useState(false);
  
  if (!context) {
    throw new Error('useSupportResistance must be used within a SupportResistanceProvider');
  }
  
  // Add a retry function in case the initial fetch fails
  const retryFetch = useCallback(async (symbol: string) => {
    if (context.error && !isRetrying) {
      setIsRetrying(true);
      
      try {
        await context.fetchLevels(symbol);
        toast({
          title: "Support & Resistance Levels",
          description: "Successfully retrieved market levels on retry.",
        });
      } catch (error) {
        toast({
          title: "Data Error",
          description: "Could not retrieve support & resistance data.",
          variant: "destructive"
        });
      } finally {
        setIsRetrying(false);
      }
    }
  }, [context, toast, isRetrying]);
  
  // Auto-retry once on initial error
  useEffect(() => {
    if (context.error && context.levels.length === 0 && !isRetrying) {
      retryFetch('BTC/USDT');
    }
  }, [context.error, context.levels, retryFetch, isRetrying]);
  
  return {
    ...context,
    retryFetch
  };
};
