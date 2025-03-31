
import React, { createContext, useState, useEffect, ReactNode } from 'react';

export type TradingMode = 'scalp' | 'day' | 'night';

interface TradingModeContextType {
  tradingMode: TradingMode;
  setTradingMode: (mode: TradingMode) => void;
  getTimeframes: () => string[];
  getIndicators: () => string[];
  getDescription: () => string;
  getVolatilityEvents: () => string[];
}

export const TradingModeContext = createContext<TradingModeContextType | undefined>(undefined);

interface TradingModeProviderProps {
  children: ReactNode;
}

export const TradingModeProvider: React.FC<TradingModeProviderProps> = ({ children }) => {
  const [tradingMode, setTradingMode] = useState<TradingMode>('night');

  // Define which timeframes to use for each trading mode
  const getTimeframes = () => {
    switch (tradingMode) {
      case 'scalp':
        return ['1m', '5m', '15m'];
      case 'day':
        return ['15m', '1h', '4h'];
      case 'night':
        return ['1h', '4h', '1d'];
      default:
        return ['1h', '4h', '1d'];
    }
  };

  // Define which indicators to use for each trading mode
  const getIndicators = () => {
    switch (tradingMode) {
      case 'scalp':
        return ['ema9', 'ema21', 'vwap', 'rsi', 'volume'];
      case 'day':
        return ['ema50', 'ema200', 'bbands', 'rsi', 'volume'];
      case 'night':
        return ['ma100', 'bbands', 'rsi', 'macd', 'volume'];
      default:
        return ['ma100', 'bbands', 'rsi', 'macd', 'volume'];
    }
  };

  // Get trading mode description
  const getDescription = () => {
    switch (tradingMode) {
      case 'scalp':
        return 'Ultra-short term trading (minutes). Focuses on small, quick price movements with frequent entries/exits.';
      case 'day':
        return 'Short-term trading (hours). Positions opened and closed within the same trading day, avoiding overnight risk.';
      case 'night':
        return 'Medium-term trading (12+ hours). Positions that can be held overnight, focusing on larger price swings and trend continuation.';
      default:
        return 'Select a trading mode to see details.';
    }
  };

  // Get volatility events relevant to each trading mode
  const getVolatilityEvents = () => {
    switch (tradingMode) {
      case 'scalp':
        return [
          'Exchange Order Flow Imbalances',
          'Large Market Orders',
          'Short-term Support/Resistance Breaks',
          'News Reaction Spikes'
        ];
      case 'day':
        return [
          'Market Opens (9:30 AM ET)',
          'Economic Data Releases',
          'Midday Reversals',
          'Power Hour (3:00-4:00 PM ET)'
        ];
      case 'night':
        return [
          'Asian Market Open (8:00 PM ET)',
          'European Market Open (3:00 AM ET)',
          'Weekend Price Gaps',
          'Overnight News Impact'
        ];
      default:
        return [];
    }
  };

  // Storage effect to remember user's preferred trading mode
  useEffect(() => {
    const storedMode = localStorage.getItem('tradingMode') as TradingMode;
    if (storedMode && ['scalp', 'day', 'night'].includes(storedMode)) {
      setTradingMode(storedMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tradingMode', tradingMode);
  }, [tradingMode]);

  return (
    <TradingModeContext.Provider value={{ 
      tradingMode, 
      setTradingMode, 
      getTimeframes, 
      getIndicators,
      getDescription,
      getVolatilityEvents
    }}>
      {children}
    </TradingModeContext.Provider>
  );
};
