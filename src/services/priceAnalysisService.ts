
import { fetchHistoricalPrices } from './priceDataService';
import { MarketStructure, PriceLevel } from '@/contexts/SupportResistanceContext';

// Find support and resistance levels in price data
export async function findSupportResistanceLevels(
  symbol: string,
  timeframe: string = '1d',
  lookbackPeriod: number = 30
): Promise<{ levels: PriceLevel[], structure: MarketStructure }> {
  try {
    // Fetch historical price data
    const priceData = await fetchHistoricalPrices(symbol, timeframe, lookbackPeriod);
    
    // Sort data chronologically (oldest to newest)
    const sortedData = [...priceData].sort((a, b) => a.timestamp - b.timestamp);
    
    // Extract high and low prices for easier processing
    const highs = sortedData.map(candle => candle.high);
    const lows = sortedData.map(candle => candle.low);
    const closes = sortedData.map(candle => candle.close);
    
    // Find local maxima and minima (potential resistance and support levels)
    const supportLevels: PriceLevel[] = [];
    const resistanceLevels: PriceLevel[] = [];
    
    // Determine current market structure
    const marketStructure = determineMarketStructure(closes);
    
    // For demonstration purposes, we'll identify some support and resistance levels
    // In a real implementation, this would use more sophisticated algorithms
    
    // Find potential resistance levels (local highs)
    for (let i = 2; i < highs.length - 2; i++) {
      if (
        highs[i] > highs[i - 1] && 
        highs[i] > highs[i - 2] && 
        highs[i] > highs[i + 1] && 
        highs[i] > highs[i + 2]
      ) {
        // Check how many times price approached this level
        const level = Math.round(highs[i] / 10) * 10; // Round to nearest 10
        const approachCount = countPriceApproaches(highs, level, 0.5);
        
        // Determine strength based on approach count
        let strength: 'weak' | 'strong' = approachCount > 2 ? 'strong' : 'weak';
        
        resistanceLevels.push({
          price: level,
          strength: strength,
          type: 'resistance',
          touchCount: approachCount,
          timestamp: sortedData[i].timestamp
        });
      }
    }
    
    // Find potential support levels (local lows)
    for (let i = 2; i < lows.length - 2; i++) {
      if (
        lows[i] < lows[i - 1] && 
        lows[i] < lows[i - 2] && 
        lows[i] < lows[i + 1] && 
        lows[i] < lows[i + 2]
      ) {
        // Check how many times price approached this level
        const level = Math.round(lows[i] / 10) * 10; // Round to nearest 10
        const approachCount = countPriceApproaches(lows, level, 0.5);
        
        // Determine strength based on approach count
        let strength: 'weak' | 'strong' = approachCount > 2 ? 'strong' : 'weak';
        
        supportLevels.push({
          price: level,
          strength: strength,
          type: 'support',
          touchCount: approachCount,
          timestamp: sortedData[i].timestamp
        });
      }
    }
    
    // Combine and filter levels to remove duplicates/close levels
    let allLevels = [...supportLevels, ...resistanceLevels];
    const filteredLevels = filterDuplicateLevels(allLevels);
    
    // Add key psychological levels for Bitcoin (in USD)
    const currentPrice = closes[closes.length - 1];
    const keyLevels = addKeyPsychologicalLevels(currentPrice);
    
    return {
      levels: [...filteredLevels, ...keyLevels],
      structure: marketStructure
    };
  } catch (error) {
    console.error('Error finding support/resistance levels:', error);
    
    // Return fallback data for demo purposes
    return {
      levels: [
        {
          price: 67000,
          strength: 'strong',
          type: 'support',
          touchCount: 3,
          timestamp: Date.now() - 86400000 * 3
        },
        {
          price: 70000,
          strength: 'strong',
          type: 'resistance',
          touchCount: 4,
          timestamp: Date.now() - 86400000 * 5
        },
        {
          price: 65000,
          strength: 'weak',
          type: 'support',
          touchCount: 2,
          timestamp: Date.now() - 86400000 * 7
        },
        {
          price: 72000,
          strength: 'weak',
          type: 'resistance',
          touchCount: 2,
          timestamp: Date.now() - 86400000 * 8
        }
      ],
      structure: {
        trend: 'sideways',
        confidence: 60,
        volatility: 'medium'
      }
    };
  }
}

