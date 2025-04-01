
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Zap, TrendingDown, TrendingUp, ArrowUpRight, Clock } from 'lucide-react';
import { formatTimeUntil } from '@/utils/dateUtils';

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
  // Market hours in UTC
  const marketHours = {
    nyseOpen: { hour: 13, minute: 30 },      // NYSE opens 9:30 AM ET (13:30 UTC)
    londonClose: { hour: 15, minute: 30 },   // London closes 15:30 UTC
    nyseClose: { hour: 20, minute: 0 },      // NYSE closes 4:00 PM ET (20:00 UTC)
    tokyoOpen: { hour: 0, minute: 0 }        // Tokyo opens 0:00 UTC (9:00 AM JST)
  };

  // State to hold the countdown timers
  const [countdowns, setCountdowns] = useState<{[key: string]: string}>({});
  
  // Function to get the next occurrence of a specific market event
  const getNextOccurrence = (hour: number, minute: number): Date => {
    const now = new Date();
    const targetTime = new Date(now);
    targetTime.setUTCHours(hour, minute, 0, 0);
    
    // If the target time has already passed today, set it for tomorrow
    if (targetTime <= now) {
      targetTime.setUTCDate(targetTime.getUTCDate() + 1);
    }
    
    // If it's weekend (Saturday or Sunday), adjust to next Monday
    const dayOfWeek = targetTime.getUTCDay();
    if (dayOfWeek === 0) { // Sunday
      targetTime.setUTCDate(targetTime.getUTCDate() + 1);
    } else if (dayOfWeek === 6) { // Saturday
      targetTime.setUTCDate(targetTime.getUTCDate() + 2);
    }
    
    return targetTime;
  };

  // Update the countdown every minute
  useEffect(() => {
    const updateCountdowns = () => {
      const nyseOpenTime = getNextOccurrence(marketHours.nyseOpen.hour, marketHours.nyseOpen.minute);
      const londonCloseTime = getNextOccurrence(marketHours.londonClose.hour, marketHours.londonClose.minute);
      const nyseCloseTime = getNextOccurrence(marketHours.nyseClose.hour, marketHours.nyseClose.minute);
      const tokyoOpenTime = getNextOccurrence(marketHours.tokyoOpen.hour, marketHours.tokyoOpen.minute);
      
      setCountdowns({
        nyseOpen: formatTimeUntil(nyseOpenTime),
        londonClose: formatTimeUntil(londonCloseTime),
        nyseClose: formatTimeUntil(nyseCloseTime),
        tokyoOpen: formatTimeUntil(tokyoOpenTime)
      });
    };
    
    // Initial update
    updateCountdowns();
    
    // Set interval to update every minute
    const interval = setInterval(updateCountdowns, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Sample market session data with dynamically calculated countdowns
  const marketSessions = [
    {
      name: "NYSE Open",
      time: `${marketHours.nyseOpen.hour}:${marketHours.nyseOpen.minute.toString().padStart(2, '0')} UTC`,
      countdown: countdowns.nyseOpen || "Calculating...",
      impact: "High",
      volatility: 85,
      pumpFrequency: 62,
      dumpFrequency: 38,
      status: "upcoming"
    },
    {
      name: "London Close",
      time: `${marketHours.londonClose.hour}:${marketHours.londonClose.minute.toString().padStart(2, '0')} UTC`,
      countdown: countdowns.londonClose || "Calculating...",
      impact: "Medium",
      volatility: 65,
      pumpFrequency: 51,
      dumpFrequency: 49,
      status: "upcoming"
    },
    {
      name: "NYSE Close",
      time: `${marketHours.nyseClose.hour}:${marketHours.nyseClose.minute.toString().padStart(2, '0')} UTC`,
      countdown: countdowns.nyseClose || "Calculating...",
      impact: "High",
      volatility: 78,
      pumpFrequency: 45,
      dumpFrequency: 55,
      status: "upcoming"
    },
    {
      name: "Tokyo Open",
      time: `${marketHours.tokyoOpen.hour}:${marketHours.tokyoOpen.minute.toString().padStart(2, '0')} UTC`,
      countdown: countdowns.tokyoOpen || "Calculating...",
      impact: "Medium",
      volatility: 58,
      pumpFrequency: 53,
      dumpFrequency: 47,
      status: "upcoming"
    }
  ];

  // Check if any market is currently live
  useEffect(() => {
    const checkLiveMarkets = () => {
      const now = new Date();
      const utcHour = now.getUTCHours();
      const utcMinute = now.getUTCMinutes();
      const utcDay = now.getUTCDay();
      
      // Only check on weekdays (1-5 for Monday-Friday)
      if (utcDay >= 1 && utcDay <= 5) {
        // Create updated marketSessions
        const updatedSessions = [...marketSessions];
        
        // NYSE Open (13:30-20:00 UTC)
        if (utcHour > marketHours.nyseOpen.hour || 
            (utcHour === marketHours.nyseOpen.hour && utcMinute >= marketHours.nyseOpen.minute)) {
          if (utcHour < marketHours.nyseClose.hour) {
            updatedSessions[0].status = "active";
          }
        }
        
        // London Close (approaching 15:30 UTC)
        if (utcHour === marketHours.londonClose.hour && 
            utcMinute >= marketHours.londonClose.minute - 15 && 
            utcMinute <= marketHours.londonClose.minute + 15) {
          updatedSessions[1].status = "active";
        }
        
        // NYSE Close (approaching 20:00 UTC)
        if (utcHour === marketHours.nyseClose.hour && 
            utcMinute >= marketHours.nyseClose.minute - 15 && 
            utcMinute <= marketHours.nyseClose.minute + 15) {
          updatedSessions[2].status = "active";
        }
        
        // Tokyo Open (0:00-9:00 UTC)
        if (utcHour >= marketHours.tokyoOpen.hour && utcHour < 9) {
          updatedSessions[3].status = "active";
        }
      }
    };
    
    // Check immediately and then every 5 minutes
    checkLiveMarkets();
    const interval = setInterval(checkLiveMarkets, 300000);
    
    return () => clearInterval(interval);
  }, []);

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
    return <span className="flex items-center gap-1 text-muted-foreground text-xs"><Clock className="w-3 h-3" /> {marketSessions.find(s => s.name === status)?.countdown || "Upcoming"}</span>;
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
