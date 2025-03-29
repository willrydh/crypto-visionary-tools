
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  Save,
  Repeat,
  Globe,
  DollarSign,
  Percent,
  Clock,
  HelpCircle
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [budget, setBudget] = useState("1000");
  const [leverage, setLeverage] = useState(5);
  const [profitTarget, setProfitTarget] = useState(20);
  const [timezone, setTimezone] = useState("UTC+1");
  const [notifications, setNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");

  // FAQ sections with questions and answers
  const faqSections = [
    {
      title: "Technical Analysis",
      questions: [
        {
          question: "How does ProfitPilot use technical analysis?",
          answer: "ProfitPilot analyzes multiple technical indicators across various timeframes to generate trading signals. We combine traditional indicators like moving averages, RSI, and MACD with advanced pattern recognition to identify potential entry and exit points. The system weighs each indicator based on its reliability in current market conditions and provides an overall confidence score for each trading signal."
        },
        {
          question: "Which technical indicators are used?",
          answer: "Our system employs a diverse set of indicators including Moving Averages (MA21, MA50, MA100, MA200), RSI, MACD, Bollinger Bands, Volume Profile, and Support/Resistance levels. These indicators are analyzed across multiple timeframes to provide a comprehensive market view and reduce false signals."
        },
        {
          question: "How accurate is the technical analysis?",
          answer: "Technical analysis accuracy varies with market conditions. During trending markets, our signals typically achieve 65-75% accuracy. In ranging or choppy markets, accuracy may decrease. We provide confidence scores with each signal to help you gauge reliability, and continuously refine our algorithms based on market performance."
        }
      ]
    },
    {
      title: "Trade Suggestions",
      questions: [
        {
          question: "How are confidence levels calculated?",
          answer: "Confidence levels are calculated using a proprietary algorithm that evaluates multiple factors: indicator agreement across timeframes, historical performance of the pattern, volume confirmation, and market volatility. Higher confidence (>70%) indicates strong agreement among multiple indicators and favorable market conditions for the trade."
        },
        {
          question: "What does the risk-reward ratio mean?",
          answer: "The risk-reward ratio compares potential profit to potential loss. For example, a ratio of 1:3 means the potential reward is three times the risk. Our system targets trades with favorable risk-reward ratios, typically 1:2 or better, depending on your selected trading style. These calculations consider key support/resistance levels and recent price volatility."
        },
        {
          question: "Should I follow all trade suggestions?",
          answer: "Trade suggestions should be used as one input in your decision-making process, not followed blindly. Always apply your own analysis, risk management, and consider broader market conditions. Suggestions with higher confidence scores (>70%) and favorable risk-reward ratios aligned with your trading style are generally more reliable."
        }
      ]
    },
    {
      title: "Trading Styles",
      questions: [
        {
          question: "What's the difference between Scalp, Day, and Swing trading?",
          answer: "Scalping focuses on very short-term trades (minutes to hours) with small profit targets. Day trading opens and closes positions within the same trading day (hours to a full day). Swing trading holds positions for several days to weeks to capture larger market movements. Each style requires different timeframes, risk management, and psychological approach."
        },
        {
          question: "Why does timing matter in different trading styles?",
          answer: "Different trading styles require different timing approaches. Scalping demands immediate execution and quick exits, typically within minutes or hours. Day trading follows intraday trends and requires closing positions by end-of-day. Swing trading looks for larger market moves over days or weeks, requiring patience and wider stop-losses. ProfitPilot tailors its suggestions to match your selected style."
        },
        {
          question: "Which timeframes work best for each trading style?",
          answer: "For scalping, we recommend 1-minute to 15-minute charts for entries, with 1-hour for trend context. Day trading works best with 15-minute to 1-hour charts, using 4-hour for trend direction. Swing trading typically uses 4-hour to daily charts, with weekly charts for broader context. Our system automatically adjusts indicator weights based on your selected style."
        },
        {
          question: "How should I adjust my risk management for different styles?",
          answer: "Scalping typically requires tighter stop-losses (0.2-0.5%) with smaller profit targets (0.5-1.5%). Day trading uses moderate stops (1-2%) and targets (2-5%). Swing trading needs wider stops (3-7%) to accommodate normal market fluctuations, with larger targets (7-20%). Each style requires different position sizing to maintain consistent risk per trade."
        }
      ]
    }
  ];

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
          Configure your trading preferences and access help
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="settings">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-6 mt-6">
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
        </TabsContent>
        
        <TabsContent value="faq" className="space-y-6 mt-6">
          {faqSections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((item, itemIndex) => (
                    <AccordionItem key={itemIndex} value={`section-${sectionIndex}-item-${itemIndex}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 text-muted-foreground">
                          {item.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
