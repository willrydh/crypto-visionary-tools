
import { MarketSession } from '@/contexts/MarketsContext';
import { formatTimeUntil } from '@/utils/dateUtils';

// Fetch market sessions with status based on current time
export const fetchMarketSessions = async (): Promise<MarketSession[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const hour = now.getUTCHours();
  
  // Market session hours in UTC
  // Tokyo: UTC 0:00-9:00
  // London: UTC 8:00-16:00
  // New York: UTC 13:00-20:00
  // Frankfurt: UTC 7:00-15:30
  // Hong Kong: UTC 1:00-8:00
  
  const sessions: MarketSession[] = [
    {
      name: 'Tokyo',
      status: (hour >= 0 && hour < 9) ? 'open' : (hour >= 22) ? 'opening-soon' : 'closed',
      hours: '00:00-09:00 UTC',
      nextEvent: {
        type: (hour >= 0 && hour < 9) ? 'close' : 'open',
        time: new Date(
          now.getFullYear(), 
          now.getMonth(), 
          now.getDate() + ((hour >= 9) ? 1 : 0), 
          (hour >= 0 && hour < 9) ? 9 : 0,
          0
        )
      },
      timezone: 'UTC'
    },
    {
      name: 'London',
      status: (hour >= 8 && hour < 16) ? 'open' : (hour >= 7 && hour < 8) ? 'opening-soon' : 'closed',
      hours: '08:00-16:00 UTC',
      nextEvent: {
        type: (hour >= 8 && hour < 16) ? 'close' : 'open',
        time: new Date(
          now.getFullYear(), 
          now.getMonth(), 
          now.getDate() + ((hour >= 16) ? 1 : 0), 
          (hour >= 8 && hour < 16) ? 16 : 8,
          0
        )
      },
      timezone: 'UTC'
    },
    {
      name: 'New York',
      status: (hour >= 13 && hour < 20) ? 'open' : (hour >= 12 && hour < 13) ? 'opening-soon' : 'closed',
      hours: '13:00-20:00 UTC',
      nextEvent: {
        type: (hour >= 13 && hour < 20) ? 'close' : 'open',
        time: new Date(
          now.getFullYear(), 
          now.getMonth(), 
          now.getDate() + ((hour >= 20) ? 1 : 0), 
          (hour >= 13 && hour < 20) ? 20 : 13,
          0
        )
      },
      timezone: 'UTC'
    },
    {
      name: 'Frankfurt',
      status: (hour >= 7 && hour < 15.5) ? 'open' : (hour >= 6 && hour < 7) ? 'opening-soon' : 'closed',
      hours: '07:00-15:30 UTC',
      nextEvent: {
        type: (hour >= 7 && hour < 15.5) ? 'close' : 'open',
        time: new Date(
          now.getFullYear(), 
          now.getMonth(), 
          now.getDate() + ((hour >= 15.5) ? 1 : 0), 
          (hour >= 7 && hour < 15.5) ? 15 : 7,
          30 * ((hour >= 7 && hour < 15.5) ? 1 : 0)
        )
      },
      timezone: 'UTC'
    },
    {
      name: 'Hong Kong',
      status: (hour >= 1 && hour < 8) ? 'open' : (hour >= 0 && hour < 1) ? 'opening-soon' : 'closed',
      hours: '01:00-08:00 UTC',
      nextEvent: {
        type: (hour >= 1 && hour < 8) ? 'close' : 'open',
        time: new Date(
          now.getFullYear(), 
          now.getMonth(), 
          now.getDate() + ((hour >= 8) ? 1 : 0), 
          (hour >= 1 && hour < 8) ? 8 : 1,
          0
        )
      },
      timezone: 'UTC'
    }
  ];
  
  return sessions;
};

// Get crypto market status (always open)
export const getCryptoMarketStatus = () => {
  return {
    status: 'open',
    message: 'Crypto markets operate 24/7',
    nextMajorEvent: null
  };
};
