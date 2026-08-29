import React, { useState, useEffect, useRef } from 'react';
import { PortfolioItem, View } from '../types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextReveal } from './TextReveal';
import { ScrollZoomImage } from './ScrollZoomImage';
import { RevealOnScroll } from './RevealOnScroll';
import { useLanguage } from './LanguageContext';
import { X, Layers, Sparkles, ShieldCheck, ArrowRight, Eye, CheckCircle2, Sliders } from 'lucide-react';

// Ensure ScrollTrigger is registered
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { 
    id: 1, 
    title: "Ebonized Oak Coffee Table", 
    category: "Living Room", 
    imageUrl: "/images/coffee-table-after-2.webp",
    materials: "Solid American White Oak, Black Organic Stain",
    description: "A bold statement piece featuring ebonized oak with distinct organic grain patterns and robust joinery.",
    woodSpecies: "Solid American White Oak (Quercus alba)",
    woodFinish: "Ebonized Deep Black Stain & Micro-Crystalline Wax",
    finishType: "Low-Sheen Hand-Rubbed Satin (15% Sheen)",
    constructionDetails: "Traditional mortise-and-tenon apron joinery, pegged bridle leg connections, book-matched top slab with relief chamfered under-bevels.",
    careGuide: "Wipe clean with a lint-free damp cotton cloth. Recondition with solvent-free organic beeswax balm once annually."
  },
  { 
    id: 2, 
    title: "Ebonized Oak Detail", 
    category: "Living Room", 
    imageUrl: "/images/coffee-table-after.webp",
    materials: "Solid Select-Grade Oak, Deep Iron Acetate Ebonizing",
    description: "Precision joinery highlighting the structural integrity and clean architectural lines of the design.",
    woodSpecies: "Select-Grade Quarter-Sawn White Oak",
    woodFinish: "Iron-Acetate Chemical Ebonizing & Matte Hardwax Oil",
    finishType: "Dead-Matte Organic Oil (5% Sheen)",
    constructionDetails: "Precision 45-degree mitred corner joint with internal domino stabilization and seamless grain transition.",
    careGuide: "Avoid abrasive sponges or chemical solvents. Clean with pH-neutral timber soap."
  },
  { 
    id: 3, 
    title: "Ebonized Oak Profile", 
    category: "Living Room", 
    imageUrl: "/images/coffee-table-after-3.webp",
    materials: "Solid Oak, Dual-Coat Satin Sealant",
    description: "The low profile and substantial legs create a grounded, contemporary gallery aesthetic.",
    woodSpecies: "Solid Quarter-Sawn White Oak",
    woodFinish: "Ebonized Charcoal Stain with Protective Poly-Wax Topcoat",
    finishType: "Silky Satin Touch (20% Sheen)",
    constructionDetails: "Substantial 75mm monolithic solid oak stanchion legs, hand-eased radius edges with expansion breadboard ends.",
    careGuide: "Dust dry with microfiber cloth. Keep protected from continuous scorching direct sunlight."
  },
  { 
    id: 4, 
    title: "Piano Black Headboard", 
    category: "Storage", 
    imageUrl: "/images/1770732675622~2.webp",
    materials: "Restored Vintage Timber, High Gloss Mirror Lacquer",
    description: "A restored classic finished in a deep, reflective black lacquer for a striking luxurious bedroom focal point.",
    woodSpecies: "Restored Solid Hardwood & Stabilized Core",
    woodFinish: "Multi-Layer Piano Mirror Gloss Lacquer (12 Hand-Polished Coats)",
    finishType: "Ultra-High Gloss Mirror Reflection (90%+ Sheen)",
    constructionDetails: "Multi-stage wet sanding graduated from 800 to 3000 grit, final rotary machine buffed with jeweller's rouge.",
    careGuide: "Polish with dedicated optical microfiber and non-static mist. Avoid solvent or alcohol-based cleaners."
  },
  { 
    id: 5, 
    title: "Piano Black Angle", 
    category: "Storage", 
    imageUrl: "/images/1770732574204.webp",
    materials: "Restored Hardwood, High Gloss Lacquer",
    description: "The high gloss finish catches the ambient light, emphasizing the architectural curves and master craftsmanship.",
    woodSpecies: "Restored Vintage Solid Walnut & Birch Core",
    woodFinish: "High-Reflective Obsidian Black Polyurethane Lacquer",
    finishType: "Showroom Piano Gloss (95% Sheen)",
    constructionDetails: "Hand-contoured curved crown profile with heavy-duty French cleat concealed mounting brackets.",
    careGuide: "Feather dust weekly; gently buff out fingerprints with soft cotton buffing cloth."
  },
  { 
    id: 6, 
    title: "Restoration Project: Table", 
    category: "Restoration", 
    imageUrl: "/images/coffee-table-raw.webp",
    materials: "Century-Old Raw Heritage Oak",
    description: "The journey begins with stripping back years of wear to reveal the exceptional natural grain underneath.",
    woodSpecies: "Century-Old Heritage Solid European Oak",
    woodFinish: "Raw Sanded Timber / Pre-Treatment Ready for Custom Staining",
    finishType: "Bare Untreated Heartwood (0% Sheen)",
    constructionDetails: "100% stripped of oxidized historic varnish, water-popped grain hydration, structural joint tightening.",
    careGuide: "Ready for custom bespoke finish application (natural oil, smoked oak, ebonized black, or custom tints)."
  },
  { 
    id: 7, 
    title: "Restoration Project: Headboard", 
    category: "Restoration", 
    imageUrl: "/images/1770565768335~2.webp",
    materials: "Vintage Raw Mahogany & Teak",
    description: "Preparing a vintage piece for a second lifetime with meticulous hand sanding, joint tightening, and repair.",
    woodSpecies: "Vintage Solid Mahogany & Teak Accents",
    woodFinish: "Raw Hand-Scraped & 400-Grit Micro Sanded",
    finishType: "Bare Untreated Heartwood (Ready for Staining)",
    constructionDetails: "Historic dovetail joinery structural stabilization, brass butterfly stitch reinforcement over natural drying checks.",
    careGuide: "Custom finish will be tailored to client specifications during consultation."
  },
  { 
    id: 8, 
    title: "Bespoke Entryway Bench", 
    category: "Living Room", 
    imageUrl: "/images/1771076250919~2.webp",
    materials: "Solid White Oak, Natural Matte Hardwax",
    description: "A custom entryway bench showcasing minimalist architectural lines and master grain matching.",
    woodSpecies: "Solid North American White Oak",
    woodFinish: "Zero-VOC Natural Matte Hardwax Penetrating Oil",
    finishType: "Ultra-Fine Tactile Satin (10% Sheen)",
    constructionDetails: "Exposed through-tenon Japanese-inspired joinery, waterfall edge grain flow with concealed tension fasteners.",
    careGuide: "Clean with natural pH-neutral wood soap; re-apply botanical maintenance oil every 2-3 years."
  },
  { 
    id: 9, 
    title: "Artisan Joinery Detail", 
    category: "Living Room", 
    imageUrl: "/images/1771076167909~2.webp",
    materials: "Solid American Walnut & White Oak Inlays",
    description: "Close-up perspective exhibiting the perfection of our seamless modern joinery join detail and grain harmony.",
    woodSpecies: "Premium Black Walnut (Juglans nigra) & White Oak Inlays",
    woodFinish: "Cold-Pressed Organic Linseed & Tung Oil Emulsion",
    finishType: "Deep-Penetrating Natural Oil (Satin Sheen)",
    constructionDetails: "Hand-cut sliding dovetail joint with contrasting grain lock detail and flush micro-radius easing.",
    careGuide: "Feed with natural plant oil wax twice a year to preserve warm golden undertones."
  },
  { 
    id: 10, 
    title: "Custom Study Workspace", 
    category: "Office", 
    imageUrl: "/images/Lumii_20260110_183904669.webp",
    materials: "Fiddleback Oak & Hot-Rolled Steel",
    description: "A customized luxury study desk engineered with traditional cabinetmaking methods and integrated wire management.",
    woodSpecies: "Fiddleback English Oak & Hot-Rolled Architectural Steel",
    woodFinish: "Micro-Beaded Fine Matte Protective Polyurethane",
    finishType: "Industrial Grade Anti-Scratch Matte (10% Sheen)",
    constructionDetails: "Floating solid slab desktop with internal wire management channel and welded steel base with brass levelers.",
    careGuide: "Wipe with damp cloth; heat and moisture resistant up to 70°C."
  },
  { 
    id: 11, 
    title: "Artisan Bench Profile", 
    category: "Living Room", 
    imageUrl: "/images/Lumii_20260110_183951986.webp",
    materials: "Sustainably Harvested Red Oak, Hand-Rubbed Poly",
    description: "Low-angled profile showcasing the hand-sanded ergonomic curves and remarkable structural stability.",
    woodSpecies: "Sustainably Harvested Premium Red Oak",
    woodFinish: "Hand-Rubbed Poly-Wax Protective Coating",
    finishType: "Smooth Satin Touch (15% Sheen)",
    constructionDetails: "Ergonomically contoured seat transitions, pegged bridal joints with chamfered feet and acoustic felt pads.",
    careGuide: "Polish periodically with pure carnauba or beeswax paste."
  }
];

