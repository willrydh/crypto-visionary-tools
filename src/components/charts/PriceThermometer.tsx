
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, ArrowRight, Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RangeData {
  value: number;
  min: number;
  max: number;
  prevClose: number;
}

export const PriceThermometer = () => {
  const [hourlyRange, setHourlyRange] = useState<RangeData>({
    value: 82750,
    min: 81980,
    max: 83100,
    prevClose: 82300,
  });
  
  const [dailyRange, setDailyRange] = useState<RangeData>({
    value: 82750,
    min: 81200,
    max: 83400,
    prevClose: 81850,
  });
  
  const [weeklyRange, setWeeklyRange] = useState<RangeData>({
    value: 82750,
    min: 80500,
    max: 84100,
    prevClose: 79900,
  });
  
  const [backgroundStyle, setBackgroundStyle] = useState<string>('bg-card');
  const [borderStyle, setBorderStyle] = useState<string>('');
  const [currentTransition, setCurrentTransition] = useState<string>('transition-all duration-1000');

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      // Hourly range
      const hourlyValue = hourlyRange.value + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 50);
      setHourlyRange(prev => ({
        ...prev,
        value: hourlyValue,
      }));
      
      // Daily range - changes less frequently
      if (Math.random() > 0.7) {
        const dailyValue = dailyRange.value + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 100);
        setDailyRange(prev => ({
          ...prev,
          value: dailyValue,
        }));
      }
      
      // Weekly range - changes rarely
      if (Math.random() > 0.9) {
        const weeklyValue = weeklyRange.value + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 200);
        setWeeklyRange(prev => ({
          ...prev,
          value: weeklyValue,
        }));
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [hourlyRange, dailyRange, weeklyRange]);

  // Calculate the visual indications of price strength/weakness
  useEffect(() => {
    // Calculate relative position of current price in each range (0-100%)
    const getPositionInRange = (data: RangeData): number => {
      const rangeSize = data.max - data.min;
      if (rangeSize === 0) return 50; // Avoid division by zero
      const position = ((data.value - data.min) / rangeSize) * 100;
      return Math.min(Math.max(position, 0), 100);
    };

    const hourlyPosition = getPositionInRange(hourlyRange);
    const dailyPosition = getPositionInRange(dailyRange);
    const weeklyPosition = getPositionInRange(weeklyRange);

    // Get combined signal strength (weighted average of positions)
    // Give more weight to hourly, then daily, then weekly
    const combinedPosition = (hourlyPosition * 0.5) + (dailyPosition * 0.3) + (weeklyPosition * 0.2);

    // Determine background style based on combined position
    let newBgStyle = 'bg-card';
    let newBorderStyle = '';
    
    // Apply visual cues based on price position
    if (combinedPosition > 80) {
      // Strong bullish - green tint and border
      newBgStyle = 'bg-gradient-to-b from-green-50/30 to-card dark:from-green-950/20 dark:to-card';
      newBorderStyle = 'border-green-500/20 dark:border-green-500/10';
    } else if (combinedPosition > 65) {
      // Moderate bullish - light green tint
      newBgStyle = 'bg-gradient-to-b from-green-50/20 to-card dark:from-green-950/10 dark:to-card';
    } else if (combinedPosition < 20) {
      // Strong bearish - red tint and border
      newBgStyle = 'bg-gradient-to-b from-red-50/30 to-card dark:from-red-950/20 dark:to-card';
      newBorderStyle = 'border-red-500/20 dark:border-red-500/10';
    } else if (combinedPosition < 35) {
      // Moderate bearish - light red tint
      newBgStyle = 'bg-gradient-to-b from-red-50/20 to-card dark:from-red-950/10 dark:to-card';
    }

    // Only update if the styles have changed
    if (newBgStyle !== backgroundStyle) {
      setBackgroundStyle(newBgStyle);
    }
    
    if (newBorderStyle !== borderStyle) {
      setBorderStyle(newBorderStyle);
    }
  }, [hourlyRange, dailyRange, weeklyRange, backgroundStyle, borderStyle]);

  // Calculate the relative position of a value within a range as a percentage
  const getPositionPercent = (value: number, min: number, max: number): number => {
    const range = max - min;
    if (range === 0) return 50; // Avoid division by zero
    const position = ((value - min) / range) * 100;
    return Math.min(Math.max(position, 0), 100);
  };

  // Render a range indicator
  const renderRangeIndicator = (data: RangeData, label: string) => {
    const position = getPositionPercent(data.value, data.min, data.max);
    const prevClosePosition = getPositionPercent(data.prevClose, data.min, data.max);
    
    // Determine if price is higher or lower than previous close
    const changeFromPrevClose = data.value - data.prevClose;
    const changePercent = ((changeFromPrevClose / data.prevClose) * 100).toFixed(2);
    const isPositive = changeFromPrevClose > 0;
    
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <Badge variant="outline" className={cn(
            "text-xs font-mono",
            isPositive ? "text-green-500" : changeFromPrevClose < 0 ? "text-red-500" : "text-muted-foreground"
          )}>
            {isPositive && '+'}
            {changePercent}%
          </Badge>
        </div>
        
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          {/* Min-max range bar */}
          <div className="absolute inset-0 flex items-center px-1">
            <div className="text-[8px] text-muted-foreground/50">${data.min.toLocaleString()}</div>
            <div className="flex-grow"></div>
            <div className="text-[8px] text-muted-foreground/50">${data.max.toLocaleString()}</div>
          </div>
          
          {/* Previous close indicator */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/40"
            style={{ left: `${prevClosePosition}%` }}
          ></div>
          
          {/* Current price indicator */}
          <div 
            className={cn(
              "absolute top-0 bottom-0 w-1 rounded-full transition-all duration-1000",
              isPositive ? "bg-green-500" : changeFromPrevClose < 0 ? "bg-red-500" : "bg-primary"
            )}
            style={{ left: `${position}%` }}
          ></div>
        </div>
        
        <div className="text-sm font-mono">${data.value.toLocaleString()}</div>
      </div>
    );
  };

  return (
    <Card className={cn(
      "overflow-hidden", 
      borderStyle, 
      backgroundStyle, 
      currentTransition
    )}>
      <CardHeader className="p-4 border-b border-border/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <Thermometer className="h-4 w-4 text-primary mr-2" />
            Price Range
          </CardTitle>
          <Badge variant="outline" className="bg-primary/5">
            BTC-USD
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-5">
        {renderRangeIndicator(hourlyRange, "Hourly Range")}
        {renderRangeIndicator(dailyRange, "Daily Range")}
        {renderRangeIndicator(weeklyRange, "Weekly Range")}
      </CardContent>
    </Card>
  );
};

export default PriceThermometer;
