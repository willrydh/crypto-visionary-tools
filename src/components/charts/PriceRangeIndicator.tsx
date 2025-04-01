
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from '@/utils/numberUtils';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePrice } from '@/hooks/usePrice';

interface PriceRangeIndicatorProps {
  title?: string;
  symbol?: string;
  type?: 'pump' | 'dump';
}

const PriceRangeIndicator: React.FC<PriceRangeIndicatorProps> = ({
  title = 'Price Range',
  symbol = 'BTCUSDT',
  type
}) => {
  const { loadPriceData, priceData } = usePrice();
  
  useEffect(() => {
    // Load price data if not already loaded
    if (!priceData[symbol]) {
      loadPriceData(symbol);
    }
    
    // Set up interval for updates
    const intervalId = setInterval(() => {
      loadPriceData(symbol);
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [symbol]);
  
  // Get current price data or use defaults
  const currentData = priceData[symbol] || {
    price: 0,
    dailyHigh: 0,
    dailyLow: 0,
    weeklyHigh: 0,
    weeklyLow: 0
  };
  
  // Calculate percentages for positioning within ranges
  const calculateDailyPercentage = () => {
    const { price, dailyHigh, dailyLow } = currentData;
    const range = dailyHigh - dailyLow;
    if (range <= 0) return 50; // Default to middle if range is invalid
    
    const position = ((price - dailyLow) / range) * 100;
    return Math.min(Math.max(position, 0), 100); // Clamp between 0-100
  };
  
  const calculateWeeklyPercentage = () => {
    const { price, weeklyHigh, weeklyLow } = currentData;
    const range = weeklyHigh - weeklyLow;
    if (range <= 0) return 50; // Default to middle if range is invalid
    
    const position = ((price - weeklyLow) / range) * 100;
    return Math.min(Math.max(position, 0), 100); // Clamp between 0-100
  };
  
  const dailyPercentage = calculateDailyPercentage();
  const weeklyPercentage = calculateWeeklyPercentage();
  
  // Determine if price is in overbought/oversold zones
  const getDailyZone = () => {
    if (dailyPercentage >= 80) return "overbought";
    if (dailyPercentage <= 20) return "oversold";
    return "neutral";
  };
  
  const getWeeklyZone = () => {
    if (weeklyPercentage >= 80) return "overbought";
    if (weeklyPercentage <= 20) return "oversold";
    return "neutral";
  };
  
  const dailyZone = getDailyZone();
  const weeklyZone = getWeeklyZone();
  
  // Get color based on zone
  const getZoneColor = (zone: string) => {
    switch (zone) {
      case "overbought":
        return "text-red-500";
      case "oversold":
        return "text-green-500";
      default:
        return "text-yellow-500";
    }
  };
  
  return (
    <Card className="bg-[#1A1F2C] border-border/40 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg text-white">
          {title}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-2 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Shows where current price sits within daily and weekly ranges</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Price with Change */}
        <div className="text-center">
          <span className="text-3xl font-bold">{formatCurrency(currentData.price)}</span>
        </div>
        
        {/* Daily Range */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Daily Range</span>
            <Badge variant="outline" className={`border-white/20 ${getZoneColor(dailyZone)}`}>
              {dailyZone.charAt(0).toUpperCase() + dailyZone.slice(1)}
            </Badge>
          </div>
          
          <div className="relative pt-1">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{formatCurrency(currentData.dailyLow)}</span>
              <span>{formatCurrency(currentData.dailyHigh)}</span>
            </div>
            
            <div className="h-2 bg-muted/30 rounded-full">
              <div 
                className="absolute w-4 h-4 bg-primary rounded-full -mt-1 transform -translate-x-1/2 transition-all"
                style={{ left: `${dailyPercentage}%` }}
              />
            </div>
            
            {/* Overbought/Oversold Zones */}
            <div className="flex justify-between mt-1">
              <div className="w-[20%] h-1 bg-green-500/20 rounded-l-full" />
              <div className="w-[60%] h-1 bg-muted/20" />
              <div className="w-[20%] h-1 bg-red-500/20 rounded-r-full" />
            </div>
          </div>
        </div>
        
        {/* Weekly Range */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Weekly Range</span>
            <Badge variant="outline" className={`border-white/20 ${getZoneColor(weeklyZone)}`}>
              {weeklyZone.charAt(0).toUpperCase() + weeklyZone.slice(1)}
            </Badge>
          </div>
          
          <div className="relative pt-1">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{formatCurrency(currentData.weeklyLow)}</span>
              <span>{formatCurrency(currentData.weeklyHigh)}</span>
            </div>
            
            <div className="h-2 bg-muted/30 rounded-full">
              <div 
                className="absolute w-4 h-4 bg-primary rounded-full -mt-1 transform -translate-x-1/2 transition-all"
                style={{ left: `${weeklyPercentage}%` }}
              />
            </div>
            
            {/* Overbought/Oversold Zones */}
            <div className="flex justify-between mt-1">
              <div className="w-[20%] h-1 bg-green-500/20 rounded-l-full" />
              <div className="w-[60%] h-1 bg-muted/20" />
              <div className="w-[20%] h-1 bg-red-500/20 rounded-r-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceRangeIndicator;
