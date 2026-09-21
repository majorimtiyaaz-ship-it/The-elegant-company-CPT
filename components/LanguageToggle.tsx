import React, { useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { gsap } from 'gsap';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const indicatorRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!indicatorRef.current) return;
    const xPercent = language === 'en' ? 0 : 100;

    if (isFirstRender.current) {
      // Match the original `initial={false}` behavior: snap to position on mount, no animation
      gsap.set(indicatorRef.current, { xPercent });
      isFirstRender.current = false;
      return;
    }

    gsap.to(indicatorRef.current, {
      xPercent,
      duration: 0.5,
      ease: 'elastic.out(1, 0.75)',
    });
  }, [language]);

  return (
    <div 
      id="language-toggle-wrapper"
      className="relative flex items-center bg-stone-950/60 border border-stone-800/80 rounded-full p-1 select-none"
    >
      {/* Sliding Active Background */}
      <div className="absolute inset-y-1 left-1 right-1 pointer-events-none flex">
        <div
          ref={indicatorRef}
          className="h-full w-1/2 bg-elegant-gold rounded-full"
        />
      </div>

      {/* English Toggle Option */}
      <button
        id="toggle-lang-en"
        type="button"
        onClick={() => setLanguage('en')}
        className={`relative z-10 w-11 py-1 text-[9px] font-sans font-bold tracking-widest text-center transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-elegant-gold rounded-full cursor-pointer ${
          language === 'en' ? 'text-black' : 'text-stone-400 hover:text-stone-100'
        }`}
        aria-label="Switch language to English"
        aria-pressed={language === 'en'}
      >
        EN
      </button>

      {/* Afrikaans Toggle Option */}
      <button
        id="toggle-lang-af"
        type="button"
        onClick={() => setLanguage('af')}
        className={`relative z-10 w-11 py-1 text-[9px] font-sans font-bold tracking-widest text-center transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-elegant-gold rounded-full cursor-pointer ${
          language === 'af' ? 'text-black' : 'text-stone-400 hover:text-stone-100'
        }`}
        aria-label="Skakel taal na Afrikaans"
        aria-pressed={language === 'af'}
      >
        AF
      </button>
    </div>
  );
};
