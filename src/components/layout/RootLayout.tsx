
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TradingModeProvider } from '@/contexts/TradingModeContext';
import { TimeframeProvider } from '@/contexts/TimeframeContext';
import { TechnicalAnalysisProvider } from '@/contexts/TechnicalAnalysisContext';
import { MarketsProvider } from '@/contexts/MarketsContext';
import { SupportResistanceProvider } from '@/contexts/SupportResistanceContext';
import TopHeader from './TopHeader';
import MobileNavigation from './MobileNavigation';
import MainNavigation from './MainNavigation';

const RootLayout: React.FC = () => {
  const location = useLocation();

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <TooltipProvider>
      <TimeframeProvider>
        <TradingModeProvider>
          <TechnicalAnalysisProvider>
            <MarketsProvider>
              <SupportResistanceProvider>
                <div className="flex flex-col min-h-screen">
                  <MainNavigation />
                  <div className="md:ml-64">
                    <TopHeader />
                    <main className="flex-1 overflow-auto pb-16 md:pb-0 px-4 md:px-6 lg:px-8 pt-32 md:pt-36">
                      <Outlet />
                    </main>
                    <MobileNavigation />
                  </div>
                  <Toaster />
                  <Sonner />
                </div>
              </SupportResistanceProvider>
            </MarketsProvider>
          </TechnicalAnalysisProvider>
        </TradingModeProvider>
      </TimeframeProvider>
    </TooltipProvider>
  );
};

export default RootLayout;
