import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrice } from '@/hooks/usePrice';
import { cn } from '@/lib/utils';

const PriceThermometer = () => {
  const { priceData } = usePrice();
  const btcPriceData = priceData['BTCUSDT'] || {
    price: 0,
    hourlyPricePosition: 0.5,
    dailyPricePosition: 0.5,
    weeklyPricePosition: 0.5,
    hourlyHigh: 0,
    hourlyLow: 0,
    dailyHigh: 0,
    dailyLow: 0,
    weeklyHigh: 0,
    weeklyLow: 0,
  };

  const getThermometerStyle = (position: number) => {
    const percentage = Math.max(0, Math.min(position * 100, 100));
    return { height: `${percentage}%` };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Range</CardTitle>
      </CardHeader>
      <CardContent className="p-4 relative">
        <div className="thermometer-container h-40 relative bg-muted rounded-md overflow-hidden">
          <div
            className="thermometer-fill absolute bottom-0 left-0 w-full bg-gradient-to-t from-green-500 to-red-500 transition-height duration-300 ease-out"
            style={getThermometerStyle(btcPriceData.dailyPricePosition)}
          ></div>
          <div className="thermometer-bulb absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full shadow-md border-2 border-background"></div>
        </div>
        <div className="text-xs mt-2 grid grid-cols-2 gap-2">
          <div>
            <span className="text-muted-foreground">Low</span>
            <strong className="block">${btcPriceData.dailyLow?.toFixed(0) || 'N/A'}</strong>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground">High</span>
            <strong className="block">${btcPriceData.dailyHigh?.toFixed(0) || 'N/A'}</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceThermometer;
