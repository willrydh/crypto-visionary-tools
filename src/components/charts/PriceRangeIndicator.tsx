
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from '@/utils/numberUtils';
import { Info, TrendingUp, TrendingDown, AlertTriangle, BarChart2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePrice } from '@/hooks/usePrice';
import { useIsMobile } from '@/hooks/use-mobile';

interface PriceRangeIndicatorProps {
  title?: string;
  symbol?: string;
  type?: 'pump' | 'dump';
}

const PriceRangeIndicator: React.FC<PriceRangeIndicatorProps> = ({
  title = 'Price Ranges',
  symbol = 'BTCUSDT',
  type
}) => {
  const { loadPriceData, priceData } = usePrice();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!priceData[symbol]) {
      loadPriceData(symbol);
    }
    
    const intervalId = setInterval(() => {
      loadPriceData(symbol);
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [symbol, loadPriceData, priceData]);
  
  const currentData = priceData[symbol] || {
    price: 0,
    hourlyHigh: 0,
    hourlyLow: 0,
    dailyHigh: 0,
    dailyLow: 0,
    weeklyHigh: 0,
    weeklyLow: 0
  };
  
  const calculateHourlyPercentage = () => {
    const { price, hourlyHigh, hourlyLow } = currentData;
    const range = hourlyHigh - hourlyLow;
    if (range <= 0) return 50;
    
    const position = ((price - hourlyLow) / range) * 100;
    return Math.min(Math.max(position, 0), 100);
  };
  
  const calculateDailyPercentage = () => {
    const { price, dailyHigh, dailyLow } = currentData;
    const range = dailyHigh - dailyLow;
    if (range <= 0) return 50;
    
    const position = ((price - dailyLow) / range) * 100;
    return Math.min(Math.max(position, 0), 100);
  };
  
  const calculateWeeklyPercentage = () => {
    const { price, weeklyHigh, weeklyLow } = currentData;
    const range = weeklyHigh - weeklyLow;
    if (range <= 0) return 50;
    
    const position = ((price - weeklyLow) / range) * 100;
    return Math.min(Math.max(position, 0), 100);
  };
  
  const hourlyPercentage = calculateHourlyPercentage();
  const dailyPercentage = calculateDailyPercentage();
  const weeklyPercentage = calculateWeeklyPercentage();
  
  console.log(`PriceRangeIndicator - Price positions for ${symbol}:`, {
    price: currentData.price,
    hourly: {
      percentage: hourlyPercentage.toFixed(1),
      low: currentData.hourlyLow,
      high: currentData.hourlyHigh
    },
    daily: {
      percentage: dailyPercentage.toFixed(1),
      low: currentData.dailyLow,
      high: currentData.dailyHigh
    },
    weekly: {
      percentage: weeklyPercentage.toFixed(1),
      low: currentData.weeklyLow,
      high: currentData.weeklyHigh
    }
  });
  
  const getHourlyZone = () => {
    if (hourlyPercentage >= 80) return "Overbought";
    if (hourlyPercentage <= 20) return "Oversold";
    return "Neutral";
  };
  
  const getDailyZone = () => {
    if (dailyPercentage >= 80) return "Overbought";
    if (dailyPercentage <= 20) return "Oversold";
    return "Neutral";
  };
  
  const getWeeklyZone = () => {
    if (weeklyPercentage >= 80) return "Overbought";
    if (weeklyPercentage <= 20) return "Oversold";
    return "Neutral";
  };
  
  const hourlyZone = getHourlyZone();
  const dailyZone = getDailyZone();
  const weeklyZone = getWeeklyZone();
  
  const getZoneColor = (zone: string) => {
    switch (zone) {
      case "Overbought":
        return "text-green-500 bg-green-500/10 border-green-500/30";
      case "Oversold":
        return "text-red-500 bg-red-500/10 border-red-500/30";
      default:
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
    }
  };
  
  const getBackgroundGradient = () => {
    const isOverall = hourlyZone === "Overbought" && dailyZone === "Overbought";
    const isOversold = hourlyZone === "Oversold" && dailyZone === "Oversold";
    
    if (isOverall) {
      return "bg-gradient-to-b from-green-950/30 via-green-900/20 to-green-900/5";
    } else if (isOversold) {
      return "bg-gradient-to-b from-red-950/30 via-red-900/20 to-red-900/5";
    } else {
      return "bg-gradient-to-b from-blue-950/20 via-blue-900/10 to-blue-900/5";
    }
  };
  
  const getTradingSuggestion = () => {
    const zones = [hourlyZone, dailyZone, weeklyZone];
    const overboughtCount = zones.filter(z => z === "Overbought").length;
    const oversoldCount = zones.filter(z => z === "Oversold").length;
    
    if (overboughtCount >= 2) {
      return {
        text: "Price is overbought, look for shorts",
        icon: <TrendingDown className="h-4 w-4 mr-2" />,
        color: "bg-red-600/20 border-red-600/30 text-red-400"
      };
    } else if (oversoldCount >= 2) {
      return {
        text: "Price is oversold, look for longs",
        icon: <TrendingUp className="h-4 w-4 mr-2" />,
        color: "bg-green-600/20 border-green-600/30 text-green-400"
      };
    } else {
      return {
        text: "Stand by for new entries",
        icon: <BarChart2 className="h-4 w-4 mr-2" />,
        color: "bg-blue-600/20 border-blue-600/30 text-blue-400"
      };
    }
  };
  
  const suggestion = getTradingSuggestion();
  
  return (
    <Card className={`${getBackgroundGradient()} border-border/30 transition-colors duration-700 relative overflow-hidden`}>
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="flex items-center text-lg text-white">
          {title}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-2 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Shows where current price sits within hourly, daily and weekly ranges</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        <div className="text-center">
          <span className="text-3xl font-bold">${currentData.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        </div>
        
        <div className="p-3 rounded-md border border-white/10 bg-black/30 backdrop-blur-sm w-full">
          <div className="flex items-center justify-center">
            <div className={`px-4 py-2 rounded-md flex items-center justify-center w-full ${suggestion.color}`}>
              {suggestion.icon}
              <span className="font-medium text-xs whitespace-nowrap">{suggestion.text}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Hourly Range</span>
            <Badge variant="outline" className={`border-white/15 ${getZoneColor(hourlyZone)}`}>
              {hourlyZone}
            </Badge>
          </div>
          
          <div className="relative pt-1">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>${Math.floor(currentData.hourlyLow).toLocaleString()}</span>
              <span>${Math.floor(currentData.hourlyHigh).toLocaleString()}</span>
            </div>
            
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute w-4 h-4 bg-white rounded-full -mt-1 transform -translate-x-1/2 transition-all duration-500 shadow-glow"
                style={{ left: `${hourlyPercentage}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Daily Range</span>
            <Badge variant="outline" className={`border-white/15 ${getZoneColor(dailyZone)}`}>
              {dailyZone}
            </Badge>
          </div>
          
          <div className="relative pt-1">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>${Math.floor(currentData.dailyLow).toLocaleString()}</span>
              <span>${Math.floor(currentData.dailyHigh).toLocaleString()}</span>
            </div>
            
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute w-4 h-4 bg-white rounded-full -mt-1 transform -translate-x-1/2 transition-all duration-500 shadow-glow"
                style={{ left: `${dailyPercentage}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Weekly Range</span>
            <Badge variant="outline" className={`border-white/15 ${getZoneColor(weeklyZone)}`}>
              {weeklyZone}
            </Badge>
          </div>
          
          <div className="relative pt-1">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>${Math.floor(currentData.weeklyLow).toLocaleString()}</span>
              <span>${Math.floor(currentData.weeklyHigh).toLocaleString()}</span>
            </div>
            
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute w-4 h-4 bg-white rounded-full -mt-1 transform -translate-x-1/2 transition-all duration-500 shadow-glow"
                style={{ left: `${weeklyPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceRangeIndicator;
