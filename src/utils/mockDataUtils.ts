
import { TechnicalIndicator } from '@/contexts/TechnicalAnalysisContext';

/**
 * Calculates a probability value based on technical indicators, direction, and confidence
 */
export const calculateProbability = (
  indicators: TechnicalIndicator[],
  direction: 'long' | 'short' | 'neutral',
  confidence: number
): number => {
  if (direction === 'neutral') return 50;
  
  // Calculate weighted probability based on indicator signals
  const supportingSignals = indicators.filter(i => 
    (direction === 'long' && i.signal === 'bullish') || 
    (direction === 'short' && i.signal === 'bearish')
  ).length;
  
  const opposingSignals = indicators.filter(i => 
    (direction === 'long' && i.signal === 'bearish') || 
    (direction === 'short' && i.signal === 'bullish')
  ).length;
  
  // Calculate base probability from signals
  let probability = 50 + (supportingSignals - opposingSignals) * 5;
  
  // Adjust based on confidence
  probability = probability * (confidence / 75);
  
  // Add some randomness but ensure it stays within 40-95 range
  probability = Math.min(Math.max(
    probability + (Math.random() * 10 - 5),
    40
  ), 95);
  
  return Math.round(probability);
};

/**
 * Generates mock technical indicators
 */
export const generateMockIndicators = (
  bias: 'bullish' | 'bearish' | 'neutral',
  timeframe: string = '1h'
): TechnicalIndicator[] => {
  const indicators: TechnicalIndicator[] = [
    {
      name: 'Moving Average (50)',
      value: bias === 'bullish' ? 'Above' : bias === 'bearish' ? 'Below' : 'Crossing',
      signal: bias === 'bullish' ? 'bullish' : bias === 'bearish' ? 'bearish' : 'neutral',
      timeframe,
      category: 'trend',
      description: `Price ${bias === 'bullish' ? 'above' : bias === 'bearish' ? 'below' : 'near'} MA50`
    },
    {
      name: 'RSI',
      value: bias === 'bullish' ? 65 : bias === 'bearish' ? 35 : 50,
      signal: bias === 'bullish' ? 'bullish' : bias === 'bearish' ? 'bearish' : 'neutral',
      timeframe,
      category: 'momentum',
      description: `RSI ${bias === 'bullish' ? 'shows upward momentum' : bias === 'bearish' ? 'shows downward momentum' : 'is neutral'}`
    },
    {
      name: 'MACD',
      value: bias === 'bullish' ? 'Positive' : bias === 'bearish' ? 'Negative' : 'Crossing',
      signal: bias === 'bullish' ? 'bullish' : bias === 'bearish' ? 'bearish' : 'neutral',
      timeframe,
      category: 'momentum',
      description: `MACD ${bias === 'bullish' ? 'is positive and rising' : bias === 'bearish' ? 'is negative and falling' : 'is crossing signal line'}`
    },
    {
      name: 'Volume',
      value: bias === 'bullish' ? 'Increasing' : bias === 'bearish' ? 'Decreasing' : 'Average',
      signal: bias === 'bullish' ? 'bullish' : bias === 'bearish' ? 'bearish' : 'neutral',
      timeframe,
      category: 'volume',
      description: `Volume ${bias === 'bullish' ? 'is increasing on up moves' : bias === 'bearish' ? 'is increasing on down moves' : 'is average'}`
    }
  ];
  
  return indicators;
};
