
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

const backgroundImages = [
  "/lovable-uploads/c838292a-0224-48a0-a205-21fde8947f28.png",
  "/lovable-uploads/fc481dcb-6dc5-4724-8938-9fef96e6feaf.png",
  "/lovable-uploads/83cd3ce3-8a61-4043-aa68-18467165dbc3.png"
];

const WelcomeHeader = () => {
  const [randomName] = useState(() => {
    const names = ['Trader', 'Captain', 'Professional', 'Champion'];
    return names[Math.floor(Math.random() * names.length)];
  });

  const [latencies, setLatencies] = useState(systemServices.map(service => service.latency));
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % backgroundImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (latency: number) => {
    if (latency < 100) return 'text-green-500';
    if (latency < 150) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="w-full bg-card rounded-lg border border-border p-6 mb-6 relative overflow-hidden">
      {/* Background Slider with Blur Effect */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={img} 
              alt={`Chart Background ${index + 1}`} 
              className="object-cover w-full h-full"
            />
          </div>
        ))}
        <div className="absolute inset-0 backdrop-blur-md bg-card/50"></div>
      </div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {randomName}</h2>
        <p className="text-muted-foreground mb-6">
          Your AI-powered trading companion - gain the edge with real-time signals and deep market analysis
        </p>
        
        <div className="border-t border-border pt-4">
          <h3 className="text-lg font-medium mb-4">System Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {systemServices.map((service, index) => (
              <TooltipProvider key={service.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
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
