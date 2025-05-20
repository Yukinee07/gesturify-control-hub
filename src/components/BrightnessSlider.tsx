
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface BrightnessSliderProps {
  value: number;
  max: number;
  min: number;
  onChange: (value: number) => void;
  isActive: boolean;
}

export const BrightnessSlider = ({ value, max, min, onChange, isActive }: BrightnessSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Ensure value doesn't go below 10%
  const effectiveMin = Math.max(min, 10);
  const normalizedValue = Math.max(0, Math.min(100, ((Math.max(value, effectiveMin) - effectiveMin) / (max - effectiveMin)) * 100));
  
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handlePointerMove(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      
      // Convert x position to percentage
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      
      // Convert percentage to value, but ensure it's at least 10%
      const newValue = effectiveMin + (percentage / 100) * (max - effectiveMin);
      onChange(Math.max(newValue, effectiveMin));
    }
  };

  // Calculate the brightness color - from dark to white
  const getBrightnessColor = () => {
    // Map normalized value (0-100) to RGB value (0-255)
    const colorValue = Math.round(normalizedValue * 2.55);
    return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div 
        ref={sliderRef}
        className="relative h-8 w-64 bg-gray-800/50 rounded-full mx-auto cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        {/* Tube light effect container */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {/* Glowing tube effect */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 h-20 w-20 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink blur-lg"
            style={{ 
              left: `${normalizedValue}%`, 
              opacity: 0.5 + (normalizedValue / 200)
            }}
          ></div>

          {/* The tube light itself */}
          <div className="absolute inset-0 flex items-center px-2">
            <div className="h-2 w-full bg-gray-800/80 rounded-full overflow-hidden">
              {/* The glowing portion */}
              <div 
                className="h-full bg-gradient-to-r from-neon-purple to-neon-pink rounded-full"
                style={{ width: `${normalizedValue}%` }}
              ></div>
            </div>
          </div>

          {/* Radiating glow effect */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ 
              left: `${normalizedValue}%`, 
              opacity: isActive || isDragging ? 0.7 : 0.3
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="absolute -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-neon-pink/30 to-transparent rounded-full"
                style={{
                  width: `${30 + i * 20}px`,
                  height: `${30 + i * 20}px`,
                  opacity: 1 - (i * 0.2),
                  animation: `pulse ${1 + i * 0.5}s infinite alternate ease-in-out`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Circular slider thumb - smaller and centered */}
        <motion.div 
          className={`absolute top-1/2 -translate-y-1/2 z-10 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          animate={{ 
            x: `calc(${normalizedValue}% - 10px)`, // Centered smaller thumb
            scale: isDragging || isActive ? 1.1 : 1
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div 
            className={`w-5 h-5 flex items-center justify-center rounded-full 
              bg-gradient-to-r from-neon-purple to-neon-pink 
              ${isActive ? 'animate-pulse shadow-lg shadow-neon-purple/50' : ''}
              transition-all duration-300`}
          >
            {/* Circular thumb that changes color based on brightness - smaller */}
            <div 
              className="w-4 h-4 rounded-full transition-colors duration-300"
              style={{ backgroundColor: getBrightnessColor() }}
            ></div>
          </div>
        </motion.div>
      </div>

      {/* Value display */}
      <div className="mt-4 text-center">
        <span className="text-2xl font-bold">{Math.round(value)}%</span>
      </div>
    </div>
  );
};

export default BrightnessSlider;
