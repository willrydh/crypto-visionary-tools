
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Zap, 
  Settings, 
  Webhook,
  Calendar,
  Radar
} from 'lucide-react';
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';

const NavigationMenu: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { path: '/signals', label: 'Signals', icon: <Radar size={20} /> },
    { path: '/trade-suggestion', label: 'Trade', icon: <Zap size={20} /> },
    { path: '/calendar', label: 'Events', icon: <Calendar size={20} /> },
    { path: '/miner', label: 'Miner', icon: <Webhook size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => isActive ? 'bg-accent/50' : ''}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default NavigationMenu;
