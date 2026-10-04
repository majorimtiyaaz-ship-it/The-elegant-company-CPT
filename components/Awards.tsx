import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Award {
  year: number;
  src: string;
}

// Oldest to newest, left to right
const AWARDS: Award[] = [
  { year: 2022, src: '/images/award-2022.webp' },
  { year: 2023, src: '/images/award-2023.webp' },
  { year: 2024, src: '/images/award-2024.webp' },
];

export const Awards: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return; // content is visible by default; no motion needed

    const ctx = gsap.context(() => {
      const heading = section.querySelectorAll('[data-award-heading]');
      const line = section.querySelector('[data-award-line]');
      const cards = section.querySelectorAll('[data-award-card]');
      const shines = section.querySelectorAll('[data-award-shine]');

      // Hide only once JS is running, so the section is never blank without JS
      gsap.set(heading, { opacity: 0, y: 18 });
      gsap.set(cards, { opacity: 0, y: 36, scale: 0.94 });
      if (line) gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
        },
      });

      tl.to(heading, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12 })
        .to(line, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, '-=0.5')
        .to(
          cards,
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', stagger: 0.22 },
          '-=0.9'
        )
        // One soft gold light sweep across each badge, in year order
        .fromTo(
          shines,
          { xPercent: -140, opacity: 0 },
          { xPercent: 140, opacity: 1, duration: 1.1, ease: 'power2.inOut', stagger: 0.22 },
          '-=0.5'
        )
        .set(shines, { opacity: 0 });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="awards"
      ref={sectionRef}
      aria-labelledby="awards-heading"
      className="relative w-full bg-white py-16 sm:py-20 overflow-hidden"
    >
      <div className="container mx-auto max-w-5xl px-6 md:px-12">
        <div className="text-center mb-10 sm:mb-14">
          <span
            data-award-heading
            className="text-[#8c6517] font-semibold tracking-[0.24em] uppercase mb-3 text-xs md:text-sm block"
          >
            Recognition
          </span>
          <h2
            id="awards-heading"
            data-award-heading
            className="text-3xl sm:text-4xl font-serif text-stone-900 leading-tight mb-3"
          >
            Award-Winning, Three Years Running
          </h2>
          <p
            data-award-heading
            className="font-sans text-sm sm:text-base text-stone-500 max-w-xl mx-auto"
          >
            Voted a Top 25 Most Popular custom furniture maker in South Africa by HomeImprovement4U in 2022, 2023 and 2024.
          </p>
        </div>

        <div className="relative">
          {/* Gold timeline line behind the badges (desktop) */}
          <div
            data-award-line
            aria-hidden="true"
            className="hidden sm:block absolute left-[8%] right-[8%] top-[44%] h-px bg-gradient-to-r from-transparent via-[#c5a059]/60 to-transparent"
          />

          <ol className="relative grid grid-cols-3 gap-3 sm:gap-10 items-start">
            {AWARDS.map((a) => (
              <li
                key={a.year}
                data-award-card
                className="group flex flex-col items-center text-center"
              >
                <div className="relative w-full max-w-[200px] aspect-square rounded-full bg-white transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.03]">
                  <img
                    src={a.src}
                    alt={`HomeImprovement4U South Africa Top 25 Most Popular award, ${a.year}`}
                    width={360}
                    height={360}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain rounded-full"
                  />
                  {/* Gold light sweep, clipped to the badge circle */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
                  >
                    <div
                      data-award-shine
                      className="absolute inset-y-0 w-1/2 opacity-0 bg-gradient-to-r from-transparent via-[#c5a059]/35 to-transparent -skew-x-12"
                    />
                  </div>
                </div>
                <span className="mt-4 font-serif text-lg sm:text-xl text-[#8c6517] tabular-nums">
                  {a.year}
                </span>
                <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-stone-500 mt-1">
                  Top 25 Most Popular
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-10 text-center font-sans text-[11px] uppercase tracking-[0.18em] text-stone-400">
          HomeImprovement4U South Africa · Custom Design &amp; Built Furniture · Mitchells Plain
        </p>
      </div>
    </section>
  );
};
