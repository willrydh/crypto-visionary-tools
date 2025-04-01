
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, AlertCircle } from 'lucide-react';
import { useMarkets } from '@/hooks/useMarkets';
import { DataSourceIndicator } from '@/components/ui/data-source-indicator';
import { getMarketTimeRemaining } from '@/utils/dateUtils';

interface MarketStatusProps {
  showDetails?: boolean;
  customTitle?: string;
  customSource?: string;
}

export const MarketStatus: React.FC<MarketStatusProps> = ({ 
  showDetails = false,
  customTitle,
  customSource
}) => {
  const { marketSessions, lastUpdated } = useMarkets();

  // Get status badge styling
  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
      case 'open':
        return "bg-green-500/20 text-green-600 border-green-500";
      case 'opening-soon':
        return "bg-amber-500/20 text-amber-600 border-amber-500";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {customTitle || "Market Status"}
          </CardTitle>
          <DataSourceIndicator 
            source={customSource || "World Markets API"} 
            isLive={true} 
            details="Real-time market sessions data"
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
                  variant={market.status === "closed" ? "outline" : "default"}
                  className={getStatusBadgeStyle(market.status)}
                >
                  {market.status === "opening-soon" ? "OPENING SOON" : market.status.toUpperCase()}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {market.nextEvent.type === 'open' ? 'Opens' : 'Closes'} {getMarketTimeRemaining(market.nextEvent.time)}
              </div>
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
