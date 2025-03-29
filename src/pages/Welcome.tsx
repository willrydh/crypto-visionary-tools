
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Github,
  Mail,
  LogIn,
  ChevronRight,
  Sparkles,
  LineChart,
  ArrowUpRight,
  BellRing,
  CandlestickChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Logo from '@/assets/logo.svg';


const Welcome = () => {
  // Feature items to display
  const features = [
    {
      title: "Live Deep Market Analysis",
      description: "Get real-time market, macro and technical analysis with AI-powered signals",
      icon: <LineChart className="h-5 w-5 text-primary" />
    },
    {
      title: "AI-Powered Trade Signals",
      description: "Receive smart trade setups based on scalping, daytrading and over night",
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
    console.log(`Login with ${provider}`);
    // For now, just redirect to main dashboard
    window.location.href = '/';
  };
  
  const handleGuestAccess = () => {
    console.log('Guest access');
    window.location.href = '/';
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-8 text-center animate-fade-in">
        {/* Logo and title */}
        <div className="space-y-2">
       <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary mb-4 overflow-hidden">
  <img src={Logo} alt="Logo" className="h-12 w-12 object-contain" />
      </div>
          <h1 className="text-4xl font-bold tracking-tight">ProfitPilot AI</h1>
          <p className="text-xl text-muted-foreground">
            The best AI trading companion of 2025*
          </p>
        </div>
        
        {/* Login options */}
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
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur border-border/50 overflow-hidden">
              <CardContent className="p-4 flex items-start space-x-4">
                <div className="mt-1">{feature.icon}</div>
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Footer */}
        <div className="pt-8 text-sm text-muted-foreground">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
