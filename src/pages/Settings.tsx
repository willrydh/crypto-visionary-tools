
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  Save,
  Repeat,
  Globe,
  DollarSign,
  Percent,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [budget, setBudget] = useState("1000");
  const [leverage, setLeverage] = useState(5);
  const [profitTarget, setProfitTarget] = useState(20);
  const [timezone, setTimezone] = useState("UTC+1");
  const [notifications, setNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your trading preferences have been updated successfully.",
      });
      setIsSaving(false);
    }, 1000);
  };

  const handleResetDefaults = () => {
    setBudget("1000");
    setLeverage(5);
    setProfitTarget(20);
    setTimezone("UTC+1");
    setNotifications(true);
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your trading preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Trading Preferences</CardTitle>
            <CardDescription>
              Configure your trading parameters and default settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Trading Budget (USD)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="1000"
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Amount you're willing to invest in trades
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="leverage" className="flex items-center gap-2">
                    <Repeat className="h-4 w-4" />
                    Default Leverage: {leverage}x
                  </Label>
                  <Slider 
                    id="leverage"
                    min={1} 
                    max={50} 
                    step={1} 
                    value={[leverage]} 
                    onValueChange={(values) => setLeverage(values[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1x</span>
                    <span>25x</span>
                    <span>50x</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="profit-target" className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Profit Target: {profitTarget}%
                  </Label>
                  <Slider 
                    id="profit-target"
                    min={5} 
                    max={100} 
                    step={5} 
                    value={[profitTarget]} 
                    onValueChange={(values) => setProfitTarget(values[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Timezone
                  </Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-12">UTC-12</SelectItem>
                      <SelectItem value="UTC-8">UTC-8 (PST)</SelectItem>
                      <SelectItem value="UTC-5">UTC-5 (EST)</SelectItem>
                      <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                      <SelectItem value="UTC+1">UTC+1 (CET)</SelectItem>
                      <SelectItem value="UTC+2">UTC+2 (EET)</SelectItem>
                      <SelectItem value="UTC+5:30">UTC+5:30 (IST)</SelectItem>
                      <SelectItem value="UTC+8">UTC+8 (CST)</SelectItem>
                      <SelectItem value="UTC+9">UTC+9 (JST)</SelectItem>
                      <SelectItem value="UTC+12">UTC+12</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Timezone for market sessions and alerts
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Notification Preferences
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="trade-notifications" className="mb-1">
                    Trading Opportunity Alerts
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified when a new trade opportunity is detected
                  </p>
                </div>
                <Switch 
                  id="trade-notifications" 
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-end">
              <Button 
                variant="outline" 
                onClick={handleResetDefaults}
              >
                <Repeat className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button 
                onClick={handleSaveSettings} 
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <SettingsIcon className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About ProfitPilot AI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>Version 1.0.0</p>
              <p className="mt-2">
                ProfitPilot AI provides automated technical analysis for cryptocurrency trading.
                All signals are based on technical indicators and market patterns.
              </p>
              <p className="mt-2 font-medium text-foreground">
                Disclaimer: Trading involves significant risk. This application provides
                suggestions only, and all trading decisions should be made based on your own research.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
