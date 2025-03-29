import { Timeframe } from '@/contexts/TimeframeContext';
import { PriceLevel, MarketStructure } from '@/contexts/SupportResistanceContext';

export interface PriceCandle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const fetchCurrentPrice = async (symbol: string = 'BTC/USDT'): Promise<{
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: number;
}> => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`);
    
    if (response.ok) {
      const data = await response.json();
      
      return {
        price: data.bitcoin.usd,
        change24h: data.bitcoin.usd_24h_change,
        volume24h: data.bitcoin.usd_24h_vol,
        timestamp: Date.now()
      };
    } else {
      throw new Error('CoinGecko API failed');
    }
  } catch (error) {
    console.error('Error fetching price data:', error);
    
    return {
      price: 83300 + (Math.random() * 1000 - 500),
      change24h: (Math.random() * 6) - 3,
      volume24h: 24500000000 + (Math.random() * 5000000000),
      timestamp: Date.now()
    };
  }
};

export const fetchHistoricalPrices = async (
  symbol: string = 'BTC/USDT',
  timeframe: Timeframe = '1h',
  limit: number = 100
): Promise<PriceCandle[]> => {
  try {
    return generateMockCandles(timeframe, limit);
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    return generateMockCandles(timeframe, limit);
  }
};

const generateMockCandles = (timeframe: Timeframe, limit: number): PriceCandle[] => {
  const candles: PriceCandle[] = [];
  const basePrice = 83000;
  const now = Date.now();
  const millisecondsPerInterval = getMillisecondsForTimeframe(timeframe);
  
  let currentPrice = basePrice;
  
  for (let i = 0; i < limit; i++) {
    const trend = Math.random() > 0.48 ? 1 : -1;
    const movement = Math.random() * 300 * trend;
    currentPrice += movement;
    
    currentPrice = Math.max(currentPrice, basePrice * 0.8);
    currentPrice = Math.min(currentPrice, basePrice * 1.2);
    
    const open = currentPrice;
    const close = open + (Math.random() * 200 - 100);
    const high = Math.max(open, close) + Math.random() * 100;
    const low = Math.min(open, close) - Math.random() * 100;
    const volume = 100000000 + Math.random() * 50000000;
    
    const timestamp = now - (millisecondsPerInterval * (limit - i - 1));
    
    candles.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume
    });
  }
  
  return candles;
};

const getMillisecondsForTimeframe = (timeframe: Timeframe): number => {
  switch (timeframe) {
    case '1m':
      return 60 * 1000;
    case '5m':
      return 5 * 60 * 1000;
    case '15m':
      return 15 * 60 * 1000;
    case '30m':
      return 30 * 60 * 1000;
    case '1h':
      return 60 * 60 * 1000;
    case '4h':
      return 4 * 60 * 60 * 1000;
    case '1d':
      return 24 * 60 * 60 * 1000;
    case '1w':
      return 7 * 24 * 60 * 60 * 1000;
    default:
      return 60 * 60 * 1000;
  }
};

export const fetchSupportResistanceLevels = async (
  symbol: string,
  timeframe: Timeframe
): Promise<{
  levels: PriceLevel[];
  structure: MarketStructure;
}> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const basePrice = 83300;
  const levels: PriceLevel[] = [];
  
  levels.push({
    price: basePrice - 1200,
    type: 'support',
    strength: 'strong',
    timeframe: timeframe,
    source: 'pivot',
    description: 'Daily pivot support'
  });
  
  levels.push({
    price: basePrice - 800,
    type: 'support',
    strength: 'medium',
    timeframe: timeframe,
    source: 'swing',
    description: 'Previous swing low'
  });
  
  levels.push({
    price: basePrice - 400,
    type: 'support',
    strength: 'weak',
    timeframe: timeframe,
    source: 'volume',
    description: 'Volume cluster'
  });
  
  levels.push({
    price: basePrice + 500,
    type: 'resistance',
    strength: 'weak',
    timeframe: timeframe,
    source: 'swing',
    description: 'Previous swing high'
  });
  
  levels.push({
    price: basePrice + 1000,
    type: 'resistance',
    strength: 'medium',
    timeframe: timeframe,
    source: 'historical',
    description: 'Historical resistance'
  });
  
  levels.push({
    price: basePrice + 1800,
    type: 'resistance',
    strength: 'strong',
    timeframe: timeframe,
    source: 'pivot',
    description: 'Monthly resistance'
  });
  
  const structure: MarketStructure = {
    trend: Math.random() > 0.5 ? 'uptrend' : 'downtrend',
    description: 'Market structure based on recent price action',
    hh: basePrice + 1500,
    lh: basePrice + 700,
    hl: basePrice - 600,
    ll: basePrice - 1500,
    timeframe: timeframe
  };
  
  return { levels, structure };
};

export const fetchHighLowData = async (
  symbol: string = 'BTC/USDT'
): Promise<{
  weeklyHigh: number;
  weeklyLow: number;
  dailyHigh: number;
  dailyLow: number;
  currentPrice: number;
}> => {
  try {
    const currentPrice = 83300 + (Math.random() * 1000 - 500);
    
    return {
      weeklyHigh: currentPrice + 3000 + (Math.random() * 1000),
      weeklyLow: currentPrice - 3000 - (Math.random() * 1000),
      dailyHigh: currentPrice + 800 + (Math.random() * 400),
      dailyLow: currentPrice - 800 - (Math.random() * 400),
      currentPrice
    };
  } catch (error) {
    console.error('Error fetching high-low data:', error);
    
    const currentPrice = 83300;
    return {
      weeklyHigh: 87500,
      weeklyLow: 80100,
      dailyHigh: 84200,
      dailyLow: 82500,
      currentPrice
    };
  }
};

export interface TradeSuggestion {
  type: 'buy' | 'sell' | 'wait';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  confidence: number;
  reasoning: string;
  timeframe: string;
  tradingStyle: 'scalp' | 'day' | 'swing';
}

/**
 * Generates a mock trade suggestion based on current market conditions
 */
export const generateTradeSuggestion = async (
  symbol: string = 'BTC/USDT',
  tradingStyle: 'scalp' | 'day' | 'swing' = 'day'
): Promise<TradeSuggestion> => {
  try {
    const { price } = await fetchCurrentPrice(symbol);
    
    const randomValue = Math.random();
    const type = randomValue > 0.6 ? 'buy' : (randomValue > 0.2 ? 'sell' : 'wait');
    
    let stopPercentage = 0;
    let profitPercentage = 0;
    
    switch (tradingStyle) {
      case 'scalp':
        stopPercentage = 0.005; // 0.5%
        profitPercentage = 0.01; // 1% 
        break;
      case 'day': 
        stopPercentage = 0.01; // 1%
        profitPercentage = 0.03; // 3%
        break;
      case 'swing':
        stopPercentage = 0.03; // 3%
        profitPercentage = 0.09; // 9%
        break;
    }
    
    const entryPrice = price;
    const stopLoss = type === 'buy' 
      ? price * (1 - stopPercentage) 
      : price * (1 + stopPercentage);
    const takeProfit = type === 'buy' 
      ? price * (1 + profitPercentage) 
      : price * (1 - profitPercentage);
    
    const riskRewardRatio = profitPercentage / stopPercentage;
    const confidence = 50 + Math.floor(Math.random() * 40); // 50-90% confidence
    
    let reasoning = '';
    if (type === 'buy') {
      reasoning = `Price is showing strength with ${tradingStyle === 'scalp' ? 'short-term' : 'bullish'} momentum. Multiple indicators suggesting upward movement.`;
    } else if (type === 'sell') {
      reasoning = `Resistance zone reached with ${tradingStyle === 'scalp' ? 'short-term' : 'bearish'} divergence. Risk of rejection is high.`;
    } else {
      reasoning = 'Market conditions unclear. Better to wait for clearer signals before entering a position.';
    }
    
    let timeframe: string;
    switch (tradingStyle) {
      case 'scalp':
        timeframe = Math.random() > 0.5 ? '5m' : '15m';
        break;
      case 'day':
        timeframe = Math.random() > 0.5 ? '1h' : '4h';
        break;
      case 'swing':
        timeframe = Math.random() > 0.5 ? '4h' : '1d';
        break;
      default:
        timeframe = '1h';
    }
    
    return {
      type,
      entryPrice,
      stopLoss,
      takeProfit,
      riskRewardRatio,
      confidence,
      reasoning,
      timeframe,
      tradingStyle
    };
  } catch (error) {
    console.error('Error generating trade suggestion:', error);
    
    return {
      type: 'wait',
      entryPrice: 83300,
      stopLoss: 82500,
      takeProfit: 84500,
      riskRewardRatio: 1.5,
      confidence: 60,
      reasoning: 'Error generating analysis. Waiting is recommended.',
      timeframe: '1h',
      tradingStyle: 'day'
    };
  }
};
