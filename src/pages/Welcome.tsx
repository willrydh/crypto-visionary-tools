
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Logo from '@/assets/logo.svg';
import { useToast } from '@/hooks/use-toast';

const Welcome = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Login handler functions
  const handleGuestAccess = () => {
    toast({
      title: "Guest Access",
      description: "You've accessed the app as a guest",
    });
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-200">
      <div className="welcome-gradient w-full min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-8 w-8" />
            <div className="font-bold text-xl text-white">ProfitPilot</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-white/10">
              Log In
            </Button>
            <Button className="bg-white text-slate-900 hover:bg-white/90">
              Sign Up
            </Button>
          </div>
        </header>
        
        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-6 bg-slate-800/50 text-white border-slate-700">
            Version 1.0.0 is now available
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white mb-6">
            Your AI Trading Assistant for Crypto Markets
          </h1>
          
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-8">
            ProfitPilot gives you real-time market signals, intelligent trade suggestions, and deep data analysis for crypto trading.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={handleGuestAccess} 
              className="bg-slate-900 text-white hover:bg-slate-800"
            >
              Try For Free
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-slate-600 hover:bg-slate-800/50"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
