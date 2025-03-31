import React, { useState, useEffect } from 'react';
import { Check, AlertTriangle, Info, Zap, Wifi, Database, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

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
    name: 'Signal Engine',
    status: 'connected',
    latency: 146,
    icon: <Zap className="h-4 w-4" />,
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
      {/* Chart Background - Keep as a subtle visual element */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-end">
        <img 
          src="/lovable-uploads/c838292a-0224-48a0-a205-21fde8947f28.png" 
          alt="Chart Background" 
          className="h-full opacity-10 object-cover object-right"
        />
      </div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2 text-white">Welcome back, {randomName}</h2>
        <p className="text-gray-300 mb-6">
          Your AI-powered trading companion - gain the edge with real-time signals and deep market analysis
        </p>
        
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
