
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Sparkles, Gift, Copy, Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BlurredBackground } from '@/components/ui/blurred-background';
import confetti from 'canvas-confetti';

const EasterEggDiscount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const discountCode = "EASTER2025";
  
  const backgroundImages = [
    '/lovable-uploads/cbf4d840-cd1b-4a3f-ab13-dce9b7f9bb53.png',
    '/lovable-uploads/cd165e0d-4678-4599-8125-3439bc1496cc.png',
  ];

  useEffect(() => {
    // Reset states when component mounts
    setCopied(false);
    setRevealed(false);
  }, []);

  const handleReveal = () => {
    setRevealed(true);
    
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    toast({
      title: "Discount Code Found!",
      description: "You've discovered our special discount: $199 for an entire year!",
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(discountCode);
    setCopied(true);
    
    toast({
      title: "Code Copied!",
      description: "Use this code during checkout for your discount.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyDiscount = () => {
    // Store the discount code in session storage
    sessionStorage.setItem('discountCode', discountCode);
    
    toast({
      title: "Discount Applied!",
      description: "Your yearly plan is now $199 for the entire year!",
    });
    
    // Navigate to payment with discount applied
    navigate('/payment?discount=EASTER2025');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black/20">
      <BlurredBackground imageSrc={backgroundImages} className="opacity-80" />
      
      <div className="absolute top-4 left-4 z-20">
        <Button variant="ghost" onClick={() => navigate('/pricing')} className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pricing
        </Button>
      </div>
      
      <div className="container max-w-md px-4 py-8 relative z-10">
        {!revealed ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="backdrop-blur-lg bg-card/50 border-primary/50">
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  <Sparkles className="h-6 w-6 text-yellow-500 inline-block mb-1 mr-2" />
                  You Found Something Special!
                </CardTitle>
                <CardDescription className="text-center">
                  Looks like you've stumbled upon our Easter secret...
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="aspect-square max-w-[200px] mx-auto mb-6 relative">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                    className="w-full h-full"
                  >
                    <Gift className="w-full h-full text-primary/80" />
                  </motion.div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Want to see what's inside? This could be your lucky day!
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleReveal}
                >
                  Open Special Offer
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="backdrop-blur-lg bg-card/50 border-primary/50 overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
              
              <CardHeader>
                <div className="text-center">
                  <Badge variant="outline" className="mx-auto mb-2 bg-primary/10">Exclusive Offer</Badge>
                  <CardTitle className="text-2xl">
                    ProfitPilot Pro Yearly
                  </CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">$199</span>
                    <span className="text-muted-foreground ml-2">/year</span>
                  </div>
                  <CardDescription className="mt-2">
                    <span className="text-green-500 font-medium">Save over 45%</span> with this special discount!
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-mono font-bold tracking-wider">{discountCode}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCopyCode}
                      className="h-8"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  This exclusive offer is only available through this hidden page. 
                  Apply now to claim your discount!
                </p>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={handleApplyDiscount} 
                  className="w-full"
                  size="lg"
                >
                  Apply & Continue to Payment
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EasterEggDiscount;
