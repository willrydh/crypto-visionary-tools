export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  source: string;
  fetchedAt: string;
}

// Renamed from CandleData to PriceCandle to match references in PriceChart.tsx
export interface PriceCandle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  source: string;
  fetchedAt: string;
}

export interface HighLowData {
  dailyHigh: number;
  dailyLow: number;
  weeklyHigh: number;
  weeklyLow: number;
  fetchedAt: string;
  source: string;
}

// These API keys should be on backend in production environment
const API_KEY = "kOQYCVeSeczfY49QU2";
const API_SECRET = "mfCfpXUQs8dds4DzfNV0AVL0BaXcc2jgBKuZ";
const BASE_URL = "https://api.bybit.com/v5";

// Helper function to format symbol for Bybit API
// Bybit requires symbols without a slash (e.g., "BTCUSDT" not "BTC/USDT")
const formatSymbol = (symbol: string): string => {
  return symbol.replace('/', '');
};

// Convert timeframe from our format to Bybit format
const formatTimeframe = (interval: string): string => {
  switch (interval) {
    case "1m": return "1";
    case "5m": return "5";
    case "15m": return "15";
    case "30m": return "30";
    case "1h": return "60";
    case "4h": return "240";
    case "1d": return "D";
    case "1w": return "W";
    default: return interval;
  }
};

// Flag to help control when to use mock data
let useOnlyMockData = false;

export async function fetchHistoricalPrices(
  symbol: string = "BTCUSDT",
  interval: string = "D", // D = daily, 60 = hourly, 240 = 4h
  limit: number = 100
): Promise<PriceCandle[]> {
  const formattedSymbol = formatSymbol(symbol);
  const formattedInterval = typeof interval === 'string' && interval.length <= 2 ? 
    formatTimeframe(interval) : interval;
  
  // If we're forcing mock data usage to prevent excessive API failures
  if (useOnlyMockData) {
    console.log('Using mock data for historical prices');
    return generateMockCandleData(limit, formattedSymbol);
  }
    
  try {
    const url = `${BASE_URL}/market/kline?category=linear&symbol=${formattedSymbol}&interval=${formattedInterval}&limit=${limit}`;
    
    console.log('Fetching historical prices from:', url);
    const res = await fetch(url, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // Using timeout to prevent hanging requests
      signal: AbortSignal.timeout(5000)
    });
    
    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status}`);
    }
    
    const json = await res.json();
    console.log('API response status:', json.retMsg);
    const now = new Date().toISOString();

    if (json.retMsg !== "OK") throw new Error(json.retMsg);

    // Ensure we have data in the response
    if (!json.result?.list || json.result.list.length === 0) {
      console.error('No candle data in API response');
      return generateMockCandleData(limit, formattedSymbol);
    }

    // Map the response data to our candle format with correct timestamp handling
    // Bybit timestamps are in milliseconds, ensure our data is consistently in milliseconds
    return json.result.list.map((candle: any[]) => {
      // Make sure timestamp is a number in milliseconds
      const timestamp = parseInt(candle[0]);
      
      return {
        timestamp: timestamp,
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
        source: "Bybit",
        fetchedAt: now,
      };
    });
  } catch (error) {
    console.error("Bybit API error (historical prices):", error);
    // After a failed attempt, switch to only using mock data
    useOnlyMockData = true;
    
    // Return mock data as fallback when API fails
    return generateMockCandleData(limit, formattedSymbol);
  }
}

// Updated to return an object with price, change24h and other properties
export async function fetchCurrentPrice(symbol: string = "BTCUSDT"): Promise<{
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: number;
}> {
  const formattedSymbol = formatSymbol(symbol);
  
  // If we're forcing mock data usage to prevent excessive API failures
  if (useOnlyMockData) {
    console.log('Using mock data for current price');
    return generateMockCurrentPrice(formattedSymbol);
  }

  try {
    const url = `${BASE_URL}/market/tickers?category=linear&symbol=${formattedSymbol}`;
    
    console.log('Fetching current price from:', url);
    const res = await fetch(url, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // Using timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000) // Increased timeout to 10 seconds
    });
    
    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status}`);
    }
    
    const json = await res.json();
    console.log('Current price API response status:', json.retMsg);

    if (json.retMsg !== "OK" || !json.result?.list?.[0]) {
      throw new Error(json.retMsg || 'Invalid response format');
    }

    // Parse values with fallbacks for safety
    const price = parseFloat(json.result.list[0].lastPrice) || 0;
    const change24h = parseFloat(json.result.list[0].price24hPcnt) * 100 || 0;
    const volume24h = parseFloat(json.result.list[0].volume24h) || 0;

    console.log(`Successfully fetched current price: ${price}, change: ${change24h}%`);
    
    return {
      price,
      change24h,
      volume24h,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("Bybit API error (current price):", error);
    // After a failed attempt, switch to only using mock data
    useOnlyMockData = true;
    
    // Return mock price as fallback based on symbol
    return generateMockCurrentPrice(formattedSymbol);
  }
}

