'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface BottomTextProps {
  text?: string;
  fontSize?: string;
  fontWeight?: number;
}

const ZoomText: React.FC<{
  text: string;
  fontSize?: string;
  fontWeight?: number;
  duration?: string;
  delay?: string;
}> = ({
  text,
  fontSize = '6rem',
  fontWeight = 700,
  duration = '500ms',
  delay = '0ms'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const words = text.split(' ');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex justify-center items-center overflow-hidden">
      <h1 
        className={`text-center max-w-[1200px] px-8 m-0 leading-tight tracking-tight origin-center text-foreground transition-all ${isVisible ? 'opacity-100 scale-100' : 'opacity-30 scale-10'}`}
        style={{
          fontSize: fontSize,
          fontWeight: fontWeight,
          transitionProperty: 'transform, opacity',
          transitionDuration: duration,
          transitionTimingFunction: 'ease-out',
          transitionDelay: delay
        }}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block mx-2">
            {word.split('').map((letter, letterIndex) => (
              <span
                key={`${wordIndex}-${letterIndex}`}
                className="inline-block text-foreground"
              >
                {letter}
              </span>
            ))}
            {wordIndex < words.length - 1 && <span className="inline-block w-[0.3rem]"></span>}
          </span>
        ))}
      </h1>
    </div>
  );
};

const BottomText: React.FC<BottomTextProps> = ({
  text = 'Join the Kyozo creative universe',
  fontSize = '6rem',
  fontWeight = 700
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-[80vh] w-full flex flex-col justify-center items-center p-8 relative overflow-hidden pb-24">
      {/* Container for shapes */}
      <div className="absolute bottom-0 w-full flex justify-between items-end z-[1] pointer-events-none">
        {/* Left shape */}
        <div className="w-1/5 h-[20vh] relative md:w-1/4 md:h-[15vh] sm:w-[30%] sm:h-[12vh]">
          <Image 
            src="/bottom-left.png" 
            alt="Left decoration" 
            width={200}
            height={200}
            className={`${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
            style={{
              objectFit: 'contain',
              objectPosition: 'left bottom'
            }} 
          />
        </div>
        
        {/* Right shape */}
        <div className="w-1/5 h-[20vh] relative md:w-1/4 md:h-[15vh] sm:w-[30%] sm:h-[12vh]">
          <Image 
            src="/bottom-right.png" 
            alt="Right decoration" 
            width={200}
            height={200}
            className={`${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
            style={{
              objectFit: 'contain',
              objectPosition: 'right bottom'
            }} 
          />
        </div>
      </div>
      
      {/* Main text with zoom effect */}
      <div className="m-0 mb-8 z-[2]">
        <ZoomText 
          text={text}
          fontSize={fontSize}
          fontWeight={fontWeight}
          duration="500ms"
          delay="300ms"
        />
      </div>
      
      {/* Button */}
      <div className={`mt-4 mb-16 z-[2] transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        style={{ transitionDelay: '500ms' }}
      >
        <Button  
          variant="outline-only"
          size="medium" 
          href="#"
        >
          Join the waitlist
        </Button>
      </div>
      
      {/* Copyright */}
      <div className={`w-full mt-16 text-center text-sm z-[2] text-foreground transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: '700ms' }}
      >
        Copyright © {new Date().getFullYear()} Kyozo. All rights reserved.
      </div>
    </div>
  );
};

export default BottomText;
