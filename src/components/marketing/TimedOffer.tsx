
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Copy, CheckCircle, Sparkles, Gift } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface TimedOfferProps {
  seconds?: number;
  couponCode?: string;
}

const TimedOffer: React.FC<TimedOfferProps> = ({ 
  seconds = 60,
  couponCode = "EASTER25"
}) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isVisible && !isExpired) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Show expired state instead of hiding
          setIsExpired(true);
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isVisible, isExpired]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponCode).then(
      () => {
        setCopied(true);
        toast({
          title: "Coupon copied!",
          description: "The discount code has been copied to your clipboard.",
        });
        setTimeout(() => setCopied(false), 3000);
      },
      () => {
        toast({
          title: "Copy failed",
          description: "Please try copying the code manually.",
          variant: "destructive",
        });
      }
    );
  };

  const handleUseClick = () => {
    navigate('/easter-egg');
  };

  const percentComplete = ((seconds - timeLeft) / seconds) * 100;
  
  if (isExpired) {
    return (
      <Card className="relative overflow-hidden border-amber-500/30 bg-amber-500/5 shadow-lg mt-8 mb-16">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/10 p-2 rounded-full">
                <Gift className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Offer Expired</h3>
                <p className="text-muted-foreground">
                  Don't worry, we still have something special for you!
                </p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button 
                className="text-white" 
                variant="outline"
                onClick={() => navigate('/easter-egg')}
              >
                Find Secret Discount
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isVisible) return null;
  
  return (
    <Card className="relative overflow-hidden border-amber-500/30 bg-amber-500/5 shadow-lg mt-8 mb-16">
      <div className="absolute bottom-0 left-0 h-1 bg-amber-500" style={{ width: `${percentComplete}%` }}></div>
      
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 p-2 rounded-full">
              <Sparkles className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <Badge className="bg-amber-500 text-white mb-1">Limited Time Offer</Badge>
              <h3 className="text-xl font-bold">Special 25% Discount!</h3>
              <p className="text-muted-foreground">
                Subscribe now to get 25% off your first month
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-500 animate-pulse" />
                <span className="text-sm font-medium">Expires in:</span>
              </div>
              <div className="text-lg font-bold tabular-nums">{timeLeft}s</div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative group w-full sm:w-auto">
                <div 
                  className="flex items-center justify-between gap-2 bg-background px-4 py-2 rounded-lg border border-amber-500/30 cursor-pointer w-full sm:w-auto"
                  onClick={copyToClipboard}
                >
                  <code className="font-mono font-bold">{couponCode}</code>
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Copy className="h-4 w-4 text-amber-500 group-hover:text-amber-400 flex-shrink-0" />
                  )}
                </div>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Click to copy
                </div>
              </div>
              
              <Button className="text-white whitespace-nowrap" onClick={handleUseClick}>
                Use Coupon
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimedOffer;
