import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, BookOpenCheck, ShieldCheck, TrendingUp, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import ProfitCalculator from '@/components/welcome/ProfitCalculator';
import LogoImage from '@/assets/logo.svg';

const Welcome = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src={LogoImage} alt="ProfitPilot" className="h-8 w-8" />
            <span className="font-bold text-lg">ProfitPilot</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Dashboard
            </Button>
            <Button onClick={() => navigate('/pricing')}>
              Pricing
            </Button>
          </div>
        </div>
      </header>
      
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to ProfitPilot AI</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Unlock the power of AI-driven trading signals and market analysis.
            Start making smarter, data-backed decisions today.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/pricing')}>
              Get Started <ArrowRight className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/signals')}>
              Explore Signals
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Calculate Your Trading Potential</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how ProfitPilot can help you reach your trading goals with enhanced signals and market insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <ProfitCalculator className="w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto" />
            
            <div className="space-y-6">
              <div className="bg-card/50 p-6 rounded-lg border border-border">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">1</span>
                  Better Decision Making
                </h3>
                <p className="text-muted-foreground">
                  ProfitPilot provides real-time signals and market insights to help you make informed trading decisions.
                </p>
              </div>
              
              <div className="bg-card/50 p-6 rounded-lg border border-border">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">2</span>
                  Market Timing
                </h3>
                <p className="text-muted-foreground">
                  Know exactly when markets open and close with notifications and market session indicators.
                </p>
              </div>
              
              <div className="bg-card/50 p-6 rounded-lg border border-border">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">3</span>
                  Reduced Emotions
                </h3>
                <p className="text-muted-foreground">
                  Data-driven signals help eliminate emotional trading decisions and keep you focused on your strategy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Key Features</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Explore the features that make ProfitPilot AI the ultimate trading companion.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpenCheck className="h-5 w-5 text-green-500" /> AI-Powered Signals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receive real-time trading signals generated by advanced AI algorithms.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-500" /> Risk Management Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Protect your investments with our integrated risk management tools.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" /> Market Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stay ahead of the curve with comprehensive market analysis and insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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

      <section className="py-24 px-6 bg-muted">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join ProfitPilot AI today and start making smarter trading decisions.
          </p>
          <Button size="lg" onClick={() => navigate('/pricing')}>
            Explore Pricing <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-border text-center text-muted-foreground">
        © 2025 ProfitPilot by Zentra LLC
      </footer>
    </div>
  );
};

export default Welcome;
