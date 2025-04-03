// Service to manage price data consistently across the app

const BYBIT_API_BASE_URL = 'https://api.bybit.com';

// Function to fetch real price data from Bybit API
export const fetchCurrentPrice = async (symbol: string) => {
  try {
    // Format symbol correctly for API
    const formattedSymbol = symbol.replace('/', '');
    
    console.log(`Fetching real price data for ${formattedSymbol} from Bybit API`);
    
    // Make request to Bybit API
    const response = await fetch(`${BYBIT_API_BASE_URL}/v5/market/tickers?category=spot&symbol=${formattedSymbol}`);
    
    if (!response.ok) {
      throw new Error(`Bybit API returned ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Bybit API response:', data);
    
    if (data.retCode !== 0 || !data.result || !data.result.list || data.result.list.length === 0) {
      throw new Error('Invalid response from Bybit API');
    }
    
    // Extract price data from response
    const tickerData = data.result.list[0];
    
    // Calculate 24h change percentage
    const lastPrice = parseFloat(tickerData.lastPrice);
    const prevPrice24h = parseFloat(tickerData.prevPrice24h);
    const change24h = ((lastPrice - prevPrice24h) / prevPrice24h) * 100;
    
    const timestamp = Date.now();
    
    return {
      symbol: formattedSymbol,
      price: lastPrice,
      change24h: change24h,
      volume24h: parseFloat(tickerData.volume24h),
      timestamp,
      lastUpdated: new Date(timestamp)
    };
  } catch (error) {
    console.error(`Error fetching price from Bybit API for ${symbol}:`, error);
    
    // Fallback to mock data if API call fails
    console.warn('Falling back to mock data due to API error');
    return fallbackMockData(symbol);
  }
};

// Fallback mock data in case the API fails
const fallbackMockData = (symbol: string) => {
  console.log('Using fallback mock data for current price');
  
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
    timestamp,
    lastUpdated: new Date(timestamp)
  };
};

// Fetch historical candle data for charts from Bybit API
export const fetchHistoricalPrices = async (symbol: string, interval: string, limit: number) => {
  try {
    console.log(`Loading chart data from Bybit API: ${symbol}, interval: ${interval}, limit: ${limit}`);
    
    // Convert interval to Bybit's format
    const bybitInterval = convertIntervalToBybit(interval);
    
    // Make request to Bybit API
    const response = await fetch(
      `${BYBIT_API_BASE_URL}/v5/market/kline?category=spot&symbol=${symbol}&interval=${bybitInterval}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`Bybit API returned ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Bybit kline API response:', data);
    
    if (data.retCode !== 0 || !data.result || !data.result.list) {
      throw new Error('Invalid response from Bybit API');
    }
    
    // Transform the data to our format
    // Bybit format: [timestamp, open, high, low, close, volume, turnover]
    const candles = data.result.list.map((item: string[]) => ({
      timestamp: parseInt(item[0]),
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
      volume: parseFloat(item[5])
    }));
    
    console.log(`Fetched ${candles.length} candles from Bybit API`);
    return candles;
  } catch (error) {
    console.error('Error fetching historical prices from Bybit API:', error);
    
    // Fallback to mock data
    console.warn('Falling back to mock data for historical prices');
    return generateMockHistoricalData(symbol, interval, limit);
  }
};

// Helper to convert our interval format to Bybit's format
const convertIntervalToBybit = (interval: string): string => {
  switch (interval) {
    case '1d': return 'D';
    case '4h': case '240': return '240';
    case '1h': case '60': return '60';
    case '15m': return '15';
    case 'D': return 'D';
    default: return '60'; // Default to 1h
  }
};

// Generate mock historical data as a fallback
const generateMockHistoricalData = (symbol: string, interval: string, limit: number) => {
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
  return data;
};

// Fetch high/low data for a period
export const fetchHighLowData = async (symbol: string, period: string = 'daily') => {
  try {
    console.log(`Fetching high/low data from Bybit API for ${symbol}`);
    
    // Format symbol correctly for API
    const formattedSymbol = symbol.replace('/', '');
    
    // Fetch different timeframes data
    // For hourly, we'll use 5m candles for the last hour (12 candles)
    const hourlyCandles = await fetchHistoricalPrices(formattedSymbol, '5', 12);
    // For daily, we'll use 1h candles for the last 24 hours
    const dailyCandles = await fetchHistoricalPrices(formattedSymbol, '60', 24);
    // For weekly, we'll use 4h candles for the last 7 days (42 candles)
    const weeklyCandles = await fetchHistoricalPrices(formattedSymbol, '240', 42);
    
    if (!dailyCandles.length || !weeklyCandles.length || !hourlyCandles.length) {
      throw new Error('No candle data received');
    }
    
    // Calculate hourly high/low from 5m candles
    const hourlyHigh = Math.max(...hourlyCandles.map(c => c.high));
    const hourlyLow = Math.min(...hourlyCandles.map(c => c.low));
    
    // Calculate daily high/low
    const dailyHigh = Math.max(...dailyCandles.map(c => c.high));
    const dailyLow = Math.min(...dailyCandles.map(c => c.low));
    
    // Calculate weekly high/low
    const weeklyHigh = Math.max(...weeklyCandles.map(c => c.high));
    const weeklyLow = Math.min(...weeklyCandles.map(c => c.low));
    
    // Get the latest price to determine current position
    const latestPrice = hourlyCandles[0].close;
    
    console.log(`Calculated ranges for ${symbol}: Hourly: ${hourlyLow}-${hourlyHigh}, Daily: ${dailyLow}-${dailyHigh}, Weekly: ${weeklyLow}-${weeklyHigh}`);
    
    return {
      symbol,
      period,
      high: period === 'daily' ? dailyHigh : weeklyHigh,
      low: period === 'daily' ? dailyLow : weeklyLow,
      hourlyHigh,
      hourlyLow,
      dailyHigh,
      dailyLow,
      weeklyHigh,
      weeklyLow,
      timestamp: new Date()
    };
  } catch (error) {
    console.error(`Error fetching high/low data from Bybit API for ${symbol}:`, error);
    
    // Fallback to mock data
    console.warn('Falling back to mock high/low data');
    return generateMockHighLowData(symbol, period);
  }
};

// Generate mock high/low data as a fallback
const generateMockHighLowData = (symbol: string, period: string = 'daily') => {
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
  
  // Generate random high/low values for various timeframes
  const hourlyVolatility = 0.02; // 2%
  const dailyVolatility = 0.05; // 5%
  const weeklyVolatility = 0.08; // 8%
  
  const hourlyHigh = basePrice * (1 + (Math.random() * hourlyVolatility));
  const hourlyLow = basePrice * (1 - (Math.random() * hourlyVolatility));
  
  const dailyHigh = basePrice * (1 + (Math.random() * dailyVolatility));
  const dailyLow = basePrice * (1 - (Math.random() * dailyVolatility));
  const weeklyHigh = basePrice * (1 + (Math.random() * weeklyVolatility));
  const weeklyLow = basePrice * (1 - (Math.random() * weeklyVolatility));
  
  // Return hourly, daily and weekly high/low data
  return {
    symbol,
    period,
    // For backward compatibility with old code
    high: period === 'daily' ? dailyHigh : weeklyHigh,
    low: period === 'daily' ? dailyLow : weeklyLow,
    // New properties to match what PriceThermometer expects
    hourlyHigh,
    hourlyLow,
    dailyHigh,
    dailyLow,
    weeklyHigh,
    weeklyLow,
    timestamp: new Date()
  };
};
