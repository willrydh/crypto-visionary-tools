
import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import NavigationMenu from './NavigationMenu';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar defaultCollapsed={false} collapsible="icon" className="border-r border-border">
          <SidebarHeader className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">P</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">ProfitPilot AI</span>
                <span className="text-xs text-muted-foreground">v1.0.0</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <NavigationMenu />
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="text-xs text-muted-foreground text-center">
              © 2023 ProfitPilot AI
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
