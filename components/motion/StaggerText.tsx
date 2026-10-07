import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StaggerTextProps {
  text: string;
  className?: string;
  delay?: number;
}

/**
 * Paragraph reveal: words fade up one after another when the paragraph enters view.
 * Opacity and a small lift only (cheap on phones). The full sentence stays in the DOM
 * as ordinary inline text, and reduced-motion users simply see it.
 */
export const StaggerText: React.FC<StaggerTextProps> = ({ text, className = '', delay = 0 }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(' ');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const targets = el.querySelectorAll<HTMLElement>('[data-w]');
      gsap.set(targets, { opacity: 0, y: 12 });
      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        gsap.to(targets, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.022, delay });
      };
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        onEnter: play,
        onEnterBack: play,
      });
      // Already at or past the trigger point when the page loads (scroll restoration)
      if (st.progress > 0) gsap.set(targets, { opacity: 1, y: 0 }), (played = true);
      return () => st.kill();
    });
    return () => mm.revert();
  }, [text, delay]);

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span data-w className="inline-block">
            {w}
          </span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </p>
  );
};
