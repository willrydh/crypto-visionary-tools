
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupportResistance } from '@/hooks/useSupportResistance';
import { useTimeframe } from '@/hooks/useTimeframe';
import { formatCurrency } from '@/utils/numberUtils';

interface SupportResistanceLevelsProps {
  symbol?: string;
}

export const SupportResistanceLevels: React.FC<SupportResistanceLevelsProps> = ({ symbol = 'BTC/USDT' }) => {
  const { levels, marketStructure, isLoading, updateLevels, lastUpdated } = useSupportResistance();
  const { currentTimeframe, setCurrentTimeframe, availableTimeframes } = useTimeframe();
  
  // Load data on mount and when timeframe changes
  useEffect(() => {
    updateLevels(symbol);
  }, [symbol, currentTimeframe, updateLevels]);
  
  // Get strength indicator
  const getStrengthIndicator = (strength: 'weak' | 'medium' | 'strong') => {
    switch(strength) {
      case 'strong':
        return (
          <div className="flex items-center gap-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center gap-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-muted"></div>
          </div>
        );
      case 'weak':
        return (
          <div className="flex items-center gap-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-muted"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-muted"></div>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Get trend badge
  const getTrendBadge = (trend: 'uptrend' | 'downtrend' | 'range') => {
    switch(trend) {
      case 'uptrend':
        return (
          <Badge className="bg-green-500 text-white">
            <ArrowUp className="h-3.5 w-3.5 mr-1" />
            Uptrend
          </Badge>
        );
      case 'downtrend':
        return (
          <Badge className="bg-red-500 text-white">
            <ArrowDown className="h-3.5 w-3.5 mr-1" />
            Downtrend
          </Badge>
        );
      case 'range':
        return (
          <Badge variant="outline">
            <ArrowRight className="h-3.5 w-3.5 mr-1" />
            Range
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Support & Resistance</CardTitle>
          <div className="flex gap-2">
            <Select value={currentTimeframe} onValueChange={(value) => setCurrentTimeframe(value as any)}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeframes.map(tf => (
                  <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => updateLevels(symbol)}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {marketStructure && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-muted-foreground">Market Structure</h3>
                  {getTrendBadge(marketStructure.trend)}
                </div>
                
                <p className="text-sm">{marketStructure.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  {marketStructure.hh && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Higher High</p>
                      <p className="font-mono text-green-500">{formatCurrency(marketStructure.hh)}</p>
                    </div>
                  )}
                  
                  {marketStructure.lh && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Lower High</p>
                      <p className="font-mono text-red-500">{formatCurrency(marketStructure.lh)}</p>
                    </div>
                  )}
                  
                  {marketStructure.hl && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Higher Low</p>
                      <p className="font-mono text-green-500">{formatCurrency(marketStructure.hl)}</p>
                    </div>
                  )}
                  
                  {marketStructure.ll && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Lower Low</p>
                      <p className="font-mono text-red-500">{formatCurrency(marketStructure.ll)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Key Levels</h3>
              
              <div className="space-y-2">
                {/* Resistance levels */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Resistance</p>
                  {levels
                    .filter(level => level.type === 'resistance')
                    .sort((a, b) => a.price - b.price)
                    .map((level, idx) => (
                      <div 
                        key={idx}
                        className="flex justify-between items-center p-2 rounded bg-muted/30"
                      >
                        <div className="flex items-center gap-2">
                          {getStrengthIndicator(level.strength)}
                          <span className="text-sm">{formatCurrency(level.price)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{level.source}</Badge>
                        </div>
                      </div>
                    ))
                  }
                </div>
                
                {/* Support levels */}
                <div className="space-y-1 mt-4">
                  <p className="text-xs text-muted-foreground">Support</p>
                  {levels
                    .filter(level => level.type === 'support')
                    .sort((a, b) => b.price - a.price)
                    .map((level, idx) => (
                      <div 
                        key={idx}
                        className="flex justify-between items-center p-2 rounded bg-muted/30"
                      >
                        <div className="flex items-center gap-2">
                          {getStrengthIndicator(level.strength)}
                          <span className="text-sm">{formatCurrency(level.price)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{level.source}</Badge>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
