
import React, { useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import CalendarView from './pages/CalendarView';
import TradeSuggestion from './pages/TradeSuggestion';
import { PriceProvider } from './contexts/PriceContext';
import { TimeframeProvider } from './contexts/TimeframeContext';
import { TradingModeProvider } from './contexts/TradingModeContext';
import { TechnicalAnalysisProvider } from './contexts/TechnicalAnalysisContext';
import { CryptoProvider } from './contexts/CryptoContext';
import EntryScanner from "@/pages/EntryScanner";
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Create a simple AuthContext
import { createContext } from 'react';
export const AuthContext = createContext({ isLoggedIn: false });

// Create simple Header and Footer components
const SiteHeader = () => {
  return <header className="border-b p-4">ProfitPilot Header</header>;
};

const SiteFooter = () => {
  return <footer className="border-t p-4 text-center text-sm text-muted-foreground">© 2025 ProfitPilot</footer>;
};

// Create simple Login and Register pages
const Login = () => {
  return <div className="container py-8">Login Form</div>;
};

const Register = () => {
  return <div className="container py-8">Register Form</div>;
};

const App = () => {
  // Mock authentication state
  const [isLoggedIn] = useState(true);
  const authContextValue = { isLoggedIn };
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <Dashboard /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard",
      element: isLoggedIn ? <Dashboard /> : <Navigate to="/login" />,
    },
    {
      path: "/calendar",
      element: isLoggedIn ? <CalendarView /> : <Navigate to="/login" />,
    },
    {
      path: "/trade-suggestion",
      element: isLoggedIn ? <TradeSuggestion /> : <Navigate to="/login" />,
    },
    {
      path: "/login",
      element: !isLoggedIn ? <Login /> : <Navigate to="/" />,
    },
    {
      path: "/register",
      element: !isLoggedIn ? <Register /> : <Navigate to="/" />,
    },
    {
      path: "/entry-scanner",
      element: <EntryScanner />,
    },
    {
      path: "*",
      element: <NotFound />,
    }
  ]);

  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="profit-pilot-theme"
    >
      <AuthContext.Provider value={authContextValue}>
        <PriceProvider>
          <TimeframeProvider>
            <TradingModeProvider>
              <CryptoProvider>
                <TechnicalAnalysisProvider>
                  <div className="flex flex-col min-h-screen">
                    <SiteHeader />
                    <main className="flex-1">
                      <RouterProvider router={router} />
                    </main>
                    <SiteFooter />
                  </div>
                </TechnicalAnalysisProvider>
              </CryptoProvider>
            </TradingModeProvider>
          </TimeframeProvider>
        </PriceProvider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default App;
