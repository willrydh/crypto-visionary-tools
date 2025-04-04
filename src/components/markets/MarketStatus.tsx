
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

  // Match Frankfurt and London countdown if they're both waiting to open or close
  const syncEuropeanMarketCountdowns = (markets: MarketSession[]): MarketSession[] => {
    try {
      // Find the London and Frankfurt markets
      const london = markets.find(m => m.name.toLowerCase().includes("london") || m.name.includes("LSE"));
      const frankfurt = markets.find(m => m.name.toLowerCase().includes("frankfurt") || m.name.includes("FSX"));
      
      // If both markets exist
      if (frankfurt && london) {
        // Create a clone of the markets array
        const updatedMarkets = [...markets];
        
        // Find the indices of both markets to update them later
        const londonIndex = updatedMarkets.findIndex(m => m.name.toLowerCase().includes("london") || m.name.includes("LSE"));
        const frankfurtIndex = updatedMarkets.findIndex(m => m.name.toLowerCase().includes("frankfurt") || m.name.includes("FSX"));
        
        // If both markets are closed and waiting to open, OR both are open and waiting to close
        if ((frankfurt.status !== 'open' && london.status !== 'open' && 
             frankfurt.nextEvent.type === 'open' && london.nextEvent.type === 'open') ||
            (frankfurt.status === 'open' && london.status === 'open' && 
             frankfurt.nextEvent.type === 'close' && london.nextEvent.type === 'close')) {
          
          // Choose the Frankfurt next event time as the reference
          const sharedNextEventTime = frankfurt.nextEvent.time instanceof Date 
            ? new Date(frankfurt.nextEvent.time) 
            : new Date(frankfurt.nextEvent.time);
          
          // Update both markets to have the same next event time
          if (londonIndex !== -1) {
            updatedMarkets[londonIndex] = {
              ...updatedMarkets[londonIndex],
              nextEvent: {
                ...updatedMarkets[londonIndex].nextEvent,
                time: sharedNextEventTime
              }
            };
          }
          
          if (frankfurtIndex !== -1) {
            updatedMarkets[frankfurtIndex] = {
              ...updatedMarkets[frankfurtIndex],
              nextEvent: {
                ...updatedMarkets[frankfurtIndex].nextEvent,
                time: sharedNextEventTime
              }
            };
          }
          
          return updatedMarkets;
        }
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
