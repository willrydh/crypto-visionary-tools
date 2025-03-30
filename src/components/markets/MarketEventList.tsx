
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MarketEvent {
  id: string;
  type: 'pump' | 'dump';
  symbol: string;
  change: number;
  timestamp: Date;
  reason?: string;
}

// Mock data for market events
const mockPumpEvents: MarketEvent[] = [
  {
    id: 'pump-1',
    type: 'pump',
    symbol: 'BTC/USDT',
    change: 5.2,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    reason: 'Spot ETF inflows surge'
  },
  {
    id: 'pump-2',
    type: 'pump',
    symbol: 'ETH/USDT',
    change: 3.8,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    reason: 'Protocol upgrade announcement'
  },
  {
    id: 'pump-3',
    type: 'pump',
    symbol: 'SOL/USDT',
    change: 7.1,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    reason: 'Major partnership revealed'
  },
  {
    id: 'pump-4',
    type: 'pump',
    symbol: 'BNB/USDT',
    change: 4.5,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    reason: 'Token burn event completion'
  },
  {
    id: 'pump-5',
    type: 'pump',
    symbol: 'BTC/USDT',
    change: 6.3,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    reason: 'Institutional buying pressure'
  }
];

const mockDumpEvents: MarketEvent[] = [
  {
    id: 'dump-1',
    type: 'dump',
    symbol: 'BTC/USDT',
    change: -4.7,
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    reason: 'Large whale selling activity'
  },
  {
    id: 'dump-2',
    type: 'dump',
    symbol: 'DOGE/USDT',
    change: -8.2,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    reason: 'Influencer negative comments'
  },
  {
    id: 'dump-3',
    type: 'dump',
    symbol: 'XRP/USDT',
    change: -5.6,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    reason: 'Regulatory concerns'
  },
  {
    id: 'dump-4',
    type: 'dump',
    symbol: 'ADA/USDT',
    change: -3.9,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
    reason: 'Development delay announcement'
  },
  {
    id: 'dump-5',
    type: 'dump',
    symbol: 'ETH/USDT',
    change: -6.8,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 60), // 2.5 days ago
    reason: 'DeFi protocol exploit'
  }
];

interface MarketEventListProps {
  eventType?: 'pump' | 'dump' | 'all';
  limit?: number;
}

const MarketEventList: React.FC<MarketEventListProps> = ({ 
  eventType = 'all',
  limit = 5 
}) => {
  const [showList, setShowList] = useState(false);
  const [selectedType, setSelectedType] = useState<'pump' | 'dump' | 'all'>(eventType);
  
  // Get events based on selected type
  const events = selectedType === 'all' 
    ? [...mockPumpEvents, ...mockDumpEvents].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit)
    : selectedType === 'pump' 
      ? mockPumpEvents.slice(0, limit) 
      : mockDumpEvents.slice(0, limit);
  
  const toggleList = (type: 'pump' | 'dump' | 'all') => {
    if (selectedType === type && showList) {
      setShowList(false);
    } else {
      setSelectedType(type);
      setShowList(true);
    }
  };
  
  return (
    <div className="space-y-4">
      {showList && (
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              {selectedType === 'pump' ? (
                <>
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  Market Pumps
                </>
              ) : selectedType === 'dump' ? (
                <>
                  <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                  Market Dumps
                </>
              ) : (
                <>
                  <Info className="h-5 w-5 text-primary mr-2" />
                  Market Events
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">No events to display</p>
              ) : (
                events.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      {event.type === 'pump' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">{event.symbol}</div>
                        <div className="text-xs text-muted-foreground">{event.reason}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={event.type === 'pump' ? "bg-green-500" : "bg-red-500"}>
                        {event.change > 0 ? '+' : ''}{event.change}%
                      </Badge>
                      <div className="text-xs text-muted-foreground flex items-center mt-1 justify-end">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketEventList;
