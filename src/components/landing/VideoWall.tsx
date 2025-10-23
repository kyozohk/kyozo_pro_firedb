'use client';

import React from 'react';

const VideoWall: React.FC = () => {
  return (
    <div className="relative w-full h-full max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((num) => (
          <div 
            key={num} 
            className="aspect-video rounded-lg bg-gradient-to-br from-purple-500/30 to-indigo-600/30 backdrop-blur-sm overflow-hidden"
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/40"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoWall;
