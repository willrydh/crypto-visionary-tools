import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Bitcoin, ArrowRight, Info, AlertCircle, Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlurredBackground } from '@/components/ui/blurred-background';

const cryptoAddresses = {
  bitcoin: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
  ethereum: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  usdt: 'TQVxjRAbN14gZPKv9CtrJqe1C6PZeGXpn4'
};

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentTab, setPaymentTab] = useState<string>('credit-card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cardSaved, setCardSaved] = useState<boolean>(false);

  const discount = searchParams.get('discount') || '';
  const plan = searchParams.get('plan') || 'Pro';
  const cycle = searchParams.get('cycle') || 'yearly';
  
  const backgroundImages = [
    '/lovable-uploads/4a0c6ea8-49f6-4dd0-8216-6e0085aec938.png',
    '/lovable-uploads/cd165e0d-4678-4599-8125-3439bc1496cc.png',
  ];
  
  const standardPricing = {
    Freebie: { price: { monthly: 0, yearly: 0 }, description: 'Free Trial' },
    Pro: { price: { monthly: 29.99, yearly: 19.99 * 12 }, description: 'Everything you need for success' },
  };

  const pricing = { ...standardPricing };
  if (discount === 'EASTER2025') {
    pricing.Pro.price.yearly = 199;
  }

  const selectedPlan = pricing[plan as keyof typeof pricing];
  
  const cardFormSchema = z.object({
    cardName: z.string().min(2, { message: "Cardholder name is required" }),
    cardNumber: z.string().min(16, { message: "Please enter a valid card number" }).max(19),
    expiryDate: z.string().min(5, { message: "Please enter a valid expiry date (MM/YY)" })
      .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: "Please use the format MM/YY" }),
    cvc: z.string().min(3, { message: "CVC is required" }).max(4),
    email: z.string().email({ message: "Please enter a valid email address" }),
    saveCard: z.boolean().optional(),
  });

  const cryptoFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    cryptoType: z.enum(["bitcoin", "ethereum", "usdt"], {
      required_error: "Please select a cryptocurrency",
    }),
  });

  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      email: "",
      saveCard: true,
    },
  });

  const cryptoForm = useForm<z.infer<typeof cryptoFormSchema>>({
    resolver: zodResolver(cryptoFormSchema),
    defaultValues: {
      email: "",
      cryptoType: "bitcoin",
    },
  });

  const handleCardSubmit = async (values: z.infer<typeof cardFormSchema>) => {
    setIsProcessing(true);
    console.log("Processing credit card payment...", values);
    
    setTimeout(() => {
      setIsProcessing(false);
      setCardSaved(values.saveCard || false);
      
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
      
      navigate('/thank-you');
    }, 2000);
  };

  const handleCryptoSubmit = async (values: z.infer<typeof cryptoFormSchema>) => {
    console.log("Processing crypto payment...", values);
    toast({
      title: "Crypto Payment Initiated",
      description: `Please send payment to the displayed ${values.cryptoType} address. We'll send a confirmation to ${values.email} after receiving payment.`,
    });
    
    setTimeout(() => {
      navigate('/thank-you');
    }, 3000);
  };

  const handleQuickPay = (method: string) => {
    setIsProcessing(true);
    
    toast({
      title: `${method} Payment Initiated`,
      description: `Processing your payment via ${method}...`,
    });
    
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/thank-you');
    }, 2000);
  };

  const discountPercentage = discount 
    ? Math.round(((standardPricing.Pro.price.yearly - pricing.Pro.price.yearly) / standardPricing.Pro.price.yearly) * 100) 
    : 0;

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-fade-in relative">
      <BlurredBackground imageSrc={backgroundImages} className="opacity-30" />
      
      <div className="absolute top-4 left-4 z-20">
        <Button variant="ghost" onClick={() => navigate('/pricing')} className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pricing
        </Button>
      </div>
      
      <div className="relative z-10 mt-20 md:mt-16">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-base text-muted-foreground">
            You've selected the <span className="font-semibold">{plan}</span> plan, billed {cycle}.
            {discount && <span className="text-bullish ml-2">({discountPercentage}% off with code {discount})</span>}
          </p>
        </div>

        <div className="mb-8">
          <Card className="backdrop-blur-sm bg-card/80">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order before payment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <div>
                    <h3 className="font-medium">{plan} Plan ({cycle})</h3>
                    <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                  </div>
                  <span className="text-xl font-bold">${selectedPlan.price[cycle as keyof typeof selectedPlan.price]}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${selectedPlan.price[cycle as keyof typeof selectedPlan.price]}</span>
                </div>
                
                {discount && (
                  <div className="flex justify-between text-bullish">
                    <span>Discount ({discount})</span>
                    <span>-${(standardPricing.Pro.price.yearly - pricing.Pro.price.yearly).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between pt-4 border-t border-border">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">${selectedPlan.price[cycle as keyof typeof selectedPlan.price]}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button 
            variant="outline" 
            className="h-14 bg-foreground text-primary-foreground hover:bg-foreground/90 flex items-center justify-center"
            onClick={() => handleQuickPay('Apple Pay')}
            disabled={isProcessing}
          >
            <span className="font-medium text-lg">Apple Pay</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-14 bg-card text-foreground hover:bg-gray-100 border-border flex items-center justify-center"
            onClick={() => handleQuickPay('Google Pay')}
            disabled={isProcessing}
          >
            <span className="font-medium text-lg">Google Pay</span>
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground mb-6">
          - or pay with -
        </div>

        <Tabs value={paymentTab} onValueChange={setPaymentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="credit-card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Credit Card</span>
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4" />
              <span>Cryptocurrency</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="credit-card">
            <Card className="backdrop-blur-sm bg-card/80">
              <CardHeader>
                <CardTitle>Credit Card Payment</CardTitle>
                <CardDescription>Enter your card details to complete your purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...cardForm}>
                  <form onSubmit={cardForm.handleSubmit(handleCardSubmit)} className="space-y-6">
                    <FormField
                      control={cardForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={cardForm.control}
                      name="cardName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cardholder Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={cardForm.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="1234 5678 9012 3456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={cardForm.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/YY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={cardForm.control}
                        name="cvc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVC</FormLabel>
                            <FormControl>
                              <Input placeholder="123" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={cardForm.control}
                      name="saveCard"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-muted/50">
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="form-checkbox h-4 w-4 text-primary rounded border-border focus:ring-primary"
                              />
                              <label htmlFor="saveCard" className="text-sm font-medium leading-none cursor-pointer">
                                Save card for future payments
                              </label>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex text-sm items-center rounded-md p-3 bg-muted/50">
                      <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Your payment information is encrypted and secure. We never store your full card details.
                      </p>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isProcessing}>
                      {isProcessing ? (
                        <>Processing <ArrowRight className="ml-2 h-4 w-4 animate-pulse" /></>
                      ) : (
                        <>Complete Payment <ArrowRight className="ml-2 h-4 w-4" /></>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="crypto">
            <Card className="backdrop-blur-sm bg-card/80">
              <CardHeader>
                <CardTitle>Cryptocurrency Payment</CardTitle>
                <CardDescription>Pay with your preferred cryptocurrency</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...cryptoForm}>
                  <form onSubmit={cryptoForm.handleSubmit(handleCryptoSubmit)} className="space-y-6">
                    <FormField
                      control={cryptoForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            We'll send your receipt and confirmation to this email.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={cryptoForm.control}
                      name="cryptoType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Select Cryptocurrency</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-2 rounded-md border p-4">
                                <RadioGroupItem value="bitcoin" id="bitcoin" />
                                <Label htmlFor="bitcoin" className="flex items-center gap-2 cursor-pointer font-medium">
                                  <Bitcoin className="h-5 w-5 text-warning" />
                                  Bitcoin (BTC)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 rounded-md border p-4">
                                <RadioGroupItem value="ethereum" id="ethereum" />
                                <Label htmlFor="ethereum" className="flex items-center gap-2 cursor-pointer font-medium">
                                  <svg className="h-5 w-5 text-mode-night" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L19 12L12 16L5 12L12 2Z" fill="currentColor" />
                                    <path d="M12 16L19 12L12 22L5 12L12 16Z" fill="currentColor" />
                                  </svg>
                                  Ethereum (ETH)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 rounded-md border p-4">
                                <RadioGroupItem value="usdt" id="usdt" />
                                <Label htmlFor="usdt" className="flex items-center gap-2 cursor-pointer font-medium">
                                  <svg className="h-5 w-5 text-bullish" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" fill="currentColor" />
                                    <path d="M8 11.5H16V14.5H8V11.5Z" fill="white" />
                                    <path d="M12 6V8.5M12 8.5H8V11.5M12 8.5H16V11.5" stroke="white" strokeWidth="1.5" />
                                  </svg>
                                  Tether (USDT)
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="bg-muted p-4 rounded-md">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="font-medium">Payment Instructions</p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Send exactly ${selectedPlan.price[cycle as keyof typeof selectedPlan.price]} worth of {cryptoForm.watch("cryptoType")} to the address below:
                      </p>
                      <div className="p-3 bg-background border rounded-md text-center break-all font-mono text-xs mb-3">
                        {cryptoAddresses[cryptoForm.watch("cryptoType") as keyof typeof cryptoAddresses]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        After sending payment, click the button below. We'll verify your transaction and activate your account.
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      I've Sent the Payment <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PaymentPage;
