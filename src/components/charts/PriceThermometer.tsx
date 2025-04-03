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
    
    const intervalId = setInterval(loadData, 60000);
    return () => clearInterval(intervalId);
  }, []);
  
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
  
  const getHourlyPercentage = () => {
    if (currentData.hourlyPricePosition !== undefined) {
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
    if (percentage > 80) return "bg-green-600";
    if (percentage > 65) return "bg-green-500";
    if (percentage > 50) return "bg-blue-500";
    if (percentage > 35) return "bg-amber-500";
    if (percentage > 20) return "bg-amber-600";
    return "bg-red-500";
  };
  
  const getBackgroundTheme = () => {
    const hourlyPercentage = getHourlyPercentage();
    const dailyPercentage = getDailyPercentage();
    const weeklyPercentage = getWeeklyPercentage();
    
    const weightedAverage = (
      (hourlyPercentage * 0.5) + 
      (dailyPercentage * 0.3) + 
      (weeklyPercentage * 0.2)
    );
    
    console.log(`Price position: Hourly ${hourlyPercentage.toFixed(1)}%, Daily ${dailyPercentage.toFixed(1)}%, Weekly ${weeklyPercentage.toFixed(1)}%`);
    console.log(`Weighted average: ${weightedAverage.toFixed(1)}%`);
    
    if (weightedAverage > 65) {
      return "green";
    } else if (weightedAverage < 35) {
      return "red";
    } else {
      return "neutral";
    }
  };
  
  const getBackgroundGradient = () => {
    const theme = getBackgroundTheme();
    
    if (theme === 'green') {
      return "from-green-800/15 to-green-600/10 northern-lights-green";
    } else if (theme === 'red') {
      return "from-red-800/15 to-red-600/10 northern-lights-red";
    } else {
      return "from-blue-600/15 to-blue-400/10 northern-lights-neutral";
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
  const colorTheme = getBackgroundTheme();
  
  return (
    <Card className={`bg-gradient-to-b ${backgroundGradient} border-border/40 text-white transition-colors duration-1000`}>
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
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Hourly Range</span>
              <span>{formatCurrency(currentData.hourlyLow)} - {formatCurrency(currentData.hourlyHigh)}</span>
            </div>
            <div className="h-3 bg-muted/30 rounded-full relative overflow-hidden">
              <div 
                className={`h-full ${getThermometerColor(hourlyPercentage)} rounded-full transition-all duration-950 ease-in-out`}
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
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Daily Range</span>
              <span>{formatCurrency(currentData.dailyLow)} - {formatCurrency(currentData.dailyHigh)}</span>
            </div>
            <div className="h-3 bg-muted/30 rounded-full relative overflow-hidden">
              <div 
                className={`h-full ${getThermometerColor(dailyPercentage)} rounded-full transition-all duration-950 ease-in-out`}
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
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Weekly Range</span>
              <span>{formatCurrency(currentData.weeklyLow)} - {formatCurrency(currentData.weeklyHigh)}</span>
            </div>
            <div className="h-3 bg-muted/30 rounded-full relative overflow-hidden">
              <div 
                className={`h-full ${getThermometerColor(weeklyPercentage)} rounded-full transition-all duration-950 ease-in-out`}
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
