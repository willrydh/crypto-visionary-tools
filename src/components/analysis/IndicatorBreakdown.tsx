
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ChevronDown,
  Lightbulb,
  AlertTriangle,
  Eye,
  CheckCircle2,
  XCircle,
  CircleEqual
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';

interface IndicatorBreakdownProps {
  indicators: TechnicalIndicator[];
}

export const IndicatorBreakdown: React.FC<IndicatorBreakdownProps> = ({ indicators }) => {
  const { currentTimeframe } = useTimeframe();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [overallSentiment, setOverallSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
  const [viewMode, setViewMode] = useState<'chart' | 'detail'>('chart');
  const [animatedPercentages, setAnimatedPercentages] = useState({ bullish: 0, bearish: 0, neutral: 0 });
  
  // Filter indicators by current timeframe if available
  const filteredIndicators = useMemo(() => {
    return indicators.length > 0 
      ? indicators.filter(i => i.timeframe === currentTimeframe) 
      : [];
  }, [indicators, currentTimeframe]);
  
  // Group indicators by type for display with icons
  const indicatorGroups = useMemo(() => [
    { 
      name: 'Moving Averages', 
      key: 'trend',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Trend following indicators that smooth price data to identify overall direction',
      indicators: filteredIndicators.filter(i => 
        i.category === 'trend' || 
        i.name.includes('MA') || 
        i.name.includes('Moving Average')
      ) 
    },
    { 
      name: 'Oscillators', 
      key: 'momentum',
      icon: <Activity className="h-4 w-4" />,
      description: 'Measures momentum and shows overbought/oversold conditions',
      indicators: filteredIndicators.filter(i => 
        i.category === 'momentum' || 
        i.name.includes('RSI') || 
        i.name.includes('Stoch')
      ) 
    },
    { 
      name: 'Volume', 
      key: 'volume',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Volume-based indicators showing buying/selling pressure',
      indicators: filteredIndicators.filter(i => 
        i.category === 'volume' || 
        i.name.includes('Volume') || 
        i.name.includes('VWAP')
      ) 
    },
    { 
      name: 'Volatility', 
      key: 'volatility',
      icon: <Waves className="h-4 w-4" />,
      description: 'Measures market volatility and potential price ranges',
      indicators: filteredIndicators.filter(i => 
        i.category === 'volatility' || 
        i.name.includes('BB') || 
        i.name.includes('ATR')
      ) 
    }
  ], [filteredIndicators]);

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
        return 'from-green-950/30 via-green-900/20 to-green-900/5';
      case 'bearish':
        return 'from-red-950/30 via-red-900/20 to-red-900/5';
      default:
        return 'from-blue-950/20 via-blue-900/10 to-blue-900/5';
    }
  };
  
  // Get signal badge style
  const getSignalBadge = (signal: 'bullish' | 'bearish' | 'neutral') => {
    switch(signal) {
      case 'bullish':
        return (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Badge 
              className="flex items-center gap-1 bg-green-500/90 hover:bg-green-500 transition-colors text-white"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Bullish</span>
            </Badge>
          </motion.div>
        );
      case 'bearish':
        return (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Badge 
              className="flex items-center gap-1 bg-red-500/90 hover:bg-red-500 transition-colors text-white"
            >
              <XCircle className="h-3 w-3" />
              <span>Bearish</span>
            </Badge>
          </motion.div>
        );
      case 'neutral':
        return (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 hover:bg-muted/50 transition-colors"
            >
              <CircleEqual className="h-3 w-3" />
              <span>Neutral</span>
            </Badge>
          </motion.div>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Get indicator strength visualization
  const getStrengthIndicator = (signal: 'bullish' | 'bearish' | 'neutral', value: number | string) => {
    // Convert value to numeric if it's a string percentage
    let numericValue = typeof value === 'string' && value.includes('%')
      ? parseFloat(value.replace('%', '')) 
      : typeof value === 'number' ? value : null;
    
    // Handle text values
    if (numericValue === null) {
      const textValue = String(value).toLowerCase();
      
      if (textValue.includes('strong') || textValue === 'above' || textValue === 'positive' || textValue === 'increasing') {
        numericValue = 80;
      } else if (textValue === 'below' || textValue === 'negative' || textValue === 'decreasing') {
        numericValue = 20;
      } else if (textValue.includes('weak') || textValue === 'crossing' || textValue === 'average') {
        numericValue = 50;
      } else {
        // Default values based on signal
        numericValue = signal === 'bullish' ? 70 : signal === 'bearish' ? 30 : 50;
      }
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

    const getTrackColor = () => {
      switch(signal) {
        case 'bullish': return 'bg-green-900/20';
        case 'bearish': return 'bg-red-900/20';
        default: return 'bg-yellow-900/20';
      }
    };
    
    return (
      <div className={`w-full ${getTrackColor()} rounded-full h-2 overflow-hidden`}>
        <motion.div 
          className={`${getBarColor()} h-full rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${strengthPercent}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
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
  
  // Animate percentages for visual effect
  useEffect(() => {
    // Animate the percentages
    const timer = setTimeout(() => {
      setAnimatedPercentages(donutPercentages);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [donutPercentages]);
  
  // Get insights based on indicator analysis
  const getInsights = () => {
    const bullishCount = getBullishCount();
    const bearishCount = getBearishCount();
    const neutralCount = getNeutralCount();
    const totalCount = filteredIndicators.length;
    
    if (totalCount === 0) return [];
    
    const insights: { text: string; type: 'info' | 'warning' | 'success' }[] = [];
    
    // Trend and momentum alignment
    const trendIndicators = filteredIndicators.filter(i => 
      i.category === 'trend' || i.name.includes('MA') || i.name.includes('Moving')
    );
    const momentumIndicators = filteredIndicators.filter(i => 
      i.category === 'momentum' || i.name.includes('RSI') || i.name.includes('MACD')
    );
    
    const bullishTrend = trendIndicators.filter(i => i.signal === 'bullish').length;
    const bearishTrend = trendIndicators.filter(i => i.signal === 'bearish').length;
    const bullishMomentum = momentumIndicators.filter(i => i.signal === 'bullish').length;
    const bearishMomentum = momentumIndicators.filter(i => i.signal === 'bearish').length;
    
    // Check trend and momentum alignment
    if (trendIndicators.length > 0 && momentumIndicators.length > 0) {
      const trendDirection = bullishTrend > bearishTrend ? 'bullish' : 'bearish';
      const momentumDirection = bullishMomentum > bearishMomentum ? 'bullish' : 'bearish';
      
      if (trendDirection === momentumDirection) {
        insights.push({
          text: `Trend and momentum indicators are aligned (${trendDirection}), suggesting strong directional movement.`,
          type: 'success'
        });
      } else {
        insights.push({
          text: `Trend indicators show ${trendDirection} bias while momentum shows ${momentumDirection} bias, indicating possible trend reversal or consolidation.`,
          type: 'warning'
        });
      }
    }
    
    // Check for overwhelming consensus
    if (bullishCount > totalCount * 0.8) {
      insights.push({
        text: `Strong bullish consensus (${Math.round(bullishCount/totalCount*100)}% of indicators). Consider potential overbought conditions.`,
        type: 'info'
      });
    } else if (bearishCount > totalCount * 0.8) {
      insights.push({
        text: `Strong bearish consensus (${Math.round(bearishCount/totalCount*100)}% of indicators). Consider potential oversold conditions.`,
        type: 'info'
      });
    }
    
    // Check for mixed signals
    if (neutralCount > totalCount * 0.4) {
      insights.push({
        text: `High number of neutral indicators (${neutralCount}/${totalCount}), suggesting consolidation or indecision in the market.`,
        type: 'warning'
      });
    }
    
    return insights;
  };
  
  // Get insight icon based on type
  const getInsightIcon = (type: 'info' | 'warning' | 'success') => {
    switch(type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <Lightbulb className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  // Create animated donut chart
  const renderDonutChart = () => {
    // Calculate the stroke-dasharray values for the SVG
    const circumference = 2 * Math.PI * 40; // radius = 40
    
    return (
      <div className="flex justify-center my-4">
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle 
              cx="60" cy="60" r="48" 
              fill="transparent" 
              stroke="#374151" 
              strokeWidth="12" 
              strokeLinecap="round"
            />
            
            {/* Bullish segment - green */}
            <motion.circle 
              cx="60" cy="60" r="48" 
              fill="transparent" 
              stroke="#10b981" 
              strokeWidth="12" 
              strokeLinecap="round"
              strokeDasharray={circumference} 
              strokeDashoffset={circumference * (1 - animatedPercentages.bullish / 100)}
              transform="rotate(-90 60 60)" 
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference * (1 - animatedPercentages.bullish / 100) }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            
            {/* Bearish segment - red */}
            <motion.circle 
              cx="60" cy="60" r="48" 
              fill="transparent" 
              stroke="#ef4444" 
              strokeWidth="12" 
              strokeLinecap="round"
              strokeDasharray={circumference} 
              strokeDashoffset={circumference * (1 - animatedPercentages.bearish / 100)}
              transform={`rotate(${(animatedPercentages.bullish / 100) * 360 - 90} 60 60)`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference * (1 - animatedPercentages.bearish / 100) }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            />
            
            {/* Neutral segment - yellow */}
            <motion.circle 
              cx="60" cy="60" r="48" 
              fill="transparent" 
              stroke="#f59e0b" 
              strokeWidth="12" 
              strokeLinecap="round"
              strokeDasharray={circumference} 
              strokeDashoffset={circumference * (1 - animatedPercentages.neutral / 100)}
              transform={`rotate(${((animatedPercentages.bullish + animatedPercentages.bearish) / 100) * 360 - 90} 60 60)`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference * (1 - animatedPercentages.neutral / 100) }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
            />
            
            {/* Center circle */}
            <circle 
              cx="60" cy="60" r="36" 
              fill="#111827" 
            />
          </svg>
          
          {/* Center text with count */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <span className="text-lg font-semibold">{filteredIndicators.length}</span>
            <span className="text-xs text-muted-foreground">indicators</span>
          </motion.div>
        </div>
      </div>
    );
  };
  
  // Render the indicator detail view
  const renderDetailView = () => {
    return (
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
                <motion.div 
                  className="flex items-center justify-between p-3 cursor-pointer"
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
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
                </motion.div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="space-y-2 p-3 pt-0">
                  {group.indicators.map((indicator, idxInner) => (
                    <motion.div 
                      key={idxInner}
                      className="flex flex-col p-2 rounded bg-muted/20 hover:bg-muted/30 transition-colors border border-border/20"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idxInner * 0.1, duration: 0.2 }}
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
                          {getStrengthIndicator(indicator.signal, indicator.value)}
                        </div>
                      </div>
                      
                      {indicator.description && (
                        <div className="mt-1.5">
                          <p className="text-xs text-muted-foreground">{indicator.description}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        ))}
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
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-muted/20 rounded-lg p-1 flex">
                <Button 
                  variant={viewMode === 'chart' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setViewMode('chart')}
                  className="text-xs"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Overview
                </Button>
                <Button 
                  variant={viewMode === 'detail' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setViewMode('detail')}
                  className="text-xs"
                >
                  <BarChart3 className="h-3.5 w-3.5 mr-1" />
                  Details
                </Button>
              </div>
            </div>
            
            {viewMode === 'chart' ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {/* Chart View */}
                {renderDonutChart()}
                
                {/* Signal distribution */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <motion.div 
                    className="bg-black/20 rounded-md p-2 border border-green-500/30"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <span className="text-green-500 text-sm font-medium">{getBullishCount()}</span>
                    <p className="text-xs text-muted-foreground">Bullish</p>
                  </motion.div>
                  <motion.div 
                    className="bg-black/20 rounded-md p-2 border border-yellow-500/30"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <span className="text-yellow-500 text-sm font-medium">{getNeutralCount()}</span>
                    <p className="text-xs text-muted-foreground">Neutral</p>
                  </motion.div>
                  <motion.div 
                    className="bg-black/20 rounded-md p-2 border border-red-500/30"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <span className="text-red-500 text-sm font-medium">{getBearishCount()}</span>
                    <p className="text-xs text-muted-foreground">Bearish</p>
                  </motion.div>
                </div>
                
                {/* AI Insights */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4 text-blue-400" />
                    AI Insights
                  </h3>
                  
                  <div className="space-y-2">
                    {getInsights().length > 0 ? (
                      getInsights().map((insight, idx) => (
                        <motion.div 
                          key={idx}
                          className="flex gap-2 p-2 bg-black/20 rounded border border-border/30 text-sm"
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1, duration: 0.3 }}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {getInsightIcon(insight.type)}
                          </div>
                          <p className="text-xs">{insight.text}</p>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Not enough data to generate insights.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {/* Detail View */}
                {renderDetailView()}
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
