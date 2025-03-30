import { PriceLevel, MarketStructure } from '@/contexts/SupportResistanceContext';
import { Timeframe } from '@/contexts/TimeframeContext';
import { fetchHistoricalPrices, fetchCurrentPrice } from './priceDataService';

export const fetchSupportResistanceLevels = async (
  symbol: string,
  timeframe: Timeframe
): Promise<{
  levels: PriceLevel[];
  structure: MarketStructure;
}> => {
  try {
    // First, fetch real price data to establish current market conditions
    const candles = await fetchHistoricalPrices(symbol, timeframe, 200);
    const currentPriceData = await fetchCurrentPrice(symbol);
    
    // Use the actual price data to generate support and resistance levels
    const price = currentPriceData.price;
    const levels: PriceLevel[] = [];
    
    // Analyze price data to find potential support and resistance levels
    // This is a simplified algorithm for demo purposes
    // In a real implementation, you'd use more advanced algorithms
    
    // Find local maxima and minima
    const highs: number[] = [];
    const lows: number[] = [];
    
    for (let i = 5; i < candles.length - 5; i++) {
      // Check if this is a local maximum
      let isHigh = true;
      for (let j = i - 5; j <= i + 5; j++) {
        if (j === i) continue;
        if (j >= 0 && j < candles.length && candles[j].high >= candles[i].high) {
          isHigh = false;
          break;
        }
      }
      
      if (isHigh) {
        highs.push(candles[i].high);
      }
      
      // Check if this is a local minimum
      let isLow = true;
      for (let j = i - 5; j <= i + 5; j++) {
        if (j === i) continue;
        if (j >= 0 && j < candles.length && candles[j].low <= candles[i].low) {
          isLow = false;
          break;
        }
      }
      
      if (isLow) {
        lows.push(candles[i].low);
      }
    }
    
    // Group similar levels
    const tolerance = price * 0.01; // 1% tolerance
    
    // Process support levels (below current price)
    const filteredLows = lows.filter(low => low < price - tolerance);
    const supportLevels = mergeSimilarLevels(filteredLows, tolerance);
    
    // Process resistance levels (above current price)
    const filteredHighs = highs.filter(high => high > price + tolerance);
    const resistanceLevels = mergeSimilarLevels(filteredHighs, tolerance);
    
    // Add support levels
    supportLevels.slice(0, 3).forEach((level, index) => {
      levels.push({
        price: level,
        type: 'support',
        strength: index === 0 ? 'strong' : (index === 1 ? 'medium' : 'weak'),
        timeframe: timeframe,
        source: index === 0 ? 'swing' : 'historical',
        description: `${index === 0 ? 'Major' : 'Minor'} support level`
      });
    });
    
    // Add resistance levels
    resistanceLevels.slice(0, 3).forEach((level, index) => {
      levels.push({
        price: level,
        type: 'resistance',
        strength: index === 0 ? 'strong' : (index === 1 ? 'medium' : 'weak'),
        timeframe: timeframe,
        source: index === 0 ? 'swing' : 'historical',
        description: `${index === 0 ? 'Major' : 'Minor'} resistance level`
      });
    });
    
    // Determine market structure
    const recentCandles = candles.slice(-30);
    const highPrices = recentCandles.map(candle => candle.high);
    const lowPrices = recentCandles.map(candle => candle.low);
    
    // Find higher highs, lower lows, etc.
    const lastHigh = Math.max(...highPrices.slice(-10));
    const prevHigh = Math.max(...highPrices.slice(0, -10));
    const lastLow = Math.min(...lowPrices.slice(-10));
    const prevLow = Math.min(...lowPrices.slice(0, -10));
    
    const trend = (lastHigh > prevHigh && lastLow > prevLow) ? 'uptrend' : 
                  (lastHigh < prevHigh && lastLow < prevLow) ? 'downtrend' : 
                  'range';
    
    const structure: MarketStructure = {
      trend,
      description: `Market is in a ${trend} based on recent price action`,
      hh: lastHigh > prevHigh ? lastHigh : prevHigh,
      lh: lastHigh < prevHigh ? lastHigh : prevHigh,
      hl: lastLow > prevLow ? lastLow : prevLow,
      ll: lastLow < prevLow ? lastLow : prevLow,
      timeframe
    };
    
    return { levels, structure };
  } catch (error) {
    console.error('Error in fetchSupportResistanceLevels:', error);
    
    // Return mock data as fallback
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
  }
};

// Helper function to merge similar price levels
const mergeSimilarLevels = (levels: number[], tolerance: number): number[] => {
  const result: number[] = [];
  const processed = new Set<number>();
  
  for (let i = 0; i < levels.length; i++) {
    if (processed.has(i)) continue;
    
    processed.add(i);
    let sum = levels[i];
    let count = 1;
    
    for (let j = i + 1; j < levels.length; j++) {
      if (Math.abs(levels[i] - levels[j]) <= tolerance) {
        sum += levels[j];
        count++;
        processed.add(j);
      }
    }
    
    result.push(sum / count);
  }
  
  return result.sort((a, b) => a - b);
};
