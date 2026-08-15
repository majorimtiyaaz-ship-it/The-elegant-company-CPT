import React from 'react';
import { useLanguage } from './LanguageContext';
import { motion } from 'motion/react';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div 
      id="language-toggle-wrapper"
      className="relative flex items-center bg-stone-950/60 border border-stone-800/80 rounded-full p-1 select-none"
    >
      {/* Sliding Active Background */}
      <div className="absolute inset-y-1 left-1 right-1 pointer-events-none flex">
        <motion.div
          className="h-full w-1/2 bg-elegant-gold rounded-full"
          initial={false}
          animate={{
            x: language === 'en' ? '0%' : '100%',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
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
