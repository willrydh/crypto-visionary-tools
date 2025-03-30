
import { TradingMode } from "@/contexts/TradingModeContext";

export interface MarketEvent {
  eventType: 'dump' | 'pump' | 'volatility' | 'flat';
  timestamp: number;
  magnitude: number; // Percentage change
  duration: number; // In minutes
  relatedTo?: string; // e.g., "NYSE Open", "Economic Announcement", etc.
  symbol: string;
}

export interface TradingSignal {
  timestamp: number;
  direction: 'long' | 'short' | 'neutral';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  tradingMode: TradingMode;
  triggeredIndicators: string[];
  outcome?: {
    result: 'win' | 'loss' | 'breakeven';
    pnl: number; // Percentage
    exitPrice: number;
    exitTimestamp: number;
  };
}

export interface IndicatorPerformance {
  name: string;
  timeframe: string;
  successRate: number; // 0-100
  sampleSize: number;
  averagePnl: number; // Percentage
  lastUpdated: number;
}

// Helper function to store events in localStorage
const storeEvent = (event: MarketEvent): void => {
  try {
    // Get existing events
    const eventsJson = localStorage.getItem('market-events') || '[]';
    const events: MarketEvent[] = JSON.parse(eventsJson);
    
    // Add new event
    events.push(event);
    
    // Store back, limit to last 500 events to prevent localStorage overflow
    const limitedEvents = events.slice(-500);
    localStorage.setItem('market-events', JSON.stringify(limitedEvents));
  } catch (error) {
    console.error('Failed to store market event:', error);
  }
};

// Helper function to store signals in localStorage
const storeSignal = (signal: TradingSignal): void => {
  try {
    // Get existing signals
    const signalsJson = localStorage.getItem('trading-signals') || '[]';
    const signals: TradingSignal[] = JSON.parse(signalsJson);
    
    // Add new signal
    signals.push(signal);
    
    // Store back, limit to last 500 signals
    const limitedSignals = signals.slice(-500);
    localStorage.setItem('trading-signals', JSON.stringify(limitedSignals));
  } catch (error) {
    console.error('Failed to store trading signal:', error);
  }
};

// Log a market event
export const logMarketEvent = (
  eventType: 'dump' | 'pump' | 'volatility' | 'flat',
  magnitude: number,
  duration: number,
  symbol: string,
  relatedTo?: string
): void => {
  const event: MarketEvent = {
    eventType,
    timestamp: Date.now(),
    magnitude,
    duration,
    relatedTo,
    symbol
  };
  
  storeEvent(event);
  console.log(`Logged ${eventType} event for ${symbol}, magnitude: ${magnitude}%`);
};

