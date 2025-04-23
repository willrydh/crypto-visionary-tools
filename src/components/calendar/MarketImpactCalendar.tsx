
import React, { useState } from "react";
import { NextMajorEventCountdown } from "./NextMajorEventCountdown";
import { WeeklyImpactOverview } from "./WeeklyImpactOverview";
import { ImprovedEconomicCalendar } from "./ImprovedEconomicCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MarketImpactCalendar: React.FC = () => {
  const [showHighOnly, setShowHighOnly] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4 w-full">
      {/* Subtil countdown till nästa stora händelse */}
      <NextMajorEventCountdown />

      {/* Veckoöversikt (med filter för viktiga händelser) */}
      <div className="bg-card rounded-lg border border-border p-2 shadow-sm space-y-2 md:space-y-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="font-bold text-base flex items-center gap-1">
            Veckoöversikt
            <Badge className="bg-purple-600 ml-2 text-xs">NY</Badge>
          </h2>
          <button
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
              showHighOnly
                ? "bg-red-600 text-white"
                : "bg-muted hover:bg-amber-100 dark:bg-muted-foreground/10 dark:hover:bg-red-50"
            }`}
            onClick={() => setShowHighOnly((v) => !v)}
            aria-pressed={showHighOnly}
            data-testid="important-filter"
          >
            <Filter className="h-4 w-4" /> {showHighOnly ? "Visa alla" : "Endast viktiga"}
          </button>
        </div>
        <WeeklyImpactOverview showHighOnly={showHighOnly} />
      </div>

      {/* Kalenderlista dag/vecka/månad */}
      <Tabs defaultValue="today">
        <TabsList className="w-full mb-2">
          <TabsTrigger value="today" className="flex-1">Idag</TabsTrigger>
          <TabsTrigger value="week" className="flex-1">Vecka</TabsTrigger>
          <TabsTrigger value="month" className="flex-1">Månad</TabsTrigger>
        </TabsList>
        <TabsContent value="today">
          <ImprovedEconomicCalendar compact={true} title="Dagens händelser" />
        </TabsContent>
        <TabsContent value="week">
          <ImprovedEconomicCalendar compact={true} title="Veckans händelser" />
        </TabsContent>
        <TabsContent value="month">
          <ImprovedEconomicCalendar compact={true} title="Månadens händelser" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketImpactCalendar;
