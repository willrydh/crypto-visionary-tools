
import React, { useEffect, useState } from "react";
import { fetchEconomicEvents } from "@/services/calendarService";
import { format, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { sv } from "date-fns/locale";

interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  impact: "low" | "medium" | "high";
  date: Date;
}

interface Props {
  showHighOnly: boolean;
}

export const WeeklyImpactOverview: React.FC<Props> = ({ showHighOnly }) => {
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [weekEvents, setWeekEvents] = useState<Record<string, EconomicEvent[]>>({});

  useEffect(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    setWeekDays(days);

    fetchEconomicEvents(weekStart, weekEnd).then(events => {
      // Gruppar events per dag
      const grouped: Record<string, EconomicEvent[]> = {};
      days.forEach(day => {
        const ymd = day.toISOString().split("T")[0];
        grouped[ymd] = [];
      });
      events.forEach(ev => {
        const ymd = format(ev.date, "yyyy-MM-dd");
        grouped[ymd]?.push(ev);
      });
      setWeekEvents(grouped);
    });
  }, []);

  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-2">
      {weekDays.map(day => {
        const ymd = day.toISOString().split("T")[0];
        let events = weekEvents[ymd] || [];
        if (showHighOnly) events = events.filter(ev => ev.impact === "high");

        return (
          <div
            key={ymd}
            className="flex flex-col items-center justify-between py-1 px-0 bg-background rounded-md border border-border min-w-[34px] min-h-[54px] cursor-pointer hover:bg-primary/10 transition"
            title={format(day, "EEEE d MMM", { locale: sv })}
          >
            <span className="text-xs font-semibold text-muted-foreground mb-1">
              {format(day, "EEE", { locale: sv }).charAt(0).toUpperCase() +
                format(day, "EEE", { locale: sv }).slice(1)}
            </span>
            <div className="flex gap-0.5 flex-wrap justify-center items-center mx-auto min-h-[14px]">
              {events.length === 0 ? (
                <span className="w-2 h-2 rounded-full bg-border" />
              ) : (
                events.slice(0, 5).map((ev, i) => (
                  <span
                    key={ev.id}
                    className={`
                      w-2 h-2 rounded-full
                      ${ev.impact === "high" ? "bg-red-500" : ev.impact === "medium" ? "bg-orange-400" : "bg-yellow-300"}
                      mr-0.5
                    `}
                    title={ev.title}
                  />
                ))
              )}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">
              {day.getDate()}
            </span>
          </div>
        );
      })}
    </div>
  );
};
