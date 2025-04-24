
export interface TechnicalSetup {
  type: 'BullFlag' | 'BearFlag' | 'BullishRetest' | 'BearishRetest' | 'Reversal' | 'BOM';
  symbol: string;
  timeframe: string;
  timestamp: number;
  price: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number; // 0-100
  indicators: {
    rsi?: number;
    macd?: {
      histogram: number;
      signal: number;
      line: number;
    };
    ma50?: number;
    ma200?: number;
    stochRSI?: {
      k: number;
      d: number;
    };
    volume?: number;
    volumeChange?: number;
  };
  additionalInfo?: string;
}

export interface ScanResult {
  setups: TechnicalSetup[];
  timestamp: number;
}
