import React, { useEffect, useRef } from 'react';
import { Award, Sparkles, Flame, Droplet } from 'lucide-react';
import { View } from '../types';
import { RevealOnScroll } from './RevealOnScroll';
import { useLanguage } from './LanguageContext';
import { gsap } from 'gsap';

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
          src="/images/coffee-table-raw.webp"
          alt="Bespoke raw timber workshop grain texture"
          loading="lazy"
          decoding="async"
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
          <div className="text-center mb-14 md:mb-16">
            <span className="text-[#c5a059] font-semibold tracking-[0.24em] uppercase mb-3 text-xs md:text-sm block">
              {t.btsTitle}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white leading-tight tracking-wide mb-5">
              {language === 'en' ? 'Tactile Mastery & Workshop Craft' : 'Taktiele Meesterskap & Werkswinkel-Vakmanskap'}
            </h2>
            <div className="w-16 h-[1.5px] bg-[#c5a059]/50 mx-auto mb-5" />
            <p className="text-stone-300 font-sans font-light max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
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
                className="bg-stone-900/60 border border-stone-800 p-7 rounded-sm hover:border-[#c5a059]/80 transition-all duration-400 flex flex-col justify-between group relative overflow-hidden h-full shadow-lg"
              >
                {/* Subtle card highlight glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.06),transparent_60%)] pointer-events-none group-hover:bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.12),transparent_60%)] transition-all duration-400" />
                
                <div>
                  {/* Floating Number */}
                  <div className="text-[#c5a059]/60 font-sans text-xs uppercase tracking-[0.2em] font-bold mb-5">
                    {language === 'en' ? 'Phase' : 'Fase'} 0{index + 1}
                  </div>

                  {/* Icon Frame */}
                  <div className="w-12 h-12 rounded-sm bg-stone-800/80 border border-stone-700/80 flex items-center justify-center mb-5 text-[#c5a059] group-hover:border-[#c5a059] group-hover:bg-stone-800 transition-all duration-400">
                    {secret.icon}
                  </div>

                  {/* Subtitle / Phase */}
                  <span className="text-[11px] uppercase tracking-[0.18em] font-bold block text-[#c5a059] mb-1.5">
                    {secret.subtitle}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-serif text-white mb-3 tracking-wide group-hover:text-[#c5a059] transition-colors duration-300 font-medium">
                    {secret.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-stone-300 font-sans font-light text-sm leading-relaxed mt-3">
                  {secret.description}
                </p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Quick Call to Action Link */}
        <RevealOnScroll duration={1.0} delay={0.3}>
          <div className="mt-14 md:mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-stone-800 pt-8">
            <span className="text-sm md:text-base font-serif italic text-stone-300 text-center sm:text-left">
              {language === 'en' ? '"Honouring the natural character of Western Cape timber."' : '"Respek vir die natuurlike stem van Wes-Kaapse hout."'}
            </span>
            <button
              onClick={() => onNavigate(View.HOME, 'contact')}
              className="min-h-[44px] text-xs font-bold uppercase tracking-[0.16em] text-white bg-[#c5a059] hover:bg-[#b48f48] transition-all duration-300 cursor-pointer flex items-center gap-2 px-6 py-3 rounded-sm shadow-md active:scale-[0.98]"
            >
              <span>{language === 'en' ? 'Inquire For Custom Build' : 'Doen Navraag vir Pasgemaakte Bou'}</span>
              <span className="text-sm leading-none">&rarr;</span>
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
