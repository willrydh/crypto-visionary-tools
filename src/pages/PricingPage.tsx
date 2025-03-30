
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();

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

  const handleSignUp = (plan: string) => {
    // Navigate to the payment page with the selected plan and billing cycle
    navigate(`/payment?plan=${encodeURIComponent(plan)}&cycle=${billingCycle}`);
  };

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">
          Choose the Perfect Plan for Your Trading Journey
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
          ProfitPilot AI offers cutting-edge tools for traders at every level.
          Subscribe today and elevate your trading strategies.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <Tabs 
          value={billingCycle} 
          onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}
          className="w-full max-w-[400px]"
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
                <span className="text-3xl md:text-4xl font-bold">
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
                      <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 mr-2 text-gray-300 flex-shrink-0" />
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
                onClick={() => handleSignUp(plan.name)}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto text-left">
          <div className="p-4 md:p-6 rounded-lg border border-border">
            <h3 className="text-base md:text-lg font-semibold mb-2">Can I cancel my subscription?</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Yes, you can cancel your subscription anytime. If you cancel, you'll continue to have access until the end of your billing period.
            </p>
          </div>
          <div className="p-4 md:p-6 rounded-lg border border-border">
            <h3 className="text-base md:text-lg font-semibold mb-2">How does the free trial work?</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              The free trial gives you 30 days of access to our basic features. No credit card required to start.
            </p>
          </div>
          <div className="p-4 md:p-6 rounded-lg border border-border">
            <h3 className="text-base md:text-lg font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              We accept all major credit cards and cryptocurrencies including Bitcoin, Ethereum, and USDT.
            </p>
          </div>
          <div className="p-4 md:p-6 rounded-lg border border-border">
            <h3 className="text-base md:text-lg font-semibold mb-2">Are the signals financial advice?</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              No, ProfitPilot AI provides algorithmic trading signals based on technical analysis, not financial advice. Always do your own research.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
