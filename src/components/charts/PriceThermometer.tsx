
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchHighLowData, fetchCurrentPrice } from '../../services/priceDataService';
import { formatCurrency } from '@/utils/numberUtils';

interface PriceThermometerProps {
  symbol?: string;
}

export const PriceThermometer: React.FC<PriceThermometerProps> = ({ symbol = 'BTC/USDT' }) => {
  const [data, setData] = useState<{
    weeklyHigh: number;
    weeklyLow: number;
    dailyHigh: number;
    dailyLow: number;
    currentPrice: number;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const highLowData = await fetchHighLowData(symbol);
        const priceData = await fetchCurrentPrice(symbol);
        setData({ ...highLowData, currentPrice: priceData.price });
      } catch (error) {
        console.error('Error fetching high-low data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Update every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [symbol]);

  
  if (!data || isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-48">
          <div className="animate-pulse flex flex-col items-center w-full">
            <div className="h-40 w-8 bg-muted rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { weeklyHigh, weeklyLow, dailyHigh, dailyLow, currentPrice } = data;
  
  // Calculate position percentages for visualization
  const weeklyRange = weeklyHigh - weeklyLow;
  const currentPricePosition = ((currentPrice - weeklyLow) / weeklyRange) * 100;
  const dailyHighPosition = ((dailyHigh - weeklyLow) / weeklyRange) * 100;
  const dailyLowPosition = ((dailyLow - weeklyLow) / weeklyRange) * 100;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Price Range</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            {/* Thermometer visualization */}
            <div className="relative w-16 h-[220px] bg-gradient-to-b from-green-100 to-red-100 rounded-full overflow-hidden border">
              {/* Weekly high marker */}
              <div className="absolute top-0 w-full flex justify-center">
                <div className="text-xs font-medium mb-1">{formatCurrency(weeklyHigh)}</div>
              </div>
              
              {/* Weekly low marker */}
              <div className="absolute bottom-0 w-full flex justify-center">
                <div className="text-xs font-medium mt-1">{formatCurrency(weeklyLow)}</div>
              </div>
              
              {/* Current price indicator */}
              <div 
                className="absolute w-full h-1 bg-primary flex items-center justify-end"
                style={{ bottom: `${currentPricePosition}%` }}
              >
                <div className="h-4 w-4 rounded-full bg-primary border-2 border-white -mr-2 shadow-lg" />
                <div className="absolute right-6 bg-muted px-2 py-1 rounded text-xs">
                  {formatCurrency(currentPrice)}
                </div>
              </div>
              
              {/* Daily high indicator */}
              <div 
                className="absolute w-full border-t border-dashed border-gray-500"
                style={{ bottom: `${dailyHighPosition}%` }}
              >
                <div className="absolute -right-14 text-xs text-muted-foreground">
                  Day H
                </div>
              </div>
              
              {/* Daily low indicator */}
              <div 
                className="absolute w-full border-t border-dashed border-gray-500"
                style={{ bottom: `${dailyLowPosition}%` }}
              >
                <div className="absolute -right-14 text-xs text-muted-foreground">
                  Day L
                </div>
              </div>
            </div>
            
            {/* Labels and info */}
            <div className="mt-4 text-xs text-center text-muted-foreground">
              <p>Weekly Range</p>
              <div className="flex gap-1 justify-center mt-1">
                <Badge className="bg-green-100 text-green-800">W</Badge>
                <Badge className="bg-red-100 text-red-800">D</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Badge component for labels
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
    {children}
  </span>
);
