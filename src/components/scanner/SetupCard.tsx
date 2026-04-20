
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TechnicalSetup } from '@/types/scanner';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Flag, Repeat, CornerRightDown, CornerLeftDown } from 'lucide-react';

interface SetupCardProps {
  setup: TechnicalSetup;
}

export const SetupCard: React.FC<SetupCardProps> = ({ setup }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getSetupIcon = () => {
    switch (setup.type) {
      case 'BullFlag':
        return <Flag className="h-5 w-5 text-bullish" />;
      case 'BearFlag':
        return <Flag className="h-5 w-5 text-bearish" />;
      case 'BullishRetest':
        return <Repeat className="h-5 w-5 text-bullish" />;
      case 'BearishRetest':
        return <Repeat className="h-5 w-5 text-bearish" />;
      case 'Reversal':
        return setup.entryPrice > setup.price 
          ? <CornerRightDown className="h-5 w-5 text-bullish" /> 
          : <CornerLeftDown className="h-5 w-5 text-bearish" />;
      case 'BOM':
        return setup.entryPrice > setup.price 
          ? <TrendingUp className="h-5 w-5 text-bullish" /> 
          : <TrendingDown className="h-5 w-5 text-bearish" />;
      default:
        return null;
    }
  };
  
  const getBadgeColor = () => {
    const isBullish = ['BullFlag', 'BullishRetest'].includes(setup.type) || 
      (setup.type === 'Reversal' && setup.entryPrice > setup.price) ||
      (setup.type === 'BOM' && setup.entryPrice > setup.price);
    
    if (isBullish) {
      return "bg-bullish/20 text-bullish border-bullish/30";
    } else {
      return "bg-bearish/20 text-red-600 border-bearish/30";
    }
  };
  
  const getSetupDescription = () => {
    switch (setup.type) {
      case 'BullFlag':
        return "Bullish continuation pattern forming a flag shape";
      case 'BearFlag':
        return "Bearish continuation pattern forming a flag shape";
      case 'BullishRetest':
        return "Price retesting support from above";
      case 'BearishRetest':
        return "Price retesting resistance from below";
      case 'Reversal':
        return setup.entryPrice > setup.price 
          ? "Potential bullish reversal detected" 
          : "Potential bearish reversal detected";
      case 'BOM':
        return setup.entryPrice > setup.price 
          ? "Bullish break of market structure" 
          : "Bearish break of market structure";
      default:
        return "Technical setup detected";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getSetupIcon()}
            {setup.symbol}
          </CardTitle>
          <Badge className={`font-medium ${getBadgeColor()}`}>
            {setup.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{getSetupDescription()}</p>
          <p className="text-xs text-muted-foreground">
            Detected at {formatTime(setup.timestamp)} ({setup.timeframe}m)
          </p>
        </div>
        
        <div className="p-3 bg-muted rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Entry</span>
            <span className="font-mono">{setup.entryPrice.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Stop Loss</span>
              <span className="text-xs font-mono text-bearish">{setup.stopLoss.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Take Profit</span>
              <span className="text-xs font-mono text-bullish">{setup.takeProfit.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {setup.indicators.rsi && (
            <Badge variant="outline" className="font-mono text-xs">
              RSI: {setup.indicators.rsi.toFixed(1)}
            </Badge>
          )}
          {setup.indicators.macd && (
            <Badge variant="outline" className="font-mono text-xs">
              MACD: {setup.indicators.macd.histogram > 0 ? '+' : ''}{setup.indicators.macd.histogram.toFixed(2)}
            </Badge>
          )}
          {setup.indicators.stochRSI && (
            <Badge variant="outline" className="font-mono text-xs">
              StochRSI: {setup.indicators.stochRSI.k.toFixed(1)}
            </Badge>
          )}
        </div>
        
        {setup.additionalInfo && (
          <p className="text-xs text-muted-foreground">{setup.additionalInfo}</p>
        )}
      </CardContent>
    </Card>
  );
};
