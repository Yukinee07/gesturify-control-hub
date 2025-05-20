
import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Volume2 } from 'lucide-react';
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
    visible: (direction: 'up' | 'down') => ({
      opacity: [0, 1, 0],
      y: direction === 'up' ? [-20, -40, -60] : [20, 40, 60],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "loop"
      }
    })
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center">
      <div className="mb-8">
        <Volume2 
          className={`w-16 h-16 ${isActive ? 'text-neon-purple animate-pulse' : 'text-gray-400'}`} 
        />
      </div>
      
      <div className="text-lg font-medium mb-4">
        Volume: {Math.round(currentVolume * 100)}%
      </div>
      
      <div className="relative h-32 w-full flex items-center justify-center">
        {/* Up thumb animation */}
        <motion.div
          className="absolute"
          variants={thumbVariants}
          initial="hidden"
          animate={isActive && (gesture === 'slideRight' || gesture === 'thumbRight') ? "visible" : "hidden"}
          custom="up"
        >
          <ThumbsRight className="w-12 h-12 text-neon-purple rotate-0" />
        </motion.div>
        
        {/* Down thumb animation */}
        <motion.div
          className="absolute"
          variants={thumbVariants}
          initial="hidden"
          animate={isActive && (gesture === 'slideLeft' || gesture === 'thumbLeft') ? "visible" : "hidden"}
          custom="down"
        >
          <ThumbsLeft className="w-12 h-12 text-neon-purple rotate-0" />
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
