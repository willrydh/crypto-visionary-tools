
import React, { useState, useEffect } from 'react';
import { Check, AlertTriangle, Info, Zap, Wifi, Database, Globe, BrainCircuit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTradingMode } from '@/hooks/useTradingMode';
import { cn } from '@/lib/utils';
import { 
  getModeIconBgClass, 
  getModeLightBgClass,
  getModeHeaderBgClass 
} from '@/components/trading/TradingModeStyles';
import { useIsMobile } from '@/hooks/use-mobile';

// Define system services
const systemServices = [
  {
    name: 'Bybit API',
    status: 'connected',
    icon: <Wifi className="h-4 w-4 text-green-500" />,
  },
  {
    name: 'Forex Factory',
    status: 'connected',
    icon: <Globe className="h-4 w-4 text-green-500" />,
  },
  {
    name: 'Market Data',
    status: 'connected',
    icon: <Database className="h-4 w-4 text-green-500" />,
  },
  {
    name: 'AI Engine',
    status: 'connected',
    icon: <BrainCircuit className="h-4 w-4 text-green-500" />,
  }
];

const WelcomeHeader = () => {
  const { tradingMode } = useTradingMode();
  const isMobile = useIsMobile();
  const [randomName] = useState(() => {
    const names = ['Trader', 'Captain', 'Professional', 'Champion'];
    return names[Math.floor(Math.random() * names.length)];
  });

  const [latencies, setLatencies] = useState(systemServices.map(service => ({
    value: Math.floor(Math.random() * (180 - 70) + 70),
    color: 'text-green-500'
  })));

  // Simulate changing latencies
  useEffect(() => {
    const interval = setInterval(() => {
      setLatencies(prev => 
        prev.map(item => {
          const change = Math.random() > 0.5 ? 1 : -1;
          const newValue = Math.max(50, Math.min(200, item.value + change * Math.floor(Math.random() * 5)));
          
          let color = 'text-green-500';
          if (newValue > 150) color = 'text-red-500';
          else if (newValue > 100) color = 'text-amber-500';
          
          return { value: newValue, color };
        })
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn(
      "w-full rounded-lg border border-border/40 p-4 mb-4 mt-6",
      "relative overflow-hidden shadow-sm",
      getModeLightBgClass(tradingMode)
    )}>
      <div className="relative z-10">
        <div className="flex flex-col mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center mb-1">
            <span className="whitespace-nowrap mr-2">Welcome, {randomName}</span>
            <Badge 
              variant="outline" 
              className={cn(
                "border-primary/30 min-w-[80px] text-[8px] flex items-center gap-1 justify-center px-1 h-4 whitespace-nowrap", 
                getModeIconBgClass(tradingMode)
              )}
            >
              <Zap className="h-2.5 w-2.5" />
              <span>AI-powered</span>
            </Badge>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isMobile 
              ? "AI trading assistant analyzing market data via Bybit API" 
              : "Your AI trading assistant is analyzing live market data via Bybit API to generate real-time signals and deep market insights"
            }
          </p>
        </div>
        
        <div className="border-t border-border/40 pt-3">
          <h3 className="text-sm sm:text-base font-medium mb-2 text-foreground">System Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {systemServices.map((service, index) => (
              <TooltipProvider key={service.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        {service.icon}
                        <span className="text-xs">{service.name}</span>
                      </div>
                      <Badge variant="outline" className={`${latencies[index].color} ml-auto text-[8px] h-4 min-w-[36px] flex justify-center`}>
                        {latencies[index].value}ms
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{service.name} status: {service.status}</p>
                    <p className="text-xs">Current latency: {latencies[index].value}ms</p>
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
