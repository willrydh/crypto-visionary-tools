
import { MarketSession } from '@/contexts/MarketsContext';
import { getMarketTimeRemaining, getPreciseMarketTime } from '@/utils/dateUtils';

// Alpha Vantage API key
const API_KEY = 'WT6ICUD4CZAQLSL7';
const BASE_URL = 'https://www.alphavantage.co/query';

// Market symbols for different exchanges
const MARKET_SYMBOLS = {
  nyse: 'SPY',     // S&P 500 ETF for NYSE
  nasdaq: 'QQQ',   // Nasdaq ETF
  london: 'FTSE.LON', // FTSE for London
  tokyo: '7203.TYO',  // Toyota for Tokyo
  frankfurt: 'DAX.DEX', // DAX for Frankfurt
  hongKong: '0700.HKG', // Tencent for Hong Kong
  australia: 'XJO.AUS', // ASX 200 Index
  india: 'SENSEX.BSE', // BSE Sensex
  brazil: 'BVSP.SAO', // Bovespa Index
  southAfrica: 'JSE.JNB', // JSE Top 40
  korea: 'KS11.KRX', // KOSPI Index
  shanghai: '000001.SHH', // Shanghai Composite
  shenzhen: '399001.SHZ', // Shenzhen Component
  switzerland: 'SMI.SWI', // Swiss Market Index
  toronto: 'TSX.TOR', // TSX Composite Index
};

