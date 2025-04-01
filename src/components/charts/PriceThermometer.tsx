
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
  
  // Get current price data or use defaults
  const currentData = priceData[symbol] || {
    currentPrice: 0,
    dailyHigh: 0,
    dailyLow: 0,
    weeklyHigh: 0,
    weeklyLow: 0,
    price: 0
  };
  
  // Calculate where current price is in the range
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
  
  if (isLoading || !priceData[symbol]) {
    return (
      <Card>
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
  
  const dailyPercentage = getDailyPercentage();
  const weeklyPercentage = getWeeklyPercentage();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Price Range</CardTitle>
          <Badge variant="outline">BTC/USDT</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-xl font-bold">
              {formatCurrency(currentData.price)}
            </div>
            <div className="text-sm text-muted-foreground">Current Price</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Daily Range</span>
              <span>{formatCurrency(currentData.dailyLow)} - {formatCurrency(currentData.dailyHigh)}</span>
            </div>
            <div className="h-3 bg-muted rounded-full relative overflow-hidden">
              <div 
                className={`h-full ${getThermometerColor(dailyPercentage)} rounded-full transition-all duration-500 ease-in-out`}
                style={{ width: `${Math.min(Math.max(dailyPercentage, 0), 100)}%` }}
              />
              <div 
                className="w-3 h-3 bg-white border-2 border-primary rounded-full absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 shadow-md"
                style={{ left: `${Math.min(Math.max(dailyPercentage, 0), 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Weekly Range</span>
              <span>{formatCurrency(currentData.weeklyLow)} - {formatCurrency(currentData.weeklyHigh)}</span>
            </div>
            <div className="h-3 bg-muted rounded-full relative overflow-hidden">
              <div 
                className={`h-full ${getThermometerColor(weeklyPercentage)} rounded-full transition-all duration-500 ease-in-out`}
                style={{ width: `${Math.min(Math.max(weeklyPercentage, 0), 100)}%` }}
              />
              <div 
                className="w-3 h-3 bg-white border-2 border-primary rounded-full absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 shadow-md"
                style={{ left: `${Math.min(Math.max(weeklyPercentage, 0), 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-2 rounded-md border">
              <div className="text-xs text-muted-foreground">Daily Volatility</div>
              <div className="font-medium">
                {((currentData.dailyHigh - currentData.dailyLow) / currentData.dailyLow * 100).toFixed(2)}%
              </div>
            </div>
            <div className="text-center p-2 rounded-md border">
              <div className="text-xs text-muted-foreground">Weekly Volatility</div>
              <div className="font-medium">
                {((currentData.weeklyHigh - currentData.weeklyLow) / currentData.weeklyLow * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
