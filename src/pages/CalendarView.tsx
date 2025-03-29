
import React from 'react';
import { ImprovedEconomicCalendar } from '@/components/calendar/ImprovedEconomicCalendar';

const CalendarView = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4">
      <div>
        <h1 className="text-2xl font-bold">Economic Events</h1>
        <p className="text-muted-foreground">
          Track market-moving economic events and announcements
        </p>
      </div>
      
      <ImprovedEconomicCalendar compact={false} />
    </div>
  );
};

export default CalendarView;
