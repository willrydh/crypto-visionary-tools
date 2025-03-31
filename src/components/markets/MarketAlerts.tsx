
import React, { useEffect } from 'react';
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

const MarketAlerts: React.FC = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Function to check market events
    const checkMarketEvents = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeString = `${currentHours}:${currentMinutes.toString().padStart(2, '0')}`;
      
      // For demo purposes, check if any event is happening "now"
      // In a real app, we would check against actual timestamps
      marketSchedule.forEach(event => {
        // This is a simplified check - in production, this would use proper time zone calculations
        // For demo purposes, we'll show a random alert occasionally
        if (Math.random() < 0.2) { // 20% chance to show an alert when the component loads
          // Display the notification using toast
          showMarketAlert(event);
        }
      });
    };

    // Check when component mounts
    checkMarketEvents();
    
    // Set interval to periodically check (every 1 minute in production)
    // For demo, we'll use a longer interval
    const intervalId = setInterval(checkMarketEvents, 300000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const showMarketAlert = (event: MarketEvent) => {
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

  return null; // This component doesn't render anything, it just handles alerts
};

export default MarketAlerts;
