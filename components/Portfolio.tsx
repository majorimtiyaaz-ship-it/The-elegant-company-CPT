import React, { useState, useEffect } from 'react';
import { PortfolioItem, View } from '../types';
import { gsap } from 'gsap';
import { TextReveal } from './TextReveal';
import { ScrollZoomImage } from './ScrollZoomImage';
import { RevealOnScroll } from './RevealOnScroll';
import { useLanguage } from './LanguageContext';

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { 
    id: 1, 
    title: "Ebonized Oak Coffee Table", 
    category: "Living Room", 
    imageUrl: "/images/coffee-table-after-2.webp",
    materials: "Solid Oak, Black Stain",
    description: "A bold statement piece featuring ebonized oak with distinct grain patterns and robust joinery.",
    woodFinish: "Satin"
  },
  { 
    id: 2, 
    title: "Ebonized Oak Detail", 
    category: "Living Room", 
    imageUrl: "/images/coffee-table-after.webp",
    materials: "Solid Oak, Black Stain",
    description: "Precision joinery highlighting the structural integrity and clean lines of the design.",
    woodFinish: "Satin"
  },
  { 
    id: 3, 
    title: "Ebonized Oak Profile", 
    category: "Living Room", 
    imageUrl: "/images/coffee-table-after-3.webp",
    materials: "Solid Oak, Black Stain",
    description: "The low profile and substantial legs create a grounded, modern aesthetic.",
    woodFinish: "Satin"
  },
  { 
    id: 4, 
    title: "Piano Black Headboard", 
    category: "Storage", 
    imageUrl: "/images/1770732675622~2.webp",
    materials: "Restored Wood, High Gloss Lacquer",
    description: "A restored classic finished in a deep, reflective black lacquer for a luxurious touch.",
    woodFinish: "High Gloss"
  },
  { 
    id: 5, 
    title: "Piano Black Angle", 
    category: "Storage", 
    imageUrl: "/images/1770732574204.webp",
    materials: "Restored Wood, High Gloss Lacquer",
    description: "The high gloss finish catches the light, emphasizing the curves and craftsmanship.",
    woodFinish: "High Gloss"
  },
  { 
    id: 6, 
    title: "Restoration Project: Table", 
    category: "Restoration", 
    imageUrl: "/images/coffee-table-raw.webp",
    materials: "Raw Oak",
    description: "The journey begins with stripping back years of wear to reveal the beautiful grain underneath.",
    woodFinish: "Raw"
  },
  { 
    id: 7, 
    title: "Restoration Project: Headboard", 
    category: "Restoration", 
    imageUrl: "/images/1770565768335~2.webp",
    materials: "Raw Wood",
    description: "Preparing a vintage piece for a new life with careful sanding and repair.",
    woodFinish: "Raw"
  },
  { 
    id: 8, 
    title: "Bespoke Entryway Bench", 
    category: "Living Room", 
    imageUrl: "/images/1771076250919~2.webp",
    materials: "Solid White Oak",
    description: "A stunning custom entryway bench showcasing minimalist lines and master grain matching.",
    woodFinish: "Natural Satin"
  },
  { 
    id: 9, 
    title: "Artisan Joinery Detail", 
    category: "Living Room", 
    imageUrl: "/images/1771076167909~2.webp",
    materials: "Solid Walnut Accent",
    description: "Close-up perspective exhibiting the perfection of our seamless modern joinery join detail.",
    woodFinish: "Natural Oil"
  },
  { 
    id: 10, 
    title: "Custom Study Workspace", 
    category: "Office", 
    imageUrl: "/images/Lumii_20260110_183904669.webp",
    materials: "Fiddleback Oak & Steel",
    description: "A customized luxury study desk engineered with traditional cabinetmaking methods.",
    woodFinish: "Fine Matte"
  },
  { 
    id: 11, 
    title: "Artisan Bench Profile", 
    category: "Living Room", 
    imageUrl: "/images/Lumii_20260110_183951986.webp",
    materials: "Premium Red Oak",
    description: "Low-angled profile showcasing the hand-sanded curves and structural stability.",
    woodFinish: "Hand-rubbed Poly"
  }
];

