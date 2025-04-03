
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  CheckCircle2,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import MarketAlerts from '@/components/markets/MarketAlerts';

// Sample notification data
const sampleNotifications = [
  {
    id: 1,
    type: 'market',
    title: 'NYSE Market Opening',
    description: 'New York Stock Exchange opens in 30 minutes',
    time: new Date(Date.now() - 25 * 60000),
    read: false,
    priority: 'medium',
    icon: 'bell'
  },
  {
    id: 2,
    type: 'alert',
    title: 'Price Alert: BTC/USDT',
    description: 'Bitcoin has crossed above your set threshold of $62,500',
    time: new Date(Date.now() - 120 * 60000),
    read: true,
    priority: 'high',
    icon: 'trending-up'
  },
  {
    id: 3,
    type: 'calendar',
    title: 'Economic Event',
    description: 'US Federal Reserve Interest Rate Decision in 2 hours',
    time: new Date(Date.now() - 300 * 60000),
    read: false,
    priority: 'high',
    icon: 'calendar'
  },
  {
    id: 4,
    type: 'market',
    title: 'London Stock Exchange Closing',
    description: 'London Stock Exchange will close in 5 minutes',
    time: new Date(Date.now() - 15 * 60000),
    read: false,
    priority: 'medium',
    icon: 'clock'
  },
  {
    id: 5,
    type: 'alert',
    title: 'Price Alert: ETH/USDT',
    description: 'Ethereum has dropped below your set threshold of $3,200',
    time: new Date(Date.now() - 180 * 60000),
    read: true,
    priority: 'medium',
    icon: 'trending-down'
  }
];

// Add more real-time generated market data notifications
const generateDynamicNotifications = () => {
  const currentTime = new Date();
  
  // Currency pairs
  const pairs = ['BTC/USDT', 'ETH/USDT', 'XRP/USDT', 'ADA/USDT', 'SOL/USDT'];
  const indices = ['S&P 500', 'NASDAQ', 'Dow Jones', 'FTSE 100', 'Nikkei 225'];
  const events = ['US GDP Release', 'ECB Press Conference', 'FOMC Meeting', 'Employment Report', 'Inflation Data'];
  
  const dynamicNotifications = [
    {
      id: 100,
      type: 'alert',
      title: `Price Alert: ${pairs[Math.floor(Math.random() * pairs.length)]}`,
      description: `${Math.random() > 0.5 ? 'Bullish' : 'Bearish'} divergence detected on the 4h timeframe`,
      time: new Date(currentTime.getTime() - Math.floor(Math.random() * 60) * 60000),
      read: false,
      priority: 'high',
      icon: Math.random() > 0.5 ? 'trending-up' : 'trending-down'
    },
    {
      id: 101,
      type: 'market',
      title: `${indices[Math.floor(Math.random() * indices.length)]} Update`,
      description: `${Math.random() > 0.5 ? 'Up' : 'Down'} ${(Math.random() * 1.5).toFixed(2)}% in the last trading session`,
      time: new Date(currentTime.getTime() - Math.floor(Math.random() * 120) * 60000),
      read: Math.random() > 0.7,
      priority: 'medium',
      icon: 'bell'
    },
    {
      id: 102,
      type: 'calendar',
      title: `Upcoming: ${events[Math.floor(Math.random() * events.length)]}`,
      description: `High impact event scheduled in ${Math.floor(Math.random() * 24) + 1} hours. Prepare for volatility.`,
      time: new Date(currentTime.getTime() - Math.floor(Math.random() * 180) * 60000),
      read: Math.random() > 0.6,
      priority: 'high',
      icon: 'calendar'
    }
  ];
  
  return dynamicNotifications;
};

