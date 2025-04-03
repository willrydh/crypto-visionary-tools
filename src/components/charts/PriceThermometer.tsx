
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from '@/utils/numberUtils';
import { usePrice } from '@/hooks/usePrice';

export const PriceThermometer = () => {
  const { loadPriceData, priceData } = usePrice();
  const [isLoading, setIsLoading] = useState(true);
  const symbol = 'BTCUSDT';
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      await loadPriceData(symbol);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading price thermometer data:', error);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
    
    // Set a shorter interval for more frequent data updates
    const intervalId = setInterval(loadData, 60000); // Update every minute
    return () => clearInterval(intervalId);
  }, []);
  
  // Get current price data or use defaults
  const currentData = priceData[symbol] || {
    currentPrice: 0,
    hourlyHigh: 0,
    hourlyLow: 0,
    hourlyPricePosition: 50,
    dailyHigh: 0,
    dailyLow: 0,
    weeklyHigh: 0,
    weeklyLow: 0,
    price: 0
  };
  
  // Calculate where current price is in the range
  const getHourlyPercentage = () => {
    if (currentData.hourlyPricePosition !== undefined) {
      // Use the 5m data to determine position in hourly range
      return currentData.hourlyPricePosition;
    }
    const { price, hourlyHigh, hourlyLow } = currentData;
    if (hourlyHigh === hourlyLow) return 50;
    return ((price - hourlyLow) / (hourlyHigh - hourlyLow)) * 100;
  };
  
  const getDailyPercentage = () => {
    const { price, dailyHigh, dailyLow } = currentData;
    if (dailyHigh === dailyLow) return 50;
    return ((price - dailyLow) / (dailyHigh - dailyLow)) * 100;
  };
  
  const getWeeklyPercentage = () => {
    const { price, weeklyHigh, weeklyLow } = currentData;
    if (weeklyHigh === weeklyLow) return 50;
    return ((price - weeklyLow) / (weeklyHigh - weeklyLow)) * 100;
  };
  
  const getThermometerColor = (percentage: number) => {
    if (percentage > 75) return "bg-green-500";
    if (percentage > 50) return "bg-blue-500";
    if (percentage > 25) return "bg-amber-500";
    return "bg-red-500";
  };
  
  // Calculate background color based on average of all percentages
  const getBackgroundGradient = () => {
    const hourlyPercentage = getHourlyPercentage();
    const dailyPercentage = getDailyPercentage();
    const weeklyPercentage = getWeeklyPercentage();
    
    // Calculate weighted average (giving more weight to shorter timeframes)
    const weightedAverage = (
      (hourlyPercentage * 0.5) + 
      (dailyPercentage * 0.3) + 
      (weeklyPercentage * 0.2)
    );
    
    // Determine background color intensity based on weightedAverage
    if (weightedAverage > 75) {
      return "from-green-950/70 to-green-900/40"; // Strong green for very bullish
    } else if (weightedAverage > 60) {
      return "from-green-950/50 to-green-900/20"; // Light green for bullish
    } else if (weightedAverage > 40) {
      return "from-blue-950/50 to-blue-900/20"; // Neutral blue
    } else if (weightedAverage > 25) {
      return "from-amber-950/50 to-amber-900/20"; // Light amber/orange for bearish
    } else {
      return "from-red-950/70 to-red-900/40"; // Strong red for very bearish
    }
  };
  
  if (isLoading || !priceData[symbol]) {
    return (
      <Card className="bg-[#1A1F2C] border-border/40 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-pulse bg-muted h-full w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const hourlyPercentage = getHourlyPercentage();
  const dailyPercentage = getDailyPercentage();
  const weeklyPercentage = getWeeklyPercentage();
  const backgroundGradient = getBackgroundGradient();
  
  return (
    <Card className={`bg-gradient-to-b ${backgroundGradient} border-border/40 text-white transition-colors duration-500`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-white">Price Range</CardTitle>
          <Badge variant="outline" className="text-white border-white/20">BTC/USDT</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold">
              {formatCurrency(currentData.price)}
            </div>
            <div className="text-sm text-gray-400">Current Price</div>
          </div>
          
          {/* Hourly Range */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Hourly Range</span>
              <span>{formatCurrency(currentData.hourlyLow)} - {formatCurrency(currentData.hourlyHigh)}</span>
            </div>
            <div className="h-3 bg-muted/30 rounded-full relative overflow-hidden">
              <div 
                className={`h-full ${getThermometerColor(hourlyPercentage)} rounded-full transition-all duration-500 ease-in-out`}
                style={{ width: `${Math.min(Math.max(hourlyPercentage, 0), 100)}%` }}
              />
              <div 
                className="w-3 h-3 bg-white border-2 border-primary rounded-full absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 shadow-md"
                style={{ left: `${Math.min(Math.max(hourlyPercentage, 0), 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          
          {/* Daily Range */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Daily Range</span>
              <span>{formatCurrency(currentData.dailyLow)} - {formatCurrency(currentData.dailyHigh)}</span>
            </div>
            <div className="h-3 bg-muted/30 rounded-full relative overflow-hidden">
              <div 
                className={`h-full ${getThermometerColor(dailyPercentage)} rounded-full transition-all duration-500 ease-in-out`}
                style={{ width: `${Math.min(Math.max(dailyPercentage, 0), 100)}%` }}
              />
              <div 
                className="w-3 h-3 bg-white border-2 border-primary rounded-full absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 shadow-md"
                style={{ left: `${Math.min(Math.max(dailyPercentage, 0), 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          
          {/* Weekly Range */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Weekly Range</span>
              <span>{formatCurrency(currentData.weeklyLow)} - {formatCurrency(currentData.weeklyHigh)}</span>
            </div>
            <div className="h-3 bg-muted/30 rounded-full relative overflow-hidden">
              <div 
                className={`h-full ${getThermometerColor(weeklyPercentage)} rounded-full transition-all duration-500 ease-in-out`}
                style={{ width: `${Math.min(Math.max(weeklyPercentage, 0), 100)}%` }}
              />
              <div 
                className="w-3 h-3 bg-white border-2 border-primary rounded-full absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 shadow-md"
                style={{ left: `${Math.min(Math.max(weeklyPercentage, 0), 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-md border border-border/20 bg-black/20">
              <div className="text-xs text-gray-400">Hourly Vol</div>
              <div className="font-medium text-sm">
                {((currentData.hourlyHigh - currentData.hourlyLow) / currentData.hourlyLow * 100).toFixed(2)}%
              </div>
            </div>
            <div className="text-center p-2 rounded-md border border-border/20 bg-black/20">
              <div className="text-xs text-gray-400">Daily Vol</div>
              <div className="font-medium text-sm">
                {((currentData.dailyHigh - currentData.dailyLow) / currentData.dailyLow * 100).toFixed(2)}%
              </div>
            </div>
            <div className="text-center p-2 rounded-md border border-border/20 bg-black/20">
              <div className="text-xs text-gray-400">Weekly Vol</div>
              <div className="font-medium text-sm">
                {((currentData.weeklyHigh - currentData.weeklyLow) / currentData.weeklyLow * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