// Store the last fetched data to avoid unnecessary API calls
let lastFetchedSessions: MarketSession[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // Cache for 5 minutes

// Static exchange data (fallback)
const EXCHANGE_STATIC_DATA = {
  australia: { name: 'ASX (Australia)', localTime: '10:00–16:00', gmtTime: '00:00–06:00', marketCap: '$1.54T' },
  india: { name: 'BSE (India)', localTime: '09:15–15:30', gmtTime: '03:45–10:00', marketCap: '$3.16T' },
  brazil: { name: 'B3 (Brazil)', localTime: '10:00–17:30', gmtTime: '13:00–20:30', marketCap: '$1.2T' },
  euronext: { name: 'Euronext', localTime: '09:00–17:30', gmtTime: '08:00–16:30', marketCap: '$5.08T' },
  frankfurt: { name: 'FSX (Frankfurt)', localTime: '08:00–20:00', gmtTime: '07:00–19:00', marketCap: '$2.11T' },
  hongKong: { name: 'HKEX (Hong Kong)', localTime: '09:30–16:00', gmtTime: '01:30–08:00', marketCap: '$6.76T' },
  southAfrica: { name: 'JSE (South Africa)', localTime: '09:00–17:00', gmtTime: '07:00–15:00', marketCap: '$1.13T' },
  korea: { name: 'KRX (South Korea)', localTime: '09:00–15:30', gmtTime: '00:00–06:30', marketCap: '$2.07T' },
  london: { name: 'LSE (London)', localTime: '08:00–16:30', gmtTime: '08:00–16:30', marketCap: '$3.83T' },
  nasdaq: { name: 'Nasdaq (US)', localTime: '09:30–16:00', gmtTime: '14:30–21:00', marketCap: '$19.51T' },
  nyse: { name: 'NYSE (US)', localTime: '09:30–16:00', gmtTime: '14:30–21:00', marketCap: '$25.62T' },
  shanghai: { name: 'SSX (Shanghai)', localTime: '09:30–15:00', gmtTime: '01:30–07:00', marketCap: '$6.56T' },
  shenzhen: { name: 'SZSE (Shenzhen)', localTime: '09:30–15:00', gmtTime: '01:30–07:00', marketCap: '$4.83T' },
  switzerland: { name: 'SIX (Switzerland)', localTime: '09:00–17:30', gmtTime: '08:00–16:30', marketCap: '$1.75T' },
  tokyo: { name: 'TSE (Tokyo)', localTime: '09:00–15:00', gmtTime: '00:00–06:00', marketCap: '$6.54T' },
  toronto: { name: 'TSX (Toronto)', localTime: '09:30–16:00', gmtTime: '14:30–21:00', marketCap: '$2.62T' }
};

// Parse the GMT trading times from static data to get hours in decimal format
const parseExchangeHours = () => {
  const exchangeHours: { [key: string]: { open: number, close: number } } = {};
  
  Object.entries(EXCHANGE_STATIC_DATA).forEach(([exchange, data]) => {
    const gmtTimes = data.gmtTime.split('–');
    if (gmtTimes.length === 2) {
      const openTime = gmtTimes[0].trim();
      const closeTime = gmtTimes[1].trim();
      
      const openHour = parseInt(openTime.split(':')[0]);
      const openMinute = parseInt(openTime.split(':')[1] || '0');
      const closeHour = parseInt(closeTime.split(':')[0]);
      const closeMinute = parseInt(closeTime.split(':')[1] || '0');
      
      exchangeHours[exchange] = {
        open: openHour + (openMinute / 60),
        close: closeHour + (closeMinute / 60)
      };
    }
  });
  
  return exchangeHours;
};

// Get parsed exchange hours
const exchangeHours = parseExchangeHours();

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

// Function to determine if market is opening soon (within next hour)
const isOpeningSoon = (currentTime: number, marketOpenTime: number) => {
  // If market opens within the next hour, it's "opening soon"
  return currentTime < marketOpenTime && (marketOpenTime - currentTime) <= 1;
};

// Get market data with real-time checks where possible
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
    // We'll attempt real checks for key markets but limit API calls
    // For an actual production app with higher rate limits, you could check each market
    let nyseOpen = false;
    let londonOpen = false;
    let tokyoOpen = false;
    
    if (!isWeekend) {
      // Try to get real-time data for major markets without exceeding API limits
      // Alpha Vantage free tier allows 25 API calls per day
      try {
        // Only check NYSE which is a major indicator
        nyseOpen = await isMarketOpen(MARKET_SYMBOLS.nyse);
        
        // Use time-based calculation for other markets to save API calls
        londonOpen = currentTime >= exchangeHours.london.open && 
                     currentTime < exchangeHours.london.close;
        
        tokyoOpen = currentTime >= exchangeHours.tokyo.open && 
                    currentTime < exchangeHours.tokyo.close;
      } catch (apiError) {
        console.error('API check failed, falling back to time-based calculation:', apiError);
        // Fallback to time-based calculations
        nyseOpen = currentTime >= exchangeHours.nyse.open && 
                   currentTime < exchangeHours.nyse.close;
      }
    }
    
    // For the rest of the markets, use time-based calculations
    const calculateMarketStatus = (exchange: string) => {
      if (!exchangeHours[exchange]) return 'closed';
      
      if (isWeekend) return 'closed';
      
      if (currentTime >= exchangeHours[exchange].open && 
          currentTime < exchangeHours[exchange].close) {
        return 'open';
      }
      
      if (isOpeningSoon(currentTime, exchangeHours[exchange].open)) {
        return 'opening-soon';
      }
      
      return 'closed';
    };
    
    // Format market hours for display in local timezone
    const formatMarketHours = (exchange: string): string => {
      if (!exchangeHours[exchange]) return 'N/A';
      
      const openHour = Math.floor(exchangeHours[exchange].open);
      const openMinutes = Math.floor((exchangeHours[exchange].open % 1) * 60);
      const closeHour = Math.floor(exchangeHours[exchange].close);
      const closeMinutes = Math.floor((exchangeHours[exchange].close % 1) * 60);
      
      return `${openHour.toString().padStart(2, '0')}:${openMinutes.toString().padStart(2, '0')}-${closeHour.toString().padStart(2, '0')}:${closeMinutes.toString().padStart(2, '0')} UTC (Mon-Fri)`;
    };
    
    // Calculate the next opening/closing time
    const calculateNextEvent = (exchange: string, isOpen: boolean): Date => {
      if (!exchangeHours[exchange]) {
        // Default fallback time
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
      }
      
      const openHour = Math.floor(exchangeHours[exchange].open);
      const openMinute = Math.round((exchangeHours[exchange].open % 1) * 60);
      const closeHour = Math.floor(exchangeHours[exchange].close);
      const closeMinute = Math.round((exchangeHours[exchange].close % 1) * 60);
      
      if (isWeekend) {
        // If weekend, next opening is Monday
        return getPreciseMarketTime(openHour, openMinute);
      }
      
      if (isOpen) {
        // If market is open, next event is closing
        return getPreciseMarketTime(closeHour, closeMinute);
      } else {
        // Market is closed
        if (currentTime < exchangeHours[exchange].open) {
          // Will open later today
          return getPreciseMarketTime(openHour, openMinute);
        } else {
          // Will open tomorrow or next business day
          return getPreciseMarketTime(openHour, openMinute);
        }
      }
    };
    
    // Create market sessions with current status
    // Focus on key markets that users want to track
    const sessions: MarketSession[] = [
      {
        name: 'NYSE (New York)',
        status: nyseOpen ? 'open' : 
                isOpeningSoon(currentTime, exchangeHours.nyse.open) ? 'opening-soon' : 'closed',
        hours: formatMarketHours('nyse'),
        nextEvent: {
          type: nyseOpen ? 'close' : 'open',
          time: calculateNextEvent('nyse', nyseOpen)
        },
        timezone: userTimezone,
        marketCap: EXCHANGE_STATIC_DATA.nyse.marketCap
      },
      {
        name: 'LSE (London)',
        status: londonOpen ? 'open' : 
                isOpeningSoon(currentTime, exchangeHours.london.open) ? 'opening-soon' : 'closed',
        hours: formatMarketHours('london'),
        nextEvent: {
          type: londonOpen ? 'close' : 'open',
          time: calculateNextEvent('london', londonOpen)
        },
        timezone: userTimezone,
        marketCap: EXCHANGE_STATIC_DATA.london.marketCap
      },
      {
        name: 'TSE (Tokyo)',
        status: tokyoOpen ? 'open' : 
                isOpeningSoon(currentTime, exchangeHours.tokyo.open) ? 'opening-soon' : 'closed',
        hours: formatMarketHours('tokyo'),
        nextEvent: {
          type: tokyoOpen ? 'close' : 'open',
          time: calculateNextEvent('tokyo', tokyoOpen)
        },
        timezone: userTimezone,
        marketCap: EXCHANGE_STATIC_DATA.tokyo.marketCap
      },
      {
        name: 'FSX (Frankfurt)',
        status: calculateMarketStatus('frankfurt'),
        hours: formatMarketHours('frankfurt'),
        nextEvent: {
          type: calculateMarketStatus('frankfurt') === 'open' ? 'close' : 'open',
          time: calculateNextEvent('frankfurt', calculateMarketStatus('frankfurt') === 'open')
        },
        timezone: userTimezone,
        marketCap: EXCHANGE_STATIC_DATA.frankfurt.marketCap
      },
      {
        name: 'HKEX (Hong Kong)',
        status: calculateMarketStatus('hongKong'),
        hours: formatMarketHours('hongKong'),
        nextEvent: {
          type: calculateMarketStatus('hongKong') === 'open' ? 'close' : 'open',
          time: calculateNextEvent('hongKong', calculateMarketStatus('hongKong') === 'open')
        },
        timezone: userTimezone,
        marketCap: EXCHANGE_STATIC_DATA.hongKong.marketCap
      }
    ];
    
    // Add Nasdaq as it's important for tech stock trading
    sessions.push({
      name: 'Nasdaq (US)',
      status: nyseOpen ? 'open' : // Nasdaq and NYSE have same hours
              isOpeningSoon(currentTime, exchangeHours.nasdaq.open) ? 'opening-soon' : 'closed',
      hours: formatMarketHours('nasdaq'),
      nextEvent: {
        type: nyseOpen ? 'close' : 'open',
        time: calculateNextEvent('nasdaq', nyseOpen)
      },
      timezone: userTimezone,
      marketCap: EXCHANGE_STATIC_DATA.nasdaq.marketCap
    });
    
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
    
    // Fallback to static calculations
    return fallbackMarketSessions();
  }
};

