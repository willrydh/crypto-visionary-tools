
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';

const SettingsView = () => {
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Customize your trading assistant
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure general application preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select defaultValue="system">
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                  <SelectItem value="jpy">JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <Switch id="notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sound">Sound Alerts</Label>
              <Switch id="sound" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Trading Preferences</CardTitle>
            <CardDescription>
              Customize your trading parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultSymbol">Default Symbol</Label>
              <Select defaultValue="btcusdt">
                <SelectTrigger id="defaultSymbol">
                  <SelectValue placeholder="Select a symbol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btcusdt">BTC/USDT</SelectItem>
                  <SelectItem value="ethusdt">ETH/USDT</SelectItem>
                  <SelectItem value="solusdt">SOL/USDT</SelectItem>
                  <SelectItem value="bnbusdt">BNB/USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultTimeframe">Default Timeframe</Label>
              <Select defaultValue="1h">
                <SelectTrigger id="defaultTimeframe">
                  <SelectValue placeholder="Select a timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5m">5 minutes</SelectItem>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="4h">4 hours</SelectItem>
                  <SelectItem value="1d">1 day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="riskPercentage">Risk Percentage</Label>
              <div className="flex items-center gap-2">
                <Input id="riskPercentage" type="number" defaultValue="1" className="max-w-24" />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Percentage of account balance to risk per trade</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Connect to trading platforms and data sources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Binance API</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="binanceApiKey" className="text-sm">API Key</Label>
                  <Input id="binanceApiKey" type="password" placeholder="Enter your Binance API key" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="binanceApiSecret" className="text-sm">API Secret</Label>
                  <Input id="binanceApiSecret" type="password" placeholder="Enter your Binance API secret" />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <Label>TradingView Integration</Label>
              <div className="space-y-2">
                <Label htmlFor="tradingViewUsername" className="text-sm">Username</Label>
                <Input id="tradingViewUsername" placeholder="Enter your TradingView username" />
              </div>
            </div>
            
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsView;
