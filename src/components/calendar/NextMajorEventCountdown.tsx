
import React, { useEffect, useState } from "react";
import { getNextMajorEvent } from "@/services/calendarService";
import { Timer, Info } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { formatTimeUntil } from "@/utils/dateUtils";

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
  const [showInfo, setShowInfo] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    getNextMajorEvent().then(res => {
      if (res) setEvent(res);
    });
    const int = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(int);
  }, []);

  if (!event) return null;

  // Visa countdown-badge och eventinfo vid klick
  return (
    <div className="relative bg-purple-950/80 text-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg border border-purple-900 mb-2 cursor-pointer hover:shadow-xl transition"
         onClick={() => setShowInfo(true)} tabIndex={0} role="button"
         title="Klicka för mer info om eventet">
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
      <Info className="h-4 w-4 text-purple-200 ml-auto" />
      {/* Modal/dropper */}
      {showInfo && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 w-[325px] sm:w-[375px] bg-background border border-border rounded-lg p-4 shadow-xl animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="h-4 w-4 text-purple-500" />
            <span className="font-bold text-base">{event.title}</span>
            <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold
              ${event.impact === "high" ? "bg-red-500 text-white" : event.impact === "medium" ? "bg-orange-400 text-white" : "bg-yellow-300 text-slate-900"}
            `}>
              {event.impact === "high" ? "Hög påverkan" : event.impact === "medium" ? "Medel" : "Låg"}
            </span>
          </div>
          <div className="text-xs mb-2">
            Tid: <b>{format(event.date, "EEEE d MMMM 'kl.' HH:mm", { locale: sv })}</b>
          </div>
          <div className="text-sm mb-3">
            {event.description || "Ingen beskrivning tillgänglig."}
          </div>
          {event.source && (
            <a href={event.source} target="_blank" rel="noopener noreferrer"
               className="text-purple-700 underline text-xs hover:opacity-80">
              Gå till källan/livestream
            </a>
          )}
          <button className="block mt-4 ml-auto px-3 py-1.5 rounded bg-purple-200 text-purple-900 text-xs font-semibold hover:bg-purple-300"
                  onClick={e => {e.stopPropagation(); setShowInfo(false);}}
          >
            Stäng
          </button>
        </div>
      )}
    </div>
  );
};