const CATEGORIES = ["All", "Living Room", "Dining", "Office", "Storage", "Restoration"];

interface PortfolioProps {
  onNavigate: (view: View, sectionId?: string, prefillData?: { details?: string }) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'All': return t.portfolioFilterAll;
      case 'Living Room': return language === 'en' ? 'LIVING ROOM' : 'LEEFKAMER';
      case 'Dining': return language === 'en' ? 'DINING' : 'EETKAMER';
      case 'Office': return language === 'en' ? 'OFFICE' : 'KANTOOR';
      case 'Storage': return language === 'en' ? 'STORAGE' : 'BERGPLEK';
      case 'Restoration': return language === 'en' ? 'RESTORATION' : 'RESTORASIE';
      default: return cat.toUpperCase();
    }
  };

  const filteredItems = PORTFOLIO_ITEMS.filter(item => {
    return activeCategory === "All" || item.category === activeCategory;
  });

  const handleRequestQuote = (item: PortfolioItem) => {
    const details = `I am interested in a piece similar to the "${item.title}" from your portfolio.\n\nCategory: ${item.category}\nMaterials: ${item.materials}\nFinish: ${item.woodFinish}\n\nAdditional requirements: `;
    onNavigate(View.HOME, 'contact', { details });
  };

  // Premium staggered animation on mount or filter change using a robust native GSAP setup
  useEffect(() => {
    // Reset card states to prepare for a clean, staggered fade-in entrance
    gsap.killTweensOf(".portfolio-card");
    gsap.set(".portfolio-card", { 
      opacity: 0, 
      y: 40,
      scale: 0.98
    });

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const cardsArray = Array.from(document.querySelectorAll(".portfolio-card"));
            const index = cardsArray.indexOf(card);
            
            gsap.to(card, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.0,
              ease: "power2.out",
              overwrite: "auto",
              delay: index !== -1 ? (index % 3) * 0.08 : 0
            });
            observer.unobserve(card);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px"
      });

      const cards = document.querySelectorAll(".portfolio-card");
      cards.forEach(el => observer.observe(el));

      return () => {
        observer.disconnect();
      };
    } else {
      // Direct GSAP staggered animation if IntersectionObserver is unavailable
      gsap.fromTo(".portfolio-card",
        { 
          opacity: 0, 
          y: 35,
          scale: 0.98
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.8, 
          stagger: 0.08, 
          ease: "power2.out",
          overwrite: "auto",
          delay: 0.05
        }
      );
    }
  }, [activeCategory]);


  return (
    <section id="portfolio-collection-section" className="bg-[#faf8f5] py-24 md:py-28 px-6 relative overflow-hidden border-t border-stone-200/60">
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.06),transparent_60%)] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle_at_bottom_left,rgba(197,160,89,0.06),transparent_60%)] pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-14 md:mb-16">
          <RevealOnScroll duration={0.8}>
            <span className="text-[#8c6517] font-semibold tracking-[0.24em] uppercase mb-3 text-xs md:text-sm block">
              {t.portfolioTitle}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 mb-5 leading-tight">
              <TextReveal text={language === 'en' ? "Mastery in Wood" : "Meesterskap in Hout"} />
            </h2>
            <div className="w-16 h-[1.5px] bg-[#c5a059]/40 mx-auto mb-5" />
            <p className="text-stone-600 max-w-2xl mx-auto font-sans font-light text-sm sm:text-base leading-relaxed">
              {t.portfolioSub}
            </p>
          </RevealOnScroll>
          
          <RevealOnScroll duration={1.0} delay={0.15}>
            <div className="flex flex-col items-center gap-6 mt-8">
              {/* Category Filter */}
              <div 
                id="portfolio-category-filters"
                className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2.5 font-sans max-w-4xl p-1.5 bg-stone-200/50 rounded-sm border border-stone-200"
                role="tablist"
                aria-label="Portfolio category filter"
              >
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-4 sm:px-6 py-2.5 min-h-[44px] text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] transition-all duration-300 cursor-pointer rounded-sm flex items-center justify-center
                      ${activeCategory === cat 
                        ? 'bg-stone-900 text-white shadow-sm' 
                        : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/60'
                      }`}
                  >
                    <span>{getCategoryName(cat)}</span>
                  </button>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8 min-h-[400px]">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div 
                key={item.id} 
                id={`portfolio-item-${item.id}`}
                className="portfolio-card group relative overflow-hidden rounded-sm bg-stone-900 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer h-[430px] flex flex-col justify-end border border-stone-200/40 hover:border-[#c5a059]/80"
                onClick={() => handleRequestQuote(item)}
                tabIndex={0}
                role="article"
                aria-label={`${item.title} - ${item.category}`}
                onKeyDown={(e) => e.key === 'Enter' && handleRequestQuote(item)}
              >
                <div className="w-full h-full absolute inset-0 overflow-hidden">
                  <ScrollZoomImage 
                    src={item.imageUrl} 
                    alt={`${item.title} - Bespoke ${item.category} crafted by The Elegant Company`} 
                  />
                </div>
                
                {/* Permanent subtle bottom contrast pill for mobile clarity */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent lg:opacity-0 group-hover:opacity-0 transition-opacity pointer-events-none">
                  <span className="text-[#c5a059] uppercase tracking-[0.2em] text-[10px] font-bold block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-serif text-white font-medium tracking-wide">
                    {item.title}
                  </h3>
                </div>

                {/* Overlay with glassmorphism gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-7 sm:p-8 text-white z-10">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-400 ease-out flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[#c5a059] uppercase tracking-[0.22em] text-[11px] font-bold">
                         {item.category}
                       </span>
                       <span className="text-stone-300 text-xs italic font-medium tracking-wide">
                         {item.woodFinish}
                       </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif mb-2 tracking-wide font-medium text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-stone-300 mb-3 font-light leading-relaxed">
                      {item.description}
                    </p>
                    <div className="text-xs text-[#c5a059] uppercase tracking-wider border-t border-stone-700/80 pt-3 mt-2 mb-5 font-medium">
                      <span className="text-stone-400 text-[10px] block mb-0.5 uppercase tracking-widest font-normal">
                        {language === 'en' ? 'Materials' : 'Materiale'}
                      </span>
                      {item.materials}
                    </div>
                    
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestQuote(item);
                      }}
                      className="min-h-[44px] w-full px-6 py-3 bg-[#c5a059] hover:bg-[#b48f48] text-white uppercase tracking-[0.16em] font-bold text-xs rounded-sm transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>{t.portfolioBtnInquire}</span>
                      <span className="text-base leading-none">&rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center text-stone-500 py-20 bg-stone-100 border border-dashed border-stone-300 rounded-sm">
               <p className="text-xl font-serif italic mb-2 text-stone-800">
                 {language === 'en' ? 'No pieces found' : 'Geen stukke gevind nie'}
               </p>
               <p className="text-sm text-stone-600">
                 {language === 'en' ? 'Try adjusting your filters to see more of our collection.' : 'Pas asseblief u filters aan om meer van ons versameling te sien.'}
               </p>
               <button 
                 onClick={() => { setActiveCategory("All"); }}
                 className="mt-6 px-6 py-2.5 bg-stone-900 text-white font-bold uppercase text-xs tracking-[0.18em] rounded-sm hover:bg-[#c5a059] transition-colors cursor-pointer"
               >
                 {language === 'en' ? 'Clear Filters' : 'Skrap Filters'}
               </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};