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

const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const BASE_URL = "https://api.taapi.io/candles";

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

  const url = `${BASE_URL}?secret=${API_TOKEN}&exchange=${exchange}&symbol=${pair}&interval=${interval}&limit=100`;

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
