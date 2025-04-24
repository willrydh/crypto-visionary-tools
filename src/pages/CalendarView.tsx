
import React from "react";
import MarketImpactCalendar from "@/components/calendar/MarketImpactCalendar";
import { Button } from "@/components/ui/button";
import { ScanSearch } from "lucide-react";
import { Link } from "react-router-dom";

const CalendarView = () => {
  return (
    <div className="min-h-[80vh] pt-16 md:pt-20">
      <div className="container mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Market Calendar</h1>
          <Link to="/entry-scanner">
            <Button variant="outline" className="gap-2">
              <ScanSearch className="h-4 w-4" />
              <span>Entry Scanner</span>
            </Button>
          </Link>
        </div>
      </div>
      <MarketImpactCalendar />
    </div>
  );
};

export default CalendarView;
