
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

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className={`min-h-screen flex w-full overflow-x-hidden ${isTradingPage ? 'trading-page' : ''}`}>
        <Sidebar 
          collapsible="icon" 
          className="border-r border-border fixed z-50 h-full md:relative"
          // Removed defaultCollapsed prop as it doesn't exist on Sidebar component
        >
          <SidebarHeader className="p-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src={Logo} alt="ProfitPilot" className="h-8 w-8" />
              <span className="font-bold text-lg">ProfitPilot</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <NavigationMenu />
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="text-xs text-muted-foreground text-center">
              © 2025 ProfitPilot by Zentra LLC
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col w-full md:ml-64 overflow-x-hidden">
          <TopHeader />
          <main className={`flex-1 overflow-auto pt-24 sm:pt-32 ${isMobile ? 'pb-20' : 'pb-16'} md:pb-6 z-10 overflow-x-hidden`}>
            <div className="px-3 sm:px-6">
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
