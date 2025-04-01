
import React, { useState, useEffect } from 'react';
import { Check, AlertTriangle, Info, Zap, Wifi, Database, Globe, BrainCircuit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TradingModeSelector } from '@/components/trading/TradingModeSelector';

// Define system services
const systemServices = [
  {
    name: 'Bybit API',
    status: 'connected',
    latency: 72,
    icon: <Wifi className="h-4 w-4" />,
  },
  {
    name: 'Forex Factory',
    status: 'connected',
    latency: 87,
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: 'Market Data',
    status: 'connected',
    latency: 153,
    icon: <Database className="h-4 w-4" />,
  },
  {
    name: 'AI Engine',
    status: 'connected',
    latency: 146,
    icon: <BrainCircuit className="h-4 w-4" />,
  }
];

const WelcomeHeader = () => {
  const [randomName] = useState(() => {
    const names = ['Trader', 'Captain', 'Professional', 'Champion'];
    return names[Math.floor(Math.random() * names.length)];
  });

  const [latencies, setLatencies] = useState(systemServices.map(service => service.latency));

  // Simulate changing latencies
  useEffect(() => {
    const interval = setInterval(() => {
      setLatencies(prev => 
        prev.map(latency => {
          const change = Math.random() > 0.5 ? 1 : -1;
          return Math.max(50, Math.min(200, latency + change * Math.floor(Math.random() * 5)));
        })
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (latency: number) => {
    if (latency < 100) return 'text-green-500';
    if (latency < 150) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="w-full bg-[#1A1F2C] rounded-lg border border-border/40 p-6 mb-6 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex flex-col mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center mb-1">
            Welcome back, {randomName}
            <Badge variant="outline" className="ml-3 bg-primary/10 border-primary/30">AI-Powered Trading</Badge>
          </h2>
          <p className="text-gray-300">
            Your AI trading assistant is analyzing live market data via Bybit API to generate real-time signals and deep market insights
          </p>
        </div>
        
        {/* Trading Mode Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-white">Trading Mode</h3>
          <TradingModeSelector />
        </div>
        
        <div className="border-t border-border/40 pt-4">
          <h3 className="text-lg font-medium mb-4 text-white">System Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {systemServices.map((service, index) => (
              <TooltipProvider key={service.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                        {service.icon}
                        <span className="text-sm">{service.name}</span>
                      </div>
                      <Badge variant="outline" className={`${getStatusColor(latencies[index])} ml-auto`}>
                        {latencies[index]}ms
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{service.name} status: {service.status}</p>
                    <p className="text-xs">Current latency: {latencies[index]}ms</p>
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
