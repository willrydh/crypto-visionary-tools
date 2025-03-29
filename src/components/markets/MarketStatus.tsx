
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from 'lucide-react';
import { formatTimeUntil } from '@/utils/dateUtils';
import { useMarkets } from '@/hooks/useMarkets';

export const MarketStatus: React.FC = () => {
  const { marketSessions, isLoading, updateMarketSessions, lastUpdated } = useMarkets();
  
  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'open':
        return <Badge className="bg-green-500 text-white">OPEN</Badge>;
      case 'closed':
        return <Badge variant="outline">CLOSED</Badge>;
      case 'opening-soon':
        return <Badge className="bg-yellow-500 text-white">OPENING SOON</Badge>;
      default:
        return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Market Sessions</CardTitle>
          <Badge variant={isLoading ? "outline" : "secondary"} className="cursor-pointer" onClick={updateMarketSessions}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && marketSessions.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            marketSessions.map((session) => (
              <div key={session.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{session.name}</span>
                  {getStatusBadge(session.status)}
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>{session.hours}</span>
                  <span>
                    {session.nextEvent.type.charAt(0).toUpperCase() + session.nextEvent.type.slice(1)}{" "}
                    {formatTimeUntil(session.nextEvent.time)}
                  </span>
                </div>
                <div className="h-[1px] bg-muted my-2" />
              </div>
            ))
          )}
          
          <div className="mt-2 text-xs text-center text-muted-foreground">
            Crypto market is open 24/7
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
