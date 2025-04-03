
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from 'framer-motion';
import { TechnicalIndicator } from '@/contexts/TechnicalAnalysisContext';
import { useTimeframe } from '@/hooks/useTimeframe';
import { cn } from '@/lib/utils';
import MarketDataTooltip from '../ui/market-data-tooltip';

import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Waves, 
  BarChart3, 
  BarChart4, 
  Info, 
  ChevronUp, 
  ChevronDown,
  Lightbulb,
  AlertTriangle,
  Eye,
  CheckCircle2,
  XCircle,
  CircleEqual,
  Gauge,
  LineChart,
  ArrowUpDown,
  Calendar,
  Volume2,
  Percent,
  LayoutGrid
} from 'lucide-react';

// Key indicator explanations
const INDICATOR_EXPLANATIONS = {
  'RSI': 'Relative Strength Index measures momentum on a scale of 0-100. Values above 70 indicate overbought conditions, while values below 30 indicate oversold conditions.',
  'MACD': 'Moving Average Convergence Divergence shows the relationship between two moving averages. Signal line crossovers and histogram changes indicate momentum shifts.',
  'Volume': 'Trading volume confirms price movements. Rising prices with rising volume indicates strong bullish momentum, while falling prices with rising volume shows strong bearish momentum.',
  'Volatility': 'Measures the rate and magnitude of price changes. Higher volatility indicates greater price uncertainty and potential for large moves.',
  'Stochastic RSI': 'Combines Stochastic oscillator with RSI to identify overbought and oversold conditions with higher sensitivity than standard RSI.',
  'MA50': '50-period Moving Average smooths price data to identify medium-term trends. Price above MA50 is bullish, below is bearish.',
  'MA100': '100-period Moving Average identifies intermediate-term trends. Crossing above/below can signal trend changes.',
  'MA200': '200-period Moving Average is a key long-term trend indicator. Trading above MA200 indicates a bull market, below indicates a bear market.',
  'EMA21': '21-period Exponential Moving Average responds quickly to recent price changes, making it useful for shorter timeframes. Often used by day traders.'
};

// Pattern detection explanations
const PATTERN_EXPLANATIONS = {
  'Moving Average Crossover': 'When a faster MA crosses above a slower MA, it signals potential upward momentum. Conversely, crossing below signals potential downward momentum.',
  'RSI Divergence': "When price makes new highs/lows but RSI doesn't confirm, it suggests the trend may be weakening and could reverse.",
  'Volume Confirmation': 'Strong price moves should be accompanied by strong volume. Lack of volume on a price move suggests it may not be sustainable.',
  'MACD Histogram Divergence': "When price makes new highs/lows but MACD histogram doesn't confirm, it suggests momentum is weakening and a reversal may occur.",
  'Oversold Bounce': 'When multiple indicators show deeply oversold conditions, prices often bounce up temporarily, even in downtrends.',
  'Overbought Pullback': 'When multiple indicators show deeply overbought conditions, prices often pull back temporarily, even in uptrends.',
  'Trend Confirmation': 'When multiple indicators align (trend, momentum, volume), the current trend is strong and likely to continue.'
};

interface IndicatorBreakdownProps {
  indicators: TechnicalIndicator[];
}

