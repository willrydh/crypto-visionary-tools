
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { fetchEconomicEvents, EconomicEvent } from '@/services/calendarService';
import { formatDate, formatTimeUntil } from '@/utils/dateUtils';

interface ImprovedEconomicCalendarProps {
  compact?: boolean;
}

export const ImprovedEconomicCalendar: React.FC<ImprovedEconomicCalendarProps> = ({ 
  compact = false 
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
      // Get date ranges
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const endOfTomorrow = new Date(tomorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);
      
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);
      
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
      
      // Fetch events for different periods
      const todayEvents = await fetchEconomicEvents(today, today);
      const tomorrowEvents = await fetchEconomicEvents(tomorrow, endOfTomorrow);
      const weekEvents = await fetchEconomicEvents(today, endOfWeek);
      const monthEvents = await fetchEconomicEvents(today, endOfMonth);
      
      setEvents({
        today: todayEvents,
        tomorrow: tomorrowEvents,
        week: weekEvents,
        month: monthEvents
      });
    } catch (error) {
      console.error('Error fetching economic events:', error);
      setError('Failed to load economic events');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEvents();
    
    // Refresh every hour
    const interval = setInterval(fetchEvents, 3600000);
    return () => clearInterval(interval);
  }, []);
  
  const getImpactColor = (impact: 'low' | 'medium' | 'high'): string => {
    switch (impact) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-slate-500';
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
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mb-2" />
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={fetchEvents}>
            Try Again
          </Button>
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
          <CardTitle className="text-lg">Economic Calendar</CardTitle>
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
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
          <TabsList className="w-full">
            <TabsTrigger value="today" className="flex-1">Today</TabsTrigger>
            <TabsTrigger value="tomorrow" className="flex-1">Tomorrow</TabsTrigger>
            <TabsTrigger value="week" className="flex-1">This Week</TabsTrigger>
            <TabsTrigger value="month" className="flex-1">This Month</TabsTrigger>
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
