'use client';

import React, { useEffect, useRef } from 'react';

const PriceCircles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Circle properties
    const circles = [
      { x: canvas.width * 0.5, y: canvas.height * 0.5, radius: 200, color: '#a855f7', speed: 0.0005 },
      { x: canvas.width * 0.5, y: canvas.height * 0.5, radius: 300, color: '#3b82f6', speed: 0.0003 },
      { x: canvas.width * 0.5, y: canvas.height * 0.5, radius: 400, color: '#ec4899', speed: 0.0007 }
    ];
    
    let animationFrameId: number;
    let time = 0;
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;
      
      circles.forEach((circle, index) => {
        // Calculate position with oscillation
        const offsetX = Math.sin(time * circle.speed) * 100;
        const offsetY = Math.cos(time * circle.speed) * 100;
        
        // Draw circle
        ctx.beginPath();
        ctx.arc(circle.x + offsetX, circle.y + offsetY, circle.radius, 0, Math.PI * 2);
        ctx.strokeStyle = circle.color;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw dashed circle
        ctx.beginPath();
        ctx.arc(circle.x - offsetX * 0.5, circle.y - offsetY * 0.5, circle.radius * 0.7, 0, Math.PI * 2);
        ctx.setLineDash([5, 10]);
        ctx.strokeStyle = circle.color;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.setLineDash([]);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full opacity-20 z-0"
    />
  );
};

export default PriceCircles;
