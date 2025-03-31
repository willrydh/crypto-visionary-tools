import React, { useState, useEffect } from 'react';
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
  X,
  ExternalLink,
  HelpCircle,
  DollarSign,
  Shield,
  Zap,
  BadgePercent,
  TrendingUp,
  Clock,
  Scale,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Logo from '@/assets/logo.svg';
import { useToast } from '@/hooks/use-toast';
import CustomerReviews from '@/components/marketing/CustomerReviews';
import PlatformsAvailability from '@/components/marketing/PlatformsAvailability';
import DiscordCommunity from '@/components/marketing/DiscordCommunity';
import TokenProgress from '@/components/marketing/TokenProgress';
import FAQ from './FAQ';

const Welcome = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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
      title: "The Perfect Trading Tool",
      description: "Discover our free version and sign up for ProfitPilot Pro",
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

  // Handle forgot password
  const handleForgotPassword = () => {
    navigate('/forgot-password');
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
        { name: 'Trading', included: false },
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
        { name: 'Trading', included: false },
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
        { name: 'Trading via API', included: true },
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
      timeframes: ["1m", "5m"]
    },
    {
      name: "Day Trading",
      icon: <Sun className="h-5 w-5 text-amber-500" />,
      description: "Short-term trading (hours). Positions opened and closed within the same day, focusing on intraday trends.",
      indicators: ["MA50", "MA100", "MACD", "VWAP", "RSI"],
      timeframes: ["1h", "4h"]
    },
    {
      name: "Night Trading",
      icon: <Moon className="h-5 w-5 text-indigo-500" />,
      description: "Medium-term trading (12+ hours). Positions that can be held overnight, focusing on larger price swings.",
      indicators: ["MA100", "MA200", "Bollinger Bands", "RSI", "MACD"],
      timeframes: ["4h", "1d"]
    }
  ];

  // Extended FAQ sections
  const extendedFaq = [
    {
      question: "How does ProfitPilot compare to other trading platforms?",
      answer: "ProfitPilot stands apart with its AI-driven analysis that combines multiple technical indicators, economic data, and market sentiment to provide high-confidence trading signals. Unlike platforms that offer generic indicators, we adapt to your trading style and provide actionable insights with specific entry and exit points. Our backtested strategies have shown 65-75% accuracy in trending markets, significantly outperforming standard technical analysis approaches."
    },
    {
      question: "Can I use ProfitPilot alongside my existing trading platform?",
      answer: "Absolutely! ProfitPilot is designed to complement your existing trading setup. You can use our signals and analysis while executing trades on your preferred platform like Bybit, Binance, or any other exchange. Many of our users keep ProfitPilot open on a separate screen for real-time signals while trading on their usual platform. We also offer API integration with popular exchanges for Pro and Guru users."
    },
    {
      question: "How often are trading signals updated?",
      answer: "Our system continuously analyzes market conditions and updates signals in real-time. For scalping mode, new signals can appear within minutes as market conditions change. Day trading signals are refreshed hourly, while swing trading signals are updated several times daily. Each signal includes a timestamp so you know exactly when it was generated. Premium users receive instant alerts when high-confidence signals emerge."
    },
    {
      question: "Is ProfitPilot suitable for beginners?",
      answer: "Yes, ProfitPilot is designed for traders of all experience levels. Beginners benefit from our clear, actionable signals and educational resources that explain the reasoning behind each recommendation. Our confidence scores and risk metrics help new traders make informed decisions without needing deep technical knowledge. However, we always recommend understanding basic trading principles and proper risk management before trading with real capital."
    },
    {
      question: "What cryptocurrencies does ProfitPilot support?",
      answer: "ProfitPilot analyzes over 50 major cryptocurrencies and trading pairs, with primary focus on BTC, ETH, SOL, BNB, XRP and other high-volume assets. Our Pro and Guru plans provide coverage for 100+ altcoins and emerging tokens. We continuously add support for new cryptocurrencies based on market capitalization, trading volume, and user requests."
    },
    {
      question: "Can I customize the analysis parameters?",
      answer: "Yes, Pro and Guru subscribers can customize various aspects of their analysis. You can adjust risk tolerance, preferred indicators, timeframes, and create custom alert conditions. The platform remembers your preferences and tailors future signals accordingly. Free users have access to our pre-configured analysis settings, which are optimized based on current market conditions."
    },
    {
      question: "What risk management features does ProfitPilot offer?",
      answer: "ProfitPilot incorporates sophisticated risk management tools including suggested stop-loss and take-profit levels for every trade signal. Our system calculates optimal position sizes based on your account balance and risk tolerance. We also provide volatility metrics and confidence scores to help you assess potential downside. Pro and Guru users gain access to advanced portfolio analytics that monitor overall exposure and correlation between positions."
    },
    {
      question: "How is the PP Token integrated with the platform?",
      answer: "The PP Token forms the backbone of our ecosystem, offering numerous benefits to holders. Token holders receive discounts on subscription plans (up to 30% for significant holders), exclusive early access to new features, and participation in governance decisions. The token also powers our staking program, where users can earn additional rewards for providing liquidity. As our platform grows, the utility and demand for PP Token will continue to expand."
    },
    {
      question: "What kind of customer support do you provide?",
      answer: "All users have access to our comprehensive knowledge base and community forums. Email support is available for all subscription tiers, with expected response times of 24-48 hours for free users. Pro subscribers enjoy priority email support (12-hour response) and chat support during business hours. Guru members receive VIP treatment with 24/7 chat support and dedicated account managers for personalized assistance. Our Discord community also offers peer support and regular Q&A sessions with our trading experts."
    },
    {
      question: "How accurate are the trading signals?",
      answer: "Our trading signals typically achieve 65-75% accuracy in trending markets and 55-65% in ranging markets. Each signal comes with a confidence score based on multiple confirming indicators and historical performance. High-confidence signals (rated 75%+) have demonstrated over 80% accuracy in our backtesting. We're transparent about our methodology and provide detailed explanations for each signal, allowing you to understand the reasoning and make informed decisions."
    },
    {
      question: "What advanced data analysis features does ProfitPilot provide?",
      answer: "ProfitPilot leverages powerful AI algorithms to analyze market microstructure, order flow, volume profiles, and whale wallet movements. Our system identifies high-probability trading setups by combining on-chain analytics with technical indicators and market sentiment. Pro users gain access to daily in-depth market reports, correlation heatmaps, and sector rotation analysis. For institutional traders, we offer custom API solutions with tailored analysis parameters and risk models."
    },
    {
      question: "How does ProfitPilot handle volatile market conditions?",
      answer: "During periods of high volatility, ProfitPilot automatically adjusts its analysis parameters and risk assessment. Our volatility-adaptive algorithms increase confirmation thresholds for signals, suggest wider stop-losses, and may recommend reduced position sizes. The platform provides real-time volatility metrics with historical comparisons so you can make informed decisions. Pro and Guru users receive automated volatility alerts before major market events."
    },
    {
      question: "Can ProfitPilot help with tax reporting for my trades?",
      answer: "Yes, ProfitPilot Pro and Guru plans include comprehensive trade logging and tax reporting features. The system automatically tracks your trading activity when connected to exchanges via API, categorizes transactions, calculates realized and unrealized gains/losses, and generates customizable reports for tax purposes. Our platform supports various accounting methods (FIFO, LIFO, HIFO) and can export data in formats compatible with popular tax software."
    },
    {
      question: "What educational resources does ProfitPilot offer?",
      answer: "ProfitPilot provides an extensive library of educational content for traders at all levels. This includes detailed explanations of every signal and indicator, interactive tutorials on trading strategies, weekly market analysis webinars, and a structured learning path from basic to advanced concepts. Pro users gain access to expert strategy workshops, proprietary research reports, and personalized learning recommendations based on your trading history and performance."
    },
    {
      question: "How does the AI-powered system improve over time?",
      answer: "Our AI system employs advanced machine learning techniques that continuously optimize analysis parameters based on market performance data. The system learns from successful and unsuccessful signals to refine its algorithms, adapts to changing market regimes, and incorporates new data sources as they become available. This self-improving approach ensures that ProfitPilot's effectiveness grows over time, particularly in markets you trade most frequently."
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Background Image with Frosty Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="/lovable-uploads/c838292a-0224-48a0-a205-21fde8947f28.png" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-card/90 backdrop-blur-md"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="flex items-center gap-2 mr-4">
              <img src={Logo} alt="Logo" className="h-8 w-8" />
              <div className="font-bold text-xl">ProfitPilot</div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium flex-1">
              <a href="#features" className="transition-colors hover:text-foreground/80">Features</a>
              <a href="#trading-modes" className="transition-colors hover:text-foreground/80">Trading Modes</a>
              <a href="#pricing" className="transition-colors hover:text-foreground/80">Pricing</a>
              <a href="#testimonials" className="transition-colors hover:text-foreground/80">Testimonials</a>
              <a href="#token" className="transition-colors hover:text-foreground/80">PP Token</a>
              <a href="#faq" className="transition-colors hover:text-foreground/80">FAQ</a>
            </nav>
            
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="ghost" onClick={() => document.getElementById('signup-section')?.scrollIntoView({ behavior: 'smooth' })}>
                Log In
              </Button>
              <Button onClick={() => document.getElementById('signup-section')?.scrollIntoView({ behavior: 'smooth' })}>
                Sign Up
              </Button>
            </div>
          </div>
        </header>
        
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-6 lg:px-8 flex flex-col items-center text-center space-y-8">
          <Badge variant="outline" className="mb-4">Version 1.0.0 is now available</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl leading-tight tracking-tighter">
            Your AI Trading Assistant for Crypto Markets
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
            ProfitPilot gives you real-time market signals, intelligent trade suggestions, and deep data analysis for crypto trading.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" onClick={handleGuestAccess} className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
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
              <h2 className="text-3xl font-bold mb-4">Advanced Trading Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                ProfitPilot brings institutional-grade trading capabilities and real-time market insights to help you make better trading decisions.
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
                  src="/lovable-uploads/c838292a-0224-48a0-a205-21fde8947f28.png" 
                  alt="Market Analytics Dashboard" 
                  className="rounded-md w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Platforms Availability Section */}
        <PlatformsAvailability />
        
        {/* Trading Modes Section */}
        <section id="trading-modes" className="py-20 px-4 md:px-6 lg:px-8 bg-muted">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Three Trading Modes for Any Strategy</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                ProfitPilot adapts to your trading style with specialized modes for different trading timeframes and strategies.
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
        
        {/* Testimonials Section */}
        <section id="testimonials">
          <CustomerReviews />
        </section>
        
        {/* Token Section */}
        <section id="token">
          <TokenProgress />
        </section>
        
        {/* Discord Community Section */}
        <DiscordCommunity />
        
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
        
        {/* FAQ Section - Update with reference to the separate FAQ component */}
        <section id="faq" className="py-20 px-4 md:px-6 lg:px-8 bg-secondary/50">
          <FAQ />
        </section>
        
        {/* Additional Features Grid */}
        <section className="py-20 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Traders Choose ProfitPilot</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the features that give our users the edge in today's volatile crypto markets.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Proprietary AI Algorithm",
                  description: "Our advanced algorithm analyzes multiple indicators and market patterns to provide high-confidence signals.",
                  icon: <Sparkles className="h-5 w-5 text-primary" />
                },
                {
                  title: "Real-time Market Data",
                  description: "Connect directly to exchange APIs for the most up-to-date price information and market movements.",
                  icon: <LineChart className="h-5 w-5 text-primary" />
                },
                {
                  title: "Economic Calendar",
                  description: "Never miss important market events with our comprehensive economic calendar.",
                  icon: <CalendarDays className="h-5 w-5 text-primary" />
                },
                {
                  title: "Risk Management",
                  description: "Get suggested stop-loss and take-profit levels with every trade recommendation.",
                  icon: <Shield className="h-5 w-5 text-primary" />
                },
                {
                  title: "Multi-timeframe Analysis",
                  description: "Analyze the market across multiple timeframes to confirm trends and identify optimal entry points.",
                  icon: <Clock className="h-5 w-5 text-primary" />
                },
                {
                  title: "Performance Tracking",
                  description: "Monitor your trading performance and improve your strategy with detailed analytics.",
                  icon: <TrendingUp className="h-5 w-5 text-primary" />
                },
                {
                  title: "Token Utility",
                  description: "PP Token holders receive exclusive benefits including fee discounts and premium features access.",
                  icon: <DollarSign className="h-5 w-5 text-primary" />
                },
                {
                  title: "Fast Execution",
                  description: "Execute trades quickly with our optimized interface designed for speed and efficiency.",
                  icon: <Zap className="h-5 w-5 text-primary" />
                },
                {
                  title: "Special Offers",
                  description: "Regular promotions and special offers for both new users and loyal customers.",
                  icon: <BadgePercent className="h-5 w-5 text-primary" />
                }
              ].map((feature, index) => (
                <Card key={index} className="border-border/60 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        {feature.icon}
                      </div>
                      <h3 className="font-medium text-lg">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
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
              <h2 className="text-2xl font-bold">Get Started with ProfitPilot</h2>
              <p className="text-muted-foreground">
                Sign up now to access real-time trading signals and market analysis.
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
              
              <Button 
                variant="link" 
                className="text-primary" 
                onClick={handleForgotPassword}
              >
                Forgot password?
              </Button>
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
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} ProfitPilot. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Twitter</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Discord</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M7.5 7.2c.3-.1.6-.2.8-.2h7.2c.9 0 1.7.3 2.3.8"></path><path d="M3.2 14.8a.4.4 0 0 0 0 .4c1 1.8 2.3 3.1 3.8 4 .6.4 1.5.8 2.2 1 .9.2 1.8.3 2.8.3.5 0 1 0 1.5-.1.7-.1 1.3-.3 1.9-.5a13 13 0 0 0 3.2-2.2"></path><path d="M17.8 14.5c-.3.3-.7.6-1 .8-.6.4-1.3.6-2 .8"></path><path d="M5 8.2a15.5 15.5 0 0 0-1.8 5.5c-.1.5-.1 1.1-.1 1.6 0 1.5.5 2.9 1.3 4"></path><path d="M17.9 17.2a2 2 0 0 1-.3 1.7c-.3.3-.7.5-1.2.5-1 0-1.7-.6-1.7-.6l-2.5 1.7a3.4 3.4 0 0 0 2.8 1c.9 0 1.8-.4 2.5-1a3.8 3.8 0 0 0 1.3-3v-5"></path></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">GitHub</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Welcome;
