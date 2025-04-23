
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowDown, CheckCircle } from 'lucide-react';
import { createUtcDate, getMarketTimeRemaining, getLocalTimeDisplay } from '@/utils/dateUtils';

// Tider i UTC
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
}

const ComingUpEvents = () => {
  const [events, setEvents] = useState<MarketEvent[]>([]);

  const updateEvents = () => {
    const now = new Date();
    const currentDay = now.getUTCDay();
    const isWeekend = currentDay === 0 || currentDay === 6; // Sun = 0, Sat = 6
    const currentTime = now.getUTCHours() + now.getUTCMinutes() / 60;

    const processedEvents: MarketEvent[] = MARKET_EVENTS.map(event => {
      // Räkna ut dagens session-starter och -slut
      const hour = Math.floor(event.time);
      const minute = Math.round((event.time - hour) * 60);

      // Sessionens öppnings- & stängnings-tider för idag (UTC)
      let eventOpenDate = new Date(now);
      eventOpenDate.setUTCHours(Math.floor(event.open), Math.round((event.open % 1) * 60), 0, 0);
      let eventCloseDate = new Date(now);
      eventCloseDate.setUTCHours(Math.floor(event.close), Math.round((event.close % 1) * 60), 0, 0);

      // Är det helg, lägg till till måndag
      let eventDate = new Date(now);
      let isToday = true;
      if (isWeekend && event.weekdaysOnly) {
        const daysUntilMonday = currentDay === 0 ? 1 : 2;
        eventDate.setUTCDate(eventDate.getUTCDate() + daysUntilMonday);
        eventOpenDate.setUTCDate(eventOpenDate.getUTCDate() + daysUntilMonday);
        eventCloseDate.setUTCDate(eventCloseDate.getUTCDate() + daysUntilMonday);
        isToday = false;
      }

      // Om redan passerat, slå över till nästa vardag (för "opens imorgon")
      let opensTomorrow = false;
      if (currentTime > event.close && event.weekdaysOnly && !isWeekend) {
        isToday = false;
        opensTomorrow = true;
        eventDate.setUTCDate(eventDate.getUTCDate() + 1);

        // Korrigera till måndag om imorgon är helg
        let newDay = eventDate.getUTCDay();
        if (newDay === 0) eventDate.setUTCDate(eventDate.getUTCDate() + 1);
        if (newDay === 6) eventDate.setUTCDate(eventDate.getUTCDate() + 2);

        // Sätt även eventOpenDate/eventCloseDate till rätt dag
        eventOpenDate = new Date(eventDate);
        eventOpenDate.setUTCHours(Math.floor(event.open), Math.round((event.open % 1) * 60), 0, 0);
        eventCloseDate = new Date(eventDate);
        eventCloseDate.setUTCHours(Math.floor(event.close), Math.round((event.close % 1) * 60), 0, 0);
      }

      // Är sessionen öppen nu?
      const isOpenNow =
        !isWeekend &&
        currentTime >= event.open &&
        currentTime < event.close &&
        event.weekdaysOnly;

      // "Opening soon": Marknad öppnar inom 1h
      const isOpeningSoon =
        !isOpenNow &&
        !isWeekend &&
        currentTime < event.open &&
        event.open - currentTime <= 1 &&
        event.weekdaysOnly;

      // Har eventet redan passerats idag (stängd, snart öppnar imorgon)?
      const isPassed = (!isOpenNow && currentTime > event.close) || opensTomorrow;

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
        isNext: false // Vi sätter detta separat nedan
      };
    });

    // Sortera, hitta nästa event inför öppning eller öppen
    const sortedEvents = processedEvents.sort((a, b) => a.time - b.time);
    // "Next" är antingen den som är närmast öppnar snart ELLER öppen session just nu
    const nextIndex = sortedEvents.findIndex(
      event => (event.isOpenNow && event.isToday) || (!event.isOpenNow && !event.isPassed && event.isToday)
    );

    // Sätt isNext för highlight
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
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={`${event.time}-${event.name}`}
                className={`flex items-start gap-3 ${event.isNext ? 'animate-pulse' : ''}`}
              >
                <div
                  className={`relative z-10 mt-1.5 h-3 w-3 rounded-full border-2 
                    ${event.isNext
                      ? 'bg-purple-400 border-purple-300'
                      : event.isOpenNow
                        ? 'bg-green-500 border-green-400'
                        : event.isPassed
                          ? 'bg-slate-700 border-slate-600'
                          : 'bg-slate-700 border-slate-600'}`} />

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="font-medium text-sm flex items-center gap-1.5">
                      {event.isOpenNow && event.isToday ? (
                        <>
                          {event.name} <span className="font-bold text-green-500">is OPEN</span>
                        </>
                      ) : event.opensTomorrow ? (
                        <>
                          {event.name} <span className="font-bold text-blue-500">opens</span> <span>{event.localTime}</span>
                        </>
                      ) : (
                        <>
                          {event.name}
                          {(event.isPassed && !event.isToday) && (
                            <span className="text-xs text-muted-foreground ml-1">(next day)</span>
                          )}
                        </>
                      )}
                      {event.isOpenNow && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={`text-xs px-1.5 ${
                          event.isOpenNow && event.isToday
                            ? 'border-green-500 bg-green-950 text-green-400 font-bold'
                            : event.isNext && !event.isOpenNow 
                              ? 'border-purple-400/30 bg-purple-900/20 text-purple-300'
                              : event.isPassed
                                ? 'border-border bg-card/80'
                                : 'border-border bg-card/80'
                        }`}
                      >
                        {event.isOpenNow && event.isToday
                          ? "OPEN"
                          : event.opensTomorrow
                            ? "opens"
                            : event.isNext && !event.isOpenNow
                              ? "opens"
                              : event.countdown
                        }
                      </Badge>
                      {/* Countdown endast inför öppning */}
                      {event.isNext && !event.isOpenNow && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                          {event.countdown}
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

