
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
  
  // Determine direction based on bias, trading mode, and percentages
  let direction: 'long' | 'short' | 'neutral';
  
  // Make direction more decisive based on trading mode
  switch(tradingMode) {
    case 'scalp':
      // Scalp mode is more aggressive with signals - rarely neutral
      direction = bullishPercentage >= 45 ? 'long' : 
                 bearishPercentage >= 45 ? 'short' : 'neutral';
      break;
    case 'day':
      // Day trading is moderately decisive
      direction = bullishPercentage >= 55 ? 'long' : 
                 bearishPercentage >= 55 ? 'short' : 'neutral';
      break;
    case 'night':
      // Night mode is more conservative - needs stronger signals
      direction = bullishPercentage >= 65 ? 'long' : 
                 bearishPercentage >= 65 ? 'short' : 'neutral';
      break;
    default:
      // Default fallback using bias
      direction = bias === 'bullish' ? 'long' :
                  bias === 'bearish' ? 'short' : 'neutral';
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
  
  // Calculate confidence based on indicators, risk-reward, and trading mode
  // Different trading modes have different confidence thresholds
  let confidenceMultiplier;
  switch(tradingMode) {
    case 'scalp':
      // Scalp mode is generally more confident with quick decisions
      confidenceMultiplier = 1.2;
      break;
    case 'day':
      // Day trading has medium confidence
      confidenceMultiplier = 1.0;
      break;
    case 'night':
      // Night mode is more cautious
      confidenceMultiplier = 0.85;
      break;
    default:
      confidenceMultiplier = 1.0;
  }
  
  const confidence = Math.min(
    Math.round(
      (direction === 'long' ? bullishPercentage : 
       direction === 'short' ? bearishPercentage : 50) * 
      (riskRewardRatio / 3) * 
      (Math.random() * 0.3 + 0.7) *
      confidenceMultiplier
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
  let tradingStyle = '';
  
  switch(tradingMode) {
    case 'scalp':
      tradeModeDescription = 'scalp';
      timeDescription = 'few minutes to an hour';
      tradingStyle = 'Fast entry and exit at key levels';
      break;
    case 'day':
      tradeModeDescription = 'day';
      timeDescription = '1-4 hours';
      tradingStyle = 'Capitalize on intraday momentum';
      break;
    case 'night':
      tradeModeDescription = 'overnight';
      timeDescription = '8-24 hours';
      tradingStyle = 'Position for larger market moves';
      break;
    default:
      tradeModeDescription = 'standard';
      timeDescription = 'variable time';
      tradingStyle = 'Flexible approach';
  }
  
  // Generate more specific summaries based on trading mode
  let summary = '';
  if (direction === 'long') {
    switch(tradingMode) {
      case 'scalp':
        summary = `Strong ${tradeModeDescription} long opportunity with ${confidence}% confidence for a ${timeDescription} position. Entry near $${entry.toFixed(0)} with tight stops. ${tradingStyle} for a ${riskRewardRatio.toFixed(1)}:1 risk-reward ratio and ${probability}% probability of success based on momentum indicators.`;
        break;
      case 'day':
        summary = `Promising intraday long setup with ${confidence}% confidence for a ${timeDescription} position. Entry near $${entry.toFixed(0)} targeting key resistance levels. ${tradingStyle} with a favorable ${riskRewardRatio.toFixed(1)}:1 risk-reward ratio and ${probability}% win probability.`;
        break;
      case 'night':
        summary = `Strategic ${tradeModeDescription} long position with ${confidence}% confidence for ${timeDescription} holding. Entry around $${entry.toFixed(0)} with defined risk parameters. ${tradingStyle}, aiming for a ${riskRewardRatio.toFixed(1)}:1 return and ${probability}% probability based on technical analysis.`;
        break;
      default:
        summary = `Strong ${tradeModeDescription} long opportunity with ${confidence}% confidence for a ${timeDescription} position. Entry near $${entry.toFixed(0)} with defined stop loss and take profit levels. Risk-reward ratio of ${riskRewardRatio.toFixed(1)}:1 and ${probability}% probability of success based on technical analysis.`;
    }
  } else if (direction === 'short') {
    switch(tradingMode) {
      case 'scalp':
        summary = `Quick ${tradeModeDescription} short opportunity with ${confidence}% confidence for a ${timeDescription} trade. Entry near $${entry.toFixed(0)} with precise exit targets. ${tradingStyle} for a ${riskRewardRatio.toFixed(1)}:1 risk-reward ratio and ${probability}% probability of success on this reversal setup.`;
        break;
      case 'day':
        summary = `Solid intraday short setup with ${confidence}% confidence for a ${timeDescription} position. Entry near $${entry.toFixed(0)} with clear support targets. ${tradingStyle} for an attractive ${riskRewardRatio.toFixed(1)}:1 risk-reward profile and ${probability}% probability based on multiple bearish signals.`;
        break;
      case 'night':
        summary = `High-quality ${tradeModeDescription} short position with ${confidence}% confidence for ${timeDescription} holding. Entry around $${entry.toFixed(0)} targeting key breakpoints. ${tradingStyle} with a strong ${riskRewardRatio.toFixed(1)}:1 risk-reward ratio and ${probability}% success probability based on our analysis.`;
        break;
      default:
        summary = `Potential ${tradeModeDescription} short opportunity with ${confidence}% confidence for a ${timeDescription} position. Entry near $${entry.toFixed(0)} with defined stop loss and take profit levels. Risk-reward ratio of ${riskRewardRatio.toFixed(1)}:1 and ${probability}% probability of success based on technical analysis.`;
    }
  } else {
    switch(tradingMode) {
      case 'scalp':
        summary = `Current market conditions suggest waiting for clearer ${tradeModeDescription} setups (${timeDescription}). Consider monitoring key price levels at $${(basePrice - 200).toFixed(0)} and $${(basePrice + 200).toFixed(0)} for potential breakouts. Reduce position size if trading now.`;
        break;
      case 'day':
        summary = `Mixed signals for ${tradeModeDescription} trades (${timeDescription}). Market is in consolidation mode between $${(basePrice - 500).toFixed(0)} and $${(basePrice + 500).toFixed(0)}. ${tradingStyle} only after clear directional breakout. Consider waiting for better opportunities.`;
        break;
      case 'night':
        summary = `Neutral outlook for ${tradeModeDescription} positions (${timeDescription}). Price action is indecisive with balanced bullish and bearish indicators. ${tradingStyle} is not recommended until volatility increases or a clear trend emerges.`;
        break;
      default:
        summary = `Market conditions unclear for ${tradeModeDescription} trades (${timeDescription}). Consider waiting for better setups or reducing position size. Current analysis shows mixed signals.`;
    }
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
