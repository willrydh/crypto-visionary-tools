
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatTimeUntil } from '@/utils/dateUtils';
import { TechnicalIndicator, MarketBias } from '@/contexts/TechnicalAnalysisContext';
import { useTradingMode } from '@/hooks/useTradingMode';
import { getModeTextClass, getModeBorderClass, getModeAlertClass } from '@/components/trading/TradingModeStyles';
import { cn } from '@/lib/utils';

interface EnhancedTechnicalAnalysisProps {
  currentBias: MarketBias;
  indicators: TechnicalIndicator[];
  confidenceScore: number;
  lastUpdated: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
  title?: string;
}

const EnhancedTechnicalAnalysis: React.FC<EnhancedTechnicalAnalysisProps> = ({
  currentBias,
  indicators,
  confidenceScore,
  lastUpdated,
  isLoading,
  onRefresh,
  title = "Technical Analysis"
}) => {
  const { tradingMode } = useTradingMode();
  
  // Count signals by type
  const bullishCount = indicators.filter(i => i.signal === 'bullish').length;
  const bearishCount = indicators.filter(i => i.signal === 'bearish').length;
  const neutralCount = indicators.filter(i => i.signal === 'neutral').length;
  
  // Get color based on bias
  const getBiasColor = (bias: MarketBias) => {
    switch(bias) {
      case 'bullish':
        return 'bg-green-500 text-white';
      case 'bearish':
        return 'bg-red-500 text-white';
      case 'neutral':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-muted';
    }
  };
  
  // Get description based on trading mode and bias
  const getDescription = () => {
    const modePrefix = tradingMode === 'scalp' ? 'Short-term ' : 
                       tradingMode === 'day' ? 'Intraday ' : 
                       'Medium-term ';
    
    switch(currentBias) {
      case 'bullish':
        return `${modePrefix}bullish momentum detected for ${tradingMode} trading with ${confidenceScore}% confidence.`;
      case 'bearish':
        return `${modePrefix}bearish signals indicate selling pressure with ${confidenceScore}% confidence for ${tradingMode} trades.`;
      case 'neutral':
        return `${modePrefix}mixed signals detected. Consider waiting for clearer direction for ${tradingMode} trading.`;
      default:
        return `Analyzing market conditions for ${tradingMode} trading...`;
    }
  };
  
  // Get color class based on trading mode
  const modeColorClass = getModeTextClass(tradingMode);
  const modeBorderClass = getModeBorderClass(tradingMode);
  const modeAlertClass = getModeAlertClass(tradingMode);
  
  return (
    <Card className={cn("border", modeBorderClass, "transition-all duration-300")}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-1.5">
            <span className={modeColorClass}>
              {tradingMode === 'scalp' && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>}
              {tradingMode === 'day' && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>}
              {tradingMode === 'night' && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>}
            </span>
            {title}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-8 px-2 text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Update
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded-full w-3/4"></div>
            <div className="h-16 bg-muted rounded-lg"></div>
            <div className="h-8 bg-muted rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className={cn("p-2 text-sm rounded-md", modeAlertClass)}>
              {getDescription()}
            </div>
            
            <div className="flex justify-between items-center">
              <Badge className={getBiasColor(currentBias)}>
                {currentBias === 'bullish' ? (
                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                ) : currentBias === 'bearish' ? (
                  <TrendingDown className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 mr-1" />
                )}
                {currentBias.charAt(0).toUpperCase() + currentBias.slice(1)}
              </Badge>
              <div className="text-sm">
                {`Confidence: ${confidenceScore}%`}
              </div>
            </div>
            
            <Progress 
              value={confidenceScore} 
              className="h-2"
            />
            
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-lg border p-2 text-center">
                <div className="text-sm font-medium text-green-500">{bullishCount}</div>
                <div className="text-xs text-muted-foreground">Bullish</div>
              </div>
              <div className="rounded-lg border p-2 text-center">
                <div className="text-sm font-medium text-red-500">{bearishCount}</div>
                <div className="text-xs text-muted-foreground">Bearish</div>
              </div>
              <div className="rounded-lg border p-2 text-center">
                <div className="text-sm font-medium">{neutralCount}</div>
                <div className="text-xs text-muted-foreground">Neutral</div>
              </div>
            </div>
            
            <div className="space-y-1 bg-muted/20 p-2 rounded-md">
              <div className="text-xs font-medium">Top Indicators</div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {indicators.slice(0, 4).map((indicator, idx) => (
                  <div key={idx} className="text-xs flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${
                      indicator.signal === 'bullish' ? 'bg-green-500' : 
                      indicator.signal === 'bearish' ? 'bg-red-500' : 
                      'bg-yellow-500'
                    }`}></span>
                    <span>{indicator.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {lastUpdated && (
              <div className="text-xs text-muted-foreground text-right">
                Updated {formatTimeUntil(lastUpdated)}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedTechnicalAnalysis;
