
import React, { useEffect, useState } from "react";
import { getNextMajorEvent } from "@/services/calendarService";
import { Timer } from "lucide-react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { formatTimeUntil } from "@/utils/dateUtils";
import { ExternalLink } from "lucide-react";

interface NextMajorEvent {
  id: string;
  title: string;
  date: Date;
  impact: "low" | "medium" | "high";
  description?: string;
  source?: string;
}

export const NextMajorEventCountdown: React.FC = () => {
  const [event, setEvent] = useState<NextMajorEvent | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    getNextMajorEvent().then(res => {
      if (res) setEvent(res);
    });
    const int = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(int);
  }, []);

  if (!event) return null;

  return (
    <div className="relative bg-purple-950/80 text-primary-foreground rounded-xl px-4 py-3 flex flex-col gap-2 shadow-lg border border-mode-night/30 mb-2">
      <div className="flex items-center gap-3">
        <Timer className="h-5 w-5 text-mode-night-foreground shrink-0" />
        <div className="flex flex-col xs:flex-row gap-1 xs:gap-2 text-sm xs:text-base">
          <span className="font-medium">
            Next major event in {formatTimeUntil(event.date)}:
          </span>
          <span className="font-semibold text-warning truncate">
            {event.title}
          </span>
          <span className="hidden xs:inline text-xs text-mode-night-foreground ml-1">
            ({format(event.date, "HH:mm", { locale: enUS })})
          </span>
        </div>
        <span className={`ml-auto px-2 py-0.5 rounded text-xs font-semibold
          ${event.impact === "high" ? "bg-bearish text-primary-foreground" : event.impact === "medium" ? "bg-warning text-primary-foreground" : "bg-yellow-300 text-foreground"}
        `}>
          {event.impact === "high" ? "High Impact" : event.impact === "medium" ? "Medium" : "Low"}
        </span>
      </div>
      <div className="pl-8 mt-1 flex flex-col gap-2">
        <div className="text-xs mb-1 text-mode-night-foreground">
          <span className="text-primary-foreground font-semibold">Time:</span>{" "}
          <b>{format(event.date, "EEEE d MMMM 'at' HH:mm", { locale: enUS })}</b>
        </div>
        <div className="text-sm mb-2 text-primary-foreground">
          {event.description || "No description available."}
        </div>
        {event.source && (
          <a
            href={event.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-lightPurple-300 hover:text-warning text-xs underline font-medium transition"
            className="inline-flex items-center gap-1 text-mode-night-foreground hover:text-warning text-xs underline font-medium transition" // light purple
          >
            Go to livestream/news page
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
};
