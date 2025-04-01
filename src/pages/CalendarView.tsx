
import React, { useState } from 'react';
import { ImprovedEconomicCalendar } from '@/components/calendar/ImprovedEconomicCalendar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketStatus } from '@/components/markets/MarketStatus';
import { useMarkets } from '@/hooks/useMarkets';
import { DataSourceIndicator } from '@/components/ui/data-source-indicator';
import { Badge } from '@/components/ui/badge';

const CalendarView = () => {
  const [activeTab, setActiveTab] = useState('economic');
  const { marketSessions } = useMarkets();
  
  // Calculate which markets are currently open
  const openMarkets = marketSessions.filter(market => market.status === 'open');
  
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Events</h1>
        <p className="text-muted-foreground">
          Economic calendar and market sessions
        </p>
        <div className="mt-2">
          <DataSourceIndicator 
            source="Forex Factory API" 
            isLive={false}
            details="Economic data is simulated based on real-world Forex Factory patterns" 
          />
        </div>
      </div>
      
      {openMarkets.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">Currently Open Markets</h3>
                <p className="text-sm text-muted-foreground">
                  {openMarkets.length} market{openMarkets.length !== 1 ? 's' : ''} currently trading
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {openMarkets.map(market => (
                  <Badge key={market.name} variant="outline" className="bg-primary/10">
                    {market.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="economic">Economic Calendar</TabsTrigger>
          <TabsTrigger value="markets">Market Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="economic" className="pt-4">
          <ImprovedEconomicCalendar compact={false} />
        </TabsContent>
        
        <TabsContent value="markets" className="pt-4">
          <MarketStatus showDetails={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarView;
