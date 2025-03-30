
// Chart utilities for common calculations and helpers

// Calculate Simple Moving Average (SMA)
export const calculateSMA = (data: number[], period: number): number[] => {
  const result: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN); // Not enough data yet
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
      result.push(sum / period);
    }
  }
  
  return result;
};

// Apply SMA to price data with timestamps
export const applySMA = (priceData: { timestamp: number, price: number }[], period: number): { 
  timestamp: number, 
  price: number, 
  sma: number 
}[] => {
  // Extract just the prices for SMA calculation
  const prices = priceData.map(item => item.price);
  
  // Calculate SMA
  const smaValues = calculateSMA(prices, period);
  
  // Merge SMA values back with original data
  return priceData.map((item, index) => ({
    ...item,
    sma: smaValues[index]
  }));
};

// Calculate Relative Strength Index (RSI)
export const calculateRSI = (data: number[], period: number = 14): number[] => {
  const result: number[] = [];
  const changes: number[] = [];
  
  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i] - data[i - 1]);
  }
  
  // Calculate RSI
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      result.push(NaN); // Not enough data yet
    } else {
      const gains = changes.slice(i - period, i).filter(change => change > 0);
      const losses = changes.slice(i - period, i).filter(change => change < 0).map(Math.abs);
      
      const avgGain = gains.reduce((acc, val) => acc + val, 0) / period;
      const avgLoss = losses.reduce((acc, val) => acc + val, 0) / period;
      
      if (avgLoss === 0) {
        result.push(100); // No losses, RSI is 100
      } else {
        const rs = avgGain / avgLoss;
        result.push(100 - (100 / (1 + rs)));
      }
    }
  }
  
  return result;
};

// Calculate Bollinger Bands
export const calculateBollingerBands = (
  data: number[], 
  period: number = 20, 
  stdDev: number = 2
): { upper: number[]; middle: number[]; lower: number[] } => {
  const middle = calculateSMA(data, period);
  const upper: number[] = [];
  const lower: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const sum = slice.reduce((acc, val) => acc + val, 0);
      const mean = sum / period;
      const squareDiffs = slice.map(val => Math.pow(val - mean, 2));
      const variance = squareDiffs.reduce((acc, val) => acc + val, 0) / period;
      const std = Math.sqrt(variance);
      
      upper.push(middle[i] + (stdDev * std));
      lower.push(middle[i] - (stdDev * std));
    }
  }
  
  return { upper, middle, lower };
};

// Calculate Moving Average Convergence Divergence (MACD)
export const calculateMACD = (
  data: number[], 
  fastPeriod: number = 12, 
  slowPeriod: number = 26, 
  signalPeriod: number = 9
): { macd: number[]; signal: number[]; histogram: number[] } => {
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);
  
  const macd: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < slowPeriod - 1) {
      macd.push(NaN);
    } else {
      macd.push(fastEMA[i] - slowEMA[i]);
    }
  }
  
  const signal = calculateEMA(macd.filter(val => !isNaN(val)), signalPeriod);
  const paddedSignal = Array(data.length - signal.length).fill(NaN).concat(signal);
  
  const histogram: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (isNaN(macd[i]) || isNaN(paddedSignal[i])) {
      histogram.push(NaN);
    } else {
      histogram.push(macd[i] - paddedSignal[i]);
    }
  }
  
  return { macd, signal: paddedSignal, histogram };
};

// Calculate Exponential Moving Average (EMA)
export const calculateEMA = (data: number[], period: number): number[] => {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // Initialize with SMA for the first value
  const sma = data.slice(0, period).reduce((acc, val) => acc + val, 0) / period;
  result.push(sma);
  
  // Calculate EMA
  for (let i = period; i < data.length; i++) {
    const ema = (data[i] - result[result.length - 1]) * multiplier + result[result.length - 1];
    result.push(ema);
  }
  
  return Array(data.length - result.length).fill(NaN).concat(result);
};

// Find pivot points
export const calculatePivotPoints = (
  high: number, 
  low: number, 
  close: number
): {
  pivotPoint: number;
  r1: number;
  r2: number;
  r3: number;
  s1: number;
  s2: number;
  s3: number;
} => {
  const pivotPoint = (high + low + close) / 3;
  const r1 = (2 * pivotPoint) - low;
  const r2 = pivotPoint + (high - low);
  const r3 = high + 2 * (pivotPoint - low);
  const s1 = (2 * pivotPoint) - high;
  const s2 = pivotPoint - (high - low);
  const s3 = low - 2 * (high - pivotPoint);
  
  return { pivotPoint, r1, r2, r3, s1, s2, s3 };
};
