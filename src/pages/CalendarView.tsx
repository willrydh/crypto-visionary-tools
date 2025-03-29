
import React from 'react';
import { EconomicCalendar } from '@/components/calendar/EconomicCalendar';

const CalendarView = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Economic Calendar</h1>
        <p className="text-muted-foreground">
          Upcoming economic events and market releases
        </p>
      </div>
      
      <div className="h-[calc(100vh-12rem)]">
        <EconomicCalendar />
      </div>
    </div>
  );
};

export default CalendarView;
