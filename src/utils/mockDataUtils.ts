
import { TechnicalIndicator } from '@/contexts/TechnicalAnalysisContext';

// Helper function for generating mock data
export const formatMockData = (data: any): any => {
  // This is a placeholder function to make it clear when we're using mock data
  return data;
};

// Generate mock technical indicators
export const generateMockIndicators = (count: number = 5): TechnicalIndicator[] => {
  const indicators: TechnicalIndicator[] = [];
  const names = ['MA20', 'RSI', 'MACD', 'Stoch RSI', 'BB Width'];
  const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h'];
  const signals: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];
  
  for (let i = 0; i < count; i++) {
    const randomNameIndex = Math.floor(Math.random() * names.length);
    const randomTimeframeIndex = Math.floor(Math.random() * timeframes.length);
    const randomSignalIndex = Math.floor(Math.random() * signals.length);
    
    indicators.push({
      name: names[randomNameIndex],
      value: Math.floor(Math.random() * 100),
      signal: signals[randomSignalIndex],
      timeframe: timeframes[randomTimeframeIndex],
      description: `Mock ${names[randomNameIndex]} indicator`
    });
  }
  
  return indicators;
};

// Generate mock price data
export const generateMockPriceData = (count: number = 100, startPrice: number = 83000): {
  timestamps: number[];
  prices: number[];
} => {
  const timestamps: number[] = [];
  const prices: number[] = [];
  
  let currentPrice = startPrice;
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    // Add a timestamp (going back in time)
    timestamps.unshift(now - (i * 3600000)); // 1 hour intervals
    
    // Random price movement
    const movement = (Math.random() - 0.48) * 500; // Slight upward bias
    currentPrice += movement;
    
    // Ensure price doesn't go negative
    currentPrice = Math.max(currentPrice, startPrice * 0.7);
    currentPrice = Math.min(currentPrice, startPrice * 1.3);
    
    prices.unshift(currentPrice);
  }
  
  return { timestamps, prices };
};
