
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import DataStatusIndicator from '@/components/dashboard/DataStatusIndicator';
import { Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update: string;
}

const getFearGreedColor = (value: number): string => {
  if (value <= 25) return 'bg-red-500'; // Extreme Fear
  if (value <= 40) return 'bg-orange-500'; // Fear
  if (value <= 60) return 'bg-yellow-500'; // Neutral
  if (value <= 75) return 'bg-green-500'; // Greed
  return 'bg-emerald-500'; // Extreme Greed
};

const FearGreedIndex = () => {
  const [data, setData] = useState<FearGreedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const fetchFearGreedIndex = async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      // Using cors-anywhere proxy to avoid CORS issues
      const proxyUrl = 'https://corsproxy.io/?';
      const targetUrl = 'https://api.alternative.me/fng/';
      
      const response = await fetch(proxyUrl + targetUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.data && result.data.length > 0) {
        setData(result.data[0]);
      } else {
        throw new Error('No data found in response');
      }
      
      setIsLoading(false);
      
      toast({
        title: 'Success',
        description: 'Fear & Greed data updated successfully',
      });
    } catch (error) {
      console.error('Error fetching Fear & Greed Index:', error);
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to fetch Fear & Greed data');
      
      // Always use fallback mock data to demonstrate UI when API fails
      setData({
        value: "34",
        value_classification: "Fear",
        timestamp: `${Math.floor(Date.now() / 1000)}`,
        time_until_update: "12 hours"
      });
      
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFearGreedIndex();
  }, []);

  const handleRefresh = () => {
    fetchFearGreedIndex();
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Fear & Greed Index</CardTitle>
          <CardDescription>
            Market sentiment indicator
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{data.value}</div>
              <div className="text-lg font-medium">{data.value_classification}</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent align="end">
                    <p>Last updated: {new Date(parseInt(data.timestamp) * 1000).toLocaleDateString()}</p>
                    <p>Next update: {data.time_until_update}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                className={`${getFearGreedColor(parseInt(data.value))} h-4 rounded-full transition-all duration-500 ease-in-out`}
                style={{ width: `${data.value}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs">
              <span>0 - Extreme Fear</span>
              <span>50 - Neutral</span>
              <span>100 - Extreme Greed</span>
            </div>
          </div>
        ) : !isLoading && (
          <div className="py-8 text-center text-muted-foreground">
            No data available
          </div>
        )}
        
        {isError && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md text-sm text-red-500">
            Using fallback data due to API connection issues.
          </div>
        )}
        
        <DataStatusIndicator 
          isLoading={isLoading} 
          isError={isError} 
          errorMessage={errorMessage} 
        />
      </CardContent>
    </Card>
  );
};

export default FearGreedIndex;
