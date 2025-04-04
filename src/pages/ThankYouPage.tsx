
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, BookOpen, Gift, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BlurredBackground } from '@/components/ui/blurred-background';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const backgroundImages = [
    '/lovable-uploads/cd165e0d-4678-4599-8125-3439bc1496cc.png',
    '/lovable-uploads/4a0c6ea8-49f6-4dd0-8216-6e0085aec938.png',
  ];

  // Launch confetti when component mounts
  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Show a welcome toast
    toast({
      title: "Welcome to ProfitPilot Pro!",
      description: "Your account has been upgraded. Enjoy all premium features!",
    });
    
    // Random confetti bursts over time
    const interval = setInterval(() => {
      const timeLeft = end - Date.now();
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
    }, 250);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <BlurredBackground imageSrc={backgroundImages} className="opacity-50" />
      
      <div className="container max-w-4xl px-4 py-12 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Thank You for Your Purchase!</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Your account has been upgraded to ProfitPilot Pro. You now have access to all premium features.
          </p>
        </div>
        
        {/* Order Details - Moved to the top */}
        <Card className="mb-8 backdrop-blur-sm bg-card/80">
          <CardHeader>
            <CardTitle>Your Order Details</CardTitle>
            <CardDescription>Reference and account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-1">Order Information</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Order #: PRO-12345-XYZ</p>
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p>Plan: ProfitPilot Pro (Yearly)</p>
                  <p>Next billing date: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Your Pro Benefits</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>AI Trading Signals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>Real-time Technical Analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>Support & Resistance Levels</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>Economic Calendar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>Premium Market Insights</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Dashboard Button - Moved up */}
        <div className="text-center mb-10">
          <Button size="lg" onClick={() => navigate('/dashboard')}>
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            We've sent a receipt to your email. If you have any questions, please contact our support team.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="backdrop-blur-sm bg-card/80">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Getting Started</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Discover how to get the most out of ProfitPilot with our quick start guide.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/education')}>
                View Guide
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/80">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Gift className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Bonus Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You've unlocked premium features including advanced signals and full technical analysis.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/signals')}>
                Explore Features
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/80">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Set Up Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure your market alerts and notifications to stay updated on market events.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/notifications')}>
                Configure Alerts
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
