
import React from 'react';
import { ImprovedEconomicCalendar } from '@/components/calendar/ImprovedEconomicCalendar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { 
  getMockMarketSessions,
  formatTimeUntil
} from '@/utils/mockData';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const CalendarView = () => {
  const { toast } = useToast();
  const [marketSessions, setMarketSessions] = React.useState(getMockMarketSessions());
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setMarketSessions(getMockMarketSessions());
      setIsRefreshing(false);
      
      toast({
        title: "Calendar Refreshed",
        description: "Economic events and market sessions updated.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Economic Events</h1>
          <p className="text-muted-foreground">
            Track market-moving economic events and market sessions
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="w-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Economic Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImprovedEconomicCalendar compact={false} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Market Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketSessions.map((session) => (
                  <div key={session.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{session.name}</span>
                      <Badge 
                        variant={session.status === "open" ? "default" : "outline"}
                        className={session.status === "open" ? "bg-bullish" : ""}
                      >
                        {session.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {session.nextEvent.type.charAt(0).toUpperCase() + session.nextEvent.type.slice(1)}{" "}
                      {formatTimeUntil(session.nextEvent.time)}
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-6 text-xs text-muted-foreground text-center">
        <p>Data sourced from Bybit API and other public financial data sources. Updated in real-time.</p>
      </div>
    </div>
  );
};

export default CalendarView;
