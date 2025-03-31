
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatTimeUntil } from '@/utils/dateUtils';
import { TechnicalIndicator, MarketBias } from '@/contexts/TechnicalAnalysisContext';
import { useTradingMode } from '@/hooks/useTradingMode';

interface TechnicalAnalysisSummaryProps {
  currentBias: MarketBias;
  indicators: TechnicalIndicator[];
  confidenceScore: number;
  lastUpdated: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const TechnicalAnalysisSummary: React.FC<TechnicalAnalysisSummaryProps> = ({
  currentBias,
  indicators,
  confidenceScore,
  lastUpdated,
  isLoading,
  onRefresh
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
    const modeName = 'Night Trading';
    
    switch(currentBias) {
      case 'bullish':
        return `Market shows bullish signals for ${modeName}. ${bullishCount} of ${indicators.length} indicators are positive.`;
      case 'bearish':
        return `Market shows bearish signals for ${modeName}. ${bearishCount} of ${indicators.length} indicators are negative.`;
      case 'neutral':
        return `Market shows mixed signals for ${modeName}. Consider waiting for clearer direction.`;
      default:
        return 'No analysis available.';
    }
  };
  
  // Ensure confidence score has a valid value or use a fallback
  const displayConfidence = isNaN(confidenceScore) ? 50 : confidenceScore;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Technical Analysis</CardTitle>
          <Badge className={getBiasColor(currentBias)} variant="secondary">
            {currentBias === 'bullish' ? (
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
            ) : currentBias === 'bearish' ? (
              <TrendingDown className="h-3.5 w-3.5 mr-1" />
            ) : (
              <ArrowRight className="h-3.5 w-3.5 mr-1" />
            )}
            {currentBias.charAt(0).toUpperCase() + currentBias.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{getDescription()}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Confidence</span>
              <span 
                className={`font-medium ${
                  displayConfidence >= 70 ? 'text-green-500' : 
                  displayConfidence >= 50 ? 'text-yellow-500' : 
                  'text-red-500'
                }`}
              >
                {displayConfidence}%
              </span>
            </div>
            <Progress 
              value={displayConfidence}
              className="h-2"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="space-y-1 bg-muted/30 rounded p-2">
              <p className="text-xs text-muted-foreground">Bullish</p>
              <p className="font-semibold text-green-500">{bullishCount || 0}</p>
            </div>
            <div className="space-y-1 bg-muted/30 rounded p-2">
              <p className="text-xs text-muted-foreground">Neutral</p>
              <p className="font-semibold text-yellow-500">{neutralCount || 0}</p>
            </div>
            <div className="space-y-1 bg-muted/30 rounded p-2">
              <p className="text-xs text-muted-foreground">Bearish</p>
              <p className="font-semibold text-red-500">{bearishCount || 0}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between items-center">
        {lastUpdated ? (
          <p className="text-xs text-muted-foreground">
            Updated {formatTimeUntil(lastUpdated)}
          </p>
        ) : (
          <span className="text-xs text-muted-foreground">Not analyzed yet</span>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
};
