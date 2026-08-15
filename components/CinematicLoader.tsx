import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface CinematicLoaderProps {
  onComplete?: () => void;
  heroImageUrl?: string;
}

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({
  onComplete,
  heroImageUrl = '/images/1770732574204.webp',
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const locationRef = useRef<HTMLParagraphElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let isMounted = true;
    let criticalAssetsReady = false;
    let entranceComplete = false;
    let exitTriggered = false;

    // Track critical loading state
    let heroImageReady = false;
    let fontsReady = false;

    // 1. Critical Font Readiness
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready
        .then(() => {
          fontsReady = true;
          checkAndTriggerExit();
        })
        .catch(() => {
          fontsReady = true;
          checkAndTriggerExit();
        });
    } else {
      fontsReady = true;
    }

    // 2. Critical Hero Image Readiness
    const heroImg = new Image();
    heroImg.src = heroImageUrl;

    const onHeroImageReady = () => {
      heroImageReady = true;
      checkAndTriggerExit();
    };

    if (heroImg.complete && heroImg.naturalWidth !== 0) {
      heroImageReady = true;
    } else {
      heroImg.onload = onHeroImageReady;
      heroImg.onerror = () => {
        // Continue loading gracefully if image fails
        heroImageReady = true;
        checkAndTriggerExit();
      };
    }

    // Absolute failsafe timeout (2.2s maximum) so loader NEVER gets stuck
    const failsafeTimer = setTimeout(() => {
      heroImageReady = true;
      fontsReady = true;
      checkAndTriggerExit(true);
    }, 2200);

    const checkAndTriggerExit = (force = false) => {
      if (!isMounted || exitTriggered) return;
      if ((heroImageReady && fontsReady) || force) {
        criticalAssetsReady = true;
        if (entranceComplete || prefersReducedMotion || force) {
          triggerExitSequence();
        }
      }
    };

    // Reduced motion fast-path
    if (prefersReducedMotion) {
      if (heroImageReady && fontsReady) {
        setIsDismissed(true);
        if (onComplete) onComplete();
      } else {
        const checkInterval = setInterval(() => {
          if (heroImageReady && fontsReady) {
            clearInterval(checkInterval);
            setIsDismissed(true);
            if (onComplete) onComplete();
          }
        }, 50);
        return () => {
          isMounted = false;
          clearInterval(checkInterval);
          clearTimeout(failsafeTimer);
        };
      }
      return () => {
        isMounted = false;
        clearTimeout(failsafeTimer);
      };
    }

    // 3. GSAP Entrance Timeline & Smooth Progress Orchestration
    const ctx = gsap.context(() => {
      const entranceTl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          entranceComplete = true;
          if (criticalAssetsReady) {
            triggerExitSequence();
          }
        },
      });

      // Initial states
      gsap.set(wordmarkRef.current, { opacity: 0, y: 10 });
      gsap.set(locationRef.current, { opacity: 0, y: 6 });
      gsap.set(progressTrackRef.current, { opacity: 0 });
      gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: 'left center' });

      // Gentle entrance: wordmark fades and rises subtly
      entranceTl.to(wordmarkRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power2.out',
      });

      // Location line fades in with delicate restraint
      entranceTl.to(
        locationRef.current,
        {
          opacity: 0.85,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
        },
        '-=0.3'
      );

      // Thin progress track appears
      entranceTl.to(
        progressTrackRef.current,
        {
          opacity: 1,
          duration: 0.35,
          ease: 'power1.out',
        },
        '-=0.2'
      );

      // Smooth progress bar builds anticipation (0% -> 65%)
      entranceTl.to(
        progressBarRef.current,
        {
          scaleX: 0.65,
          duration: 0.4,
          ease: 'power1.inOut',
        },
        '-=0.2'
      );
    }, containerRef);

    const triggerExitSequence = () => {
      if (exitTriggered || !isMounted) return;
      exitTriggered = true;
      clearTimeout(failsafeTimer);

      const exitTl = gsap.timeline({
        onComplete: () => {
          if (isMounted) {
            setIsDismissed(true);
            if (onComplete) onComplete();
          }
        },
      });

      // 1. Complete progress bar swiftly to 100%
      exitTl.to(progressBarRef.current, {
        scaleX: 1,
        duration: 0.22,
        ease: 'power2.inOut',
      });

      // 2. Wordmark & details fade out with subtle upward drift
      exitTl.to(
        [wordmarkRef.current, locationRef.current, progressTrackRef.current],
        {
          opacity: 0,
          y: -8,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power2.in',
        },
        '+=0.04'
      );

      // 3. Cinematic overlay curtain fades away smoothly (600-800ms ease)
      exitTl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.75,
          ease: 'power2.out',
        },
        '-=0.15'
      );
    };

    return () => {
      isMounted = false;
      clearTimeout(failsafeTimer);
      ctx.revert();
    };
  }, [heroImageUrl, onComplete]);

  if (isDismissed) {
    return null;
  }

  return (
    <div
      id="cinematic-entrance-overlay"
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Loading The Elegant Company"
      className="fixed inset-0 z-[9999] bg-[#0c0d0e] flex flex-col items-center justify-center select-none overflow-hidden px-6"
      style={{ willChange: 'opacity' }}
    >
      <div
        ref={contentRef}
        className="flex flex-col items-center justify-center text-center max-w-[480px] w-full"
      >
        {/* Brand Wordmark */}
        <h1
          ref={wordmarkRef}
          className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-[#f8f7f5] uppercase tracking-[0.22em] sm:tracking-[0.26em] m-0 leading-tight"
        >
          THE ELEGANT COMPANY
        </h1>

        {/* Origin / Studio Location */}
        <p
          ref={locationRef}
          className="text-[10px] sm:text-[11px] font-sans font-light text-[#c5a059] uppercase tracking-[0.38em] sm:tracking-[0.45em] mt-3.5 sm:mt-4 m-0"
        >
          CAPE TOWN · SOUTH AFRICA
        </p>

        {/* Thin Horizontal Progress Indicator */}
        <div
          ref={progressTrackRef}
          className="w-36 sm:w-44 h-[1px] bg-stone-800/80 relative overflow-hidden mt-7 sm:mt-8 rounded-full"
        >
          <div
            ref={progressBarRef}
            className="absolute inset-0 bg-[#c5a059] origin-left"
          />
        </div>
      </div>
    </div>
  );
};
