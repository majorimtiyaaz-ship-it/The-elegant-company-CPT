import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ 
  children, 
  className = "",
  delay = 0,
  duration = 1.0
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Respect user accessibility preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Set initial off-screen state
      gsap.set(el, { 
        opacity: 0, 
        y: 40 
      });

      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: duration,
        delay: delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%", // Trigger when the top of the element hits 88% of the viewport height
          toggleActions: "play none none none",
          once: true
        }
      });
    }, elementRef);

    return () => {
      ctx.revert();
    };
  }, [delay, duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

