'use client';

import React from 'react';

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
  return (
    <div className="w-full py-24 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Explore Creative Communities</h2>
        
        <div className="space-y-12">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="relative">
              <div className="flex flex-wrap gap-4 justify-center">
                {category.items.map((item, itemIndex) => {
                  // Generate random sizes for bubbles
                  const size = ['small', 'medium', 'large'][Math.floor(Math.random() * 3)];
                  const sizeClasses = {
                    small: 'px-4 py-2 text-sm',
                    medium: 'px-6 py-3 text-base',
                    large: 'px-8 py-4 text-lg'
                  };
                  
                  // Generate random colors
                  const colors = [
                    'bg-blue-500/20 text-blue-700 dark:text-blue-300',
                    'bg-purple-500/20 text-purple-700 dark:text-purple-300',
                    'bg-pink-500/20 text-pink-700 dark:text-pink-300',
                    'bg-green-500/20 text-green-700 dark:text-green-300',
                    'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                  ];
                  const color = colors[Math.floor(Math.random() * colors.length)];
                  
                  return (
                    <div 
                      key={`${categoryIndex}-${itemIndex}`}
                      className={`${sizeClasses[size as keyof typeof sizeClasses]} ${color} rounded-full font-medium hover:scale-110 transition-transform cursor-pointer`}
                    >
                      {item.text}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BubbleMarquee;
