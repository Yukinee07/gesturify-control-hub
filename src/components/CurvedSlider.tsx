
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HandIcon } from './icons/HandIcon';

interface CurvedSliderProps {
  value: number;
  max: number;
  min: number;
  onChange: (value: number) => void;
  isActive: boolean;
}

export const CurvedSlider = ({ value, max, min, onChange, isActive }: CurvedSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const normalizedValue = ((value - min) / (max - min)) * 100;
  const angle = -180 + (normalizedValue / 100) * 180; // -180 to 0 degrees
  
  // Calculate position on the arc
  const radius = 120;
  const centerX = 150;
  const centerY = 150;
  const angleInRadians = (angle * Math.PI) / 180;
  const x = centerX + radius * Math.cos(angleInRadians);
  const y = centerY + radius * Math.sin(angleInRadians) + radius;

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
      const y = e.clientY - rect.top;
      
      // Calculate angle based on position relative to center
      const dx = x - centerX;
      const dy = y - (centerY + radius);
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      // Restrict to bottom half of circle (-180 to 0 degrees)
      angle = Math.max(-180, Math.min(0, angle));
      
      // Convert angle to value
      const newNormalizedValue = (angle + 180) / 180 * 100;
      const newValue = min + (newNormalizedValue / 100) * (max - min);
      
      onChange(newValue);
    }
  };

  return (
    <div 
      ref={sliderRef}
      className="relative w-[300px] h-[150px] mx-auto"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      {/* Semi-circular track */}
      <div className="absolute w-[240px] h-[120px] border-b-4 border-gray-700 rounded-t-full left-1/2 transform -translate-x-1/2"></div>
      
      {/* Filled portion of track */}
      <div className="absolute w-[240px] h-[120px] overflow-hidden left-1/2 transform -translate-x-1/2">
        <div 
          className="absolute w-[240px] h-[120px] border-b-4 border-neon-purple rounded-t-full"
          style={{ 
            transform: `rotate(${180 - normalizedValue * 1.8}deg)`, 
            transformOrigin: 'bottom center',
            opacity: normalizedValue / 100
          }}
        ></div>
      </div>
      
      {/* Thumb */}
      <motion.div 
        className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        animate={{ x, y }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className={`w-12 h-12 flex items-center justify-center rounded-full 
          bg-gradient-to-r from-neon-purple to-neon-pink 
          ${isActive ? 'animate-pulse shadow-lg shadow-neon-purple/50' : ''}
          transition-all duration-300`}
        >
          <HandIcon className={`w-7 h-7 text-white transform rotate-45 transition-transform ${isActive ? 'scale-110' : ''}`} />
        </div>
      </motion.div>
      
      {/* Value display */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
        <span className="text-2xl font-bold">{Math.round(value)}%</span>
      </div>
    </div>
  );
};

export default CurvedSlider;
