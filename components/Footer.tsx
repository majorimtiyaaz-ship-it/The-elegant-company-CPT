import React, { useEffect, useRef } from 'react';
import { Instagram, Facebook } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Target elements to stagger
    const targets = el.querySelectorAll('.footer-animate-item');

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: 25 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        onEnter: () => {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.08,
            ease: "power3.out",
            force3D: true,
          });
        },
        once: true,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={containerRef} className="bg-elegant-dark text-white py-16 px-6 border-t border-gray-800">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        <div className="md:col-span-1">
          <div className="flex flex-col mb-6 select-none">
            <span className="text-xl sm:text-2xl tracking-[0.16em] uppercase font-normal text-white font-serif leading-none">
              THE ELEGANT
            </span>
            <span className="text-[10px] tracking-[0.45em] uppercase font-light text-[#c5a059] font-serif mt-2">
              COMPANY
            </span>
          </div>
          
          <p className="text-gray-400 leading-relaxed mb-6 font-light">
            {language === 'en' 
              ? 'Crafting legacies through solid timber and traditional joinery. We create wooden furniture that tells your story.'
              : 'Ons skep erfenisse deur soliede hout en tradisionele skrynwerk. Ons maak houtmeubels wat u storie vertel.'}
          </p>
          <div className="flex gap-4">
            <a href="#" className="footer-animate-item text-gray-400 hover:text-elegant-gold transition-colors"><Instagram size={20} /></a>
            <a href="#" className="footer-animate-item text-gray-400 hover:text-elegant-gold transition-colors"><Facebook size={20} /></a>
          </div>
        </div>

        <div>
          <ul className="space-y-4 text-gray-400">
            <li className="footer-animate-item">
              <a href="#" className="hover:text-white transition-colors">
                {language === 'en' ? 'Living Room' : 'Sitkamer'}
              </a>
            </li>
            <li className="footer-animate-item">
              <a href="#" className="hover:text-white transition-colors">
                {language === 'en' ? 'Dining Room' : 'Eetkamer'}
              </a>
            </li>
            <li className="footer-animate-item">
              <a href="#" className="hover:text-white transition-colors">
                {language === 'en' ? 'Bedroom' : 'Slaapkamer'}
              </a>
            </li>
            <li className="footer-animate-item">
              <a href="#" className="hover:text-white transition-colors">
                {language === 'en' ? 'Office' : 'Kantoor'}
              </a>
            </li>
            <li className="footer-animate-item">
              <a href="#" className="hover:text-white transition-colors">
                {language === 'en' ? 'Outdoor' : 'Buite-Meubels'}
              </a>
            </li>
          </ul>
        </div>

      </div>
      <div className="container mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} The Elegant Company. {language === 'en' ? 'All rights reserved.' : 'Alle regte voorbehou.'}
      </div>
    </footer>
  );
};
