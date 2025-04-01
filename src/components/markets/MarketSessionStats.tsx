
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Zap, TrendingDown, TrendingUp, ArrowUpRight, Clock } from 'lucide-react';
import { 
  getPreciseMarketTime,
  getLocalTimeDisplay,
  getMarketTimeRemaining
} from '@/utils/dateUtils';
import { useMarkets } from '@/hooks/useMarkets';
import { fetchMarketStatistics } from '@/services/alphaVantageService';
import { DataSourceIndicator } from '@/components/ui/data-source-indicator';

interface MarketSessionStatsProps {
  title?: string;
  asianSessionStart?: number;
  europeanSessionStart?: number;
  usSessionStart?: number;
}

const MarketSessionStats = ({ 
  title = "Market Session Impact",
  asianSessionStart,
  europeanSessionStart,
  usSessionStart
}: MarketSessionStatsProps) => {
  const { marketSessions, dataSource } = useMarkets();
  
  // State to hold the countdown timers
  const [countdowns, setCountdowns] = useState<{[key: string]: string}>({});
  // State to track active market sessions
  const [activeMarkets, setActiveMarkets] = useState<{[key: string]: boolean}>({});
  // State for market stats
  const [marketStats, setMarketStats] = useState<any>({});
  
  // Market sessions data
  const [marketSessionData, setMarketSessionData] = useState([
    {
      name: "NYSE Open",
      time: "",
      countdown: "Calculating...",
      impact: "High",
      volatility: 85,
      pumpFrequency: 62,
      dumpFrequency: 38,
      status: "upcoming"
    },
    {
      name: "London Close",
      time: "",
      countdown: "Calculating...",
      impact: "Medium",
      volatility: 65,
      pumpFrequency: 51,
      dumpFrequency: 49,
      status: "upcoming"
    },
    {
      name: "NYSE Close",
      time: "",
      countdown: "Calculating...",
      impact: "High",
      volatility: 78,
      pumpFrequency: 45,
      dumpFrequency: 55,
      status: "upcoming"
    },
    {
      name: "Tokyo Open",
      time: "",
      countdown: "Calculating...",
      impact: "Medium",
      volatility: 58,
      pumpFrequency: 53,
      dumpFrequency: 47,
      status: "upcoming"
    }
  ]);

  // Fetch market statistics
  useEffect(() => {
    const getMarketStats = async () => {
      const stats = await fetchMarketStatistics();
      if (stats) {
        setMarketStats(stats);
        
        // Update sessions with fetched statistics
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
            }
            return session;
          })
        );
      }
    };
    
    getMarketStats();
  }, []);

  // Update time displays based on market session data
  useEffect(() => {
    if (marketSessions.length > 0) {
      // Find relevant market sessions
      const nyse = marketSessions.find(m => m.name === "New York");
      const london = marketSessions.find(m => m.name === "London");
      const tokyo = marketSessions.find(m => m.name === "Tokyo");
      
      // Extract market hours from sessions
      if (nyse && london && tokyo) {
        // Market hours
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
        
        // Update session data with times from market sessions
        setMarketSessionData(prevSessions => 
          prevSessions.map(session => {
            if (session.name === "NYSE Open") {
              return {
                ...session,
                countdown: nyse.status === 'open' ? 'Now' : getMarketTimeRemaining(nyse.nextEvent.time),
                status: nyse.status === 'open' || nyse.status === 'opening-soon' ? 'active' : 'upcoming',
                time: nyse.hours.split('-')[0].trim() // First part of hours string
              };
            } else if (session.name === "London Close") {
              return {
                ...session,
                countdown: london.status === 'open' ? getMarketTimeRemaining(london.nextEvent.time) : 'After open',
                status: london.status === 'open' ? 'active' : 'upcoming',
                time: london.hours.split('-')[1].trim() // Second part of hours string
              };
            } else if (session.name === "NYSE Close") {
              return {
                ...session,
                countdown: nyse.status === 'open' ? getMarketTimeRemaining(nyse.nextEvent.time) : 'After open',
                status: nyse.status === 'open' ? 'active' : 'upcoming',
                time: nyse.hours.split('-')[1].trim() // Second part of hours string
              };
            } else if (session.name === "Tokyo Open") {
              return {
                ...session,
                countdown: tokyo.status === 'open' ? 'Now' : getMarketTimeRemaining(tokyo.nextEvent.time),
                status: tokyo.status === 'open' || tokyo.status === 'opening-soon' ? 'active' : 'upcoming',
                time: tokyo.hours.split('-')[0].trim() // First part of hours string
              };
            }
            return session;
          })
        );
      }
    }
  }, [marketSessions]);

  // Function to get the impact color
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

  // Function to get the status indicator
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
            <Badge variant="outline" className="bg-primary/5">
              <Clock className="h-3 w-3 mr-1" /> 
              Market Hours
            </Badge>
            <DataSourceIndicator 
              source={dataSource === 'alpha-vantage' ? 'Alpha Vantage' : 'Internal'} 
              isLive={true} 
              details="Market impact data calculated from historical patterns" 
            />
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
                <span>{session.time}</span>
                <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                  {session.countdown}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <div className="text-sm">
                    <span className="font-medium">{session.pumpFrequency}%</span> Pump Frequency
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <div className="text-sm">
                    <span className="font-medium">{session.dumpFrequency}%</span> Dump Frequency
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketSessionStats;
