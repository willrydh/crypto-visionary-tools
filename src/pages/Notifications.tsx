import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, BellRing, BellOff, Calendar, RefreshCw, Pin, Check, Trash2 } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { useMarkets } from '@/hooks/useMarkets';
import { usePrice } from '@/hooks/usePrice';
import { format } from 'date-fns';
import { fromZonedTime, toZonedTime, format as formatTz } from 'date-fns-tz';

const formatInStockholm = (utcDate) => {
  if (!utcDate) return '';
  const stockholmTz = 'Europe/Stockholm';
  const localDate = toZonedTime(utcDate, stockholmTz);
  return formatTz(localDate, "H:mm", { timeZone: stockholmTz });
};

const generateMarketNotifications = (marketSessions, priceData) => {
  const notifications = [];
  let id = 1;
  
  marketSessions?.forEach(market => {
    if (market.status === 'open') {
      notifications.push({
        id: id++,
        title: `${market.name} Market Open`,
        description: `The ${market.name} market is currently open for trading`,
        time: "Active now",
        category: "market",
        isRead: false,
        isPinned: market.name === "New York" || market.name === "London"
      });
    } else if (market.status === 'opening-soon') {
      notifications.push({
        id: id++,
        title: `${market.name} Opening Soon`,
        description: `The ${market.name} market will open soon`,
        time: "Upcoming",
        category: "alert",
        isRead: false,
        isPinned: market.name === "New York" || market.name === "London"
      });
    } else if (market.nextEvent && market.nextEvent.time) {
      const eventTime = market.nextEvent.time instanceof Date 
        ? market.nextEvent.time 
        : new Date(market.nextEvent.time);

      let showZoneTime = false;
      if (
        market.name.toLowerCase().includes('london') ||
        market.name.toLowerCase().includes('new york') ||
        market.name.toLowerCase().includes('forex')
      ) {
        showZoneTime = true;
      }

      notifications.push({
        id: id++,
        title: `${market.name} Market ${market.nextEvent.type === 'open' ? 'Opens' : 'Closes'} Soon`,
        description: showZoneTime
          ? `Scheduled for ${formatInStockholm(eventTime)} (SWE time) (${format(eventTime, 'E, MMM d')})`
          : `Scheduled for ${format(eventTime, 'h:mm a')} (${format(eventTime, 'E, MMM d')})`,
        time: "Scheduled",
        category: "market",
        isRead: true,
        isPinned: false
      });
    }
  });
  
  if (priceData && priceData['BTCUSDT']) {
    const btcData = priceData['BTCUSDT'];
    
    notifications.push({
      id: id++,
      title: "BTC Price Alert",
      description: `Current price: $${btcData.price.toLocaleString()}`,
      time: "Updated now",
      category: "alert",
      isRead: false,
      isPinned: true
    });
    
    if (btcData.dailyHigh) {
      notifications.push({
        id: id++,
        title: "BTC Daily High",
        description: `Today's high: $${btcData.dailyHigh.toLocaleString()}`,
        time: "Today",
        category: "signal",
        isRead: true,
        isPinned: false
      });
    }
    
    if (btcData.dailyLow) {
      notifications.push({
        id: id++,
        title: "BTC Daily Low",
        description: `Today's low: $${btcData.dailyLow.toLocaleString()}`,
        time: "Today",
        category: "signal",
        isRead: true,
        isPinned: false
      });
    }
  }
  
  if (priceData && priceData['ETHUSDT']) {
    const ethData = priceData['ETHUSDT'];
    
    notifications.push({
      id: id++,
      title: "ETH Price Alert",
      description: `Current price: $${ethData?.price?.toLocaleString() || '3,500'}`,
      time: "Updated now",
      category: "alert",
      isRead: false,
      isPinned: false
    });
  }
  
  notifications.push({
    id: id++,
    title: "Daily Market Recap",
    description: "Your daily market analysis report will be ready at market close",
    time: "Scheduled for 4:00 PM",
    category: "report",
    isRead: true,
    isPinned: false
  });
  
  return notifications;
};

const generateActivityLogs = (marketSessions, priceData) => {
  const now = new Date();
  const activityLogs = [
    {
      id: 1,
      action: "Trading Mode Changed",
      details: "Changed trading mode from Day to Scalp",
      time: "1 hour ago",
      category: "settings"
    },
    {
      id: 2,
      action: "Analysis Generated",
      details: "Created new analysis for BTC/USDT",
      time: "3 hours ago",
      category: "analysis"
    }
  ];
  
  let id = 3;
  marketSessions?.forEach(market => {
    if (market.status === 'open') {
      activityLogs.push({
        id: id++,
        action: `${market.name} Market Opened`,
        details: `The ${market.name} market opened for trading`,
        time: format(now, 'h:mm a'),
        category: "market"
      });
    }
  });
  
  if (priceData && priceData['BTCUSDT']) {
    activityLogs.push({
      id: id++,
      action: "BTC Price Checked",
      details: `BTC price at $${priceData['BTCUSDT'].price.toLocaleString()}`,
      time: "Just now",
      category: "price"
    });
  }
  
  if (priceData && priceData['ETHUSDT']) {
    activityLogs.push({
      id: id++,
      action: "ETH Price Checked",
      details: `ETH price at $${priceData['ETHUSDT']?.price?.toLocaleString() || '3,500'}`,
      time: "5 minutes ago",
      category: "price"
    });
  }
  
  activityLogs.push({
    id: id++,
    action: "Login Detected",
    details: "New login from your current device",
    time: format(new Date(now.getTime() - 30 * 60000), 'h:mm a'),
    category: "security"
  });
  
  return activityLogs;
};

