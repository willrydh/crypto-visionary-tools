
// Service to manage price data consistently across the app

// Mock data for now - in a real app this would fetch from an API
export const fetchCurrentPrice = async (symbol: string) => {
  console.log('Using mock data for current price');
  
  // Base price points for popular cryptos
  const basePrices: { [key: string]: number } = {
    'BTCUSDT': 70000,
    'ETHUSDT': 3500,
    'SOLUSDT': 175,
    'XRPUSDT': 0.57,
    'DOGEUSDT': 0.15,
    'ADAUSDT': 0.45,
    'LTCUSDT': 85,
    'WLDUSDT': 7.5,
    'BNBUSDT': 600
  };
  
  // Get base price or default
  const basePrice = basePrices[symbol] || 100;
  
  // Generate random change between -3% and +3%
  const change = (Math.random() * 6) - 3;
  
  // Apply change to price
  const price = basePrice * (1 + (change / 100));
  
  const timestamp = Date.now();
  
  return {
    symbol,
    price,
    change24h: change,
    volume24h: basePrice * 10000000 * (0.5 + Math.random()),
    timestamp, // Using timestamp (number) instead of lastUpdated (Date)
    lastUpdated: new Date(timestamp) // Keeping lastUpdated for backward compatibility
  };
};

// Fetch historical candle data for charts - renamed from fetchCandleData to fetchHistoricalPrices
// to match the imports in other files
export const fetchHistoricalPrices = async (symbol: string, interval: string, limit: number) => {
  console.log(`Loading chart data: ${symbol}, interval: ${interval}, limit: ${limit}`);
  console.log('Using mock data for historical prices');
  
  // Base prices for different cryptos
  const basePrices: { [key: string]: number } = {
    'BTCUSDT': 70000,
    'ETHUSDT': 3500,
    'SOLUSDT': 175,
    'XRPUSDT': 0.57,
    'DOGEUSDT': 0.15,
    'ADAUSDT': 0.45,
    'LTCUSDT': 85,
    'WLDUSDT': 7.5,
    'BNBUSDT': 600
  };
  
  // Get base price or default
  const basePrice = basePrices[symbol.replace('/', '')] || 100;
  
  // Generate mock data
  const now = Date.now();
  const intervalMs = interval === '1d' ? 86400000 : 
                     interval === '4h' ? 14400000 : 
                     interval === '1h' ? 3600000 : 
                     interval === '15m' ? 900000 : 
                     interval === 'D' ? 86400000 : 
                     interval === '240' ? 14400000 : 
                     interval === '60' ? 3600000 : 60000;
  
  const data = [];
  let lastClose = basePrice;
  
  for (let i = limit - 1; i >= 0; i--) {
    const timestamp = now - (i * intervalMs);
    const volatility = basePrice * 0.02; // 2% volatility
    
    // Generate realistic-looking candle
    const change = (Math.random() - 0.5) * volatility;
    const close = lastClose + change;
    const open = lastClose;
    const high = Math.max(open, close) + (Math.random() * volatility * 0.5);
    const low = Math.min(open, close) - (Math.random() * volatility * 0.5);
    const volume = basePrice * 100000 * (0.5 + Math.random());
    
    data.push({
      timestamp,
      open,
      high, 
      low,
      close,
      volume
    });
    
    lastClose = close;
  }
  
  console.log(`Generated mock data: ${data.length} data points`);
  console.log(`Fetched candle data count: ${data.length}`);
  console.log(`Processed chart data points: ${data.length}`);
  
  return data;
};

// Fetch high/low data for a period
export const fetchHighLowData = async (symbol: string, period: string = 'daily') => {
  console.log(`Using mock data for high/low data: ${period}`);
  
  // Base prices for different cryptos
  const basePrices: { [key: string]: number } = {
    'BTCUSDT': 70000,
    'ETHUSDT': 3500,
    'SOLUSDT': 175,
    'XRPUSDT': 0.57,
    'DOGEUSDT': 0.15
  };
  
  // Get base price or default
  const basePrice = basePrices[symbol.replace('/', '')] || 100;
  
  // Generate random high/low values for daily and weekly
  const dailyVolatility = 0.05; // 5%
  const weeklyVolatility = 0.08; // 8%
  
  const dailyHigh = basePrice * (1 + (Math.random() * dailyVolatility));
  const dailyLow = basePrice * (1 - (Math.random() * dailyVolatility));
  const weeklyHigh = basePrice * (1 + (Math.random() * weeklyVolatility));
  const weeklyLow = basePrice * (1 - (Math.random() * weeklyVolatility));
  
  // Return both daily and weekly high/low data
  return {
    symbol,
    period,
    // For backward compatibility with old code
    high: period === 'daily' ? dailyHigh : weeklyHigh,
    low: period === 'daily' ? dailyLow : weeklyLow,
    // New properties to match what PriceThermometer expects
    dailyHigh,
    dailyLow,
    weeklyHigh,
    weeklyLow,
    timestamp: new Date()
  };
};
