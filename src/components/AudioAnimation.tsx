
import React from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { ThumbsLeft } from './icons/ThumbsLeft';
import { ThumbsRight } from './icons/ThumbsRight';

interface AudioAnimationProps {
  isActive: boolean;
  currentVolume: number;
  gesture: string | null;
  status: string;
}

const AudioAnimation = ({ isActive, currentVolume, gesture, status }: AudioAnimationProps) => {
  // Animation variants for the thumbs
  const thumbVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: {
      opacity: [0, 1, 0],
      y: [-20, -40, -60],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    },
    visibleDown: {
      opacity: [0, 1, 0],
      y: [20, 40, 60],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center">
      {/* Center volume icon */}
      <div className="mb-4">
        <Volume2 
          className={`w-16 h-16 ${isActive ? 'text-neon-purple animate-pulse' : 'text-gray-400'}`} 
        />
      </div>
      
      <div className="text-lg font-medium mb-4">
        Volume: {Math.round(currentVolume * 100)}%
      </div>
      
      {/* Container for thumbs up/down icons */}
      <div className="relative h-32 w-full flex items-center justify-center">
        {/* Left side - Thumbs down animation */}
        <motion.div
          className="absolute left-12"
          variants={thumbVariants}
          initial="hidden"
          animate={isActive && (gesture === 'slideLeft' || gesture === 'thumbLeft') ? "visibleDown" : "hidden"}
        >
          <ThumbsLeft className="w-12 h-12 text-neon-purple" />
        </motion.div>
        
        {/* Right side - Thumbs up animation */}
        <motion.div
          className="absolute right-12"
          variants={thumbVariants}
          initial="hidden"
          animate={isActive && (gesture === 'slideRight' || gesture === 'thumbRight') ? "visible" : "hidden"}
        >
          <ThumbsRight className="w-12 h-12 text-neon-purple" />
        </motion.div>
      </div>
      
      {isActive && (
        <div className="mt-4 bg-black/50 p-2 rounded text-sm">
          {status}
        </div>
      )}
    </div>
  );
};

export default AudioAnimation;
