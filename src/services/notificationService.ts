
import { toast } from '@/hooks/use-toast';
import { MarketSession } from '@/contexts/MarketsContext';
import { getMarketTimeRemaining } from '@/utils/dateUtils';

// Market event notification types
export type MarketEventType = 'opening-soon' | 'closing-soon' | 'opened' | 'closed';

// Options for notification subscribers
interface NotificationOptions {
  openingSoonMinutes: number[];
  closingSoonMinutes: number[];
  showOpened: boolean;
  showClosed: boolean;
}

// Default notification options
const defaultOptions: NotificationOptions = {
  openingSoonMinutes: [60, 30, 5], // 1 hour, 30 min, 5 min alerts
  closingSoonMinutes: [30, 5],     // 30 min, 5 min alerts
  showOpened: true,
  showClosed: true
};

// Track which notifications have been sent to avoid duplicates
const sentNotifications = new Map<string, Date>();

// Create a key for the notification
const getNotificationKey = (marketName: string, eventType: MarketEventType, minutesBefore?: number) => {
  if (minutesBefore) {
    return `${marketName}-${eventType}-${minutesBefore}`;
  }
  return `${marketName}-${eventType}`;
};

// Check if notification was already sent recently
const wasNotificationSentRecently = (key: string) => {
  const lastSent = sentNotifications.get(key);
  if (!lastSent) return false;
  
  // Prevent sending the same notification for at least 12 hours
  const hoursSinceLastSent = (new Date().getTime() - lastSent.getTime()) / (1000 * 60 * 60);
  return hoursSinceLastSent < 12;
};

// Mark a notification as sent
const markNotificationAsSent = (key: string) => {
  sentNotifications.set(key, new Date());
};

// Function to check market sessions and send notifications
export const checkMarketNotifications = (
  marketSessions: MarketSession[], 
  options: NotificationOptions = defaultOptions
) => {
  if (!marketSessions || marketSessions.length === 0) return;
  
  const now = new Date();
  
  marketSessions.forEach(market => {
    const { name, status, nextEvent } = market;
    
    // Skip if there's no next event
    if (!nextEvent || !nextEvent.time) return;
    
    const eventTime = nextEvent.time instanceof Date ? nextEvent.time : new Date(nextEvent.time);
    const diffMs = eventTime.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    
    // Market about to open
    if (nextEvent.type === 'open' && options.openingSoonMinutes.includes(diffMinutes)) {
      const notificationKey = getNotificationKey(name, 'opening-soon', diffMinutes);
      
      if (!wasNotificationSentRecently(notificationKey)) {
        toast({
          title: `${name} Market Opening Soon`,
          description: `Opens in ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`,
          // Replace JSX with a string for the icon variant
          variant: "default",
          duration: 6000,
        });
        
        markNotificationAsSent(notificationKey);
      }
    }
    
    // Market about to close
    if (nextEvent.type === 'close' && options.closingSoonMinutes.includes(diffMinutes)) {
      const notificationKey = getNotificationKey(name, 'closing-soon', diffMinutes);
      
      if (!wasNotificationSentRecently(notificationKey)) {
        toast({
          title: `${name} Market Closing Soon`,
          description: `Closes in ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`,
          // Replace JSX with a string for the icon variant
          variant: "default",
          duration: 6000,
        });
        
        markNotificationAsSent(notificationKey);
      }
    }
    
    // Market just opened (within last minute)
    if (status === 'open' && options.showOpened) {
      const openedRecently = diffMinutes >= -1 && diffMinutes <= 0 && nextEvent.type === 'close';
      const notificationKey = getNotificationKey(name, 'opened');
      
      if (openedRecently && !wasNotificationSentRecently(notificationKey)) {
        toast({
          title: `${name} Market Now Open`,
          description: `Trading has begun for the ${name} session`,
          // Replace JSX with a string for the icon variant
          variant: "default",
          duration: 5000,
        });
        
        markNotificationAsSent(notificationKey);
      }
    }
    
    // Market just closed (within last minute)
    if (status === 'closed' && options.showClosed) {
      const closedRecently = diffMinutes >= -1 && diffMinutes <= 0 && nextEvent.type === 'open';
      const notificationKey = getNotificationKey(name, 'closed');
      
      if (closedRecently && !wasNotificationSentRecently(notificationKey)) {
        toast({
          title: `${name} Market Now Closed`,
          description: `Trading has ended for the ${name} session`,
          // Replace JSX with a string for the icon variant
          variant: "default",
          duration: 5000,
        });
        
        markNotificationAsSent(notificationKey);
      }
    }
  });
};

// Initialize market notifications
export const initializeMarketNotifications = (marketSessions: MarketSession[]) => {
  // First check immediately
  checkMarketNotifications(marketSessions);
  
  // Then set up interval checking (every minute)
  const interval = setInterval(() => {
    checkMarketNotifications(marketSessions);
  }, 60000);
  
  // Return cleanup function
  return () => clearInterval(interval);
};
