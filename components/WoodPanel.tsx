import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// One small texture (about 10 KB). Loaded only when the section is near the screen.
const GRAIN_URL = '/images/walnut-grain.webp';

// Planks start spread apart in soft 3D, then slide together into one solid panel.
// Only transform and opacity are animated, so it stays on the GPU and is cheap on phones.
const initialMode = () => {
  if (typeof window === 'undefined') return { reduced: false, planks: 6 };
  return {
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    planks: window.matchMedia('(max-width: 767px)').matches ? 4 : 6,
  };
};

export const WoodPanel: React.FC = () => {
  const [{ reduced, planks }] = useState(initialMode);
  const outerRef = useRef<HTMLElement>(null);
  const plankRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sheenRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [grainOn, setGrainOn] = useState(false);

  // Load the texture shortly before the section is reached
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGrainOn(true);
          io.disconnect();
        }
      },
      { rootMargin: '150% 0px 150% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const outer = outerRef.current;
    if (!outer) return;

    const center = (planks - 1) / 2;
    const items = plankRefs.current.slice(0, planks).filter(Boolean) as HTMLDivElement[];
    const shades = shadeRefs.current.slice(0, planks).filter(Boolean) as HTMLDivElement[];

    const ctx = gsap.context(() => {
      // Starting positions: a gentle fan, alternating heights, receding in depth
      items.forEach((el, i) => {
        const d = i - center;
        gsap.set(el, {
          xPercent: d * 46,
          yPercent: (i % 2 === 0 ? -1 : 1) * 16,
          z: -(Math.abs(d) * 110 + (i % 2) * 70) - 120,
          rotationY: d * -10,
          rotationX: (i % 2 === 0 ? 1 : -1) * 4,
          opacity: 0,
        });
      });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: outer,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          // Promote layers to the GPU only while the section is on screen
          onToggle: (self) => {
            items.forEach((el) => {
              el.style.willChange = self.isActive ? 'transform, opacity' : 'auto';
            });
          },
        },
      });

      // Planks glide together (slightly staggered from the outside in)
      items.forEach((el, i) => {
        const delay = Math.abs(i - center) * 0.02;
        tl.to(
          el,
          { xPercent: 0, yPercent: 0, z: 0, rotationY: 0, rotationX: 0, duration: 0.5 },
          0.04 + delay
        );
        tl.to(el, { opacity: 1, duration: 0.18, ease: 'power1.out' }, 0.04 + delay);
      });

      // Edge shading softens as the planks join, leaving a fine seam
      tl.to(shades, { opacity: 0.35, duration: 0.2, ease: 'power1.inOut' }, 0.42);

      // One slow sweep of light across the finished surface
      if (sheenRef.current) {
        tl.fromTo(
          sheenRef.current,
          { xPercent: -130, opacity: 0 },
          { xPercent: 130, opacity: 1, duration: 0.3, ease: 'power1.inOut' },
          0.58
        );
        tl.to(sheenRef.current, { opacity: 0, duration: 0.06 }, 0.82);
      }

      // Caption appears once the panel is whole
      if (textRef.current) {
        tl.fromTo(
          textRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.14, ease: 'power2.out' },
          0.6
        );
      }
    }, outer);

    return () => ctx.revert();
  }, [reduced, planks]);

  const grain = grainOn ? `url(${GRAIN_URL})` : 'none';

  const plankEls = Array.from({ length: planks }, (_, i) => {
    // One continuous grain across the whole panel; each plank shows its own slice
    const posX = planks === 1 ? 0 : (i / (planks - 1)) * 100;
    // Slight tone change per plank so the joins read as separate boards
    const tone = [0.0, 0.1, 0.04, 0.14, 0.02, 0.09][i % 6];
    return (
      <div
        key={i}
        ref={(el) => {
          plankRefs.current[i] = el;
        }}
        className="relative h-full flex-1"
        style={{
          backgroundColor: '#3a2416',
          backgroundImage: `linear-gradient(rgba(0,0,0,${tone}), rgba(0,0,0,${tone})), ${grain}`,
          backgroundSize: `100% 100%, ${planks * 100}% 100%`,
          backgroundPosition: `0 0, ${posX}% 0`,
          backfaceVisibility: 'hidden',
        }}
      >
        <div
          ref={(el) => {
            shadeRefs.current[i] = el;
          }}
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: reduced ? 0.35 : 1,
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 14%, rgba(0,0,0,0) 86%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      </div>
    );
  });

  const caption = (
    <div ref={textRef} className="mt-8 px-6 text-center md:mt-10" style={{ opacity: reduced ? 1 : 0 }}>
      <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.24em] text-[#c5a059] md:text-sm">
        Solid wood
      </span>
      <h2 className="font-serif text-3xl leading-tight text-white sm:text-4xl">Plank by plank</h2>
      <p className="mx-auto mt-3 max-w-md text-sm font-light leading-relaxed text-white/70 sm:text-base">
        Shaped and joined into one piece.
      </p>
    </div>
  );

  const panel = (
    <div className="relative" style={{ width: 'min(88vw, 720px)', height: 'min(46svh, 420px)' }}>
      <div className="absolute inset-0 flex" style={{ perspective: '1100px' }}>
        {plankEls}
      </div>
      {/* Light sweep, clipped to the finished panel only */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          ref={sheenRef}
          className="absolute inset-y-0 left-0 w-1/2"
          style={{
            opacity: 0,
            background:
              'linear-gradient(100deg, transparent 0%, rgba(197,160,89,0.0) 30%, rgba(255,236,196,0.32) 50%, rgba(197,160,89,0.0) 70%, transparent 100%)',
          }}
        />
      </div>
    </div>
  );

  // Reduced motion: a static, finished panel with no scroll effect
  if (reduced) {
    return (
      <section
        id="wood-panel"
        ref={outerRef}
        aria-label="Solid wood craftsmanship"
        className="relative flex w-full flex-col items-center bg-[#0d0c0b] px-0 py-20 md:py-28"
      >
        {panel}
        {caption}
      </section>
    );
  }

  return (
    <section
      id="wood-panel"
      ref={outerRef}
      aria-label="Solid wood craftsmanship"
      className="relative w-full bg-[#0d0c0b] h-[190vh] md:h-[230vh]"
    >
      <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_46%,rgba(197,160,89,0.12),transparent_62%)]"
          aria-hidden="true"
        />
        {panel}
        {caption}
      </div>
    </section>
  );
};
