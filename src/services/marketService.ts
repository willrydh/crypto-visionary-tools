
import { MarketSession } from '@/contexts/MarketsContext';
import { 
  formatTimeUntil, 
  getNextOccurrence, 
  getTimezoneOffsetHours,
  getLocalTimeDisplay,
  getPreciseMarketTime,
  getMarketTimeRemaining,
  getTimezoneAbbreviation
} from '@/utils/dateUtils';

// Fetch market sessions with status based on current time
export const fetchMarketSessions = async (): Promise<MarketSession[]> => {
  // In a real implementation, this would call an external API
  // For now, we'll use accurate calculations based on current time
  
  const now = new Date();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const hour = now.getUTCHours();
  const minute = now.getUTCMinutes();
  const currentTime = hour + (minute / 60);
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
  
  // Define accurate market hours in UTC
  // These hours are fixed and correct for UTC time
  const marketHours = {
    tokyo: { open: 0, close: 9 },             // Tokyo: UTC 0:00-9:00
    london: { open: 8, close: 16.5 },         // London: UTC 8:00-16:30
    newYork: { open: 13.5, close: 20 },       // New York: UTC 13:30-20:00 (9:30am-4pm EST)
    frankfurt: { open: 8, close: 16.5 },      // Frankfurt: UTC 8:00-16:30
    hongKong: { open: 1, close: 8 }           // Hong Kong: UTC 1:00-8:00
  };
  
  // Format market hours for display in local timezone
  const formatMarketHours = (openUtc: number, closeUtc: number): string => {
    const openMinutes = Math.floor((openUtc % 1) * 60);
    const closeMinutes = Math.floor((closeUtc % 1) * 60);
    
    const openHour = Math.floor(openUtc);
    const closeHour = Math.floor(closeUtc);
    
    const timezoneAbbr = getTimezoneAbbreviation();
    const localOpenHour = (openHour + getTimezoneOffsetHours() + 24) % 24;
    const localCloseHour = (closeHour + getTimezoneOffsetHours() + 24) % 24;
    
    return `${localOpenHour.toString().padStart(2, '0')}:${openMinutes.toString().padStart(2, '0')}-${localCloseHour.toString().padStart(2, '0')}:${closeMinutes.toString().padStart(2, '0')} ${timezoneAbbr} (Mon-Fri)`;
  };
  
  // Calculate the next opening/closing time with precise timing
  const calculateNextEvent = (market: any, isOpen: boolean): Date => {
    // Extract open/close hours and minutes
    const openHour = Math.floor(market.open);
    const openMinute = Math.round((market.open % 1) * 60);
    const closeHour = Math.floor(market.close);
    const closeMinute = Math.round((market.close % 1) * 60);
    
    if (isWeekend) {
      // If weekend, next opening is Monday
      return getPreciseMarketTime(openHour, openMinute);
    }
    
    if (isOpen) {
      // If market is open, next event is closing
      const closeTime = new Date(now);
      closeTime.setUTCHours(closeHour, closeMinute, 0, 0);
      
      // If closing time has already passed today, set for next business day
      if (closeTime <= now) {
        return getPreciseMarketTime(closeHour, closeMinute);
      }
      
      return closeTime;
    } else {
      // Market is closed
      if (currentTime < market.open) {
        // Will open later today
        return getPreciseMarketTime(openHour, openMinute);
      } else {
        // Will open tomorrow or next business day
        return getPreciseMarketTime(openHour, openMinute);
      }
    }
  };

  // Function to determine if market is opening soon (within next hour)
  const isOpeningSoon = (marketOpenTime: number) => {
    // If market opens within the next hour, it's "opening soon"
    return !isWeekend && 
           currentTime < marketOpenTime && 
           (marketOpenTime - currentTime) <= 1;
  };
  
  // Create market sessions with accurate statuses and next event times
  const sessions: MarketSession[] = [
    {
      name: 'Tokyo',
      status: isWeekend ? 'closed' : 
              (currentTime >= marketHours.tokyo.open && currentTime < marketHours.tokyo.close) ? 'open' : 
              isOpeningSoon(marketHours.tokyo.open) ? 'opening-soon' : 'closed',
      hours: formatMarketHours(marketHours.tokyo.open, marketHours.tokyo.close),
      nextEvent: {
        type: isWeekend ? 'open' : 
              (currentTime >= marketHours.tokyo.open && currentTime < marketHours.tokyo.close) ? 'close' : 'open',
        time: calculateNextEvent(marketHours.tokyo, 
                 (currentTime >= marketHours.tokyo.open && currentTime < marketHours.tokyo.close))
      },
      timezone: userTimezone
    },
    {
      name: 'London',
      status: isWeekend ? 'closed' : 
              (currentTime >= marketHours.london.open && currentTime < marketHours.london.close) ? 'open' : 
              isOpeningSoon(marketHours.london.open) ? 'opening-soon' : 'closed',
      hours: formatMarketHours(marketHours.london.open, marketHours.london.close),
      nextEvent: {
        type: isWeekend ? 'open' : 
              (currentTime >= marketHours.london.open && currentTime < marketHours.london.close) ? 'close' : 'open',
        time: calculateNextEvent(marketHours.london, 
                 (currentTime >= marketHours.london.open && currentTime < marketHours.london.close))
      },
      timezone: userTimezone
    },
    {
      name: 'New York',
      status: isWeekend ? 'closed' : 
              (currentTime >= marketHours.newYork.open && currentTime < marketHours.newYork.close) ? 'open' : 
              isOpeningSoon(marketHours.newYork.open) ? 'opening-soon' : 'closed',
      hours: formatMarketHours(marketHours.newYork.open, marketHours.newYork.close),
      nextEvent: {
        type: isWeekend ? 'open' : 
              (currentTime >= marketHours.newYork.open && currentTime < marketHours.newYork.close) ? 'close' : 'open',
        time: calculateNextEvent(marketHours.newYork, 
                 (currentTime >= marketHours.newYork.open && currentTime < marketHours.newYork.close))
      },
      timezone: userTimezone
    },
    {
      name: 'Frankfurt',
      status: isWeekend ? 'closed' : 
              (currentTime >= marketHours.frankfurt.open && currentTime < marketHours.frankfurt.close) ? 'open' : 
              isOpeningSoon(marketHours.frankfurt.open) ? 'opening-soon' : 'closed',
      hours: formatMarketHours(marketHours.frankfurt.open, marketHours.frankfurt.close),
      nextEvent: {
        type: isWeekend ? 'open' : 
              (currentTime >= marketHours.frankfurt.open && currentTime < marketHours.frankfurt.close) ? 'close' : 'open',
        time: calculateNextEvent(marketHours.frankfurt, 
                 (currentTime >= marketHours.frankfurt.open && currentTime < marketHours.frankfurt.close))
      },
      timezone: userTimezone
    },
    {
      name: 'Hong Kong',
      status: isWeekend ? 'closed' : 
              (currentTime >= marketHours.hongKong.open && currentTime < marketHours.hongKong.close) ? 'open' : 
              isOpeningSoon(marketHours.hongKong.open) ? 'opening-soon' : 'closed',
      hours: formatMarketHours(marketHours.hongKong.open, marketHours.hongKong.close),
      nextEvent: {
        type: isWeekend ? 'open' : 
              (currentTime >= marketHours.hongKong.open && currentTime < marketHours.hongKong.close) ? 'close' : 'open',
        time: calculateNextEvent(marketHours.hongKong, 
                 (currentTime >= marketHours.hongKong.open && currentTime < marketHours.hongKong.close))
      },
      timezone: userTimezone
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
