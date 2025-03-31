
import React, { useState } from 'react';
import { 
  LineChart, 
  Activity, 
  Zap, 
  Brain
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleNavMenuProps {
  className?: string;
}

const CollapsibleNavMenu: React.FC<CollapsibleNavMenuProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navCategories = [
    {
      title: 'Chart',
      icon: <LineChart className="h-5 w-5" />,
      path: '/chart'
    },
    {
      title: 'Indicators',
      icon: <Activity className="h-5 w-5" />,
      path: '/indicators'
    },
    {
      title: 'Trading',
      icon: <Zap className="h-5 w-5" />,
      path: '/trading'
    },
    {
      title: 'Psychology',
      icon: <Brain className="h-5 w-5" />,
      path: '/psychology'
    }
  ];

  return (
    <div className={cn("w-full", className)}>
      <Collapsible 
        open={isOpen} 
        onOpenChange={setIsOpen}
        className="border rounded-md bg-card/50 overflow-hidden"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 text-left">
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            <span className="font-medium">Trading Tools</span>
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="py-1">
            {navCategories.map((item) => (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) => 
                  cn(
                    "flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent/50 transition-colors",
                    isActive ? "text-primary bg-primary/10 font-medium" : "text-muted-foreground"
                  )
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CollapsibleNavMenu;
