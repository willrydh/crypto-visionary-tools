
import React, { createContext, useState, useEffect, ReactNode } from 'react';

export type TradingMode = 'scalp' | 'day' | 'night';

interface TradingModeContextType {
  tradingMode: TradingMode;
  setTradingMode: (mode: TradingMode) => void;
  getTimeframes: () => string[];
  getIndicators: () => string[];
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
      case 'scalp':
        return ['1m', '5m', '15m', '30m'];
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
      case 'scalp':
        return ['ma21', 'stochrsi', 'macd', 'volume'];
      case 'day':
        return ['ma50', 'macd', 'vwap', 'volume'];
      case 'night':
        return ['ma100', 'ma200', 'bbands', 'rsi'];
      default:
        return ['ma50', 'macd', 'rsi', 'volume'];
    }
  };

  // Storage effect to remember user's preferred trading mode
  useEffect(() => {
    const storedMode = localStorage.getItem('tradingMode') as TradingMode;
    if (storedMode) {
      setTradingMode(storedMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tradingMode', tradingMode);
  }, [tradingMode]);

  return (
    <TradingModeContext.Provider value={{ tradingMode, setTradingMode, getTimeframes, getIndicators }}>
      {children}
    </TradingModeContext.Provider>
  );
};
