import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
  imageUrl: string;
}

const CRAFT_PHASES = [
  { threshold: 0, text: 'SELECTING WESTERN CAPE TIMBER...' },
  { threshold: 20, text: 'OPENING FIBER CELL STRUCTURE...' },
  { threshold: 45, text: '12-STEP GRADUATED HAND SANDING...' },
  { threshold: 70, text: 'FRICTION-HEAT OIL CURING...' },
  { threshold: 90, text: 'ORGANIC BEESWAX BURNISHING...' },
  { threshold: 100, text: 'READY' }
];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, imageUrl }) => {
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState(CRAFT_PHASES[0].text);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLSpanElement>(null);
  const logoSubTextRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const monogramRingRef = useRef<HTMLDivElement>(null);
  const initialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentProgress = 0;
    let imageLoaded = false;
    let animationFrameId: number;

    // Lock page scroll on mount to prevent scrolling during preload screen
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Preload the image in background
    const img = new Image();
    img.src = imageUrl;
    
    const handleImageLoad = () => {
      imageLoaded = true;
    };

    const handleImageError = () => {
      imageLoaded = true; // Bypassing to ensure site remains functional in case of asset failures
      console.warn('Failed to load hero background image in preloader. Bypassing preloader lock.');
    };

    if (img.complete) {
      imageLoaded = true;
    } else {
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
    }

    const startTime = performance.now();
    const duration = 2200; // Force a minimum 2.2s loading window for premium visual impact

    const updateLoading = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const timePercent = Math.min(elapsed / duration, 1);

      // We interpolate the progress based on time, but if the image isn't loaded yet,
      // we cap the progress at 88% until the image load is complete.
      let targetProgress = Math.floor(timePercent * 100);
      if (!imageLoaded && targetProgress > 88) {
        targetProgress = 88;
      }

      if (targetProgress > currentProgress) {
        currentProgress = targetProgress;
        setProgress(currentProgress);

        // Update the craft status text based on current percentage
        const activePhase = [...CRAFT_PHASES]
          .reverse()
          .find((phase) => currentProgress >= phase.threshold);
        
        if (activePhase) {
          setPhaseText(activePhase.text);
        }
      }

      if (currentProgress < 100 || !imageLoaded) {
        animationFrameId = requestAnimationFrame(updateLoading);
      } else {
        // We reached 100% and image is loaded! Initiate elegant transition out.
        triggerExitTransition();
      }
    };

    animationFrameId = requestAnimationFrame(updateLoading);

    // GSAP entrance of the preloader elements
    const ctx = gsap.context(() => {
      if (monogramRingRef.current) {
        gsap.fromTo(monogramRingRef.current,
          { opacity: 0, scale: 0.85, rotate: -15 },
          { opacity: 1, scale: 1, rotate: 0, duration: 1.6, ease: 'power4.out' }
        );
      }
      if (initialsRef.current) {
        gsap.fromTo(initialsRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.8, ease: 'power3.out', delay: 0.2 }
        );
      }
      gsap.fromTo(logoTextRef.current, 
        { opacity: 0, y: 25, letterSpacing: '0.1em' },
        { opacity: 1, y: 0, letterSpacing: '0.25em', duration: 1.4, ease: 'power3.out', delay: 0.3 }
      );
      gsap.fromTo(logoSubTextRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.5 }
      );
      gsap.fromTo([percentageRef.current, statusRef.current],
        { opacity: 0 },
        { opacity: 0.6, duration: 1.0, ease: 'power2.out', delay: 0.8 }
      );
    }, containerRef);

    const triggerExitTransition = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Restore body scrolling upon complete fadeout
          document.body.style.overflow = originalOverflow;
          onComplete();
        }
      });

      // Animate out items
      tl.to([monogramRingRef.current, initialsRef.current], {
        opacity: 0,
        scale: 0.9,
        y: -15,
        duration: 0.8,
        ease: 'power3.inOut'
      });

      tl.to([logoTextRef.current, logoSubTextRef.current], {
        opacity: 0,
        y: -15,
        duration: 0.8,
        ease: 'power3.inOut'
      }, '-=0.7');

      tl.to([percentageRef.current, statusRef.current, progressBarRef.current], {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut'
      }, '-=0.6');

      // Elegant full preloader slide-up or fade-out
      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut'
      }, '-=0.4');
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
      ctx.revert();
      document.body.style.overflow = originalOverflow;
    };
  }, [imageUrl, onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-[#0a0a0a] z-[9999] flex flex-col justify-between p-8 sm:p-12 md:p-16 select-none"
    >
      {/* Decorative top bar */}
      <div className="flex items-center justify-between text-[9px] tracking-[0.3em] uppercase text-stone-500 font-sans">
        <span>THE ELEGANT COMPANY</span>
        <span>CAPE TOWN, ZA</span>
      </div>

      {/* Centered luxury brand monogram/logo with initials */}
      <div className="flex flex-col items-center gap-6">
        {/* Monogram circle with brand initials "T E C" */}
        <div 
          ref={monogramRingRef}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#c5a059]/30 flex items-center justify-center bg-[#0d0c0b] shadow-[0_0_40px_rgba(197,160,89,0.04)] overflow-hidden"
        >
          {/* Dashed concentric rotating outline */}
          <div className="absolute inset-[3px] rounded-full border border-dashed border-[#c5a059]/15 animate-[spin_120s_linear_infinite]" />
          <div className="absolute inset-[6px] rounded-full border border-[#c5a059]/10" />
          
          {/* Golden color shading ambient light */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#c5a059]/0 via-[#c5a059]/5 to-transparent pointer-events-none" />
          
          <div 
            ref={initialsRef}
            className="relative z-10 flex items-center justify-center pl-1 sm:pl-1.5"
          >
            <span className="text-xl sm:text-2xl font-serif tracking-[0.3em] font-light text-white leading-none">
              TEC
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span 
            ref={logoTextRef}
            className="text-2xl sm:text-3xl md:text-4xl tracking-[0.25em] uppercase font-normal text-white font-serif leading-none"
          >
            THE ELEGANT
          </span>
          <span 
            ref={logoSubTextRef}
            className="text-[9px] sm:text-[10px] tracking-[0.5em] uppercase font-light text-[#c5a059] font-serif mt-3"
          >
            COMPANY
          </span>
        </div>
      </div>

      {/* Bottom details & progress tracking */}
      <div className="flex flex-col gap-4 relative">
        <div className="flex items-end justify-between font-sans text-[10px] tracking-[0.2em] uppercase">
          {/* Dynamically updating status reflecting timber craft */}
          <span 
            ref={statusRef} 
            className="text-stone-400 font-light flex items-center gap-2 h-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-ping" />
            {phaseText}
          </span>
          
          {/* Rolling percentage digits */}
          <span 
            ref={percentageRef} 
            className="text-white font-medium"
          >
            {progress.toString().padStart(3, '0')}%
          </span>
        </div>

        {/* Minimal progress line */}
        <div className="w-full h-[1px] bg-stone-900 relative overflow-hidden">
          <div 
            ref={progressBarRef}
            className="absolute inset-y-0 left-0 bg-[#c5a059] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
