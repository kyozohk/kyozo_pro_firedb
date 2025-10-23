'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const FeatureCard = () => {
  return (
    <div className="w-full h-[calc(100vh-8rem)] mt-40 mb-24 flex flex-col justify-start relative overflow-hidden z-[3] isolate rounded-[30px] backdrop-blur-[10px] bg-background/80 border-[0.5px] border-muted-foreground shadow-lg">
      {/* Background gradient */}
      <div className="absolute top-1/2 right-[-5%] w-[1000px] h-[1000px] transform -translate-y-1/2 z-0 pointer-events-none">
        <div className="w-[1000px] h-[1000px] rounded-full bg-transparent relative overflow-hidden">
          {/* Animated rings - using pseudo elements in CSS */}
          <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent animate-expandRing">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-[#7b3b78] via-[#2b4b8f] to-[#e78b76] opacity-30 blur-[1px]"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent animate-expandRing animation-delay-700">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-[#7b3b78] via-[#2b4b8f] to-[#e78b76] opacity-30 blur-[1px]"></div>
          </div>
        </div>
      </div>
      
      {/* Card content */}
      <div className="flex flex-row gap-10 items-end justify-between mt-auto md:flex-row">
        {/* Left content */}
        <div className="w-[500px] flex flex-col gap-2.5 p-0 pl-40 mb-[30px] justify-end h-full">
          <h2 className="text-[4.8rem] font-bold m-0 leading-tight text-foreground">
            Connect. Explore. Engage.
          </h2>
          <p className="text-[1.2rem] leading-relaxed m-0 py-[30px] text-foreground">
            Connect with visionary creators and forward-thinking communities.
          </p>
          <div>
            <Button variant="outline" size="lg" className="text-foreground border-foreground hover:bg-foreground/10">
              Join the waitlist
            </Button>
          </div>
        </div>
        
        {/* Right content */}
        <div className="flex-1 flex justify-center items-center relative overflow-visible">
          <Image 
            src="/iphone.png" 
            alt="Phone" 
            width={400} 
            height={800} 
            className="object-cover object-left-top w-[378px] h-[594px] -mb-[30px] z-[1]"
          />
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
