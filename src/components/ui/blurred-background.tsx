
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BlurredBackgroundProps {
  imageSrc: string | string[];
  className?: string;
  transitionDuration?: number;
  animateColors?: boolean;
  colorTheme?: 'green' | 'red' | 'neutral' | 'auto';
}

export const BlurredBackground: React.FC<BlurredBackgroundProps> = ({ 
  imageSrc, 
  className = "",
  transitionDuration = 5000,
  animateColors = false,
  colorTheme = 'auto'
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
      const newScale = 1.1 + Math.random() * 0.1; // Reduced scale variation (was 0.15)
      const newX = Math.random() * 3 - 1.5; // Reduced movement (was 5 to 2.5)
      const newY = Math.random() * 3 - 1.5; // Reduced movement (was 5 to 2.5)
      
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

  // Northern lights color animation effect with slowed down timing
  useEffect(() => {
    if (!animateColors) return;
    
    const colorAnimation = setInterval(() => {
      setColorPhase(prev => (prev + 1) % 360);
    }, 15000); // Slowed down from 8000 to 15000ms for a much gentler animation
    
    return () => clearInterval(colorAnimation);
  }, [animateColors]);
  
  // Generate northern lights color based on theme
  const getNorthernLightsColor = () => {
    // Theme-based colors with reduced opacity for subtlety
    const themes = {
      green: [
        'rgba(23, 92, 61, 0.2)', // Light green
        'rgba(32, 128, 80, 0.2)', // Medium green
        'rgba(40, 160, 100, 0.2)', // Bright green
        'rgba(20, 80, 50, 0.2)',   // Dark green
      ],
      red: [
        'rgba(128, 32, 32, 0.2)', // Medium red
        'rgba(160, 40, 40, 0.2)', // Bright red
        'rgba(140, 30, 30, 0.2)', // Dark red
        'rgba(110, 25, 25, 0.2)', // Deep red
      ],
      neutral: [
        'rgba(45, 55, 72, 0.18)', // Slate blue
        'rgba(50, 60, 80, 0.18)',  // Dark slate blue
        'rgba(40, 50, 70, 0.18)',  // Navy blue
        'rgba(55, 65, 85, 0.18)',  // Steel blue
      ]
    };
    
    // Select color theme
    const selectedTheme = colorTheme === 'auto' ? 'neutral' : colorTheme;
    const colors = themes[selectedTheme];
    
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
          className="absolute inset-0 backdrop-blur-md bg-background/80" 
          style={{ 
            background: getNorthernLightsColor(),
            transition: 'background 15s ease-in-out'  // Slowed down from 8s to 15s
          }}
        />
      ) : (
        <div className="absolute inset-0 backdrop-blur-md bg-background/80" />
      )}
    </div>
  );
};
