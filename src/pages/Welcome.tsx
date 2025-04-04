
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  GraduationCap, 
  BookOpenCheck, 
  ShieldCheck, 
  TrendingUp, 
  Lightbulb, 
  BarChart3,
  Award,
  Trophy,
  Medal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AppShowcase } from '@/components/landing/AppShowcase';
import CustomerReviews from '@/components/marketing/CustomerReviews';
import DiscordCommunity from '@/components/marketing/DiscordCommunity';
import TokenProgress from '@/components/marketing/TokenProgress';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TimedOffer from '@/components/marketing/TimedOffer';
import LogoImage from '@/assets/logo.svg';
import { BlurredBackground } from '@/components/ui/blurred-background';

const Welcome = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  
  const heroImages = [
    '/lovable-uploads/cd165e0d-4678-4599-8125-3439bc1496cc.png',
    '/lovable-uploads/b26d8332-d911-4cd0-92d8-9d88267f181e.png',
  ];
  
  const workflowImages = [
    '/lovable-uploads/0bbcaaf7-41ab-41c2-a81f-15c52b4d6202.png',
    '/lovable-uploads/cbf4d840-cd1b-4a3f-ab13-dce9b7f9bb53.png',
    '/lovable-uploads/4a0c6ea8-49f6-4dd0-8216-6e0085aec938.png',
    '/lovable-uploads/83cd3ce3-8a61-4043-aa68-18467165dbc3.png',
  ];
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src={LogoImage} alt="ProfitPilot" className="h-8 w-8" />
            <span className="font-bold text-lg">ProfitPilot</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate('/pricing')} className="flex items-center gap-2 text-white">
              <BarChart3 className="h-4 w-4" />
              Get TradePilot
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="py-24 px-6 bg-gradient-to-b from-background to-muted/50 relative overflow-hidden">
        <BlurredBackground 
          imageSrc={heroImages}
          className="opacity-70"
          animateColors={true}
          colorTheme="neutral"
        />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge className="mb-4" variant="outline">Version 2.0 Now Available</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Trade Smarter with AI-Powered Signals</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            ProfitPilot uses advanced artificial intelligence to analyze market data and provide real-time trading signals, support & resistance levels, and market insights.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/pricing')} className="flex items-center gap-2 text-white">
              Get Started <ArrowRight className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/signals')}>
              Explore Signals
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" /> AI Signals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get real-time trading signals powered by advanced machine learning algorithms.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" /> Market Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Detailed technical analysis with support & resistance levels and trend detection.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-500" /> Trading Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learn from our extensive trading academy with guides, videos, and webinars.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <AppShowcase />
      
      {/* How it Works section - replaced with new component */}
      <section className="relative overflow-hidden">
        <BlurredBackground 
          imageSrc={workflowImages}
          className="opacity-60"
          animateColors={true}
          colorTheme="green"
        />
        <HowItWorksSection />
      </section>
      
      <TokenProgress />
      
      <CustomerReviews />
      
      <DiscordCommunity />

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Success Stories</h2>
          <p className="text-lg text-muted-foreground mb-12">
            See how traders around the world are using ProfitPilot AI to achieve their financial goals.
          </p>
          <Carousel className="w-full max-w-2xl mx-auto">
            <CarouselContent>
              <CarouselItem>
                <div className="p-4">
                  <div className="bg-card rounded-lg p-6 shadow-md">
                    <p className="text-lg italic mb-4">
                      "ProfitPilot AI has transformed my trading strategy. The AI-powered signals are incredibly accurate."
                    </p>
                    <div className="text-sm font-medium">— John Doe, Trader</div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-4">
                  <div className="bg-card rounded-lg p-6 shadow-md">
                    <p className="text-lg italic mb-4">
                      "I've been using ProfitPilot AI for six months, and my profits have increased significantly."
                    </p>
                    <div className="text-sm font-medium">— Jane Smith, Investor</div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-4">
                  <div className="bg-card rounded-lg p-6 shadow-md">
                    <p className="text-lg italic mb-4">
                      "The risk management tools have helped me protect my investments and minimize losses."
                    </p>
                    <div className="text-sm font-medium">— Richard Roe, Analyst</div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <div className="flex items-center justify-center gap-2 py-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Timed Offer Section - New addition */}
      <div className="max-w-7xl mx-auto px-6">
        <TimedOffer seconds={60} couponCode="EASTER25" />
      </div>

      <section className="py-24 px-6 relative overflow-hidden">
        <BlurredBackground 
          imageSrc={['/lovable-uploads/4a0c6ea8-49f6-4dd0-8216-6e0085aec938.png']}
          className="opacity-50"
          animateColors={true}
          colorTheme="green"
        />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join ProfitPilot AI today and start making smarter trading decisions.
          </p>
          <div className="flex justify-center">
            <Button size="lg" onClick={() => navigate('/pricing')} className="flex items-center gap-2 text-white">
              Get TradePilot <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full">
              <Award className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium">Best Trading App 2024</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full">
              <Trophy className="h-5 w-5 text-cyan-500" />
              <span className="text-sm font-medium">FinTech Innovation Award</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full">
              <Medal className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Top AI Trading Solution</span>
            </div>
          </div>
          <div className="text-center text-muted-foreground">
            © 2025 ProfitPilot by Zentra LLC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
