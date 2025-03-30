
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { RotateCcw, BadgeAlert, StopCircle } from 'lucide-react';
import Logo from '@/assets/logo.svg';
import { motion } from 'framer-motion';

const Sorry = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-background p-4"
    >
      <div className="text-center max-w-md mx-auto">
        <img src={Logo} alt="ProfitPilot AI" className="h-20 w-20 mx-auto mb-6" />
        
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <StopCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          </motion.div>
          <h1 className="text-5xl font-bold mb-2">Oops!</h1>
          <h2 className="text-2xl font-semibold text-primary mb-4">Sorry, must be a liquidity sweep!</h2>
        </div>
        
        <p className="text-lg text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved to a new zone of resistance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button onClick={() => navigate('/')} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate('/welcome')} className="gap-2">
            <BadgeAlert className="h-4 w-4" />
            Explore Features
          </Button>
        </div>

        <div className="p-4 bg-card/50 rounded-lg border border-border">
          <h3 className="font-medium mb-2">While you're here...</h3>
          <p className="text-sm text-muted-foreground">
            Did you know ProfitPilot AI analyzes market volatility patterns during market open/close times to provide more accurate trading signals?
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sorry;
