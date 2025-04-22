
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CollapsibleNavMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          <span>Education</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "transform rotate-180")} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 font-normal">
        <ul className="space-y-1 mt-1">
          <li>
            <Link 
              to="/education" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-1.5 px-3 rounded-md hover:bg-muted transition-colors"
            >
              Trading Courses
            </Link>
          </li>
          <li>
            <Link 
              to="/education" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-1.5 px-3 rounded-md hover:bg-muted transition-colors"
            >
              Tutorials
            </Link>
          </li>
          <li>
            <Link 
              to="/education" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-1.5 px-3 rounded-md hover:bg-muted transition-colors"
            >
              Psychology
            </Link>
          </li>
          <li>
            <Link 
              to="/trading-coach" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-1.5 px-3 rounded-md hover:bg-muted transition-colors"
            >
              Trading Coach
            </Link>
          </li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleNavMenu;
