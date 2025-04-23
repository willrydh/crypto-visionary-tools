
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
    <Card className="bg-card/60 border-border/60 overflow-hidden">
      <CardHeader className="pb-3 pt-6">
        <CardTitle className="text-xl flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-400" />
          Coming up
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="relative">
          <div className="absolute left-[22px] top-1 bottom-1 w-0.5 bg-purple-900/30"></div>
          <div className="space-y-3 sm:space-y-4"> 
            {events.map((event, index) => {
              const showOpensPulse = event.openingInLessThanHour && !event.isOpenNow && event.isNext;

              return (
                <div
                  key={`${event.time}-${event.name}`}
                  className={`flex items-start gap-2 sm:gap-3
                    ${event.isNext && !event.isOpenNow ? 'animate-pulse-moderate' : ''}
                    py-1.5 px-0 sm:py-2 sm:px-2
                  `}
                  style={{
                    minHeight: '34px',
                  }}
                >
                  <div
                    className={`
                      relative z-10 mt-2 sm:mt-1.5
                      ${event.isNext
                        ? showOpensPulse
                          ? 'bg-purple-500 border-purple-300 shadow-glow'
                          : 'bg-purple-400 border-purple-300'
                        : event.isOpenNow
                          ? 'bg-green-500 border-green-400 shadow-glow'
                          : 'bg-slate-700 border-slate-600'}
                      rounded-full border-2
                      h-3.5 w-3.5 sm:h-3 w-3
                      transition-all
                    `}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div
                        className="font-medium text-sm flex flex-col xs:flex-row xs:items-center gap-1.5 min-w-0 break-words"
                      >
                        {/* Event title & OPEN styling */}
                        {event.isOpenNow && event.isToday ? (
                          <span className="flex flex-col xs:flex-row xs:items-center gap-0.5 min-w-0">
                            <span className="truncate">{event.name}</span>
                            <span className="flex items-center gap-1 font-bold text-green-500 ml-0 xs:ml-1 mt-0.5 xs:mt-0">
                              is OPEN <CheckCircle className="h-4 w-4 text-green-500 ml-1" />
                            </span>
                          </span>
                        ) : event.openingInLessThanHour && event.isNext ? (
                          <>
                            <Timer className="h-4 w-4 text-purple-400 flex-shrink-0" />
                            <span className="truncate">{event.name}</span>
                            <span className="font-bold text-purple-400 ml-1">opens</span>
                            <span className="ml-1">{event.localTime}</span>
                          </>
                        ) : event.opensTomorrow ? (
                          <>
                            <span className="truncate">{event.name}</span>
                            <span className="font-bold text-blue-500 ml-1">opens</span>
                            <span className="ml-1">{event.localTime}</span>
                          </>
                        ) : (
                          <>
                            <span className="truncate">{event.name}</span>
                            {(event.isPassed && !event.isToday) && (
                              <span className="text-xs text-muted-foreground ml-1">(next day)</span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 sm:mt-0">
                        {event.openingInLessThanHour && event.isNext && !event.isOpenNow ? (
                          <Badge
                            className="animate-pulse-moderate bg-purple-500/30 border-purple-400/60 text-purple-100 font-semibold text-xs flex items-center gap-1"
                          >
                            <Timer className="inline-block h-3 w-3 mr-1 text-purple-200" />
                            opens {event.countdown}
                          </Badge>
                        ) : event.opensTomorrow ? (
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 border-blue-500 bg-blue-950 text-blue-300 font-semibold"
                          >
                            opens
                          </Badge>
                        ) : (
                          (!event.isPassed && event.countdown && !event.isOpenNow && !event.openingInLessThanHour) && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1.5 border-border bg-card/80"
                            >
                              {event.countdown}
                            </Badge>
                          )
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
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComingUpEvents;

