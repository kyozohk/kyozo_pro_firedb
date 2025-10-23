'use client';

import React, { useMemo } from 'react';
import { Check } from 'lucide-react';

// Category types for the marquee
type CategoryType = 'music' | 'artMovements' | 'crafts' | 'fashion' | 'performance';

interface Item {
  text: string;
}

interface RowProps {
  items: Item[];
  direction: 'left' | 'right';
  speed?: number;
  category: string;
}

const Row: React.FC<RowProps> = ({ 
  items, 
  direction, 
  speed = 10, 
  category 
}) => {
  // Create enough duplicates to fill the screen width
  const repeatedItems = useMemo(() => {
    // Create 4 sets of items to ensure the row is never empty
    const repeated = [];
    for (let i = 0; i < 4; i++) {
      repeated.push(...items);
    }
    return repeated;
  }, [items]);
  
  return (
    <div className="w-full overflow-hidden relative h-[11.2rem] m-0 p-0 md:h-24 sm:h-20">
      <div 
        className={`flex absolute whitespace-nowrap ${direction === 'right' ? 'animate-scrollRight' : 'animate-scrollLeft'}`}
        style={{ 
          animationDuration: `${speed}s`
        }}
      >
        {/* First set of repeated items */}
        {repeatedItems.map((item, index) => {
          // Generate category-specific color classes
          const categoryColors: Record<string, string> = {
            'music': 'before:bg-gradient-to-b before:from-blue-500/10 before:via-blue-500/30 before:to-blue-500/10',
            'artMovements': 'before:bg-gradient-to-b before:from-purple-500/10 before:via-purple-500/30 before:to-purple-500/10',
            'crafts': 'before:bg-gradient-to-b before:from-orange-500/10 before:via-orange-500/30 before:to-orange-500/10',
            'fashion': 'before:bg-gradient-to-b before:from-pink-500/10 before:via-pink-500/30 before:to-pink-500/10',
            'performance': 'before:bg-gradient-to-b before:from-teal-500/10 before:via-teal-500/30 before:to-teal-500/10',
          };
          
          const colorClass = categoryColors[category] || categoryColors['music'];
          
          return (
            <div 
              key={`item-${index}`} 
              className={`flex items-center justify-center gap-3 py-5 px-10 rounded-2xl font-medium text-[1.6rem] mr-6 my-0 transition-all duration-300 cursor-default whitespace-nowrap bg-background/80 relative bg-clip-padding hover:translate-y-[-2px] hover:shadow-lg dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white ${colorClass} before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:p-[2px] before:mask-[linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:mask-composite-xor before:pointer-events-none md:py-4 md:px-8 md:text-[1.4rem] md:gap-2.5 md:mr-5 sm:py-3 sm:px-6 sm:text-[1.2rem] sm:gap-2 sm:mr-4`}
            >
              <Check className="h-6 w-6 flex-shrink-0 md:h-[18px] md:w-[18px] sm:h-4 sm:w-4" /> 
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface MarqueeProps {
  categories: {
    category: string;
    items: Item[];
  }[];
}

const Marquee: React.FC<MarqueeProps> = ({ categories }) => {
  return (
    <div className="w-full block overflow-hidden pt-32">
      {categories.map((row, index) => (
        <Row 
          key={`row-${index}`}
          items={row.items}
          direction={index % 2 === 0 ? 'left' : 'right'}
          speed={80} // Slower animation for better readability
          category={row.category}
        />
      ))}
    </div>
  );
};

export default Marquee;
