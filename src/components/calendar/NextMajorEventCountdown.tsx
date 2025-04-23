
import React, { useEffect, useState } from "react";
import { getNextMajorEvent } from "@/services/calendarService";
import { Timer } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
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

  // All info visas alltid direkt – ingen modal/dropdown
  return (
    <div className="relative bg-purple-950/80 text-white rounded-xl px-4 py-3 flex flex-col gap-2 shadow-lg border border-purple-900 mb-2">
      <div className="flex items-center gap-3">
        <Timer className="h-5 w-5 text-purple-200 shrink-0" />
        <div className="flex flex-col xs:flex-row gap-1 xs:gap-2 text-sm xs:text-base">
          <span className="font-medium">
            Nästa stora händelse om {formatTimeUntil(event.date)}:
          </span>
          <span className="font-semibold text-yellow-300 truncate">
            {event.title}
          </span>
          <span className="hidden xs:inline text-xs text-purple-200 ml-1">
            ({format(event.date, "HH:mm", { locale: sv })})
          </span>
        </div>
        <span className={`ml-auto px-2 py-0.5 rounded text-xs font-semibold
          ${event.impact === "high" ? "bg-red-500 text-white" : event.impact === "medium" ? "bg-orange-400 text-white" : "bg-yellow-300 text-slate-900"}
        `}>
          {event.impact === "high" ? "Hög påverkan" : event.impact === "medium" ? "Medel" : "Låg"}
        </span>
      </div>
      <div className="pl-8 mt-1 flex flex-col gap-2">
        <div className="text-xs mb-1 text-purple-200">
          <span className="text-white font-semibold">Tid:</span>{" "}
          <b>{format(event.date, "EEEE d MMMM 'kl.' HH:mm", { locale: sv })}</b>
        </div>
        <div className="text-sm mb-2 text-white">
          {event.description || "Ingen beskrivning tillgänglig."}
        </div>
        {event.source && (
          <a
            href={event.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-lightPurple-300 hover:text-yellow-300 text-xs underline font-medium transition"
            style={{ color: "#D6BCFA" }} // light purple
          >
            Till livestream/nyhetssida
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
};

