
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import DataStatusIndicator from '@/components/dashboard/DataStatusIndicator';
import { Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EconomicEvent {
  date: string;
  country: string;
  category: string;
  event: string;
  reference: string;
  source: string;
  actual: string;
  previous: string;
  forecast: string;
  importance: number;
}

const getImportanceBadge = (importance: number) => {
  if (importance === 3) return <Badge className="bg-red-500">High</Badge>;
  if (importance === 2) return <Badge className="bg-yellow-500">Medium</Badge>;
  return <Badge variant="outline">Low</Badge>;
};

const getCountryFlag = (country: string) => {
  // Map of country codes to emoji flags
  const countryFlags: Record<string, string> = {
    'United States': '🇺🇸',
    'Euro Area': '🇪🇺',
    'China': '🇨🇳',
    'Japan': '🇯🇵',
    'United Kingdom': '🇬🇧',
    'Australia': '🇦🇺',
    'Canada': '🇨🇦',
    'Switzerland': '🇨🇭',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Italy': '🇮🇹',
    'Spain': '🇪🇸',
    'Brazil': '🇧🇷',
    'India': '🇮🇳',
    'Russia': '🇷🇺',
    'South Korea': '🇰🇷',
    'Mexico': '🇲🇽',
    'Singapore': '🇸🇬',
    'New Zealand': '🇳🇿',
    'Sweden': '🇸🇪',
    'Norway': '🇳🇴',
  };
  
  return countryFlags[country] || '🌍';
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (e) {
    return dateString;
  }
};

// Fallback mock data for when the API is unavailable
const generateMockEvents = (): EconomicEvent[] => {
  return [
    {
      date: new Date().toISOString(),
      country: 'United States',
      category: 'Employment',
      event: 'Non-Farm Payrolls',
      reference: 'MAR',
      source: 'Bureau of Labor Statistics',
      actual: '236K',
      previous: '311K',
      forecast: '230K',
      importance: 3
    },
    {
      date: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
      country: 'Euro Area',
      category: 'Inflation',
      event: 'Consumer Price Index (YoY)',
      reference: 'MAR',
      source: 'Eurostat',
      actual: '',
      previous: '8.5%',
      forecast: '8.1%',
      importance: 3
    },
    {
      date: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
      country: 'United Kingdom',
      category: 'Interest Rate Decision',
      event: 'BoE Interest Rate Decision',
      reference: 'APR',
      source: 'Bank of England',
      actual: '',
      previous: '4.25%',
      forecast: '4.25%',
      importance: 3
    },
    {
      date: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
      country: 'Japan',
      category: 'Economic Activity',
      event: 'Industrial Production MoM',
      reference: 'FEB',
      source: 'METI',
      actual: '',
      previous: '4.3%',
      forecast: '2.7%',
      importance: 2
    },
    {
      date: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
      country: 'Australia',
      category: 'Employment',
      event: 'Unemployment Rate',
      reference: 'MAR',
      source: 'Australian Bureau of Statistics',
      actual: '',
      previous: '3.5%',
      forecast: '3.6%',
      importance: 2
    },
    {
      date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      country: 'China',
      category: 'Trade',
      event: 'Trade Balance',
      reference: 'MAR',
      source: 'General Administration of Customs',
      actual: '',
      previous: '$116.88B',
      forecast: '$90.0B',
      importance: 2
    },
    {
      date: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
      country: 'Canada',
      category: 'Housing',
      event: 'Housing Starts',
      reference: 'MAR',
      source: 'Canada Mortgage and Housing Corporation',
      actual: '',
      previous: '244.0K',
      forecast: '240.0K',
      importance: 1
    }
  ];
};

const EconomicCalendarAPI = () => {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const fetchEconomicCalendar = async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const url = 'https://tradingeconomics.p.rapidapi.com/calendar';
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '55a4e9c1b6msh3af8f72d914dd9dp1bf190jsn0078c2d369a0',
          'X-RapidAPI-Host': 'tradingeconomics.p.rapidapi.com'
        }
      };
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (Array.isArray(result)) {
        // Sort by date and importance, then get the top 10
        const sortedEvents = result
          .sort((a, b) => {
            // First sort by date (newest first)
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (dateA !== dateB) return dateA - dateB;
            
            // Then by importance (highest first)
            return b.importance - a.importance;
          })
          .slice(0, 10);
          
        setEvents(sortedEvents);
        setIsLoading(false);
        
        toast({
          title: 'Success',
          description: 'Economic calendar data updated successfully',
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching economic calendar:', error);
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to fetch economic calendar');
      
      // Use mock data as fallback
      const mockEvents = generateMockEvents();
      setEvents(mockEvents);
      
      setIsLoading(false);
      
      toast({
        title: 'Error',
        description: 'Using fallback economic calendar data',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchEconomicCalendar();
  }, []);

  const handleRefresh = () => {
    fetchEconomicCalendar();
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Economic Calendar</CardTitle>
          <CardDescription>
            Upcoming market-moving events
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="space-y-4">
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium">Time</th>
                    <th className="p-2 text-left font-medium">Country</th>
                    <th className="p-2 text-left font-medium">Event</th>
                    <th className="p-2 text-right font-medium">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                      <td className="p-2 text-left">
                        {formatDate(event.date)}
                      </td>
                      <td className="p-2 text-left">
                        <div className="flex items-center">
                          <span className="mr-1.5">{getCountryFlag(event.country)}</span>
                          <span className="hidden md:inline">{event.country}</span>
                        </div>
                      </td>
                      <td className="p-2 text-left">{event.event}</td>
                      <td className="p-2 text-right">
                        {getImportanceBadge(event.importance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : !isLoading && (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Calendar className="h-10 w-10 mb-2" />
            <p>No upcoming events found</p>
          </div>
        )}
        
        <DataStatusIndicator 
          isLoading={isLoading} 
          isError={isError} 
          errorMessage={errorMessage} 
        />
      </CardContent>
    </Card>
  );
};

export default EconomicCalendarAPI;
