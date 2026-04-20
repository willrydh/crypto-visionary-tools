
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
      <NextMajorEventCountdown />

      <div className="bg-card rounded-lg border border-border p-2 shadow-sm space-y-2 md:space-y-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="font-bold text-base flex items-center gap-1">
            Weekly Overview
            <Badge className="bg-mode-night ml-2 text-xs">NEW</Badge>
          </h2>
          <button
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
              showHighOnly
                ? "bg-bearish text-primary-foreground"
                : "bg-muted hover:bg-warning/10 bg-muted-foreground/10 hover:bg-bearish/10"
            }`}
            onClick={() => setShowHighOnly((v) => !v)}
            aria-pressed={showHighOnly}
            data-testid="important-filter"
          >
            <Filter className="h-4 w-4" /> {showHighOnly ? "Show All" : "Important Only"}
          </button>
        </div>
        <WeeklyImpactOverview showHighOnly={showHighOnly} />
      </div>

      <Tabs defaultValue="today">
        <TabsList className="w-full mb-2">
          <TabsTrigger value="today" className="flex-1">Today</TabsTrigger>
          <TabsTrigger value="week" className="flex-1">Week</TabsTrigger>
          <TabsTrigger value="month" className="flex-1">Month</TabsTrigger>
        </TabsList>
        <TabsContent value="today">
          <ImprovedEconomicCalendar compact={true} title="Today's Events" />
        </TabsContent>
        <TabsContent value="week">
          <ImprovedEconomicCalendar compact={true} title="Week's Events" />
        </TabsContent>
        <TabsContent value="month">
          <ImprovedEconomicCalendar compact={true} title="Month's Events" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketImpactCalendar;
