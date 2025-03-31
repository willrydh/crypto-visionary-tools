
import { MarketBias, TechnicalIndicator, TradeSuggestion } from '@/contexts/TechnicalAnalysisContext';
import { calculateProbability } from '@/utils/mockDataUtils';

// This is a mock service for the technical analysis
// In a real application, this would call an API 
export const fetchTechnicalIndicators = async (
  symbol: string, 
  timeframes: string[],
  indicatorTypes: string[]
): Promise<TechnicalIndicator[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, we would make API calls here
  // For this demo, we'll just return some mock data
  const indicators: TechnicalIndicator[] = [
    {
      name: 'Moving Average (50)',
      value: 'Uptrend',
      signal: 'bullish',
      timeframe: timeframes[0] || '1h',
      category: 'trend',
      description: 'Price above MA shows bullish momentum'
    },
    {
      name: 'MACD',
      value: 'Converging',
      signal: 'neutral',
      timeframe: timeframes[0] || '1h',
      category: 'momentum',
      description: 'MACD lines are converging, showing decreasing momentum'
    },
    {
      name: 'RSI',
      value: 62,
      signal: 'bullish',
      timeframe: timeframes[0] || '1h',
      category: 'momentum',
      description: 'RSI above 50 shows bullish momentum'
    },
    {
      name: 'Bollinger Bands',
      value: 'Expanding',
      signal: 'neutral',
      timeframe: timeframes[1] || '4h',
      category: 'volatility',
      description: 'Expanding bands indicate increased volatility'
    },
    {
      name: 'Volume',
      value: 'Increasing',
      signal: 'bullish',
      timeframe: timeframes[0] || '1h',
      category: 'volume',
      description: 'Increasing volume on up moves confirms bullish trend'
    },
    {
      name: 'Support/Resistance',
      value: 'Near Support',
      signal: 'bullish',
      timeframe: timeframes[1] || '4h',
      category: 'trend',
      description: 'Price near support level, potential bounce'
    },
    {
      name: 'Stochastic',
      value: 75,
      signal: 'bullish',
      timeframe: timeframes[0] || '1h',
      category: 'momentum',
      description: 'Stochastic above 50 shows bullish momentum'
    },
    {
      name: 'Average Directional Index (ADX)',
      value: 28,
      signal: 'bullish',
      timeframe: timeframes[1] || '4h',
      category: 'trend',
      description: 'ADX above 25 indicates a strong trend'
    },
    {
      name: 'On-Balance Volume',
      value: 'Rising',
      signal: 'bullish',
      timeframe: timeframes[2] || '1d',
      category: 'volume',
      description: 'Rising OBV indicates accumulation'
    },
    {
      name: 'Ichimoku Cloud',
      value: 'Above Cloud',
      signal: 'bullish',
      timeframe: timeframes[1] || '4h',
      category: 'trend',
      description: 'Price above cloud indicates bullish trend'
    },
    {
      name: 'Moving Average (200)',
      value: 'Uptrend',
      signal: 'bullish',
      timeframe: timeframes[2] || '1d',
      category: 'trend',
      description: 'Price above 200 MA shows long-term bullish momentum'
    },
    {
      name: 'Chaikin Money Flow',
      value: 0.15,
      signal: 'bullish',
      timeframe: timeframes[0] || '1h',
      category: 'volume',
      description: 'Positive CMF indicates buying pressure'
    }
  ];
  
  // Filter by requested timeframes and indicator types
  return indicators.filter(i => 
    timeframes.includes(i.timeframe) || 
    indicatorTypes.includes(i.name.toLowerCase())
  );
};