export async function fetchHighLowData(symbol: string = "BTCUSDT"): Promise<HighLowData> {
  const formattedSymbol = formatSymbol(symbol);
  const now = new Date().toISOString();

  // If we're forcing mock data usage
  if (useOnlyMockData) {
    console.log('Using mock data for high/low data');
    return generateMockHighLowData(formattedSymbol);
  }

  try {
    // Use the fetchHistoricalPrices function which already has fallback
    const [dailyCandles, weeklyCandles] = await Promise.all([
      fetchHistoricalPrices(formattedSymbol, "60", 24), // hourly, 24 hours
      fetchHistoricalPrices(formattedSymbol, "240", 42), // 4-hour candles, about 1 week
    ]);

    const dailyHigh = Math.max(...dailyCandles.map(c => c.high));
    const dailyLow = Math.min(...dailyCandles.map(c => c.low));
    const weeklyHigh = Math.max(...weeklyCandles.map(c => c.high));
    const weeklyLow = Math.min(...weeklyCandles.map(c => c.low));

    return {
      dailyHigh,
      dailyLow,
      weeklyHigh,
      weeklyLow,
      fetchedAt: now,
      source: dailyCandles[0].source, // Will be "Bybit" or "Bybit-Mock"
    };
  } catch (error) {
    console.error("Error generating high/low data:", error);
    
    // Return mock data as fallback
    return generateMockHighLowData(formattedSymbol);
  }
}

// Generate mock candle data for fallback purposes with more accurate timestamps
function generateMockCandleData(count: number, symbol: string = "BTCUSDT"): PriceCandle[] {
  const now = new Date();
  const result: PriceCandle[] = [];
  const basePrice = getBasePrice(symbol);
  
  // Create realistic timestamps based on count and current time
  for (let i = 0; i < count; i++) {
    // Calculate timestamp for each candle - go backwards from now
    // If timeframe is daily, go back i days, otherwise i hours
    const timestamp = now.getTime() - (i * 3600000); // Default to hours
    
    // Create some price variation that looks realistic
    const volatility = Math.random() * (basePrice * 0.005); // 0.5% of base price for realistic movement
    const open = basePrice + (Math.random() * basePrice * 0.02 - basePrice * 0.01); // +/- 1% of base price
    const close = open + (Math.random() * volatility*2 - volatility);
    const high = Math.max(open, close) + Math.random() * basePrice * 0.005; // up to 0.5% higher
    const low = Math.min(open, close) - Math.random() * basePrice * 0.005; // up to 0.5% lower
    const volume = Math.random() * basePrice * 10 + basePrice * 5; // Scale volume with price

    result.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume,
      source: "Bybit-Mock",
      fetchedAt: new Date().toISOString()
    });
  }
  
  console.log('Generated mock data:', result.length, 'data points');
  return result.reverse(); // Most recent first, so newest timestamps are first
}

function generateMockCurrentPrice(symbol: string = "BTCUSDT"): {
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: number;
} {
  const basePrice = getBasePrice(symbol);
  // Generate a more realistic change value between -3% and +3%
  const change = (Math.random() * 6) - 3;
  
  // Generate a more accurate price within 0.5% of the base price
  const priceFactor = 1 + ((Math.random() * 1) - 0.5) / 100;
  
  return {
    price: basePrice * priceFactor,
    change24h: change,
    volume24h: basePrice * 1000 * (Math.random() * 5 + 5), // Scale with price
    timestamp: Date.now()
  };
}

function generateMockHighLowData(symbol: string = "BTCUSDT"): HighLowData {
  const basePrice = getBasePrice(symbol);
  const now = new Date().toISOString();
  
  return {
    dailyHigh: basePrice * 1.02, // +2%
    dailyLow: basePrice * 0.98, // -2%
    weeklyHigh: basePrice * 1.05, // +5%
    weeklyLow: basePrice * 0.95, // -5%
    fetchedAt: now,
    source: "Bybit-Fallback",
  };
}

function getBasePrice(symbol: string): number {
  // Set realistic base prices for different cryptos (updated to more current values)
  if (symbol.includes('BTC')) return 69500; // Updated to more recent BTC price
  if (symbol.includes('ETH')) return 3550;
  if (symbol.includes('SOL')) return 175;
  if (symbol.includes('XRP')) return 0.57;
  if (symbol.includes('DOGE')) return 0.17;
  if (symbol.includes('WLD')) return 7.45;
  if (symbol.includes('LTC')) return 86;
  if (symbol.includes('SUI')) return 1.28;
  
  // Default fallback
  return 100;
}
