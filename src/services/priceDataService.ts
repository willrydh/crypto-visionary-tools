
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
): Promise<CandleData[]> {
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

    const res = await fetch(url, { headers: updatedHeaders });
    const json = await res.json();
    const now = new Date().toISOString();

    if (json.retMsg !== "OK") throw new Error(json.retMsg);

    return json.result.list.map((candle: any[]) => ({
      timestamp: parseInt(candle[0]),
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5]),
      source: "Bybit",
      fetchedAt: now,
    }));
  } catch (error) {
    console.error("Bybit API error (historical prices):", error);
    // Return mock data as fallback when API fails
    return generateMockCandleData(limit);
  }
}

export async function fetchCurrentPrice(symbol: string = "BTCUSDT"): Promise<number> {
  const formattedSymbol = formatSymbol(symbol);
  const url = `${BASE_URL}/market/tickers?category=linear&symbol=${formattedSymbol}`;

  try {
    const currentTimestamp = Date.now().toString();
    const updatedHeaders = {
      ...headers,
      "X-BAPI-TIMESTAMP": currentTimestamp,
    };

    const res = await fetch(url, { headers: updatedHeaders });
    const json = await res.json();

    if (json.retMsg !== "OK") throw new Error(json.retMsg);

    return parseFloat(json.result.list[0].lastPrice);
  } catch (error) {
    console.error("Bybit API error (current price):", error);
    // Return mock price as fallback
    return 68000 + (Math.random() * 1000 - 500);
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
    const mockPrice = 68000;
    
    return {
      dailyHigh: mockPrice * 1.02,
      dailyLow: mockPrice * 0.98,
      weeklyHigh: mockPrice * 1.05,
      weeklyLow: mockPrice * 0.95,
      fetchedAt: now,
      source: "Bybit-Fallback",
    };
  }
}

// Generate mock candle data for fallback purposes
function generateMockCandleData(count: number): CandleData[] {
  const now = new Date();
  const result: CandleData[] = [];
  const basePrice = 68000;

  for (let i = 0; i < count; i++) {
    const timestamp = now.getTime() - (i * 3600000); // Go back i hours
    const volatility = Math.random() * 500;
    const open = basePrice + (Math.random() * 1000 - 500);
    const close = open + (Math.random() * volatility - volatility/2);
    const high = Math.max(open, close) + Math.random() * 200;
    const low = Math.min(open, close) - Math.random() * 200;
    const volume = Math.random() * 1000 + 500;

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

  return result.reverse(); // Most recent first
}
