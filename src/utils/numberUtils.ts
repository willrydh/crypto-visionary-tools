
// Format a number to a fixed number of decimals
export const formatDecimals = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

// Format a number as currency
export const formatCurrency = (value: number, currency: string = 'USD', options?: Intl.NumberFormatOptions): string => {
  // Handle possible NaN or invalid values
  if (isNaN(value) || value === null || value === undefined) {
    return '$0.00';
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    // Use appropriate decimal places based on value magnitude
    minimumFractionDigits: value < 1 ? 4 : value < 10 ? 2 : 0,
    maximumFractionDigits: value < 1 ? 6 : value < 10 ? 2 : 2,
    ...options
  });
  
  return formatter.format(value);
};

// Format a number to K, M, B
export const formatCompact = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  } else {
    return value.toString();
  }
};

// Calculate percentage change
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Format a percentage
export const formatPercentage = (value: number, includeSign: boolean = true): string => {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

// Calculate the Average True Range (ATR)
export const calculateATR = (candles: { high: number; low: number; close: number }[], period: number = 14): number => {
  if (candles.length < period + 1) {
    return 0;
  }
  
  // Calculate True Range for each candle
  const trueRanges: number[] = [];
  
  for (let i = 1; i < candles.length; i++) {
    const current = candles[i];
    const previous = candles[i - 1];
    
    // True Range is the maximum of these three values
    const tr1 = current.high - current.low; // Current High - Current Low
    const tr2 = Math.abs(current.high - previous.close); // Current High - Previous Close
    const tr3 = Math.abs(current.low - previous.close); // Current Low - Previous Close
    
    const tr = Math.max(tr1, tr2, tr3);
    trueRanges.push(tr);
  }
  
  // Get the last 'period' true ranges
  const lastTrueRanges = trueRanges.slice(-period);
  
  // Calculate average
  const atr = lastTrueRanges.reduce((sum, value) => sum + value, 0) / period;
  
  return atr;
};
