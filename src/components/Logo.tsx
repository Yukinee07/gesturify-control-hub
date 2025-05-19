
import React from 'react';

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-12 h-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-300 rounded-full animate-pulse-neon"></div>
        <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
          <div className="w-6 h-6 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full transform rotate-45"></div>
        </div>
      </div>
      <span className="text-xl font-bold text-gradient-purple">GestureFlow</span>
    </div>
  );
};

export default Logo;
