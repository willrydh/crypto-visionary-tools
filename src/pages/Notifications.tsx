import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Bell, 
  ArrowDown, 
  ArrowUp, 
  AlertCircle, 
  Clock, 
  CheckCircle2,
  RefreshCw 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'price' | 'alert' | 'system';
  read: boolean;
  icon?: React.ReactNode;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'BTC Price Alert',
    description: 'Bitcoin exceeded your price target of $60,000',
    time: '10 minutes ago',
    type: 'price',
    read: false,
    icon: <ArrowUp className="h-5 w-5 text-green-500" />
  },
  {
    id: '2',
    title: 'ETH Price Drop',
    description: 'Ethereum dropped below $2,800, your configured support level',
    time: '1 hour ago',
    type: 'price',
    read: false,
    icon: <ArrowDown className="h-5 w-5 text-red-500" />
  },
  {
    id: '3',
    title: 'System Maintenance',
    description: 'Scheduled maintenance completed successfully',
    time: '5 hours ago',
    type: 'system',
    read: true,
    icon: <CheckCircle2 className="h-5 w-5 text-blue-500" />
  },
  {
    id: '4',
    title: 'Trading Opportunity',
    description: 'Technical indicators suggest a buying opportunity for SOL',
    time: '1 day ago',
    type: 'alert',
    read: true,
    icon: <AlertCircle className="h-5 w-5 text-yellow-500" />
  },
  {
    id: '5',
    title: 'Market Analysis Ready',
    description: 'Your requested market analysis has been completed',
    time: '2 days ago',
    type: 'system',
    read: true,
    icon: <CheckCircle2 className="h-5 w-5 text-blue-500" />
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });
  
  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with alerts, price movements, and system updates
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Activity & Notifications
              </CardTitle>
              <CardDescription>
                {unreadCount} unread notifications
              </CardDescription>
            </div>
          </div>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="price">Price</TabsTrigger>
              <TabsTrigger value="alert">Alerts</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <h3 className="text-lg font-medium">No notifications</h3>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg ${notification.read ? 'bg-card' : 'bg-muted'} border hover:bg-accent/5 transition-colors`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {notification.icon || <AlertCircle className="h-5 w-5 text-yellow-500" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{notification.title}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                            {!notification.read && (
                              <Badge variant="secondary" className="px-1.5 py-0 text-xs bg-primary text-primary-foreground">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
