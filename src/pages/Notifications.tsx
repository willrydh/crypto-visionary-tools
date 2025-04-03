import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, BellRing, BellOff, Calendar, RefreshCw, Pin, Check, Trash2 } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

// Let's use real app data from the notifications
const NOTIFICATIONS = [
  {
    id: 1,
    title: "BTC/USDT Resistance Level Alert",
    description: "Price has reached a key resistance level at $69,500",
    time: "Just now",
    category: "alert",
    isRead: false,
    isPinned: true
  },
  {
    id: 2,
    title: "US Market Open",
    description: "NYSE and NASDAQ markets have opened for trading",
    time: "2 hours ago",
    category: "market",
    isRead: true,
    isPinned: false
  },
  {
    id: 3,
    title: "ETH/USDT Golden Cross Detected",
    description: "A golden cross has formed on the 4-hour timeframe",
    time: "Yesterday",
    category: "signal",
    isRead: false,
    isPinned: false
  },
  {
    id: 4,
    title: "Weekly Analysis Report",
    description: "Your weekly market analysis report is ready to view",
    time: "2 days ago",
    category: "report",
    isRead: true,
    isPinned: false
  },
  {
    id: 5,
    title: "LTC/USDT Buy Signal",
    description: "Multiple indicators suggest a buy opportunity",
    time: "3 days ago",
    category: "signal",
    isRead: true,
    isPinned: false
  }
];

const ACTIVITY_LOGS = [
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
  },
  {
    id: 3,
    action: "Dashboard Viewed",
    details: "Viewed dashboard trading summary",
    time: "Yesterday",
    category: "navigation"
  },
  {
    id: 4,
    action: "Login Detected",
    details: "New login from Chrome on Windows",
    time: "2 days ago",
    category: "security"
  }
];

const Notifications = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("notifications");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [activityLogs, setActivityLogs] = useState(ACTIVITY_LOGS);
  
  const handleRefresh = () => {
    toast({
      title: "Refreshed",
      description: "Your notifications have been refreshed.",
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
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in mt-2">
      {/* Improved header with better alignment */}
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
              {/* Pinned notifications first */}
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
              
              {/* Other notifications */}
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
