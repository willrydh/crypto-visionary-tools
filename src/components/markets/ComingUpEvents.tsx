
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowDown, CheckCircle } from 'lucide-react';
import { createUtcDate, getMarketTimeRemaining, getLocalTimeDisplay } from '@/utils/dateUtils';

// Market events with their UTC times
const MARKET_EVENTS = [
  {
    time: 7, // 09:00 Swedish time is 07:00 UTC (assuming UTC+2 for Sweden)
    name: "London Forex-session öppnar",
    weekdaysOnly: true
  },
  {
    time: 12, // 14:00 Swedish time is 12:00 UTC (assuming UTC+2 for Sweden)
    name: "New York Forex-session öppnar",
    weekdaysOnly: true
  },
  {
    time: 12, // 14:00 Swedish time is 12:00 UTC (assuming UTC+2 for Sweden)
    name: "NASDAQ & NYSE pre-market öppnar",
    weekdaysOnly: true
  },
  {
    time: 13.5, // 15:30 Swedish time is 13:30 UTC (assuming UTC+2 for Sweden)
    name: "NASDAQ & NYSE öppnar (riktig börsöppning)",
    weekdaysOnly: true
  }
];

interface MarketEvent {
  time: number;
  name: string;
  weekdaysOnly: boolean;
  localTime?: string;
  countdown?: string;
  isPassed?: boolean;
  isNext?: boolean; // Added this property to fix the type error
  isToday?: boolean;
}

const ComingUpEvents = () => {
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [nextEventIndex, setNextEventIndex] = useState<number>(-1);

  // Calculate and update events with local times and countdowns
  const updateEvents = () => {
    const now = new Date();
    const currentDay = now.getUTCDay();
    const isWeekend = currentDay === 0 || currentDay === 6; // 0 = Sunday, 6 = Saturday
    
    // Process each event to add local time and countdown info
    const processedEvents = MARKET_EVENTS.map(event => {
      // Convert UTC hour to Date object
      const hour = Math.floor(event.time);
      const minute = Math.round((event.time - hour) * 60);
      
      // Create today's date with this event's time
      let eventDate = new Date(now);
      eventDate.setUTCHours(hour, minute, 0, 0);
      
      // Check if the event has already passed today
      const isPassed = eventDate <= now;
      
      // If it's a weekend and the event is weekdays only, adjust to next Monday
      let isToday = true;
      if (isWeekend && event.weekdaysOnly) {
        const daysUntilMonday = currentDay === 0 ? 1 : 2; // 1 day if Sunday, 2 days if Saturday
        eventDate.setUTCDate(eventDate.getUTCDate() + daysUntilMonday);
        isToday = false;
      }
      
      // If the event has passed today but we need to show tomorrow's event
      if (isPassed && !isWeekend) {
        // If we want to show history for today, don't adjust the date
        // We'll set a marker that it's passed instead
      } else if (isPassed && !isToday) {
        // For weekend + passed, we already set it to next Monday above
      } else if (isPassed) {
        // If it's a regular day and event passed, we'd normally set it to tomorrow
        // But for history showing, we'll keep it as today's passed event
        eventDate.setUTCDate(eventDate.getUTCDate() + 1);
        isToday = false;
      }
      
      // Skip to next business day if the target day is a weekend
      const targetDay = eventDate.getUTCDay();
      if (event.weekdaysOnly && (targetDay === 0 || targetDay === 6) && !isToday) {
        eventDate.setUTCDate(eventDate.getUTCDate() + (targetDay === 0 ? 1 : 2));
      }
      
      return {
        ...event,
        localTime: getLocalTimeDisplay(hour, minute),
        countdown: getMarketTimeRemaining(eventDate),
        isPassed: isPassed && isToday, // Only mark as passed if it's today's event
        isToday: isToday,
        eventDate // Keep this for sorting
      };
    });
    
    // Sort events by their time of day (not by date)
    // This ensures consistent order regardless of which ones have passed
    const sortedEvents = [...processedEvents].sort((a, b) => {
      return a.time - b.time;
    });
    
    // Find the next upcoming event
    const nextIndex = sortedEvents.findIndex(event => !event.isPassed && event.isToday);
    
    // Mark the next event
    if (nextIndex !== -1) {
      sortedEvents[nextIndex].isNext = true;
    }
    
    // Remove the temporary eventDate property and isToday properties
    const cleanedEvents = sortedEvents.map(({ eventDate, isToday, ...rest }) => rest);
    
    setEvents(cleanedEvents);
    setNextEventIndex(nextIndex);
  };

  // Update the countdowns every minute
  useEffect(() => {
    updateEvents();
    
    const interval = setInterval(() => {
      updateEvents();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-card/60 border-border/60 overflow-hidden">
      <CardHeader className="pb-3 pt-6">
        <CardTitle className="text-xl flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-400" />
          Coming up
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[22px] top-1 bottom-1 w-0.5 bg-purple-900/30"></div>
          
          <div className="space-y-4">
            {events.map((event, index) => (
              <div 
                key={`${event.time}-${event.name}`} 
                className={`flex items-start gap-3 ${event.isNext ? 'animate-pulse' : ''}`}
              >
                {/* Timeline dot */}
                <div className={`relative z-10 mt-1.5 h-3 w-3 rounded-full border-2 
                  ${event.isNext 
                    ? 'bg-purple-400 border-purple-300' 
                    : event.isPassed
                      ? 'bg-green-500 border-green-400'
                      : 'bg-slate-700 border-slate-600'}`}>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="font-medium text-sm flex items-center gap-1.5">
                      {event.name}
                      {event.isPassed && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-1.5 ${
                          event.isNext 
                            ? 'border-purple-400/30 bg-purple-900/20 text-purple-300' 
                            : event.isPassed
                              ? 'border-green-500/30 bg-green-950/20 text-green-400'
                              : 'border-border bg-card/80'
                        }`}
                      >
                        {event.localTime}
                      </Badge>
                      {event.isNext && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                          {event.countdown}
                        </Badge>
                      )}
                      {event.isPassed && (
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {index < events.length - 1 && (
                    <div className="mt-0.5 flex justify-center pl-0">
                      <ArrowDown className="h-4 w-4 text-slate-600 mt-1 mb-1" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComingUpEvents;
