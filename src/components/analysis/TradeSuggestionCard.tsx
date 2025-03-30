
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertCircle, Target, Clock, BarChart4 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from '@/utils/numberUtils';
import { formatTimeUntil } from '@/utils/dateUtils';
import { useIsMobile } from '@/hooks/use-mobile';

// Define interface locally to ensure it has all required properties
interface TradeSuggestion {
  direction: 'long' | 'short' | 'neutral';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  probability: number;
  confidence: number;
  timeframe: string;
  indicators: any[];
  summary: string;
  createdAt: Date;
}

interface TradeSuggestionCardProps {
  tradeSuggestion: TradeSuggestion | null;
  isLoading: boolean;
}

export const TradeSuggestionCard: React.FC<TradeSuggestionCardProps> = ({ 
  tradeSuggestion, 
  isLoading 
}) => {
  const isMobile = useIsMobile();
  
  if (!tradeSuggestion) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trade Suggestion</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-2">No Active Signals</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Generate a technical analysis to get trading suggestions
          </p>
        </CardContent>
      </Card>
    );
  }

  const { 
    direction, 
    entry, 
    stopLoss, 
    takeProfit, 
    probability, 
    confidence, 
    timeframe,
    summary,
    createdAt, 
    indicators = []
  } = tradeSuggestion;

  // Calculate risk-reward ratio
  const riskRewardRatio = direction === 'long' 
    ? ((takeProfit - entry) / (entry - stopLoss)).toFixed(1)
    : ((entry - takeProfit) / (stopLoss - entry)).toFixed(1);

  // Get color and text based on direction
  const directionColor = direction === 'long' 
    ? 'bg-green-500 text-white' 
    : direction === 'short' 
      ? 'bg-red-500 text-white' 
      : 'bg-yellow-500 text-white';

  // Handle NaN values
  const displayConfidence = isNaN(confidence) ? 50 : confidence;
  const displayProbability = isNaN(probability) ? 60 : probability;
  
  // Filter indicators to show only most relevant ones
  const relevantIndicators = indicators.filter(ind => 
    ind.signal === direction || 
    (direction === 'neutral' && ind.signal === 'neutral')
  ).slice(0, 3);

  return (
    <Card className="relative overflow-hidden w-full">
      <div className={`absolute top-0 left-0 w-1 h-full ${
        direction === 'long' ? 'bg-green-500' : 
        direction === 'short' ? 'bg-red-500' : 
        'bg-yellow-500'
      }`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Trade Suggestion</CardTitle>
          <Badge className={directionColor}>
            {direction === 'long' ? (
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
            ) : direction === 'short' ? (
              <TrendingDown className="h-3.5 w-3.5 mr-1" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
            )}
            {direction.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{summary}</p>
            
            <div className="grid grid-cols-3 gap-2 md:gap-3 text-center">
              <div className="p-2 md:p-3 rounded-md border bg-background space-y-1">
                <p className="text-xs text-muted-foreground">Entry</p>
                <p className="text-sm md:text-base font-mono font-medium">${Math.round(entry)}</p>
              </div>
              <div className="p-2 md:p-3 rounded-md border bg-background space-y-1">
                <p className="text-xs text-muted-foreground">Stop Loss</p>
                <p className="text-sm md:text-base font-mono font-medium text-red-500">${Math.round(stopLoss)}</p>
              </div>
              <div className="p-2 md:p-3 rounded-md border bg-background space-y-1">
                <p className="text-xs text-muted-foreground">Take Profit</p>
                <p className="text-sm md:text-base font-mono font-medium text-green-500">${Math.round(takeProfit)}</p>
              </div>
            </div>
            
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
            
            <div className="flex justify-between text-sm">
              <span>Risk-Reward Ratio</span>
              <span className="font-medium">1:{riskRewardRatio}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Probability</span>
              <span className="font-medium">{displayProbability}%</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center justify-between w-full">
                <span className="text-sm">Timeframe</span>
                <span className="font-medium capitalize">{timeframe}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart4 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Key Indicators</span>
              </div>
              
              {relevantIndicators.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {relevantIndicators.map((indicator, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-md border bg-muted/30">
                      <span className="text-sm font-medium">{indicator.name}</span>
                      <Badge variant="outline" className={
                        indicator.signal === 'bullish' ? 'text-green-500 border-green-500/20' :
                        indicator.signal === 'bearish' ? 'text-red-500 border-red-500/20' :
                        'text-yellow-500 border-yellow-500/20'
                      }>
                        {typeof indicator.value === 'number' 
                          ? indicator.value.toFixed(2) 
                          : indicator.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">No indicator data available</div>
              )}
            </div>
            
            <div className="p-3 rounded-md border bg-primary/5 mt-auto">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Recommended Trading Mode</span>
                <Badge variant="outline" className={
                  timeframe === '15m' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                  timeframe === '1h' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                  'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                }>
                  {timeframe === '15m' ? 'Scalp' : 
                   timeframe === '1h' ? 'Day' : 'Night'}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Best suited for {timeframe === '15m' 
                  ? 'ultra-short term trading (minutes to hours)' 
                  : timeframe === '1h' 
                    ? 'intraday trading (several hours)' 
                    : 'overnight positions (12+ hours)'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-xs text-muted-foreground order-2 sm:order-1">
          Created {createdAt ? formatTimeUntil(createdAt) : 'recently'}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.href = '/chart'}
          className="w-full sm:w-auto order-1 sm:order-2"
        >
          <Target className="h-4 w-4 mr-2" />
          View Chart
        </Button>
      </CardFooter>
    </Card>
  );
};
