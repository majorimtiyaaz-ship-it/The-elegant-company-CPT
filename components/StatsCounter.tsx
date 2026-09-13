import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Stat {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  isYear?: boolean;
}

const STATS: Stat[] = [
  { value: 100, suffix: '%', label: 'Handcrafted' },
  { value: 2020, suffix: '', label: 'Established', isYear: true },
  { value: 12, suffix: '', label: 'Pieces Restored' },
  { value: 80, suffix: '%', label: 'Client Satisfaction' },
];

export const StatsCounter: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      numberRefs.current.forEach((el, i) => {
        if (!el) return;
        const stat = STATS[i];

        if (prefersReducedMotion) {
          el.textContent = `${stat.value}${stat.suffix}`;
          return;
        }

        const counter = { val: 0 };
        gsap.to(counter, {
          val: stat.value,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.val)}${stat.suffix}`;
          },
        });
      });

      // Fade/slide the whole row up as it enters
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="w-full bg-[#0d0c0b] border-y border-stone-800/60 py-12 sm:py-16"
    >
      <div className="container mx-auto max-w-6xl px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6 text-center">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="font-serif text-[clamp(32px,4.5vw,48px)] text-[#c5a059] leading-none mb-2 tabular-nums">
                <span ref={(el) => (numberRefs.current[i] = el)}>0</span>
              </div>
              <div className="font-sans text-[11px] sm:text-[12px] uppercase tracking-[0.18em] text-stone-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
