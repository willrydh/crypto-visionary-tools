
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Zap, TrendingDown, TrendingUp, ArrowUpRight, Clock } from 'lucide-react';

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
  // Sample market session data with adjustable times based on props
  const getSessionTime = (baseHour: number, offsetHour?: number): string => {
    if (offsetHour === undefined) return `${baseHour}:00 AM ET`;
    const adjustedHour = baseHour + offsetHour;
    const hour = adjustedHour % 12 === 0 ? 12 : adjustedHour % 12;
    const amPm = adjustedHour < 12 || adjustedHour === 24 ? 'AM' : 'PM';
    return `${hour}:00 ${amPm} ET`;
  };

  // Default times that will be adjusted if props are provided
  const nyseOpenHour = 9;
  const londonCloseHour = 11;
  const nyseCloseHour = 16;
  const tokyoOpenHour = 19;

  // Applying adjustments if provided
  const adjustedNyseOpen = getSessionTime(nyseOpenHour, usSessionStart);
  const adjustedLondonClose = getSessionTime(londonCloseHour, europeanSessionStart);
  const adjustedNyseClose = getSessionTime(nyseCloseHour, usSessionStart);
  const adjustedTokyoOpen = getSessionTime(tokyoOpenHour, asianSessionStart);

  const marketSessions = [
    {
      name: "NYSE Open",
      time: adjustedNyseOpen,
      impact: "High",
      volatility: 85,
      pumpFrequency: 62,
      dumpFrequency: 38,
      status: "active"
    },
    {
      name: "London Close",
      time: adjustedLondonClose,
      impact: "Medium",
      volatility: 65,
      pumpFrequency: 51,
      dumpFrequency: 49,
      status: "upcoming"
    },
    {
      name: "NYSE Close",
      time: adjustedNyseClose,
      impact: "High",
      volatility: 78,
      pumpFrequency: 45,
      dumpFrequency: 55,
      status: "upcoming"
    },
    {
      name: "Tokyo Open",
      time: adjustedTokyoOpen,
      impact: "Medium",
      volatility: 58,
      pumpFrequency: 53,
      dumpFrequency: 47,
      status: "upcoming"
    }
  ];

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
  const getStatusIndicator = (status: string) => {
    if (status === 'active') {
      return <span className="flex items-center gap-1 text-green-500 text-xs font-medium"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Live</span>;
    }
    return <span className="flex items-center gap-1 text-muted-foreground text-xs"><Clock className="w-3 h-3" /> Upcoming</span>;
  };

  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="bg-card/50 p-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
          <Badge variant="outline" className="bg-primary/5">
            <Clock className="h-3 w-3 mr-1" /> 
            Market Hours
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid divide-y divide-border/30">
          {marketSessions.map((session, index) => (
            <div key={index} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{session.name}</h3>
                  <Badge variant="outline" className={getImpactColor(session.impact)}>
                    {session.impact}
                  </Badge>
                </div>
                {getStatusIndicator(session.status)}
              </div>
              
              <div className="text-sm text-muted-foreground mb-3">
                {session.time}
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
