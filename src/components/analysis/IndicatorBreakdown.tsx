
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTimeframe } from '@/hooks/useTimeframe';
import { TechnicalIndicator } from '@/contexts/TechnicalAnalysisContext';

interface IndicatorBreakdownProps {
  indicators: TechnicalIndicator[];
}

export const IndicatorBreakdown: React.FC<IndicatorBreakdownProps> = ({ indicators }) => {
  const { currentTimeframe } = useTimeframe();
  
  // Filter indicators by current timeframe if available
  const filteredIndicators = indicators.length > 0 
    ? indicators.filter(i => i.timeframe === currentTimeframe) 
    : [];
  
  // Group indicators by type for display
  const indicatorGroups = [
    { name: 'Moving Averages', indicators: filteredIndicators.filter(i => i.name.includes('MA')) },
    { name: 'Oscillators', indicators: filteredIndicators.filter(i => i.name.includes('RSI') || i.name.includes('Stoch')) },
    { name: 'Momentum', indicators: filteredIndicators.filter(i => i.name.includes('MACD')) },
    { name: 'Volatility', indicators: filteredIndicators.filter(i => i.name.includes('BB')) },
    { name: 'Volume', indicators: filteredIndicators.filter(i => i.name.includes('Volume') || i.name.includes('VWAP')) }
  ];
  
  // Get signal badge style
  const getSignalBadge = (signal: 'bullish' | 'bearish' | 'neutral') => {
    switch(signal) {
      case 'bullish':
        return <Badge className="bg-green-500 text-white">Bullish</Badge>;
      case 'bearish':
        return <Badge className="bg-red-500 text-white">Bearish</Badge>;
      case 'neutral':
        return <Badge variant="outline">Neutral</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Indicator Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {indicators.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No indicators available</p>
            <p className="text-xs mt-2">Generate analysis to see indicators</p>
          </div>
        ) : (
          <div className="space-y-5">
            {indicatorGroups.map((group, idx) => (
              group.indicators.length > 0 && (
                <div key={idx} className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">{group.name}</h3>
                  <div className="space-y-2">
                    {group.indicators.map((indicator, idx) => (
                      <div 
                        key={idx}
                        className="flex justify-between items-center p-2 rounded bg-muted/30"
                      >
                        <div>
                          <span className="text-sm font-medium">{indicator.name}</span>
                          <p className="text-xs text-muted-foreground">{indicator.timeframe}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono ${
                            indicator.signal === 'bullish' ? 'text-green-500' :
                            indicator.signal === 'bearish' ? 'text-red-500' :
                            'text-yellow-500'
                          }`}>
                            {indicator.value.toString()}
                          </span>
                          {getSignalBadge(indicator.signal)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