const CATEGORIES = ["All", "Living Room", "Dining", "Office", "Storage", "Restoration"];

interface PortfolioProps {
  onNavigate: (view: View, sectionId?: string, prefillData?: { details?: string }) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  
  const sectionRef = useRef<HTMLElement>(null);
  const bgParallaxImgRef = useRef<HTMLImageElement>(null);
  const ambientAccentsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
    const details = `I am interested in a piece similar to the "${item.title}" from your portfolio.\n\nCategory: ${item.category}\nWood Species: ${item.woodSpecies || item.materials}\nFinish: ${item.woodFinish || item.materials}\nFinish Type: ${item.finishType || 'Standard'}\n\nAdditional requirements: `;
    setSelectedItem(null);
    onNavigate(View.HOME, 'contact', { details });
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    if (selectedItem) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedItem]);

  // Modal entrance animation
  useEffect(() => {
    if (selectedItem && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.95, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    }
  }, [selectedItem]);

  // Scroll-Triggered Parallax Effect using GSAP ScrollTrigger
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax background timber grain translation
      if (bgParallaxImgRef.current) {
        gsap.fromTo(
          bgParallaxImgRef.current,
          { 
            yPercent: -14,
            scale: 1.08
          },
          { 
            yPercent: 14,
            scale: 1.0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.0, // Smooth inertia scrub
              invalidateOnRefresh: true,
            }
          }
        );
      }

      // Parallax ambient atmospheric lighting shifts
      if (ambientAccentsRef.current) {
        gsap.fromTo(
          ambientAccentsRef.current,
          { y: -50 },
          { 
            y: 50,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.4,
            }
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // Staggered animation on mount or filter change
  useEffect(() => {
    gsap.fromTo(".portfolio-card",
      { 
        opacity: 0.85, 
        y: 12
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.04, 
        ease: "power2.out",
        overwrite: "auto"
      }
    );
  }, [activeCategory]);


  return (
    <section 
      ref={sectionRef}
      id="portfolio-collection-section" 
      className="bg-[#faf8f5] py-24 md:py-28 px-6 relative overflow-hidden border-t border-stone-200/60"
    >
      {/* GSAP Scroll-Triggered Parallax Background Image */}
      <div className="absolute inset-0 w-full h-[135%] -top-[18%] pointer-events-none overflow-hidden select-none z-0">
        <img
          ref={bgParallaxImgRef}
          src="/images/coffee-table-raw.webp"
          alt=""
          role="presentation"
          aria-hidden="true"
          decoding="async"
          className="w-full h-full object-cover opacity-[0.045] mix-blend-luminosity filter contrast-[1.25] brightness-[0.95] pointer-events-none transform origin-center will-change-transform"
        />
        {/* Soft edge gradients for seamless canvas integration */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#faf8f5] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#faf8f5] to-transparent pointer-events-none" />
      </div>

      {/* Visual background accents with parallax */}
      <div ref={ambientAccentsRef} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.06),transparent_60%)]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle_at_bottom_left,rgba(197,160,89,0.06),transparent_60%)]"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
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
                onClick={() => setSelectedItem(item)}
                tabIndex={0}
                role="button"
                aria-label={`${item.title} - ${item.category}. Click to view wood types and finishes`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedItem(item);
                  }
                }}
              >
                <div className="w-full h-full absolute inset-0 overflow-hidden">
                  <ScrollZoomImage 
                    src={item.imageUrl} 
                    alt={`${item.title} - Bespoke ${item.category} crafted by The Elegant Company`} 
                  />
                </div>
                
                {/* Visual indicator badge top right */}
                <div className="absolute top-4 right-4 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-sans font-medium tracking-wide">
                    <Eye size={12} className="text-[#c5a059]" />
                    <span>{language === 'en' ? 'Specs' : 'Spesifikasies'}</span>
                  </span>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 sm:p-7 text-white z-10">
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 ease-out flex flex-col">
                    <div className="flex justify-between items-center mb-1.5">
                       <span className="text-[#c5a059] uppercase tracking-[0.22em] text-[11px] font-bold">
                         {item.category}
                       </span>
                       <span className="text-stone-300 text-xs italic font-medium tracking-wide">
                         {item.woodFinish}
                       </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif mb-1.5 tracking-wide font-medium text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 mb-3 font-light leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="text-xs text-[#c5a059] uppercase tracking-wider border-t border-stone-700/80 pt-2.5 mt-1 mb-4 font-medium">
                      <span className="text-stone-400 text-[10px] block mb-0.5 uppercase tracking-widest font-normal">
                        {language === 'en' ? 'Wood Species' : 'Houtspesie'}
                      </span>
                      <span className="text-stone-200 text-xs truncate block font-serif">
                        {item.woodSpecies || item.materials}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                        className="min-h-[42px] px-3 py-2.5 bg-stone-800/90 hover:bg-stone-700 text-white uppercase tracking-[0.14em] font-bold text-[11px] rounded-sm transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-1.5 border border-stone-600/70"
                      >
                        <Sliders size={13} className="text-[#c5a059]" />
                        <span>{language === 'en' ? 'View Specs' : 'Sien Spesifikasies'}</span>
                      </button>

                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRequestQuote(item);
                        }}
                        className="min-h-[42px] px-3 py-2.5 bg-[#c5a059] hover:bg-[#b48f48] text-white uppercase tracking-[0.14em] font-bold text-[11px] rounded-sm transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-1 shadow-sm"
                      >
                        <span>{language === 'en' ? 'Inquire' : 'Navraag'}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
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

      {/* WOOD TYPES & FINISHES MODAL POPUP */}
      {selectedItem && (
        <div 
          id="portfolio-item-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-piece-title"
        >
          <div 
            ref={modalRef}
            id="portfolio-item-modal-card"
            className="relative w-full max-w-4xl bg-stone-950 text-white rounded-sm border border-stone-800 shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              id="modal-close-button"
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
              {/* Left Column: Piece Image */}
              <div className="lg:col-span-5 relative bg-stone-900 min-h-[280px] lg:min-h-full overflow-hidden flex items-center justify-center">
                <img 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.title}
                  className="w-full h-full object-cover max-h-[380px] lg:max-h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent lg:hidden" />
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="inline-block px-3 py-1 bg-[#c5a059] text-stone-950 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xs shadow-sm">
                    {selectedItem.category}
                  </span>
                </div>
              </div>

              {/* Right Column: Wood Types & Finish Specifications */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#c5a059] text-xs uppercase tracking-[0.24em] font-semibold">
                      {language === 'en' ? 'Craftsmanship Specifications' : 'Vakmanskap Spesifikasies'}
                    </span>
                  </div>

                  <h3 id="modal-piece-title" className="text-2xl sm:text-3xl font-serif text-white mb-2 leading-tight">
                    {selectedItem.title}
                  </h3>

                  <p className="text-stone-300 font-sans text-sm font-light leading-relaxed mb-6">
                    {selectedItem.description}
                  </p>

                  {/* Specifications Grid */}
                  <div className="space-y-4 pt-2 border-t border-stone-800/80">
                    
                    {/* Wood Species */}
                    <div className="bg-stone-900/70 p-3.5 rounded-sm border border-stone-800/60 flex items-start gap-3.5">
                      <div className="p-2 rounded-xs bg-[#c5a059]/10 text-[#c5a059] shrink-0 mt-0.5">
                        <Layers size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#c5a059] block mb-0.5">
                          {language === 'en' ? 'Wood Species & Grade' : 'Houtspesie & Graad'}
                        </span>
                        <p className="text-sm font-serif font-medium text-white">
                          {selectedItem.woodSpecies || selectedItem.materials}
                        </p>
                      </div>
                    </div>

                    {/* Finish & Sheen */}
                    <div className="bg-stone-900/70 p-3.5 rounded-sm border border-stone-800/60 flex items-start gap-3.5">
                      <div className="p-2 rounded-xs bg-[#c5a059]/10 text-[#c5a059] shrink-0 mt-0.5">
                        <Sparkles size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#c5a059] block mb-0.5">
                          {language === 'en' ? 'Artisan Finish & Sheen' : 'Vakmanskap Afwerking & Glans'}
                        </span>
                        <p className="text-sm text-stone-200">
                          {selectedItem.woodFinish || selectedItem.materials}
                        </p>
                        {selectedItem.finishType && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-stone-400 font-mono">
                            <CheckCircle2 size={11} className="text-[#c5a059]" />
                            {selectedItem.finishType}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Joinery & Construction */}
                    {selectedItem.constructionDetails && (
                      <div className="bg-stone-900/70 p-3.5 rounded-sm border border-stone-800/60 flex items-start gap-3.5">
                        <div className="p-2 rounded-xs bg-[#c5a059]/10 text-[#c5a059] shrink-0 mt-0.5">
                          <ShieldCheck size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#c5a059] block mb-0.5">
                            {language === 'en' ? 'Joinery & Construction' : 'Laswerk & Konstruksie'}
                          </span>
                          <p className="text-xs text-stone-300 leading-relaxed font-light">
                            {selectedItem.constructionDetails}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Care & Maintenance */}
                    {selectedItem.careGuide && (
                      <div className="bg-stone-900/40 p-3 rounded-sm border border-stone-800/40 text-stone-400 text-xs font-light">
                        <span className="text-stone-300 font-medium block mb-0.5">
                          {language === 'en' ? 'Maintenance Advice:' : 'Instandhoudingsadvies:'}
                        </span>
                        {selectedItem.careGuide}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleRequestQuote(selectedItem)}
                    className="w-full sm:flex-1 py-3 px-5 bg-[#c5a059] hover:bg-[#b48f48] text-stone-950 font-bold uppercase tracking-[0.16em] text-xs rounded-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>{language === 'en' ? 'Inquire With This Timber' : 'Doen Navraag Met Hierdie Hout'}</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="w-full sm:w-auto py-3 px-5 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/80 font-bold uppercase tracking-[0.14em] text-xs rounded-sm transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'Close' : 'Maak Toe'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};