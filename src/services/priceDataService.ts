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

const API_KEY = "83bf08e89ae944609632771c593961a3";
const BASE_URL = "https://api.twelvedata.com";

function convertToTimestamp(dateStr: string): number {
  return new Date(dateStr).getTime();
}

export async function fetchHistoricalPrices(
  symbol: string = "BTC/USDT",
  timeframe: "1d" | "7d" | "30d" | "90d" = "1d"
): Promise<CandleData[]> {
  const intervalMap: Record<string, string> = {
    "1d": "1h",
    "7d": "1h",
    "30d": "1d",
    "90d": "1d",
  };

  const interval = intervalMap[timeframe] || "1d";
  const url = `${BASE_URL}/time_series?symbol=${symbol}&interval=${interval}&outputsize=100&apikey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (!json?.values) throw new Error("No data");

    const now = new Date().toISOString();

    return json.values.map((candle: any) => ({
      timestamp: convertToTimestamp(candle.datetime),
      open: parseFloat(candle.open),
      high: parseFloat(candle.high),
      low: parseFloat(candle.low),
      close: parseFloat(candle.close),
      volume: parseFloat(candle.volume ?? "0"),
      source: "Twelve Data",
      fetchedAt: now,
    }));
  } catch (err) {
    console.error("Failed to fetch historical prices. Returning mock.", err);
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
        fetchedAt: new Date().toISOString(),
      };
    }).reverse();
  }
}

export async function fetchCurrentPrice(symbol: string = "BTC/USDT"): Promise<number> {
  const url = `${BASE_URL}/price?symbol=${symbol}&apikey=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data?.price) throw new Error("Missing price");

    return parseFloat(data.price);
  } catch (error) {
    console.error("Failed to fetch current price. Returning mock.", error);
    return 25000 + Math.random() * 1000;
  }
}

export async function fetchHighLowData(symbol: string = "BTC/USDT"): Promise<HighLowData> {
  try {
    const candles = await fetchHistoricalPrices(symbol, "7d");
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);

    return {
      dailyHigh: Math.max(...highs.slice(0, 24)),
      dailyLow: Math.min(...lows.slice(0, 24)),
      weeklyHigh: Math.max(...highs),
      weeklyLow: Math.min(...lows),
      fetchedAt: new Date().toISOString(),
      source: "Twelve Data"
    };
  } catch (err) {
    console.error("Failed to fetch high/low data. Returning mock.", err);
    return {
      dailyHigh: 27500,
      dailyLow: 24500,
      weeklyHigh: 28500,
      weeklyLow: 24000,
      fetchedAt: new Date().toISOString(),
      source: "MockData"
    };
  }
}
