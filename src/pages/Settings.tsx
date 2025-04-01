
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  Save,
  Repeat,
  Globe,
  DollarSign,
  Percent,
  Clock,
  HelpCircle,
  LineChart,
  TrendingUp,
  Rocket,
  Zap,
  AlertCircle,
  BarChart4,
  Brain
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

  // FAQ sections with updated questions and answers
  const faqSections = [
    {
      title: "Technical Analysis",
      icon: <LineChart className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "How does ProfitPilot use technical analysis?",
          answer: "ProfitPilot continuously analyzes real-time data across multiple timeframes (1m, 5m, 15m, 1h, 4h, 1d) and combines it with historical price action to detect precise patterns, structures, and volume zones. It identifies key confirmations such as higher highs, MA reversals, RSI divergences, and MACD crosses."
        },
        {
          question: "Which technical indicators are used?",
          answer: "We combine proven indicators for optimal accuracy, including: Moving Averages (MA21, MA50, MA100), MACD (momentum and trend strength), Stochastic RSI (overbought/oversold signals), Volume profile and liquidity zones, Market structure and trendlines, Reversal candles and pattern recognition."
        },
        {
          question: "How accurate is the technical analysis?",
          answer: "ProfitPilot adapts based on real trade outcomes. The AI dynamically adjusts confidence levels using past signal accuracy, current market conditions, and cross-confirmation logic. Each signal includes a Confidence Score so users can assess the strength of every setup."
        }
      ]
    },
    {
      title: "Macro Events & Volatility",
      icon: <AlertCircle className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "Does ProfitPilot use real-time macroeconomic data?",
          answer: "Yes. The app integrates global market data, including: Market openings/closings (NYSE, Nasdaq, Tokyo, Frankfurt, etc.), Economic events from Forex Factory's calendar, Countdown timers for critical events like FOMC, CPI, NFP, and rate decisions."
        },
        {
          question: "How is market volatility handled?",
          answer: "The app adjusts dynamically for volatility. During high-impact events, trade setups widen stop-losses and targets. During stable conditions, it narrows them. This ensures each trade adapts to the current environment for better risk management."
        }
      ]
    },
    {
      title: "Trade Suggestions & AI Logic",
      icon: <Rocket className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "How are trade suggestions generated?",
          answer: "ProfitPilot detects confluence — when multiple indicators align, the system assigns a Likely Hit % to each potential setup. It factors in volume, liquidity zones, price structure, trend confirmation, and recent momentum — all filtered through AI for precision."
        },
        {
          question: "How is the confidence score calculated?",
          answer: "Each setup is assigned a confidence score based on historical accuracy, number of confirming signals, volume strength, and macro context. The more aligned the signals, the higher the confidence."
        },
        {
          question: "What does the risk-reward ratio mean?",
          answer: "Risk-reward shows how much potential reward a trade offers compared to the potential loss. For example, a 3:1 ratio means you risk $100 to potentially gain $300. ProfitPilot always includes this in trade suggestions."
        },
        {
          question: "Should I follow all trade suggestions?",
          answer: "No. ProfitPilot is your co-pilot — not your autopilot. Each signal is a tool, not a guarantee. Combine signals with your own risk management, experience level, and capital strategy."
        }
      ]
    },
    {
      title: "Trading Styles",
      icon: <BarChart4 className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "What's the difference between Scalp, Day, and Swing trading?",
          answer: "Scalp trading: Very short-term trades (minutes), high frequency, tight risk. Day trading: Multiple trades per day, closed before end of session. Swing trading: Held for several days, focused on broader trends."
        },
        {
          question: "Why does timing matter?",
          answer: "Different styles require different timing windows. Scalp trades often rely on volatility spikes (like NYSE open), while swing trades benefit from macro trends and higher timeframe signals."
        },
        {
          question: "Which timeframes work best for each style?",
          answer: "Scalp: 1m, 5m, 15m, Day: 15m, 1h, Swing: 4h, 1d"
        },
        {
          question: "How should I adjust my risk for different styles?",
          answer: "Scalp: Tight stop losses, small capital, fast exits. Day: Balanced risk, mid-sized trades. Swing: Wider stops, fewer trades, strong patience."
        }
      ]
    },
    {
      title: "AI & Data Analysis",
      icon: <Brain className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "How does ProfitPilot use AI to analyze the market?",
          answer: "ProfitPilot leverages advanced AI models trained on thousands of historical trades and market events. The AI doesn't just analyze charts — it combines price action, technical indicators, volume patterns, volatility spikes, macroeconomic data, and user behavior to identify high-probability setups in real time."
        },
        {
          question: "What kind of data does the AI process?",
          answer: "Price structure: Higher highs/lows, trendlines, consolidation zones. Volume and liquidity: Hidden volume shifts, breakout pressure, order book behavior. Technical indicators: Real-time signals from MACD, MA, RSI, Stoch RSI, and more. Macro factors: Impact from FOMC, CPI, NFP, interest rate decisions. Market sessions: NYSE open/close momentum, Asia session volume. User preferences: Budget, risk appetite, preferred trading style."
        },
        {
          question: "How does this increase profitability?",
          answer: "By combining human logic with machine precision, ProfitPilot can: Anticipate market shifts before they happen, Avoid low-quality setups during uncertain conditions, Adapt trade size and stop-loss to current volatility, Offer setups with the highest possible edge based on millions of data points."
        },
        {
          question: "Does the AI learn over time?",
          answer: "Yes. ProfitPilot's engine is continuously improved with new trade outcomes, market conditions, and user feedback. It learns what works, filters out what doesn't, and adapts — just like an elite trader, but faster and more consistent."
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
            <SettingsIcon className="h-4 w-4 mr-2" />
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
        
        <TabsContent value="faq" className="space-y-4 mt-4">
          {faqSections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader className="flex flex-row items-center space-y-0 gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  {section.icon}
                </div>
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
