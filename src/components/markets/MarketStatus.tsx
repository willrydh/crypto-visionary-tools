
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, AlertCircle, Building } from 'lucide-react';
import { useMarkets } from '@/hooks/useMarkets';
import { DataSourceIndicator } from '@/components/ui/data-source-indicator';
import { getMarketTimeRemaining } from '@/utils/dateUtils';
import { MarketSession } from '@/contexts/MarketsContext';

interface MarketStatusProps {
  showDetails?: boolean;
  customTitle?: string;
  customSource?: string;
  compact?: boolean;
  marketSessions?: MarketSession[]; // Optional prop to directly receive market sessions
}

export const MarketStatus: React.FC<MarketStatusProps> = ({ 
  showDetails = false,
  customTitle,
  customSource,
  compact = false,
  marketSessions: propMarketSessions
}) => {
  // Use provided marketSessions if available, otherwise use the context
  let marketSessions: MarketSession[] = [];
  let dataSource: string = 'internal';
  let lastUpdated: Date | null = null;
  
  try {
    // Only use the context if marketSessions weren't provided via props
    if (!propMarketSessions) {
      const marketsContext = useMarkets();
      marketSessions = marketsContext.marketSessions;
      dataSource = marketsContext.dataSource;
      lastUpdated = marketsContext.lastUpdated;
    } else {
      marketSessions = propMarketSessions;
    }
  } catch (error) {
    // Fallback to empty array if context is not available and props weren't provided
    console.warn('MarketStatus: useMarkets context not available, using empty array');
    marketSessions = [];
  }

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
      
      // Make sure we're working with a Date object
      const nextEventTime = market.nextEvent.time instanceof Date 
        ? market.nextEvent.time 
        : new Date(market.nextEvent.time);
      
      // Use the getMarketTimeRemaining helper
      return getMarketTimeRemaining(nextEventTime);
    } catch (error) {
      console.error('Error formatting countdown:', error, market);
      return 'Error';
    }
  };

  // Match Frankfurt and London countdown if they're both waiting to open
  const syncEuropeanMarketCountdowns = (markets: MarketSession[]): MarketSession[] => {
    try {
      const frankfurt = markets.find(m => m.name.includes("Frankfurt"));
      const london = markets.find(m => m.name.includes("London"));
      
      // If both markets exist and they're both waiting to open
      if (frankfurt && london && 
          frankfurt.status !== 'open' && london.status !== 'open' &&
          frankfurt.nextEvent.type === 'open' && london.nextEvent.type === 'open') {
        
        // Use the same nextEvent time for both
        const earliestOpenTime = new Date(Math.min(
          frankfurt.nextEvent.time.getTime(),
          london.nextEvent.time.getTime()
        ));
        
        // Update both markets to have the same opening time
        return markets.map(market => {
          if (market.name.includes("Frankfurt") || market.name.includes("London")) {
            return {
              ...market,
              nextEvent: {
                ...market.nextEvent,
                time: earliestOpenTime
              }
            };
          }
          return market;
        });
      }
      
      // If both markets are open and waiting to close, also sync their closing times
      if (frankfurt && london && 
          frankfurt.status === 'open' && london.status === 'open' &&
          frankfurt.nextEvent.type === 'close' && london.nextEvent.type === 'close') {
        
        // Use the same nextEvent time for both
        const earliestCloseTime = new Date(Math.min(
          frankfurt.nextEvent.time.getTime(),
          london.nextEvent.time.getTime()
        ));
        
        // Update both markets to have the same closing time
        return markets.map(market => {
          if (market.name.includes("Frankfurt") || market.name.includes("London")) {
            return {
              ...market,
              nextEvent: {
                ...market.nextEvent,
                time: earliestCloseTime
              }
            };
          }
          return market;
        });
      }
    } catch (error) {
      console.error('Error syncing European market countdowns:', error);
    }
    
    return markets;
  };

  // Sync European market countdowns to ensure Frankfurt and London show the same times
  const synchronizedMarketSessions = syncEuropeanMarketCountdowns(marketSessions);

  // Debug logging to help diagnose issues
  console.log('MarketStatus - Market sessions:', synchronizedMarketSessions.map(m => ({
    name: m.name,
    status: m.status,
    nextEvent: m.nextEvent.type,
    nextEventTime: m.nextEvent.time,
    formattedCountdown: formatCountdown(m)
  })));

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
          {synchronizedMarketSessions.map((market) => (
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
          
          {synchronizedMarketSessions.length === 0 && (
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
