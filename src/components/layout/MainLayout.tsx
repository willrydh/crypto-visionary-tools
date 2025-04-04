
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import NavigationMenu from './NavigationMenu';
import TopHeader from './TopHeader';
import MobileNavigation from './MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '@/assets/logo.svg';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isTradingPage, setIsTradingPage] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if current route is trading related
    const tradingRoutes = ['/', '/dashboard', '/trade-suggestion', '/trade', '/signals', '/calendar', '/notifications'];
    setIsTradingPage(tradingRoutes.includes(location.pathname));
    
    // Scroll to top when location changes
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Determine if the current page has tabs (trading mode selector)
  const hasTabsBar = ['/', '/dashboard', '/trade-suggestion', '/trade', '/signals', '/calendar'].includes(location.pathname);

  // Check if we're on an iOS device
  const isIOS = () => {
    if (typeof window !== 'undefined') {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
             (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    }
    return false;
  };

  useEffect(() => {
    // Add iOS class if detected
    if (isIOS()) {
      document.documentElement.classList.add('ios-device');
    } else {
      document.documentElement.classList.remove('ios-device');
    }
  }, []);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className={`min-h-screen flex w-full overflow-x-hidden ${isTradingPage ? 'trading-page' : ''}`}>
        <Sidebar 
          collapsible="icon" 
          className="border-r border-border fixed z-50 h-full md:relative pt-safe"
        >
          <SidebarHeader className="p-4 pt-2">
            <Link to="/" className="flex items-center space-x-2">
              <img src={Logo} alt="ProfitPilot" className="h-8.5 w-8.5" />
              <span className="font-bold text-xl">ProfitPilot</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <NavigationMenu />
          </SidebarContent>
          <SidebarFooter className="p-3 pb-safe">
            <div className="text-xs text-muted-foreground text-center">
              © 2025 ProfitPilot by Zentra LLC
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col w-full md:ml-64 overflow-x-hidden">
          <TopHeader />
          <main className={`flex-1 overflow-auto ${hasTabsBar ? 'content-padding-top-with-tabs' : 'content-padding-top'} pb-safe z-10 overflow-x-hidden`}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 pb-36 md:pb-6 pt-4">
              {children}
            </div>
          </main>
          <MobileNavigation />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
