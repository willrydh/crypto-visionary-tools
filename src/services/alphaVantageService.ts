import { MarketSession } from '@/contexts/MarketsContext';
import { getMarketTimeRemaining, getPreciseMarketTime } from '@/utils/dateUtils';

// Alpha Vantage API key
const API_KEY = 'WT6ICUD4CZAQLSL7';
const BASE_URL = 'https://www.alphavantage.co/query';

// Market symbols for different exchanges
const MARKET_SYMBOLS = {
  nyse: 'SPY',     // S&P 500 ETF for NYSE
  london: 'FTSE.LON', // FTSE for London
  tokyo: '7203.TYO',  // Toyota for Tokyo
  frankfurt: 'DAX.DEX', // DAX for Frankfurt
  hongKong: '0700.HKG' // Tencent for Hong Kong
};

// Store the last fetched data to avoid unnecessary API calls
let lastFetchedSessions: MarketSession[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // Cache for 5 minutes

// Check if market is currently open by fetching latest data
const isMarketOpen = async (symbol: string): Promise<boolean> => {
  try {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // If we get a valid response with latest trading data that has volume
    if (data['Global Quote'] && data['Global Quote']['05. price'] && 
        parseFloat(data['Global Quote']['05. volume']) > 0) {
      // Check if latest data is from today (might need refinement)
      const latestTradingDay = new Date(data['Global Quote']['07. latest trading day']);
      const today = new Date();
      
      return latestTradingDay.toDateString() === today.toDateString();
    }
    
    return false;
  } catch (error) {
    console.error(`Error checking if market is open for ${symbol}:`, error);
    return false;
  }
};

// Define market hours based on research (UTC times)
const marketHours = {
  tokyo: { open: 0, close: 6 },      // Tokyo: UTC 0:00-6:00
  london: { open: 8, close: 16.5 },  // London: UTC 8:00-16:30
  newYork: { open: 13.5, close: 20 }, // New York: UTC 13:30-20:00
  frankfurt: { open: 8, close: 16.5 }, // Frankfurt: UTC 8:00-16:30
  hongKong: { open: 1.5, close: 8 }   // Hong Kong: UTC 1:30-8:00
};

// Function to determine if market is opening soon (within next hour)
const isOpeningSoon = (currentTime: number, marketOpenTime: number) => {
  // If market opens within the next hour, it's "opening soon"
  return currentTime < marketOpenTime && (marketOpenTime - currentTime) <= 1;
};

// Fetch market sessions data
export const fetchAlphaVantageMarketSessions = async (): Promise<MarketSession[]> => {
  // Check if we have cached data that's still fresh
  const now = Date.now();
  if (lastFetchedSessions && (now - lastFetchTime < CACHE_DURATION)) {
    return lastFetchedSessions;
  }
  
  // Real-time calculations
  const currentDate = new Date();
  const hour = currentDate.getUTCHours();
  const minute = currentDate.getUTCMinutes();
  const currentTime = hour + (minute / 60);
  const dayOfWeek = currentDate.getUTCDay(); // 0 is Sunday, 6 is Saturday
  
  // Check if it's weekend (Saturday or Sunday)
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  try {
    // We'll attempt real checks for NYSE and use that to validate our approach
    // For demo, we'll determine others based on time calculations
    const nyseOpen = isWeekend ? false : await isMarketOpen(MARKET_SYMBOLS.nyse);
    
    // Use time-based calculation for other markets since we may hit API limits
    // In a production app, you would check each market individually
    const tokyoOpen = !isWeekend && 
      (currentTime >= marketHours.tokyo.open && currentTime < marketHours.tokyo.close);
    
    const londonOpen = !isWeekend && 
      (currentTime >= marketHours.london.open && currentTime < marketHours.london.close);
    
    const frankfurtOpen = !isWeekend && 
      (currentTime >= marketHours.frankfurt.open && currentTime < marketHours.frankfurt.close);
    
    const hongKongOpen = !isWeekend && 
      (currentTime >= marketHours.hongKong.open && currentTime < marketHours.hongKong.close);
    
    // Format market hours for display in local timezone
    const formatMarketHours = (openUtc: number, closeUtc: number): string => {
      const openHour = Math.floor(openUtc);
      const openMinutes = Math.floor((openUtc % 1) * 60);
      const closeHour = Math.floor(closeUtc);
      const closeMinutes = Math.floor((closeUtc % 1) * 60);
      
      return `${openHour.toString().padStart(2, '0')}:${openMinutes.toString().padStart(2, '0')}-${closeHour.toString().padStart(2, '0')}:${closeMinutes.toString().padStart(2, '0')} UTC (Mon-Fri)`;
    };
    
    // Calculate the next opening/closing time
    const calculateNextEvent = (market: any, isOpen: boolean): Date => {
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
        return getPreciseMarketTime(closeHour, closeMinute);
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
    
    // Create market sessions with current status
    const sessions: MarketSession[] = [
      {
        name: 'Tokyo',
        status: isWeekend ? 'closed' : 
                tokyoOpen ? 'open' : 
                isOpeningSoon(currentTime, marketHours.tokyo.open) ? 'opening-soon' : 'closed',
        hours: formatMarketHours(marketHours.tokyo.open, marketHours.tokyo.close),
        nextEvent: {
          type: isWeekend ? 'open' : tokyoOpen ? 'close' : 'open',
          time: calculateNextEvent(marketHours.tokyo, tokyoOpen)
        },
        timezone: userTimezone
      },
      {
        name: 'London',
        status: isWeekend ? 'closed' : 
                londonOpen ? 'open' : 
                isOpeningSoon(currentTime, marketHours.london.open) ? 'opening-soon' : 'closed',
        hours: formatMarketHours(marketHours.london.open, marketHours.london.close),
        nextEvent: {
          type: isWeekend ? 'open' : londonOpen ? 'close' : 'open',
          time: calculateNextEvent(marketHours.london, londonOpen)
        },
        timezone: userTimezone
      },
      {
        name: 'New York',
        status: isWeekend ? 'closed' : 
                nyseOpen ? 'open' : 
                isOpeningSoon(currentTime, marketHours.newYork.open) ? 'opening-soon' : 'closed',
        hours: formatMarketHours(marketHours.newYork.open, marketHours.newYork.close),
        nextEvent: {
          type: isWeekend ? 'open' : nyseOpen ? 'close' : 'open',
          time: calculateNextEvent(marketHours.newYork, nyseOpen)
        },
        timezone: userTimezone
      },
      {
        name: 'Frankfurt',
        status: isWeekend ? 'closed' : 
                frankfurtOpen ? 'open' : 
                isOpeningSoon(currentTime, marketHours.frankfurt.open) ? 'opening-soon' : 'closed',
        hours: formatMarketHours(marketHours.frankfurt.open, marketHours.frankfurt.close),
        nextEvent: {
          type: isWeekend ? 'open' : frankfurtOpen ? 'close' : 'open',
          time: calculateNextEvent(marketHours.frankfurt, frankfurtOpen)
        },
        timezone: userTimezone
      },
      {
        name: 'Hong Kong',
        status: isWeekend ? 'closed' : 
                hongKongOpen ? 'open' : 
                isOpeningSoon(currentTime, marketHours.hongKong.open) ? 'opening-soon' : 'closed',
        hours: formatMarketHours(marketHours.hongKong.open, marketHours.hongKong.close),
        nextEvent: {
          type: isWeekend ? 'open' : hongKongOpen ? 'close' : 'open',
          time: calculateNextEvent(marketHours.hongKong, hongKongOpen)
        },
        timezone: userTimezone
      }
    ];
    
    // Cache the results
    lastFetchedSessions = sessions;
    lastFetchTime = now;
    
    return sessions;
  } catch (error) {
    console.error('Error fetching Alpha Vantage market sessions:', error);
    
    // If failed, use our existing calculations
    if (lastFetchedSessions) {
      return lastFetchedSessions;
    }
    
    // Fallback to static calculations (similar to original code)
    return await fallbackMarketSessions();
  }
};

// Fallback method if API calls fail
const fallbackMarketSessions = async (): Promise<MarketSession[]> => {
  // This is basically the same as the original fetchMarketSessions implementation
  const now = new Date();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const hour = now.getUTCHours();
  const minute = now.getUTCMinutes();
  const currentTime = hour + (minute / 60);
  const dayOfWeek = now.getUTCDay();
  
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Format market hours for display in local timezone
  const formatMarketHours = (openUtc: number, closeUtc: number): string => {
    const openHour = Math.floor(openUtc);
    const openMinutes = Math.floor((openUtc % 1) * 60);
    const closeHour = Math.floor(closeUtc);
    const closeMinutes = Math.floor((closeUtc % 1) * 60);
    
    return `${openHour.toString().padStart(2, '0')}:${openMinutes.toString().padStart(2, '0')}-${closeHour.toString().padStart(2, '0')}:${closeMinutes.toString().padStart(2, '0')} UTC (Mon-Fri)`;
  };
  
  // Calculate the next opening/closing time with precise timing
  const calculateNextEvent = (market: any, isOpen: boolean): Date => {
    const openHour = Math.floor(market.open);
    const openMinute = Math.round((market.open % 1) * 60);
    const closeHour = Math.floor(market.close);
    const closeMinute = Math.round((market.close % 1) * 60);
    
    if (isWeekend) {
      return getPreciseMarketTime(openHour, openMinute);
    }
    
    if (isOpen) {
      const closeTime = new Date(now);
      closeTime.setUTCHours(closeHour, closeMinute, 0, 0);
      
      if (closeTime <= now) {
        return getPreciseMarketTime(closeHour, closeMinute);
      }
      
      return closeTime;
    } else {
      if (currentTime < market.open) {
        return getPreciseMarketTime(openHour, openMinute);
      } else {
        return getPreciseMarketTime(openHour, openMinute);
      }
    }
  };

  const sessions: MarketSession[] = [
    {
      name: 'Tokyo',
      status: isWeekend ? 'closed' : 
              (currentTime >= marketHours.tokyo.open && currentTime < marketHours.tokyo.close) ? 'open' : 
              isOpeningSoon(currentTime, marketHours.tokyo.open) ? 'opening-soon' : 'closed',
      hours: formatMarketHours(marketHours.tokyo.open, marketHours.tokyo.close),
      nextEvent: {
        type: isWeekend ? 'open' : 
              (currentTime >= marketHours.tokyo.open && currentTime < marketHours.tokyo.close) ? 'close' : 'open',
        time: calculateNextEvent(marketHours.tokyo, 
                 (currentTime >= marketHours.tokyo.open && currentTime < marketHours.tokyo.close))
      },
      timezone: userTimezone
    },
    // Other markets follow the same pattern
    {
      name: 'London',
      status: isWeekend ? 'closed' : 
              (currentTime >= marketHours.london.open && currentTime < marketHours.london.close) ? 'open' : 
              isOpeningSoon(currentTime, marketHours.london.open) ? 'opening-soon' : 'closed',
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
              isOpeningSoon(currentTime, marketHours.newYork.open) ? 'opening-soon' : 'closed',
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
              isOpeningSoon(currentTime, marketHours.frankfurt.open) ? 'opening-soon' : 'closed',
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
              isOpeningSoon(currentTime, marketHours.hongKong.open) ? 'opening-soon' : 'closed',
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

// Fetch additional market statistics (like tendency for pumps/dumps)
export const fetchMarketStatistics = async () => {
  try {
    // In a real app, you would analyze historical data from Alpha Vantage to derive these statistics
    // For this example, we're using simulated data
    return {
      nyse: {
        volatility: 85,
        pumpFrequency: 62,
        dumpFrequency: 38,
      },
      london: {
        volatility: 65,
        pumpFrequency: 51,
        dumpFrequency: 49,
      },
      tokyo: {
        volatility: 58,
        pumpFrequency: 53,
        dumpFrequency: 47,
      },
      frankfurt: {
        volatility: 70,
        pumpFrequency: 55,
        dumpFrequency: 45,
      },
      hongKong: {
        volatility: 75,
        pumpFrequency: 58,
        dumpFrequency: 42,
      }
    };
  } catch (error) {
    console.error('Error fetching market statistics:', error);
    return null;
  }
};
