
import { CryptoPrice, TechnicalIndicator } from '@/utils/mockData';

// API endpoint constants
const COINBASE_API_URL = 'https://api.coinbase.com/v2';
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const TAAPI_IO_URL = 'https://api.taapi.io';
const TAAPI_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with actual key when available

// Fetch current price data from Coinbase API
export async function fetchCurrentPrice(symbol: string = 'BTC-USD'): Promise<CryptoPrice> {
  try {
    // Get spot price
    const spotResponse = await fetch(`${COINBASE_API_URL}/prices/${symbol}/spot`);
    
    if (!spotResponse.ok) {
      throw new Error(`Coinbase API error: ${spotResponse.status}`);
    }
    
    const spotData = await spotResponse.json();
    const currentPrice = parseFloat(spotData.data.amount);
    
    // Try to get 24h stats, but fallback if it fails
    try {
      const statsResponse = await fetch(`${COINBASE_API_URL}/products/${symbol}/stats`);
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        
        // Calculate change percentage
        const openPrice = parseFloat(statsData.data.open);
        const change24h = ((currentPrice - openPrice) / openPrice) * 100;
        
        // Format response to match our CryptoPrice interface
        return {
          symbol: symbol.replace('-', '/'),
          price: currentPrice,
          change24h: change24h,
          volume24h: parseFloat(statsData.data.volume) * currentPrice,
          marketCap: 0, // Not provided by this API
          lastUpdated: new Date()
        };
      } else {
        throw new Error('Stats API failed');
      }
    } catch (statsError) {
      console.error('Error fetching stats data:', statsError);
      
      // Fallback to CoinGecko for additional data
      try {
        const coinId = symbol.toLowerCase().startsWith('btc') ? 'bitcoin' : 
                      symbol.toLowerCase().startsWith('eth') ? 'ethereum' : 'bitcoin';
        
        const geckoResponse = await fetch(
          `${COINGECKO_API_URL}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`
        );
        
        if (geckoResponse.ok) {
          const geckoData = await geckoResponse.json();
          
          return {
            symbol: symbol.replace('-', '/'),
            price: currentPrice, // Use Coinbase price as it's more real-time
            change24h: geckoData[coinId].usd_24h_change || 0,
            volume24h: geckoData[coinId].usd_24h_vol || 0,
            marketCap: geckoData[coinId].usd_market_cap || 0,
            lastUpdated: new Date()
          };
        } else {
          throw new Error('CoinGecko API failed');
        }
      } catch (geckoError) {
        console.error('Error fetching CoinGecko data:', geckoError);
        
        // Return with minimal data
        return {
          symbol: symbol.replace('-', '/'),
          price: currentPrice,
          change24h: 0, // No data available
          volume24h: 0, // No data available
          marketCap: 0, // No data available
          lastUpdated: new Date()
        };
      }
    }
  } catch (error) {
    console.error('Error fetching price data:', error);
    // Return mock data as fallback
    const mockPrice = getMockBtcPrice();
    console.log('Using mock price data as fallback:', mockPrice);
    return mockPrice;
  }
}

// Fetch historical price data for charts from CoinGecko
export async function fetchHistoricalPrices(
  coinId: string = 'bitcoin',
  days: number = 7,
  interval?: string
): Promise<{ timestamps: number[], prices: number[] }> {
  try {
    // Build the URL based on parameters
    let url = `${COINGECKO_API_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
    
    // Only add interval if specified (hourly is restricted to Enterprise plan)
    if (interval) {
      url += `&interval=${interval}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('CoinGecko API error:', errorData);
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract timestamps and prices from the response
    const timestamps = data.prices.map((item: [number, number]) => item[0]);
    const prices = data.prices.map((item: [number, number]) => item[1]);
    
    return { timestamps, prices };
  } catch (error) {
    console.error('Error fetching historical price data:', error);
    // Return mock data as fallback
    return {
      timestamps: Array.from({ length: 24 }, (_, i) => Date.now() - (23 - i) * 3600000),
      prices: Array.from({ length: 24 }, () => 35000 + Math.random() * 2000)
    };
  }
}

