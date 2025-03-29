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

const timeframeMap: Record<string, string> = {
  "1d": "1day",
  "7d": "4h",
  "30d": "1day",
  "90d": "1day"
};

export async function fetchHistoricalPrices(
  symbol: string = "BTC/USD",
  timeframe: "1d" | "7d" | "30d" | "90d" = "1d"
): Promise<CandleData[]> {
  const interval = timeframeMap[timeframe] || "1day";
  const url = `${BASE_URL}/time_series?symbol=${symbol}&interval=${interval}&outputsize=100&apikey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    const now = new Date().toISOString();

    return (json.values || []).map((candle: any) => ({
      timestamp: new Date(candle.datetime).getTime(),
      open: parseFloat(candle.open),
      high: parseFloat(candle.high),
      low: parseFloat(candle.low),
      close: parseFloat(candle.close),
      volume: parseFloat(candle.volume ?? 0),
      source: "TwelveData",
      fetchedAt: now
    }));
  } catch (error) {
    console.error("TwelveData error – using mock data.", error);
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

export async function fetchCurrentPrice(symbol: string = "BTC/USD"): Promise<number> {
  const url = `${BASE_URL}/price?symbol=${symbol}&apikey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data && typeof data.price === "string") {
      return parseFloat(data.price);
    } else {
      throw new Error("Invalid response from TwelveData");
    }
  } catch (error) {
    console.error("TwelveData price fetch failed – returning mock value.", error);
    return 25000 + Math.random() * 1000;
  }
}

export async function fetchHighLowData(symbol: string = "BTC/USD"): Promise<HighLowData> {
  const now = new Date().toISOString();

  try {
    const [dailyRes, weeklyRes] = await Promise.all([
      fetch(`${BASE_URL}/time_series?symbol=${symbol}&interval=1h&outputsize=24&apikey=${API_KEY}`),
      fetch(`${BASE_URL}/time_series?symbol=${symbol}&interval=4h&outputsize=42&apikey=${API_KEY}`)
    ]);

    const dailyData = (await dailyRes.json()).values || [];
    const weeklyData = (await weeklyRes.json()).values || [];

    const dailyHigh = Math.max(...dailyData.map((c: any) => parseFloat(c.high)));
    const dailyLow = Math.min(...dailyData.map((c: any) => parseFloat(c.low)));
    const weeklyHigh = Math.max(...weeklyData.map((c: any) => parseFloat(c.high)));
    const weeklyLow = Math.min(...weeklyData.map((c: any) => parseFloat(c.low)));

    const price = await fetchCurrentPrice(symbol);

    return {
      dailyHigh,
      dailyLow,
      weeklyHigh,
      weeklyLow,
      fetchedAt: now,
      source: "TwelveData"
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
