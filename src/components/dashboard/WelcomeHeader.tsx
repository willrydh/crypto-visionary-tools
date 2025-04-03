
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
      "w-full rounded-lg border border-border/40 p-4 sm:p-6 mb-6 relative overflow-hidden",
      getModeLightBgClass(tradingMode)
    )}>
      <div className="relative z-10">
        <div className="flex flex-col mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center mb-1 flex-wrap">
            Welcome back, {randomName}
            <Badge variant="outline" className={cn("ml-2 sm:ml-3 border-primary/30 text-[10px] flex items-center gap-1", getModeIconBgClass(tradingMode))}>
              <Zap className="h-3 w-3" />
              <span>AI-powered</span>
            </Badge>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {isMobile 
              ? "AI trading assistant analyzing market data via Bybit API" 
              : "Your AI trading assistant is analyzing live market data via Bybit API to generate real-time signals and deep market insights"
            }
          </p>
        </div>
        
        <div className="border-t border-border/40 pt-4">
          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-foreground">System Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {systemServices.map((service, index) => (
              <TooltipProvider key={service.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                        {service.icon}
                        <span className="text-xs sm:text-sm">{service.name}</span>
                      </div>
                      <Badge variant="outline" className={`${latencies[index].color} ml-auto text-[9px] sm:text-[10px] h-4 sm:h-5 min-w-[40px] sm:min-w-[52px] flex justify-center`}>
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
