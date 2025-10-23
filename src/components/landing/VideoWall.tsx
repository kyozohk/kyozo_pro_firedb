'use client';

import React, { useEffect, useState, useRef } from 'react';

const VideoWall: React.FC = () => {
  const [videos, setVideos] = useState<string[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  useEffect(() => {
    // Set up video sources
    const videoSources = [
      '/city.mp4',
      '/concert.mp4',
      '/crafting.mp4',
      '/performance.mp4',
      '/pottery.mp4',
      '/producing.mp4',
      '/lights.mp4',
      '/paint.mp4'
    ];
    
    // Shuffle and take first 4
    const shuffled = [...videoSources].sort(() => 0.5 - Math.random());
    setVideos(shuffled.slice(0, 4));
    
    // Initialize refs array
    videoRefs.current = videoRefs.current.slice(0, 4);
    
    // Set up autoplay with random delays
    const timeouts: NodeJS.Timeout[] = [];
    videoRefs.current.forEach((videoRef, index) => {
      if (videoRef) {
        const delay = Math.random() * 3000; // Random delay up to 3 seconds
        timeouts.push(
          setTimeout(() => {
            videoRef.play().catch(err => console.log('Autoplay prevented:', err));
          }, delay)
        );
      }
    });
    
    return () => {
      // Clean up timeouts
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);
  
  return (
    <div className="relative w-full h-full">
      <div className="grid grid-cols-2 gap-4">
        {videos.map((videoSrc, index) => (
          <div 
            key={index} 
            className="aspect-video rounded-2xl overflow-hidden relative"
          >
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
                return undefined;
              }}
              src={videoSrc}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoWall;
