
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Github,
  Mail,
  LogIn,
  ChevronRight,
  Sparkles,
  LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Welcome = () => {
  // Feature items to display
  const features = [
    {
      title: "Live Market Analysis",
      description: "Get real-time technical analysis with confidence scores"
    },
    {
      title: "AI-Powered Trade Suggestions",
      description: "Receive smart trade setups with entry, stop loss, and target levels"
    },
    {
      title: "Economic Calendar",
      description: "Stay informed with upcoming market-moving events"
    },
    {
      title: "Support & Resistance Finder",
      description: "Discover key price levels based on market structure"
    }
  ];
  
  // Login options with icons
  interface LoginOption {
    label: string;
    icon: LucideIcon;
    variant: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
    action: () => void;
  }
  
  const loginOptions: LoginOption[] = [
    {
      label: "Sign in with GitHub",
      icon: Github,
      variant: "outline",
      action: () => handleLogin('github')
    },
    {
      label: "Sign in with Email",
      icon: Mail,
      variant: "outline",
      action: () => handleLogin('email')
    },
    {
      label: "Guest Access",
      icon: LogIn,
      variant: "secondary",
      action: () => handleGuestAccess()
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
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">ProfitPilot AI</h1>
          <p className="text-xl text-muted-foreground">
            Trade Smarter. React Faster.
          </p>
        </div>
        
        {/* Login options */}
        <div className="space-y-3">
          {loginOptions.map((option, index) => (
            <Button 
              key={index}
              variant={option.variant}
              className="w-full justify-start text-base"
              onClick={option.action}
            >
              <option.icon className="mr-2 h-5 w-5" />
              {option.label}
              <ChevronRight className="ml-auto h-5 w-5" />
            </Button>
          ))}
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
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
