
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioPlayerProps {
  isActive: boolean;
}

export const AudioPlayer = ({ isActive }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();
  
  // Play audio automatically when component becomes active
  useEffect(() => {
    if (isActive && !isPlaying) {
      setIsPlaying(true);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);
  
  // Volume animation effect - more gradual change
  useEffect(() => {
    if (!isPlaying) return;
    
    let lastUpdateTime = Date.now();
    const volumeChangeRate = 2; // Units per second (more gradual)
    
    const animateVolume = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateTime;
      lastUpdateTime = now;
      
      // Calculate volume change based on time elapsed
      const volumeChange = (volumeChangeRate * deltaTime) / 1000;
      
      setVolume(prevVolume => {
        let newVolume = prevVolume;
        
        if (direction === 'up') {
          newVolume += volumeChange;
          if (newVolume >= 100) {
            setDirection('down');
            newVolume = 100;
          }
        } else {
          newVolume -= volumeChange;
          if (newVolume <= 0) {
            setDirection('up');
            newVolume = 0;
          }
        }
        
        // Update actual audio volume
        if (audioRef.current) {
          audioRef.current.volume = newVolume / 100;
        }
        
        return newVolume;
      });
      
      animationRef.current = requestAnimationFrame(animateVolume);
    };
    
    animationRef.current = requestAnimationFrame(animateVolume);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, direction]);
  
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleVolumeChange = (newDirection: 'up' | 'down') => {
    setDirection(newDirection);
  };
  
  return (
    <div className="relative w-full max-w-md aspect-video neo-blur rounded-xl p-6 flex flex-col items-center justify-center">
      <audio 
        ref={audioRef} 
        src="/demo-audio.mp3" 
        loop
        className="hidden"
      />
      
      <div className="text-xl font-semibold mb-6">
        Audio Control Gesture
      </div>
      
      <div className="w-full flex items-center justify-between gap-4">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          onClick={() => handleVolumeChange('down')}
        >
          <ArrowLeft className="w-8 h-8 text-white" />
        </motion.button>
        
        <motion.div 
          className={`relative rounded-full p-6 ${isPlaying ? 'bg-gradient-to-r from-neon-purple to-neon-pink' : 'bg-gray-800'}`}
          animate={{ 
            scale: isPlaying ? [1, 1.05, 1] : 1 
          }}
          transition={{ 
            repeat: isPlaying ? Infinity : 0, 
            duration: 1.5 
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={isPlaying ? 'playing' : 'paused'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 text-white" onClick={togglePlay} />
              ) : (
                <Play className="w-10 h-10 text-white" onClick={togglePlay} />
              )}
            </motion.div>
          </AnimatePresence>
          
          {isPlaying && (
            <div className="absolute inset-0 rounded-full z-[-1]">
              {[...Array(3)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute inset-0 rounded-full bg-neon-purple/30"
                  animate={{ 
                    scale: [1, 2, 2],
                    opacity: [0.6, 0.2, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: i * 0.6,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
        
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          onClick={() => handleVolumeChange('up')}
        >
          <ArrowRight className="w-8 h-8 text-white" />
        </motion.button>
      </div>
      
      <div className="mt-8 flex items-center gap-3">
        <Volume2 className="w-5 h-5 text-white" />
        <div className="w-40 h-3 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-neon-purple to-neon-pink"
            style={{ width: `${volume}%` }}
          />
        </div>
        <span className="text-sm font-medium">{Math.round(volume)}%</span>
      </div>
      
      {isActive && (
        <div className="absolute bottom-3 left-0 right-0 text-center bg-black/50 py-1 px-2 mx-2 rounded text-sm">
          Volume {direction === 'up' ? 'increasing' : 'decreasing'} automatically
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
