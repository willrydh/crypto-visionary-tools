
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrice } from '@/hooks/usePrice';
import { cn } from '@/lib/utils';

// Calculate the position for the thermometer
const calculatePosition = (current: number, low: number, high: number): number => {
  if (high === low) return 0.5; // Prevent division by zero
  const position = (current - low) / (high - low);
  return Math.max(0, Math.min(position, 1)); // Ensure value is between 0 and 1
};

const PriceThermometer = () => {
  const { priceData } = usePrice();
  
  // Get BTC price data with fallback values if not available
  const btcPriceData = priceData['BTCUSDT'] || {
    price: 0,
    hourlyHigh: 0,
    hourlyLow: 0,
    dailyHigh: 0,
    dailyLow: 0,
    weeklyHigh: 0,
    weeklyLow: 0,
  };
  
  // Calculate price positions from high/low data
  const dailyPricePosition = calculatePosition(
    btcPriceData.price, 
    btcPriceData.dailyLow, 
    btcPriceData.dailyHigh
  );
  
  // Log calculated positions for debugging
  console.log("PriceThermometer - Daily position:", {
    dailyPricePosition,
    btcPrice: btcPriceData.price,
    dailyRange: { low: btcPriceData.dailyLow, high: btcPriceData.dailyHigh }
  });

  const getThermometerStyle = (position: number) => {
    // Convert from 0-1 to 0-100 for percentage height
    const percentage = Math.max(0, Math.min(position * 100, 100));
    return { height: `${percentage}%` };
  };

  return (
    <Card className="border-border/30 bg-surface-1">
      <CardHeader>
        <CardTitle>Price Range</CardTitle>
      </CardHeader>
      <CardContent className="p-4 relative">
        <div className="thermometer-container h-40 relative bg-gradient-to-t from-green-500 to-red-500 rounded-md overflow-hidden">
          <div
            className="thermometer-fill absolute bottom-0 left-0 w-full transition-height duration-300 ease-out"
            style={getThermometerStyle(dailyPricePosition)}
          ></div>
          
          {/* Red indicator circle positioned based on price */}
          <div 
            className="absolute w-6 h-6 bg-bearish rounded-full shadow-md border-2 border-background z-10 transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: '50%',
              top: `${100 - (dailyPricePosition * 100)}%` 
            }}
          ></div>
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
