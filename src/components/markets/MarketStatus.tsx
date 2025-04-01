
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, AlertCircle, Building } from 'lucide-react';
import { useMarkets } from '@/hooks/useMarkets';
import { DataSourceIndicator } from '@/components/ui/data-source-indicator';
import { getMarketTimeRemaining } from '@/utils/dateUtils';

interface MarketStatusProps {
  showDetails?: boolean;
  customTitle?: string;
  customSource?: string;
  compact?: boolean;
}

export const MarketStatus: React.FC<MarketStatusProps> = ({ 
  showDetails = false,
  customTitle,
  customSource,
  compact = false
}) => {
  const { marketSessions, lastUpdated, dataSource } = useMarkets();

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

  // Determine source label based on data source
  const getSourceLabel = () => {
    if (customSource) return customSource;
    return dataSource === 'alpha-vantage' ? 'Alpha Vantage API' : 'World Markets API';
  };

  // Format the countdown time
  const formatCountdown = (market: any) => {
    try {
      if (!market.nextEvent || !market.nextEvent.time) {
        return 'Unknown';
      }
      
      // Use the getMarketTimeRemaining helper
      return getMarketTimeRemaining(new Date(market.nextEvent.time));
    } catch (error) {
      console.error('Error formatting countdown:', error, market);
      return 'Error';
    }
  };

  // Debug logging to help diagnose issues
  console.log('MarketStatus - Current sessions:', marketSessions);

  return (
    <Card className={compact ? "border-border/50" : ""}>
      <CardHeader className={compact ? "pb-2" : "pb-3"}>
        <div className="flex justify-between items-center">
          <CardTitle className={compact ? "text-lg" : "text-xl"}>
            <div className="flex items-center gap-2">
              <Clock className={compact ? "h-4 w-4" : "h-5 w-5"} />
              {customTitle || "Market Status"}
            </div>
          </CardTitle>
          <DataSourceIndicator 
            source={getSourceLabel()} 
            isLive={true} 
            details="Real-time market sessions data"
          />
        </div>
      </CardHeader>
      <CardContent className={compact ? "p-0" : undefined}>
        <div className={compact ? "divide-y divide-border/30" : "space-y-2"}>
          {marketSessions.map((market) => (
            <div key={market.name} className={compact ? "p-3 hover:bg-muted/10 transition-colors" : "space-y-1"}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{market.name}</span>
                  {market.marketCap && !compact && (
                    <span className="text-xs text-muted-foreground">{market.marketCap}</span>
                  )}
                </div>
                <Badge 
                  variant={market.status === "closed" ? "outline" : "default"}
                  className={getStatusBadgeStyle(market.status)}
                >
                  {market.status === "opening-soon" ? "OPENING SOON" : market.status.toUpperCase()}
                </Badge>
              </div>
              <div className={compact ? "flex justify-between text-xs text-muted-foreground mt-1" : "text-xs text-muted-foreground"}>
                <div className="flex items-center gap-1">
                  {market.marketCap && compact && (
                    <div className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      <span>{market.marketCap}</span>
                      <span className="px-1">•</span>
                    </div>
                  )}
                  <span>
                    {market.nextEvent.type === 'open' ? 'Opens' : 'Closes'} {formatCountdown(market)}
                  </span>
                </div>
                {showDetails && (
                  <span className="text-xs text-muted-foreground font-mono">{market.hours}</span>
                )}
              </div>
              {!compact && <Separator className="my-2" />}
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
