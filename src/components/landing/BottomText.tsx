'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface BottomTextProps {
  text: string;
  fontSize?: string;
  fontWeight?: number;
}

const BottomText: React.FC<BottomTextProps> = ({
  text,
  fontSize = '6rem',
  fontWeight = 700
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-24 px-6 bg-background">
      <h2 
        className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
        style={{ fontSize, fontWeight }}
      >
        {text}
      </h2>
      
      <p className="text-xl md:text-2xl text-center max-w-3xl mb-12 text-muted-foreground">
        Connect with visionary creators and forward-thinking communities.
        Join our waitlist to be the first to experience the future of creative collaboration.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="px-8 py-6 text-lg">
          Join the Waitlist
        </Button>
        <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
          Learn More
        </Button>
      </div>
    </div>
  );
};

export default BottomText;
