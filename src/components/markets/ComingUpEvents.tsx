
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowDown, CheckCircle, Timer } from 'lucide-react';
import { createUtcDate, getMarketTimeRemaining, getLocalTimeDisplay } from '@/utils/dateUtils';

const MARKET_EVENTS = [
  {
    time: 7, // 09:00 Swedish time (London Forex öppnar), UTC+2
    name: "London Forex session",
    weekdaysOnly: true,
    open: 7,    // event start i UTC
    close: 15.5 // 17:30 svensk tid = 15:30 UTC
  },
  {
    time: 12, // 14:00 Swedish time (Forex pre-market öppnar), UTC+2
    name: "Forex pre-market",
    weekdaysOnly: true,
    open: 12,
    close: 13.5 // NY öppnar 15:30 sv = 13:30 UTC
  },
  {
    time: 13.5, // 15:30 Swedish time (NYSE/NASDAQ öppnar), UTC+2
    name: "NYSE & NASDAQ session",
    weekdaysOnly: true,
    open: 13.5,
    close: 20 // NYSE/NASDAQ stänger 22:00 sv = 20:00 UTC
  }
];

interface MarketEvent {
  time: number;
  name: string;
  weekdaysOnly: boolean;
  open: number;
  close: number;
  localTime?: string;
  countdown?: string;
  isPassed?: boolean;
  isNext?: boolean;
  isToday?: boolean;
  eventDate?: Date;
  isOpenNow?: boolean;
  opensTomorrow?: boolean;
  openingInLessThanHour?: boolean;
  marketCap?: string; // Add this missing property
}

