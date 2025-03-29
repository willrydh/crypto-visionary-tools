
import React, { createContext, useState, ReactNode } from 'react';

export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';

interface TimeframeContextType {
  currentTimeframe: Timeframe;
  setCurrentTimeframe: (timeframe: Timeframe) => void;
  availableTimeframes: Timeframe[];
  setAvailableTimeframes: (timeframes: Timeframe[]) => void;
}

export const TimeframeContext = createContext<TimeframeContextType | undefined>(undefined);

interface TimeframeProviderProps {
  children: ReactNode;
}

export const TimeframeProvider: React.FC<TimeframeProviderProps> = ({ children }) => {
  const [currentTimeframe, setCurrentTimeframe] = useState<Timeframe>('1h');
  const [availableTimeframes, setAvailableTimeframes] = useState<Timeframe[]>([
    '1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'
  ]);

  return (
    <TimeframeContext.Provider 
      value={{ 
        currentTimeframe, 
        setCurrentTimeframe, 
        availableTimeframes, 
        setAvailableTimeframes 
      }}
    >
      {children}
    </TimeframeContext.Provider>
  );
};
