
// Economic Calendar Service

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  impact: 'low' | 'medium' | 'high';
  date: Date;
  forecast?: string;
  previous?: string;
  actual?: string;
  description?: string;
  type: string; // 'cpi', 'interest_rate', 'nfp', 'gdp', etc.
}

// Function to fetch economic events for a given date range
export const fetchEconomicEvents = async (
  startDate: Date,
  endDate: Date,
  filters?: {
    countries?: string[];
    impact?: ('low' | 'medium' | 'high')[];
    types?: string[];
  }
): Promise<EconomicEvent[]> => {
  // This would be an API call to a service like ForexFactory in production
  // For development, we'll generate mock events
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate some mock events over the date range
  const events: EconomicEvent[] = [];
  
  // Create events for each day in the range
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Skip weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      // Add 1-3 events per day
      const eventsPerDay = 1 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < eventsPerDay; i++) {
        events.push(generateMockEvent(new Date(currentDate)));
      }
    }
    
    // Go to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Apply filters if provided
  let filteredEvents = events;
  
  if (filters) {
    if (filters.countries && filters.countries.length > 0) {
      filteredEvents = filteredEvents.filter(event => 
        filters.countries?.includes(event.country)
      );
    }
    
    if (filters.impact && filters.impact.length > 0) {
      filteredEvents = filteredEvents.filter(event => 
        filters.impact?.includes(event.impact)
      );
    }
    
    if (filters.types && filters.types.length > 0) {
      filteredEvents = filteredEvents.filter(event => 
        filters.types?.includes(event.type)
      );
    }
  }
  
  return filteredEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
};

// Get the next major economic event
export const getNextMajorEvent = async (): Promise<EconomicEvent | null> => {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);
  
  const events = await fetchEconomicEvents(now, nextWeek, {
    impact: ['high']
  });
  
  // Find the first event that hasn't happened yet
  const nextEvent = events.find(event => event.date > now);
  
  return nextEvent || null;
};

// Helper function to generate a mock economic event
const generateMockEvent = (date: Date): EconomicEvent => {
  const eventTypes = [
    { type: 'cpi', title: 'Consumer Price Index' },
    { type: 'interest_rate', title: 'Interest Rate Decision' },
    { type: 'nfp', title: 'Non-Farm Payrolls' },
    { type: 'gdp', title: 'Gross Domestic Product' },
    { type: 'retail_sales', title: 'Retail Sales' },
    { type: 'pmi', title: 'Purchasing Managers Index' },
    { type: 'unemployment', title: 'Unemployment Rate' },
    { type: 'fomc', title: 'FOMC Statement' },
    { type: 'trade_balance', title: 'Trade Balance' },
    { type: 'earnings', title: 'Earnings Report' }
  ];
  
  const countries = ['US', 'EU', 'UK', 'JP', 'CN', 'AU', 'CA', 'DE', 'FR', 'IT'];
  const impacts: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  
  // Select random event type and country
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const country = countries[Math.floor(Math.random() * countries.length)];
  const impact = impacts[Math.floor(Math.random() * impacts.length)];
  
  // Generate a random time during business hours
  const hours = 8 + Math.floor(Math.random() * 9); // 8 AM to 5 PM
  const minutes = Math.floor(Math.random() * 60);
  
  const eventDate = new Date(date);
  eventDate.setHours(hours, minutes, 0, 0);
  
  // Generate mock data values
  const previous = (Math.random() * 5 + 1).toFixed(1) + '%';
  const forecast = (parseFloat(previous) + (Math.random() * 0.6 - 0.3)).toFixed(1) + '%';
  const hasActual = eventDate < new Date();
  const actual = hasActual 
    ? (parseFloat(forecast) + (Math.random() * 0.4 - 0.2)).toFixed(1) + '%'
    : undefined;
  
  return {
    id: `${eventType.type}-${country}-${eventDate.getTime()}`,
    title: `${country} ${eventType.title}`,
    country,
    impact,
    date: eventDate,
    forecast,
    previous,
    actual,
    description: `${country} ${eventType.title} release for ${eventDate.toLocaleString('default', { month: 'long' })}`,
    type: eventType.type
  };
};

// Get available event types
export const getAvailableEventTypes = (): { id: string; name: string }[] => {
  return [
    { id: 'cpi', name: 'CPI' },
    { id: 'interest_rate', name: 'Interest Rate' },
    { id: 'nfp', name: 'Non-Farm Payrolls' },
    { id: 'gdp', name: 'GDP' },
    { id: 'retail_sales', name: 'Retail Sales' },
    { id: 'pmi', name: 'PMI' },
    { id: 'unemployment', name: 'Unemployment' },
    { id: 'fomc', name: 'FOMC' },
    { id: 'trade_balance', name: 'Trade Balance' },
    { id: 'earnings', name: 'Earnings' }
  ];
};

// Get available countries
export const getAvailableCountries = (): { code: string; name: string }[] => {
  return [
    { code: 'US', name: 'United States' },
    { code: 'EU', name: 'European Union' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' },
    { code: 'AU', name: 'Australia' },
    { code: 'CA', name: 'Canada' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' }
  ];
};
