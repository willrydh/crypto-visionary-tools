
import React from 'react';
import FearGreedIndex from '@/components/market/FearGreedIndex';
import EconomicCalendarAPI from '@/components/market/EconomicCalendarAPI';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MarketDashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Market Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time market data and economic indicators
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FearGreedIndex />
        </div>
        <div>
          <EconomicCalendarAPI />
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
            <FearGreedIndex />
          </TabsContent>
          <TabsContent value="calendar" className="mt-4">
            <EconomicCalendarAPI />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketDashboard;
