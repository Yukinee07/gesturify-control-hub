
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Pause, Play } from 'lucide-react';
import { ThumbsLeft } from './icons/ThumbsLeft';
import { ThumbsRight } from './icons/ThumbsRight';

interface AudioAnimationProps {
  isActive: boolean;
  currentVolume: number;
  gesture: string | null;
  status: string;
}

const AudioAnimation = ({ isActive, currentVolume, gesture, status }: AudioAnimationProps) => {
  const [showAnimation, setShowAnimation] = useState<'left' | 'right' | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Auto animation effect when component becomes active
  useEffect(() => {
    if (isActive) {
      // Initial animation
      setShowAnimation('right');
      
      // Create alternating animation sequence
      const animationInterval = setInterval(() => {
        setShowAnimation(prev => prev === 'right' ? 'left' : 'right');
      }, 3000);
      
      return () => clearInterval(animationInterval);
    }
  }, [isActive]);

  // Audio playback effect
  useEffect(() => {
    if (isActive) {
      // Create and play audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio('/demo-audio.mp3');
        audioRef.current.loop = true;
      }
      
      // Set the volume and play or pause based on isPlaying state
      if (audioRef.current) {
        audioRef.current.volume = currentVolume;
        if (isPlaying) {
          audioRef.current.play().catch(err => console.error("Audio playback error:", err));
        } else {
          audioRef.current.pause();
        }
      }
    } else {
      // Stop audio when component is not active
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isActive, currentVolume, isPlaying]);

  // Toggle play/pause function
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Animation variants for the thumbs up animation
  const thumbsUpVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: {
      opacity: [0, 1, 0],
      y: [-20, -40, -60],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  // Animation variants for the thumbs down animation
  const thumbsDownVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: {
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
      {/* Centered content with flex */}
      <div className="flex flex-col items-center justify-center h-full">
        {/* Container for thumbs up/down icons */}
        <div className="relative h-32 w-full flex items-center justify-center mb-8">
          {/* Left side - Thumbs down animation */}
          <motion.div
            className="absolute left-12"
            variants={thumbsDownVariants}
            initial="hidden"
            animate={(isActive && (gesture === 'slideLeft' || gesture === 'thumbLeft')) || 
                    (isActive && showAnimation === 'left') ? "visible" : "hidden"}
          >
            <ThumbsLeft className="w-12 h-12 text-neon-purple" />
          </motion.div>
          
          {/* Right side - Thumbs up animation */}
          <motion.div
            className="absolute right-12"
            variants={thumbsUpVariants}
            initial="hidden"
            animate={(isActive && (gesture === 'slideRight' || gesture === 'thumbRight')) || 
                    (isActive && showAnimation === 'right') ? "visible" : "hidden"}
          >
            <ThumbsRight className="w-12 h-12 text-neon-purple" />
          </motion.div>
        </div>

        {/* Moved volume icon and added play/pause button */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Volume2 
            className={`w-16 h-16 ${isActive ? 'text-neon-purple' : 'text-gray-400'}`} 
          />
          
          {isActive && (
            <button 
              onClick={togglePlayPause} 
              className="rounded-full bg-neon-purple p-3 hover:bg-opacity-80 transition-all"
            >
              {isPlaying ? 
                <Pause className="w-8 h-8 text-white" /> : 
                <Play className="w-8 h-8 text-white" />
              }
            </button>
          )}
        </div>
        
        <div className="text-lg font-medium">
          Volume: {Math.round(currentVolume * 100)}%
        </div>
      </div>
      
      {isActive && (
        <div className="mt-4 bg-black/50 p-2 rounded text-sm absolute bottom-2 left-0 right-0 mx-2 text-center">
          {status || (showAnimation === 'right' ? 'Volume increasing...' : 'Volume decreasing...')}
        </div>
      )}
    </div>
  );
};

export default AudioAnimation;
