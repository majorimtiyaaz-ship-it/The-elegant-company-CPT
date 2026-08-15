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
    <section id="testimonials-reviews-section" className="bg-white py-24 md:py-28 px-6 border-t border-stone-200/60 relative overflow-hidden">
      {/* Visual slide accents */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_bottom_right,rgba(197,160,89,0.05),transparent_60%)] pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-16">
          <RevealOnScroll duration={0.8}>
            <span className="text-[#8c6517] font-semibold tracking-[0.24em] uppercase mb-3 text-xs md:text-sm block">
              {t.testiTitle}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 leading-tight mb-5">
              <TextReveal text={language === 'en' ? "Client Testimonials & Trust" : "Kliëntegetuienisse & Vertroue"} />
            </h2>
            <div className="w-16 h-[1.5px] bg-[#c5a059]/40 mx-auto" />
          </RevealOnScroll>
        </div>

        {/* Testimonials Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-8">
          {list.map((tItem, index) => (
            <RevealOnScroll 
              key={index} 
              duration={0.8} 
              delay={0.08 * index}
              className="bg-[#faf8f5] p-7 sm:p-8 rounded-sm shadow-sm hover:shadow-xl border border-stone-200 hover:border-[#c5a059] transition-all duration-400 flex flex-col justify-between"
            >
              <div>
                <Quote size={28} className="text-[#c5a059]/50 mb-5" />
                
                {/* Visual stars rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#c5a059] text-[#c5a059]" />
                  ))}
                </div>

                <p className="text-stone-700 text-sm sm:text-[15px] leading-relaxed font-light italic mb-6">
                  "{tItem.quote}"
                </p>
              </div>

              <div className="border-t border-stone-200/80 pt-4 mt-auto">
                <h3 className="font-serif text-base text-stone-900 font-semibold tracking-wide">
                  {tItem.author}
                </h3>
                <div className="flex items-center justify-between text-xs tracking-wider uppercase font-sans text-stone-500 mt-1">
                  <span>{tItem.location}</span>
                  <span className="text-[#8c6517] font-bold">{tItem.project}</span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
};
