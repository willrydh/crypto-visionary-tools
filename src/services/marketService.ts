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
  
  // Define market hours in local time according to user's provided data
  // Market hours are in local time (CET/CEST for European markets)
  // Need to convert to UTC for calculations
  
  // User-provided market hours (local time in CET/CEST, UTC+2 currently)
  const localMarketHours = {
    // Nordic markets
    stockholm: { open: 9, close: 17.5 },      // 09:00-17:30 CET/CEST
    oslo: { open: 9, close: 16.42 },          // 09:00-16:25 CET/CEST
    copenhagen: { open: 9, close: 17 },       // 09:00-17:00 CET/CEST
    helsinki: { open: 9, close: 17.5 },       // 09:00-17:30 CET/CEST
    
    // North American markets
    nyse: { open: 15.5, close: 22 },          // 15:30-22:00 CET/CEST
    nasdaq: { open: 15.5, close: 22 },        // 15:30-22:00 CET/CEST
    tsx: { open: 15.5, close: 22 },           // 15:30-22:00 CET/CEST
    
    // European markets
    london: { open: 9, close: 17.5 },         // 09:00-17:30 CET/CEST
    frankfurt: { open: 9, close: 17.5 },      // 09:00-17:30 CET/CEST
    paris: { open: 9, close: 17.5 },          // 09:00-17:30 CET/CEST
    amsterdam: { open: 9, close: 17.5 },      // 09:00-17:30 CET/CEST
    brussels: { open: 9, close: 17.5 },       // 09:00-17:30 CET/CEST
    milan: { open: 9, close: 17.5 },          // 09:00-17:30 CET/CEST
    madrid: { open: 9, close: 17.5 },         // 09:00-17:30 CET/CEST
    zurich: { open: 9, close: 17.5 },         // 09:00-17:30 CET/CEST
    lisbon: { open: 9, close: 17.5 },         // 09:00-17:30 CET/CEST
    
    // Asian markets
    tokyo: { open: 0, close: 6 },             // Local Japan time converted to CET/CEST
    hongKong: { open: 3.5, close: 10 },        // Local Hong Kong time converted to CET/CEST
    forexPreMarket: { open: 14, close: 15.5 }
  };
  
  // Convert local market hours to UTC for calculations
  // Using fixed UTC+2 offset for CET/CEST time as specified in the data
  const marketHours = Object.entries(localMarketHours).reduce((acc, [market, hours]) => {
    // For European markets, assuming UTC+2 offset (CET/CEST)
    const localToUtcOffset = 2;
    acc[market] = {
      open: hours.open - localToUtcOffset,
      close: hours.close - localToUtcOffset
    };
    return acc;
  }, {} as Record<string, { open: number; close: number }>);
  
  // Format market hours for display in local timezone
  const formatMarketHours = (localOpen: number, localClose: number): string => {
    const openMinutes = Math.floor((localOpen % 1) * 60);
    const closeMinutes = Math.floor((localClose % 1) * 60);
    
    const openHour = Math.floor(localOpen);
    const closeHour = Math.floor(localClose);
    
    const timezoneAbbr = getTimezoneAbbreviation();
    
    return `${openHour.toString().padStart(2, '0')}:${openMinutes.toString().padStart(2, '0')}-${closeHour.toString().padStart(2, '0')}:${closeMinutes.toString().padStart(2, '0')} ${timezoneAbbr} (Mon-Fri)`;
  };
  
  // Calculate the next opening/closing time with precise timing
  const calculateNextEvent = (market: any, isOpen: boolean): Date => {
    // Extract open/close hours and minutes for UTC calculation
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
  
  // Function to determine if market is currently open
  const isMarketOpen = (openTime: number, closeTime: number) => {
    if (isWeekend) return false;
    
    // Check if current time is between opening and closing times
    return currentTime >= openTime && currentTime < closeTime;
  };
  
  // Debug log to help diagnose the issue
  console.log('Current UTC time:', currentTime.toFixed(2), 
              'Hour:', hour, 'Minute:', minute, 
              'Day:', dayOfWeek, 'Weekend:', isWeekend);
  
  // Create market sessions with accurate statuses and next event times
  const sessions: MarketSession[] = [
    {
      name: "Stockholm",
      status: isWeekend ? 'closed' : 
              isMarketOpen(marketHours.stockholm.open, marketHours.stockholm.close) ? 'open' : 
              isOpeningSoon(marketHours.stockholm.open) ? 'opening-soon' : 'closed',
      hours: formatMarketHours(localMarketHours.stockholm.open, localMarketHours.stockholm.close),
      nextEvent: {
        type: isWeekend ? 'open' : 
              isMarketOpen(marketHours.stockholm.open, marketHours.stockholm.close) ? 'close' : 'open',
        time: calculateNextEvent(marketHours.stockholm, 
                 isMarketOpen(marketHours.stockholm.open, marketHours.stockholm.close))
      },
      timezone: userTimezone
    },
    {
      name: "London",
      status: isWeekend ? 'closed' : 
              isMarketOpen(marketHours.london.open, marketHours.london.close) ? 'open' : 
              isOpeningSoon(marketHours.london.open) ? 'opening-soon' : 'closed',
      hours: formatMarketHours(localMarketHours.london.open, localMarketHours.london.close),
      nextEvent: {
        type: isWeekend ? 'open' : 
              isMarketOpen(marketHours.london.open, marketHours.london.close) ? 'close' : 'open',
        time: calculateNextEvent(marketHours.london, 
                 isMarketOpen(marketHours.london.open, marketHours.london.close))
      },
      timezone: userTimezone,
      marketCap: "$3.83T"
    },
    {
      name: "New York",
      status: isWeekend ? 'closed' : 
              isMarketOpen(marketHours.nyse.open, marketHours.nyse.close) ? 'open' : 
              isOpeningSoon(marketHours.nyse.open) ? 'opening-soon' : 'closed',
      hours: formatMarketHours(localMarketHours.nyse.open, localMarketHours.nyse.close),
      nextEvent: {
        type: isWeekend ? 'open' : 
              isMarketOpen(marketHours.nyse.open, marketHours.nyse.close) ? 'close' : 'open',
        time: calculateNextEvent(marketHours.nyse, 
                 isMarketOpen(marketHours.nyse.open, marketHours.nyse.close))
      },
      timezone: userTimezone,
      marketCap: "$25.62T"
    },
    {
      name: "Frankfurt",
      status: isWeekend ? 'closed' : 
              isMarketOpen(marketHours.frankfurt.open, marketHours.frankfurt.close) ? 'open' : 
              isOpeningSoon(marketHours.frankfurt.open) ? 'opening-soon' : 'closed',
      hours: formatMarketHours(localMarketHours.frankfurt.open, localMarketHours.frankfurt.close),
      nextEvent: {
        type: isWeekend ? 'open' : 
              isMarketOpen(marketHours.frankfurt.open, marketHours.frankfurt.close) ? 'close' : 'open',
        time: calculateNextEvent(marketHours.frankfurt, 
                 isMarketOpen(marketHours.frankfurt.open, marketHours.frankfurt.close))
      },
      timezone: userTimezone,
      marketCap: "$2.14T"
    },
    {
      name: "Tokyo",
      status: isWeekend ? 'closed' : 
              isMarketOpen(marketHours.tokyo.open, marketHours.tokyo.close) ? 'open' : 
              isOpeningSoon(marketHours.tokyo.open) ? 'opening-soon' : 'closed',
      hours: formatMarketHours(localMarketHours.tokyo.open, localMarketHours.tokyo.close),
      nextEvent: {
        type: isWeekend ? 'open' : 
              isMarketOpen(marketHours.tokyo.open, marketHours.tokyo.close) ? 'close' : 'open',
        time: calculateNextEvent(marketHours.tokyo, 
                 isMarketOpen(marketHours.tokyo.open, marketHours.tokyo.close))
      },
      timezone: userTimezone,
      marketCap: "$6.54T"
    },
    {
      name: "Forex Pre-market",
      status: isWeekend 
        ? 'closed'
        : isMarketOpen(
          marketHours.forexPreMarket.open,
          marketHours.forexPreMarket.close
        )
          ? 'open'
          : isOpeningSoon(marketHours.forexPreMarket.open)
          ? 'opening-soon'
          : 'closed',
      hours: formatMarketHours(
        localMarketHours.forexPreMarket.open,
        localMarketHours.forexPreMarket.close
      ),
      nextEvent: {
        type: isWeekend
          ? 'open'
          : isMarketOpen(
              marketHours.forexPreMarket.open,
              marketHours.forexPreMarket.close
            )
          ? 'close'
          : 'open',
        time: calculateNextEvent(
          marketHours.forexPreMarket,
          isMarketOpen(
            marketHours.forexPreMarket.open,
            marketHours.forexPreMarket.close
          )
        )
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
