'use client';

import React from 'react';
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
  return (
    <div 
      className={`h-full w-full flex flex-col md:flex-row items-center justify-between p-8 md:p-16 rounded-3xl ${className}`}
      style={{ 
        background: backgroundColor || 'linear-gradient(135deg, #3b82f6 0%, #4a5af8 100%)',
        ...style 
      }}
    >
      {/* Left side content */}
      <div className="w-full md:w-1/2 text-white space-y-6 mb-8 md:mb-0">
        <div className="text-sm font-semibold tracking-wider opacity-80">{subtitle}</div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
        <p className="text-lg opacity-90 mb-8 max-w-xl">{text}</p>
        {description && <p className="text-base opacity-80 mb-6">{description}</p>}
        {button}
      </div>
      
      {/* Right side content */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        {content}
      </div>
    </div>
  );
};

export default SlidingCard;
