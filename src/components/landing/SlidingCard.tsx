'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface SlidingCardProps {
  title: string;
  subtitle: string;
  text: string;
  description?: string;
  button?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  content?: React.ReactNode;
  backgroundColor?: string;
}

const SlidingCard: React.FC<SlidingCardProps> = ({ 
  title, 
  subtitle, 
  text, 
  description,
  button, 
  content, 
  className = '',
  style,
  backgroundColor
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1 range
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1 range
        setMousePosition({ x, y });
      }
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      return () => card.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Clone the content and pass mouse position if it's ParallaxGallery
  const enhancedContent = React.isValidElement(content) && 
    content.type && 
    (content.type as any).name === 'ParallaxGallery'
    ? React.cloneElement(content as React.ReactElement<{externalMousePosition?: {x: number, y: number}}>, {
        externalMousePosition: mousePosition
      })
    : content;

  return (
    <div 
      ref={cardRef}
      className={`w-full h-full rounded-[30px] backdrop-blur-[10px] border-[0.5px] border-[#999] shadow-lg overflow-hidden relative ${className}`}
      style={{ 
        background: backgroundColor || 'linear-gradient(135deg, #3b82f6 0%, #4a5af8 100%)',
        ...style 
      }}
    >
      <div className="flex flex-row h-full items-stretch justify-between">
        {/* Left side content */}
        <div className="w-1/2 flex flex-col gap-2.5 p-0 pl-10 pt-10 pb-[30px] text-left relative">
          <p className="text-[0.9rem] font-light tracking-wider uppercase mt-10 mb-5 text-white/70">{subtitle}</p>
          <h2 className="text-[4.4rem] font-bold m-0 leading-none text-white">
            {title}
          </h2>
          <p className="text-[0.875rem] leading-relaxed mt-[30px] mb-[30px] text-white w-2/3">
            {text}
          </p>
          {description && <p className="text-[0.875rem] leading-relaxed text-white">{description}</p>}
          <div className="mt-5">
            {button}
          </div>
        </div>
        
        {/* Right side content */}
        <div className="flex-1 flex justify-center items-center relative overflow-visible h-full -ml-16">
          {enhancedContent}
        </div>
      </div>
    </div>
  );
};

export default SlidingCard;
