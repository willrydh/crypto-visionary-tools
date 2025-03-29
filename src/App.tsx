
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import Dashboard from "./pages/Dashboard";
import ChartView from "./pages/ChartView";
import CalendarView from "./pages/CalendarView";
import LevelsView from "./pages/LevelsView";
import SettingsView from "./pages/SettingsView";
import TradeSuggestion from "./pages/TradeSuggestion";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import FAQ from "./pages/FAQ";
import Miner from "./pages/Miner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/welcome" element={<Welcome />} />
          
          {/* Protected routes */}
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/chart" element={<ChartView />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/levels" element={<LevelsView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/trade-suggestion" element={<TradeSuggestion />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/miner" element={<Miner />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