// Fallback method if API calls fail
const fallbackMarketSessions = async (): Promise<MarketSession[]> => {
  const now = new Date();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const hour = now.getUTCHours();
  const minute = now.getUTCMinutes();
  const currentTime = hour + (minute / 60);
  const dayOfWeek = now.getUTCDay();
  
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Create market sessions based on static data
  const sessions: MarketSession[] = [];
  
  // Add key markets
  const keyMarkets = ['nyse', 'nasdaq', 'london', 'tokyo', 'frankfurt', 'hongKong'];
  
  keyMarkets.forEach(market => {
    if (!exchangeHours[market]) return;
    
    const isOpen = !isWeekend && 
                   currentTime >= exchangeHours[market].open && 
                   currentTime < exchangeHours[market].close;
                   
    const isOpeningSoon = !isWeekend && 
                          currentTime < exchangeHours[market].open && 
                          (exchangeHours[market].open - currentTime) <= 1;
    
    const openHour = Math.floor(exchangeHours[market].open);
    const openMinute = Math.round((exchangeHours[market].open % 1) * 60);
    const closeHour = Math.floor(exchangeHours[market].close);
    const closeMinute = Math.round((exchangeHours[market].close % 1) * 60);
    
    // Format hours for display
    const hours = `${openHour.toString().padStart(2, '0')}:${openMinute.toString().padStart(2, '0')}-${closeHour.toString().padStart(2, '0')}:${closeMinute.toString().padStart(2, '0')} UTC (Mon-Fri)`;
    
    // Calculate next event time
    const nextEventTime = isOpen ? 
      getPreciseMarketTime(closeHour, closeMinute) : 
      getPreciseMarketTime(openHour, openMinute);
    
    sessions.push({
      name: EXCHANGE_STATIC_DATA[market].name,
      status: isOpen ? 'open' : isOpeningSoon ? 'opening-soon' : 'closed',
      hours: hours,
      nextEvent: {
        type: isOpen ? 'close' : 'open',
        time: nextEventTime
      },
      timezone: userTimezone,
      marketCap: EXCHANGE_STATIC_DATA[market].marketCap
    });
  });
  
  return sessions;
};

