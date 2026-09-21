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
    quote: "Good reliable company and a very punctual team with a swift installation time and excellent customer service.",
    author: "Savannah Hurling",
    location: "Cape Town",
    project: "Google Review"
  },
  {
    quote: "Service was outstanding, would recommend The Elegant Company to anyone, fantastic work.",
    author: "Ameen Hernandez",
    location: "Cape Town",
    project: "Google Review"
  },
  {
    quote: "Punctual, informative, not complicated, and great attention to detail. I would recommend you guys to any business. Thanks for your workmanship.",
    author: "Abdul Aliem Anthony",
    location: "Cape Town",
    project: "Google Review"
  }
];

const TESTIMONIALS_AF: Testimonial[] = [
  {
    quote: "Good reliable company and a very punctual team with a swift installation time and excellent customer service.",
    author: "Savannah Hurling",
    location: "Kaapstad",
    project: "Google-resensie"
  },
  {
    quote: "Service was outstanding, would recommend The Elegant Company to anyone, fantastic work.",
    author: "Ameen Hernandez",
    location: "Kaapstad",
    project: "Google-resensie"
  },
  {
    quote: "Punctual, informative, not complicated, and great attention to detail. I would recommend you guys to any business. Thanks for your workmanship.",
    author: "Abdul Aliem Anthony",
    location: "Kaapstad",
    project: "Google-resensie"
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
