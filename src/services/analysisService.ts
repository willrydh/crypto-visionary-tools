import { TechnicalIndicator, TradeSuggestion, MarketBias } from '@/contexts/TechnicalAnalysisContext';
import { TradingMode } from '@/contexts/TradingModeContext';
import { formatMockData } from '@/utils/mockDataUtils';

// Mock data for development purposes
// This would be replaced with actual API calls in production
export const fetchTechnicalIndicators = async (
  symbol: string,
  timeframes: string[], 
  indicatorTypes: string[]
): Promise<TechnicalIndicator[]> => {
  console.log(`Fetching indicators for ${symbol}, timeframes: ${timeframes}, indicators: ${indicatorTypes}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock indicators based on requested types and timeframes
  const mockIndicators: TechnicalIndicator[] = [];
  
  timeframes.forEach(timeframe => {
    indicatorTypes.forEach(indicator => {
      const mockValue = getMockIndicatorValue(indicator);
      mockIndicators.push({
        name: formatIndicatorName(indicator),
        value: mockValue.value,
        signal: mockValue.signal,
        timeframe: timeframe,
        description: getIndicatorDescription(indicator)
      });
    });
  });
  
  return mockIndicators;
};

export const generateTradeSuggestion = async (
  symbol: string,
  indicators: TechnicalIndicator[],
  bias: MarketBias,
  tradingMode: TradingMode
): Promise<TradeSuggestion> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Count signals by type
  let bullishCount = 0;
  let bearishCount = 0;
  let totalCount = indicators.length || 1; // Avoid divide by zero
  
  indicators.forEach(indicator => {
    if (indicator.signal === 'bullish') bullishCount++;
    if (indicator.signal === 'bearish') bearishCount++;
  });
  
  // Calculate confidence and probability
  const confidence = Math.round((Math.max(bullishCount, bearishCount) / totalCount) * 100);
  const probability = Math.min(95, confidence + Math.floor(Math.random() * 15));
  
  // Determine direction based on bias
  const direction = bias === 'bullish' ? 'long' : bias === 'bearish' ? 'short' : 'neutral';
  
  // Get mock price for calculations
  const currentPrice = 83300 + (Math.random() * 1000 - 500);
  
  // Calculate ATR-based stops and targets (mock values)
  const atr = currentPrice * 0.015; // 1.5% as mock ATR
  
  let entry = currentPrice;
  let stopLoss = direction === 'long' ? entry - (atr * 1.5) : entry + (atr * 1.5);
  let takeProfit = direction === 'long' ? entry + (atr * 2.5) : entry - (atr * 2.5);
  
  // If neutral, set values but note they're less relevant
  if (direction === 'neutral') {
    stopLoss = entry - (atr * 1.2);
    takeProfit = entry + (atr * 1.2);
  }
  
  // Generate a summary based on trading mode and bias
  const summary = generateTradeSummary(bias, confidence, tradingMode, indicators);
  
  return {
    direction,
    entry,
    stopLoss,
    takeProfit,
    probability,
    confidence,
    timeframe: getTimeframeForTradingMode(tradingMode),
    indicators,
    summary,
    createdAt: new Date()
  };
};

// Helper function to generate trade summary
const generateTradeSummary = (
  bias: MarketBias, 
  confidence: number,
  tradingMode: TradingMode,
  indicators: TechnicalIndicator[]
): string => {
  const timeframe = getTimeframeForTradingMode(tradingMode);
  const strength = confidence > 80 ? 'strong' : confidence > 60 ? 'moderate' : 'weak';
  
  if (bias === 'bullish') {
    return `Market shows ${strength} bullish structure on ${timeframe} timeframe. ${getRandomSummaryDetail(indicators, 'bullish')}`;
  } else if (bias === 'bearish') {
    return `Market shows ${strength} bearish structure on ${timeframe} timeframe. ${getRandomSummaryDetail(indicators, 'bearish')}`;
  } else {
    return `Market lacks clear direction on ${timeframe} timeframe. Choppy conditions may persist.`;
  }
};

// Helper function to get a random detail for the summary
const getRandomSummaryDetail = (
  indicators: TechnicalIndicator[],
  bias: 'bullish' | 'bearish'
): string => {
  const relevantIndicators = indicators.filter(ind => ind.signal === bias);
  
  if (relevantIndicators.length === 0) return '';
  
  const randomIndicator = relevantIndicators[Math.floor(Math.random() * relevantIndicators.length)];
  
  if (randomIndicator.name.includes('MA')) {
    return bias === 'bullish' 
      ? `Price is holding above ${randomIndicator.name} with momentum.` 
      : `Price broke below ${randomIndicator.name}, showing weakness.`;
  } else if (randomIndicator.name.includes('RSI')) {
    return bias === 'bullish'
      ? `${randomIndicator.name} showing upward momentum.`
      : `${randomIndicator.name} indicating downward pressure.`;
  } else if (randomIndicator.name.includes('MACD')) {
    return bias === 'bullish'
      ? `${randomIndicator.name} shows bullish crossover.`
      : `${randomIndicator.name} shows bearish crossover.`;
  }
  
  return `${randomIndicator.name} confirms the ${bias} bias.`;
};

// Helper function to get appropriate timeframe based on trading mode
const getTimeframeForTradingMode = (tradingMode: TradingMode): string => {
  switch (tradingMode) {
    case 'scalp':
      return '15m';
    case 'day':
      return '1h';
    case 'night':
      return '4h';
    default:
      return '1h';
  }
};

// Helper functions for mock data generation
const getMockIndicatorValue = (indicator: string): { value: number | string; signal: 'bullish' | 'bearish' | 'neutral' } => {
  // Generate random values based on indicator type
  if (indicator.includes('ma')) {
    const basePrice = 83300 + (Math.random() * 1000 - 500);
    const currentPrice = 83300 + (Math.random() * 1000 - 500);
    const isBullish = Math.random() > 0.4; // Slightly biased to bullish for demo
    
    return {
      value: Math.round(basePrice),
      signal: currentPrice > basePrice ? 'bullish' : currentPrice < basePrice ? 'bearish' : 'neutral'
    };
  } else if (indicator.includes('rsi')) {
    const value = Math.floor(Math.random() * 100);
    return {
      value,
      signal: value < 30 ? 'bullish' : value > 70 ? 'bearish' : 'neutral'
    };
  } else if (indicator.includes('macd')) {
    // MACD Line value
    const value = (Math.random() * 200 - 100).toFixed(2);
    const signal = Math.random() > 0.5 ? 'bullish' : 'bearish';
    return { value, signal };
  } else if (indicator.includes('stoch')) {
    const value = Math.floor(Math.random() * 100);
    return {
      value,
      signal: value < 20 ? 'bullish' : value > 80 ? 'bearish' : 'neutral'
    };
  } else if (indicator.includes('volume')) {
    const value = `${(Math.random() * 10000).toFixed(0)}K`;
    return {
      value,
      signal: Math.random() > 0.5 ? 'bullish' : 'bearish'
    };
  } else if (indicator.includes('bbands')) {
    const width = (Math.random() * 5).toFixed(2);
    return {
      value: width,
      signal: parseFloat(width) > 2.5 ? 'bullish' : 'neutral'
    };
  } else if (indicator.includes('vwap')) {
    const basePrice = 83300;
    const deviation = (Math.random() * 200 - 100).toFixed(2);
    return {
      value: deviation,
      signal: parseFloat(deviation) > 0 ? 'bullish' : 'bearish'
    };
  }
  
  // Default case
  return {
    value: Math.random() > 0.5 ? 1 : 0,
    signal: Math.random() > 0.5 ? 'bullish' : 'bearish'
  };
};

const formatIndicatorName = (indicator: string): string => {
  switch (indicator) {
    case 'ma21':
      return 'MA21';
    case 'ma50':
      return 'MA50';
    case 'ma100':
      return 'MA100';
    case 'ma200':
      return 'MA200';
    case 'macd':
      return 'MACD';
    case 'rsi':
      return 'RSI';
    case 'stochrsi':
      return 'Stoch RSI';
    case 'volume':
      return 'Volume';
    case 'bbands':
      return 'BB Width';
    case 'vwap':
      return 'VWAP';
    default:
      return indicator.toUpperCase();
  }
};

const getIndicatorDescription = (indicator: string): string => {
  switch (indicator) {
    case 'ma21':
      return '21-period Moving Average';
    case 'ma50':
      return '50-period Moving Average';
    case 'ma100':
      return '100-period Moving Average';
    case 'ma200':
      return '200-period Moving Average';
    case 'macd':
      return 'Moving Average Convergence Divergence';
    case 'rsi':
      return 'Relative Strength Index';
    case 'stochrsi':
      return 'Stochastic RSI';
    case 'volume':
      return 'Trading Volume';
    case 'bbands':
      return 'Bollinger Bands Width';
    case 'vwap':
      return 'Volume Weighted Average Price';
    default:
      return 'Technical Indicator';
  }
};
