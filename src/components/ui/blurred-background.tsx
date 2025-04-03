
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BlurredBackgroundProps {
  imageSrc: string | string[];
  className?: string;
  transitionDuration?: number;
  animateColors?: boolean;
}

export const BlurredBackground: React.FC<BlurredBackgroundProps> = ({ 
  imageSrc, 
  className = "",
  transitionDuration = 5000,
  animateColors = false
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scale, setScale] = useState(1.1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [colorPhase, setColorPhase] = useState(0);
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

  // Northern lights color animation effect
  useEffect(() => {
    if (!animateColors) return;
    
    const colorAnimation = setInterval(() => {
      setColorPhase(prev => (prev + 1) % 360);
    }, 3000);
    
    return () => clearInterval(colorAnimation);
  }, [animateColors]);
  
  // Generate northern lights color based on phase
  const getNorthernLightsColor = () => {
    // Subtle aurora colors
    const colors = [
      'rgba(32, 87, 100, 0.1)', // Teal
      'rgba(23, 92, 61, 0.1)',  // Green
      'rgba(67, 97, 157, 0.1)', // Blue
      'rgba(114, 59, 143, 0.1)', // Purple
      'rgba(17, 75, 95, 0.1)',  // Deep blue
    ];
    
    const index = Math.floor(colorPhase / (360 / colors.length));
    const nextIndex = (index + 1) % colors.length;
    const progress = (colorPhase % (360 / colors.length)) / (360 / colors.length);
    
    return `linear-gradient(135deg, ${colors[index]} 0%, ${colors[nextIndex]} 100%)`;
  };

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
      {animateColors ? (
        <div 
          className="absolute inset-0 backdrop-blur-md bg-background/60 northern-lights-animation"
          style={{ 
            background: getNorthernLightsColor(),
            transition: 'background 3s ease-in-out'
          }}
        />
      ) : (
        <div className="absolute inset-0 backdrop-blur-md bg-background/60" />
      )}
    </div>
  );
};
