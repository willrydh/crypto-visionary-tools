
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, BookOpenCheck, ShieldCheck, TrendingUp, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AppShowcase } from '@/components/landing/AppShowcase';
import CustomerReviews from '@/components/marketing/CustomerReviews';
import DiscordCommunity from '@/components/marketing/DiscordCommunity';
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
      
      <section className="py-24 px-6 bg-gradient-to-b from-background to-muted/50">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-4" variant="outline">Version 2.0 Now Available</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Trade Smarter with AI-Powered Signals</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            ProfitPilot uses advanced artificial intelligence to analyze market data and provide real-time trading signals, support & resistance levels, and market insights.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/pricing')}>
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
      
      <section className="py-16 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">How ProfitPilot Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform analyzes massive datasets to provide you with actionable trading insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Data Collection",
                description: "We gather real-time data from multiple exchanges and market sources."
              },
              {
                step: "2",
                title: "AI Analysis",
                description: "Our algorithms analyze patterns, trends, and market conditions."
              },
              {
                step: "3",
                title: "Signal Generation",
                description: "High-probability trading signals are generated based on analysis."
              },
              {
                step: "4",
                title: "Trade Execution",
                description: "Execute trades with confidence based on data-driven signals."
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-3 -top-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  {item.step}
                </div>
                <Card className="pt-6 h-full">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
      
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
