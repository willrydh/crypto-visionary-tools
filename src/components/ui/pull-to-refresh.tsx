
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import Logo from '@/assets/logo.svg';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const THRESHOLD = 80; // Minimum pull distance to trigger refresh

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable pull if scrolled to top
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);
    
    // Apply a resistance factor to make pulling feel natural
    const resistedDistance = Math.min(distance * 0.4, THRESHOLD * 1.5);
    
    if (resistedDistance > 0) {
      e.preventDefault(); // Prevent default scrolling
      setPullDistance(resistedDistance);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;
    
    if (pullDistance > THRESHOLD) {
      // Trigger refresh
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
          setIsPulling(false);
        }, 1000); // Delay hiding the animation to make it visible
      }
    } else {
      // Not enough pull distance, reset
      setPullDistance(0);
      setIsPulling(false);
    }
  };

  // Clean up states when component unmounts
  useEffect(() => {
    return () => {
      setIsPulling(false);
      setPullDistance(0);
      setIsRefreshing(false);
    };
  }, []);

  return (
    <div 
      className="relative w-full overflow-hidden"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div 
        className={cn(
          "absolute top-0 left-0 w-full flex flex-col items-center justify-end transition-transform",
          "transform z-50 pointer-events-none",
          isRefreshing ? "h-16" : "h-0"
        )}
        style={{ 
          transform: isRefreshing 
            ? 'translateY(0)' 
            : `translateY(-${THRESHOLD}px) translateY(${pullDistance}px)`,
          opacity: isRefreshing ? 1 : pullDistance / THRESHOLD
        }}
      >
        <div className="flex flex-col items-center justify-center p-2">
          <div 
            className={cn(
              "relative flex items-center justify-center h-10 w-10 mb-1",
              isRefreshing ? "animate-spin" : "animate-pulse"
            )}
          >
            <img 
              src={Logo} 
              alt="Refreshing" 
              className={cn(
                "h-full w-full object-contain",
                isRefreshing ? "animate-glow" : ""
              )}
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {isRefreshing ? "Refreshing..." : "Release to refresh"}
          </span>
        </div>
      </div>

      {/* Content area */}
      <div 
        className="w-full transition-transform"
        style={{ 
          transform: isRefreshing 
            ? 'translateY(4rem)' 
            : pullDistance > 0 
              ? `translateY(${pullDistance}px)` 
              : 'translateY(0)'
        }}
      >
        {children}
      </div>
    </div>
  );
};
