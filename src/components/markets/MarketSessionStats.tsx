
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Zap, TrendingDown, TrendingUp, ArrowUpRight, Clock } from 'lucide-react';

interface MarketSessionStatsProps {
  title?: string;
}

const MarketSessionStats = ({ title = "Market Session Impact" }: MarketSessionStatsProps) => {
  // Sample market session data
  const marketSessions = [
    {
      name: "NYSE Open",
      time: "9:30 AM ET",
      impact: "High",
      volatility: 85,
      pumpFrequency: 62,
      dumpFrequency: 38,
      status: "active"
    },
    {
      name: "London Close",
      time: "11:30 AM ET",
      impact: "Medium",
      volatility: 65,
      pumpFrequency: 51,
      dumpFrequency: 49,
      status: "upcoming"
    },
    {
      name: "NYSE Close",
      time: "4:00 PM ET",
      impact: "High",
      volatility: 78,
      pumpFrequency: 45,
      dumpFrequency: 55,
      status: "upcoming"
    },
    {
      name: "Tokyo Open",
      time: "7:00 PM ET",
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
