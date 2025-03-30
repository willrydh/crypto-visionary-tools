
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface MarketSessionStatsProps {
  title?: string;
}

export const MarketSessionStats: React.FC<MarketSessionStatsProps> = ({
  title = "Market Session Statistics"
}) => {
  // Simulated market session data
  const marketSessions = [
    {
      name: "New York Open",
      icon: <Sun className="h-4 w-4 text-amber-500" />,
      pumpPercentage: 62,
      dumpPercentage: 38,
      volatility: 'High',
      timeRange: '14:30 - 16:30 UTC',
    },
    {
      name: "Tokyo Open",
      icon: <Sun className="h-4 w-4 text-blue-500" />,
      pumpPercentage: 48,
      dumpPercentage: 52,
      volatility: 'Medium',
      timeRange: '00:00 - 02:00 UTC',
    },
    {
      name: "London Open",
      icon: <Sun className="h-4 w-4 text-indigo-500" />,
      pumpPercentage: 57,
      dumpPercentage: 43,
      volatility: 'High',
      timeRange: '08:00 - 10:00 UTC',
    },
    {
      name: "Weekend Gap",
      icon: <Moon className="h-4 w-4 text-purple-500" />,
      pumpPercentage: 54,
      dumpPercentage: 46,
      volatility: 'Extreme',
      timeRange: 'Sunday 23:00 UTC',
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Historical pump/dump patterns during market sessions over the last 90 days
        </p>
        
        <div className="space-y-4">
          {marketSessions.map((session, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  {session.icon}
                  <span className="font-medium text-sm">{session.name}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {session.timeRange}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-0.5 text-sm">
                <div className="flex items-center">
                  <TrendingUp className="h-3.5 w-3.5 text-green-500 mr-1" />
                  <span>Pump</span>
                </div>
                <span className="text-green-500">{session.pumpPercentage}%</span>
              </div>
              <Progress value={session.pumpPercentage} className="h-1.5 bg-muted" />
              
              <div className="flex items-center justify-between mb-0.5 mt-2 text-sm">
                <div className="flex items-center">
                  <TrendingDown className="h-3.5 w-3.5 text-red-500 mr-1" />
                  <span>Dump</span>
                </div>
                <span className="text-red-500">{session.dumpPercentage}%</span>
              </div>
              <Progress value={session.dumpPercentage} className="h-1.5 bg-muted" />
              
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-muted-foreground">Volatility:</span>
                <span className={`font-medium ${
                  session.volatility === 'High' ? 'text-amber-500' : 
                  session.volatility === 'Extreme' ? 'text-red-500' : 
                  'text-blue-500'
                }`}>
                  {session.volatility}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketSessionStats;
