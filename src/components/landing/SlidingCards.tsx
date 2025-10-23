"use client";

import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface SlidingCardsProps {
  children: ReactNode;
  className?: string;
}

const SlidingCards: React.FC<SlidingCardsProps> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const childrenArray = React.Children.toArray(children);
  const numCards = childrenArray.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { top, height } = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Start animation when the container is 20% into the viewport
      const startOffset = viewportHeight * 0.2;
      
      // The total distance the container can be scrolled through
      const scrollableDistance = height - viewportHeight + startOffset;
      
      // The amount of pixels scrolled past the top of the container
      const scrolled = -top + startOffset;
      
      if (scrollableDistance > 0) {
        // Calculate progress as a value between 0 and 1
        const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call to set the state correctly on load
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, [numCards]);

  const cardsToScrollPast = numCards - 1;
  const cardProgress = scrollProgress * cardsToScrollPast;
  const activeCardIndex = Math.floor(cardProgress);
  const progressInSegment = cardProgress - activeCardIndex;

  // Each card's animation happens over a consistent portion of the scroll.
  const scrollPerCard = 120; // vh - increased for more consistent spacing
  // The animation (translateY) occurs over the full scroll distance for smoother transitions.
  const transitionDurationRatio = 1.0; // Use full distance for consistent spacing

  return (
    <div
      ref={containerRef}
      className={`relative w-full z-[5] ${className}`}
      style={{ 
        height: `${100 + scrollPerCard * cardsToScrollPast}vh`,
        width: 'calc(100% - 4rem)',
        marginLeft: '2rem'
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-y-hidden overflow-x-visible z-[1]">
        {childrenArray.map((child, i) => {
          let transform = 'translateY(100%) scale(1)';
          const zIndex = i; // Cards that come later should be on top when sliding over
          let scale = 1;
          let translateY = 100;

          if (i <= activeCardIndex) {
            // Cards that have been fully revealed
            translateY = 0;
            scale = 1;
            
            // Apply consistent scaling for uniform spacing
            if (i < activeCardIndex) {
              // Cards that have been passed by subsequent cards stay consistently shrunk
              scale = 0.9; // Keep them at 10% smaller for consistent spacing
            } else if (i === activeCardIndex && activeCardIndex + 1 < numCards) {
              // Current card shrinks smoothly as next card approaches
              const nextCardProgress = Math.min(1, progressInSegment / transitionDurationRatio);
              // Start shrinking immediately for consistent spacing
              const shrinkProgress = nextCardProgress; // 0 to 1 over full transition
              scale = 1 - (shrinkProgress * 0.1); // Shrink by up to 10% consistently
            }
            
            transform = `translateY(${translateY}%) scale(${scale})`;
          } else if (i === activeCardIndex + 1) {
            // The next card slides over the current one
            const animationProgress = Math.min(1, progressInSegment / transitionDurationRatio);
            translateY = 100 - animationProgress * 100;
            scale = 1;
            transform = `translateY(${translateY}%) scale(${scale})`;
          }
          // Cards further down the stack remain off-screen (default transform)

          return (
            <div
              key={i}
              className="absolute top-0 left-0 h-full w-full transition-transform duration-100 ease-out origin-center"
              style={{
                zIndex,
                transform,
                transformOrigin: 'center center',
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SlidingCards;
