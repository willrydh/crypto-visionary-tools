import React, { useContext } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Home from './pages/Home';
import CalendarView from './pages/CalendarView';
import TradeSuggestion from './pages/TradeSuggestion';
import { AuthContext } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import { PriceProvider } from './contexts/PriceContext';
import { TimeframeProvider } from './contexts/TimeframeContext';
import { TradingModeProvider } from './contexts/TradingModeContext';
import { TechnicalAnalysisProvider } from './contexts/TechnicalAnalysisContext';
import { CryptoProvider } from './contexts/CryptoContext';
import EntryScanner from "@/pages/EntryScanner";

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <Home /> : <Navigate to="/login" />,
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
  ]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
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
    </ThemeProvider>
  );
};

export default App;
