import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Layers, 
  Hammer, 
  Truck, 
  Ruler, 
  Sparkles, 
  Layout, 
  Compass,
  FileText,
  ShieldCheck, 
  Coins,
  MapPin,
  Flame,
  XCircle,
  Clock
} from 'lucide-react';

interface ProcessStep {
  id: number;
  num: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

const CUSTOM_FURNITURE_STEPS: ProcessStep[] = [
  {
    id: 1,
    num: "01",
    title: "Virtual Consultation & Quote",
    subtitle: "Share Your Vision We respond within 24 hours",
    description: "Submit details through our digital form or speak with our design consultant Aria. We clarify dimensions, wood species, and establish budget guidelines completely free of charge.",
    icon: <MessageSquare size={24} className="text-elegant-gold" />
  },
  {
    id: 2,
    num: "02",
    title: "Bespoke Design & Rendering",
    subtitle: "See Your Future Masterpiece",
    description: "Our design team produces beautiful realistic renderings and detailed concepts of your bespoke piece. Choose your favorite wood grains and profiles, and obtain an itemized workshop quotation.",
    icon: <Sparkles size={24} className="text-elegant-gold" />
  },
  {
    id: 3,
    num: "03",
    title: "Optional Cape Town Site Visit",
    subtitle: "R500 Premium Laser Evaluation",
    description: "If needed, our carpenters visit your space in Cape Town to log sub-millimeter measurements and analyze custom layout conditions. A basic call-out fee of R500 applies.",
    icon: <Ruler size={24} className="text-elegant-gold" />
  },
  {
    id: 4,
    num: "04",
    title: "Premium Wood Selection",
    subtitle: "Eco-Sourced Noble Hardwoods",
    description: "Touch and select premium planks from our range (Walnut, Oak, Cherry, Ash, or Teak). We align natural continuous grains, prepping them for handrubbed finishes (Natural Oil, Matte, Satin or High Gloss).",
    icon: <Layers size={24} className="text-elegant-gold" />
  },
  {
    id: 5,
    num: "05",
    title: "Master Handcrafting",
    subtitle: "Heritage Wood Joinery",
    description: "Artisans shape your timber directly in our Cape Town facility. We use durable mortise-and-tenon and dovetail joinery (never standard cheap metal screws) to build a family heirloom that lasts.",
    icon: <Hammer size={24} className="text-elegant-gold" />
  },
  {
    id: 6,
    num: "06",
    title: "White-Glove Delivery & Installation",
    subtitle: "Final Touch of Premium Craft",
    description: "We carefully wrap and transport your bespoke piece or custom bench. Our dedicated experts handle setup, precise levelling, and a final surface polish right inside your home.",
    icon: <Truck size={24} className="text-elegant-gold" />
  }
];

const RESTORATION_STEPS: ProcessStep[] = [
  {
    id: 1,
    num: "01",
    title: "Digital Photographic Appraisal",
    subtitle: "Free Initial Structural Diagnosis",
    description: "Send clear images of your weathered or broken wooden furniture. Our master restorers analyze timber fractures, joinery splits, and original varnishes online for free.",
    icon: <FileText size={24} className="text-elegant-gold" />
  },
  {
    id: 2,
    num: "02",
    title: "On-Site Cape Town Collection",
    subtitle: "Pickup Logistics & R500 Fee",
    description: "For deep restoration, we transport safety blankets to your door. Our heavy lifting team carries the piece from Cape Town premises to our workshop (standard call-out fee of R500 applies).",
    icon: <Compass size={24} className="text-elegant-gold" />
  },
  {
    id: 3,
    num: "03",
    title: "Expert Coating Stripping",
    subtitle: "Safe Removal of Old Solvents",
    description: "We strip away oxidized layers of wax, industrial varnishes, or flaking paint using non-corrosive chemical solutions. We gentle hand-sand along the natural grain line.",
    icon: <Layers size={24} className="text-elegant-gold" />
  },
  {
    id: 4,
    num: "04",
    title: "Structural Glue-ups & Timber Fixes",
    subtitle: "Period-Correct Reconstruction",
    description: "We disassemble fractured peg joints, apply traditional animal-hide or premium timber glues, and patch damaged voids using matching vintage timber fibers.",
    icon: <Hammer size={24} className="text-elegant-gold" />
  },
  {
    id: 5,
    num: "05",
    title: "Patina Refinishing",
    subtitle: "Polishing to Historic Standard",
    description: "We preserve your antique's natural timber patina, rubbing with hand-rubbed Natural oils or applying brilliant high-gloss lacquers matching its birth era.",
    icon: <Sparkles size={24} className="text-elegant-gold" />
  },
  {
    id: 6,
    num: "06",
    title: "Return Handover & Legacy Guide",
    subtitle: "Restored for Another Century",
    description: "We return the pristine piece with a specialist care manual to maintain moisture, ensuring its survival for multiple future generations.",
    icon: <Truck size={24} className="text-elegant-gold" />
  }
];

const INSTALLATION_STEPS: ProcessStep[] = [
  {
    id: 1,
    num: "01",
    title: "Cape Town Laser Mapping Visit",
    subtitle: "Site Audit & R500 Call-out Fee",
    description: "Our fitting lead visits your Cape Town site to scan wall plumb-lines, skirting offsets, and utility pipelines. This essential onsite blueprint scan costs R500.",
    icon: <Ruler size={24} className="text-elegant-gold" />
  },
  {
    id: 2,
    num: "02",
    title: "Wood & Hardware Sourcing",
    subtitle: "Selecting Your Architectural Finish",
    description: "Select durable oak veneers or rich painted solid wood. We coordinate hardware components, utilizing heavy-duty soft-close European cabinet systems.",
    icon: <Layers size={24} className="text-elegant-gold" />
  },
  {
    id: 3,
    num: "03",
    title: "Millimeter Offsite Carpentry",
    subtitle: "Dust-Free Workshop Pre-Build",
    description: "We cut, join, and prime cabinet boxes off-site in our specialized Cape Town facility, minimizing sawdust dispersion and disruption at your household.",
    icon: <Hammer size={24} className="text-elegant-gold" />
  },
  {
    id: 4,
    num: "04",
    title: "Surgical Onsite Anchorage",
    subtitle: "Clean Fitted Cabinets",
    description: "Our elite carpentry crew delivers, anchors, and aligns every drawer face, creating a flawless built-in cabinetry system flush with your walls.",
    icon: <ShieldCheck size={24} className="text-elegant-gold" />
  }
];

type ProjectType = 'custom' | 'restoration' | 'builtins';

export const Process: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProjectType>('custom');

