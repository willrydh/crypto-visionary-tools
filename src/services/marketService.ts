
import { MarketSession } from '@/contexts/MarketsContext';
import { formatTimeUntil } from '@/utils/dateUtils';

// Fetch market sessions with status based on current time
export const fetchMarketSessions = async (): Promise<MarketSession[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const hour = now.getUTCHours();
  const dayOfWeek = now.getUTCDay(); // 0 is Sunday, 6 is Saturday
  
  // Check if it's weekend (Saturday or Sunday)
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Get next Monday for weekend calculations
  const nextMonday = new Date(now);
  if (dayOfWeek === 6) { // Saturday
    nextMonday.setUTCDate(nextMonday.getUTCDate() + 2);
  } else if (dayOfWeek === 0) { // Sunday
    nextMonday.setUTCDate(nextMonday.getUTCDate() + 1);
  }
  nextMonday.setUTCHours(0, 0, 0, 0);
  
  // Market session hours in UTC
  // Tokyo: UTC 0:00-9:00 (Monday-Friday)
  // London: UTC 8:00-16:00 (Monday-Friday)
  // New York: UTC 13:00-20:00 (Monday-Friday)
  // Frankfurt: UTC 7:00-15:30 (Monday-Friday)
  // Hong Kong: UTC 1:00-8:00 (Monday-Friday)
  
  const sessions: MarketSession[] = [
    {
      name: 'Tokyo',
      status: isWeekend ? 'closed' : (hour >= 0 && hour < 9) ? 'open' : (hour >= 22) ? 'opening-soon' : 'closed',
      hours: '00:00-09:00 UTC (Mon-Fri)',
      nextEvent: {
        type: isWeekend ? 'open' : (hour >= 0 && hour < 9) ? 'close' : 'open',
        time: isWeekend ? 
          new Date(new Date(nextMonday).setUTCHours(0, 0, 0, 0)) : 
          new Date(
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
      status: isWeekend ? 'closed' : (hour >= 8 && hour < 16) ? 'open' : (hour >= 7 && hour < 8) ? 'opening-soon' : 'closed',
      hours: '08:00-16:00 UTC (Mon-Fri)',
      nextEvent: {
        type: isWeekend ? 'open' : (hour >= 8 && hour < 16) ? 'close' : 'open',
        time: isWeekend ? 
          new Date(new Date(nextMonday).setUTCHours(8, 0, 0, 0)) : 
          new Date(
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
      status: isWeekend ? 'closed' : (hour >= 13 && hour < 20) ? 'open' : (hour >= 12 && hour < 13) ? 'opening-soon' : 'closed',
      hours: '13:00-20:00 UTC (Mon-Fri)',
      nextEvent: {
        type: isWeekend ? 'open' : (hour >= 13 && hour < 20) ? 'close' : 'open',
        time: isWeekend ? 
          new Date(new Date(nextMonday).setUTCHours(13, 0, 0, 0)) : 
          new Date(
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
      status: isWeekend ? 'closed' : (hour >= 7 && hour < 15.5) ? 'open' : (hour >= 6 && hour < 7) ? 'opening-soon' : 'closed',
      hours: '07:00-15:30 UTC (Mon-Fri)',
      nextEvent: {
        type: isWeekend ? 'open' : (hour >= 7 && hour < 15.5) ? 'close' : 'open',
        time: isWeekend ? 
          new Date(new Date(nextMonday).setUTCHours(7, 0, 0, 0)) : 
          new Date(
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
      status: isWeekend ? 'closed' : (hour >= 1 && hour < 8) ? 'open' : (hour >= 0 && hour < 1) ? 'opening-soon' : 'closed',
      hours: '01:00-08:00 UTC (Mon-Fri)',
      nextEvent: {
        type: isWeekend ? 'open' : (hour >= 1 && hour < 8) ? 'close' : 'open',
        time: isWeekend ? 
          new Date(new Date(nextMonday).setUTCHours(1, 0, 0, 0)) : 
          new Date(
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
