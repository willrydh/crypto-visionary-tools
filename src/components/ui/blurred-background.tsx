
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
  
  const images = Array.isArray(imageSrc) ? imageSrc : [imageSrc];
  
  useEffect(() => {
    if (images.length <= 1) return;
    
    const kenBurnsEffect = () => {
      setIsTransitioning(true);
      
      const newScale = 1.1 + Math.random() * 0.1;
      const newX = Math.random() * 3 - 1.5;
      const newY = Math.random() * 3 - 1.5;
      
      setScale(newScale);
      setPosition({ x: newX, y: newY });
      
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, transitionDuration / 2);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, transitionDuration);
    };
    
    kenBurnsEffect();
    
    const rotationInterval = setInterval(kenBurnsEffect, transitionDuration * 1.5);
    
    return () => clearInterval(rotationInterval);
  }, [images.length, transitionDuration]);

  useEffect(() => {
    if (!animateColors) return;
    
    const colorAnimation = setInterval(() => {
      setColorPhase(prev => (prev + 1) % 360);
    }, 15000);
    
    return () => clearInterval(colorAnimation);
  }, [animateColors]);
  
  const getNorthernLightsColor = () => {
    const themes = {
      green: [
        'rgba(23, 92, 61, 0.15)',
        'rgba(32, 128, 80, 0.15)',
        'rgba(40, 160, 100, 0.15)',
        'rgba(20, 80, 50, 0.15)'
      ],
      red: [
        'rgba(128, 32, 32, 0.15)',
        'rgba(160, 40, 40, 0.15)',
        'rgba(140, 30, 30, 0.15)',
        'rgba(110, 25, 25, 0.15)'
      ],
      neutral: [
        'rgba(45, 55, 72, 0.15)',
        'rgba(50, 60, 80, 0.15)',
        'rgba(40, 50, 70, 0.15)',
        'rgba(55, 65, 85, 0.15)'
      ]
    };
    
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
            transition: 'background 15s ease-in-out'
          }}
        />
      ) : (
        <div className="absolute inset-0 backdrop-blur-md bg-background/80" />
      )}
    </div>
  );
};