// Calculate technical indicators based on historical price data
export async function calculateTechnicalIndicators(
  coinId: string = 'bitcoin',
  days: number = 14
): Promise<TechnicalIndicator[]> {
  try {
    // In a production app, we would fetch data from Taapi.io here
    // For example:
    // const rsiResponse = await fetch(`${TAAPI_IO_URL}/rsi?secret=${TAAPI_API_KEY}&exchange=binance&symbol=BTC/USDT&interval=1h&optInTimePeriod=14`);
    // const rsiData = await rsiResponse.json();
    
    // Fetch historical data to calculate indicators (as a fallback)
    const { prices } = await fetchHistoricalPrices(coinId, days, 'daily');
    
    // Calculate Simple Moving Average (SMA)
    const calculateSMA = (period: number): number => {
      if (prices.length < period) return 0;
      const sum = prices.slice(-period).reduce((acc, price) => acc + price, 0);
      return sum / period;
    };
    
    // Calculate Relative Strength Index (RSI)
    const calculateRSI = (): number => {
      if (prices.length < 14) return 50;
      
      let gains = 0;
      let losses = 0;
      
      for (let i = prices.length - 14; i < prices.length - 1; i++) {
        const change = prices[i + 1] - prices[i];
        if (change >= 0) {
          gains += change;
        } else {
          losses -= change;
        }
      }
      
      if (losses === 0) return 100;
      
      const rs = gains / losses;
      return 100 - (100 / (1 + rs));
    };
    
    // Get current price
    const currentPrice = prices[prices.length - 1];
    
    // Calculate SMA values
    const sma20 = calculateSMA(20);
    const sma50 = calculateSMA(50);
    
    // Calculate RSI
    const rsi = calculateRSI();
    
    // Determine signals based on indicator values
    const ma20Signal = currentPrice > sma20 ? 'bullish' : 'bearish';
    const rsiSignal = rsi > 70 ? 'bearish' : rsi < 30 ? 'bullish' : 'neutral';
    
    return [
      {
        name: 'MA20',
        value: Math.round(sma20),
        signal: ma20Signal,
        description: '20-period Moving Average'
      },
      {
        name: 'MA50',
        value: Math.round(sma50),
        signal: currentPrice > sma50 ? 'bullish' : 'bearish',
        description: '50-period Moving Average'
      },
      {
        name: 'RSI',
        value: Math.round(rsi),
        signal: rsiSignal,
        description: 'Relative Strength Index'
      },
      {
        name: 'Price',
        value: Math.round(currentPrice),
        signal: currentPrice > sma20 ? 'bullish' : 'bearish',
        description: 'Current Price vs MA20'
      },
      {
        name: 'Vol Avg',
        value: '24H',
        signal: 'neutral',
        description: '24 Hour Volume Average'
      }
    ];
  } catch (error) {
    console.error('Error calculating technical indicators:', error);
    // Return mock indicators as fallback
    return getMockTechnicalIndicators();
  }
}

// Function to create a trade suggestion based on current technical analysis
export async function generateTradeSuggestion(
  coinId: string = 'bitcoin',
  timeframe: 'scalp' | 'day' | 'swing' = 'day',
  leverage: number = 5
): Promise<any> {
  try {
    // Fetch current price
    const priceData = await fetchCurrentPrice();
    const currentPrice = priceData.price;
    
    // Calculate technical indicators
    const indicators = await calculateTechnicalIndicators(coinId);
    
    // Determine trade direction based on indicators
    let bullishSignals = 0;
    let bearishSignals = 0;
    
    indicators.forEach(indicator => {
      if (indicator.signal === 'bullish') bullishSignals++;
      if (indicator.signal === 'bearish') bearishSignals++;
    });
    
    const direction = bullishSignals > bearishSignals ? 'long' : 'short';
    
    // Calculate entry, stop loss and take profit based on timeframe
    let stopLossPercentage = 0;
    let takeProfitPercentage = 0;
    
    switch(timeframe) {
      case 'scalp':
        stopLossPercentage = 0.5;
        takeProfitPercentage = 1.5;
        break;
      case 'day':
        stopLossPercentage = 1.0;
        takeProfitPercentage = 3.0;
        break;
      case 'swing':
        stopLossPercentage = 2.0;
        takeProfitPercentage = 6.0;
        break;
    }
    
    let entry = currentPrice;
    let stopLoss = direction === 'long' 
      ? entry * (1 - stopLossPercentage / 100) 
      : entry * (1 + stopLossPercentage / 100);
    let takeProfit = direction === 'long' 
      ? entry * (1 + takeProfitPercentage / 100) 
      : entry * (1 - takeProfitPercentage / 100);
    
    // Calculate confidence based on indicator agreement
    const totalSignals = indicators.length;
    const dominantSignals = Math.max(bullishSignals, bearishSignals);
    const confidence = Math.round((dominantSignals / totalSignals) * 100);
    
    // Calculate probability based on confluence of signals
    const probability = Math.round(50 + (confidence - 50) * 0.8);
    
    return {
      direction,
      entry,
      stopLoss,
      takeProfit,
      probability,
      leverage,
      timeframe,
      createdAt: new Date(),
      indicators,
      confidence
    };
  } catch (error) {
    console.error('Error generating trade suggestion:', error);
    // Return mock suggestion as fallback
    const currentPrice = (await fetchCurrentPrice()).price;
    return getMockTradeSuggestion(currentPrice);
  }
}

// Import mock data generators for fallback
import { getMockBtcPrice, getMockTechnicalIndicators, getMockTradeSuggestion } from '@/utils/mockData';
