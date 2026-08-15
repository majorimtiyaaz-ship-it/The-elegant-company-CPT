import React, { useEffect, useRef } from 'react';
import { Instagram, Facebook } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    <footer id="app-footer" ref={containerRef} className="bg-stone-950 text-white py-16 md:py-20 px-6 border-t border-stone-800">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
        
        <div className="md:col-span-6 lg:col-span-5">
          <div className="flex flex-col mb-5 select-none">
            <span className="text-xl sm:text-2xl tracking-[0.16em] uppercase font-normal text-white font-serif leading-none">
              THE ELEGANT
            </span>
            <span className="text-[10px] tracking-[0.45em] uppercase font-light text-[#c5a059] font-serif mt-1.5">
              COMPANY
            </span>
          </div>
          
          <p className="text-stone-400 leading-relaxed mb-6 font-light text-sm sm:text-base max-w-md">
            {language === 'en' 
              ? 'Bespoke furniture and custom installations crafted with integrity in Cape Town, South Africa. Designed for architectural harmony and generations of use.'
              : 'Pasgemaakte meubels en installasies gebou met integriteit in Kaapstad, Suid-Afrika. Ontwerp vir argitektoniese harmonie en geslagte se gebruik.'}
          </p>
          <div className="flex gap-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="Instagram"
              className="footer-animate-item w-10 h-10 rounded-sm bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-[#c5a059] hover:border-[#c5a059] transition-all"
            >
              <Instagram size={18} />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="Facebook"
              className="footer-animate-item w-10 h-10 rounded-sm bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-[#c5a059] hover:border-[#c5a059] transition-all"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>

        <div className="md:col-span-3 lg:col-span-3">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#c5a059] mb-5">
            {language === 'en' ? 'Craft Specialties' : 'Vakmanskap-Spesialiteite'}
          </h4>
          <ul className="space-y-3 text-stone-400 text-sm">
            <li className="footer-animate-item">
              <span className="hover:text-white transition-colors">
                {language === 'en' ? 'Built-in Cupboards & Closets' : 'Ingeboude Kaste & Klerekaste'}
              </span>
            </li>
            <li className="footer-animate-item">
              <span className="hover:text-white transition-colors">
                {language === 'en' ? 'Custom Kitchens' : 'Pasgemaakte Kombuise'}
              </span>
            </li>
            <li className="footer-animate-item">
              <span className="hover:text-white transition-colors">
                {language === 'en' ? 'Solid Dining Tables' : 'Soliede Eettafels'}
              </span>
            </li>
            <li className="footer-animate-item">
              <span className="hover:text-white transition-colors">
                {language === 'en' ? 'Custom Wooden Benches' : 'Pasgemaakte Houtbankies'}
              </span>
            </li>
            <li className="footer-animate-item">
              <span className="hover:text-white transition-colors">
                {language === 'en' ? 'Heritage Wood Restoration' : 'Erfenis-Houtrestorasie'}
              </span>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3 lg:col-span-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#c5a059] mb-5">
            {language === 'en' ? 'Cape Town Studio' : 'Kaapstad Ateljee'}
          </h4>
          <p className="text-stone-400 text-sm leading-relaxed mb-3">
            Whitehall Close, Portland<br />Cape Town, 7785<br />Western Cape, South Africa
          </p>
          <p className="text-xs text-stone-500 font-mono mt-4">
            Mon – Fri: 08:00 – 17:00<br />Sat: By Site Appointment
          </p>
        </div>

      </div>
      <div className="container mx-auto max-w-7xl mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-xs">
        <p>&copy; {new Date().getFullYear()} The Elegant Company. {language === 'en' ? 'All rights reserved.' : 'Alle regte voorbehou.'}</p>
        <p className="text-stone-500 font-light">
          {language === 'en' ? 'Bespoke Furniture & Kitchen Installations · Cape Town' : 'Pasgemaakte Meubels & Kombuisinstallasies · Kaapstad'}
        </p>
      </div>
    </footer>
  );
};
