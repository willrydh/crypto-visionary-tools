
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTimeframe } from '@/hooks/useTimeframe';
import { TechnicalIndicator } from '@/contexts/TechnicalAnalysisContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Waves, 
  BarChart3, 
  Info, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface IndicatorBreakdownProps {
  indicators: TechnicalIndicator[];
}

export const IndicatorBreakdown: React.FC<IndicatorBreakdownProps> = ({ indicators }) => {
  const { currentTimeframe } = useTimeframe();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [overallSentiment, setOverallSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
  
  // Filter indicators by current timeframe if available
  const filteredIndicators = indicators.length > 0 
    ? indicators.filter(i => i.timeframe === currentTimeframe) 
    : [];
  
  // Group indicators by type for display with icons
  const indicatorGroups = [
    { 
      name: 'Moving Averages', 
      key: 'ma',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Trend following indicators that smooth price data',
      indicators: filteredIndicators.filter(i => i.name.includes('MA')) 
    },
    { 
      name: 'Oscillators', 
      key: 'osc',
      icon: <Waves className="h-4 w-4" />,
      description: 'Indicators that fluctuate between overbought and oversold levels',
      indicators: filteredIndicators.filter(i => i.name.includes('RSI') || i.name.includes('Stoch')) 
    },
    { 
      name: 'Momentum', 
      key: 'mom',
      icon: <Activity className="h-4 w-4" />,
      description: 'Measures the rate of price change over time',
      indicators: filteredIndicators.filter(i => i.name.includes('MACD')) 
    },
    { 
      name: 'Volatility', 
      key: 'vol',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Measures the magnitude of price fluctuations',
      indicators: filteredIndicators.filter(i => i.name.includes('BB')) 
    },
    { 
      name: 'Volume', 
      key: 'volume',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Trade volume-based indicators',
      indicators: filteredIndicators.filter(i => i.name.includes('Volume') || i.name.includes('VWAP')) 
    }
  ];

  // Toggle expanded state for a group
  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Calculate overall sentiment
  useEffect(() => {
    if (filteredIndicators.length === 0) {
      setOverallSentiment('neutral');
      return;
    }
    
    const bullishCount = filteredIndicators.filter(i => i.signal === 'bullish').length;
    const bearishCount = filteredIndicators.filter(i => i.signal === 'bearish').length;
    const totalCount = filteredIndicators.length;
    
    const bullishPercentage = (bullishCount / totalCount) * 100;
    const bearishPercentage = (bearishCount / totalCount) * 100;
    
    if (bullishPercentage >= 60) {
      setOverallSentiment('bullish');
    } else if (bearishPercentage >= 60) {
      setOverallSentiment('bearish');
    } else {
      setOverallSentiment('neutral');
    }
  }, [filteredIndicators]);
  
  // Get background gradient based on sentiment
  const getBackgroundGradient = () => {
    switch (overallSentiment) {
      case 'bullish':
        return 'from-green-950/30 to-green-900/10';
      case 'bearish':
        return 'from-red-950/30 to-red-900/10';
      default:
        return 'from-blue-950/20 to-blue-900/5';
    }
  };
  
  // Get signal badge style
  const getSignalBadge = (signal: 'bullish' | 'bearish' | 'neutral') => {
    switch(signal) {
      case 'bullish':
        return (
          <Badge 
            className="flex items-center gap-1 bg-green-500/90 hover:bg-green-500 transition-colors text-white"
          >
            <TrendingUp className="h-3 w-3" />
            <span>Bullish</span>
          </Badge>
        );
      case 'bearish':
        return (
          <Badge 
            className="flex items-center gap-1 bg-red-500/90 hover:bg-red-500 transition-colors text-white"
          >
            <TrendingDown className="h-3 w-3" />
            <span>Bearish</span>
          </Badge>
        );
      case 'neutral':
        return (
          <Badge 
            variant="outline" 
            className="flex items-center gap-1 hover:bg-muted/50 transition-colors"
          >
            <span>Neutral</span>
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Get indicator strength visualization
  const getStrengthIndicator = (signal: 'bullish' | 'bearish' | 'neutral', value: number | string) => {
    // Convert value to numeric if it's a string percentage
    let numericValue = typeof value === 'string' 
      ? parseFloat(value.replace('%', '')) 
      : value;
    
    // If we can't parse it or it's outside reasonable range, use default values
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
      numericValue = signal === 'bullish' ? 70 : signal === 'bearish' ? 30 : 50;
    }
    
    // Normalize to 0-100 range
    const strengthPercent = Math.min(Math.max(numericValue, 0), 100);
    
    const getBarColor = () => {
      switch(signal) {
        case 'bullish': return 'bg-green-500';
        case 'bearish': return 'bg-red-500';
        default: return 'bg-yellow-500';
      }
    };
    
    return (
      <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`${getBarColor()} h-full rounded-full transition-all duration-500`}
          style={{ width: `${strengthPercent}%` }}
        />
      </div>
    );
  };
  
  // Count indicators by signal
  const getBullishCount = () => filteredIndicators.filter(i => i.signal === 'bullish').length;
  const getBearishCount = () => filteredIndicators.filter(i => i.signal === 'bearish').length;
  const getNeutralCount = () => filteredIndicators.filter(i => i.signal === 'neutral').length;
  
  // Calculate percentages for the donut chart
  const calculateDonutPercentages = () => {
    const total = filteredIndicators.length;
    if (total === 0) return { bullish: 0, bearish: 0, neutral: 0 };
    
    return {
      bullish: (getBullishCount() / total) * 100,
      bearish: (getBearishCount() / total) * 100,
      neutral: (getNeutralCount() / total) * 100
    };
  };
  
  const donutPercentages = calculateDonutPercentages();
  
  // Render the donut chart
  const renderDonutChart = () => {
    // Calculate the stroke-dasharray values for the SVG
    const circumference = 2 * Math.PI * 40; // radius = 40
    const bullishOffset = (donutPercentages.bullish / 100) * circumference;
    const bearishOffset = (donutPercentages.bearish / 100) * circumference;
    const neutralOffset = (donutPercentages.neutral / 100) * circumference;
    
    // Calculate stroke-dashoffset values
    const bullishDashOffset = 0;
    const bearishDashOffset = circumference - bullishOffset;
    const neutralDashOffset = circumference - bullishOffset - bearishOffset;
    
    return (
      <div className="flex justify-center my-4">
        <div className="relative">
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle 
              cx="50" cy="50" r="40" 
              fill="transparent" 
              stroke="#374151" 
              strokeWidth="10" 
            />
            
            {/* Bullish segment */}
            <circle 
              cx="50" cy="50" r="40" 
              fill="transparent" 
              stroke="#10b981" 
              strokeWidth="10" 
              strokeDasharray={circumference} 
              strokeDashoffset={circumference - bullishOffset}
              transform="rotate(-90 50 50)" 
              className="transition-all duration-700 ease-out"
            />
            
            {/* Bearish segment */}
            <circle 
              cx="50" cy="50" r="40" 
              fill="transparent" 
              stroke="#ef4444" 
              strokeWidth="10" 
              strokeDasharray={circumference} 
              strokeDashoffset={circumference - bearishOffset}
              transform={`rotate(${(donutPercentages.bullish / 100) * 360 - 90} 50 50)`}
              className="transition-all duration-700 ease-out" 
            />
            
            {/* Neutral segment */}
            <circle 
              cx="50" cy="50" r="40" 
              fill="transparent" 
              stroke="#f59e0b" 
              strokeWidth="10" 
              strokeDasharray={circumference} 
              strokeDashoffset={circumference - neutralOffset}
              transform={`rotate(${((donutPercentages.bullish + donutPercentages.bearish) / 100) * 360 - 90} 50 50)`}
              className="transition-all duration-700 ease-out" 
            />
            
            {/* Center circle */}
            <circle 
              cx="50" cy="50" r="30" 
              fill="#111827" 
            />
          </svg>
          
          {/* Center text with count */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-medium">{filteredIndicators.length}</span>
            <span className="text-xs text-muted-foreground">signals</span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className={`bg-gradient-to-b ${getBackgroundGradient()} border-border/40 transition-colors duration-700`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Indicator Breakdown</span>
          <Badge className={cn(
            "transition-colors duration-300",
            overallSentiment === 'bullish' && "bg-green-500",
            overallSentiment === 'bearish' && "bg-red-500",
            overallSentiment === 'neutral' && "bg-blue-500"
          )}>
            {overallSentiment.charAt(0).toUpperCase() + overallSentiment.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {indicators.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No indicators available</p>
            <p className="text-xs mt-2">Generate analysis to see indicators</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Donut Chart */}
            {renderDonutChart()}
            
            {/* Signal distribution */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-black/20 rounded-md p-2 border border-green-500/30">
                <span className="text-green-500 text-sm font-medium">{getBullishCount()}</span>
                <p className="text-xs text-muted-foreground">Bullish</p>
              </div>
              <div className="bg-black/20 rounded-md p-2 border border-yellow-500/30">
                <span className="text-yellow-500 text-sm font-medium">{getNeutralCount()}</span>
                <p className="text-xs text-muted-foreground">Neutral</p>
              </div>
              <div className="bg-black/20 rounded-md p-2 border border-red-500/30">
                <span className="text-red-500 text-sm font-medium">{getBearishCount()}</span>
                <p className="text-xs text-muted-foreground">Bearish</p>
              </div>
            </div>
            
            {/* Indicator Groups */}
            <div className="space-y-3">
              {indicatorGroups.map((group, idx) => (
                group.indicators.length > 0 && (
                  <Collapsible 
                    key={idx} 
                    open={expandedGroups[group.key]} 
                    onOpenChange={() => toggleGroup(group.key)}
                    className={`rounded-md border border-border/40 overflow-hidden transition-all duration-300
                               ${expandedGroups[group.key] ? 'bg-black/20' : 'bg-black/10 hover:bg-black/15'}`}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-3 cursor-pointer">
                        <div className="flex items-center gap-2">
                          {group.icon}
                          <h3 className="text-sm font-medium">{group.name}</h3>
                          <Badge variant="outline" className="ml-2">
                            {group.indicators.length}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-1 rounded-full hover:bg-muted/20">
                                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p className="text-xs max-w-[200px]">{group.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          {expandedGroups[group.key] ? (
                            <ChevronUp className="h-4 w-4 ml-2" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-2" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="space-y-2 p-3 pt-0">
                        {group.indicators.map((indicator, idxInner) => (
                          <div 
                            key={idxInner}
                            className="flex flex-col p-2 rounded bg-muted/20 hover:bg-muted/30 transition-colors border border-border/20"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-sm font-medium">{indicator.name}</span>
                                <p className="text-xs text-muted-foreground">{indicator.timeframe}</p>
                              </div>
                              <div>
                                {getSignalBadge(indicator.signal)}
                              </div>
                            </div>
                            
                            <div className="mt-2 flex items-center gap-2">
                              <span className={`font-mono text-xs ${
                                indicator.signal === 'bullish' ? 'text-green-500' :
                                indicator.signal === 'bearish' ? 'text-red-500' :
                                'text-yellow-500'
                              }`}>
                                {indicator.value.toString()}
                              </span>
                              <div className="flex-grow">
                                {getStrengthIndicator(indicator.signal, typeof indicator.value === 'number' ? indicator.value : 50)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