const getNotificationIcon = (icon: string) => {
  switch(icon) {
    case 'bell': return <Bell className="h-5 w-5" />;
    case 'calendar': return <Calendar className="h-5 w-5" />;
    case 'clock': return <Clock className="h-5 w-5" />;
    case 'alert': return <AlertTriangle className="h-5 w-5" />;
    case 'trending-up': return <TrendingUp className="h-5 w-5" />;
    case 'trending-down': return <TrendingDown className="h-5 w-5" />;
    default: return <Bell className="h-5 w-5" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch(priority) {
    case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
    case 'medium': return 'text-amber-500 bg-amber-100 dark:bg-amber-900/20';
    case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
    default: return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
  }
};

const NotificationItem = ({ notification, onMarkRead, onDelete }: any) => {
  return (
    <div className={cn(
      "p-4 border-b border-border flex gap-3",
      notification.read ? "opacity-70" : ""
    )}>
      <div className={cn(
        "flex items-center justify-center h-10 w-10 rounded-full",
        getPriorityColor(notification.priority)
      )}>
        {getNotificationIcon(notification.icon)}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{notification.title}</h3>
          <div className="flex items-center gap-1">
            {!notification.read && (
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            )}
            <span className="text-xs text-muted-foreground">
              {formatTime(notification.time)}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
        
        <div className="flex justify-end mt-2 gap-2">
          {!notification.read && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-xs"
              onClick={() => onMarkRead(notification.id)}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Mark as Read
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs text-destructive hover:text-destructive"
            onClick={() => onDelete(notification.id)}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time in a readable way
const formatTime = (time: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 24 * 60) return `${Math.floor(diffMins / 60)}h ago`;
  return `${Math.floor(diffMins / (60 * 24))}d ago`;
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([...sampleNotifications, ...generateDynamicNotifications()]);
  const [activeTab, setActiveTab] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Simulate real-time notifications coming in
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly decide whether to add a new notification
      if (Math.random() < 0.3) { // 30% chance every minute
        const newNotificationTypes = ['market', 'alert', 'calendar'];
        const type = newNotificationTypes[Math.floor(Math.random() * newNotificationTypes.length)];
        
        const newNotification = {
          id: Date.now(),
          type,
          title: type === 'market' 
            ? 'Market Update' 
            : type === 'alert' 
              ? 'Price Alert' 
              : 'Economic Calendar',
          description: type === 'market'
            ? 'New market data available for your watchlist.'
            : type === 'alert'
              ? 'A price alert has been triggered for one of your tracked assets.'
              : 'Upcoming economic event that may impact the markets.',
          time: new Date(),
          read: false,
          priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
          icon: type === 'market' 
            ? 'bell' 
            : type === 'alert' 
              ? Math.random() > 0.5 ? 'trending-up' : 'trending-down'
              : 'calendar'
        };
        
        if (pushEnabled) {
          setNotifications(prev => [newNotification, ...prev]);
          
          // Play notification sound if enabled
          if (soundEnabled) {
            const audio = new Audio('/notification-sound.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Audio playback error:", e));
          }
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [pushEnabled, soundEnabled]);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call for fresh notifications
    setTimeout(() => {
      // Add some dynamic new notifications at the top
      const newNotifications = [...generateDynamicNotifications(), ...notifications];
      setNotifications(newNotifications);
      setIsRefreshing(false);
      
      toast({
        title: "Notifications Refreshed",
        description: "Your notification feed has been updated with the latest alerts."
      });
    }, 1500);
  };
  
  const handleMarkRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    
    toast({
      title: "Notification Marked as Read",
      description: "This notification has been marked as read."
    });
  };
  
  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    
    toast({
      title: "Notification Dismissed",
      description: "This notification has been removed from your feed."
    });
  };
  
  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    
    toast({
      title: "All Notifications Marked as Read",
      description: "All notifications have been marked as read."
    });
  };
  
  const handleClearAll = () => {
    setNotifications([]);
    
    toast({
      title: "All Notifications Cleared",
      description: "Your notification feed has been cleared."
    });
  };
  
  const toggleSoundEnabled = () => {
    setSoundEnabled(!soundEnabled);
    toast({
      title: soundEnabled ? "Sound Notifications Disabled" : "Sound Notifications Enabled",
      description: soundEnabled 
        ? "You will no longer hear sounds for new notifications." 
        : "You will now hear sounds when new notifications arrive."
    });
  };
  
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <>
      {/* This component handles market alerts with sounds based on state */}
      {pushEnabled && <MarketAlerts soundEnabled={soundEnabled} />}
      
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="space-y-6 animate-fade-in mt-2">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                Stay updated with market events and alerts
                {unreadCount > 0 && ` • ${unreadCount} unread`}
              </p>
            </div>
            
            <Button 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="gap-2 whitespace-nowrap"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              <span>Refresh</span>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all" className="flex-1">
                  All
                  {unreadCount > 0 && <Badge variant="outline" className="ml-2 h-5 px-1">{unreadCount}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="alert">Alerts</TabsTrigger>
                <TabsTrigger value="calendar">Events</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex sm:justify-end gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAllRead}
                disabled={notifications.every(n => n.read)}
              >
                Mark All Read
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearAll}
                disabled={notifications.length === 0}
              >
                Clear All
              </Button>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border overflow-hidden">
            {/* Settings section */}
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive alerts about market events</p>
                  </div>
                  <Switch
                    checked={pushEnabled}
                    onCheckedChange={setPushEnabled}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Sound Notifications</h3>
                    <p className="text-sm text-muted-foreground">Play sounds for important alerts</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-9 w-9 p-0"
                    onClick={toggleSoundEnabled}
                    disabled={!pushEnabled}
                  >
                    {soundEnabled ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Notifications list */}
            <div className="divide-y divide-border">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-40" />
                  <h3 className="font-medium text-lg mb-1">No notifications</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'all' 
                      ? "You're all caught up! No notifications at the moment." 
                      : `No ${activeTab} notifications at the moment.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </PullToRefresh>
    </>
  );
};

export default NotificationsPage;
