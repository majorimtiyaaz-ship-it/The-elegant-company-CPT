import React, { useState, useEffect, useRef } from 'react';
import { View } from './types';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { DesignStudio } from './components/DesignStudio';
import { Process } from './components/Process';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { CustomCursor } from './components/CustomCursor';

function App() {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [contactPrefill, setContactPrefill] = useState<{ details?: string }>({});
  const lenisRef = useRef<any>(null);

  // SEO: Dynamically update the document title based on the current view
  useEffect(() => {
    switch (currentView) {
      case View.DESIGN_STUDIO:
        document.title = "AI Design Studio | The Elegant Company";
        break;
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
      case View.DESIGN_STUDIO:
        return <DesignStudio />;
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
            {/* Teaser for AI Studio */}
            <div id="about" className="bg-elegant-dark text-white py-24 px-6 text-center scroll-mt-20 relative overflow-hidden reveal-on-scroll">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.15),transparent_70%)]"></div>
              <div className="relative z-10 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">Imagine the Impossible</h2>
                <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg leading-relaxed font-light">
                  Use our state-of-the-art AI Design Studio to visualize custom furniture tailored to your exact specifications before our master craftsmen build it.
                </p>
                <button 
                  onClick={() => handleNavigate(View.DESIGN_STUDIO)}
                  className="relative group overflow-hidden px-12 py-5 border border-elegant-gold bg-transparent text-elegant-gold hover:text-white uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer text-sm"
                >
                  <span className="absolute inset-0 w-full h-full bg-elegant-gold origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-0"></span>
                  <span className="relative z-10">Try Design Studio</span>
                </button>
              </div>
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
      <Chatbot />
    </div>
  );
}

export default App;