// Fetch additional market statistics (based on historical performance)
export const fetchMarketStatistics = async () => {
  try {
    // In a production app, you would calculate these from historical data
    // For this example, we'll use the static data combined with simulated statistics
    const stats: {[key: string]: {volatility: number, pumpFrequency: number, dumpFrequency: number}} = {};
    
    Object.keys(EXCHANGE_STATIC_DATA).forEach(exchange => {
      // Generate semi-realistic stats based on market cap and region patterns
      // In reality, you would compute these from historical price data
      const marketCap = parseFloat(EXCHANGE_STATIC_DATA[exchange].marketCap.replace(/[^0-9.]/g, ''));
      
      // Larger markets tend to be less volatile but not always
      const baseVolatility = 50 + (Math.random() * 30);
      const capFactor = Math.min(1, 5 / marketCap); // Larger markets get smaller factor
      
      stats[exchange] = {
        volatility: Math.round(baseVolatility + (capFactor * 40)),
        pumpFrequency: Math.round(45 + (Math.random() * 20)),
        dumpFrequency: 0 // We'll calculate this as 100 - pumpFrequency
      };
      
      // Calculate dump frequency (ensuring it adds up to 100%)
      stats[exchange].dumpFrequency = 100 - stats[exchange].pumpFrequency;
    });
    
    return stats;
  } catch (error) {
    console.error('Error generating market statistics:', error);
    return null;
  }
};

// Fetch intraday data for a specific symbol
export const fetchIntradayData = async (symbol: string, interval: string = '5min') => {
  try {
    const url = `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error(`Error fetching intraday data for ${symbol}:`, error);
    return null;
  }
};

// Function to analyze volume patterns to detect market activity spikes
export const analyzeVolumePatterns = async (symbol: string) => {
  try {
    const data = await fetchIntradayData(symbol);
    if (!data || !data['Time Series (5min)']) {
      return null;
    }
    
    const timePoints = Object.keys(data['Time Series (5min)']).sort();
    if (timePoints.length === 0) return null;
    
    // Calculate volume patterns throughout the day
    const volumeByHour: {[hour: string]: number} = {};
    const priceChangeByHour: {[hour: string]: number} = {};
    
    for (let i = 1; i < timePoints.length; i++) {
      const currentTime = timePoints[i];
      const previousTime = timePoints[i-1];
      
      const hour = currentTime.split(' ')[1].split(':')[0];
      const currentData = data['Time Series (5min)'][currentTime];
      const previousData = data['Time Series (5min)'][previousTime];
      
      // Volume
      const volume = parseFloat(currentData['5. volume']);
      if (!volumeByHour[hour]) volumeByHour[hour] = 0;
      volumeByHour[hour] += volume;
      
      // Price change
      const currentPrice = parseFloat(currentData['4. close']);
      const previousPrice = parseFloat(previousData['4. close']);
      const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
      
      if (!priceChangeByHour[hour]) priceChangeByHour[hour] = 0;
      priceChangeByHour[hour] += priceChange;
    }
    
    // Identify opening and closing hour patterns
    const hourKeys = Object.keys(volumeByHour).sort();
    
    if (hourKeys.length === 0) return null;
    
    // Find peak volume hours
    let maxVolumeHour = hourKeys[0];
    let maxVolume = volumeByHour[maxVolumeHour];
    
    hourKeys.forEach(hour => {
      if (volumeByHour[hour] > maxVolume) {
        maxVolume = volumeByHour[hour];
        maxVolumeHour = hour;
      }
    });
    
    return {
      hourlyVolume: volumeByHour,
      hourlyPriceChange: priceChangeByHour,
      peakVolumeHour: maxVolumeHour,
      volumePattern: hourKeys.map(hour => ({
        hour,
        volume: volumeByHour[hour],
        priceChange: priceChangeByHour[hour]
      }))
    };
  } catch (error) {
    console.error(`Error analyzing volume patterns for ${symbol}:`, error);
    return null;
  }
};
