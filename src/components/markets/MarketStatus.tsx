
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
  marketSessions?: MarketSession[];
}

export const MarketStatus: React.FC<MarketStatusProps> = ({ 
  showDetails = false,
  customTitle,
  customSource,
  compact = false,
  marketSessions: propMarketSessions
}) => {
  let marketSessions: MarketSession[] = [];
  let dataSource: string = 'internal';
  let lastUpdated: Date | null = null;
  
  try {
    if (!propMarketSessions) {
      const marketsContext = useMarkets();
      marketSessions = marketsContext.marketSessions;
      dataSource = marketsContext.dataSource;
      lastUpdated = marketsContext.lastUpdated;
    } else {
      marketSessions = propMarketSessions;
    }
  } catch (error) {
    console.warn('MarketStatus: useMarkets context not available, using empty array');
    marketSessions = [];
  }

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

  const getSourceLabel = () => {
    if (customSource) return customSource;
    return dataSource === 'alpha-vantage' ? 'Alpha Vantage API' : 'World Markets API';
  };

  const formatCountdown = (market: any) => {
    try {
      if (!market.nextEvent || !market.nextEvent.time) {
        return 'Unknown';
      }
      
      const nextEventTime = market.nextEvent.time instanceof Date 
        ? market.nextEvent.time 
        : new Date(market.nextEvent.time);
        
      const adjustedTime = new Date(nextEventTime.getTime() - 60 * 60 * 1000);
      
      return getMarketTimeRemaining(adjustedTime);
    } catch (error) {
      console.error('Error formatting countdown:', error, market);
      return 'Error';
    }
  };

  const syncEuropeanMarketCountdowns = (markets: MarketSession[]): MarketSession[] => {
    try {
      const london = markets.find(m => m.name.toLowerCase().includes("london") || m.name.includes("LSE"));
      const frankfurt = markets.find(m => m.name.toLowerCase().includes("frankfurt") || m.name.includes("FSX"));
      
      if (frankfurt && london) {
        const updatedMarkets = [...markets];
        
        const londonIndex = updatedMarkets.findIndex(m => m.name.toLowerCase().includes("london") || m.name.includes("LSE"));
        const frankfurtIndex = updatedMarkets.findIndex(m => m.name.toLowerCase().includes("frankfurt") || m.name.includes("FSX"));
        
        if ((frankfurt.status !== 'open' && london.status !== 'open' && 
             frankfurt.nextEvent.type === 'open' && london.nextEvent.type === 'open') ||
            (frankfurt.status === 'open' && london.status === 'open' && 
             frankfurt.nextEvent.type === 'close' && london.nextEvent.type === 'close')) {
          
          const sharedNextEventTime = frankfurt.nextEvent.time instanceof Date 
            ? new Date(frankfurt.nextEvent.time) 
            : new Date(frankfurt.nextEvent.time);
          
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

  // Check if current time has passed market opening time and fix "opening-soon" status
  const fixMarketOpeningStatus = (markets: MarketSession[]): MarketSession[] => {
    const now = new Date();
    
    return markets.map(market => {
      // If market is marked as opening-soon but the opening time has passed, change to open
      if (market.status === 'opening-soon') {
        const nextEventTime = market.nextEvent.time instanceof Date 
          ? market.nextEvent.time 
          : new Date(market.nextEvent.time);
        
        if (now >= nextEventTime) {
          console.log(`Market ${market.name} should be open now. Current time: ${now.toISOString()}, Open time: ${nextEventTime.toISOString()}`);
          return {
            ...market,
            status: 'open',
            nextEvent: {
              type: 'close',
              time: nextEventTime
            }
          };
        }
      }
      return market;
    });
  };

  const synchronizedMarketSessions = fixMarketOpeningStatus(
    syncEuropeanMarketCountdowns(marketSessions)
  );

  console.log('MarketStatus - Market sessions:', synchronizedMarketSessions.map(m => ({
    name: m.name,
    status: m.status,
    nextEvent: m.nextEvent.type,
    nextEventTime: m.nextEvent.time,
    formattedCountdown: formatCountdown(m),
    currentTime: new Date().toISOString()
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