// Log a trading signal
export const logTradingSignal = (
  direction: 'long' | 'short' | 'neutral',
  entryPrice: number,
  stopLoss: number,
  takeProfit: number,
  tradingMode: TradingMode,
  triggeredIndicators: string[],
  symbol: string
): string => {
  const signalId = `signal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  const signal: TradingSignal = {
    timestamp: Date.now(),
    direction,
    entryPrice,
    stopLoss,
    takeProfit,
    tradingMode,
    triggeredIndicators
  };
  
  storeSignal(signal);
  return signalId;
};

// Update a signal with its outcome
export const updateSignalOutcome = (
  signalId: string,
  result: 'win' | 'loss' | 'breakeven',
  pnl: number,
  exitPrice: number
): boolean => {
  try {
    // Get existing signals
    const signalsJson = localStorage.getItem('trading-signals') || '[]';
    const signals: TradingSignal[] = JSON.parse(signalsJson);
    
    // Find signal by ID and update it
    const signalIndex = signals.findIndex(s => `signal-${s.timestamp}` === signalId);
    if (signalIndex === -1) return false;
    
    signals[signalIndex].outcome = {
      result,
      pnl,
      exitPrice,
      exitTimestamp: Date.now()
    };
    
    localStorage.setItem('trading-signals', JSON.stringify(signals));
    return true;
  } catch (error) {
    console.error('Failed to update signal outcome:', error);
    return false;
  }
};

// Get market volatility statistics around NYSE open/close times
export const getNyseVolatilityStats = (
  days: 5 | 10 | 20 = 10,
  eventType: 'open' | 'close' = 'open'
): { dumpCount: number, pumpCount: number, flatCount: number, averageMagnitude: number } => {
  try {
    // Get existing events
    const eventsJson = localStorage.getItem('market-events') || '[]';
    const events: MarketEvent[] = JSON.parse(eventsJson);
    
    // Filter events related to NYSE open/close within the specified number of days
    const millisPerDay = 86400000;
    const cutoffTime = Date.now() - (days * millisPerDay);
    
    const relatedEvents = events.filter(event => 
      event.timestamp > cutoffTime && 
      event.relatedTo?.toLowerCase().includes(`nyse ${eventType}`)
    );
    
    // Count by event type
    const dumpCount = relatedEvents.filter(e => e.eventType === 'dump').length;
    const pumpCount = relatedEvents.filter(e => e.eventType === 'pump').length;
    const flatCount = relatedEvents.filter(e => e.eventType === 'flat').length;
    
    // Calculate average magnitude
    const totalMagnitude = relatedEvents.reduce((sum, event) => sum + Math.abs(event.magnitude), 0);
    const averageMagnitude = relatedEvents.length > 0 ? totalMagnitude / relatedEvents.length : 0;
    
    return {
      dumpCount,
      pumpCount,
      flatCount,
      averageMagnitude
    };
  } catch (error) {
    console.error('Failed to analyze NYSE volatility:', error);
    return { dumpCount: 0, pumpCount: 0, flatCount: 0, averageMagnitude: 0 };
  }
};

// Get indicator performance statistics
export const getIndicatorPerformance = (indicatorName: string): IndicatorPerformance | null => {
  try {
    // Get existing signals
    const signalsJson = localStorage.getItem('trading-signals') || '[]';
    const signals: TradingSignal[] = JSON.parse(signalsJson);
    
    // Filter signals that used this indicator and have outcomes
    const relevantSignals = signals.filter(
      s => s.triggeredIndicators.includes(indicatorName) && s.outcome
    );
    
    if (relevantSignals.length === 0) return null;
    
    // Calculate success rate
    const successfulSignals = relevantSignals.filter(s => s.outcome?.result === 'win');
    const successRate = (successfulSignals.length / relevantSignals.length) * 100;
    
    // Calculate average PnL
    const totalPnl = relevantSignals.reduce((sum, signal) => sum + (signal.outcome?.pnl || 0), 0);
    const averagePnl = totalPnl / relevantSignals.length;
    
    return {
      name: indicatorName,
      timeframe: 'aggregate', // This could be refined further
      successRate,
      sampleSize: relevantSignals.length,
      averagePnl,
      lastUpdated: Date.now()
    };
  } catch (error) {
    console.error('Failed to get indicator performance:', error);
    return null;
  }
};

// Get trend tracking data
export const getTrendTracking = (
  days: 7 | 30 | 90 = 30
): { 
  predominantBias: 'bullish' | 'bearish' | 'neutral', 
  averageSignalSuccess: number,
  topPerformingIndicator: string,
  topPerformingTimeframe: string,
  totalSignals: number
} => {
  try {
    // Get existing signals
    const signalsJson = localStorage.getItem('trading-signals') || '[]';
    const signals: TradingSignal[] = JSON.parse(signalsJson);
    
    // Filter signals within the specified number of days
    const millisPerDay = 86400000;
    const cutoffTime = Date.now() - (days * millisPerDay);
    const recentSignals = signals.filter(s => s.timestamp > cutoffTime && s.outcome);
    
    if (recentSignals.length === 0) {
      return {
        predominantBias: 'neutral',
        averageSignalSuccess: 0,
        topPerformingIndicator: 'none',
        topPerformingTimeframe: 'none',
        totalSignals: 0
      };
    }
    
    // Determine predominant bias
    const longSignals = recentSignals.filter(s => s.direction === 'long');
    const shortSignals = recentSignals.filter(s => s.direction === 'short');
    
    let predominantBias: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (longSignals.length > shortSignals.length * 1.5) {
      predominantBias = 'bullish';
    } else if (shortSignals.length > longSignals.length * 1.5) {
      predominantBias = 'bearish';
    }
    
    // Calculate average signal success
    const successfulSignals = recentSignals.filter(s => s.outcome?.result === 'win');
    const averageSignalSuccess = (successfulSignals.length / recentSignals.length) * 100;
    
    // Find top performing indicator
    const indicatorStats: Record<string, { count: number, wins: number }> = {};
    recentSignals.forEach(signal => {
      signal.triggeredIndicators.forEach(indicator => {
        if (!indicatorStats[indicator]) {
          indicatorStats[indicator] = { count: 0, wins: 0 };
        }
        indicatorStats[indicator].count++;
        if (signal.outcome?.result === 'win') {
          indicatorStats[indicator].wins++;
        }
      });
    });
    
    let topPerformingIndicator = 'none';
    let highestSuccessRate = 0;
    
    Object.entries(indicatorStats).forEach(([indicator, stats]) => {
      if (stats.count >= 5) { // Minimum sample size
        const successRate = (stats.wins / stats.count);
        if (successRate > highestSuccessRate) {
          highestSuccessRate = successRate;
          topPerformingIndicator = indicator;
        }
      }
    });
    
    // Find top performing timeframe (based on trading mode as proxy)
    const timeframeStats: Record<string, { count: number, wins: number }> = {
      'scalp': { count: 0, wins: 0 },
      'day': { count: 0, wins: 0 },
      'night': { count: 0, wins: 0 }
    };
    
    recentSignals.forEach(signal => {
      timeframeStats[signal.tradingMode].count++;
      if (signal.outcome?.result === 'win') {
        timeframeStats[signal.tradingMode].wins++;
      }
    });
    
    let topPerformingTimeframe = 'none';
    highestSuccessRate = 0;
    
    Object.entries(timeframeStats).forEach(([timeframe, stats]) => {
      if (stats.count >= 3) { // Minimum sample size
        const successRate = (stats.wins / stats.count);
        if (successRate > highestSuccessRate) {
          highestSuccessRate = successRate;
          topPerformingTimeframe = timeframe;
        }
      }
    });
    
    return {
      predominantBias,
      averageSignalSuccess,
      topPerformingIndicator,
      topPerformingTimeframe,
      totalSignals: recentSignals.length
    };
  } catch (error) {
    console.error('Failed to get trend tracking data:', error);
    return {
      predominantBias: 'neutral',
      averageSignalSuccess: 0,
      topPerformingIndicator: 'none',
      topPerformingTimeframe: 'none',
      totalSignals: 0
    };
  }
};
