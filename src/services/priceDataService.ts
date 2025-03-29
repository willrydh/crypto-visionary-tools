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
    
    return getMockCurrentPrice();
  }
};

const getMockCurrentPrice = () => {
  const basePrice = 83300;
  const variation = (Math.random() * 400) - 200;
  
  return {
    price: basePrice + variation,
    change24h: (Math.random() * 6) - 3,
    volume24h: 24500000000 + (Math.random() * 5000000000),
    timestamp: Date.now()
  };
};

let lastGeneratedCandles: { [key: string]: PriceCandle[] } = {};

export const fetchHistoricalPrices = async (
  symbol: string = 'BTC/USDT',
  timeframe: Timeframe = '1h',
  limit: number = 100
): Promise<PriceCandle[]> => {
  try {
    const cacheKey = `${symbol}_${timeframe}_${limit}`;
    
    if (lastGeneratedCandles[cacheKey]) {
      const existingCandles = lastGeneratedCandles[cacheKey];
      const lastCandle = existingCandles[existingCandles.length - 1];
      const now = Date.now();
      const millisecondsPerInterval = getMillisecondsForTimeframe(timeframe);
      
      if (now - lastCandle.timestamp > millisecondsPerInterval) {
        const newCandles = generateConsistentCandles(
          lastCandle,
          timeframe,
          Math.min(5, Math.floor((now - lastCandle.timestamp) / millisecondsPerInterval))
        );
        
        lastGeneratedCandles[cacheKey] = [
          ...existingCandles.slice(newCandles.length * -1),
          ...newCandles
        ];
        
        return lastGeneratedCandles[cacheKey];
      }
      
      return existingCandles;
    }
    
    lastGeneratedCandles[cacheKey] = generateSmoothCandles(timeframe, limit);
    return lastGeneratedCandles[cacheKey];
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    
    const cacheKey = `${symbol}_${timeframe}_${limit}`;
    if (!lastGeneratedCandles[cacheKey]) {
      lastGeneratedCandles[cacheKey] = generateSmoothCandles(timeframe, limit);
    }
    return lastGeneratedCandles[cacheKey];
  }
};

const generateSmoothCandles = (timeframe: Timeframe, limit: number): PriceCandle[] => {
  const candles: PriceCandle[] = [];
  const basePrice = 83300;
  const now = Date.now();
  const millisecondsPerInterval = getMillisecondsForTimeframe(timeframe);
  
  let currentPrice = basePrice;
  let lastClose = currentPrice;
  
  for (let i = 0; i < limit; i++) {
    const volatilityFactor = getVolatilityForTimeframe(timeframe);
    const movement = (Math.random() * 2 - 1) * basePrice * volatilityFactor;
    
    currentPrice = lastClose + movement;
    
    currentPrice = Math.max(currentPrice, basePrice * 0.9);
    currentPrice = Math.min(currentPrice, basePrice * 1.1);
    
    const open = lastClose;
    const close = currentPrice;
    
    const candleRange = Math.abs(close - open) * (1 + Math.random());
    const high = Math.max(open, close) + (Math.random() * candleRange * 0.5);
    const low = Math.min(open, close) - (Math.random() * candleRange * 0.5);
    
    const volumeBase = 100000000 + Math.random() * 50000000;
    const volumeMultiplier = 1 + (Math.abs(close - open) / open);
    const volume = volumeBase * volumeMultiplier;
    
    const timestamp = now - (millisecondsPerInterval * (limit - i - 1));
    
    candles.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume
    });
    
    lastClose = close;
  }
  
  return candles;
};