  const getActiveSteps = (): ProcessStep[] => {
    switch (activeTab) {
      case 'restoration':
        return RESTORATION_STEPS;
      case 'builtins':
        return INSTALLATION_STEPS;
      case 'custom':
      default:
        return CUSTOM_FURNITURE_STEPS;
    }
  };

  // Run premium GSAP reveal animation whenever the active tab switches
  useEffect(() => {
    const gsap = (window as any).gsap;
    if (!gsap) return;

    gsap.killTweensOf(".process-step-premium-card");

    gsap.fromTo(".process-step-premium-card", 
      { 
        opacity: 0, 
        y: 40,
        scale: 0.97
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power2.out",
        overwrite: "auto"
      }
    );
  }, [activeTab]);

  return (
    <div className="bg-[#fcfbf9] py-28 px-6 border-t border-gray-100 relative overflow-hidden">
      {/* Decorative background watermark */}
      <div className="absolute right-0 bottom-0 text-[18vw] font-serif text-amber-950/[0.02] select-none pointer-events-none translate-y-12 translate-x-12 leading-none font-bold italic">
        Cape Town
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className="text-elegant-gold font-bold tracking-[0.25em] uppercase mb-4 text-xs md:text-sm">
            How It Works
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif text-elegant-dark mb-6 leading-tight">
            Our Simple Process
          </h3>
          <p className="text-gray-500 max-w-3xl mx-auto text-lg leading-relaxed font-light">
            We render the premium furniture experience transparent, guided, and completely seamless. 
            Choose your service path below to explore our exact workflow from initial spark to final delivery.
          </p>
        </div>

        {/* Dynamic Project Path Selectors */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-1.5 md:gap-3 mb-20 bg-stone-100 p-1.5 rounded-sm max-w-2xl mx-auto border border-stone-200">
          <button 
            onClick={() => setActiveTab('custom')}
            className={`w-full sm:w-1/3 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-400 cursor-pointer rounded-sm
              ${activeTab === 'custom' 
                ? 'bg-elegant-dark text-white shadow-md' 
                : 'text-stone-500 hover:text-elegant-dark hover:bg-stone-50/50'
              }`}
          >
            Custom Furniture
          </button>
          <button 
            onClick={() => setActiveTab('restoration')}
            className={`w-full sm:w-1/3 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-400 cursor-pointer rounded-sm
              ${activeTab === 'restoration' 
                ? 'bg-elegant-dark text-white shadow-md' 
                : 'text-stone-500 hover:text-elegant-dark hover:bg-stone-50/50'
              }`}
          >
            Restoration Projects
          </button>
          <button 
            onClick={() => setActiveTab('builtins')}
            className={`w-full sm:w-1/3 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-400 cursor-pointer rounded-sm
              ${activeTab === 'builtins' 
                ? 'bg-elegant-dark text-white shadow-md' 
                : 'text-stone-500 hover:text-elegant-dark hover:bg-stone-50/50'
              }`}
          >
            Kitchens & Built-ins
          </button>
        </div>

        {/* Horizontal Line Indicator */}
        <div className="relative mb-20 hidden lg:block">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-stone-200 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-10 right-10 h-1.5 bg-gradient-to-r from-elegant-gold/0 via-elegant-gold/30 to-elegant-gold/0 -translate-y-1/2 rounded-full blur-xs"></div>
        </div>

        {/* Staggered Process Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {getActiveSteps().map((step, index) => (
            <div 
              key={step.id} 
              className="process-step-premium-card group bg-white p-8 rounded-sm shadow-sm hover:shadow-lg border border-stone-100 hover:border-elegant-gold transition-all duration-500 relative cursor-default flex flex-col justify-between"
              style={{ minHeight: '340px' }}
            >
              <div>
                {/* Floating behind-number watermarked */}
                <div className="absolute top-4 right-6 font-serif italic text-4xl lg:text-5xl font-extralight text-stone-100/60 group-hover:text-amber-150/40 select-none pointer-events-none transition-colors duration-500">
                  {step.num}
                </div>

                {/* Glassy Amber Floating Icon Chamber */}
                <div className="w-14 h-14 rounded-full bg-elegant-gray flex items-center justify-center mb-8 relative group-hover:scale-110 group-hover:bg-elegant-dark transition-all duration-500 shadow-sm border border-stone-250">
                  <span className="absolute inset-0 rounded-full border border-transparent group-hover:border-elegant-gold group-hover:scale-120 opacity-0 group-hover:opacity-100 transition-all duration-500"></span>
                  <div className="relative z-10 transform group-hover:rotate-12 transition-transform duration-500">
                    {step.icon}
                  </div>
                </div>

                <p className="text-[10px] text-elegant-gold uppercase tracking-[0.2em] font-bold mb-1 group-hover:text-amber-600 transition-colors">
                  {step.subtitle}
                </p>
                <h4 className="text-lg font-serif text-elegant-dark mb-4 group-hover:text-elegant-gold transition-colors duration-400">
                  {step.title}
                </h4>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed font-light mt-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Premium Banner clarifying Call out & Business Conditions */}
        <div className="bg-elegant-dark text-white p-10 md:p-14 lg:p-16 border border-stone-800 relative overflow-hidden rounded-sm reveal-on-scroll">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.12),transparent_60%)] pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] tracking-[0.3em] font-bold text-elegant-gold uppercase inline-flex items-center gap-2">
                <MapPin size={12} className="text-elegant-gold" /> Cape Town, South Africa
              </span>
              <h3 className="text-3xl font-serif text-white tracking-wide font-medium">
                Transparent Operations & Trust
              </h3>
              <p className="text-stone-300 font-light leading-relaxed text-base">
                We believe premium craftsmanship starts with honest clarity. To keep our high-end workshop fully dedicated and our materials premium, we operate within explicit local guidelines.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Card 1: Call-out Fee */}
              <div className="bg-stone-900/60 p-5 border border-stone-800 rounded-sm space-y-2">
                <div className="flex items-center gap-2.5">
                  <Coins size={16} className="text-elegant-gold shrink-0" />
                  <span className="text-xs uppercase tracking-widest text-elegant-gold font-bold">R500 Call-Out</span>
                </div>
                <h4 className="text-sm font-serif font-semibold text-white">Measurement Security</h4>
                <p className="text-xxs text-stone-400 leading-relaxed font-light">
                  A standard R500 fee applies for physical physical Cape Town site visits (laser-mapping spaces, wood patina matching, taking measurements).
                </p>
              </div>

              {/* Card 2: Exclusions */}
              <div className="bg-stone-900/60 p-5 border border-stone-800 rounded-sm space-y-2">
                <div className="flex items-center gap-2.5">
                  <XCircle size={16} className="text-red-400 shrink-0" />
                  <span className="text-xs uppercase tracking-widest text-red-300 font-bold">Scope Focus</span>
                </div>
                <h4 className="text-sm font-serif font-semibold text-white">Select Woodcraft Only</h4>
                <p className="text-xxs text-stone-400 leading-relaxed font-light">
                  We excel in tables, cabinets, beds, study suites, and wooden benches. We do not manufacture standard dining chairs, metal frames, or upholstery.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
