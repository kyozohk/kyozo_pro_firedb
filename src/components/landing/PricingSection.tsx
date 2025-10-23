'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  subtitle: string;
  price: string;
  priceDescription: string;
  features: string[];
  gradient: string;
  subtitleColor: string;
}

const pricingData: PricingCardProps[] = [
  {
    title: 'Kyozo',
    subtitle: 'Community Connection',
    price: 'FREE',
    priceDescription: 'membership',
    features: [
      'Creative Labs content',
      'Connect with like-minded creatives',
      'Explore exclusive content',
      'Discover communities',
      'Early adopter benefits',
    ],
    gradient: 'from-purple-500 to-pink-500',
    subtitleColor: 'purple-400',
  },
  {
    title: 'KyozoPro',
    subtitle: 'Community Growth',
    price: 'PREMIUM',
    priceDescription: 'subscription',
    features: [
      'Creative Labs content',
      'Build and manage your communities',
      'Advanced community app',
      'Audience dashboards',
      'Custom group messaging',
      'Enhanced CRM toolkit',
    ],
    gradient: 'from-blue-500 to-cyan-500',
    subtitleColor: 'blue-400',
  },
];

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  subtitle,
  price,
  priceDescription,
  features,
  gradient,
}) => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount(prevCount => {
        if (prevCount < features.length) {
          return prevCount + 1;
        }
        clearInterval(interval);
        return prevCount;
      });
    }, 200); // Stagger animation by 200ms

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [features.length]);

  // Extract gradient colors
  const [fromClass, toClass] = gradient.split(' ');
  const fromColor = fromClass === 'from-purple-500' ? '#a855f7' : '#3b82f6';
  const toColor = toClass === 'to-pink-500' ? '#ec4899' : '#06b6d4';

  return (
    <div className="relative" style={{
      background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
      padding: '1px', // Border width
      borderRadius: '1rem',
    }}>
      <div className="bg-background rounded-2xl p-8 h-full">
        {/* Card Content */}
        <div className="relative z-10">
          <header>
            <h2 className="text-2xl font-bold">{title}</h2>
            <div className="h-px w-full bg-border my-4"></div>
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
            <p className="text-3xl font-bold mt-4">
              {price} <span className="text-sm font-normal text-muted-foreground">{priceDescription}</span>
            </p>
          </header>

          <ul className="mt-8 space-y-3">
            {features.map((feature, index) => (
              <li 
                key={index}
                className={`flex items-center transition-all duration-300 ${index < visibleCount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Dynamically import PriceCircles with SSR disabled to avoid hydration issues
const PriceCircles = dynamic(() => import('./PriceCircles'), {
  ssr: false
});

const PricingSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden text-foreground mt-32">
      {/* Background with animated circles */}
      <div className="absolute inset-0 w-full h-full">
        <PriceCircles />  
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 w-full max-w-[100rem] mx-auto flex flex-col items-center gap-8">
        {/* Pricing cards */}
        <div className="flex justify-center items-center gap-2 w-4/5 max-w-[80rem] mx-auto">
          {pricingData.map((data) => (
            <div key={data.title} className="flex justify-center flex-1 max-w-[35rem]">
              <PricingCard {...data} />
            </div>
          ))}
        </div>
        <Button 
          variant="outline-only" 
          size="medium" 
          href="#"
          className="mt-16"
        >
          Join the waitlist
        </Button>
      </div>
    </section>
  );
};

export default PricingSection;
