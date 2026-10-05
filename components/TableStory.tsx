import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WhatsAppIcon } from './WhatsAppIcon';
import { bookUrl, track } from './BookCTA';
import type { TableScene } from './table/buildTableScene';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

const Cta: React.FC<{ linkRef?: React.Ref<HTMLAnchorElement>; interactive?: boolean }> = ({
  linkRef,
  interactive = true,
}) => (
  <a
    ref={linkRef}
    href={bookUrl('table')}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => track('table')}
    tabIndex={interactive ? 0 : -1}
    className="mt-7 inline-flex min-h-[54px] w-full max-w-sm items-center justify-center gap-3 rounded-sm bg-white px-8 text-xs font-bold uppercase tracking-[0.2em] text-[#1a1a1a] shadow-[0_14px_40px_rgba(197,160,89,0.25)] transition-colors duration-300 hover:bg-[#f5efe3] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0c0b] md:w-auto"
  >
    <WhatsAppIcon className="h-6 w-6 shrink-0" />
    Book a call-out
  </a>
);

export const TableStory: React.FC = () => {
  const outerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const s1 = useRef<HTMLDivElement>(null);
  const s2 = useRef<HTMLDivElement>(null);
  const s3 = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // 'pending' until we know; 'scroll' = full 3D experience; 'static' = fallback
  const [mode, setMode] = useState<'pending' | 'scroll' | 'static'>('pending');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setMode(reduced || !webglAvailable() ? 'static' : 'scroll');
  }, []);

  useEffect(() => {
    if (mode !== 'scroll') return;
    const outer = outerRef.current;
    const canvas = canvasRef.current;
    const sticky = stickyRef.current;
    if (!outer || !canvas || !sticky) return;

    let scene: TableScene | null = null;
    let disposed = false;
    let inView = false;
    let target = 0;
    let cur = 0;
    let lastRendered = -1;

    const fade = (el: HTMLElement | null, o: number, y = 0) => {
      if (!el) return;
      el.style.opacity = String(o);
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    const updateUI = (p: number) => {
      // Stage 1: "Every piece starts alone"
      const o1 = seg(p, 0.02, 0.08) * (1 - seg(p, 0.26, 0.34));
      fade(s1.current, o1, (1 - seg(p, 0.02, 0.08)) * 16 - seg(p, 0.26, 0.34) * 10);
      // Stage 2: "Joined by hand"
      const o2 = seg(p, 0.34, 0.42) * (1 - seg(p, 0.62, 0.7));
      fade(s2.current, o2, (1 - seg(p, 0.34, 0.42)) * 16 - seg(p, 0.62, 0.7) * 10);
      // Stage 3: "Made for your home" + CTA
      const o3 = seg(p, 0.76, 0.88);
      fade(s3.current, o3, (1 - o3) * 18);
      if (ctaRef.current) {
        const live = o3 > 0.85;
        ctaRef.current.style.pointerEvents = live ? 'auto' : 'none';
        ctaRef.current.tabIndex = live ? 0 : -1;
      }
      if (hintRef.current) hintRef.current.style.opacity = String(1 - seg(p, 0, 0.05));
      if (barRef.current) barRef.current.style.transform = `scaleY(${p})`;
    };

    updateUI(0);

    const tick = () => {
      if (!scene || !inView) return;
      cur += (target - cur) * 0.14;
      if (Math.abs(target - cur) < 0.0004) cur = target;
      if (Math.abs(cur - lastRendered) > 0.00015) {
        scene.setProgress(cur);
        scene.render();
        lastRendered = cur;
      }
    };

    const st = ScrollTrigger.create({
      trigger: outer,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        target = self.progress;
        updateUI(target);
      },
    });

    // Only download three.js (and build the scene) when the section is about
    // a screen away, so it never competes with the first paint.
    let loading = false;
    const loadScene = async () => {
      if (loading || scene || disposed) return;
      loading = true;
      const { buildTableScene } = await import('./table/buildTableScene');
      if (disposed) return;
      const r = sticky.getBoundingClientRect();
      scene = buildTableScene(canvas, Math.max(1, r.width), Math.max(1, r.height));
      target = cur = st.progress;
      scene.setProgress(cur);
      scene.render();
      lastRendered = cur;
      updateUI(target);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadScene();
      },
      { rootMargin: '100% 0px 100% 0px' }
    );
    io.observe(outer);

    // "Visible" for rendering means actually on screen (not the 1-screen preload margin)
    const vis = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && scene) lastRendered = -1; // force a repaint on re-entry
    });
    vis.observe(outer);

    const ro = new ResizeObserver(() => {
      if (!scene) return;
      const r = sticky.getBoundingClientRect();
      scene.resize(Math.max(1, r.width), Math.max(1, r.height));
      scene.setProgress(cur);
      scene.render();
    });
    ro.observe(sticky);

    gsap.ticker.add(tick);

    return () => {
      disposed = true;
      gsap.ticker.remove(tick);
      st.kill();
      io.disconnect();
      vis.disconnect();
      ro.disconnect();
      scene?.dispose();
      scene = null;
    };
  }, [mode]);

  const copy = {
    k1: '01 — Every piece starts alone',
    h1: 'Solid walnut, cut and shaped by hand.',
    k2: '02 — Joined with care',
    h2: 'Each joint fitted by hand, one at a time.',
    k3: '03 — Made for your home',
    h3: 'Tell us what you have in mind. We\u2019ll design and build it with you.',
    sub: 'Message us on WhatsApp. We reply within 24 hours.',
  };

  // Fallback: reduced motion or no WebGL. Static, light, still ends in the CTA.
  if (mode === 'static') {
    return (
      <section
        id="table-story"
        aria-label="Handcrafted furniture, made for your home"
        className="relative w-full bg-[#0d0c0b] px-6 py-20 text-center md:py-28"
      >
        <div className="mx-auto max-w-2xl">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.24em] text-[#c5a059]">
            {copy.k3}
          </span>
          <img
            src="/images/artisan-joinery-detail.webp"
            alt="Hand-cut joinery detail on a solid wood piece"
            loading="lazy"
            decoding="async"
            className="mx-auto mb-8 aspect-[4/3] w-full max-w-xl rounded-sm object-cover"
          />
          <h2 className="font-serif text-3xl leading-tight text-white md:text-5xl">{copy.h3}</h2>
          <p className="mt-4 text-base text-white/70 md:text-lg">{copy.sub}</p>
          <Cta />
        </div>
      </section>
    );
  }

  return (
    <section
      id="table-story"
      ref={outerRef}
      aria-label="Watch a handcrafted walnut table come together"
      className="relative w-full bg-[#0d0c0b] h-[380vh] md:h-[420vh]"
    >
      <div ref={stickyRef} className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Warm backdrop glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(197,160,89,0.16),transparent_62%)]"
        />
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />

        {/* Scroll progress rail */}
        <div aria-hidden="true" className="absolute right-3 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-white/10 sm:block md:right-8">
          <div ref={barRef} className="h-full w-full origin-top bg-[#c5a059]" style={{ transform: 'scaleY(0)' }} />
        </div>

        {/* Top label */}
        <div className="absolute inset-x-0 top-0 px-6 pt-[max(1.5rem,env(safe-area-inset-top))] text-center md:pt-10">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c5a059]">
            The Elegant Company
          </span>
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-24 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/60"
        >
          Scroll
          <span className="block h-8 w-px animate-pulse bg-gradient-to-b from-[#c5a059] to-transparent motion-reduce:animate-none" />
        </div>

        {/* Stage copy, crossfading in one grid cell */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d0c0b] via-[#0d0c0b]/85 to-transparent px-6 pb-[max(2.25rem,env(safe-area-inset-bottom))] pt-28 pr-20 text-center sm:pr-6 md:pb-14">
          <div className="mx-auto grid max-w-2xl">
            <div ref={s1} className="col-start-1 row-start-1 opacity-0">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c5a059]">{copy.k1}</span>
              <h2 className="font-serif text-2xl leading-snug text-white md:text-4xl">{copy.h1}</h2>
            </div>
            <div ref={s2} className="col-start-1 row-start-1 opacity-0">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c5a059]">{copy.k2}</span>
              <h2 className="font-serif text-2xl leading-snug text-white md:text-4xl">{copy.h2}</h2>
            </div>
            <div ref={s3} className="col-start-1 row-start-1 opacity-0">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c5a059]">{copy.k3}</span>
              <h2 className="font-serif text-2xl leading-snug text-white md:text-4xl">{copy.h3}</h2>
              <p className="mt-3 text-sm text-white/70 md:text-base">{copy.sub}</p>
              <Cta linkRef={ctaRef} interactive={false} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
