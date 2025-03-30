
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import Dashboard from "./pages/Dashboard";
import ChartView from "./pages/ChartView";
import CalendarView from "./pages/CalendarView";
import SignalsView from "./pages/SignalsView";
import SettingsView from "./pages/SettingsView";
import TradeSuggestion from "./pages/TradeSuggestion";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import Miner from "./pages/Miner";
import Settings from "./pages/Settings";
import PricingPage from "./pages/PricingPage";
import PaymentPage from "./pages/PaymentPage";
import ThankYouPage from "./pages/ThankYouPage";
import LevelsView from "./pages/LevelsView";
import Sorry from "./pages/Sorry";
import Notifications from "./pages/Notifications";

// Add framer-motion
import { MotionConfig } from 'framer-motion';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/sorry" element={<Sorry />} />
            
            {/* Protected routes */}
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/signals" element={<SignalsView />} />
              <Route path="/trade-suggestion" element={<TradeSuggestion />} />
              <Route path="/chart" element={<ChartView />} />
              <Route path="/levels" element={<LevelsView />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/miner" element={<Miner />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/welcome" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </MotionConfig>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
