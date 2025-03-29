
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RefreshCw, Filter, Info } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from '@/utils/dateUtils';
import { fetchEconomicEvents, EconomicEvent, getAvailableCountries, getAvailableEventTypes } from '@/services/calendarService';

interface EconomicCalendarProps {
  compact?: boolean;
}

export const EconomicCalendar: React.FC<EconomicCalendarProps> = ({ compact = false }) => {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filters, setFilters] = useState<{
    countries: string[];
    impact: ('low' | 'medium' | 'high')[];
    types: string[];
  }>({
    countries: [],
    impact: ['high'],
    types: []
  });
  
  // Available filter options
  const countries = getAvailableCountries();
  const eventTypes = getAvailableEventTypes();
  
  // Fetch events when date or filters change
  useEffect(() => {
    if (!selectedDate) return;
    
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        // When fetching events, include the full day
        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);
        
        const fetchedEvents = await fetchEconomicEvents(startDate, endDate, filters);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching economic events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, [selectedDate, filters]);
  
  // Get impact badge style
  const getImpactBadge = (impact: 'low' | 'medium' | 'high') => {
    switch(impact) {
      case 'high':
        return <Badge className="bg-red-500 text-white">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Toggle a country filter
  const toggleCountryFilter = (country: string) => {
    setFilters(prev => ({
      ...prev,
      countries: prev.countries.includes(country)
        ? prev.countries.filter(c => c !== country)
        : [...prev.countries, country]
    }));
  };
  
  // Toggle an impact filter
  const toggleImpactFilter = (impact: 'low' | 'medium' | 'high') => {
    setFilters(prev => ({
      ...prev,
      impact: prev.impact.includes(impact)
        ? prev.impact.filter(i => i !== impact)
        : [...prev.impact, impact]
    }));
  };
  
  // Toggle an event type filter
  const toggleTypeFilter = (type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      countries: [],
      impact: ['high'],
      types: []
    });
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Economic Calendar</CardTitle>
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Calendar Filters</SheetTitle>
                  <SheetDescription>
                    Filter economic events by country, impact, and type.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Impact</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="high-impact" 
                          checked={filters.impact.includes('high')}
                          onCheckedChange={() => toggleImpactFilter('high')}
                        />
                        <label htmlFor="high-impact" className="text-sm">High</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="medium-impact" 
                          checked={filters.impact.includes('medium')}
                          onCheckedChange={() => toggleImpactFilter('medium')}
                        />
                        <label htmlFor="medium-impact" className="text-sm">Medium</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="low-impact" 
                          checked={filters.impact.includes('low')}
                          onCheckedChange={() => toggleImpactFilter('low')}
                        />
                        <label htmlFor="low-impact" className="text-sm">Low</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Countries</label>
                    <div className="grid grid-cols-2 gap-2">
                      {countries.map(country => (
                        <div key={country.code} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`country-${country.code}`} 
                            checked={filters.countries.includes(country.code)}
                            onCheckedChange={() => toggleCountryFilter(country.code)}
                          />
                          <label htmlFor={`country-${country.code}`} className="text-sm">{country.name}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event Types</label>
                    <div className="grid grid-cols-2 gap-2">
                      {eventTypes.map(type => (
                        <div key={type.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`type-${type.id}`} 
                            checked={filters.types.includes(type.id)}
                            onCheckedChange={() => toggleTypeFilter(type.id)}
                          />
                          <label htmlFor={`type-${type.id}`} className="text-sm">{type.name}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="w-full mt-4"
                  >
                    Reset Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {
                setSelectedDate(new Date());
              }}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!compact && (
          <div className="mb-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="border rounded-md"
            />
          </div>
        )}
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Info className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No economic events found for {formatDate(selectedDate || new Date())}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  // Try another date
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setSelectedDate(tomorrow);
                }}
              >
                Try Tomorrow
              </Button>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="space-y-1 py-2 border-b last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{event.country}</Badge>
                      {getImpactBadge(event.impact)}
                    </div>
                    <h4 className="font-medium mt-1">{event.title}</h4>
                  </div>
                  <div className="text-sm text-right">
                    {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {!compact && (
                  <div className="grid grid-cols-3 gap-2 mt-2 text-sm text-muted-foreground">
                    <div>
                      <p className="text-xs">Previous</p>
                      <p className="font-mono">{event.previous || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs">Forecast</p>
                      <p className="font-mono">{event.forecast || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs">Actual</p>
                      <p className="font-mono">{event.actual || 'Pending'}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
