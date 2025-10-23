'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ToolkitProps {
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
}

const Toolkit: React.FC<ToolkitProps> = ({
  description = `Explore a dynamic resources hub where creativity meets community. Here you'll find a curated collection of articles, videos and resources designed to inspire, inform and ignite your creative journey. Explore a dynamic resources hub where creativity meets community. Here you'll find a curated collection of articles, videos and resources designed to inspire, inform and ignite your creative journey.`,
  ctaText = 'Check out CreativeLab',
  ctaUrl = '#',
}) => {
  return (
    <>
      {/* Social Media Section */}
      <section className="relative w-full flex flex-col items-center justify-center py-16 px-4 text-center overflow-visible z-auto">
        <div className="text-[6.6rem] font-black leading-tight text-foreground mb-4 md:text-[6.6rem] sm:text-[3.3rem]">
          We are not
        </div>
        <div className="mt-4 py-7 px-16 bg-background/80 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-xl border border-white/10 inline-block">
          <span className="text-[2.5rem] font-bold tracking-wider text-foreground sm:text-[1.5rem]">
            Social Media
          </span>
        </div>
      </section>

      {/* CreativeLab Section */}
      <section className="relative w-full max-w-none m-0 py-64 px-6 overflow-hidden md:py-24 sm:px-8">
        <div className="grid grid-cols-1 font-light text-[1.8rem] relative m-0 mx-auto md:grid-cols-2">
          {/* Left Column */}
          <div className="flex flex-col justify-end h-full">
            <h2 className="text-[4.5rem] font-black leading-tight text-foreground m-0 -left-40 md:text-[3rem]">
              CreativeLab
              <br />
              Your creative
              <br />
              toolkit
            </h2>
          </div>

          {/* Right Column */}
          <div className="relative flex flex-col justify-end h-full">
            <p className="text-base leading-relaxed max-w-md text-foreground mb-8">
              {description}
            </p>
            <a href={ctaUrl} className="mt-4 text-blue-500 font-semibold text-base inline-flex items-center self-start no-underline hover:underline">
              {ctaText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Toolkit;
