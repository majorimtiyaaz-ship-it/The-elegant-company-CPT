import React, { useEffect, useRef, useState } from 'react';
import { View } from '../types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Preloader } from './Preloader';
import { useLanguage } from './LanguageContext';
import { LanguageToggle } from './LanguageToggle';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onNavigate: (view: View, sectionId?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 1. Navigation Smooth Background Solidify on Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Cinematic GSAP Orchestration & GPU-Accelerated Animations
  useEffect(() => {
    if (!imageLoaded) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Subtle Background Zoom Timeline (12s ease out)
      if (bgImageRef.current && !prefersReducedMotion) {
        gsap.fromTo(bgImageRef.current,
          { scale: 1.03 },
          { 
            scale: 1.00, 
            duration: 12, 
            ease: "power2.out",
            force3D: true
          }
        );

        // Parallax scroll effect on background image
        gsap.to(bgImageRef.current, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }

      // Elegant sequenced entrance timeline
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
      });

      // Staggered reveals
      if (headlineRef.current) {
        tl.fromTo(headlineRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
          "+=0.4"
        );
      }

      if (subheadingRef.current) {
        tl.fromTo(subheadingRef.current,
          { opacity: 0, y: 15 },
          { opacity: 0.85, y: 0, duration: 1.2, ease: "power3.out" },
          "-=0.9"
        );
      }

      if (buttonsRef.current) {
        tl.fromTo(buttonsRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
          "-=0.9"
        );
      }

      if (scrollIndicatorRef.current) {
        tl.fromTo(scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.0, ease: "power2.out" },
          "-=0.6"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [imageLoaded]);

  return (
    <>
      {/* A. PREMIUM VISUAL PRELOADER */}
      {!imageLoaded && (
        <Preloader 
          onComplete={() => setImageLoaded(true)} 
          imageUrl="/images/1770732574204.png" 
        />
      )}

      {/* B. FIXED STICKY NAVIGATION BAR */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'bg-[#0a0a0a]/95 backdrop-blur-md py-4 shadow-lg border-b border-stone-900/30' 
            : 'bg-transparent py-6 border-b border-transparent'
        }`}
      >
        <div className="container mx-auto max-w-7xl px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <div 
            className="flex flex-col items-start select-none cursor-pointer group"
            onClick={() => onNavigate(View.HOME, 'home')}
          >
            <span className="text-xl md:text-2xl tracking-[0.16em] uppercase font-normal text-white font-serif leading-none transition-colors duration-300 group-hover:text-elegant-gold">
              THE ELEGANT
            </span>
            <span className="text-[9px] md:text-[10px] tracking-[0.45em] uppercase font-light text-[#c5a059] font-serif mt-1.5 md:mt-2 transition-colors duration-300 group-hover:text-white">
              COMPANY
            </span>
          </div>

          {/* Menu Links */}
          <nav className="flex items-center gap-4 md:gap-8 font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase">
            <button 
              onClick={() => onNavigate(View.HOME, 'home')}
              className="text-stone-300 hover:text-elegant-gold font-medium transition-colors duration-300 cursor-pointer"
            >
              {t.navHome}
            </button>
            <button 
              onClick={() => onNavigate(View.HOME, 'portfolio')}
              className="text-stone-400 hover:text-elegant-gold font-medium transition-colors duration-300 cursor-pointer"
            >
              {t.navCollection}
            </button>
            <button 
              onClick={() => onNavigate(View.HOME, 'process')}
              className="text-stone-400 hover:text-elegant-gold font-medium transition-colors duration-300 cursor-pointer"
            >
              {t.navProcess}
            </button>

            {/* Language Toggle Component */}
            <LanguageToggle />
          </nav>
        </div>
      </header>

      {/* C. CINEMATIC IMMERSIVE HERO VIEW */}
      <div 
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden select-none bg-black"
        style={{
          opacity: imageLoaded ? 1 : 0,
          transition: "opacity 0.8s ease-out"
        }}
      >
        {/* Full Viewport Background Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img 
            ref={bgImageRef}
            src="/images/1770732574204.png"
            alt="The Elegant Company Luxury Interior Kitchen and Cabinetry"
            className="w-full h-full object-cover pointer-events-none origin-center transform"
          />
        </div>

        {/* Cinematic Refined Overlay Gradient */}
        <div 
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            backgroundImage: `linear-gradient(
              90deg,
              rgba(0,0,0,0.65) 0%,
              rgba(0,0,0,0.40) 35%,
              rgba(0,0,0,0.15) 70%,
              rgba(0,0,0,0.05) 100%
            )`
          }}
        />

        {/* Underlay Vignette Gradient for extra depth and contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(10,10,10,0.3)_10%,rgba(10,10,10,0.85)_90%)] pointer-events-none z-[2] lg:bg-transparent" />

        {/* Centered Left Side Content Container */}
        <div className="absolute inset-0 z-10 flex items-center justify-start px-6 sm:px-12 md:px-20 lg:px-28">
          <div className="max-w-[600px] w-full text-left flex flex-col items-start gap-5 sm:gap-7 pt-12 md:pt-0">
            
            {/* Elegant luxury serif headline */}
            <h1 
              ref={headlineRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-serif text-white leading-[1.1] tracking-wide m-0"
            >
              {t.heroTitle}
            </h1>

            {/* Refined readable subheading */}
            <p 
              ref={subheadingRef}
              className="text-stone-300 font-sans font-light text-xs sm:text-sm md:text-base leading-relaxed tracking-wide max-w-[520px] m-0"
            >
              {t.heroSub}
            </p>

            {/* Premium CTA Buttons Group */}
            <div 
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto mt-4"
            >
              <button
                onClick={() => onNavigate(View.HOME, 'contact')}
                className="px-8 py-3.5 bg-[#c5a059] text-white font-sans font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase rounded-[10px] hover:bg-[#b48f48] active:scale-[0.98] transition-all duration-300 ease-out shadow-[0_4px_20px_rgba(197,160,89,0.15)] hover:shadow-[0_8px_30px_rgba(197,160,89,0.3)] cursor-pointer flex items-center justify-center gap-1.5"
              >
                {t.heroBtnStart}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </button>

              <button
                onClick={() => onNavigate(View.HOME, 'portfolio')}
                className="px-8 py-3.5 bg-transparent text-white border border-white/40 font-sans font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase rounded-[10px] hover:bg-white hover:text-black hover:border-white active:scale-[0.98] transition-all duration-300 ease-out cursor-pointer flex items-center justify-center"
              >
                {t.heroBtnExplore}
              </button>
            </div>

          </div>
        </div>

        {/* D. MINIMAL SCROLL INDICATOR */}
        <div 
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => onNavigate(View.HOME, 'portfolio')}
        >
          <span className="text-[9px] tracking-[0.25em] text-white/50 uppercase font-sans font-light">{t.heroScroll}</span>
          <div className="w-[1px] h-10 bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-4 bg-[#c5a059] animate-[scroll-indicator-line_2.5s_cubic-bezier(0.15,0.85,0.35,1)_infinite]" />
          </div>
        </div>

      </div>

      {/* Styled animation keyframe inject */}
      <style>{`
        @keyframes preloader-shimmer {
          100% {
            transform: translateX(250%);
          }
        }
        @keyframes scroll-indicator-line {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(150%); }
          100% { transform: translateY(150%); }
        }
      `}</style>
    </>
  );
};
