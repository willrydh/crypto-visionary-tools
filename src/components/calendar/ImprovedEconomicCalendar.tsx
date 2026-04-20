
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertCircle, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fetchEconomicEvents, EconomicEvent } from '@/services/calendarService';
import { formatDate, formatTimeUntil } from '@/utils/dateUtils';
import { DataSourceIndicator } from '@/components/ui/data-source-indicator';

interface ImprovedEconomicCalendarProps {
  compact?: boolean;
  title?: string; // Added title as an optional prop
}

export const ImprovedEconomicCalendar: React.FC<ImprovedEconomicCalendarProps> = ({ 
  compact = false,
  title = "Upcoming Events" // Default value
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'tomorrow' | 'week' | 'month'>('today');
  const [events, setEvents] = useState<{
    today: EconomicEvent[];
    tomorrow: EconomicEvent[];
    week: EconomicEvent[];
    month: EconomicEvent[];
  }>({
    today: [],
    tomorrow: [],
    week: [],
    month: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const endOfTomorrow = new Date(tomorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);
      
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);
      
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
      
      const todayEvents = await fetchEconomicEvents(today, today);
      const tomorrowEvents = await fetchEconomicEvents(tomorrow, endOfTomorrow);
      const weekEvents = await fetchEconomicEvents(today, endOfWeek);
      const monthEvents = await fetchEconomicEvents(today, endOfMonth);
      
      const useMockData = todayEvents.length === 0 && tomorrowEvents.length === 0 && weekEvents.length === 0;
      
      if (useMockData) {
        const mockEvents = generateMockEvents();
        
        setEvents({
          today: mockEvents.filter(e => isToday(e.date)),
          tomorrow: mockEvents.filter(e => isTomorrow(e.date)),
          week: mockEvents.filter(e => isThisWeek(e.date)),
          month: mockEvents
        });
      } else {
        setEvents({
          today: todayEvents,
          tomorrow: tomorrowEvents,
          week: weekEvents,
          month: monthEvents
        });
      }
    } catch (error) {
      console.error('Error fetching economic events:', error);
      
      const mockEvents = generateMockEvents();
      
      setEvents({
        today: mockEvents.filter(e => isToday(e.date)),
        tomorrow: mockEvents.filter(e => isTomorrow(e.date)),
        week: mockEvents.filter(e => isThisWeek(e.date)),
        month: mockEvents
      });
      
      setError('Failed to load real economic events. Showing mock data.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.getDate() === tomorrow.getDate() && 
           date.getMonth() === tomorrow.getMonth() && 
           date.getFullYear() === tomorrow.getFullYear();
  };
  
  const isThisWeek = (date: Date) => {
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    
    return date >= today && date <= endOfWeek;
  };
  
  const generateMockEvents = (): EconomicEvent[] => {
    const today = new Date();
    const mockEvents: EconomicEvent[] = [];
    
    mockEvents.push({
      id: '1',
      title: 'FOMC Minutes',
      date: new Date(today.setHours(14, 0, 0, 0)),
      country: 'USD',
      impact: 'high',
      previous: '5.0%',
      forecast: '5.1%',
      actual: null,
      source: 'Federal Reserve',
      type: 'fomc'
    });
    
    mockEvents.push({
      id: '2',
      title: 'Retail Sales m/m',
      date: new Date(today.setHours(8, 30, 0, 0)),
      country: 'USD',
      impact: 'medium',
      previous: '0.3%',
      forecast: '0.2%',
      actual: '0.4%',
      source: 'Census Bureau',
      type: 'retail_sales'
    });
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    mockEvents.push({
      id: '3',
      title: 'CPI m/m',
      date: new Date(new Date(tomorrow).setHours(8, 30, 0, 0)),
      country: 'EUR',
      impact: 'high',
      previous: '0.2%',
      forecast: '0.3%',
      actual: null,
      source: 'Eurostat',
      type: 'cpi'
    });
    
    mockEvents.push({
      id: '4',
      title: 'Unemployment Claims',
      date: new Date(new Date(tomorrow).setHours(8, 30, 0, 0)),
      country: 'USD',
      impact: 'medium',
      previous: '215K',
      forecast: '220K',
      actual: null,
      source: 'Department of Labor',
      type: 'unemployment'
    });
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() + 3);
    
    mockEvents.push({
      id: '5',
      title: 'GDP q/q',
      date: new Date(new Date(thisWeek).setHours(8, 30, 0, 0)),
      country: 'GBP',
      impact: 'high',
      previous: '0.6%',
      forecast: '0.5%',
      actual: null,
      source: 'Office for National Statistics',
      type: 'gdp'
    });
    
    mockEvents.push({
      id: '6',
      title: 'Non-Farm Payrolls',
      date: new Date(new Date(thisWeek).setHours(8, 30, 0, 0)),
      country: 'USD',
      impact: 'high',
      previous: '236K',
      forecast: '230K',
      actual: null,
      source: 'Bureau of Labor Statistics',
      type: 'nfp'
    });
    
    const laterThisMonth = new Date();
    laterThisMonth.setDate(laterThisMonth.getDate() + 10);
    
    mockEvents.push({
      id: '7',
      title: 'Fed Interest Rate Decision',
      date: new Date(new Date(laterThisMonth).setHours(14, 0, 0, 0)),
      country: 'USD',
      impact: 'high',
      previous: '5.00%',
      forecast: '5.25%',
      actual: null,
      source: 'Federal Reserve',
      type: 'interest_rate'
    });
    
    mockEvents.push({
      id: '8',
      title: 'ECB Interest Rate Decision',
      date: new Date(new Date(laterThisMonth).setHours(7, 45, 0, 0)),
      country: 'EUR',
      impact: 'high',
      previous: '3.75%',
      forecast: '4.00%',
      actual: null,
      source: 'European Central Bank',
      type: 'interest_rate'
    });
    
    return mockEvents;
  };
  
  useEffect(() => {
    fetchEvents();
    
    const interval = setInterval(fetchEvents, 3600000);
    return () => clearInterval(interval);
  }, []);
  
  const getImpactColor = (impact: 'low' | 'medium' | 'high'): string => {
    switch (impact) {
      case 'high':
        return 'bg-bearish';
      case 'medium':
        return 'bg-warning';
      case 'low':
        return 'bg-bullish';
      default:
        return 'bg-muted-foreground';
    }
  };
  
  const currentEvents = events[selectedPeriod];
  
  const renderEventsList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }
    
    if (currentEvents.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">No economic events scheduled for this period</p>
          {selectedPeriod === 'today' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedPeriod('tomorrow')}
            >
              Check Tomorrow
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {currentEvents.map((event, index) => (
          <div 
            key={event.id} 
            className="flex flex-col p-3 bg-card rounded-md border border-border"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Badge className={getImpactColor(event.impact)}>{event.impact}</Badge>
                <span className="font-medium">{event.title}</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60">
                    <div className="text-xs space-y-1">
                      <p className="font-medium">Data Source:</p>
                      <p className="text-muted-foreground">{event.source || 'Economic Data Provider'}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Badge variant="outline">{event.country}</Badge>
            </div>
            
            <div className="mt-2 flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{formatDate(event.date)}</span>
              <span>{formatTimeUntil(event.date)}</span>
            </div>
            
            {!compact && (
              <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground block">Previous</span>
                  <span>{event.previous || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Forecast</span>
                  <span>{event.forecast || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Actual</span>
                  <span>{event.actual || 'Pending'}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <DataSourceIndicator 
              source="Forex Factory" 
              isLive={false}
              details="Economic events are simulated based on common Forex Factory data patterns" 
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={fetchEvents}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
          <TabsList className="w-full">
            <TabsTrigger value="today" className="flex-1">Today</TabsTrigger>
            <TabsTrigger value="tomorrow" className="flex-1">Tomorrow</TabsTrigger>
            <TabsTrigger value="week" className="flex-1">Week</TabsTrigger>
            <TabsTrigger value="month" className="flex-1">Month</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="mt-2">
            {renderEventsList()}
          </TabsContent>
          
          <TabsContent value="tomorrow" className="mt-2">
            {renderEventsList()}
          </TabsContent>
          
          <TabsContent value="week" className="mt-2">
            {renderEventsList()}
          </TabsContent>
          
          <TabsContent value="month" className="mt-2">
            {renderEventsList()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