const generateConsistentCandles = (
  lastCandle: PriceCandle,
  timeframe: Timeframe,
  count: number
): PriceCandle[] => {
  const candles: PriceCandle[] = [];
  const millisecondsPerInterval = getMillisecondsForTimeframe(timeframe);
  let lastClose = lastCandle.close;
  
  for (let i = 0; i < count; i++) {
    const volatilityFactor = getVolatilityForTimeframe(timeframe);
    const movement = (Math.random() * 2 - 1) * lastClose * volatilityFactor;
    
    const open = lastClose;
    const close = lastClose + movement;
    
    const candleRange = Math.abs(close - open) * (1 + Math.random());
    const high = Math.max(open, close) + (Math.random() * candleRange * 0.5);
    const low = Math.min(open, close) - (Math.random() * candleRange * 0.5);
    
    const volumeBase = 100000000 + Math.random() * 50000000;
    const volumeMultiplier = 1 + (Math.abs(close - open) / open);
    const volume = volumeBase * volumeMultiplier;
    
    const timestamp = lastCandle.timestamp + (millisecondsPerInterval * (i + 1));
    
    candles.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume
    });
    
    lastClose = close;
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

const getVolatilityForTimeframe = (timeframe: Timeframe): number => {
  switch (timeframe) {
    case '1m':
      return 0.0005;
    case '5m':
      return 0.001;
    case '15m':
      return 0.0015;
    case '30m':
      return 0.002;
    case '1h':
      return 0.003;
    case '4h':
      return 0.005;
    case '1d':
      return 0.01;
    case '1w':
      return 0.02;
    default:
      return 0.003;
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
  
  const { price } = await fetchCurrentPrice(symbol);
  const basePrice = price;
  const levels: PriceLevel[] = [];
  
  levels.push({
    price: basePrice - (basePrice * 0.015),
    type: 'support',
    strength: 'strong',
    timeframe: timeframe,
    source: 'pivot',
    description: 'Daily pivot support'
  });
  
  levels.push({
    price: basePrice - (basePrice * 0.01),
    type: 'support',
    strength: 'medium',
    timeframe: timeframe,
    source: 'swing',
    description: 'Previous swing low'
  });
  
  levels.push({
    price: basePrice - (basePrice * 0.005),
    type: 'support',
    strength: 'weak',
    timeframe: timeframe,
    source: 'volume',
    description: 'Volume cluster'
  });
  
  levels.push({
    price: basePrice + (basePrice * 0.006),
    type: 'resistance',
    strength: 'weak',
    timeframe: timeframe,
    source: 'swing',
    description: 'Previous swing high'
  });
  
  levels.push({
    price: basePrice + (basePrice * 0.012),
    type: 'resistance',
    strength: 'medium',
    timeframe: timeframe,
    source: 'historical',
    description: 'Historical resistance'
  });
  
  levels.push({
    price: basePrice + (basePrice * 0.022),
    type: 'resistance',
    strength: 'strong',
    timeframe: timeframe,
    source: 'pivot',
    description: 'Monthly resistance'
  });
  
  const structure: MarketStructure = {
    trend: Math.random() > 0.5 ? 'uptrend' : 'downtrend',
    description: 'Market structure based on recent price action',
    hh: basePrice + (basePrice * 0.018),
    lh: basePrice + (basePrice * 0.008),
    hl: basePrice - (basePrice * 0.007),
    ll: basePrice - (basePrice * 0.018),
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
    const { price } = await fetchCurrentPrice(symbol);
    const currentPrice = price;
    
    return {
      weeklyHigh: currentPrice * 1.036,
      weeklyLow: currentPrice * 0.964,
      dailyHigh: currentPrice * 1.01,
      dailyLow: currentPrice * 0.99,
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
  direction?: string;
  entry?: number;
  probability?: number;
  leverage?: number;
  summary?: string;
}

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
        stopPercentage = 0.005;
        profitPercentage = 0.01;
        break;
      case 'day': 
        stopPercentage = 0.01;
        profitPercentage = 0.03;
        break;
      case 'swing':
        stopPercentage = 0.03;
        profitPercentage = 0.09;
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
    const confidence = 50 + Math.floor(Math.random() * 40);
    
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
      tradingStyle,
      direction: type === 'buy' ? 'long' : (type === 'sell' ? 'short' : 'neutral'),
      entry: entryPrice,
      probability: confidence,
      leverage: tradingStyle === 'scalp' ? 10 : (tradingStyle === 'day' ? 5 : 3),
      summary: reasoning
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
      tradingStyle: 'day',
      direction: 'neutral',
      entry: 83300,
      probability: 60,
      leverage: 5,
      summary: 'Error generating analysis. Waiting is recommended.'
    };
  }
};
