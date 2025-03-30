
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Bitcoin, ArrowRight, Info, AlertCircle } from 'lucide-react';
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

// Crypto address placeholders
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

  const plan = searchParams.get('plan') || 'Pro';
  const cycle = searchParams.get('cycle') || 'monthly';
  
  const planDetails = {
    Freebie: { price: { monthly: 0, yearly: 0 }, description: 'Free Trial' },
    Pro: { price: { monthly: 39, yearly: 349 }, description: 'Perfect for active traders' },
    Guru: { price: { monthly: 99, yearly: 995 }, description: 'For professional traders' },
  };

  const selectedPlan = planDetails[plan as keyof typeof planDetails];
  
  // Define credit card form schema
  const cardFormSchema = z.object({
    cardName: z.string().min(2, { message: "Cardholder name is required" }),
    cardNumber: z.string().min(16, { message: "Please enter a valid card number" }).max(19),
    expiryDate: z.string().min(5, { message: "Please enter a valid expiry date (MM/YY)" })
      .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: "Please use the format MM/YY" }),
    cvc: z.string().min(3, { message: "CVC is required" }).max(4),
    email: z.string().email({ message: "Please enter a valid email address" }),
  });

  // Define crypto form schema
  const cryptoFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    cryptoType: z.enum(["bitcoin", "ethereum", "usdt"], {
      required_error: "Please select a cryptocurrency",
    }),
  });

  // Initialize form
  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      email: "",
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
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
      
      // Navigate to thank you page
      navigate('/thank-you');
    }, 2000);
  };

  const handleCryptoSubmit = async (values: z.infer<typeof cryptoFormSchema>) => {
    console.log("Processing crypto payment...", values);
    toast({
      title: "Crypto Payment Initiated",
      description: `Please send payment to the displayed ${values.cryptoType} address. We'll send a confirmation to ${values.email} after receiving payment.`,
    });
    
    // Normally this would wait for confirmation from a backend
    // For demo, we'll simulate payment after a few seconds
    setTimeout(() => {
      navigate('/thank-you');
    }, 3000);
  };

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Complete Your Purchase</h1>
        <p className="text-base text-muted-foreground">
          You've selected the <span className="font-semibold">{plan}</span> plan, billed {cycle}.
        </p>
      </div>

      <div className="mb-8">
        <Card>
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
              
              {cycle === 'yearly' && (
                <div className="flex justify-between text-green-500">
                  <span>Yearly discount</span>
                  <span>-${(selectedPlan.price.monthly * 12 - selectedPlan.price.yearly).toFixed(2)}</span>
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
          <Card>
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
          <Card>
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
                                <Bitcoin className="h-5 w-5 text-orange-500" />
                                Bitcoin (BTC)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-4">
                              <RadioGroupItem value="ethereum" id="ethereum" />
                              <Label htmlFor="ethereum" className="flex items-center gap-2 cursor-pointer font-medium">
                                <svg className="h-5 w-5 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 2L19 12L12 16L5 12L12 2Z" fill="currentColor" />
                                  <path d="M12 16L19 12L12 22L5 12L12 16Z" fill="currentColor" />
                                </svg>
                                Ethereum (ETH)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-4">
                              <RadioGroupItem value="usdt" id="usdt" />
                              <Label htmlFor="usdt" className="flex items-center gap-2 cursor-pointer font-medium">
                                <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  );
};

export default PaymentPage;
