import React, { useEffect, useRef, useState } from 'react';
import { View } from '../types';
import { gsap } from 'gsap';
import { useLanguage } from './LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (view: View, sectionId?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Navigation Smooth Background Solidify on Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // 2. Subtle Cinematic GSAP Entrance Timeline (No ScrollTrigger)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        if (bgImageRef.current) gsap.set(bgImageRef.current, { opacity: 1, scale: 1 });
        if (eyebrowRef.current) gsap.set(eyebrowRef.current, { opacity: 1, y: 0 });
        if (headlineRef.current) gsap.set(headlineRef.current, { opacity: 1, y: 0 });
        if (subheadingRef.current) gsap.set(subheadingRef.current, { opacity: 1, y: 0 });
        if (buttonsRef.current) gsap.set(buttonsRef.current, { opacity: 1, y: 0 });
        return;
      }

      // Restrained sequenced entrance
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" }
      });

      if (bgImageRef.current) {
        tl.fromTo(bgImageRef.current,
          { opacity: 0.96, scale: 1.015 },
          { opacity: 1, scale: 1, duration: 1.8, ease: "power2.out" }
        );
      }

      if (eyebrowRef.current) {
        tl.fromTo(eyebrowRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=1.4"
        );
      }

      if (headlineRef.current) {
        tl.fromTo(headlineRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.85 },
          "-=0.55"
        );
      }

      if (subheadingRef.current) {
        tl.fromTo(subheadingRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.75 },
          "-=0.6"
        );
      }

      if (buttonsRef.current) {
        tl.fromTo(buttonsRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.75 },
          "-=0.6"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigate(View.HOME, sectionId);
  };

  return (
    <>
      {/* FIXED STICKY NAVIGATION BAR (UNCHANGED) */}
      <header 
        id="main-navigation-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-in-out ${
          scrolled 
            ? 'bg-[#0a0a0a]/95 backdrop-blur-md py-3.5 sm:py-4 shadow-xl border-b border-stone-800/60' 
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5 sm:py-6 border-b border-transparent'
        }`}
      >
        <div className="container mx-auto max-w-7xl px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <div 
            id="brand-logo-button"
            className="flex flex-col items-start select-none cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-elegant-gold rounded-sm"
            onClick={() => handleNavClick('home')}
            tabIndex={0}
            role="button"
            aria-label="The Elegant Company - Return to top"
            onKeyDown={(e) => e.key === 'Enter' && handleNavClick('home')}
          >
            <span className="text-lg sm:text-xl md:text-2xl tracking-[0.18em] uppercase font-normal text-white font-serif leading-none transition-colors duration-300 group-hover:text-elegant-gold">
              THE ELEGANT
            </span>
            <span className="text-[10px] md:text-[11px] tracking-[0.45em] uppercase font-light text-[#c5a059] font-serif mt-1.5 transition-colors duration-300 group-hover:text-white">
              COMPANY
            </span>
          </div>

          {/* Desktop Menu Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 font-sans text-[13px] tracking-[0.14em] uppercase font-medium">
            <button 
              id="nav-link-home"
              onClick={() => handleNavClick('home')}
              className="text-stone-200 hover:text-elegant-gold transition-colors duration-300 cursor-pointer py-1.5 relative group"
            >
              <span>{t.navHome}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-elegant-gold group-hover:w-full transition-all duration-300" />
            </button>
            <button 
              id="nav-link-collection"
              onClick={() => handleNavClick('portfolio')}
              className="text-stone-300 hover:text-elegant-gold transition-colors duration-300 cursor-pointer py-1.5 relative group"
            >
              <span>{t.navCollection}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-elegant-gold group-hover:w-full transition-all duration-300" />
            </button>
            <button 
              id="nav-link-process"
              onClick={() => handleNavClick('process')}
              className="text-stone-300 hover:text-elegant-gold transition-colors duration-300 cursor-pointer py-1.5 relative group"
            >
              <span>{t.navProcess}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-elegant-gold group-hover:w-full transition-all duration-300" />
            </button>
            <button 
              id="nav-link-testimonials"
              onClick={() => handleNavClick('testimonials')}
              className="text-stone-300 hover:text-elegant-gold transition-colors duration-300 cursor-pointer py-1.5 relative group"
            >
              <span>{t.navTestimonials}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-elegant-gold group-hover:w-full transition-all duration-300" />
            </button>
            <button 
              id="nav-link-contact"
              onClick={() => handleNavClick('contact')}
              className="text-stone-300 hover:text-elegant-gold transition-colors duration-300 cursor-pointer py-1.5 relative group"
            >
              <span>{t.navContact}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-elegant-gold group-hover:w-full transition-all duration-300" />
            </button>
          </nav>

          {/* Right Action Group: Language Toggle + Contact Button + Mobile Toggle */}
          <div className="flex items-center gap-3.5 sm:gap-5">
            <LanguageToggle />

            <button
              id="header-cta-button"
              onClick={() => handleNavClick('contact')}
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#c5a059] text-white hover:bg-[#b48f48] text-[12px] font-sans font-bold uppercase tracking-[0.16em] rounded-sm transition-all duration-300 active:scale-[0.98] shadow-sm cursor-pointer"
            >
              <span>{language === 'en' ? 'Start a Project' : 'Begin \'n Projek'}</span>
              <ArrowUpRight size={13} className="shrink-0" />
            </button>

            <button
              id="mobile-menu-toggle-button"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-200 hover:text-elegant-gold focus:outline-none focus-visible:ring-1 focus-visible:ring-elegant-gold rounded-sm transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div 
          id="mobile-navigation-drawer"
          className={`lg:hidden absolute inset-x-0 top-full bg-[#0d0c0b]/98 backdrop-blur-xl border-b border-stone-800 transition-all duration-400 ease-in-out overflow-hidden ${
            mobileMenuOpen ? 'max-h-[85vh] opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
          }`}
        >
          <div className="container mx-auto px-8 flex flex-col space-y-4 font-sans text-sm tracking-[0.16em] uppercase overflow-y-auto max-h-[calc(85vh-3rem)]">
            <button 
              onClick={() => handleNavClick('home')}
              className="text-left py-2.5 text-stone-200 hover:text-elegant-gold border-b border-stone-800/60 transition-colors"
            >
              {t.navHome}
            </button>
            <button 
              onClick={() => handleNavClick('portfolio')}
              className="text-left py-2.5 text-stone-200 hover:text-elegant-gold border-b border-stone-800/60 transition-colors"
            >
              {t.navCollection}
            </button>
            <button 
              onClick={() => handleNavClick('process')}
              className="text-left py-2.5 text-stone-200 hover:text-elegant-gold border-b border-stone-800/60 transition-colors"
            >
              {t.navProcess}
            </button>
            <button 
              onClick={() => handleNavClick('testimonials')}
              className="text-left py-2.5 text-stone-200 hover:text-elegant-gold border-b border-stone-800/60 transition-colors"
            >
              {t.navTestimonials}
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              className="text-left py-2.5 text-stone-200 hover:text-elegant-gold border-b border-stone-800/60 transition-colors"
            >
              {t.navContact}
            </button>
            <div className="pt-3">
              <button
                onClick={() => handleNavClick('contact')}
                className="w-full py-3.5 bg-[#c5a059] text-white hover:bg-[#b48f48] text-xs font-bold uppercase tracking-[0.18em] rounded-sm transition-all text-center flex items-center justify-center gap-2"
              >
                <span>{language === 'en' ? 'Start a Project' : 'Begin \'n Projek'}</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* RESTRUCTURED CINEMATIC EDITORIAL HERO */}
      <section 
        id="hero-cinematic-section"
        ref={containerRef}
        className="relative w-full min-h-[100svh] h-[100svh] overflow-hidden select-none bg-[#0a0a0a]"
      >
        {/* Dominant Full-Screen Photography (Focal positioning on architectural cabinetry) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img 
            ref={bgImageRef}
            src="/images/hero-kitchen.webp"
            alt="The Elegant Company Luxury Interior Kitchen and Cabinetry in Cape Town"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-[55%_50%] sm:object-[58%_48%] pointer-events-none transform origin-center"
          />
        </div>

        {/* Soft Header Vignette */}
        <div className="absolute top-0 inset-x-0 h-28 sm:h-32 bg-gradient-to-b from-black/50 via-black/15 to-transparent pointer-events-none z-[2]" />

        {/* Soft Cinematic Lower-Left Radial Gradient (Preserves image clarity & detail everywhere else) */}
        <div 
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: `radial-gradient(
              circle at 7% 93%,
              rgba(0, 0, 0, 0.50) 0%,
              rgba(0, 0, 0, 0.25) 35%,
              rgba(0, 0, 0, 0.0) 70%
            )`
          }}
        />

        {/* Uninterrupted Photography Stage: Content positioned at Lower Left (7vw, 10vh) with Deliberate Vertical Rhythm */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none pb-[9vh] sm:pb-[11vh] pl-[6vw] sm:pl-[7vw] pr-6 md:pr-12">
          <div className="pointer-events-auto max-w-[620px] w-full flex flex-col items-start">
            
            {/* Eyebrow */}
            <div 
              ref={eyebrowRef}
              className="text-[#d6b779] font-sans text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.26em] m-0 mb-4 sm:mb-5"
            >
              CAPE TOWN · BESPOKE STUDIO
            </div>

            {/* Restrained Luxury Editorial Serif Headline */}
            <h1 
              id="hero-main-heading"
              ref={headlineRef}
              className="text-[clamp(44px,4.7vw,68px)] font-serif font-normal text-white leading-[0.94] tracking-tight m-0 mb-5 sm:mb-6 max-w-[600px]"
            >
              Crafted Without<br />Compromise
            </h1>

            {/* Subtle Supporting Text */}
            <p 
              id="hero-main-subheading"
              ref={subheadingRef}
              className="text-stone-300 font-sans font-light text-[15px] sm:text-[16px] leading-[1.5] tracking-wide max-w-[460px] m-0 mb-7 sm:mb-8"
            >
              Bespoke kitchens, custom cabinetry and considered interiors, handcrafted in Cape Town.
            </p>

            {/* CTA Composition: ONE refined gold button + ONE quiet text link */}
            <div 
              ref={buttonsRef}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-7"
            >
              <button
                id="hero-primary-cta"
                onClick={() => onNavigate(View.HOME, 'contact')}
                className="h-[48px] px-8 bg-[#c5a059] text-white font-sans font-semibold text-[12px] sm:text-[13px] tracking-[0.18em] uppercase rounded-sm hover:bg-[#b48f48] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>START A PROJECT</span>
                <ArrowUpRight size={15} className="shrink-0" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => onNavigate(View.HOME, 'portfolio')}
                className="group text-stone-300 hover:text-white font-sans font-medium text-[13px] sm:text-[14px] tracking-[0.14em] uppercase transition-colors duration-300 flex items-center gap-2 cursor-pointer py-2 focus:outline-none"
              >
                <span>Explore our craft</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 text-stone-400 group-hover:text-white">→</span>
              </button>
            </div>

          </div>
        </div>

      </section>
    </>
  );
};

