
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, AlertCircle } from 'lucide-react';
import { useMarkets } from '@/hooks/useMarkets';
import { DataSourceIndicator } from '@/components/ui/data-source-indicator';
import { formatTimeUntil } from '@/utils/mockData';

interface MarketStatusProps {
  showDetails?: boolean;
}

export const MarketStatus: React.FC<MarketStatusProps> = ({ showDetails = false }) => {
  const { marketSessions } = useMarkets();

  const formatMarketTime = (timeText: string) => {
    // Remove duplicate "in" and "about" words
    return timeText
      .replace(/in in/g, 'in')
      .replace(/about /g, '');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Market Status
          </CardTitle>
          <DataSourceIndicator 
            source="Market API" 
            isLive={false} 
            details="Market sessions are simulated for demonstration purposes"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {marketSessions.map((market) => (
            <div key={market.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">{market.name}</span>
                <Badge 
                  variant={market.status === "open" ? "default" : "outline"}
                  className={market.status === "open" ? "bg-green-500/20 text-green-600 border-green-500" : ""}
                >
                  {market.status.toUpperCase()}
                </Badge>
              </div>
              {showDetails && (
                <div className="text-xs text-muted-foreground">
                  {market.nextEvent.type === 'open' ? 'Opens' : 'Closes'} in {formatTimeUntil(market.nextEvent.time)}
                </div>
              )}
              {!showDetails && (
                <div className="text-xs text-muted-foreground">
                  {market.nextEvent.type === 'open' ? 'Opens' : 'Closes'} in {formatTimeUntil(market.nextEvent.time)}
                </div>
              )}
              <Separator className="my-2" />
            </div>
          ))}
          
          {marketSessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No market sessions available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketStatus;
