import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';

/**
 * Subtle "magnetic" pull: the element drifts a few pixels toward the cursor, then
 * settles back with a soft spring. Only active on devices with a real pointer
 * and no reduced-motion preference, so touch users and anyone who asked for less
 * motion never get it.
 */
export function useMagnetic<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { strength = 0.2, max = 8 }: { strength?: number; max?: number } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      const restTransition = el.style.transitionProperty;
      const clamp = (v: number) => Math.max(-max, Math.min(max, v));

      const onEnter = () => {
        // Buttons here use `transition-all`, which would smooth (and lag) GSAP's per-frame
        // transform. Keep colour/shadow transitions, drop transform for the duration.
        el.style.transitionProperty = 'color, background-color, border-color, box-shadow, opacity, scale';
      };
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        // Remove our own offset so the resting centre is stable (no feedback loop)
        const cx = r.left + r.width / 2 - (gsap.getProperty(el, 'x') as number);
        const cy = r.top + r.height / 2 - (gsap.getProperty(el, 'y') as number);
        xTo(clamp((e.clientX - cx) * strength));
        yTo(clamp((e.clientY - cy) * strength));
      };
      const onLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
          overwrite: 'auto',
          onComplete: () => {
            el.style.transitionProperty = restTransition;
          },
        });
      };

      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
        gsap.set(el, { clearProps: 'x,y' });
        el.style.transitionProperty = restTransition;
      };
    });

    return () => mm.revert();
  }, [ref, strength, max]);
}
