import React from 'react';
import { Quote, Star } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';
import { TextReveal } from './TextReveal';
import { useLanguage } from './LanguageContext';

interface Testimonial {
  quote: string;
  author: string;
  location: string;
  project: string;
}

const TESTIMONIALS_EN: Testimonial[] = [
  {
    quote: "The Elegant Company engineered a bespoke 10-seater Solid Oak Dining Table for our dining hall. The continuous grain matching across the entire top is masterly. It has become our home's absolute focal point.",
    author: "Eleanor Vance",
    location: "Constantia, Cape Town",
    project: "Solid Oak Dining Suite"
  },
  {
    quote: "I commissioned a custom white oak entryway bench with seamless modern joints. The precision, the smooth hand-rubbed satin seal, and the quick professional delivery were exceptional. Absolute elite craftsmanship.",
    author: "Richard Holloway",
    location: "Camps Bay, Cape Town",
    project: "Bespoke Entryway Bench"
  },
  {
    quote: "Our family antique credenza was structurally splitting. Their restoration team stripping the weathered coatings and rebuilding the interlocking joints has saved a centennial piece. Sublime attention to history.",
    author: "Sophia de Wet",
    location: "Franschhoek, Winelands",
    project: "Restoration Project"
  }
];

const TESTIMONIALS_AF: Testimonial[] = [
  {
    quote: "The Elegant Company het 'n unieke 10-sitplek soliede eikehout-eetkamertafel vir ons eetsaal gebou. Die aaneenlopende greep-passing oor die hele blad is meesterlik. Dit het ons huis se absolute middelpunt geword.",
    author: "Eleanor Vance",
    location: "Constantia, Kaapstad",
    project: "Soliede Eikehout-Eetkamerstel"
  },
  {
    quote: "Ek het 'n pasgemaakte wit-eikehout bankie vir die ingangsportaal met naatlose moderne verbindings bestel. Die presisie, die gladde handvryf satyn-afwerking, en die vinnige professionele aflewering was uitstekend. Absolute elite vakmanskap.",
    author: "Richard Holloway",
    location: "Kampsbaai, Kaapstad",
    project: "Pasgemaakte Ingangsbankie"
  },
  {
    quote: "Ons familie se antieke kredens was besig om struktureel te skeur. Hul restourasiespan het die verweerde lae afgestroop en die penverbindings herstel om hierdie honderdjarige meubelstuk te red. Ongelooflike historiese akkuraatheid.",
    author: "Sophia de Wet",
    location: "Franschhoek, Wynlande",
    project: "Restorasie-Projek"
  }
];

export const Testimonials: React.FC = () => {
  const { language, t } = useLanguage();
  const list = language === 'en' ? TESTIMONIALS_EN : TESTIMONIALS_AF;

  return (
    <div className="bg-white py-28 px-6 border-t border-gray-100 relative overflow-hidden">
      {/* Visual slide accents */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_bottom_right,rgba(197,160,89,0.02),transparent_60%)] pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <RevealOnScroll duration={0.8}>
            <span className="text-elegant-gold font-bold tracking-[0.25em] uppercase mb-4 text-xs md:text-sm block">
              {t.testiTitle}
            </span>
            <h3 className="text-4xl md:text-5xl font-serif text-elegant-dark leading-tight">
              <TextReveal text={language === 'en' ? "Words of Appreciation" : "Woorde van Waardering"} />
            </h3>
          </RevealOnScroll>
        </div>

        {/* Testimonials Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {list.map((tItem, index) => (
            <RevealOnScroll 
              key={index} 
              duration={1.0} 
              delay={0.12 * index}
              className="bg-elegant-gray p-8 rounded-sm shadow-sm hover:shadow-md border border-stone-100/80 hover:border-elegant-gold/45 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <Quote size={32} className="text-elegant-gold/30 mb-6" />
                
                {/* Visual stars rating */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-elegant-gold text-elegant-gold" />
                  ))}
                </div>

                <p className="text-gray-600 text-sm md:text-base leading-relaxed font-light italic mb-8">
                  "{tItem.quote}"
                </p>
              </div>

              <div className="border-t border-gray-200/50 pt-5 mt-auto">
                <h4 className="font-serif text-md text-elegant-dark font-semibold tracking-wide">
                  {tItem.author}
                </h4>
                <div className="flex items-center justify-between text-[10px] tracking-wider uppercase font-sans text-gray-400 mt-1">
                  <span>{tItem.location}</span>
                  <span className="text-elegant-gold/80 font-bold">{tItem.project}</span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </div>
  );
};
