
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertCircle, Target } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from '@/utils/numberUtils';
import { formatTimeUntil } from '@/utils/dateUtils';

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
  if (!tradeSuggestion) {
    return (
      <Card>
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
    createdAt 
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

  return (
    <Card className="relative overflow-hidden">
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
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{summary}</p>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Entry</p>
              <p className="text-base font-mono font-medium">${Math.round(entry)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Stop Loss</p>
              <p className="text-base font-mono font-medium text-red-500">${Math.round(stopLoss)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Take Profit</p>
              <p className="text-base font-mono font-medium text-green-500">${Math.round(takeProfit)}</p>
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
          
          <div className="flex justify-between text-sm">
            <span>Timeframe</span>
            <span className="font-medium capitalize">{timeframe}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Created {createdAt ? formatTimeUntil(createdAt) : 'recently'}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.href = '/chart'}
        >
          <Target className="h-4 w-4 mr-2" />
          View Chart
        </Button>
      </CardFooter>
    </Card>
  );
};
