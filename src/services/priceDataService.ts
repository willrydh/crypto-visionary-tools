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

const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const BASE_CANDLES_URL = "https://api.taapi.io/candles";
const BASE_PRICE_URL = "https://api.taapi.io/price";

const timeframeMap: Record<string, string> = {
  "1d": "1d",
  "7d": "4h",
  "30d": "1d",
  "90d": "1d"
};

export async function fetchHistoricalPrices(
  symbol: string = "BTC/USDT",
  timeframe: "1d" | "7d" | "30d" | "90d" = "1d"
): Promise<CandleData[]> {
  const exchange = "binance";
  const pair = symbol.toUpperCase().includes("ETH") ? "ETH/USDT" : "BTC/USDT";
  const interval = timeframeMap[timeframe] || "1d";

  const url = `${BASE_CANDLES_URL}?secret=${API_TOKEN}&exchange=${exchange}&symbol=${pair}&interval=${interval}&limit=100`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    const now = new Date().toISOString();

    return (json.value || []).map((candle: any) => ({
      timestamp: candle.timestamp * 1000,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume ?? 0,
      source: "TAAPI.io",
      fetchedAt: now
    }));
  } catch (error) {
    console.error("TAAPI.io error – using mock data.", error);
    const now = Date.now();
    return Array.from({ length: 24 }, (_, i) => {
      const ts = now - i * 3600000;
      return {
        timestamp: ts,
        open: 25000 + Math.random() * 500,
        high: 25500 + Math.random() * 500,
        low: 24500 + Math.random() * 500,
        close: 25000 + Math.random() * 500,
        volume: 0,
        source: "MockData",
        fetchedAt: new Date().toISOString()
      };
    }).reverse();
  }
}

export async function fetchCurrentPrice(symbol: string = "BTC/USDT"): Promise<number> {
  const exchange = "binance";
  const pair = symbol.toUpperCase().includes("ETH") ? "ETH/USDT" : "BTC/USDT";

  const url = `${BASE_PRICE_URL}?secret=${API_TOKEN}&exchange=${exchange}&symbol=${pair}&interval=1m`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (typeof data.value === "number") {
      return data.value;
    } else {
      throw new Error("Invalid response from TAAPI.io");
    }
  } catch (error) {
    console.error("TAAPI.io price fetch failed – returning mock value.", error);
    return 25000 + Math.random() * 1000;
  }
}

export async function fetchHighLowData(symbol: string = "BTC/USDT"): Promise<HighLowData> {
  const exchange = "binance";
  const pair = symbol.toUpperCase().includes("ETH") ? "ETH/USDT" : "BTC/USDT";
  const now = new Date().toISOString();

  try {
    const [daily, weekly] = await Promise.all([
      fetch(`${BASE_CANDLES_URL}?secret=${API_TOKEN}&exchange=${exchange}&symbol=${pair}&interval=1h&limit=24`),
      fetch(`${BASE_CANDLES_URL}?secret=${API_TOKEN}&exchange=${exchange}&symbol=${pair}&interval=4h&limit=42`)
    ]);

    const dailyData = (await daily.json()).value || [];
    const weeklyData = (await weekly.json()).value || [];

    const dailyHigh = Math.max(...dailyData.map((c: any) => c.high));
    const dailyLow = Math.min(...dailyData.map((c: any) => c.low));
    const weeklyHigh = Math.max(...weeklyData.map((c: any) => c.high));
    const weeklyLow = Math.min(...weeklyData.map((c: any) => c.low));

    return {
      dailyHigh,
      dailyLow,
      weeklyHigh,
      weeklyLow,
      fetchedAt: now,
      source: "TAAPI.io"
    };
  } catch (err) {
    console.error("Failed to fetch high/low data. Returning mock.", err);
    return {
      dailyHigh: 27500,
      dailyLow: 24500,
      weeklyHigh: 28500,
      weeklyLow: 24000,
      fetchedAt: now,
      source: "MockData"
    };
  }
}
