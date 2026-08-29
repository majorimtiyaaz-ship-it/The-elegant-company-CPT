import React, { useState, useEffect, useRef } from 'react';
import { View } from './types';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Process } from './components/Process';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { SEO } from './components/SEO';
import { CinematicLoader } from './components/CinematicLoader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { motion, useScroll, useSpring } from 'motion/react';

// Register GSAP ScrollTrigger plugin safely once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Code-split VoiceAssistant to reduce initial JavaScript execution on first paint
const VoiceAssistant = React.lazy(() => 
  import('./components/VoiceAssistant').then(module => ({ default: module.VoiceAssistant }))
);

function App() {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [contactPrefill, setContactPrefill] = useState<{ details?: string }>({});
  const lenisRef = useRef<any>(null);

  // Set up scroll progress tracking using Framer Motion
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001
  });

  const [activeSection, setActiveSection] = useState<'home' | 'portfolio' | 'contact'>('home');

  // Sync activeSection with currentView and scroll detection
  useEffect(() => {
    if (currentView === View.PORTFOLIO) {
      setActiveSection('portfolio');
    } else if (currentView === View.CONTACT) {
      setActiveSection('contact');
    }
  }, [currentView]);

  // Dynamic Scroll Section Tracker for Premium Real-Time SEO Tag Updates
  useEffect(() => {
    const sections = ['home', 'portfolio', 'contact'];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id as 'home' | 'portfolio' | 'contact');
          }
        },
        {
          rootMargin: '-30% 0px -30% 0px', // Trigger when section occupies the middle of the viewport
        }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach(item => {
        if (item) {
          item.observer.unobserve(item.el);
        }
      });
    };
  }, []);

  // Butter Smooth Scroll with Lenis & GSAP ScrollTrigger Integration
  useEffect(() => {
    // Instantiate Native Lenis
    const lenisInstance = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo inertia
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenisInstance;

    // Standard requestAnimationFrame loop for Lenis
    let rafId: number;
    function raf(time: number) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // On Lenis scroll, update ScrollTrigger
    lenisInstance.on('scroll', () => {
      ScrollTrigger.update();
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance.destroy();
      lenisRef.current = null;
    };
  }, [currentView]);

  // Premium Scroll-Triggered Section Fade-In/Out Transitions
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const sections = ['home', 'portfolio', 'finishes', 'behind-the-scenes', 'process', 'testimonials', 'contact'];
    
    const ctx = gsap.context(() => {
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        // Soft physical connection: fade & scale slightly as they enter/leave active focus area
        gsap.fromTo(el,
          { opacity: 0.82, scale: 0.99 },
          {
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 95%", // starts entering from bottom
              end: "top 15%",   // fully visible
              toggleActions: "play reverse play reverse",
              scrub: 0.6,       // luxurious physical scrub
            }
          }
        );
      });
    });

    return () => {
      ctx.revert();
    };
  }, [currentView]);

  const handleNavigate = (view: View, sectionId?: string, prefillData?: { details?: string }) => {
    if (prefillData) {
      setContactPrefill(prefillData);
    }

    if (sectionId) {
      if (['home', 'portfolio', 'contact'].includes(sectionId)) {
        setActiveSection(sectionId as 'home' | 'portfolio' | 'contact');
      }
    } else {
      if (view === View.PORTFOLIO) {
        setActiveSection('portfolio');
      } else if (view === View.CONTACT) {
        setActiveSection('contact');
      } else {
        setActiveSection('home');
      }
    }

    // Cinematic fade-out of main container to soften navigation jump
    const mainEl = document.querySelector('main');
    if (mainEl) {
      gsap.to(mainEl, { opacity: 0.35, duration: 0.25, ease: "power1.inOut" });
    }

    const performScrollAndFadeIn = () => {
      const completeTransition = () => {
        // Fade the container back in with luxury ease
        if (mainEl) {
          gsap.to(mainEl, { opacity: 1, duration: 0.6, ease: "power2.out" });
        }
        // Subtly highlight and draw focus to destination section with dynamic scale
        if (sectionId) {
          const destSection = document.getElementById(sectionId);
          if (destSection) {
            gsap.fromTo(destSection,
              { scale: 0.985, filter: "brightness(1.04)" },
              { scale: 1, filter: "brightness(1)", duration: 0.8, ease: "power2.out" }
            );
          }
        }
      };

      if (sectionId) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(`#${sectionId}`, { 
            duration: 1.4, 
            offset: -80,
            onComplete: completeTransition
          });
        } else {
          const element = document.getElementById(sectionId);
          element?.scrollIntoView({ behavior: 'smooth' });
          setTimeout(completeTransition, 300);
        }
      } else {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { 
            duration: 1.1,
            onComplete: completeTransition
          });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(completeTransition, 200);
        }
      }
    };
    
    if (currentView !== view) {
      setCurrentView(view);
      setTimeout(performScrollAndFadeIn, 150);
    } else {
      performScrollAndFadeIn();
    }
  };

  const renderView = () => {
    switch (currentView) {
      case View.HOME:
      default:
        return (
          <>
            <div id="home" className="scroll-mt-0">
              <Hero onNavigate={handleNavigate} />
            </div>
            <div id="portfolio" className="scroll-mt-20">
              <Portfolio onNavigate={handleNavigate} />
            </div>
            <div id="process" className="scroll-mt-20">
              <Process />
            </div>
            <div id="testimonials" className="scroll-mt-20">
              <Testimonials />
            </div>
            <div id="contact" className="scroll-mt-20">
              <Contact prefillData={contactPrefill} />
            </div>
          </>
        );
    }
  };

  // Define dynamic SEO meta properties based on user location & section
  const getSEOProps = () => {
    switch (activeSection) {
      case 'portfolio':
        return {
          title: "Bespoke Furniture Collection | The Elegant Company Cape Town",
          description: "Browse our showcase of premium custom built-in cupboards, luxury kitchens, bedroom cabinets, wardrobes, and handcrafted wood creations across Cape Town.",
          keywords: "custom furniture collection Cape Town, bespoke kitchens portfolio, custom wardrobes Cape Town, built in cupboards Cape Town",
          canonical: "/#portfolio",
          showSchema: false
        };
      case 'contact':
        return {
          title: "Contact Us & Get a Free Quotation | The Elegant Company Cape Town",
          description: "Contact The Elegant Company in Cape Town for bespoke furniture design, luxury kitchen installations, or to get a free custom cupboards quotation today.",
          keywords: "contact custom furniture Cape Town, kitchen installation quote Cape Town, built in cupboards quotation Cape Town, free carpentry consultation",
          canonical: "/#contact",
          showSchema: false
        };
      case 'home':
      default:
        return {
          title: "The Elegant Company | Custom Furniture & Kitchen Installations Cape Town",
          description: "The Elegant Company designs and installs custom furniture, built-in cupboards, kitchens, wardrobes, bedroom cabinets, TV units, and home improvement solutions across Cape Town. Get a free quotation today.",
          keywords: "custom furniture Cape Town, kitchen installations Cape Town, built in cupboards Cape Town, bespoke furniture Cape Town, bedroom cupboards Cape Town, TV units Cape Town, wardrobes Cape Town, cabinet makers Cape Town, home improvement Cape Town, custom kitchens Cape Town, furniture restoration Cape Town",
          canonical: "/",
          showSchema: true
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-white">
      <SEO {...getSEOProps()} />
      {/* Refined Branded Cinematic Loading & Entrance Overlay */}
      <CinematicLoader />
      {/* Dynamic Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-elegant-gold z-[9999] origin-left"
        style={{ scaleX }}
      />
      <CustomCursor />
      <React.Suspense fallback={null}>
        <VoiceAssistant />
      </React.Suspense>
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
}

export default App;