export const IndicatorBreakdown: React.FC<IndicatorBreakdownProps> = ({ indicators }) => {
  const { currentTimeframe } = useTimeframe();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'trend': true,
    'momentum': false,
    'volume': false,
    'volatility': false
  });
  const [overallSentiment, setOverallSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
  const [animatedPercentages, setAnimatedPercentages] = useState({ bullish: 0, bearish: 0, neutral: 0 });
  
  // Filter indicators by current timeframe if available
  const filteredIndicators = useMemo(() => {
    if (!indicators.length) return [];
    return currentTimeframe 
      ? indicators.filter(i => i.timeframe === currentTimeframe)
      : indicators;
  }, [indicators, currentTimeframe]);
  
  // Group indicators by type for display with icons
  const indicatorGroups = useMemo(() => [
    { 
      name: 'Trend Indicators', 
      key: 'trend',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'These indicators help identify the direction of the market trend',
      indicators: filteredIndicators.filter(i => 
        i.category === 'trend' || 
        i.name.includes('MA') || 
        i.name.includes('Moving Average') ||
        i.name.includes('EMA')
      ) 
    },
    { 
      name: 'Momentum Indicators', 
      key: 'momentum',
      icon: <Activity className="h-4 w-4" />,
      description: 'These measure the speed or strength of price movements to identify potential reversals',
      indicators: filteredIndicators.filter(i => 
        i.category === 'momentum' || 
        i.name.includes('RSI') || 
        i.name.includes('MACD') ||
        i.name.includes('Stoch')
      ) 
    },
    { 
      name: 'Volume Indicators', 
      key: 'volume',
      icon: <Volume2 className="h-4 w-4" />,
      description: 'These analyze trading volume to confirm price movements and identify potential reversals',
      indicators: filteredIndicators.filter(i => 
        i.category === 'volume' || 
        i.name.includes('Volume') || 
        i.name.includes('OBV')
      ) 
    },
    { 
      name: 'Volatility Indicators', 
      key: 'volatility',
      icon: <Waves className="h-4 w-4" />,
      description: 'These measure market volatility to identify potential breakouts or periods of consolidation',
      indicators: filteredIndicators.filter(i => 
        i.category === 'volatility' || 
        i.name.includes('ATR') || 
        i.name.includes('Bollinger')
      ) 
    }
  ], [filteredIndicators]);

  // Enhanced indicators for detail view
  const enhancedIndicators = useMemo(() => {
    // Generate comprehensive set of key indicators (even if mock data)
    return [
      {
        name: 'RSI (14)',
        value: filteredIndicators.find(i => i.name.includes('RSI') && !i.name.includes('Stoch'))?.value || 58,
        signal: filteredIndicators.find(i => i.name.includes('RSI') && !i.name.includes('Stoch'))?.signal || 'neutral',
        category: 'momentum',
        timeframe: currentTimeframe || '1h',
        description: 'Measures price momentum. Current reading indicates moderate bullish momentum.',
        interpretation: 'RSI is in neutral territory, neither overbought nor oversold. This suggests the current trend may continue.',
        icon: <Gauge className="h-4 w-4" />
      },
      {
        name: 'MACD',
        value: filteredIndicators.find(i => i.name.includes('MACD'))?.value || 'Bullish crossover',
        signal: filteredIndicators.find(i => i.name.includes('MACD'))?.signal || 'bullish',
        category: 'momentum',
        timeframe: currentTimeframe || '1h',
        description: 'Shows momentum and trend direction. MACD line crossed above signal line, indicating bullish momentum.',
        interpretation: 'Recent bullish crossover suggests increasing upward momentum. Look for volume confirmation.',
        icon: <LineChart className="h-4 w-4" />
      },
      {
        name: 'Volume',
        value: filteredIndicators.find(i => i.name.includes('Volume') && !i.name.includes('On-Balance'))?.value || 'Above average',
        signal: filteredIndicators.find(i => i.name.includes('Volume') && !i.name.includes('On-Balance'))?.signal || 'bullish',
        category: 'volume',
        timeframe: currentTimeframe || '1h',
        description: 'Current volume is above the 20-period average, confirming recent price movements.',
        interpretation: 'Higher volume on up moves indicates strong buying pressure and validates the current uptrend.',
        icon: <Volume2 className="h-4 w-4" />
      },
      {
        name: 'Volatility %',
        value: '4.2%',
        signal: 'neutral',
        category: 'volatility',
        timeframe: currentTimeframe || '1h',
        description: 'Measures price fluctuation as a percentage of current price over recent periods.',
        interpretation: 'Current volatility is moderate, suggesting normal trading conditions without extreme fear or greed.',
        icon: <Percent className="h-4 w-4" />
      },
      {
        name: 'Stochastic RSI',
        value: filteredIndicators.find(i => i.name.includes('Stoch'))?.value || 82,
        signal: filteredIndicators.find(i => i.name.includes('Stoch'))?.signal || 'bearish',
        category: 'momentum',
        timeframe: currentTimeframe || '1h',
        description: 'Oscillator that identifies overbought and oversold conditions with high sensitivity.',
        interpretation: 'Currently in overbought territory, suggesting a potential short-term pullback or consolidation.',
        icon: <ArrowUpDown className="h-4 w-4" />
      },
      {
        name: 'MA50',
        value: filteredIndicators.find(i => i.name.includes('Moving Average (50)'))?.value || 'Above',
        signal: filteredIndicators.find(i => i.name.includes('Moving Average (50)'))?.signal || 'bullish',
        category: 'trend',
        timeframe: currentTimeframe || '1h',
        description: '50-period moving average, a medium-term trend indicator.',
        interpretation: 'Price above MA50 confirms bullish bias in the medium-term timeframe.',
        icon: <TrendingUp className="h-4 w-4" />
      },
      {
        name: 'MA100',
        value: 'Above',
        signal: 'bullish',
        category: 'trend',
        timeframe: currentTimeframe || '1h',
        description: '100-period moving average, an intermediate-term trend indicator.',
        interpretation: 'Price above MA100 confirms bullish bias in the intermediate timeframe.',
        icon: <TrendingUp className="h-4 w-4" />
      },
      {
        name: 'MA200',
        value: filteredIndicators.find(i => i.name.includes('Moving Average (200)'))?.value || 'Above',
        signal: filteredIndicators.find(i => i.name.includes('Moving Average (200)'))?.signal || 'bullish',
        category: 'trend',
        timeframe: currentTimeframe || '1h',
        description: '200-period moving average, a key long-term trend indicator.',
        interpretation: 'Price above MA200 indicates we are in a bull market on this timeframe.',
        icon: <TrendingUp className="h-4 w-4" />
      },
      {
        name: 'EMA21',
        value: 'Above',
        signal: 'bullish',
        category: 'trend',
        timeframe: currentTimeframe || '1h',
        description: '21-period exponential moving average, responds quickly to price changes.',
        interpretation: 'Price above EMA21 suggests strong short-term upward momentum.',
        icon: <TrendingUp className="h-4 w-4" />
      }
    ];
  }, [filteredIndicators, currentTimeframe]);

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
  
  // Detect patterns based on indicators
  const detectPatterns = () => {
    const patterns = [];
    
    // Check for moving average crossovers
    const ma50 = enhancedIndicators.find(i => i.name === 'MA50');
    const ma200 = enhancedIndicators.find(i => i.name === 'MA200');
    const ema21 = enhancedIndicators.find(i => i.name === 'EMA21');
    
    if (ma50?.signal === 'bullish' && ma200?.signal === 'bullish' && ema21?.signal === 'bullish') {
      patterns.push({
        name: 'Strong Uptrend', 
        explanation: 'Price above all major moving averages (EMA21, MA50, MA200) indicates a strong uptrend across multiple timeframes.',
        type: 'success'
      });
    }
    
    // Check for RSI conditions
    const rsi = enhancedIndicators.find(i => i.name.includes('RSI') && !i.name.includes('Stoch'));
    const stochRsi = enhancedIndicators.find(i => i.name.includes('Stoch'));
    
    if (rsi && stochRsi) {
      const rsiValue = typeof rsi.value === 'number' ? rsi.value : 50;
      const stochValue = typeof stochRsi.value === 'number' ? stochRsi.value : 50;
      
      if (rsiValue > 70 && stochValue > 80) {
        patterns.push({
          name: 'Overbought Condition',
          explanation: 'Both RSI and Stochastic RSI are indicating overbought conditions. Watch for potential reversion or price pullback.',
          type: 'warning'
        });
      } else if (rsiValue < 30 && stochValue < 20) {
        patterns.push({
          name: 'Oversold Condition',
          explanation: 'Both RSI and Stochastic RSI are indicating oversold conditions. Watch for potential bounce or trend reversal.',
          type: 'warning'
        });
      }
    }
    
    // Check for MACD and volume confirmation
    const macd = enhancedIndicators.find(i => i.name === 'MACD');
    const volume = enhancedIndicators.find(i => i.name === 'Volume');
    
    if (macd?.signal === 'bullish' && volume?.signal === 'bullish') {
      patterns.push({
        name: 'Bullish Momentum with Volume Confirmation',
        explanation: 'MACD shows bullish momentum that is confirmed by increasing volume, suggesting a strong and sustainable move higher.',
        type: 'success'
      });
    } else if (macd?.signal === 'bearish' && volume?.signal === 'bearish') {
      patterns.push({
        name: 'Bearish Momentum with Volume Confirmation',
        explanation: 'MACD shows bearish momentum that is confirmed by increasing volume, suggesting a strong and sustainable move lower.',
        type: 'warning'
      });
    }
    
    // Check for trend/momentum divergence
    const trendSignal = ma50?.signal || 'neutral';
    const momentumSignal = rsi?.signal || 'neutral';
    
    if (trendSignal === 'bullish' && momentumSignal === 'bearish') {
      patterns.push({
        name: 'Bearish Divergence',
        explanation: 'Price is in an uptrend but momentum is weakening, suggesting a potential reversal or consolidation ahead.',
        type: 'warning'
      });
    } else if (trendSignal === 'bearish' && momentumSignal === 'bullish') {
      patterns.push({
        name: 'Bullish Divergence',
        explanation: 'Price is in a downtrend but momentum is strengthening, suggesting a potential reversal or bounce ahead.',
        type: 'info'
      });
    }
    
    return patterns;
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
  
  // Summary of all indicators and what they mean
  const generateSummary = () => {
    const bullishCount = getBullishCount();
    const bearishCount = getBearishCount();
    const neutralCount = getNeutralCount();
    const totalCount = filteredIndicators.length;
    
    if (totalCount === 0) {
      return "No indicators available to generate a summary. Please generate analysis first.";
    }
    
    const bullishPercentage = Math.round((bullishCount / totalCount) * 100);
    const bearishPercentage = Math.round((bearishCount / totalCount) * 100);
    
    // Get strength words based on percentage
    const getStrengthWord = (percentage: number) => {
      if (percentage >= 80) return "very strong";
      if (percentage >= 65) return "strong";
      if (percentage >= 55) return "moderate";
      return "weak";
    };
    
    // Build the summary based on the sentiment
    if (bullishPercentage >= 60) {
      return `Technical indicators are showing a ${getStrengthWord(bullishPercentage)} bullish bias (${bullishPercentage}% bullish). 
      Moving averages indicate an uptrend, with momentum indicators confirming positive price action. 
      Volume analysis supports the current upward movement. Consider looking for buying opportunities 
      while maintaining appropriate risk management.`;
    } 
    
    if (bearishPercentage >= 60) {
      return `Technical indicators are showing a ${getStrengthWord(bearishPercentage)} bearish bias (${bearishPercentage}% bearish). 
      Moving averages indicate a downtrend, with momentum indicators confirming negative price action. 
      Volume patterns suggest increased selling pressure. Consider caution with new long positions 
      and watch for potential further downside.`;
    }
    
    return `Technical indicators are showing mixed signals (${bullishPercentage}% bullish, ${bearishPercentage}% bearish). 
    This suggests a consolidation phase or a market in transition between trends. Some indicators 
    point to potential upside while others show possible weakness. It may be wise to wait for 
    clearer signals before taking significant positions.`;
  };
  
  // Render the indicators in a grid layout
  const renderDetailedIndicatorsGrid = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {enhancedIndicators.map((indicator, index) => (
          <motion.div 
            key={index}
            className={`p-3 rounded-lg border ${
              indicator.signal === 'bullish' ? 'border-green-500/30 bg-green-950/10' : 
              indicator.signal === 'bearish' ? 'border-red-500/30 bg-red-950/10' : 
              'border-yellow-500/30 bg-yellow-950/10'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-1.5">
                {indicator.icon}
                <h4 className="font-medium text-sm">{indicator.name}</h4>
              </div>
              {getSignalBadge(indicator.signal)}
            </div>
            
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "text-sm font-mono",
                  indicator.signal === 'bullish' ? 'text-green-400' : 
                  indicator.signal === 'bearish' ? 'text-red-400' : 
                  'text-yellow-400'
                )}>
                  {indicator.value.toString()}
                </span>
                <MarketDataTooltip 
                  title={indicator.name}
                  className="cursor-help"
                >
                  {INDICATOR_EXPLANATIONS[indicator.name.split(' ')[0] as keyof typeof INDICATOR_EXPLANATIONS] || 
                   indicator.description}
                </MarketDataTooltip>
              </div>
              
              {getStrengthIndicator(indicator.signal, indicator.value)}
            </div>
            
            <p className="mt-2 text-xs text-muted-foreground">
              {indicator.interpretation}
            </p>
          </motion.div>
        ))}
      </div>
    );
  };
  
  // Render the patterns and explanations
  const renderPatternsAndExplanations = () => {
    const patterns = detectPatterns();
    
    return (
      <div className="mt-4 space-y-3">
        <h3 className="font-medium text-sm flex items-center gap-1.5">
          <Lightbulb className="h-4 w-4 text-blue-500" />
          <span>Detected Patterns & Insights</span>
        </h3>
        
        {patterns.length > 0 ? (
          <div className="space-y-2">
            {patterns.map((pattern, index) => (
              <motion.div 
                key={index}
                className={`p-3 rounded-lg border ${
                  pattern.type === 'success' ? 'border-green-500/30 bg-green-950/10' : 
                  pattern.type === 'warning' ? 'border-amber-500/30 bg-amber-950/10' : 
                  'border-blue-500/30 bg-blue-950/10'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {getInsightIcon(pattern.type)}
                  <h4 className="font-medium text-sm">{pattern.name}</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  {pattern.explanation}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No significant patterns detected in the current market conditions.
          </p>
        )}
        
        <div className="p-3 rounded-lg border border-blue-500/30 bg-blue-950/10 mt-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Info className="h-4 w-4 text-blue-500" />
            <h4 className="font-medium text-sm">Technical Summary</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            {generateSummary()}
          </p>
        </div>
      </div>
    );
  };
  
  // Render educational content
  const renderEducationalContent = () => {
    return (
      <div className="mt-4 space-y-3">
        <h3 className="font-medium text-sm flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span>Technical Analysis Guide</span>
        </h3>
        
        <Collapsible className="rounded-lg border border-border/40 overflow-hidden">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/10">
              <div className="flex items-center gap-1.5">
                <LayoutGrid className="h-4 w-4" />
                <h4 className="text-sm font-medium">Understanding Key Patterns</h4>
              </div>
              <ChevronDown className="h-4 w-4" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-3 pt-0 space-y-2">
              {Object.entries(PATTERN_EXPLANATIONS).map(([pattern, explanation]) => (
                <div key={pattern} className="border-t border-border/20 pt-2 first:border-0 first:pt-0">
                  <h5 className="text-xs font-medium">{pattern}</h5>
                  <p className="text-xs text-muted-foreground mt-1">{explanation}</p>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
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
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="text-xs">
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="details" className="text-xs">
                  <BarChart3 className="h-3.5 w-3.5 mr-1" />
                  Indicators
                </TabsTrigger>
                <TabsTrigger value="patterns" className="text-xs">
                  <Lightbulb className="h-3.5 w-3.5 mr-1" />
                  Insights
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-4">
                {/* Overview Tab */}
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
                
                <div className="p-3 rounded-lg border border-blue-500/30 bg-blue-950/10">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Info className="h-4 w-4 text-blue-500" />
                    <h4 className="font-medium text-sm">Technical Analysis Summary</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {generateSummary()}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                {/* Details Tab */}
                {renderDetailedIndicatorsGrid()}
              </TabsContent>
              
              <TabsContent value="patterns" className="space-y-4 mt-4">
                {/* Patterns Tab */}
                {renderPatternsAndExplanations()}
                {renderEducationalContent()}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

