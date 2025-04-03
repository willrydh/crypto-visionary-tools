
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, X, BrainCircuit, Zap, LockKeyhole, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { BlurredBackground } from '@/components/ui/blurred-background';

const PricingPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  
  // Background images
  const pricingImages = [
    '/lovable-uploads/4a0c6ea8-49f6-4dd0-8216-6e0085aec938.png',
    '/lovable-uploads/83cd3ce3-8a61-4043-aa68-18467165dbc3.png',
  ];
  
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
        { name: 'Dashboard access', included: true },
        { name: 'Basic market data', included: true },
        { name: 'Settings customization', included: true },
        { name: 'Single device login', included: true },
        { name: 'Trading signals', included: false },
        { name: 'Real-time analysis', included: false },
        { name: 'Support & resistance levels', included: false },
        { name: 'Premium market insights', included: false },
        { name: 'Economic calendar', included: false },
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Pro',
      description: 'Everything you need for success',
      price: {
        monthly: 29.99,
        yearly: 19.99,
      },
      badge: 'Best Value',
      features: [
        { name: 'Full dashboard access', included: true },
        { name: 'Complete market data', included: true },
        { name: 'Settings customization', included: true },
        { name: 'Multi-device login', included: true },
        { name: 'AI-powered trading signals', included: true },
        { name: 'Real-time analysis', included: true },
        { name: 'Support & resistance levels', included: true },
        { name: 'Premium market insights', included: true },
        { name: 'Economic calendar', included: true },
      ],
      cta: 'Get Pro',
      popular: true,
    },
  ];

  const comingSoonFeatures = [
    'AI-powered automatic trade execution',
    'Real-time risk analysis on open positions',
    'Advanced portfolio optimization algorithms',
    'Personalized trading strategies based on your risk profile',
    'Institutional-grade market analysis tools'
  ];

  const handleCTAClick = (plan: string) => {
    if (plan === 'Freebie') {
      toast({
        title: "Free Trial Activated",
        description: "You've started your 30-day free trial of ProfitPilot.",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Plan Selected",
        description: `You've selected the ${plan} plan.`,
      });
      navigate('/payment');
    }
  };
  
  const yearlySavings = (29.99 * 12 - 19.99 * 12).toFixed(2);
  const savingsPercentage = Math.round(((29.99 * 12) - (19.99 * 12)) / (29.99 * 12) * 100);

  return (
    <div className="min-h-screen flex w-full relative overflow-hidden">
      <BlurredBackground imageSrc={pricingImages} className="opacity-50" />
      <div className="relative z-10 w-full">
        <header className="border-b border-border py-4 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate('/')}>
              ← Back to Home
            </Button>
          </div>
        </header>
        
        <div className="container mx-auto space-y-12 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose Your ProfitPilot Plan</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Unlock the full potential of AI-powered trading with our Pro plan, or try the platform for free for 30 days.
            </p>
            
            <div className="flex justify-center mb-10 mt-8">
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
                      Save {savingsPercentage}%
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`flex flex-col backdrop-blur-sm bg-card/80 ${plan.popular ? 'border-primary shadow-lg ring-2 ring-primary' : ''}`}
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
                    {plan.price[billingCycle] > 0 ? (
                      <>
                        <span className="text-4xl font-bold">
                          ${plan.price[billingCycle]}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          /{billingCycle === 'monthly' ? 'mo' : 'mo, billed yearly'}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold">Free</span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-6">
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
                    onClick={() => handleCTAClick(plan.name)}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="backdrop-blur-sm bg-card/80 border-dashed border-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <span>Guru Plan - Coming Soon</span>
                </CardTitle>
                <CardDescription>
                  Our most advanced plan with cutting-edge AI features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Advanced AI Features</h3>
                    <p className="text-sm text-muted-foreground">
                      Exclusive AI-powered features that take your trading to a whole new level
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {comingSoonFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Pricing will be revealed soon. Join the waitlist to be notified.</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                  Join Waitlist
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="max-w-3xl mx-auto mt-10">
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Do you offer refunds?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, we offer a 14-day money-back guarantee on all paid plans, no questions asked.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Can I change my plan later?</h3>
                  <p className="text-sm text-muted-foreground">
                    You can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">What payment methods do you accept?</h3>
                  <p className="text-sm text-muted-foreground">
                    We accept all major credit cards, Apple Pay, Google Pay, and cryptocurrencies.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Is there an easter egg discount?</h3>
                  <p className="text-sm text-muted-foreground">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm"
                      onClick={() => navigate('/easter-egg')}
                    >
                      Maybe... click here if you're feeling lucky!
                    </Button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
