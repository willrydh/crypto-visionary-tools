
import React, { useState } from 'react';
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
import { Slider } from "@/components/ui/slider";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Settings, DollarSign, Repeat } from 'lucide-react';

const SettingsView = () => {
  const { toast } = useToast();
  const [leverage, setLeverage] = useState<number>(5);
  const [budget, setBudget] = useState("1000");
  const [activeTab, setActiveTab] = useState("settings");
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your trading preferences and access help
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading Preferences</CardTitle>
              <CardDescription>
                Configure your trading parameters and default settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
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
                    onValueChange={(value) => setLeverage(value[0])}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1x</span>
                    <span>25x</span>
                    <span>50x</span>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings} className="w-full mt-4">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Find answers to common questions about trading and using the platform.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsView;
