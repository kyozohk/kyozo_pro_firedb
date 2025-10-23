'use client';

import React, { useState, useEffect } from 'react';

interface HeroProps {
  text?: string;
  subtitle?: string;
}

const Hero: React.FC<HeroProps> = ({ 
  text = 'Discover Your Creative Universe',
  subtitle = 'Explore and manage your community messages with ease'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const words = text.split(' ');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden flex items-center justify-center text-foreground bg-transparent">
      {/* Gradient elements */}
      <div className="absolute top-[-100px] left-0 w-[1600px] h-[1000px] bg-[radial-gradient(circle,#2dd4bf,transparent_50%)] filter blur-[100px] z-[1] opacity-15 transform translate-x-[-33.33%] translate-y-[-33.33%] rounded-full"></div>
      <div className="absolute top-[-400px] w-[1000px] h-[1400px] bg-[radial-gradient(circle,#f97316,transparent_90%)] filter blur-[100px] z-[1] opacity-[0.21] transform translate-x-[33.33%] translate-y-[-33.33%] rounded-full"></div>
      
      {/* SVG Animation Container */}
      <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-80 w-full max-w-[800px] overflow-hidden h-[480px] z-[2]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-fadeInScaleUp [animation-delay:0.2s]"
        >
          <g>
            <circle
              cx="440"
              cy="440"
              r="120"
              stroke="#EEC87E"
              strokeOpacity="1.0"
              strokeWidth="50"
            />
            <circle
              cx="440"
              cy="440"
              r="220"
              stroke="#EEC87E"
              strokeOpacity="1.0"
              strokeWidth="50"
            />
          </g>
        </svg>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-[3] flex flex-col justify-center items-center">
        <h1 className="text-6xl md:text-7xl font-extrabold text-center max-w-[1200px] leading-tight text-foreground mb-6">
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block mx-2 whitespace-nowrap">
              {word.split('').map((letter, letterIndex) => (
                <span
                  key={`${wordIndex}-${letterIndex}`}
                  className={`inline-block transition-all duration-500 ease-in-out ${
                    isLoaded 
                      ? 'opacity-100 translate-y-0 text-foreground' 
                      : 'opacity-30 translate-y-5 text-muted-foreground'
                  } hover:text-primary hover:scale-110 hover:-translate-y-1`}
                  style={{ 
                    transitionDelay: `${(wordIndex * word.length + letterIndex) * 0.05}s`,
                    textShadow: isLoaded ? '0 0 8px rgba(255,255,255,0.1)' : 'none'
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
              {wordIndex < words.length - 1 && <span className="inline-block w-[0.3rem]"></span>}
            </span>
          ))}
        </h1>
        <p className={`text-xl text-muted-foreground max-w-2xl text-center transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.8s' }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default Hero;
