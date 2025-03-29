export interface HighLowData {
  dailyHigh: number;
  dailyLow: number;
  weeklyHigh: number;
  weeklyLow: number;
  fetchedAt: string;
  source: string;
}

export async function fetchHighLowData(symbol: string = "BTC/USDT"): Promise<HighLowData> {
  const exchange = "binance";
  const pair = symbol.toUpperCase().includes("ETH") ? "ETH/USDT" : "BTC/USDT";
  const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
  const now = new Date().toISOString();

  try {
    const [daily, weekly] = await Promise.all([
      fetch(`https://api.taapi.io/candles?secret=${API_TOKEN}&exchange=${exchange}&symbol=${pair}&interval=1h&limit=24`),
      fetch(`https://api.taapi.io/candles?secret=${API_TOKEN}&exchange=${exchange}&symbol=${pair}&interval=4h&limit=42`)
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
