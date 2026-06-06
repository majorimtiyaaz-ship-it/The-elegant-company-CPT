import React, { useState, useEffect, useRef } from 'react';
import { View } from './types';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Process } from './components/Process';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';

function App() {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [contactPrefill, setContactPrefill] = useState<{ details?: string }>({});
  const lenisRef = useRef<any>(null);

  // SEO: Dynamically update the document title based on the current view
  useEffect(() => {
    switch (currentView) {
      case View.PORTFOLIO:
         document.title = "Collection | The Elegant Company";
         break;
      case View.CONTACT:
         document.title = "Contact Us | The Elegant Company";
         break;
      case View.HOME:
      default:
        document.title = "The Elegant Company | Bespoke Solid Wood Furniture";
    }
  }, [currentView]);

  // Butter Smooth Scroll with Lenis & GSAP ScrollTrigger Integration
  useEffect(() => {
    const LenisClass = (window as any).Lenis;
    if (!LenisClass) return;

    // Instantiate Lenis
    const lenisInstance = new LenisClass({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo inertia
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      infinite: false,
    });

    lenisRef.current = lenisInstance;

    // Standard requestAnimationFrame loop for Lenis
    let rafId: number;
    function raf(time: number) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Sync GSAP and ScrollTrigger with Lenis
    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // On Lenis scroll, update ScrollTrigger
      lenisInstance.on('scroll', () => {
        ScrollTrigger.update();
      });

      // Clear existing triggers to prevent double registers on view updates
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());

      // Let GSAP know about Lenis scroll position
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value: number) {
          if (arguments.length) {
            lenisInstance.scrollTo(value, { immediate: true });
          }
          return lenisInstance.scroll;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: document.body.style.transform ? "transform" : "fixed"
      });

      // Recalculate ScrollTrigger on refresh
      ScrollTrigger.addEventListener("refresh", () => lenisInstance.resize());
      ScrollTrigger.refresh();
      
      // Setup dynamic scroll-triggered reveals using a reliable IntersectionObserver + GSAP
      setTimeout(() => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        
        // Setup initial invisible state
        revealElements.forEach((el) => {
          gsap.set(el, { opacity: 0, y: 40 });
        });

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 1.1,
                ease: "power2.out",
                overwrite: "auto"
              });
              observer.unobserve(el);
            }
          });
        }, {
          threshold: 0.05,
          rootMargin: "0px 0px -20px 0px"
        });

        revealElements.forEach((el) => observer.observe(el));
      }, 200);
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance.destroy();
      lenisRef.current = null;
    };
  }, [currentView]);

  const handleNavigate = (view: View, sectionId?: string, prefillData?: { details?: string }) => {
    if (prefillData) {
      setContactPrefill(prefillData);
    }
    
    if (currentView !== view) {
      setCurrentView(view);
      // Wait for view mount state, then scroll beautifully with Lenis inertia
      if (sectionId) {
        setTimeout(() => {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(`#${sectionId}`, { duration: 1.5, offset: -80 });
          } else {
            const element = document.getElementById(sectionId);
            element?.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } else {
        setTimeout(() => {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { duration: 1.2 });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      // Same view, scroll using Lenis or native fallback
      if (sectionId) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(`#${sectionId}`, { duration: 1.5, offset: -80 });
        } else {
          const element = document.getElementById(sectionId);
          element?.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
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
            <div id="contact" className="scroll-mt-20">
              <Contact prefillData={contactPrefill} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-white">
      <CustomCursor />
      <Navigation currentView={currentView} onNavigate={handleNavigate} />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
}

export default App;