const ComingUpEvents = () => {
  const [events, setEvents] = useState<MarketEvent[]>([]);

  const updateEvents = () => {
    const now = new Date();
    const currentDay = now.getUTCDay();
    const isWeekend = currentDay === 0 || currentDay === 6; // Sun = 0, Sat = 6
    const currentTime = now.getUTCHours() + now.getUTCMinutes() / 60;

    const processedEvents: MarketEvent[] = MARKET_EVENTS.map(event => {
      const hour = Math.floor(event.time);
      const minute = Math.round((event.time - hour) * 60);

      let eventOpenDate = new Date(now);
      eventOpenDate.setUTCHours(Math.floor(event.open), Math.round((event.open % 1) * 60), 0, 0);
      let eventCloseDate = new Date(now);
      eventCloseDate.setUTCHours(Math.floor(event.close), Math.round((event.close % 1) * 60), 0, 0);

      let eventDate = new Date(now);
      let isToday = true;
      if (isWeekend && event.weekdaysOnly) {
        const daysUntilMonday = currentDay === 0 ? 1 : 2;
        eventDate.setUTCDate(eventDate.getUTCDate() + daysUntilMonday);
        eventOpenDate.setUTCDate(eventOpenDate.getUTCDate() + daysUntilMonday);
        eventCloseDate.setUTCDate(eventCloseDate.getUTCDate() + daysUntilMonday);
        isToday = false;
      }

      let opensTomorrow = false;
      if (currentTime > event.close && event.weekdaysOnly && !isWeekend) {
        isToday = false;
        opensTomorrow = true;
        eventDate.setUTCDate(eventDate.getUTCDate() + 1);

        let newDay = eventDate.getUTCDay();
        if (newDay === 0) eventDate.setUTCDate(eventDate.getUTCDate() + 1);
        if (newDay === 6) eventDate.setUTCDate(eventDate.getUTCDate() + 2);

        eventOpenDate = new Date(eventDate);
        eventOpenDate.setUTCHours(Math.floor(event.open), Math.round((event.open % 1) * 60), 0, 0);
        eventCloseDate = new Date(eventDate);
        eventCloseDate.setUTCHours(Math.floor(event.close), Math.round((event.close % 1) * 60), 0, 0);
      }

      const isOpenNow =
        !isWeekend &&
        currentTime >= event.open &&
        currentTime < event.close &&
        event.weekdaysOnly;

      const isOpeningSoon =
        !isOpenNow &&
        !isWeekend &&
        currentTime < event.open &&
        event.open - currentTime <= 1 &&
        event.weekdaysOnly;

      const isPassed = (!isOpenNow && currentTime > event.close) || opensTomorrow;

      const openingInLessThanHour =
        !isOpenNow &&
        !isWeekend &&
        currentTime < event.open &&
        event.open - currentTime < 1 &&
        event.weekdaysOnly;

      return {
        ...event,
        localTime: getLocalTimeDisplay(hour, minute),
        countdown: isOpenNow
          ? undefined
          : getMarketTimeRemaining(isToday ? eventOpenDate : eventOpenDate),
        isPassed,
        isToday,
        opensTomorrow,
        isOpenNow,
        eventDate: eventOpenDate,
        isNext: false,
        openingInLessThanHour,
      };
    });

    const sortedEvents = processedEvents.sort((a, b) => a.time - b.time);
    const nextIndex = sortedEvents.findIndex(
      event => (event.isOpenNow && event.isToday) || (!event.isOpenNow && !event.isPassed && event.isToday)
    );
    const finalEvents = sortedEvents.map((evt, idx) => ({
      ...evt,
      isNext: idx === nextIndex
    }));
    setEvents(finalEvents);
  };

  useEffect(() => {
    updateEvents();
    const interval = setInterval(updateEvents, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/40 overflow-hidden">
      <CardHeader className="pb-3 pt-5">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Clock className="h-4 w-4 text-mode-night" />
          Coming up
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="relative">
          <div className="absolute left-[22px] top-1 bottom-1 w-0.5 bg-purple-900/20 dark:bg-purple-400/10"></div>
          <div className="space-y-3"> 
            {events.map((event, index) => {
              const showOpensPulse = event.openingInLessThanHour && !event.isOpenNow && event.isNext;

              return (
                <div
                  key={`${event.time}-${event.name}`}
                  className={`flex items-start gap-3
                    ${event.isNext && !event.isOpenNow ? 'animate-pulse-moderate' : ''}
                    py-2 px-2 rounded-lg transition-colors
                    ${event.isNext ? 'bg-purple-500/5 dark:bg-purple-950/30' : 'hover:bg-muted/30'}
                  `}
                >
                  <div
                    className={`
                      relative z-10 mt-1.5
                      ${event.isNext
                        ? showOpensPulse
                          ? 'bg-purple-500 border-purple-300 shadow-glow'
                          : 'bg-purple-400 border-purple-300'
                        : event.isOpenNow
                          ? 'bg-bullish border-green-400 shadow-glow'
                          : 'bg-surface-3 border-slate-600'}
                      rounded-full border-2
                      h-3 w-3
                      transition-all
                    `}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="font-medium text-sm flex items-center gap-1.5 min-w-0">
                        {event.isOpenNow && event.isToday ? (
                          <span className="flex items-center gap-1">
                            <span className="truncate">{event.name}</span>
                            <Badge variant="outline" className="bg-bullish/10 text-bullish border-bullish/30 ml-2">
                              LIVE <span className="ml-1 h-2 w-2 rounded-full bg-bullish inline-block animate-pulse"></span>
                            </Badge>
                          </span>
                        ) : event.openingInLessThanHour && event.isNext ? (
                          <span className="flex items-center gap-2">
                            <span className="truncate">{event.name}</span>
                            <Badge variant="outline" className="bg-mode-night/10 text-mode-night border-purple-400/30">
                              Opening Soon
                            </Badge>
                          </span>
                        ) : (
                          <span className="truncate">{event.name}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        {event.openingInLessThanHour && event.isNext ? (
                          <Badge variant="outline" className="animate-pulse-slow bg-mode-night/10 text-mode-night border-purple-400/30">
                            <Timer className="inline-block h-3 w-3 mr-1" />
                            {event.countdown}
                          </Badge>
                        ) : !event.isOpenNow && event.countdown && (
                          <span className="text-xs text-muted-foreground font-medium">
                            {event.countdown}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                      {event.marketCap && <span>{event.marketCap}</span>}
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                      <span>{event.localTime}</span>
                    </div>

                    {index < events.length - 1 && (
                      <div className="mt-2 flex justify-center">
                        <ArrowDown className="h-3 w-3 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComingUpEvents;