export const generateTradeSuggestion = async (
  symbol: string,
  indicators: TechnicalIndicator[],
  bias: MarketBias,
  tradingMode: string
): Promise<TradeSuggestion> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Calculate the percentage of bullish indicators
  const bullishCount = indicators.filter(i => i.signal === 'bullish').length;
  const bearishCount = indicators.filter(i => i.signal === 'bearish').length;
  const bullishPercentage = (bullishCount / indicators.length) * 100;
  const bearishPercentage = (bearishCount / indicators.length) * 100;
  
  // Determine direction based on bias and percentages
  let direction: 'long' | 'short' | 'neutral' = 'neutral';
  if (bias === 'bullish' && bullishPercentage >= 50) {
    direction = 'long';
  } else if (bias === 'bearish' && bearishPercentage >= 50) {
    direction = 'short';
  }
  
  // Define timeframe based on trading mode
  let timeframe = tradingMode === 'scalp' ? '15m' : 
                  tradingMode === 'day' ? '1h' : '4h';
  
  // Calculate mock entry, stop loss, and take profit
  const basePrice = 83500; // Mock BTC price
  
  // Adjust volatility based on trading mode - shorter timeframes have less volatility in absolute terms
  let volatility = 1000; // Default
  
  switch(tradingMode) {
    case 'scalp':
      volatility = 300; // Lower volatility for quick trades
      break;
    case 'day':  
      volatility = 600; // Medium volatility for day trades
      break;
    case 'night':
      volatility = 1200; // Higher volatility for overnight positions
      break;
  }
  
  const entry = direction === 'long' ? 
    basePrice + (Math.random() * 200 - 100) : 
    basePrice + (Math.random() * 200 - 100);
  
  const stopLoss = direction === 'long' ? 
    entry - (volatility * 0.5 * (1 + Math.random() * 0.5)) : 
    entry + (volatility * 0.5 * (1 + Math.random() * 0.5));
  
  const takeProfit = direction === 'long' ? 
    entry + (volatility * (1 + Math.random())) : 
    entry - (volatility * (1 + Math.random()));
  
  // Calculate risk-reward ratio and probability
  const reward = direction === 'long' ? 
    takeProfit - entry : 
    entry - takeProfit;
  
  const risk = direction === 'long' ? 
    entry - stopLoss : 
    stopLoss - entry;
  
  const riskRewardRatio = reward / risk;
  
  // Calculate confidence based on indicators and risk-reward
  const confidence = Math.min(
    Math.round(
      (direction === 'long' ? bullishPercentage : 
       direction === 'short' ? bearishPercentage : 50) * 
      (riskRewardRatio / 3) * 
      (Math.random() * 0.3 + 0.7)
    ),
    95
  );
  
  // Calculate probability of success
  const probability = calculateProbability(
    indicators, 
    direction,
    confidence
  );
  
  // Generate summary based on trading mode
  let tradeModeDescription = '';
  let timeDescription = '';
  
  switch(tradingMode) {
    case 'scalp':
      tradeModeDescription = 'scalp';
      timeDescription = 'few minutes';
      break;
    case 'day':
      tradeModeDescription = 'day';
      timeDescription = '1-2 hours';
      break;
    case 'night':
      tradeModeDescription = 'night';
      timeDescription = 'up to 12 hours';
      break;
    default:
      tradeModeDescription = 'standard';
      timeDescription = 'variable time';
  }
  
  // Generate summary
  let summary = '';
  if (direction === 'long') {
    summary = `Strong ${tradeModeDescription} long opportunity with ${confidence}% confidence for a ${timeDescription} position. Entry near ${entry.toFixed(0)} with defined stop loss and take profit levels. Risk-reward ratio of ${riskRewardRatio.toFixed(1)}:1 and ${probability}% probability of success based on technical analysis.`;
  } else if (direction === 'short') {
    summary = `Potential ${tradeModeDescription} short opportunity with ${confidence}% confidence for a ${timeDescription} position. Entry near ${entry.toFixed(0)} with defined stop loss and take profit levels. Risk-reward ratio of ${riskRewardRatio.toFixed(1)}:1 and ${probability}% probability of success based on technical analysis.`;
  } else {
    summary = `Market conditions unclear for ${tradeModeDescription} trades (${timeDescription}). Consider waiting for better setups or reducing position size. Current analysis shows mixed signals.`;
  }
  
  // Generate trade suggestion
  return {
    direction,
    entry,
    stopLoss,
    takeProfit,
    probability,
    confidence,
    timeframe,
    indicators: indicators.slice(0, 5), // Include top 5 most relevant indicators
    summary,
    createdAt: new Date()
  };
};
