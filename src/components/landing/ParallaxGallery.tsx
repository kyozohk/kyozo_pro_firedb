'use client';

import React from 'react';
import Image from 'next/image';

const ParallaxGallery: React.FC = () => {
  return (
    <div className="relative w-full h-full max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div 
            key={num} 
            className={`aspect-square rounded-lg overflow-hidden ${
              num % 3 === 0 ? 'col-span-2 row-span-2' : ''
            }`}
            style={{
              transform: `translateY(${(num % 3) * 10}px)`,
              transition: 'transform 0.5s ease-out'
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-pink-500/30 to-purple-600/30 backdrop-blur-sm flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParallaxGallery;
