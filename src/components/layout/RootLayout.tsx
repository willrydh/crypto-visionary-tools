
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
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Welcome from '@/pages/Welcome';
import PricingPage from '@/pages/PricingPage';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPasswordConfirm from '@/pages/ResetPasswordConfirm';
import ThankYouPage from '@/pages/ThankYouPage';
import Sorry from '@/pages/Sorry';
import Notifications from '@/pages/Notifications';
import Education from '@/pages/Education';
import PaymentPage from '@/pages/PaymentPage';
import EasterEggDiscount from '@/pages/EasterEggDiscount';
import ChartView from '@/pages/ChartView';
import MarketDashboard from '@/pages/MarketDashboard';

const RootLayout: React.FC = () => {
  const location = useLocation();

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Check if on public pages that don't need navigation
  const isPublicPage = location.pathname === '/welcome' || 
                       location.pathname === '/pricing' || 
                       location.pathname === '/payment' ||
                       location.pathname === '/forgot-password' || 
                       location.pathname === '/reset-password' || 
                       location.pathname === '/thank-you' ||
                       location.pathname === '/easter-egg';

  // Education page should have the regular app navigation, so it's not in the list above

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        {!isPublicPage && <MainNavigation />}
        <div className={!isPublicPage ? "md:ml-64" : ""}>
          {!isPublicPage && <TopHeader />}
          <main className={!isPublicPage ? 
                          "flex-1 overflow-auto pb-16 md:pb-0 pt-safe" : 
                          "flex-1 overflow-auto"}>
            <div className={!isPublicPage ? "max-w-7xl mx-auto px-4 sm:px-6 pt-16" : ""}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/signals" element={<SignalsView />} />
                <Route path="/trade" element={<TradeSuggestion />} />
                <Route path="/chart" element={<ChartView />} />
                <Route path="/market-dashboard" element={<MarketDashboard />} />
                <Route path="/calendar" element={<CalendarView />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPasswordConfirm />} />
                <Route path="/thank-you" element={<ThankYouPage />} />
                <Route path="/sorry" element={<Sorry />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/education" element={<Education />} />
                <Route path="/easter-egg" element={<EasterEggDiscount />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
          {!isPublicPage && <MobileNavigation />}
        </div>
        <Toaster />
        <Sonner />
      </div>
    </TooltipProvider>
  );
};

export default RootLayout;
