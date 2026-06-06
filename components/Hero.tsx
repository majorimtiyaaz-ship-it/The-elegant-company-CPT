import React, { useEffect } from 'react';
import { View } from '../types';
import { ArrowRight } from 'lucide-react';
import { ConsultationButton } from './ConsultationButton';

interface HeroProps {
  onNavigate: (view: View, sectionId?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  useEffect(() => {
    const gsap = (window as any).gsap;
    if (!gsap) return;

    // Timeline for hero contents staggered reveal
    const tl = gsap.timeline();

    // Scale down background subtle animation
    gsap.fromTo(".hero-bg-img", 
      { scale: 1.15, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 2, ease: "power2.out" }
    );

    // Content reveals
    tl.fromTo(".hero-animate-logo", 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 
      "+=0.3"
    )
    .fromTo(".hero-animate-subtitle", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 
      "-=0.7"
    )
    .fromTo(".hero-animate-desc", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 
      "-=0.7"
    )
    .fromTo(".hero-animate-cta",
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power3.out" },
      "-=0.6"
    )
    .fromTo(".hero-animate-menu-item", 
      { opacity: 0, y: 15, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 
      "-=0.5"
    );
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="hero-bg-img absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop")', opacity: 0 }}
      >
        {/* Base darkening */}
        <div className="absolute inset-0 bg-black/45"></div>
        
        {/* Warm ambient glow from top right */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.35),transparent_60%)] mix-blend-overlay"></div>
        
        {/* Deep shadow from bottom left for contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(26,26,26,0.9),transparent_60%)]"></div>

        {/* Subtle overall warm tint and vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-elegant-dark/30 via-transparent to-elegant-dark/90"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        {/* Logo */}
        <div className="hero-animate-logo cursor-pointer mb-8 cursor-pointer" onClick={() => onNavigate(View.HOME, 'home')} style={{ opacity: 0 }}>
          <div className="flex flex-col leading-none font-serif text-white">
             <span className="text-2xl md:text-4xl tracking-[0.1em] uppercase mb-1">The Elegant</span>
             <span className="text-sm md:text-lg tracking-[0.2em] uppercase font-light text-elegant-gold">Company</span>
          </div>
        </div>

        <h2 className="hero-animate-subtitle text-elegant-gold tracking-[0.25em] uppercase text-xs md:text-sm font-bold mb-4" style={{ opacity: 0 }}>
          Bespoke Craftsmanship
        </h2>
        <p className="hero-animate-desc text-gray-200 text-sm md:text-base max-w-xl mb-10 font-light leading-relaxed text-center" style={{ opacity: 0 }}>
          We blend traditional master artistry with elegant innovations to create custom heritage pieces tailored exclusively to your standard.
        </p>

        {/* Premium Consultation CTA Button */}
        <div className="hero-animate-cta mb-12" style={{ opacity: 0 }}>
          <ConsultationButton 
            variant="gold"
            size="normal"
            onClick={() => onNavigate(View.HOME, 'contact')}
          />
        </div>
        
        {/* Centered Premium Navigation Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center items-center mt-8 text-xs md:text-sm uppercase tracking-[0.25em] font-medium max-w-2xl mx-auto px-4">
          <button 
            onClick={() => onNavigate(View.HOME, 'home')}
            className="hero-animate-menu-item relative group text-stone-300 hover:text-elegant-gold transition-colors duration-300 cursor-pointer py-1"
            style={{ opacity: 0 }}
          >
            Home
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-[1.5px] bg-elegant-gold group-hover:w-3/4 transition-all duration-300 ease-out"></span>
          </button>
          
          <span className="hero-animate-menu-item text-stone-700 select-none" style={{ opacity: 0 }}>/</span>
          
          <button 
            onClick={() => onNavigate(View.HOME, 'portfolio')}
            className="hero-animate-menu-item relative group text-stone-300 hover:text-elegant-gold transition-colors duration-300 cursor-pointer py-1"
            style={{ opacity: 0 }}
          >
            Collection
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-[1.5px] bg-elegant-gold group-hover:w-3/4 transition-all duration-300 ease-out"></span>
          </button>
          
          <span className="hero-animate-menu-item text-stone-700 select-none" style={{ opacity: 0 }}>/</span>
          
          <button 
            onClick={() => onNavigate(View.DESIGN_STUDIO)}
            className="hero-animate-menu-item relative group text-white hover:text-elegant-gold transition-colors duration-300 cursor-pointer py-1 font-bold"
            style={{ opacity: 0 }}
          >
            AI Design Studio
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-[1.5px] bg-elegant-gold group-hover:w-3/4 transition-all duration-300 ease-out"></span>
          </button>
          
          <span className="hero-animate-menu-item text-stone-700 select-none" style={{ opacity: 0 }}>/</span>
          
          <button 
            onClick={() => onNavigate(View.HOME, 'contact')}
            className="hero-animate-menu-item relative group text-stone-300 hover:text-elegant-gold transition-colors duration-300 cursor-pointer py-1"
            style={{ opacity: 0 }}
          >
            Contact
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-[1.5px] bg-elegant-gold group-hover:w-3/4 transition-all duration-300 ease-out"></span>
          </button>
        </div>
      </div>
    </div>
  );
};