// services/priceDataService.ts

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

const API_KEY = "YOUR_TWELVEDATA_API_KEY"; // Replace with env variable later
const BASE_URL = "https://api.twelvedata.com";

export async function fetchHistoricalPrices(
  symbol: string = "BTC/USDT",
  interval: string = "1h",
  outputsize: number = 100
): Promise<CandleData[]> {
  const now = new Date().toISOString();
  const [base, quote] = symbol.split("/");

  const url = `${BASE_URL}/time_series?symbol=${base}/${quote}&interval=${interval}&outputsize=${outputsize}&apikey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.values) throw new Error("No data returned");

    return data.values.map((item: any) => ({
      timestamp: new Date(item.datetime).getTime(),
      open: parseFloat(item.open),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      close: parseFloat(item.close),
      volume: parseFloat(item.volume ?? 0),
      source: "TwelveData",
      fetchedAt: now
    }));
  } catch (err) {
    console.error("TwelveData fetch error, returning mock data", err);
    return Array.from({ length: 24 }, (_, i) => {
      const ts = Date.now() - i * 3600000;
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

export async function fetchHighLowData(symbol: string = "BTC/USDT"): Promise<HighLowData> {
  const now = new Date().toISOString();
  const candles = await fetchHistoricalPrices(symbol, "1h", 168); // 1 week of hourly data

  const dailyCandles = candles.slice(-24);
  const weeklyCandles = candles;

  const dailyHigh = Math.max(...dailyCandles.map((c) => c.high));
  const dailyLow = Math.min(...dailyCandles.map((c) => c.low));
  const weeklyHigh = Math.max(...weeklyCandles.map((c) => c.high));
  const weeklyLow = Math.min(...weeklyCandles.map((c) => c.low));

  return {
    dailyHigh,
    dailyLow,
    weeklyHigh,
    weeklyLow,
    fetchedAt: now,
    source: "TwelveData"
  };
}

export async function fetchCurrentPrice(symbol: string = "BTC/USDT"): Promise<number> {
  const [base, quote] = symbol.split("/");
  const url = `${BASE_URL}/price?symbol=${base}/${quote}&apikey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.price) return parseFloat(data.price);

    throw new Error("Invalid price data");
  } catch (error) {
    console.error("TwelveData price fetch failed, returning mock", error);
    return 25000 + Math.random() * 1000;
  }
}
