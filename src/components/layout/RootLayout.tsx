
import React, { useEffect } from 'react';
import { Outlet, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import TopHeader from './TopHeader';
import MobileNavigation from './MobileNavigation';
import MainNavigation from './MainNavigation';
import Dashboard from '@/pages/Dashboard';
import SignalsView from '@/pages/SignalsView';
import TradeSuggestion from '@/pages/TradeSuggestion';
import CalendarView from '@/pages/CalendarView';
import ChartView from '@/pages/ChartView';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

const RootLayout: React.FC = () => {
  const location = useLocation();

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <MainNavigation />
        <div className="md:ml-64">
          <TopHeader />
          <main className="flex-1 overflow-auto pb-16 md:pb-0 px-4 md:px-6 lg:px-8 pt-32 md:pt-36">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/signals" element={<SignalsView />} />
              <Route path="/trade" element={<TradeSuggestion />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/chart" element={<ChartView />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <MobileNavigation />
        </div>
        <Toaster />
        <Sonner />
      </div>
    </TooltipProvider>
  );
};

export default RootLayout;
