
import React from 'react';
import { ImprovedEconomicCalendar } from '@/components/calendar/ImprovedEconomicCalendar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

const CalendarView = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Economic Events</h1>
          <p className="text-muted-foreground">
            Track market-moving economic events and announcements
          </p>
        </div>
        
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </Button>
      </div>
      
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Economic Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImprovedEconomicCalendar compact={false} />
        </CardContent>
      </Card>
      
      <div className="mt-6 text-xs text-muted-foreground text-center">
        <p>Data sourced from Bybit API and other public financial data sources. Updated in real-time.</p>
      </div>
    </div>
  );
};

export default CalendarView;
