
// Data logging service for ProfitPilot AI
// Handles logging and analyzing market insights, trade signals, and event tracking

// Types for volatility events
interface VolatilityData {
  openEvents: {
    dumps: number;
    pumps: number;
    flat: number;
    total: number;
  };
  closeEvents: {
    dumps: number;
    pumps: number;
    flat: number;
    total: number;
  };
}

// Types for trend analysis
interface TrendData {
  bias: string;
  signals: number;
  period: number;
  successRate: number;
  topIndicator: string;
  bestTimeframe: string;
}

// Log trading signals for future analysis
export const logTradingSignal = (
  direction: 'long' | 'short' | 'neutral',
  entryPrice: number,
  stopLoss: number,
  takeProfit: number,
  tradingMode: string,
  indicators: string[],
  symbol: string
) => {
  try {
    // Store in localStorage for demo purposes
    const signalLog = {
      direction,
      entryPrice,
      stopLoss,
      takeProfit,
      tradingMode,
      indicators,
      symbol,
      timestamp: new Date().toISOString(),
    };
    
    // Get existing signals or initialize empty array
    const existingSignals = JSON.parse(localStorage.getItem('tradingSignals') || '[]');
    existingSignals.push(signalLog);
    
    // Store back in localStorage
    localStorage.setItem('tradingSignals', JSON.stringify(existingSignals));
    
    console.log('Trading signal logged:', signalLog);
  } catch (error) {
    console.error('Error logging trading signal:', error);
  }
};

// Fetch volatility events (market open/close dumps and pumps)
export const fetchVolatilityEvents = async (days: number = 10): Promise<VolatilityData> => {
  // In a real implementation, this would call an API endpoint
  // For demo purposes, we'll simulate with random data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Generate realistic volatility data
  const totalOpenEvents = Math.min(days, 30);
  const totalCloseEvents = Math.min(days, 30);
  
  // NYSE open tends to have more volatility (realistic distribution)
  const openDumps = Math.floor(Math.random() * (totalOpenEvents * 0.5));
  const openPumps = Math.floor(Math.random() * (totalOpenEvents * 0.4));
  const openFlat = totalOpenEvents - openDumps - openPumps;
  
  // NYSE close tends to be more balanced
  const closeDumps = Math.floor(Math.random() * (totalCloseEvents * 0.4));
  const closePumps = Math.floor(Math.random() * (totalCloseEvents * 0.4));
  const closeFlat = totalCloseEvents - closeDumps - closePumps;
  
  return {
    openEvents: {
      dumps: openDumps,
      pumps: openPumps,
      flat: openFlat,
      total: totalOpenEvents
    },
    closeEvents: {
      dumps: closeDumps,
      pumps: closePumps,
      flat: closeFlat,
      total: totalCloseEvents
    }
  };
};

// Fetch market trend analysis
export const fetchMarketTrends = async (days: number = 30): Promise<TrendData> => {
  // In a real implementation, this would call an API endpoint
  // For demo purposes, we'll simulate with random but realistic data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate realistic trend data
  const signals = Math.floor(days * (1 + Math.random()));
  const successRate = 45 + Math.random() * 30; // 45% to 75% success rate
  
  // Determine bias based on success rate
  let bias;
  if (successRate > 65) {
    bias = 'Bullish Market Bias';
  } else if (successRate < 50) {
    bias = 'Bearish Market Bias';
  } else {
    bias = 'Neutral Market Bias';
  }
  
  // Select a top indicator
  const indicators = ['MACD', 'RSI', 'MA Cross', 'Volume', 'Bollinger Bands'];
  const topIndicator = indicators[Math.floor(Math.random() * indicators.length)];
  
  // Select best timeframe
  const timeframes = ['15m', '1h', '4h', '1d'];
  const bestTimeframe = timeframes[Math.floor(Math.random() * timeframes.length)];
  
  return {
    bias,
    signals,
    period: days,
    successRate: parseFloat(successRate.toFixed(1)),
    topIndicator,
    bestTimeframe
  };
};

// Get historical signal performance
export const getSignalPerformance = () => {
  try {
    // Retrieve signals from localStorage
    const signals = JSON.parse(localStorage.getItem('tradingSignals') || '[]');
    
    if (signals.length === 0) {
      return {
        totalSignals: 0,
        successRate: 0,
        averageProfit: 0,
        averageLoss: 0
      };
    }
    
    // In a real implementation, we would analyze actual performance
    // For demo purposes, simulating success rate
    const totalSignals = signals.length;
    const successfulSignals = Math.floor(signals.length * 0.68); // 68% success
    const successRate = (successfulSignals / totalSignals) * 100;
    
    // Calculate average profit/loss (simulated)
    const averageProfit = 2.8; // 2.8% average profit
    const averageLoss = -1.5; // -1.5% average loss
    
    return {
      totalSignals,
      successRate,
      averageProfit,
      averageLoss
    };
  } catch (error) {
    console.error('Error getting signal performance:', error);
    return {
      totalSignals: 0,
      successRate: 0,
      averageProfit: 0,
      averageLoss: 0
    };
  }
};

// Track user interactions for personalization
export const trackUserInteraction = (action: string, details: any) => {
  try {
    const interactionLog = {
      action,
      details,
      timestamp: new Date().toISOString()
    };
    
    // Get existing interactions or initialize empty array
    const interactions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
    interactions.push(interactionLog);
    
    // Store back in localStorage (limit to 100 entries)
    if (interactions.length > 100) interactions.shift();
    localStorage.setItem('userInteractions', JSON.stringify(interactions));
  } catch (error) {
    console.error('Error tracking user interaction:', error);
  }
};
