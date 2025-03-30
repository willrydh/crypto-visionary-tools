
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Github,
  Mail,
  LogIn,
  ChevronRight,
  Sparkles,
  LineChart,
  ArrowUpRight,
  BellRing,
  CandlestickChart,
  Rocket,
  ChevronDown,
  Moon,
  Sun,
  CheckCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Logo from '@/assets/logo.svg';
import { useToast } from '@/hooks/use-toast';

const Welcome = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  // Feature items to display
  const features = [
    {
      title: "Live Deep Market Analysis",
      description: "Get real-time market, macro and technical analysis with AI-powered signals",
      icon: <LineChart className="h-5 w-5 text-primary" />
    },
    {
      title: "AI-Powered Trade Signals",
      description: "Receive smart trade setups based on scalping, daytrading and overnight strategies",
      icon: <ArrowUpRight className="h-5 w-5 text-primary" />
    },
    {
      title: "Live Economic Events",
      description: "Stay informed with live and upcoming market-moving events",
      icon: <BellRing className="h-5 w-5 text-primary" />
    },
    {
      title: "The Perfect AI Trading Tool",
      description: "Discover our free version and sign up for ProfitPilot AI Pro",
      icon: <CandlestickChart className="h-5 w-5 text-primary" />
    }
  ];
  
  // Login handler functions
  const handleLogin = (provider: string) => {
    // For demonstration, just navigate to main dashboard
    toast({
      title: "Logged in successfully",
      description: `You've logged in with ${provider}`,
    });
    navigate('/');
  };
  
  const handleGuestAccess = () => {
    toast({
      title: "Guest Access",
      description: "You've accessed the app as a guest",
    });
    navigate('/');
  };

  // Pricing plans
  const pricingPlans = [
    {
      name: 'Freebie',
      description: '30-day Free Trial',
      price: {
        monthly: 0,
        yearly: 0,
      },
      badge: '30 Days Free',
      features: [
        { name: 'Basic trading signals', included: true },
        { name: 'Limited dashboard access', included: true },
        { name: 'Market sentiment indicators', included: true },
        { name: 'Basic price charts', included: true },
        { name: 'Technical analysis', included: false },
        { name: 'Economic calendar', included: false },
        { name: 'Advanced signals', included: false },
        { name: 'AI-powered trading', included: false },
        { name: 'Premium analytics', included: false },
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Pro',
      description: 'Perfect for active traders',
      price: {
        monthly: 39,
        yearly: 349,
      },
      badge: 'Most Popular',
      features: [
        { name: 'Basic trading signals', included: true },
        { name: 'Full dashboard access', included: true },
        { name: 'Market sentiment indicators', included: true },
        { name: 'Advanced price charts', included: true },
        { name: 'Full technical analysis suite', included: true },
        { name: 'Economic calendar', included: true },
        { name: 'Advanced signals & alerts', included: true },
        { name: 'AI-powered trading', included: false },
        { name: 'Premium analytics', included: false },
      ],
      cta: 'Get Pro',
      popular: true,
    },
    {
      name: 'Guru',
      description: 'For professional traders',
      price: {
        monthly: 99,
        yearly: 995,
      },
      badge: 'Ultimate',
      features: [
        { name: 'Basic trading signals', included: true },
        { name: 'Full dashboard access', included: true },
        { name: 'Market sentiment indicators', included: true },
        { name: 'Advanced price charts', included: true },
        { name: 'Full technical analysis suite', included: true },
        { name: 'Economic calendar', included: true },
        { name: 'Advanced signals & alerts', included: true },
        { name: 'AI-powered trading via API', included: true },
        { name: 'Premium analytics & logging', included: true },
      ],
      cta: 'Get Guru',
      popular: false,
    },
  ];

  // Trading modes
  const tradingModes = [
    {
      name: "Scalping",
      icon: <Rocket className="h-5 w-5 text-blue-500" />,
      description: "Ultra-short term trading (minutes to hours). Focus on rapid price movements with tight stop-losses.",
      indicators: ["MA20", "MA50", "StochRSI", "MACD", "Volume"],
      timeframes: ["1m", "5m", "15m", "30m"]
    },
    {
      name: "Day Trading",
      icon: <Sun className="h-5 w-5 text-amber-500" />,
      description: "Short-term trading (hours). Positions opened and closed within the same day, focusing on intraday trends.",
      indicators: ["MA50", "MA100", "MACD", "VWAP", "RSI"],
      timeframes: ["15m", "1h", "4h"]
    },
    {
      name: "Night Trading",
      icon: <Moon className="h-5 w-5 text-indigo-500" />,
      description: "Medium-term trading (12+ hours). Positions that can be held overnight, focusing on larger price swings.",
      indicators: ["MA100", "MA200", "Bollinger Bands", "RSI", "MACD"],
      timeframes: ["1h", "4h", "1d"]
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2 mr-4">
            <img src={Logo} alt="Logo" className="h-8 w-8" />
            <div className="font-bold text-xl">ProfitPilot AI</div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium flex-1">
            <a href="#features" className="transition-colors hover:text-foreground/80">Features</a>
            <a href="#trading-modes" className="transition-colors hover:text-foreground/80">Trading Modes</a>
            <a href="#pricing" className="transition-colors hover:text-foreground/80">Pricing</a>
            <a href="#faq" className="transition-colors hover:text-foreground/80">FAQ</a>
          </nav>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Log In
            </Button>
            <Button onClick={() => document.getElementById('signup-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Sign Up
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 flex flex-col items-center text-center space-y-8 bg-gradient-to-b from-background to-muted">
        <Badge variant="outline" className="mb-4">Version 1.0.0 is now available</Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl leading-tight tracking-tighter">
          Your AI-Powered Trading Assistant for Modern Markets
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
          ProfitPilot AI gives you real-time market signals, intelligent trade suggestions, and deep data analysis for crypto trading.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button size="lg" onClick={handleGuestAccess}>
            Try For Free
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Trading Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ProfitPilot AI brings advanced trading capabilities and real-time market insights to help you make better trading decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur border-border/50 overflow-hidden">
                <CardContent className="p-6 flex flex-col items-start space-y-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Real-time Market Analytics</h3>
              <p className="text-muted-foreground mb-6">
                Our platform gives you real-time price charts, technical analysis, and market sentiment indicators to help you understand market movements and make informed decisions.
              </p>
              <ul className="space-y-2">
                {[
                  "Live price tracking from Bybit API",
                  "Support & resistance level detection",
                  "Economic calendar for market-moving events",
                  "NYSE market open/close volatility tracking"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4 shadow-lg">
              <img 
                src="https://via.placeholder.com/500x300/1a1a1a/808080?text=Market+Analytics+Dashboard" 
                alt="Market Analytics Dashboard" 
                className="rounded-md w-full"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Trading Modes Section */}
      <section id="trading-modes" className="py-20 px-4 md:px-6 lg:px-8 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Three Trading Modes for Any Strategy</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ProfitPilot AI adapts to your trading style with specialized modes for different trading timeframes and strategies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tradingModes.map((mode, index) => (
              <Card key={index} className={`${
                index === 0 ? 'border-blue-500/20 bg-blue-500/5' : 
                index === 1 ? 'border-amber-500/20 bg-amber-500/5' : 
                'border-indigo-500/20 bg-indigo-500/5'
              }`}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {mode.icon}
                    <CardTitle>{mode.name}</CardTitle>
                  </div>
                  <CardDescription className="mt-2">{mode.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Indicators</h4>
                      <div className="flex flex-wrap gap-2">
                        {mode.indicators.map((indicator, idx) => (
                          <Badge key={idx} variant="secondary" className={
                            index === 0 ? 'bg-blue-500/10 text-blue-500' : 
                            index === 1 ? 'bg-amber-500/10 text-amber-500' : 
                            'bg-indigo-500/10 text-indigo-500'
                          }>
                            {indicator}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Timeframes</h4>
                      <div className="flex flex-wrap gap-2">
                        {mode.timeframes.map((timeframe, idx) => (
                          <Badge key={idx} variant="outline">
                            {timeframe}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose the Perfect Plan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the right plan for your trading needs, from free trials to professional setups with API access.
            </p>
            
            <div className="flex justify-center mb-8 mt-8">
              <Tabs 
                value={billingCycle} 
                onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}
                className="w-[400px]"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">
                    Yearly
                    <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      Save 25%
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg ring-2 ring-primary' : ''}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.badge && (
                      <Badge variant={plan.popular ? "default" : "outline"}>
                        {plan.badge}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mt-2 mb-6">
                    <span className="text-4xl font-bold">
                      ${plan.price[billingCycle]}
                    </span>
                    {plan.price[billingCycle] > 0 && (
                      <span className="text-muted-foreground ml-2">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        {feature.included ? (
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 mr-2 text-gray-300" />
                        )}
                        <span className={!feature.included ? "text-muted-foreground" : ""}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleGuestAccess()}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Sign up / Login Section */}
      <section id="signup-section" className="py-20 px-4 md:px-6 lg:px-8 bg-muted">
        <div className="container mx-auto max-w-md text-center">
          <div className="space-y-6">
            <img src={Logo} alt="Logo" className="h-16 w-16 mx-auto" />
            <h2 className="text-2xl font-bold">Get Started with ProfitPilot AI</h2>
            <p className="text-muted-foreground">
              Sign up now to access real-time trading signals and AI-powered market analysis.
            </p>
            
            <div className="space-y-3">
              <Button 
                variant="outline"
                className="w-full justify-start text-base"
                onClick={() => handleLogin('github')}
              >
                <Github className="mr-2 h-5 w-5" />
                Sign in with GitHub
                <ChevronRight className="ml-auto h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start text-base"
                onClick={() => handleLogin('email')}
              >
                <Mail className="mr-2 h-5 w-5" />
                Sign in with Email
                <ChevronRight className="ml-auto h-5 w-5" />
              </Button>
              
              <Button 
                variant="secondary"
                className="w-full justify-start text-base"
                onClick={handleGuestAccess}
              >
                <LogIn className="mr-2 h-5 w-5" />
                Guest Access
                <ChevronRight className="ml-auto h-5 w-5" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground pt-4">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find answers to the most common questions about ProfitPilot AI.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I cancel my subscription?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription anytime. If you cancel, you'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How does the free trial work?</h3>
              <p className="text-muted-foreground">
                The free trial gives you 30 days of access to our basic features. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards and cryptocurrencies including Bitcoin, Ethereum, and USDT.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Are the signals financial advice?</h3>
              <p className="text-muted-foreground">
                No, ProfitPilot AI provides algorithmic trading signals based on technical analysis, not financial advice. Always do your own research.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 md:px-6 lg:px-8 bg-background border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#trading-modes" className="text-muted-foreground hover:text-foreground">Trading Modes</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">API</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src={Logo} alt="Logo" className="h-8 w-8" />
              <span className="font-medium">ProfitPilot AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Zentra LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
