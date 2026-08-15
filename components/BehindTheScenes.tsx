import React, { useEffect, useRef } from 'react';
import { Award, Sparkles, Flame, Droplet } from 'lucide-react';
import { View } from '../types';
import { RevealOnScroll } from './RevealOnScroll';
import { useLanguage } from './LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CraftSecret {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
}

const CRAFT_SECRETS: CraftSecret[] = [
  {
    id: 'grain-hydration',
    title: 'Water-Popping Grain Hydration',
    subtitle: 'Extracting Organic Fiber Depth',
    icon: <Droplet size={20} className="text-elegant-gold" />,
    description: 'Prior to staining or oiling, the raw timber is misted with pure micro-filtered water. This lifts the natural wood fibers, opening the cell structure so that our organic oils can saturate twice as deeply into the heartwood.'
  },
  {
    id: 'hand-abrasives',
    title: 'Ultra-Fine Micro Sanding',
    subtitle: 'Traditional 12-Step Graduated Grit',
    icon: <Sparkles size={20} className="text-elegant-gold" />,
    description: 'We reject modern high-speed orbital sanders which tear the timber structure. Instead, our artisans hand-block each curve using 12 successive grits of premium Swiss abrasives up to an ultra-fine 600-grit satin finish.'
  },
  {
    id: 'friction-cure',
    title: 'Friction-Heat Oil Curing',
    subtitle: 'Permanent Protection & High Durability',
    icon: <Flame size={20} className="text-elegant-gold" />,
    description: 'Using natural sheepskin pads, we rub cold-pressed plant oils into the timber at high speeds. The resulting friction heat opens the wood pores, permanently fusing the hardened resins deep within the structural fibers.'
  },
  {
    id: 'beeswax-finish',
    title: 'Organic Beeswax Burnishing',
    subtitle: 'A Heritage Protective Patina',
    icon: <Award size={20} className="text-elegant-gold" />,
    description: 'As a final protective skin, we apply warm organic beeswax from local Western Cape apiaries. This is hand-burnished for hours to achieve a stunning, silk-to-the-touch, low-sheen organic patina that lasts generations.'
  }
];

interface BehindTheScenesProps {
  onNavigate: (view: View, sectionId?: string) => void;
}

