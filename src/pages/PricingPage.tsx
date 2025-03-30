import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';

const PricingPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
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

  const handleCTAClick = (plan: string) => {
    toast({
      title: "Plan Selected",
      description: `You've selected the ${plan} plan.`,
    });
    
    navigate('/payment');
  };

  return (
    <div className="min-h-screen flex w-full">
      <MainLayout>
        <div className="container mx-auto space-y-16 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Choose the Perfect Plan</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              Select the right plan for your trading needs, from free trials to professional setups with API access.
            </p>
            
            <div className="flex justify-center mb-12 mt-8">
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
                    onClick={() => handleCTAClick(plan.name)}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="max-w-2xl mx-auto bg-card/50 p-6 rounded-lg border border-border">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Can I cancel my subscription?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can cancel your subscription anytime. If you cancel, you'll continue to have access until the end of your billing period.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Do you offer refunds?</h3>
                <p className="text-sm text-muted-foreground">
                  We offer a 14-day money-back guarantee on all paid plans.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">What payment methods do you accept?</h3>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards and cryptocurrencies including Bitcoin, Ethereum, and USDT.
                </p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default PricingPage;
