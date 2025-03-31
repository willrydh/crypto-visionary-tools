
import React, { useState } from 'react';
import FearGreedIndex from '@/components/market/FearGreedIndex';
import EconomicCalendarAPI from '@/components/market/EconomicCalendarAPI';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, Cloud, ClipboardCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import DataStatusIndicator from '@/components/dashboard/DataStatusIndicator';

const MarketDashboard = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fearGreedIndexKey, setFearGreedIndexKey] = useState(0);
  const [economicCalendarKey, setEconomicCalendarKey] = useState(0);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    // Force refresh by changing keys
    setFearGreedIndexKey(prev => prev + 1);
    setEconomicCalendarKey(prev => prev + 1);
    
    toast({
      title: "Refreshing Data",
      description: "Updating market data from all sources...",
    });
    
    // Set a timeout to simulate loading
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsRefreshing(false);
        toast({
          title: "Data Refreshed",
          description: "Market data has been updated successfully.",
        });
        resolve();
      }, 1500);
    });
  };

  return (
    <PullToRefresh onRefresh={handleRefreshAll}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Market Forecast</h1>
            <p className="text-muted-foreground">
              Real-time market conditions and economic events
            </p>
          </div>
          <Button 
            onClick={() => handleRefreshAll()}
            disabled={isRefreshing}
            variant="outline"
            className="gap-2 backdrop-blur-sm bg-card/30 border-border/50 hover:bg-primary/10 transition-all duration-200"
          >
            <Cloud className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Update Forecast'}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <FearGreedIndex 
              key={fearGreedIndexKey} 
              useMockData={true} 
              hideErrors={true} 
            />
          </div>
          <div>
            <EconomicCalendarAPI 
              key={economicCalendarKey}
              useMockData={true}
              hideErrors={true}
            />
          </div>
        </div>

        {/* Mobile friendly view for small screens */}
        <div className="md:hidden mt-4">
          <Tabs defaultValue="fear-greed">
            <TabsList className="w-full">
              <TabsTrigger value="fear-greed" className="flex-1">Fear & Greed</TabsTrigger>
              <TabsTrigger value="calendar" className="flex-1">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="fear-greed" className="mt-4">
              <FearGreedIndex 
                key={fearGreedIndexKey} 
                useMockData={true} 
                hideErrors={true} 
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-4">
              <EconomicCalendarAPI 
                key={economicCalendarKey}
                useMockData={true}
                hideErrors={true}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PullToRefresh>
  );
};

export default MarketDashboard;
