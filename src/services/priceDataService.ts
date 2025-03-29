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

export async function fetchHistoricalPrices(
  symbol: string = "BTCUSDT",
  interval: string = "D", // D = daily, 60 = hourly, 240 = 4h
  limit: number = 100
): Promise<CandleData[]> {
  const url = `${BASE_URL}/market/kline?category=linear&symbol=${symbol}&interval=${interval}&limit=${limit}`;

  try {
    const res = await fetch(url, { headers });
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
    return [];
  }
}

export async function fetchCurrentPrice(symbol: string = "BTCUSDT"): Promise<number> {
  const url = `${BASE_URL}/market/tickers?category=linear&symbol=${symbol}`;

  try {
    const res = await fetch(url, { headers });
    const json = await res.json();

    if (json.retMsg !== "OK") throw new Error(json.retMsg);

    return parseFloat(json.result.list[0].lastPrice);
  } catch (error) {
    console.error("Bybit API error (current price):", error);
    return 0;
  }
}

export async function fetchHighLowData(symbol: string = "BTCUSDT"): Promise<HighLowData> {
  const now = new Date().toISOString();

  try {
    const [dailyCandles, weeklyCandles] = await Promise.all([
      fetchHistoricalPrices(symbol, "60", 24), // hourly, 24 hours
      fetchHistoricalPrices(symbol, "240", 42), // 4-hour candles, about 1 week
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
    return {
      dailyHigh: 0,
      dailyLow: 0,
      weeklyHigh: 0,
      weeklyLow: 0,
      fetchedAt: now,
      source: "Bybit-Error",
    };
  }
}
