import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    // Set initial position out of view
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const moveCursor = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1, overwrite: "auto" });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.4, ease: "power2.out", overwrite: "auto" });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isInteractive = target.closest('button, a, select, textarea, input, [role="button"], .cursor-pointer');
      
      if (isInteractive) {
        gsap.to(ring, {
          scale: 1.7,
          backgroundColor: 'rgba(197, 160, 89, 0.15)',
          borderColor: '#c5a059',
          duration: 0.3,
          overwrite: "auto"
        });
        gsap.to(dot, {
          scale: 0.4,
          backgroundColor: '#c5a059',
          duration: 0.3,
          overwrite: "auto"
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isInteractive = target.closest('button, a, select, textarea, input, [role="button"], .cursor-pointer');

      if (isInteractive) {
        gsap.to(ring, {
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: '#c5a059',
          duration: 0.3,
          overwrite: "auto"
        });
        gsap.to(dot, {
          scale: 1,
          backgroundColor: '#c5a059',
          duration: 0.3,
          overwrite: "auto"
        });
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <div 
        ref={dotRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-elegant-gold rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div 
        ref={ringRef} 
        className="fixed top-0 left-0 w-8 h-8 border border-elegant-gold rounded-full pointer-events-none z-[9998] hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
};