const Notifications = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("notifications");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  
  const { marketSessions, isLoading: marketsLoading } = useMarkets();
  const { priceData, loadPriceData } = usePrice();
  
  useEffect(() => {
    if (!priceData['BTCUSDT']) {
      loadPriceData('BTCUSDT');
    }
    
    if (!priceData['ETHUSDT']) {
      loadPriceData('ETHUSDT');
    }
    
    const generatedNotifications = generateMarketNotifications(marketSessions, priceData);
    setNotifications(generatedNotifications);
    
    const generatedLogs = generateActivityLogs(marketSessions, priceData);
    setActivityLogs(generatedLogs);
  }, [marketSessions, priceData, loadPriceData]);
  
  const handleRefresh = () => {
    const generatedNotifications = generateMarketNotifications(marketSessions, priceData);
    setNotifications(generatedNotifications);
    
    const generatedLogs = generateActivityLogs(marketSessions, priceData);
    setActivityLogs(generatedLogs);
    
    toast({
      title: "Refreshed",
      description: "Your notifications have been refreshed with the latest data.",
    });
  };
  
  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
    toast({
      title: soundEnabled ? "Sound Disabled" : "Sound Enabled",
      description: soundEnabled 
        ? "Notification sounds have been turned off." 
        : "You will now receive sound alerts for important notifications.",
    });
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({
      ...notif,
      isRead: true
    })));
    
    toast({
      title: "All Read",
      description: "All notifications have been marked as read.",
    });
  };
  
  const togglePin = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isPinned: !notif.isPinned } : notif
    ));
  };
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };
  
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    
    toast({
      title: "Notification Deleted",
      description: "The notification has been removed.",
    });
  };
  
  const clearActivity = () => {
    setActivityLogs([]);
    
    toast({
      title: "Activity Cleared",
      description: "Your activity history has been cleared.",
    });
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "alert": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "signal": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "market": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "report": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "settings": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      case "analysis": return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      case "navigation": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "security": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "price": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };
  
  if (marketsLoading && notifications.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in mt-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin mb-4"></div>
              <p className="text-muted-foreground">Fetching latest market data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in mt-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Track alerts and activity
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2 bg-card p-2 rounded-md border">
            <BellRing className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium mr-1">Sound</span>
            <Switch 
              checked={soundEnabled} 
              onCheckedChange={handleToggleSound} 
              aria-label="Toggle notification sounds"
            />
          </div>
          
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="notifications" className="flex items-center gap-1.5">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
            {notifications.filter(n => !n.isRead).length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 px-1">
                {notifications.filter(n => !n.isRead).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>Activity Log</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Recent Notifications</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead}
                disabled={!notifications.some(n => !n.isRead)}
              >
                <Check className="h-4 w-4 mr-1" />
                Mark All Read
              </Button>
            </div>
          </div>
          
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <BellOff className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No notifications to display.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.some(n => n.isPinned) && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                    <Pin className="h-3 w-3 mr-1" /> Pinned
                  </h3>
                  {notifications
                    .filter(n => n.isPinned)
                    .map(notification => (
                      <Card key={notification.id} className={cn(
                        "transition-colors",
                        !notification.isRead && "border-primary/50 bg-primary/5"
                      )}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className={cn(
                                  "font-medium",
                                  !notification.isRead && "font-semibold"
                                )}>
                                  {notification.title}
                                </h3>
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-xs", getCategoryColor(notification.category))}
                                >
                                  {notification.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {notification.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.time}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => togglePin(notification.id)}
                              >
                                <Pin className="h-4 w-4 text-primary" />
                              </Button>
                              {!notification.isRead && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
              
              {notifications.some(n => !n.isPinned) && (
                <div className="space-y-2">
                  {notifications.some(n => n.isPinned) && (
                    <Separator className="my-4" />
                  )}
                  <h3 className="text-sm font-medium text-muted-foreground">
                    All Notifications
                  </h3>
                  {notifications
                    .filter(n => !n.isPinned)
                    .map(notification => (
                      <Card key={notification.id} className={cn(
                        "transition-colors",
                        !notification.isRead && "border-primary/50 bg-primary/5"
                      )}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className={cn(
                                  "font-medium",
                                  !notification.isRead && "font-semibold"
                                )}>
                                  {notification.title}
                                </h3>
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-xs", getCategoryColor(notification.category))}
                                >
                                  {notification.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {notification.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.time}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => togglePin(notification.id)}
                              >
                                <Pin className="h-4 w-4" />
                              </Button>
                              {!notification.isRead && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Activity History</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearActivity}
              disabled={activityLogs.length === 0}
            >
              Clear History
            </Button>
          </div>
          
          {activityLogs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No activity history to display.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{log.action}</h3>
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", getCategoryColor(log.category))}
                            >
                              {log.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {log.details}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {log.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
