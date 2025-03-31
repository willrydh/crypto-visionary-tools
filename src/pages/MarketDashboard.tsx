
import React, { useState } from 'react';
import FearGreedIndex from '@/components/market/FearGreedIndex';
import EconomicCalendarAPI from '@/components/market/EconomicCalendarAPI';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, ClipboardCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MarketDashboard = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fearGreedIndexKey, setFearGreedIndexKey] = useState(0);
  const [economicCalendarKey, setEconomicCalendarKey] = useState(0);
  const [alertMessage, setAlertMessage] = useState<{title: string, message: string, type: 'default' | 'destructive'} | null>(null);

  const handleRefreshAll = () => {
    setIsRefreshing(true);
    // Force refresh by changing keys
    setFearGreedIndexKey(prev => prev + 1);
    setEconomicCalendarKey(prev => prev + 1);
    
    toast({
      title: "Refreshing Data",
      description: "Updating market data from all sources...",
    });
    
    // Set a timeout to simulate loading
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data Refreshed",
        description: "Market data has been updated successfully.",
      });
    }, 1500);
  };

  const dismissAlert = () => {
    setAlertMessage(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {alertMessage && (
        <Alert variant={alertMessage.type} className="mb-4">
          <AlertTitle className="text-lg">{alertMessage.title}</AlertTitle>
          <AlertDescription className="text-sm">{alertMessage.message}</AlertDescription>
          <Button variant="ghost" size="sm" onClick={dismissAlert} className="absolute top-2 right-2">
            ✕
          </Button>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Market Forecast</h1>
          <p className="text-muted-foreground">
            Real-time market conditions and economic events
          </p>
        </div>
        <Button 
          onClick={handleRefreshAll} 
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh All Data'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FearGreedIndex key={fearGreedIndexKey} />
        </div>
        <div>
          <EconomicCalendarAPI key={economicCalendarKey} />
        </div>
      </div>

      {/* Mobile friendly view for small screens */}
      <div className="md:hidden mt-4">
        <Tabs defaultValue="fear-greed">
          <TabsList className="w-full">
            <TabsTrigger value="fear-greed" className="flex-1">Fear & Greed</TabsTrigger>
            <TabsTrigger value="calendar" className="flex-1">Calendar</TabsTrigger>
          </TabsList>
          <TabsContent value="fear-greed" className="mt-4">
            <FearGreedIndex key={fearGreedIndexKey} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-4">
            <EconomicCalendarAPI key={economicCalendarKey} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketDashboard;
