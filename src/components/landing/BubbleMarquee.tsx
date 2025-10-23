'use client';

import React, { useEffect, useState } from 'react';

interface BubbleItem {
  text: string;
}

interface BubbleCategory {
  category: string;
  items: BubbleItem[];
}

interface BubbleMarqueeProps {
  categories: BubbleCategory[];
}

const BubbleMarquee: React.FC<BubbleMarqueeProps> = ({ categories }) => {
  // Color mapping for different categories
  const categoryColors: Record<string, string> = {
    'music': 'border-blue-500',
    'classicism': 'border-purple-500',
    'jewelry': 'border-amber-500',
    'vintage': 'border-pink-500',
    'minimal': 'border-green-500',
    'performance': 'border-teal-500',
  };

  // For staggered animation
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Staggered animation for items appearing
    let count = 0;
    const allItems: Record<string, boolean> = {};
    
    categories.forEach((category, catIndex) => {
      category.items.forEach((_, itemIndex) => {
        const key = `${catIndex}-${itemIndex}`;
        setTimeout(() => {
          setVisibleItems(prev => ({
            ...prev,
            [key]: true
          }));
        }, count * 50);
        count++;
        allItems[key] = false;
      });
    });

    setVisibleItems(allItems);
  }, [categories]);

  return (
    <div className="w-full overflow-hidden bg-background">
      {categories.map((category, categoryIndex) => (
        <div 
          key={categoryIndex} 
          className="py-6 relative"
        >
          <div className="flex flex-wrap gap-4 justify-center">
            {category.items.map((item, itemIndex) => {
              const itemKey = `${categoryIndex}-${itemIndex}`;
              const isVisible = visibleItems[itemKey];
              
              return (
                <div 
                  key={itemKey}
                  className={`px-8 py-4 rounded-full border ${categoryColors[category.category] || 'border-gray-500'} text-foreground transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                  style={{ transitionDelay: `${itemIndex * 50}ms` }}
                >
                  {item.text}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BubbleMarquee;
