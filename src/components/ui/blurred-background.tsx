
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BlurredBackgroundProps {
  imageSrc: string | string[];
  className?: string;
  transitionDuration?: number;
}

export const BlurredBackground: React.FC<BlurredBackgroundProps> = ({ 
  imageSrc, 
  className = "",
  transitionDuration = 5000
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scale, setScale] = useState(1.1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  
  // Handle array of images or single image
  const images = Array.isArray(imageSrc) ? imageSrc : [imageSrc];
  
  // Ken Burns effect - slowly zoom and pan across the image
  useEffect(() => {
    if (images.length <= 1) return;
    
    const kenBurnsEffect = () => {
      setIsTransitioning(true);
      
      // Create Ken Burns effect with random zoom and position
      const newScale = 1.1 + Math.random() * 0.15; // Scale between 1.1 and 1.25
      const newX = Math.random() * 5 - 2.5; // Move between -2.5% and 2.5% on x-axis
      const newY = Math.random() * 5 - 2.5; // Move between -2.5% and 2.5% on y-axis
      
      setScale(newScale);
      setPosition({ x: newX, y: newY });
      
      // Change image halfway through the transition
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, transitionDuration / 2);
      
      // Reset transitioning state when complete
      setTimeout(() => {
        setIsTransitioning(false);
      }, transitionDuration);
    };
    
    // Initial effect
    kenBurnsEffect();
    
    // Set interval for continuous effect
    const rotationInterval = setInterval(kenBurnsEffect, transitionDuration * 1.5);
    
    return () => clearInterval(rotationInterval);
  }, [images.length, transitionDuration]);

  return (
    <div className={`absolute inset-0 overflow-hidden z-0 ${className}`}>
      <div className="relative w-full h-full">
        {images.map((img, index) => (
          <div 
            key={index}
            className={`absolute w-full h-full overflow-hidden ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transition: `opacity ${transitionDuration/2000}s ease-in-out`
            }}
          >
            <img 
              src={img} 
              alt="" 
              className="absolute w-full h-full object-cover opacity-15"
              style={{
                transform: `scale(${index === currentImage ? scale : 1.1}) translate(${index === currentImage ? position.x : 0}%, ${index === currentImage ? position.y : 0}%)`,
                transition: `transform ${transitionDuration}ms ease-in-out, opacity ${transitionDuration/2000}s ease-in-out`,
                transformOrigin: 'center center'
              }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 backdrop-blur-md bg-background/60" />
    </div>
  );
};
