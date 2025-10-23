'use client';

import React from 'react';

const BackgroundImages: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Top left gradient blob */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full filter blur-[100px] opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Top right gradient blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-l from-pink-500/20 to-orange-500/20 rounded-full filter blur-[100px] opacity-40 transform translate-x-1/3 -translate-y-1/3"></div>
      
      {/* Bottom gradient blob */}
      <div className="absolute bottom-0 left-1/2 w-[1000px] h-[1000px] bg-gradient-to-t from-purple-500/20 to-blue-500/20 rounded-full filter blur-[120px] opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
    </div>
  );
};

export default BackgroundImages;
