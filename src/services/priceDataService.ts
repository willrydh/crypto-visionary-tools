import axios from "axios";

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

const BASE_URL = "https://api.coingecko.com/api/v3";

export async function fetchHistoricalPrices(
  symbol: string = "BTC/USD",
  timeframe: "1d" | "7d" | "30d" | "90d" = "1d"
): Promise<CandleData[]> {
  const coinId = symbol.toLowerCase().includes("eth") ? "ethereum" : "bitcoin";

  // Valid values for CoinGecko OHLC: 1, 7, 14, 30, 90, 180, 365, max
  const validTimeframes = { "1d": 1, "7d": 7, "30d": 30, "90d": 90 };
  const days = validTimeframes[timeframe] || 1;

  try {
    const url = `${BASE_URL}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`;
    const response = await axios.get(url);

    const now = new Date().toISOString();

    const formatted: CandleData[] = response.data.map((entry: number[]) => ({
      timestamp: entry[0],
      open: entry[1],
      high: entry[2],
      low: entry[3],
      close: entry[4],
      volume: 0, // Not provided by CoinGecko OHLC endpoint
      source: "CoinGecko",
      fetchedAt: now
    }));

    return formatted;
  } catch (error) {
    console.error("⚠️ Failed to fetch from CoinGecko. Returning mock data.", error);
    const now = Date.now();
    const mock: CandleData[] = Array.from({ length: 24 }, (_, i) => {
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

    return mock;
  }
}
