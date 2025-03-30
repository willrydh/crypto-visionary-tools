
import React, { useState, useEffect } from 'react';
import { 
  Bell,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Filter,
  Search,
  Bitcoin,
  Ethereum
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { DataSourceIndicator } from '@/components/ui/data-source-indicator';
import CryptoCoinIcon from '@/components/crypto/CryptoCoinIcon';
import { 
  getMockNotifications, 
  getMockMarketSessions,
  Notification,
  formatTimeUntil
} from '@/utils/mockData';

const NotificationsPage = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [marketSessions, setMarketSessions] = useState(getMockMarketSessions());
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    setNotifications(getMockNotifications());
    
    // Refresh market sessions every minute
    const interval = setInterval(() => {
      setMarketSessions(getMockMarketSessions());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Handler for notification refresh
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setNotifications(getMockNotifications());
      setIsLoading(false);
      
      toast({
        title: "Notifications Refreshed",
        description: "Your notifications have been updated.",
      });
    }, 1000);
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
    
    toast({
      title: "Marked as Read",
      description: "All notifications have been marked as read.",
    });
  };

  const toggleAlerts = (checked: boolean) => {
    setAlertsEnabled(checked);
    
    toast({
      title: checked ? "Alerts Enabled" : "Alerts Disabled",
      description: checked ? "You will now receive trading alerts." : "You will no longer receive trading alerts.",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'alert':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  // Filter notifications based on search query and type filter
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || notification.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Trading alerts and market updates
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <Switch
              id="alerts"
              checked={alertsEnabled}
              onCheckedChange={toggleAlerts}
            />
            <Label htmlFor="alerts">Alert me</Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="space-y-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Activity Log
                  {unreadCount > 0 && (
                    <Badge className="bg-primary ml-2">{unreadCount} new</Badge>
                  )}
                </CardTitle>
                <DataSourceIndicator 
                  source="Trading System" 
                  isLive={false} 
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={filterType}
                  onValueChange={setFilterType}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="alert">Alerts</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warnings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence initial={false}>
                {filteredNotifications.length > 0 ? (
                  <motion.div 
                    layout 
                    className="space-y-4"
                  >
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        layout
                        className={`p-4 border rounded-lg flex ${!notification.read ? 'bg-accent/20' : ''}`}
                      >
                        <div className="mr-4 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium flex items-center gap-2">
                              {notification.symbol && (
                                <CryptoCoinIcon 
                                  coin={notification.symbol as any || 'BTC'} 
                                  size="sm"
                                />
                              )}
                              {notification.title}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {formatNotificationTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm mt-1 text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery || filterType !== 'all' 
                        ? 'Try adjusting your filters'
                        : 'Trading alerts and market updates will appear here'}
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Market Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketSessions.map((session) => (
                  <div key={session.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{session.name}</span>
                      <Badge 
                        variant={session.status === "open" ? "default" : "outline"}
                        className={session.status === "open" ? "bg-bullish" : ""}
                      >
                        {session.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {session.nextEvent.type.charAt(0).toUpperCase() + session.nextEvent.type.slice(1)}{" "}
                      in {formatTimeUntil(session.nextEvent.time)}
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trade-alerts">Trade Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications about new trading opportunities
                  </p>
                </div>
                <Switch id="trade-alerts" checked={alertsEnabled} onCheckedChange={toggleAlerts} />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="market-sessions">Market Sessions</Label>
                  <p className="text-xs text-muted-foreground">
                    Alerts for market sessions opening and closing
                  </p>
                </div>
                <Switch id="market-sessions" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="price-alerts">Price Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified about significant price movements
                  </p>
                </div>
                <Switch id="price-alerts" defaultChecked />
              </div>
              
              <div className="mt-6 p-3 bg-card/50 rounded-lg border border-border text-center">
                <DataSourceIndicator 
                  source="Bybit API" 
                  isLive={true} 
                  className="justify-center"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
