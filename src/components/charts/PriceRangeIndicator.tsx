
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const { loadPriceData, priceData, loadHighLowData, isLoading } = usePrice();
  const isMobile = useIsMobile();
  const [showLoader, setShowLoader] = useState(false);

  // 1. Hämta pris och high/low-data vid mount om saknas
  useEffect(() => {
    let shouldLoadHighLow = false;

    // Hämta pris om saknas
    if (!priceData[symbol]) {
      loadPriceData(symbol);
      shouldLoadHighLow = true;
    } else {
      // Om high/low saknas eller är noll (eller har ogiltiga värden)
      const d = priceData[symbol];
      if (
        d.hourlyHigh == null || d.hourlyLow == null ||
        d.dailyHigh == null || d.dailyLow == null ||
        d.weeklyHigh == null || d.weeklyLow == null
      ) {
        shouldLoadHighLow = true;
      }
    }

    if (shouldLoadHighLow) {
      setShowLoader(true);
      loadHighLowData(symbol)
        .then(() => setShowLoader(false))
        .catch(() => setShowLoader(false));
    }

    // Uppdatera periodiskt
    const intervalId = setInterval(() => {
      loadPriceData(symbol);
      loadHighLowData(symbol);
    }, 60000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, [symbol, loadPriceData, loadHighLowData, priceData]);

  const currentData = priceData[symbol] || {
    price: 0,
    hourlyHigh: 0,
    hourlyLow: 0,
    dailyHigh: 0,
    dailyLow: 0,
    weeklyHigh: 0,
    weeklyLow: 0
  };

  // 2. Vänta med rendering tills pris & range laddats
  const isRangeDataReady = currentData.hourlyHigh && currentData.hourlyLow && currentData.dailyHigh && currentData.dailyLow && currentData.weeklyHigh && currentData.weeklyLow;

  // Beräkningar av procentuell position
  const calculatePercentage = (price: number, low: number, high: number) => {
    const range = high - low;
    if (!range || range <= 0) return 50;
    const position = ((price - low) / range) * 100;
    return Math.min(Math.max(position, 0), 100);
  };

  const hourlyPercentage = calculatePercentage(currentData.price, currentData.hourlyLow, currentData.hourlyHigh);
  const dailyPercentage = calculatePercentage(currentData.price, currentData.dailyLow, currentData.dailyHigh);
  const weeklyPercentage = calculatePercentage(currentData.price, currentData.weeklyLow, currentData.weeklyHigh);

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
        return "text-bullish bg-bullish/10 border-bullish/30";
      case "Oversold":
        return "text-bearish bg-bearish/10 border-bearish/30";
      default:
        return "text-warning bg-warning/10 border-warning/30";
    }
  };

  const getBackgroundGradient = () => {
    // Count overbought and oversold zones
    const zones = [hourlyZone, dailyZone, weeklyZone];
    const overboughtCount = zones.filter(z => z === "Overbought").length;
    const oversoldCount = zones.filter(z => z === "Oversold").length;
    const neutralCount = zones.filter(z => z === "Neutral").length;

    // Change background if at least one indicator shows overbought/oversold
    if (overboughtCount >= 1 && oversoldCount === 0) {
      return "bg-gradient-to-b from-bullish/20 via-bullish/10 to-transparent";
    } else if (oversoldCount >= 1 && overboughtCount === 0) {
      return "bg-gradient-to-b from-bearish/20 via-bearish/10 to-transparent";
    } else {
      return "bg-gradient-to-b from-info/20 via-info/10 to-transparent";
    }
  };

  // Visningslogik för rekommendation
  const getTradingSuggestion = () => {
    const zones = [hourlyZone, dailyZone, weeklyZone];
    const overboughtCount = zones.filter(z => z === "Overbought").length;
    const oversoldCount = zones.filter(z => z === "Oversold").length;

    if (overboughtCount >= 2) {
      return {
        text: "Price is overbought, look for shorts",
        icon: <TrendingDown className="h-4 w-4 mr-2" />,
        color: "bg-bearish/20 border-bearish/30 text-bearish"
      };
    } else if (oversoldCount >= 2) {
      return {
        text: "Price is oversold, look for longs",
        icon: <TrendingUp className="h-4 w-4 mr-2" />,
        color: "bg-bullish/20 border-bullish/30 text-bullish"
      };
    } else {
      return {
        text: "Stand by for new entries",
        icon: <BarChart2 className="h-4 w-4 mr-2" />,
        color: "bg-info/20 border-info/30 text-info"
      };
    }
  };

  const suggestion = getTradingSuggestion();

  return (
    <Card className={`${getBackgroundGradient()} border-border/30 transition-colors duration-700 relative overflow-hidden`}>
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="flex items-center text-lg text-primary-foreground">
          {title}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-2 text-muted-foreground" />
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
          <span className="text-3xl font-bold">${currentData.price?.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="p-3 rounded-md border border-border/10 bg-foreground/30 backdrop-blur-sm w-full">
          <div className="flex items-center justify-center">
            <div className={`px-4 py-2 rounded-md flex items-center justify-center w-full ${suggestion.color}`}>
              {suggestion.icon}
              <span className="font-medium text-xs whitespace-nowrap">{suggestion.text}</span>
            </div>
          </div>
        </div>

        {/* Show loader om data saknas */}
        {showLoader || !isRangeDataReady ? (
          <div className="py-12 text-center text-muted-foreground">Loading price ranges...</div>
        ) : (
          <>
          {/* Hourly */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Hourly Range</span>
              <Badge variant="outline" className={`border-border/15 ${getZoneColor(hourlyZone)}`}>
                {hourlyZone}
              </Badge>
            </div>
            <div className="relative pt-1">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>${Math.floor(currentData.hourlyLow).toLocaleString()}</span>
                <span>${Math.floor(currentData.hourlyHigh).toLocaleString()}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute w-4 h-4 bg-card rounded-full -mt-1 transform -translate-x-1/2 transition-all duration-500 shadow-glow"
                  style={{ left: `${hourlyPercentage}%` }}
                />
              </div>
            </div>
          </div>
          {/* Daily */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Daily Range</span>
              <Badge variant="outline" className={`border-border/15 ${getZoneColor(dailyZone)}`}>
                {dailyZone}
              </Badge>
            </div>
            <div className="relative pt-1">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>${Math.floor(currentData.dailyLow).toLocaleString()}</span>
                <span>${Math.floor(currentData.dailyHigh).toLocaleString()}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute w-4 h-4 bg-card rounded-full -mt-1 transform -translate-x-1/2 transition-all duration-500 shadow-glow"
                  style={{ left: `${dailyPercentage}%` }}
                />
              </div>
            </div>
          </div>
          {/* Weekly */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Weekly Range</span>
              <Badge variant="outline" className={`border-border/15 ${getZoneColor(weeklyZone)}`}>
                {weeklyZone}
              </Badge>
            </div>
            <div className="relative pt-1">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>${Math.floor(currentData.weeklyLow).toLocaleString()}</span>
                <span>${Math.floor(currentData.weeklyHigh).toLocaleString()}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute w-4 h-4 bg-card rounded-full -mt-1 transform -translate-x-1/2 transition-all duration-500 shadow-glow"
                  style={{ left: `${weeklyPercentage}%` }}
                />
              </div>
            </div>
          </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceRangeIndicator;

