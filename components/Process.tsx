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
    <div className="bg-[#fcfbf9] py-28 px-6 border-t border-gray-100 relative overflow-hidden">
      {/* Decorative background watermark */}
      <div className="absolute right-0 bottom-0 text-[18vw] font-serif text-amber-950/[0.02] select-none pointer-events-none translate-y-12 translate-x-12 leading-none font-bold italic">
        {language === 'en' ? 'Cape Town' : 'Kaapstad'}
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <RevealOnScroll duration={0.8}>
          <div className="text-center mb-16">
            <h2 className="text-elegant-gold font-bold tracking-[0.25em] uppercase mb-4 text-xs md:text-sm">
              {t.processTitle}
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif text-elegant-dark mb-6 leading-tight">
              <TextReveal text={language === 'en' ? "Our Simple Process" : "Ons Eenvoudige Proses"} />
            </h3>
            <p className="text-gray-500 max-w-3xl mx-auto text-lg leading-relaxed font-light">
              {t.processSub}
            </p>
          </div>
        </RevealOnScroll>

        {/* Dynamic Project Path Selectors */}
        <RevealOnScroll duration={0.9} delay={0.15}>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-1.5 md:gap-3 mb-20 bg-stone-100 p-1.5 rounded-sm max-w-2xl mx-auto border border-stone-200">
            <button 
              onClick={() => setActiveTab('custom')}
              className={`w-full sm:w-1/3 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-400 cursor-pointer rounded-sm
                ${activeTab === 'custom' 
                  ? 'bg-elegant-dark text-white shadow-md' 
                  : 'text-stone-500 hover:text-elegant-dark hover:bg-stone-50/50'
                }`}
            >
              {language === 'en' ? 'Custom Furniture' : 'Pasgemaakte Meubels'}
            </button>
            <button 
              onClick={() => setActiveTab('restoration')}
              className={`w-full sm:w-1/3 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-400 cursor-pointer rounded-sm
                ${activeTab === 'restoration' 
                  ? 'bg-elegant-dark text-white shadow-md' 
                  : 'text-stone-500 hover:text-elegant-dark hover:bg-stone-50/50'
                }`}
            >
              {language === 'en' ? 'Restoration Projects' : 'Restorasie-Projekte'}
            </button>
            <button 
              onClick={() => setActiveTab('builtins')}
              className={`w-full sm:w-1/3 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-400 cursor-pointer rounded-sm
                ${activeTab === 'builtins' 
                  ? 'bg-elegant-dark text-white shadow-md' 
                  : 'text-stone-500 hover:text-elegant-dark hover:bg-stone-50/50'
                }`}
            >
              {language === 'en' ? 'Kitchens & Built-ins' : 'Kombuise & Ingeboude Kaste'}
            </button>
          </div>
        </RevealOnScroll>

        {/* Horizontal Line Indicator */}
        <div className="relative mb-20 hidden lg:block">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-stone-200 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-10 right-10 h-1.5 bg-gradient-to-r from-elegant-gold/0 via-elegant-gold/30 to-elegant-gold/0 -translate-y-1/2 rounded-full blur-sm"></div>
        </div>

        {/* Staggered Process Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {getTranslatedSteps().map((step, index) => (
            <RevealOnScroll 
              key={step.id} 
              duration={0.9}
              delay={0.12 * index}
              className="process-step-premium-card group bg-white p-8 rounded-sm shadow-sm hover:shadow-lg border border-stone-100 hover:border-elegant-gold transition-all duration-500 relative cursor-default flex flex-col justify-between min-h-[340px]"
            >
              <div>
                {/* Floating behind-number watermarked */}
                <div className="absolute top-4 right-6 font-serif italic text-4xl lg:text-5xl font-extralight text-stone-100/60 group-hover:text-amber-100/40 select-none pointer-events-none transition-colors duration-500">
                  {step.num}
                </div>

                {/* Glassy Amber Floating Icon Chamber */}
                <div className="w-14 h-14 rounded-full bg-elegant-gray flex items-center justify-center mb-8 relative group-hover:scale-110 group-hover:bg-elegant-dark transition-all duration-500 shadow-sm border border-stone-300">
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
            </RevealOnScroll>
          ))}
        </div>

        {/* Premium Banner clarifying Call out & Business Conditions */}
        <RevealOnScroll className="bg-elegant-dark text-white p-10 md:p-14 lg:p-16 border border-stone-800 relative overflow-hidden rounded-sm">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.12),transparent_60%)] pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] tracking-[0.3em] font-bold text-elegant-gold uppercase inline-flex items-center gap-2">
                <MapPin size={12} className="text-elegant-gold" /> {language === 'en' ? 'Cape Town, South Africa' : 'Kaapstad, Suid-Afrika'}
              </span>
              <h3 className="text-3xl font-serif text-white tracking-wide font-medium">
                {language === 'en' ? 'Transparent Operations & Trust' : 'Deursigtige Bedrywighede & Vertroue'}
              </h3>
              <p className="text-stone-300 font-light leading-relaxed text-base">
                {language === 'en' 
                  ? 'We believe premium craftsmanship starts with honest clarity. To keep our high-end workshop fully dedicated and our materials premium, we operate within explicit local guidelines.'
                  : 'Ons glo dat premium vakmanskap met eerlike duursame deursigtigheid begin. Om ons werkswinkel heeltemal gefokus te hou op hoë-gehalte werk, volg ons duidelike plaaslike riglyne.'}
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Card 1: Call-out Fee */}
              <div className="bg-stone-900/60 p-5 border border-stone-800 rounded-sm space-y-2">
                <div className="flex items-center gap-2.5">
                  <Coins size={16} className="text-elegant-gold shrink-0" />
                  <span className="text-xs uppercase tracking-widest text-elegant-gold font-bold">
                    {language === 'en' ? 'R500 Call-Out' : 'R500 Uitroep'}
                  </span>
                </div>
                <h4 className="text-sm font-serif font-semibold text-white">
                  {language === 'en' ? 'Measurement Security' : 'Metings-Sekuriteit'}
                </h4>
                <p className="text-[10px] text-stone-400 leading-relaxed font-light">
                  {language === 'en' 
                    ? 'A standard R500 fee applies for physical Cape Town site visits (laser-mapping spaces, wood patina matching, taking measurements).'
                    : 'A standaard R500 fooi geld vir fisiese Kaapstadse perseelbesoeke (laser-skanderings, bypassende houtpatinas en metings).'}
                </p>
              </div>

              {/* Card 2: Exclusions */}
              <div className="bg-stone-900/60 p-5 border border-stone-800 rounded-sm space-y-2">
                <div className="flex items-center gap-2.5">
                  <XCircle size={16} className="text-red-400 shrink-0" />
                  <span className="text-xs uppercase tracking-widest text-red-300 font-bold">
                    {language === 'en' ? 'Scope Focus' : 'Bestekfokus'}
                  </span>
                </div>
                <h4 className="text-sm font-serif font-semibold text-white">
                  {language === 'en' ? 'Select Woodcraft Only' : 'Slegs Geselekteerde Houtwerk'}
                </h4>
                <p className="text-[10px] text-stone-400 leading-relaxed font-light">
                  {language === 'en' 
                    ? 'We excel in tables, cabinets, beds, study suites, and wooden benches. We do not manufacture standard dining chairs, metal frames, or upholstery.'
                    : 'Ons spesialiseer in kaste, kombuise, tafels, beddens en houtbankies. Ons maak nie losstaande stoele, metaalrame of stoffering nie.'}
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </div>
  );
};
