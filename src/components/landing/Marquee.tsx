'use client';

import React from 'react';

interface MarqueeItem {
  text: string;
}

interface MarqueeCategory {
  category: string;
  items: MarqueeItem[];
}

interface MarqueeProps {
  categories: MarqueeCategory[];
}

const Marquee: React.FC<MarqueeProps> = ({ categories }) => {
  return (
    <div className="w-full overflow-hidden py-16 bg-background">
      {categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-8 last:mb-0">
          <div className="relative flex overflow-x-hidden">
            <div className="animate-marquee whitespace-nowrap flex items-center">
              {[...category.items, ...category.items].map((item, itemIndex) => (
                <div 
                  key={`${categoryIndex}-${itemIndex}`} 
                  className="mx-8 px-6 py-3 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {item.text}
                </div>
              ))}
            </div>
            
            <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center">
              {[...category.items, ...category.items].map((item, itemIndex) => (
                <div 
                  key={`${categoryIndex}-${itemIndex}-duplicate`} 
                  className="mx-8 px-6 py-3 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Marquee;
