
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  Home,
  BarChart3,
  LineChart,
  Calendar,
  Settings,
  LayoutDashboard,
  Lightbulb,
  Activity,
  CreditCard
} from 'lucide-react';
import { TradingModeSelector } from '@/components/trading/TradingModeSelector';
import { useTradingMode } from '@/hooks/useTradingMode';

interface NavigationMenuProps {
  className?: string;
}

export default function NavigationMenu({ className }: NavigationMenuProps) {
  const location = useLocation();
  
  // Safely use the trading mode hook, with fallbacks for when we're not in a provider context
  let tradingMode = 'day';
  let getDescription = () => 'Select a trading mode to see details.';
  
  try {
    const tradingModeContext = useTradingMode();
    tradingMode = tradingModeContext.tradingMode;
    getDescription = tradingModeContext.getDescription;
  } catch (error) {
    console.log('Trading mode context not available');
  }

  const routes = [
    {
      href: '/',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      variant: 'default',
    },
    {
      href: '/signals',
      label: 'Signals',
      icon: <Activity className="w-5 h-5" />,
      variant: 'ghost',
    },
    {
      href: '/trade-suggestion',
      label: 'Trade',
      icon: <Lightbulb className="w-5 h-5" />,
      variant: 'ghost',
    },
    {
      href: '/chart',
      label: 'Chart',
      icon: <LineChart className="w-5 h-5" />,
      variant: 'ghost',
    },
    {
      href: '/calendar',
      label: 'Calendar',
      icon: <Calendar className="w-5 h-5" />,
      variant: 'ghost',
    },
    {
      href: '/pricing',
      label: 'Pricing',
      icon: <CreditCard className="w-5 h-5" />,
      variant: 'ghost',
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      variant: 'ghost',
    },
  ];

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="hidden md:block">
        <div className="mb-4">
          {/* Only render TradingModeSelector if we have trading mode context */}
          {typeof tradingMode !== 'undefined' && <TradingModeSelector />}
        </div>
        <p className="text-xs text-muted-foreground px-4 mb-2">{getDescription()}</p>
      </div>
      
      <nav className="grid gap-1 px-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            to={route.href}
            className={cn(
              buttonVariants({ variant: location.pathname === route.href ? 'default' : 'ghost', size: 'sm' }),
              'justify-start h-9',
              location.pathname === route.href && 'bg-accent dark:text-accent-foreground dark:bg-accent'
            )}
          >
            {route.icon}
            <span className="ml-2">{route.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