export const BehindTheScenes: React.FC<BehindTheScenesProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const glowTopRef = useRef<HTMLDivElement>(null);
  const glowBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // Subtle parallax scrolling for the raw wood background texture
      if (bgImageRef.current) {
        gsap.fromTo(bgImageRef.current,
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }

      // Parallax translation for top-right radial glow
      if (glowTopRef.current) {
        gsap.fromTo(glowTopRef.current,
          { yPercent: -15, xPercent: 5 },
          {
            yPercent: 15,
            xPercent: -5,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }

      // Parallax translation for bottom-left radial glow
      if (glowBottomRef.current) {
        gsap.fromTo(glowBottomRef.current,
          { yPercent: 15, xPercent: -5 },
          {
            yPercent: -15,
            xPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getTranslatedSecrets = () => {
    if (language === 'en') {
      return CRAFT_SECRETS;
    } else {
      return [
        {
          id: 'grain-hydration',
          title: 'Water-Popping Hout-Hydrasie',
          subtitle: 'Onttrekking Van Organiese Veseldiepte',
          icon: CRAFT_SECRETS[0].icon,
          description: 'Voor ons skilder of olie, word die rou hout met suiwer mikro-gefiltreerde water benat. Dit lig die natuurlike houtvesels, wat die selstruktuur oopmaak sodat ons organiese olies twee keer so diep in die kernhout kan binnedring.'
        },
        {
          id: 'hand-abrasives',
          title: 'Ultra-Fyn Skuurproses',
          subtitle: 'Tradisionele 12-Stap Skuurmetode',
          icon: CRAFT_SECRETS[1].icon,
          description: 'Ons verwerp moderne hoëspoed-slypers wat die houtstruktuur skeur. In plaas daarvan skuur ons ambagsmanne elke kurwe met die hand met 12 opeenvolgende skuurstappe met premium Switserse skuurmiddels tot \'n ultra-fyn afwerking.'
        },
        {
          id: 'friction-cure',
          title: 'Wrywing-Hitte Olie-Hardening',
          subtitle: 'Permanente Beskerming & Duursaamheid',
          icon: CRAFT_SECRETS[2].icon,
          description: 'Met behulp van natuurlike skaapvel-kussings vryf ons koudgeparste plantolies teen hoë spoed in die hout in. Die wrywingshitte maak die houtporieë oop, wat die geharde harse permanent diep in die vesels laat saamsmelt.'
        },
        {
          id: 'beeswax-finish',
          title: 'Organiese Byewas-Poleerwerk',
          subtitle: '\'n Erfenis-Beskermende Patina',
          icon: CRAFT_SECRETS[3].icon,
          description: 'As \'n finale beskermende laag wend ons warm organiese byewas van plaaslike Wes-Kaapse bye-boere aan. Dit word ure lank met die hand gepoleer om \'n syagtige, lae-glans natuurlike patina te verkry wat geslagte lank hou.'
        }
      ];
    }
  };

  const secrets = getTranslatedSecrets();

  return (
    <section 
      ref={sectionRef}
      className="bg-[#0c0b0a] text-stone-300 py-24 px-6 relative overflow-hidden border-t border-b border-stone-900"
    >
      {/* Parallax Background Raw Timber Texture */}
      <div className="absolute inset-0 w-full h-[130%] pointer-events-none overflow-hidden top-0 left-0 z-0">
        <img
          ref={bgImageRef}
          src="/images/coffee-table-raw.jpg"
          alt="Bespoke raw timber workshop grain texture"
          className="w-full h-full object-cover opacity-[0.035] mix-blend-luminosity filter brightness-[0.4] contrast-[1.2] select-none"
        />
      </div>

      {/* Visual Depth Accents */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none z-0" />
      <div 
        ref={glowTopRef}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.03),transparent_70%)] pointer-events-none z-0" 
      />
      <div 
        ref={glowBottomRef}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_bottom_left,rgba(197,160,89,0.03),transparent_70%)] pointer-events-none z-0" 
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header Block */}
        <RevealOnScroll duration={1.0}>
          <div className="text-center mb-16">
            <span className="text-elegant-gold font-bold tracking-[0.25em] uppercase mb-3 text-xs md:text-sm block">
              {t.btsTitle}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight tracking-wide">
              {language === 'en' ? 'Behind the Scenes: Tactile Mastery' : 'Agter die Skerms: Taktiele Meesterskap'}
            </h2>
            <div className="w-16 h-[1.5px] bg-elegant-gold/40 mx-auto mt-6" />
            <p className="text-stone-400 font-sans font-light mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
              {t.btsSub}
            </p>
          </div>
        </RevealOnScroll>

        {/* The Four Commandments Grid */}
        <RevealOnScroll duration={1.2} delay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {secrets.map((secret, index) => (
              <div
                key={secret.id}
                className="bg-stone-900/40 border border-stone-800/60 p-6 md:p-8 rounded-sm hover:border-elegant-gold/60 transition-all duration-500 flex flex-col justify-between group relative overflow-hidden h-full"
              >
                {/* Subtle card highlight glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.01),transparent_60%)] pointer-events-none group-hover:bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.04),transparent_60%)] transition-all duration-500" />
                
                <div>
                  {/* Floating Number */}
                  <div className="text-stone-800/45 font-mono text-[10px] uppercase tracking-widest mb-6">
                    {language === 'en' ? 'Commandment' : 'Gebod'} 0{index + 1}
                  </div>

                  {/* Icon Frame */}
                  <div className="w-12 h-12 rounded-sm bg-stone-800/30 border border-stone-700/40 flex items-center justify-center mb-6 text-elegant-gold group-hover:border-elegant-gold/40 group-hover:bg-elegant-gold/5 transition-all duration-500">
                    {secret.icon}
                  </div>

                  {/* Subtitle / Phase */}
                  <span className="text-[10px] uppercase tracking-widest font-semibold block text-elegant-gold mb-1">
                    {secret.subtitle}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-serif text-white mb-4 tracking-wide group-hover:text-elegant-gold transition-colors duration-400">
                    {secret.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-stone-400 font-sans font-light text-xs leading-relaxed mt-4">
                  {secret.description}
                </p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Quick Call to Action Link */}
        <RevealOnScroll duration={1.0} delay={0.3}>
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-stone-800/60 pt-8">
            <span className="text-xs md:text-sm font-serif italic text-stone-400 text-center sm:text-left">
              {language === 'en' ? '"Respecting the natural voice of Western Cape timber."' : '"Respek vir die natuurlike stem van Wes-Kaapse hout."'}
            </span>
            <button
              onClick={() => onNavigate(View.HOME, 'contact')}
              className="text-xs font-bold uppercase tracking-widest text-white hover:text-elegant-gold transition-colors duration-300 cursor-pointer flex items-center gap-1.5 group border border-stone-800/80 px-5 py-3 hover:border-elegant-gold/40 rounded-sm bg-stone-900/20"
            >
              {language === 'en' ? 'Inquire For Custom Build' : 'Doen Navraag vir Pasgemaakte Bou'}
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
