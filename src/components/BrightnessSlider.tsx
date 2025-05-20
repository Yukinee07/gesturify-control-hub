
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { HandIcon } from './icons/HandIcon';

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
  const normalizedValue = ((value - min) / (max - min)) * 100;
  
  // Calculate vertical position based on value
  const thumbPosition = 100 - normalizedValue; // Invert for vertical slider (bottom = max)
  
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
      const y = e.clientY - rect.top;
      
      // Convert y position to percentage (inverted because y increases downward)
      const percentage = 100 - Math.max(0, Math.min(100, (y / rect.height) * 100));
      
      // Convert percentage to value
      const newValue = min + (percentage / 100) * (max - min);
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <div 
        ref={sliderRef}
        className="relative h-64 w-8 bg-gray-800/50 rounded-full mx-auto cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        {/* Tube light effect container */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {/* Glowing tube effect */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink blur-lg"
            style={{ 
              bottom: `${normalizedValue}%`, 
              opacity: 0.5 + (normalizedValue / 200)
            }}
          ></div>

          {/* Filled portion */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neon-purple to-neon-pink rounded-full"
            style={{ height: `${normalizedValue}%` }}
          ></div>
        </div>

        {/* Thumb */}
        <motion.div 
          className={`absolute left-1/2 -translate-x-1/2 z-10 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          animate={{ 
            y: `${thumbPosition}%`, 
            scale: isDragging || isActive ? 1.1 : 1
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className={`w-12 h-12 flex items-center justify-center rounded-full 
            bg-gradient-to-r from-neon-purple to-neon-pink 
            ${isActive ? 'animate-pulse shadow-lg shadow-neon-purple/50' : ''}
            transition-all duration-300`}
          >
            <HandIcon className={`w-7 h-7 text-white transform transition-transform ${isActive ? 'scale-110' : ''}`} />
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
