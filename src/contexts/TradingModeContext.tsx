
import React, { createContext, useState, useEffect, ReactNode } from 'react';

export type TradingMode = 'day' | 'night';

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
  const [tradingMode, setTradingMode] = useState<TradingMode>('day');

  // Define which timeframes to use for each trading mode
  const getTimeframes = () => {
    switch (tradingMode) {
      case 'day':
        return ['15m', '1h', '4h'];
      case 'night':
        return ['1h', '4h', '1d'];
      default:
        return ['15m', '1h', '4h'];
    }
  };

  // Define which indicators to use for each trading mode
  const getIndicators = () => {
    switch (tradingMode) {
      case 'day':
        return ['ma50', 'ma100', 'macd', 'vwap', 'volume', 'rsi'];
      case 'night':
        return ['ma100', 'bbands', 'rsi', 'macd', 'volume'];
      default:
        return ['ma50', 'macd', 'rsi', 'volume'];
    }
  };

  // Get trading mode description
  const getDescription = () => {
    switch (tradingMode) {
      case 'day':
        return 'Short-term trading (hours). Positions opened and closed within the same day, focusing on intraday trends and market movements. Balanced risk approach.';
      case 'night':
        return 'Medium-term trading (12+ hours). Positions that can be held overnight, focusing on larger price swings and trend continuation. More relaxed monitoring required.';
      default:
        return 'Select a trading mode to see details.';
    }
  };

  // Get volatility events relevant to each trading mode
  const getVolatilityEvents = () => {
    switch (tradingMode) {
      case 'day':
        return [
          'NYSE Market Open (9:30 AM ET)',
          'European Market Close (11:30 AM ET)',
          'NYSE Market Close (4:00 PM ET)',
          'Fed Announcements'
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
    if (storedMode && (storedMode === 'day' || storedMode === 'night')) {
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
