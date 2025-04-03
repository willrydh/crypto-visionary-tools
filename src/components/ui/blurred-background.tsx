
import React from 'react';

interface BlurredBackgroundProps {
  imageSrc: string;
  className?: string;
}

export const BlurredBackground: React.FC<BlurredBackgroundProps> = ({ 
  imageSrc, 
  className = "" 
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden z-0 ${className}`}>
      <img 
        src={imageSrc} 
        alt="" 
        className="w-full h-full object-cover opacity-15"
        aria-hidden="true"
      />
      <div className="absolute inset-0 backdrop-blur-md bg-background/60" />
    </div>
  );
};
