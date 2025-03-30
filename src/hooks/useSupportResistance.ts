
import { useContext, useCallback, useState, useEffect } from 'react';
import { SupportResistanceContext } from '@/contexts/SupportResistanceContext';
import { useToast } from '@/hooks/use-toast';

export const useSupportResistance = () => {
  const context = useContext(SupportResistanceContext);
  const { toast } = useToast();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  if (!context) {
    throw new Error('useSupportResistance must be used within a SupportResistanceProvider');
  }
  
  // Add a retry function in case the initial fetch fails
  const retryFetch = useCallback(async (symbol: string) => {
    if (context.error && !isRetrying && retryCount < 3) {
      setIsRetrying(true);
      
      try {
        await context.fetchLevels(symbol);
        toast({
          title: "Support & Resistance Levels",
          description: "Successfully retrieved market levels on retry.",
        });
        // Reset retry count on success
        setRetryCount(0);
      } catch (error) {
        setRetryCount(prev => prev + 1);
        toast({
          title: "Data Error",
          description: `Could not retrieve support & resistance data. Retry ${retryCount + 1}/3.`,
          variant: "destructive"
        });
      } finally {
        setIsRetrying(false);
      }
    } else if (retryCount >= 3) {
      toast({
        title: "Connection Issue",
        description: "Maximum retries reached. Using cached data if available.",
        variant: "destructive"
      });
    }
  }, [context, toast, isRetrying, retryCount]);
  
  // Auto-retry once on initial error with exponential backoff
  useEffect(() => {
    if (context.error && context.levels.length === 0 && !isRetrying && retryCount < 3) {
      const timeoutMs = Math.pow(2, retryCount) * 1000; // Exponential backoff
      const timeoutId = setTimeout(() => {
        retryFetch('BTC/USDT');
      }, timeoutMs);
      
      return () => clearTimeout(timeoutId);
    }
  }, [context.error, context.levels, retryFetch, isRetrying, retryCount]);
  
  return {
    ...context,
    retryFetch,
    isRetrying,
    retryCount
  };
};
