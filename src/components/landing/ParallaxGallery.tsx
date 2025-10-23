'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface ParallaxGalleryProps {
  externalMousePosition?: { x: number, y: number };
}

const ParallaxGallery: React.FC<ParallaxGalleryProps> = ({ externalMousePosition }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [images, setImages] = useState<string[]>([]);
  
  // Use external mouse position if provided, otherwise use internal state
  const position = externalMousePosition || mousePosition;
  
  useEffect(() => {
    // Load images for the gallery
    const imageUrls = [
      '/Parallax1.jpg',
      '/Parallax2.jpg',
      '/Parallax3.jpg',
      '/Parallax4.jpg',
      '/Parallax5.jpg',
    ];
    setImages(imageUrls);
    
    // Mouse move handler for standalone mode
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };
    
    if (!externalMousePosition) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [externalMousePosition]);
  
  return (
    <div className="relative w-full h-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full h-full">
        {/* Main large image */}
        <div 
          className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative"
          style={{
            transform: `translate(${position.x * -10}px, ${position.y * -10}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <Image 
            src={images[0] || '/Parallax1.jpg'} 
            alt="City view" 
            width={600} 
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Smaller images */}
        {images.slice(1).map((image, index) => (
          <div 
            key={index} 
            className="rounded-2xl overflow-hidden relative"
            style={{
              transform: `translate(${position.x * -(5 + index * 2)}px, ${position.y * -(5 + index * 2)}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <Image 
              src={image} 
              alt={`Gallery image ${index + 2}`} 
              width={300} 
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParallaxGallery;
