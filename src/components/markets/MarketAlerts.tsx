
import React, { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Bell, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MarketEvent {
  name: string;
  time: string;
  type: 'open' | 'close';
  impact: 'high' | 'medium' | 'low';
}

// Sample market schedule for demonstration purposes
const marketSchedule: MarketEvent[] = [
  { name: 'NYSE', time: '9:30', type: 'open', impact: 'high' },
  { name: 'London', time: '11:30', type: 'close', impact: 'medium' },
  { name: 'NYSE', time: '16:00', type: 'close', impact: 'high' },
  { name: 'Tokyo', time: '19:00', type: 'open', impact: 'medium' },
  { name: 'Sydney', time: '18:00', type: 'open', impact: 'low' },
];

interface MarketAlertsProps {
  soundEnabled?: boolean;
}

const MarketAlerts: React.FC<MarketAlertsProps> = ({ soundEnabled = true }) => {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('/notification-sound.mp3'); // You'll need to add this file to public/
    audioRef.current.volume = 0.5;
    
    // Function to check market events
    const checkMarketEvents = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      
      // Format current time as HH:MM for comparison
      const currentTimeString = `${currentHours}:${currentMinutes.toString().padStart(2, '0')}`;
      
      // Check if any scheduled events are happening now
      marketSchedule.forEach(event => {
        // This is a simplified check - in production, you would match exact times
        // For demonstration, we'll just randomly trigger events occasionally
        if (Math.random() < 0.1) { // 10% chance of showing an alert on each interval
          showMarketAlert(event);
        }
      });
      
      // For demonstration purposes, also check for real-time market data changes
      if (Math.random() < 0.15) { // 15% chance of price alert
        const symbols = ['BTC/USD', 'ETH/USD', 'S&P 500', 'NASDAQ', 'EURUSD'];
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        const isUp = Math.random() > 0.5;
        const changePercent = (Math.random() * 2 + 0.5).toFixed(2);
        
        showPriceAlert(randomSymbol, isUp, changePercent);
      }
    };

    // Check when component mounts
    checkMarketEvents();
    
    // Set interval to periodically check (every 30 seconds in this demo)
    const intervalId = setInterval(checkMarketEvents, 30000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const showMarketAlert = (event: MarketEvent) => {
    // Play sound if enabled
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio playback error:", e));
    }
    
    let icon = event.type === 'open' ? <ArrowUpRight className="h-4 w-4 text-green-500" /> : <ArrowDownRight className="h-4 w-4 text-red-500" />;
    let title = `${event.name} Market ${event.type === 'open' ? 'Opening' : 'Closing'}`;
    let description = `${event.name} market is now ${event.type === 'open' ? 'open' : 'closing'} at ${event.time}. ${event.impact === 'high' ? 'Expect high volatility' : event.impact === 'medium' ? 'Moderate volatility expected' : 'Low volatility expected'}.`;
    
    toast({
      title,
      description,
      variant: event.impact === 'high' ? "destructive" : "default",
      duration: 8000,
    });
  };
  
  const showPriceAlert = (symbol: string, isUp: boolean, changePercent: string) => {
    // Play sound if enabled
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio playback error:", e));
    }
    
    const title = `${symbol} Price Alert`;
    const description = `${symbol} has ${isUp ? 'increased' : 'decreased'} by ${changePercent}% in the last hour.`;
    
    toast({
      title,
      description,
      variant: isUp ? "default" : "destructive",
      duration: 6000,
    });
  };

  // This component doesn't render anything visible, it just handles alerts
  return null;
};

export default MarketAlerts;
