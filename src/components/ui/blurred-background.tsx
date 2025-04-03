
import React, { useState, useEffect } from 'react';

interface BlurredBackgroundProps {
  imageSrc: string | string[];
  className?: string;
  transitionDuration?: number;
}

export const BlurredBackground: React.FC<BlurredBackgroundProps> = ({ 
  imageSrc, 
  className = "",
  transitionDuration = 2000
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Handle array of images or single image
  const images = Array.isArray(imageSrc) ? imageSrc : [imageSrc];
  
  useEffect(() => {
    if (images.length <= 1) return;
    
    const rotationInterval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, transitionDuration / 2);
    }, transitionDuration * 2.5);
    
    return () => clearInterval(rotationInterval);
  }, [images.length, transitionDuration]);

  return (
    <div className={`absolute inset-0 overflow-hidden z-0 ${className}`}>
      <div className="relative w-full h-full">
        {images.map((img, index) => (
          <img 
            key={index}
            src={img} 
            alt="" 
            className={`absolute w-full h-full object-cover opacity-15 transition-opacity duration-${transitionDuration/1000}s ease-in-out scale-105 ${
              index === currentImage ? 'opacity-15' : 'opacity-0'
            } ${isTransitioning ? 'scale-110' : 'scale-105'}`}
            style={{
              transition: `opacity ${transitionDuration/1000}s ease-in-out, transform ${transitionDuration/1000}s ease-in-out`
            }}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="absolute inset-0 backdrop-blur-md bg-background/60" />
    </div>
  );
};
