
import React, { useState, useEffect } from 'react';
import { Check, AlertTriangle, Info, Zap, Wifi, Database, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ApiStatus {
  name: string;
  status: 'connected' | 'connecting' | 'error';
  latency?: number;
  icon: React.ReactNode;
}

export const WelcomeHeader = () => {
  const [userName, setUserName] = useState('Trader');
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    { name: 'Bybit API', status: 'connecting', icon: <Database className="h-4 w-4" /> },
    { name: 'Forex Factory', status: 'connecting', icon: <Globe className="h-4 w-4" /> },
    { name: 'Market Data', status: 'connecting', icon: <Zap className="h-4 w-4" /> },
    { name: 'Signal Engine', status: 'connecting', icon: <Wifi className="h-4 w-4" /> }
  ]);

  // Simulate API connections
  useEffect(() => {
    const statusTimeouts = apiStatuses.map((api, index) => {
      return setTimeout(() => {
        setApiStatuses(prev => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            status: Math.random() > 0.1 ? 'connected' : 'error',
            latency: Math.floor(Math.random() * 150) + 20
          };
          return updated;
        });
      }, 1000 + (index * 500));
    });

    return () => {
      statusTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return (
    <div className="bg-card/50 border border-border/40 rounded-lg p-4 mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1">Welcome back, {userName}</h2>
          <p className="text-muted-foreground">
            Your AI-powered trading companion - gain the edge with real-time signals and deep market analysis
          </p>
        </div>
        
        <div className="w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
          <div className="text-sm font-medium mb-2">System Status</div>
          <div className="grid grid-cols-2 gap-3">
            {apiStatuses.map((api) => (
              <TooltipProvider key={api.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5">
                      {api.icon}
                      <span className="text-sm">{api.name}</span>
                      {api.status === 'connected' ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 ml-auto">
                          <Check className="h-3 w-3 mr-1" />
                          {api.latency}ms
                        </Badge>
                      ) : api.status === 'connecting' ? (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 ml-auto">
                          <Info className="h-3 w-3 mr-1" />
                          Connecting
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 ml-auto">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Error
                        </Badge>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {api.status === 'connected' ? (
                      <>Successfully connected to {api.name} with {api.latency}ms latency</>
                    ) : api.status === 'connecting' ? (
                      <>Establishing connection to {api.name}...</>
                    ) : (
                      <>Connection failed. Check your network or API credentials</>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
