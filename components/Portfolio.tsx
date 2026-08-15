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
    imageUrl: "/images/coffee-table-after-2.jpg",
    materials: "Solid Oak, Black Stain",
    description: "A bold statement piece featuring ebonized oak with distinct grain patterns and robust joinery.",
    woodFinish: "Satin"
  },
  { 
    id: 2, 
    title: "Ebonized Oak Detail", 
    category: "Living Room", 
    imageUrl: "/images/coffee-table-after.jpg",
    materials: "Solid Oak, Black Stain",
    description: "Precision joinery highlighting the structural integrity and clean lines of the design.",
    woodFinish: "Satin"
  },
  { 
    id: 3, 
    title: "Ebonized Oak Profile", 
    category: "Living Room", 
    imageUrl: "/images/coffee-table-after-3.jpg",
    materials: "Solid Oak, Black Stain",
    description: "The low profile and substantial legs create a grounded, modern aesthetic.",
    woodFinish: "Satin"
  },
  { 
    id: 4, 
    title: "Piano Black Headboard", 
    category: "Storage", 
    imageUrl: "/images/1770732675622~2.png",
    materials: "Restored Wood, High Gloss Lacquer",
    description: "A restored classic finished in a deep, reflective black lacquer for a luxurious touch.",
    woodFinish: "High Gloss"
  },
  { 
    id: 5, 
    title: "Piano Black Angle", 
    category: "Storage", 
    imageUrl: "/images/1770732574204.png",
    materials: "Restored Wood, High Gloss Lacquer",
    description: "The high gloss finish catches the light, emphasizing the curves and craftsmanship.",
    woodFinish: "High Gloss"
  },
  { 
    id: 6, 
    title: "Restoration Project: Table", 
    category: "Restoration", 
    imageUrl: "/images/coffee-table-raw.jpg",
    materials: "Raw Oak",
    description: "The journey begins with stripping back years of wear to reveal the beautiful grain underneath.",
    woodFinish: "Raw"
  },
  { 
    id: 7, 
    title: "Restoration Project: Headboard", 
    category: "Restoration", 
    imageUrl: "/images/1770565768335~2.png",
    materials: "Raw Wood",
    description: "Preparing a vintage piece for a new life with careful sanding and repair.",
    woodFinish: "Raw"
  },
  { 
    id: 8, 
    title: "Bespoke Entryway Bench", 
    category: "Living Room", 
    imageUrl: "/images/1771076250919~2.png",
    materials: "Solid White Oak",
    description: "A stunning custom entryway bench showcasing minimalist lines and master grain matching.",
    woodFinish: "Natural Satin"
  },
  {
    id: 9,
    title: "Artisan Joinery Detail",
    category: "Living Room",
    imageUrl: "/images/1771076167909~2.png",
    materials: "Solid Walnut Accent",
    description: "Close-up perspective exhibiting the perfection of our seamless modern joinery join detail.",
    woodFinish: "Natural Oil"
  },
  {
    id: 10,
    title: "Custom Study Workspace",
    category: "Office",
    imageUrl: "/images/Lumii_20260110_183904669.jpg",
    materials: "Fiddleback Oak & Steel",
    description: "A customized luxury study desk engineered with traditional cabinetmaking methods.",
    woodFinish: "Fine Matte"
  },
  {
    id: 11,
    title: "Artisan Bench Profile",
    category: "Living Room",
    imageUrl: "/images/Lumii_20260110_183951986.jpg",
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
    <div className="bg-white py-24 px-6 relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.03),transparent_60%)] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle_at_bottom_left,rgba(197,160,89,0.03),transparent_60%)] pointer-events-none"></div>

      <div className="container mx-auto">
        <div className="text-center mb-16">
          <RevealOnScroll duration={0.8}>
            <h2 className="text-elegant-gold font-bold tracking-[0.25em] uppercase mb-3 text-xs md:text-sm">
              {t.portfolioTitle}
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif text-elegant-dark mb-6 leading-tight">
              <TextReveal text={language === 'en' ? "Mastery in Wood" : "Meesterskap in Hout"} />
            </h3>
            <p className="text-gray-500 max-w-2xl mx-auto font-sans font-light text-xs sm:text-sm leading-relaxed mb-8">
              {t.portfolioSub}
            </p>
          </RevealOnScroll>
          
          <RevealOnScroll duration={1.0} delay={0.15}>
            <div className="flex flex-col items-center gap-6">
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 font-sans max-w-3xl">
                <span className="text-xs font-serif italic text-gray-400 w-full lg:w-auto text-center lg:text-right pr-2">
                  {language === 'en' ? 'Collection:' : 'Versameling:'}
                </span>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative group px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer overflow-hidden
                      ${activeCategory === cat 
                        ? 'text-elegant-dark font-semibold' 
                        : 'text-gray-400 hover:text-elegant-dark'
                      }`}
                  >
                    <span className="relative z-10">{getCategoryName(cat)}</span>
                    {/* Underline line animation */}
                    <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-elegant-gold transition-transform duration-400 origin-left
                      ${activeCategory === cat 
                        ? 'scale-x-100' 
                        : 'scale-x-0 group-hover:scale-x-100'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="portfolio-card group relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer h-[420px]"
              >
                <div className="w-full h-full overflow-hidden relative">
                  <ScrollZoomImage 
                    src={item.imageUrl} 
                    alt={item.title} 
                  />
                </div>
                
                {/* Overlay with glassmorphism gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 text-white">
                  <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-elegant-gold uppercase tracking-[0.2em] text-[10px] font-black">{item.category}</span>
                       <span className="text-gray-400 text-xs italic font-medium tracking-wide">{item.woodFinish}</span>
                    </div>
                    <h4 className="text-2xl font-serif italic mb-2 tracking-wide font-medium">{item.title}</h4>
                    <p className="text-sm text-gray-300 mb-3 font-light leading-relaxed">{item.description}</p>
                    <p className="text-xs text-elegant-gold uppercase tracking-widest border-t border-white/20 pt-3 mt-3 mb-5 leading-normal">
                      {item.materials}
                    </p>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestQuote(item);
                      }}
                      className="relative group/btn overflow-hidden px-6 py-3 border-2 border-elegant-gold bg-transparent text-white uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer text-xs"
                    >
                      <span className="absolute inset-0 w-full h-full bg-elegant-gold origin-left transform scale-x-100 group-hover/btn:scale-x-0 transition-transform duration-500 ease-out z-0"></span>
                      <span className="relative z-10 text-white group-hover/btn:text-elegant-gold transition-colors duration-300">
                        {t.portfolioBtnInquire}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center text-gray-400 py-20 bg-elegant-gray border border-dashed border-gray-200">
               <p className="text-xl font-serif italic mb-2">
                 {language === 'en' ? 'No pieces found' : 'Geen stukke gevind nie'}
               </p>
               <p className="text-sm">
                 {language === 'en' ? 'Try adjusting your filters to see more of our collection.' : 'Pas asseblief u filters aan om meer van ons versameling te sien.'}
               </p>
               <button 
                 onClick={() => { setActiveCategory("All"); }}
                 className="mt-6 text-elegant-gold font-bold uppercase text-xs tracking-[0.2em] hover:underline cursor-pointer"
               >
                 {language === 'en' ? 'Clear Filters' : 'Skrap Filters'}
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};