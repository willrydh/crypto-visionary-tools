
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ThumbsUp, ArrowRight, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Show toast when component mounts
    toast({
      title: "Payment Successful",
      description: "Thank you for subscribing to ProfitPilot AI!",
    });
  }, []);
  
  return (
    <div className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto min-h-screen flex flex-col justify-center items-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full flex justify-center mb-8"
      >
        <div className="rounded-full bg-green-100 dark:bg-green-900 p-6">
          <Check className="h-16 w-16 text-green-600 dark:text-green-400" />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full"
      >
        <Card className="border-2 border-green-500/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Thank You for Your Purchase!</CardTitle>
            <CardDescription>
              Your ProfitPilot AI subscription has been successfully activated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4 bg-muted rounded-full px-6 py-3">
                <ThumbsUp className="h-6 w-6 text-primary" />
                <span className="font-medium">Your account is now active</span>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-muted/30">
              <h3 className="font-medium mb-2 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                Check Your Email
              </h3>
              <p className="text-sm text-muted-foreground">
                We've sent a receipt and confirmation to your email address. If you don't see it within a few minutes, please check your spam folder.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-background">
                <h3 className="font-medium mb-1">Next Steps</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Log in to access premium features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Configure your trading preferences</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Set up price alerts for your assets</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg border bg-background">
                <h3 className="font-medium mb-1">Support</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Need help getting started? Our support team is here for you.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full sm:w-auto"
            >
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/settings')} 
              className="w-full sm:w-auto"
            >
              Account Settings
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;
