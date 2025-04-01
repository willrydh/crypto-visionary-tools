
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
  
  return {
    symbol,
    price,
    change24h: change,
    volume24h: basePrice * 10000000 * (0.5 + Math.random()),
    lastUpdated: new Date()
  };
};

// Fetch historical candle data for charts
export const fetchCandleData = async (symbol: string, interval: string, limit: number) => {
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
                     interval === '15m' ? 900000 : 60000;
  
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
export const fetchHighLowData = async (symbol: string, period: string) => {
  console.log('Using mock data for high/low data');
  
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
  
  // Generate random high/low values
  const high = basePrice * (1 + (Math.random() * 0.05)); // Up to 5% higher
  const low = basePrice * (1 - (Math.random() * 0.05));  // Up to 5% lower
  
  return {
    symbol,
    period,
    high,
    low,
    timestamp: new Date()
  };
};
