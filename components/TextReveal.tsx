import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = "",
  delay = 0,
  once = true
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wordEls = container.querySelectorAll<HTMLElement>('.text-reveal-word');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(wordEls, { y: 0, rotate: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(wordEls, { y: '115%', rotate: 2 });

      const animateIn = () => {
        gsap.to(wordEls, {
          y: 0,
          rotate: 0,
          duration: 1.1,
          ease: 'expo.out', // matches the original's custom out-expo cubic-bezier [0.16, 1, 0.3, 1]
          stagger: 0.08,
          delay,
        });
      };

      if (once) {
        ScrollTrigger.create({
          trigger: container,
          start: 'top 90%',
          once: true,
          onEnter: animateIn,
        });
      } else {
        ScrollTrigger.create({
          trigger: container,
          start: 'top 90%',
          onEnter: animateIn,
          onLeaveBack: () => gsap.set(wordEls, { y: '115%', rotate: 2 }),
        });
      }
    }, container);

    return () => ctx.revert();
  }, [text, delay, once]);

  return (
    <span
      ref={containerRef}
      className={`inline-flex flex-wrap overflow-hidden py-1 ${className}`}
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-block overflow-hidden mr-[0.25em] pb-1 leading-none"
        >
          <span className="text-reveal-word inline-block origin-bottom-left">
            {word}
          </span>
        </span>
      ))}
    </span>
  );
};