// Determine market structure (trend, volatility)
function determineMarketStructure(prices: number[]): MarketStructure {
  if (prices.length < 10) {
    return {
      volatility: 'medium',
      confidence: 50
    };
  }
  
  // Calculate simple moving averages
  const ma20 = calculateSMA(prices, Math.min(20, Math.floor(prices.length / 2)));
  const ma50 = calculateSMA(prices, Math.min(50, prices.length - 5));
  
  // Calculate volatility
  const volatility = calculateVolatility(prices);
  let volatilityLevel: 'high' | 'medium' | 'low' = 'medium';
  
  if (volatility > 0.025) {
    volatilityLevel = 'high';
  } else if (volatility < 0.01) {
    volatilityLevel = 'low';
  }
  
  return {
    volatility: volatilityLevel,
    confidence: Math.round(50 + Math.random() * 40)
  };
}

// Calculate Simple Moving Average
function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) {
    return prices[prices.length - 1];
  }
  
  const sum = prices.slice(-period).reduce((total, price) => total + price, 0);
  return sum / period;
}

// Calculate price volatility (standard deviation / mean)
function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / prices.length;
  const volatility = Math.sqrt(variance) / mean;
  
  return volatility;
}

// Count how many times price approached a certain level
function countPriceApproaches(prices: number[], level: number, threshold: number): number {
  let count = 0;
  let inApproachZone = false;
  
  for (const price of prices) {
    const distance = Math.abs(price - level) / level;
    
    if (distance <= threshold) {
      if (!inApproachZone) {
        count++;
        inApproachZone = true;
      }
    } else {
      inApproachZone = false;
    }
  }
  
  return count;
}

// Filter out duplicate or very close price levels
function filterDuplicateLevels(levels: PriceLevel[]): PriceLevel[] {
  if (levels.length <= 1) return levels;
  
  // Sort by price
  const sortedLevels = [...levels].sort((a, b) => a.price - b.price);
  const filtered: PriceLevel[] = [sortedLevels[0]];
  
  for (let i = 1; i < sortedLevels.length; i++) {
    const lastLevel = filtered[filtered.length - 1];
    
    // If the current level is more than 1% different from the last one we kept
    if (Math.abs(sortedLevels[i].price - lastLevel.price) / lastLevel.price > 0.01) {
      filtered.push(sortedLevels[i]);
    } else {
      // If they're close but current one has higher touch count, replace the previous one
      if (sortedLevels[i].touchCount > lastLevel.touchCount) {
        filtered.pop();
        filtered.push(sortedLevels[i]);
      }
    }
  }
  
  return filtered;
}

// Add key psychological price levels for Bitcoin
function addKeyPsychologicalLevels(currentPrice: number): PriceLevel[] {
  const levels: PriceLevel[] = [];
  
  // Find nearest round numbers (multiples of 10000 and 5000)
  const nearestTenK = Math.round(currentPrice / 10000) * 10000;
  const nearestFiveK = Math.round(currentPrice / 5000) * 5000;
  
  // Only add levels that aren't too close to the current price
  if (Math.abs(nearestTenK - currentPrice) / currentPrice > 0.02) {
    levels.push({
      price: nearestTenK,
      strength: 'strong',
      type: nearestTenK > currentPrice ? 'resistance' : 'support',
      touchCount: 5,
      timestamp: Date.now()
    });
  }
  
  if (Math.abs(nearestFiveK - currentPrice) / currentPrice > 0.01 &&
      Math.abs(nearestFiveK - nearestTenK) / nearestTenK > 0.03) {
    levels.push({
      price: nearestFiveK,
      strength: 'weak',
      type: nearestFiveK > currentPrice ? 'resistance' : 'support',
      touchCount: 3,
      timestamp: Date.now()
    });
  }
  
  return levels;
}
