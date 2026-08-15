import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { TextReveal } from './TextReveal';
import { RevealOnScroll } from './RevealOnScroll';
import { useLanguage } from './LanguageContext';
import { 
  MessageSquare, 
  Layers, 
  Hammer, 
  Truck, 
  Ruler, 
  Sparkles, 
  Compass,
  FileText,
  ShieldCheck, 
  Coins,
  MapPin,
  XCircle
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
    title: "Initial Design Consultation",
    subtitle: "Translating Vision Into Blueprints",
    description: "Your journey starts with a personal consultation. We discuss your aesthetic desires, spatial dimensions, and functional needs, translating your project ideas into elegant scale drawings and precise layout diagrams with zero obligation.",
    icon: <MessageSquare size={24} className="text-elegant-gold" />
  },
  {
    id: 2,
    num: "02",
    title: "Eco-Sourced Material Selection",
    subtitle: "Sourcing Premium Hardwoods",
    description: "Touch and select native hardwoods from our certified sustainable inventory (Walnut, French Oak, Ash, or Teak). We align continuous wood figure lines and match unique timber grains to match your home's character.",
    icon: <Layers size={24} className="text-elegant-gold" />
  },
  {
    id: 3,
    num: "03",
    title: "Bespoke Master Crafting",
    subtitle: "Traditional Heritage Woodwork",
    description: "Artisans shape your timber inside our Cape Town workshop. We utilize durable mortise-and-tenon and interlocking dovetail joinery. Every surface is sculpted with strict, sub-millimeter timber alignment.",
    icon: <Hammer size={24} className="text-elegant-gold" />
  },
  {
    id: 4,
    num: "04",
    title: "Artisanal Hand-Rubbed Finishing",
    subtitle: "Drawing Out Natural Patina",
    description: "We hand-sand each grain level before custom sealing. Using organic, food-safe oils, natural wax, and specialized satin or high-gloss lacquers, we protect the grain and bring out its deep historic luster.",
    icon: <Sparkles size={24} className="text-elegant-gold" />
  },
  {
    id: 5,
    num: "05",
    title: "White-Glove Private Delivery",
    subtitle: "Pristine Showcase Installation",
    description: "Our dedicated transport team wraps, carries, and installs your new heirloom. We handle perfect layout leveling and complete a final surface polish right inside your designated living space.",
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
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ProjectType>('custom');

  const getTranslatedSteps = (): ProcessStep[] => {
    if (language === 'en') {
      switch (activeTab) {
        case 'restoration': return RESTORATION_STEPS;
        case 'builtins': return INSTALLATION_STEPS;
        case 'custom':
        default:
          return CUSTOM_FURNITURE_STEPS;
      }
    } else {
      switch (activeTab) {
        case 'restoration':
          return [
            {
              id: 1,
              num: "01",
              title: "Digitale Foto-Beoordeling",
              subtitle: "Gratis Aanvanklike Strukturele Diagnose",
              description: "Stuur vir ons duidelike foto's van u verweerde of stukkende houtmeubels. Ons meester-restoureerders ontleed houtbreuke, skrynwerkkrake en die oorspronklike vernis gratis aanlyn.",
              icon: RESTORATION_STEPS[0].icon
            },
            {
              id: 2,
              num: "02",
              title: "Op-perseel Kaapstadse Afhaling",
              subtitle: "Vervoerlogistiek & R500 Fooi",
              description: "Vir diepgaande restourasie vervoer ons u meubels veilig met beskermende komberse. Ons span laai die meubelstuk by u Kaapstadse perseel op (standaard uitroepfooi van R500 geld).",
              icon: RESTORATION_STEPS[1].icon
            },
            {
              id: 3,
              num: "03",
              title: "Deskundige Afstroop Van Verf/Vernis",
              subtitle: "Veilige Verwydering Van Ou Oplosmiddels",
              description: "Ons stroop geoksideerde lae was, industriële vernis of afskilferende verf af met veilige, nie-korrosiewe chemiese oplossings, en skuur dit sagkens met die hand langs die houtgreep.",
              icon: RESTORATION_STEPS[2].icon
            },
            {
              id: 4,
              num: "04",
              title: "Strukturele Herstelwerk & Verlyming",
              subtitle: "Era-Akkurate Rekonstruksie",
              description: "Ons demonteer stukkende penverbindings, wend tradisionele dierehuid- of premium houtlyme aan, en herstel beskadigde areas met bypassende antieke houtvesels.",
              icon: RESTORATION_STEPS[3].icon
            },
            {
              id: 5,
              num: "05",
              title: "Patina-Afwerking",
              subtitle: "Polering tot Historiese Standaard",
              description: "Ons bewaar u antieke meubelstuk se natuurlike patina deur dit met die hand te vryf met natuurlike olies of deur bypassende hoë-glans vernis aan te wend wat by sy ontstaansera pas.",
              icon: RESTORATION_STEPS[4].icon
            },
            {
              id: 6,
              num: "06",
              title: "Aflewering & Onderhouds-Gids",
              subtitle: "Gerestoureer Vir Nog 'n Eeu",
              description: "Ons besorg die pragtige stuk terug met 'n spesiale sorg-handleiding om te help om die regte vogvlakke te handhaaf, sodat dit vir geslagte lank bewaar bly.",
              icon: RESTORATION_STEPS[5].icon
            }
          ];
        case 'builtins':
          return [
            {
              id: 1,
              num: "01",
              title: "Kaapstad Laser-Meting Besoek",
              subtitle: "Perseel-Oudit & R500 Uitroepfooi",
              description: "Ons installasie-leier besoek u perseel in Kaapstad om mure, vloerlyste en pype met lasers te skandeer. Hierdie metings- en skanderingsoudit kos R500.",
              icon: INSTALLATION_STEPS[0].icon
            },
            {
              id: 2,
              num: "02",
              title: "Hout- & Ysterware-Keuse",
              subtitle: "Kies U Argitektoniese Afwerking",
              description: "Kies duursame eikehout-fineer of ryk geverfde soliede hout. Ons koördineer alle skarniere en laaie met behulp van hoë-gehalte Europese sagtesluit-kasstelsels.",
              icon: INSTALLATION_STEPS[1].icon
            },
            {
              id: 3,
              num: "03",
              title: "Millimeter-Presiese Skrynwerk",
              subtitle: "Stofvrye Werkswinkel Vooraf-Vervaardiging",
              description: "Ons sny, bou en verf die kaste vooraf in ons spesiale Kaapstadse werkswinkel om saagsels en ontwrigting by u huis tot die absolute minimum te beperk.",
              icon: INSTALLATION_STEPS[2].icon
            },
            {
              id: 4,
              num: "04",
              title: "Chirurgiese Installasie",
              subtitle: "Netjies Ingeboude Kaste",
              description: "Ons skrynwerkers lewer, anker en belyn elke laai en kasdeur perfek om 'n foutlose ingeboude kasstelsel te skep wat gelyk is met u mure.",
              icon: INSTALLATION_STEPS[3].icon
            }
          ];
        case 'custom':
        default:
          return [
            {
              id: 1,
              num: "01",
              title: "Aanvanklike Ontwerpkonsultasie",
              subtitle: "Omskakeling Van Visie In Bloudrukke",
              description: "U reis begin met 'n persoonlike konsultasie. Ons bespreek u estetiese wense, kamergrootte en funksionele behoeftes, en skep gedetailleerde tekeninge en planne sonder enige verpligting.",
              icon: CUSTOM_FURNITURE_STEPS[0].icon
            },
            {
              id: 2,
              num: "02",
              title: "Volhoubare Materiaalkeuse",
              subtitle: "Verkryging Van Premium Hardehout",
              description: "Sien en kies inheemse hardehout uit ons gesertifiseerde volhoubare voorraad (Okkerneuthout, Franse Akkerhout, Essenhout of Teakhout) om perfek by u huis se karakter te pas.",
              icon: CUSTOM_FURNITURE_STEPS[1].icon
            },
            {
              id: 3,
              num: "03",
              title: "Unieke Meester-Skrynwerk",
              subtitle: "Tradisionele Erfenis-Houtwerk",
              description: "Ambagsmanne vorm u hout in ons Kaapstadse werkswinkel met behulp van pen-en-gatverbindings en interlocking swaelsterte vir uitstekende duursaamheid.",
              icon: CUSTOM_FURNITURE_STEPS[2].icon
            },
            {
              id: 4,
              num: "04",
              title: "Handvryf-Afwerking",
              subtitle: "Onttrekking Van Natuurlike Patina",
              description: "Ons handskuur elke greepvlak voor ons dit verseël. Met organiese, voedselveilige olies, natuurlike byewas of bypassende lae-glans vernis beskerm ons die hout.",
              icon: CUSTOM_FURNITURE_STEPS[3].icon
            },
            {
              id: 5,
              num: "05",
              title: "Persoonlike Vervoer & Installasie",
              subtitle: "Perfekte Voltooide Afwerking",
              description: "Ons vervoerspan draai u nuwe meubels deeglik toe, lewer dit af en installeer dit perfek in u huis met 'n laaste oppervlak-poleerproses.",
              icon: CUSTOM_FURNITURE_STEPS[4].icon
            }
          ];
      }
    }
  };

  // Run premium GSAP reveal animation whenever the active tab switches
  useEffect(() => {
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
    <section id="process-walkthrough-section" className="bg-[#faf8f5] py-24 md:py-28 px-6 border-t border-stone-200/60 relative overflow-hidden">
      {/* Decorative background watermark */}
      <div className="absolute right-0 bottom-0 text-[16vw] font-serif text-stone-900/[0.02] select-none pointer-events-none translate-y-12 translate-x-12 leading-none font-bold italic">
        {language === 'en' ? 'Cape Town' : 'Kaapstad'}
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <RevealOnScroll duration={0.8}>
          <div className="text-center mb-14 md:mb-16">
            <span className="text-[#8c6517] font-semibold tracking-[0.24em] uppercase mb-3 text-xs md:text-sm block">
              {t.processTitle}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 mb-5 leading-tight">
              <TextReveal text={language === 'en' ? "Our Bespoke Method" : "Ons Pasgemaakte Metode"} />
            </h2>
            <div className="w-16 h-[1.5px] bg-[#c5a059]/40 mx-auto mb-5" />
            <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
              {t.processSub}
            </p>
          </div>
        </RevealOnScroll>

        {/* Dynamic Project Path Selectors */}
        <RevealOnScroll duration={0.9} delay={0.15}>
          <div 
            id="process-type-tabs"
            className="flex flex-col sm:flex-row justify-center items-center gap-1.5 sm:gap-2 mb-14 md:mb-16 bg-stone-200/60 p-1.5 rounded-sm max-w-2xl mx-auto border border-stone-200 shadow-sm"
            role="tablist"
            aria-label="Process workflow selector"
          >
            <button 
              id="process-tab-custom"
              role="tab"
              aria-selected={activeTab === 'custom'}
              onClick={() => setActiveTab('custom')}
              className={`w-full sm:w-1/3 min-h-[44px] py-3 px-3 text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] transition-all duration-300 cursor-pointer rounded-sm flex items-center justify-center
                ${activeTab === 'custom' 
                  ? 'bg-stone-900 text-white shadow-sm' 
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/60'
                }`}
            >
              {language === 'en' ? 'Custom Furniture' : 'Pasgemaakte Meubels'}
            </button>
            <button 
              id="process-tab-restoration"
              role="tab"
              aria-selected={activeTab === 'restoration'}
              onClick={() => setActiveTab('restoration')}
              className={`w-full sm:w-1/3 min-h-[44px] py-3 px-3 text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] transition-all duration-300 cursor-pointer rounded-sm flex items-center justify-center
                ${activeTab === 'restoration' 
                  ? 'bg-stone-900 text-white shadow-sm' 
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/60'
                }`}
            >
              {language === 'en' ? 'Restoration' : 'Restorasie'}
            </button>
            <button 
              id="process-tab-builtins"
              role="tab"
              aria-selected={activeTab === 'builtins'}
              onClick={() => setActiveTab('builtins')}
              className={`w-full sm:w-1/3 min-h-[44px] py-3 px-3 text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] transition-all duration-300 cursor-pointer rounded-sm flex items-center justify-center
                ${activeTab === 'builtins' 
                  ? 'bg-stone-900 text-white shadow-sm' 
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/60'
                }`}
            >
              {language === 'en' ? 'Kitchens & Built-ins' : 'Kombuise & Kaste'}
            </button>
          </div>
        </RevealOnScroll>

        {/* Staggered Process Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8 mb-16 md:mb-20">
          {getTranslatedSteps().map((step, index) => (
            <RevealOnScroll 
              key={step.id} 
              duration={0.8}
              delay={0.08 * index}
              className="process-step-premium-card group bg-white p-7 sm:p-8 rounded-sm shadow-sm hover:shadow-xl border border-stone-200 hover:border-[#c5a059] transition-all duration-400 relative cursor-default flex flex-col justify-between min-h-[320px]"
            >
              <div>
                {/* Floating behind-number watermarked */}
                <div className="absolute top-4 right-6 font-serif italic text-4xl lg:text-5xl font-light text-stone-200 group-hover:text-amber-200/50 select-none pointer-events-none transition-colors duration-400">
                  {step.num}
                </div>

                {/* Ambient Icon Chamber */}
                <div className="w-12 h-12 rounded-sm bg-[#faf8f5] flex items-center justify-center mb-6 relative group-hover:scale-105 group-hover:bg-stone-900 transition-all duration-400 shadow-sm border border-stone-200 group-hover:border-stone-900">
                  <div className="relative z-10 text-[#c5a059] group-hover:text-[#c5a059] transition-transform duration-400">
                    {step.icon}
                  </div>
                </div>

                <span className="text-[11px] text-[#8c6517] uppercase tracking-[0.2em] font-bold block mb-1.5">
                  {step.subtitle}
                </span>
                <h3 className="text-xl font-serif text-stone-900 mb-3 group-hover:text-[#8c6517] transition-colors duration-300 font-medium">
                  {step.title}
                </h3>
              </div>

              <p className="text-stone-600 text-sm sm:text-[14.5px] leading-relaxed font-light mt-auto">
                {step.description}
              </p>
            </RevealOnScroll>
          ))}
        </div>

        {/* Premium Banner clarifying Call out & Business Conditions */}
        <RevealOnScroll className="bg-stone-950 text-white p-8 sm:p-12 lg:p-14 border border-stone-800 relative overflow-hidden rounded-sm shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.12),transparent_60%)] pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[11px] tracking-[0.25em] font-bold text-[#c5a059] uppercase inline-flex items-center gap-2">
                <MapPin size={13} className="text-[#c5a059]" /> {language === 'en' ? 'Cape Town, South Africa' : 'Kaapstad, Suid-Afrika'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-wide font-medium">
                {language === 'en' ? 'Transparent Operations & Clarity' : 'Deursigtige Bedrywighede & Duidelikheid'}
              </h3>
              <p className="text-stone-300 font-light leading-relaxed text-sm sm:text-base">
                {language === 'en' 
                  ? 'We believe bespoke craftsmanship starts with total transparency. To keep our high-end studio dedicated and our material selection pristine, we operate with structured local guidelines.'
                  : 'Ons glo dat pasgemaakte vakmanskap met volkome deursigtigheid begin. Om ons ateljee toegewy en ons houtkeuses ongerep te hou, volg ons duidelike plaaslike riglyne.'}
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Card 1: Call-out Fee */}
              <div className="bg-stone-900/90 p-5 sm:p-6 border border-stone-800 rounded-sm space-y-2">
                <div className="flex items-center gap-2">
                  <Coins size={16} className="text-[#c5a059] shrink-0" />
                  <span className="text-xs uppercase tracking-[0.18em] text-[#c5a059] font-bold">
                    {language === 'en' ? 'R500 Call-Out' : 'R500 Uitroep'}
                  </span>
                </div>
                <h4 className="text-sm font-serif font-semibold text-white">
                  {language === 'en' ? 'Site Audit & Laser Scan' : 'Perseel-Oudit & Lasermeting'}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  {language === 'en' 
                    ? 'A standard R500 fee applies for physical Cape Town site visits (laser-mapping spaces, wood patina matching, taking exact measurements).'
                    : 'A standaard R500 fooi geld vir fisiese Kaapstadse perseelbesoeke (laser-skanderings, bypassende houtpatinas en akkurate metings).'}
                </p>
              </div>

              {/* Card 2: Exclusions */}
              <div className="bg-stone-900/90 p-5 sm:p-6 border border-stone-800 rounded-sm space-y-2">
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-rose-400 shrink-0" />
                  <span className="text-xs uppercase tracking-[0.18em] text-rose-300 font-bold">
                    {language === 'en' ? 'Scope Focus' : 'Bestekfokus'}
                  </span>
                </div>
                <h4 className="text-sm font-serif font-semibold text-white">
                  {language === 'en' ? 'Solid Woodcraft Only' : 'Slegs Soliede Houtwerk'}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  {language === 'en' 
                    ? 'We excel in custom built-ins, kitchens, tables, cabinetry, and desks. We do not manufacture standalone chairs, metal frames, or upholstery.'
                    : 'Ons spesialiseer in ingeboude kaste, kombuise, tafels, kabinette en lessenaars. Ons maak nie losstaande stoele, metaalrame of stoffering nie.'}
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
};
