import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Zap, TrendingDown, TrendingUp, ArrowUpRight, Clock, Building } from 'lucide-react';
import { 
  getPreciseMarketTime,
  getLocalTimeDisplay,
  getMarketTimeRemaining
} from '@/utils/dateUtils';
import { useMarkets } from '@/hooks/useMarkets';
import { fetchMarketStatistics, analyzeVolumePatterns } from '@/services/alphaVantageService';
import { DataSourceIndicator } from '@/components/ui/data-source-indicator';
import { MarketDataTooltip } from '@/components/ui/market-data-tooltip';

interface MarketSessionStatsProps {
  title?: string;
  asianSessionStart?: number;
  europeanSessionStart?: number;
  usSessionStart?: number;
  compact?: boolean;
}

interface MarketSessionData {
  name: string;
  time: string;
  countdown: string;
  impact: string;
  volatility: number;
  pumpFrequency: number;
  dumpFrequency: number;
  status: string;
  marketCap: string;
  lastOutcome?: string;
}

const MarketSessionStats = ({ 
  title = "Impact",
  asianSessionStart,
  europeanSessionStart,
  usSessionStart,
  compact = false
}: MarketSessionStatsProps) => {
  const { marketSessions, dataSource } = useMarkets();
  
  const [countdowns, setCountdowns] = useState<{[key: string]: string}>({});
  const [activeMarkets, setActiveMarkets] = useState<{[key: string]: boolean}>({});
  const [marketStats, setMarketStats] = useState<any>({});
  const [volumeAnalysis, setVolumeAnalysis] = useState<any>(null);
  
  const [marketSessionData, setMarketSessionData] = useState<MarketSessionData[]>([
    {
      name: "NYSE Open",
      time: "15:30",
      countdown: "Calculating...",
      impact: "High",
      volatility: 85,
      pumpFrequency: 62,
      dumpFrequency: 38,
      status: "upcoming",
      marketCap: "$25.62T"
    },
    {
      name: "London Close",
      time: "17:30",
      countdown: "Calculating...",
      impact: "Medium",
      volatility: 65,
      pumpFrequency: 51,
      dumpFrequency: 49,
      status: "upcoming",
      marketCap: "$3.83T"
    },
    {
      name: "NYSE Close",
      time: "22:00",
      countdown: "Calculating...",
      impact: "High",
      volatility: 78,
      pumpFrequency: 45,
      dumpFrequency: 55,
      status: "upcoming",
      marketCap: "$25.62T"
    },
    {
      name: "Tokyo Open",
      time: "00:00",
      countdown: "Calculating...",
      impact: "Medium",
      volatility: 58,
      pumpFrequency: 53,
      dumpFrequency: 47,
      status: "upcoming",
      marketCap: "$6.54T"
    },
    {
      name: "Nasdaq Open",
      time: "15:30",
      countdown: "Calculating...",
      impact: "High",
      volatility: 82,
      pumpFrequency: 58,
      dumpFrequency: 42,
      status: "upcoming",
      marketCap: "$19.51T"
    }
  ]);

  useEffect(() => {
    const getMarketData = async () => {
      const stats = await fetchMarketStatistics();
      if (stats) {
        setMarketStats(stats);
        
        setMarketSessionData(prevSessions => 
          prevSessions.map(session => {
            if (session.name === "NYSE Open" && stats.nyse) {
              return { 
                ...session, 
                volatility: stats.nyse.volatility,
                pumpFrequency: stats.nyse.pumpFrequency,
                dumpFrequency: stats.nyse.dumpFrequency
              };
            } else if (session.name === "London Close" && stats.london) {
              return { 
                ...session, 
                volatility: stats.london.volatility,
                pumpFrequency: stats.london.pumpFrequency,
                dumpFrequency: stats.london.dumpFrequency
              };
            } else if (session.name === "NYSE Close" && stats.nyse) {
              return { 
                ...session, 
                volatility: stats.nyse.volatility,
                pumpFrequency: stats.nyse.pumpFrequency,
                dumpFrequency: stats.nyse.dumpFrequency
              };
            } else if (session.name === "Tokyo Open" && stats.tokyo) {
              return { 
                ...session, 
                volatility: stats.tokyo.volatility,
                pumpFrequency: stats.tokyo.pumpFrequency,
                dumpFrequency: stats.tokyo.dumpFrequency
              };
            } else if (session.name === "Nasdaq Open" && stats.nasdaq) {
              return { 
                ...session, 
                volatility: stats.nasdaq.volatility,
                pumpFrequency: stats.nasdaq.pumpFrequency,
                dumpFrequency: stats.nasdaq.dumpFrequency
              };
            }
            return session;
          })
        );
      }
      
      try {
        const volumeData = await analyzeVolumePatterns('SPY');
        if (volumeData) {
          setVolumeAnalysis(volumeData);
        }
      } catch (error) {
        console.error('Error fetching volume analysis:', error);
      }
    };
    
    getMarketData();
  }, []);

  useEffect(() => {
    if (marketSessions.length > 0) {
      const nyse = marketSessions.find(m => m.name.includes("NYSE") || m.name.includes("New York"));
      const london = marketSessions.find(m => m.name.includes("London") || m.name.includes("LSE"));
      const tokyo = marketSessions.find(m => m.name.includes("Tokyo") || m.name.includes("TSE"));
      const nasdaq = marketSessions.find(m => m.name.includes("Nasdaq"));
      
      if (nyse && london && tokyo) {
        const nyseOpenEvent = nyse.status === 'open' ? 
          { type: 'close', time: nyse.nextEvent.time } : 
          { type: 'open', time: nyse.nextEvent.time };
        
        const nyseCloseEvent = nyse.status === 'open' ? 
          { type: 'close', time: nyse.nextEvent.time } : 
          { type: 'open', time: nyse.nextEvent.time };
        
        const londonCloseEvent = london.status === 'open' ? 
          { type: 'close', time: london.nextEvent.time } : 
          { type: 'open', time: london.nextEvent.time };
        
        const tokyoOpenEvent = tokyo.status === 'open' ? 
          { type: 'close', time: tokyo.nextEvent.time } : 
          { type: 'open', time: tokyo.nextEvent.time };
        
        const nasdaqOpenEvent = nasdaq?.status === 'open' ? 
          { type: 'close', time: nasdaq.nextEvent.time } : 
          { type: 'open', time: nasdaq?.nextEvent.time || new Date() };
        
        setMarketSessionData(prevSessions => 
          prevSessions.map(session => {
            if (session.name === "NYSE Open") {
              return {
                ...session,
                countdown: nyse.status === 'open' ? 'Now' : getMarketTimeRemaining(nyse.nextEvent.time),
                status: nyse.status === 'open' || nyse.status === 'opening-soon' ? 'active' : 'upcoming',
                time: "15:30",
                marketCap: nyse.marketCap || session.marketCap
              };
            } else if (session.name === "London Close") {
              return {
                ...session,
                countdown: london.status === 'open' ? getMarketTimeRemaining(london.nextEvent.time) : 'After open',
                status: london.status === 'open' ? 'active' : 'upcoming',
                time: "17:30",
                marketCap: london.marketCap || session.marketCap
              };
            } else if (session.name === "NYSE Close") {
              return {
                ...session,
                countdown: nyse.status === 'open' ? getMarketTimeRemaining(nyse.nextEvent.time) : 'After open',
                status: nyse.status === 'open' ? 'active' : 'upcoming',
                time: "22:00",
                marketCap: nyse.marketCap || session.marketCap
              };
            } else if (session.name === "Tokyo Open") {
              return {
                ...session,
                countdown: tokyo.status === 'open' ? 'Now' : getMarketTimeRemaining(tokyo.nextEvent.time),
                status: tokyo.status === 'open' || tokyo.status === 'opening-soon' ? 'active' : 'upcoming',
                time: tokyo.hours ? tokyo.hours.split('-')[0].trim() : "00:00",
                marketCap: tokyo.marketCap || session.marketCap
              };
            } else if (session.name === "Nasdaq Open" && nasdaq) {
              return {
                ...session,
                countdown: nasdaq.status === 'open' ? 'Now' : getMarketTimeRemaining(nasdaq.nextEvent.time),
                status: nasdaq.status === 'open' || nasdaq.status === 'opening-soon' ? 'active' : 'upcoming',
                time: "15:30",
                marketCap: nasdaq.marketCap || session.marketCap
              };
            }
            return session;
          })
        );
      }
    }
  }, [marketSessions]);

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-200/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-500 border-amber-200/20';
      case 'low':
        return 'bg-green-500/10 text-green-500 border-green-200/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-200/20';
    }
  };

  const getStatusIndicator = (session: any) => {
    if (session.status === 'active') {
      return <span className="flex items-center gap-1 text-green-500 text-xs font-medium"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Live</span>;
    }
    return (
      <span className="flex items-center gap-1 text-muted-foreground text-xs">
        <Clock className="w-3 h-3" /> 
        {session.countdown || "Upcoming"}
      </span>
    );
  };

  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="bg-card/50 p-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-xs px-1.5 py-0">
              <Clock className="h-3 w-3 mr-1" /> 
              <span className="whitespace-nowrap">Hours</span>
            </Badge>
            <MarketDataTooltip 
              title="Data Source" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <p>Source: {dataSource === 'alpha-vantage' ? 'Alpha Vantage' : 'Internal'}</p>
              <p className="mt-1">Market impact data calculated from historical patterns</p>
            </MarketDataTooltip>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid divide-y divide-border/30">
          {marketSessionData.map((session, index) => (
            <div key={index} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{session.name}</h3>
                  <Badge variant="outline" className={getImpactColor(session.impact)}>
                    {session.impact}
                  </Badge>
                </div>
                {getStatusIndicator(session)}
              </div>
              
              <div className="text-sm text-muted-foreground mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  <span>{session.marketCap}</span>
                  <span className="text-muted-foreground/50 mx-2">•</span>
                  <span>{session.time}</span>
                </div>
                <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                  {session.countdown}
                </span>
              </div>
              
              <div className="bg-muted/30 rounded-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Market Impact Distribution</span>
                  <span className="text-xs font-medium">{session.volatility}% Volatility</span>
                </div>
                
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                        <span>Pump Frequency</span>
                      </div>
                      <span className="font-medium">{session.pumpFrequency}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500/80 to-green-400 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${session.pumpFrequency}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1">
                        <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                        <span>Dump Frequency</span>
                      </div>
                      <span className="font-medium">{session.dumpFrequency}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500/80 to-red-400 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${session.dumpFrequency}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {session.lastOutcome && (
                  <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/20">
                    Last session: {session.lastOutcome}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketSessionStats;
