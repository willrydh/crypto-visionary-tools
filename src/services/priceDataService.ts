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

const API_KEY = "kOQYCVeSeczfY49QU2";
const API_SECRET = "mfCfpXUQs8dds4DzfNV0AVL0BaXcc2jgBKuZ";
const BASE_URL = "https://api.bybit.com/v5";

const headers = {
  "X-BAPI-API-KEY": API_KEY,
  "X-BAPI-TIMESTAMP": Date.now().toString(),
  "X-BAPI-RECV-WINDOW": "5000",
};

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

export async function fetchHistoricalPrices(
  symbol: string = "BTCUSDT",
  interval: string = "D", // D = daily, 60 = hourly, 240 = 4h
  limit: number = 100
): Promise<PriceCandle[]> {
  const formattedSymbol = formatSymbol(symbol);
  const formattedInterval = typeof interval === 'string' && interval.length <= 2 ? 
    formatTimeframe(interval) : interval;
    
  const url = `${BASE_URL}/market/kline?category=linear&symbol=${formattedSymbol}&interval=${formattedInterval}&limit=${limit}`;

  try {
    const currentTimestamp = Date.now().toString();
    const updatedHeaders = {
      ...headers,
      "X-BAPI-TIMESTAMP": currentTimestamp,
    };

    console.log('Fetching historical prices from:', url);
    const res = await fetch(url, { headers: updatedHeaders });
    const json = await res.json();
    console.log('API response status:', json.retMsg);
    const now = new Date().toISOString();

    if (json.retMsg !== "OK") throw new Error(json.retMsg);

    // Ensure we have data in the response
    if (!json.result?.list || json.result.list.length === 0) {
      console.error('No candle data in API response');
      return generateMockCandleData(limit, symbol);
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
    // Return mock data as fallback when API fails
    return generateMockCandleData(limit, symbol);
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
  const url = `${BASE_URL}/market/tickers?category=linear&symbol=${formattedSymbol}`;

  try {
    const currentTimestamp = Date.now().toString();
    const updatedHeaders = {
      ...headers,
      "X-BAPI-TIMESTAMP": currentTimestamp,
    };

    console.log('Fetching current price from:', url);
    const res = await fetch(url, { headers: updatedHeaders });
    const json = await res.json();
    console.log('Current price API response status:', json.retMsg);

    if (json.retMsg !== "OK" || !json.result?.list?.[0]) {
      throw new Error(json.retMsg || 'Invalid response format');
    }

    return {
      price: parseFloat(json.result.list[0].lastPrice),
      change24h: parseFloat(json.result.list[0].price24hPcnt) * 100,
      volume24h: parseFloat(json.result.list[0].volume24h),
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("Bybit API error (current price):", error);
    // Return mock price as fallback based on symbol
    return generateMockCurrentPrice(symbol);
  }
}

export async function fetchHighLowData(symbol: string = "BTCUSDT"): Promise<HighLowData> {
  const formattedSymbol = formatSymbol(symbol);
  const now = new Date().toISOString();

  try {
    // Use updated headers with current timestamp for each request
    const currentTimestamp = Date.now().toString();
    const updatedHeaders = {
      ...headers,
      "X-BAPI-TIMESTAMP": currentTimestamp,
    };

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
      source: "Bybit",
    };
  } catch (error) {
    console.error("Bybit API error (high/low data):", error);
    
    // Return mock data as fallback
    return generateMockHighLowData(symbol);
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
  
  return {
    price: basePrice + (Math.random() * basePrice * 0.02 - basePrice * 0.01), // +/- 1%
    change24h: (Math.random() * 6) - 3, // -3% to +3%
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
  // Set realistic base prices for different cryptos
  if (symbol.includes('BTC')) return 68000;
  if (symbol.includes('ETH')) return 3500;
  if (symbol.includes('SOL')) return 170;
  if (symbol.includes('XRP')) return 0.55;
  if (symbol.includes('DOGE')) return 0.15;
  if (symbol.includes('WLD')) return 7.50;
  if (symbol.includes('LTC')) return 80;
  if (symbol.includes('SUI')) return 1.20;
  
  // Default fallback
  return 100;
}
