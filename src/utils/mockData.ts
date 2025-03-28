
import { formatDistanceToNow } from 'date-fns';

// Mock crypto data
export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: Date;
}

export interface TechnicalIndicator {
  name: string;
  value: number | string;
  signal: 'bullish' | 'bearish' | 'neutral';
  description?: string;
}

export interface TradeSuggestion {
  direction: 'long' | 'short';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  probability: number;
  leverage: number;
  timeframe: 'scalp' | 'day' | 'swing';
  createdAt: Date;
  indicators: TechnicalIndicator[];
  confidence: number;
}

export interface MarketSession {
  name: string;
  status: 'open' | 'closed';
  hours: string;
  nextEvent: {
    type: 'open' | 'close';
    time: Date;
  };
}

// Generate mock BTC price
export const getMockBtcPrice = (): CryptoPrice => {
  const basePrice = 37500;
  const variation = Math.random() * 1000 - 500; // -500 to +500
  const now = new Date();
  
  return {
    symbol: 'BTC/USDT',
    price: basePrice + variation,
    change24h: (Math.random() * 6) - 3, // -3% to +3%
    volume24h: 24500000000 + (Math.random() * 5000000000),
    marketCap: 775000000000 + (Math.random() * 10000000000),
    lastUpdated: now
  };
};

// Generate mock technical indicators
export const getMockTechnicalIndicators = (): TechnicalIndicator[] => {
  return [
    {
      name: 'MA20',
      value: 36750 + (Math.random() * 2000 - 1000),
      signal: Math.random() > 0.5 ? 'bullish' : 'bearish',
      description: '20-period Moving Average'
    },
    {
      name: 'MACD',
      value: (Math.random() * 200 - 100).toFixed(2),
      signal: Math.random() > 0.5 ? 'bullish' : 'bearish',
      description: 'Moving Average Convergence Divergence'
    },
    {
      name: 'RSI',
      value: Math.floor(30 + Math.random() * 40),
      signal: Math.random() > 0.6 ? 'neutral' : Math.random() > 0.5 ? 'bullish' : 'bearish',
      description: 'Relative Strength Index'
    },
    {
      name: 'Stoch RSI',
      value: Math.floor(Math.random() * 100),
      signal: Math.random() > 0.5 ? 'bullish' : 'bearish',
      description: 'Stochastic Relative Strength Index'
    },
    {
      name: 'ADX',
      value: Math.floor(10 + Math.random() * 40),
      signal: Math.random() > 0.6 ? 'neutral' : Math.random() > 0.5 ? 'bullish' : 'bearish',
      description: 'Average Directional Index'
    }
  ];
};

// Generate mock trade suggestion
export const getMockTradeSuggestion = (btcPrice: number): TradeSuggestion => {
  const direction = Math.random() > 0.5 ? 'long' : 'short';
  const leverage = Math.floor(Math.random() * 5) + 1;
  const timeframes = ['scalp', 'day', 'swing'] as const;
  const timeframe = timeframes[Math.floor(Math.random() * timeframes.length)];
  
  // Calculate entry, stop loss and take profit based on direction
  let entry = btcPrice;
  let stopLoss = 0;
  let takeProfit = 0;
  
  const atr = btcPrice * 0.015; // Mock ATR (Average True Range) at 1.5%
  
  if (direction === 'long') {
    entry = btcPrice;
    stopLoss = entry - (atr * 1.5);
    takeProfit = entry + (atr * 3);
  } else {
    entry = btcPrice;
    stopLoss = entry + (atr * 1.5);
    takeProfit = entry - (atr * 3);
  }
  
  return {
    direction,
    entry,
    stopLoss,
    takeProfit,
    probability: Math.floor(50 + Math.random() * 40),
    leverage,
    timeframe,
    createdAt: new Date(),
    indicators: getMockTechnicalIndicators(),
    confidence: Math.floor(50 + Math.random() * 40)
  };
};

// Generate mock market sessions
export const getMockMarketSessions = (): MarketSession[] => {
  const now = new Date();
  const hour = now.getUTCHours();
  
  // Tokyo: UTC 0:00-9:00
  // London: UTC 8:00-16:00
  // New York: UTC 13:00-20:00
  
  return [
    {
      name: 'Tokyo',
      status: (hour >= 0 && hour < 9) ? 'open' : 'closed',
      hours: '00:00-09:00 UTC',
      nextEvent: {
        type: (hour >= 0 && hour < 9) ? 'close' : 'open',
        time: new Date(
          now.getFullYear(), 
          now.getMonth(), 
          now.getDate() + ((hour >= 9) ? 1 : 0), 
          (hour >= 0 && hour < 9) ? 9 : 0,
          0
        )
      }
    },
    {
      name: 'London',
      status: (hour >= 8 && hour < 16) ? 'open' : 'closed',
      hours: '08:00-16:00 UTC',
      nextEvent: {
        type: (hour >= 8 && hour < 16) ? 'close' : 'open',
        time: new Date(
          now.getFullYear(), 
          now.getMonth(), 
          now.getDate() + ((hour >= 16) ? 1 : 0), 
          (hour >= 8 && hour < 16) ? 16 : 8,
          0
        )
      }
    },
    {
      name: 'New York',
      status: (hour >= 13 && hour < 20) ? 'open' : 'closed',
      hours: '13:00-20:00 UTC',
      nextEvent: {
        type: (hour >= 13 && hour < 20) ? 'close' : 'open',
        time: new Date(
          now.getFullYear(), 
          now.getMonth(), 
          now.getDate() + ((hour >= 20) ? 1 : 0), 
          (hour >= 13 && hour < 20) ? 20 : 13,
          0
        )
      }
    }
  ];
};

// Generate mock notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'alert' | 'success' | 'warning';
}

export const getMockNotifications = (): Notification[] => {
  const now = new Date();
  
  return [
    {
      id: '1',
      title: 'New Trade Opportunity',
      message: 'BTC/USDT showing bullish divergence on 4h timeframe',
      timestamp: new Date(now.getTime() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      type: 'alert'
    },
    {
      id: '2',
      title: 'London Session Opening',
      message: 'London market session will open in 15 minutes',
      timestamp: new Date(now.getTime() - 1000 * 60 * 120), // 2 hours ago
      read: true,
      type: 'info'
    },
    {
      id: '3',
      title: 'Take Profit Hit',
      message: 'Your BTC/USDT long position hit take profit target',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5), // 5 hours ago
      read: true,
      type: 'success'
    },
    {
      id: '4',
      title: 'Market Volatility Warning',
      message: 'Unusual volume detected, consider reducing position sizes',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      type: 'warning'
    }
  ];
};

// Format time until next event
export const formatTimeUntil = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};
