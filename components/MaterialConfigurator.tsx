import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { View } from '../types';
import { Sparkles, Compass, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';
import { useLanguage } from './LanguageContext';

// Import our beautiful high-end generated showcase images
// @ts-ignore
import charcoalOakImg from '../src/assets/images/config_charcoal_smoked_oak_1784376777227.webp';
// @ts-ignore
import frenchWalnutImg from '../src/assets/images/config_natural_walnut_1784376794679.webp';
// @ts-ignore
import honeyMapleImg from '../src/assets/images/config_honey_maple_1784376809378.webp';

interface FinishOption {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  colorSwatch: string; // fallback color
  description: string;
  character: string;
  hardness: string;
  finishMethod: string;
  idealMatch: string;
  careInstruction: string;
}

const FINISH_OPTIONS: FinishOption[] = [
  {
    id: 'charcoal-smoked-oak',
    name: 'Charcoal Smoked Oak',
    subtitle: 'Proprietary Natural Fumed Process',
    image: charcoalOakImg,
    colorSwatch: '#1a1a1a',
    description: 'Deeply smoked over natural fire, our Charcoal Smoked Oak is a testament to dramatic modern luxury. The proprietary smoking process extracts natural tannins, creating a complex black-grey hue that penetrates deep into the grain rather than sitting on top as a stain. This highlights the bold, open-pore cathedral patterns of premium French white oak.',
    character: 'Open-pore bold textures, rich fumed multi-tonal charcoal black grain',
    hardness: 'Extremely high (Solid European White Oak)',
    finishMethod: 'Deep-penetrating natural smoking, sealed with hand-rubbed hardwax oil',
    idealMatch: 'Minimalist dining rooms, monolithic centerpieces, high-contrast interior architecture',
    careInstruction: 'Dust with a lint-free dry cloth. Restore tactile satin sheen with organic wood wax.'
  },
  {
    id: 'natural-walnut',
    name: 'Natural French Walnut',
    subtitle: 'Sustainable European Heritage Hardwood',
    image: frenchWalnutImg,
    colorSwatch: '#4e3525',
    description: 'Sourced from sustainably managed European groves, Natural French Walnut represents the absolute peak of classical refinement. Sliced to reveal intricate, flowing heartwood curves and marbled chocolate and amber swirls. We finish this wood with a hand-rubbed organic oil that allows the rich timber to breathe and develop a beautiful patina over generations.',
    character: 'Velvety smooth touch, complex undulating chocolate and bronze figure lines, rich natural depth',
    hardness: 'High (Sustainable French Walnut)',
    finishMethod: 'Hand-rubbed natural seed oil & beeswaxes (solvent-free, matte protection)',
    idealMatch: 'Bespoke executive desks, heritage console tables, warm organic modern living spaces',
    careInstruction: 'Avoid direct intense sunlight. Apply organic wood oil annually to nourish.'
  },
  {
    id: 'spiced-honey-maple',
    name: 'Spiced Honey Maple',
    subtitle: 'Luminous Tight-Grain Amber Lustre',
    image: honeyMapleImg,
    colorSwatch: '#d49b49',
    description: 'With its golden-honey glow, Spiced Honey Maple infuses warmth and lightness into architectural spaces. Our hand-rubbed finish is fortified with light-stable resins to retain its brilliant amber lustre. The timber features extremely dense grain structures, subtle curly waves, and shimmering fiddleback patterns that dynamically play with natural light.',
    character: 'Luminous golden-amber glow, delicate fiddleback waves, smooth tight-grain finish',
    hardness: 'Very high (Hard Rock Maple)',
    finishMethod: 'Hand-buffed natural linseed, light-stable protective resins',
    idealMatch: 'Eco-chic entryways, statement coffee tables, bright Scandinavian-inspired interiors',
    careInstruction: 'Wipe clean with a damp cloth and mild neutral soap. Buff gently with dry flannel.'
  }
];

interface MaterialConfiguratorProps {
  onNavigate: (view: View, sectionId?: string, prefillData?: { details?: string }) => void;
}

export const MaterialConfigurator: React.FC<MaterialConfiguratorProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const [selectedFinish, setSelectedFinish] = useState<FinishOption>(FINISH_OPTIONS[0]);

  const handleSelect = (option: FinishOption) => {
    setSelectedFinish(option);
  };

  const getTranslatedFinish = (option: FinishOption) => {
    if (language === 'en') {
      return {
        name: option.name,
        subtitle: option.subtitle,
        description: option.description,
        character: option.character,
        hardness: option.hardness,
        finishMethod: option.finishMethod,
        idealMatch: option.idealMatch,
      };
    } else {
      switch (option.id) {
        case 'charcoal-smoked-oak':
          return {
            name: 'Houtskool Gerookte Akkerhout',
            subtitle: 'Eie Natuurlike Berookte Proses',
            description: 'Ons Houtskool Gerookte Akkerhout is diep gerook oor natuurlike vuur, \'n bewys van dramatiese moderne luukse. Die eie rookproses onttrek natuurlike tanniene, wat \'n komplekse swart-grys skakering skep wat diep in die houtgreep binnedring in plaas daarvan om as \'n vlek bo-op te sit. Dit beklemtoon die pragtige natuurlike katedraal-patrone van wit akkerhout.',
            character: 'Oop-porie ryk teksture, ryk berookte swart akkerhout-patrone',
            hardness: 'Uiters hoog (Massiewe Europese Wit Akkerhout)',
            finishMethod: 'Diepdeurdringende natuurlike beroking, verseël met handvryf hardewas-olie',
            idealMatch: 'Minimalistiese eetkamers, monolitiese middelpunte, hoë-kontras interieurargitektuur',
          };
        case 'natural-walnut':
          return {
            name: 'Natuurlike Franse Okkerneuthout',
            subtitle: 'Volhoubare Europese Erfenis Hardehout',
            description: 'Sourced van volhoubaar bestuurde Europese boorde, verteenwoordig Natuurlike Franse Okkerneut die absolute piek van klassieke verfyning. Gesny om ingewikkelde, vloeiende kernhout-kurwes en marmeragtige sjokolade- en amber-swirls te openbaar. Ons was dit met natuurlike metodes.',
            character: 'Fluweelsagte aanraking, komplekse sjokolade en brons figuurlyne, ryk natuurlike diepte',
            hardness: 'Hoog (Volhoubare Franse Okkerneuthout)',
            finishMethod: 'Handvryf natuurlike saadolie & byewas (oplosmiddelvry, mat beskerming)',
            idealMatch: 'Elegante kantoortafels, erfenis-konsooltafels, warm organiese moderne leefruimtes',
          };
        case 'spiced-honey-maple':
          return {
            name: 'Gekruide Heuning-Ahorn',
            subtitle: 'Glansende Digte-Greep Amber-Lustre',
            description: 'Met sy goue heuninggloed bring Gekruide Heuning-Ahorn warmte en ligtheid in argitektoniese ruimtes. Ons handvryf-afwerking is versterk met ligbestendige harse om sy skitterende amber-glans te behou met ryk patrone.',
            character: 'Glansende goue-amber gloed, fyn fiddleback golwe, gladde digte-greep afwerking',
            hardness: 'Baie hoog (Hard Rock Ahorn / Esdoorn)',
            finishMethod: 'Hand-gepoleerde natuurlike lynolie, ligbestendige beskermende harse',
            idealMatch: 'Eko-sjiek ingange, eiesoortige koffietafels, ligte Skandinawies-geïnspireerde interieurs',
          };
        default:
          return {
            name: option.name,
            subtitle: option.subtitle,
            description: option.description,
            character: option.character,
            hardness: option.hardness,
            finishMethod: option.finishMethod,
            idealMatch: option.idealMatch,
          };
      }
    }
  };

  const currentFinish = getTranslatedFinish(selectedFinish);

  const handleRequestQuote = () => {
    const details = language === 'en' 
      ? `I am interested in customizing a premium solid-wood piece with your beautiful "${selectedFinish.name}" finish.\n\nFinish Details:\n- Material: ${selectedFinish.name}\n- Finish Method: ${selectedFinish.finishMethod}\n\nPlease contact me to discuss potential custom sizes and layouts.`
      : `Ek stel belang in 'n pasgemaakte soliede-hout stuk met julle pragtige "${currentFinish.name}" afwerking.\n\nAfwerking Besonderhede:\n- Materiaal: ${currentFinish.name}\n- Afwerking Metode: ${currentFinish.finishMethod}\n\nKontak my asseblief om moontlike groottes en ontwerpe te bespreek.`;
    onNavigate(View.HOME, 'contact', { details });
  };

  return (
    <section id="finishes-configurator-section" className="bg-[#f5f0eb] py-24 md:py-28 px-6 relative overflow-hidden border-t border-stone-200/60">
      {/* Editorial Grain and Accent Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-[0.02] pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-[radial-gradient(circle_at_top_left,rgba(197,160,89,0.06),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_bottom_right,rgba(197,160,89,0.06),transparent_60%)] pointer-events-none" />

      <div className="container mx-auto max-w-7xl">
        {/* Title Block */}
        <RevealOnScroll duration={1.0}>
          <div className="text-center mb-14 md:mb-16">
            <span className="text-[#8c6517] font-semibold tracking-[0.24em] uppercase mb-3 text-xs md:text-sm block">
              {t.configTitle}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 leading-tight tracking-wide mb-5">
              {language === 'en' ? 'Interactive Finishes Configurator' : 'Interaktiewe Afwerkings-Konfigurator'}
            </h2>
            <div className="w-16 h-[1.5px] bg-[#c5a059]/40 mx-auto mb-5" />
            <p className="text-stone-600 font-sans font-light max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              {t.configSub}
            </p>
          </div>
        </RevealOnScroll>

        {/* Customizer Grid */}
        <RevealOnScroll duration={1.2} delay={0.15}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left / Top Side: Main Cross-Fading Showcase Screen */}
            <div className="lg:col-span-7 relative">
              <div className="aspect-[16/10] w-full bg-stone-900 rounded-sm overflow-hidden shadow-2xl relative border border-stone-800/80 group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedFinish.id}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={selectedFinish.image}
                      alt={`${selectedFinish.name} timber finish`}
                      className="w-full h-full object-cover select-none"
                      referrerPolicy="no-referrer"
                    />
                    {/* Subtle luxury overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
                  </motion.div>
                </AnimatePresence>

                {/* Live Spec Overlay Tag */}
                <div className="absolute bottom-6 left-6 z-10 bg-black/80 backdrop-blur-md px-4 py-2.5 border-l-2 border-[#c5a059] text-white select-none rounded-r-sm">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-semibold text-[#c5a059] block mb-0.5">
                    {language === 'en' ? 'SELECTED FINISH' : 'GEKOSE AFWERKING'}
                  </span>
                  <span className="text-sm sm:text-base font-serif italic text-stone-100">{currentFinish.name}</span>
                </div>
              </div>

              {/* Micro-Interaction Tip */}
              <div className="flex items-center justify-between mt-4 text-[11px] text-stone-500 font-sans tracking-wider uppercase font-medium">
                <span className="flex items-center gap-2">
                  <Sparkles size={13} className="text-[#c5a059]" />
                  {language === 'en' ? 'Select swatches to explore texture' : 'Kies monsters om tekstuur te verken'}
                </span>
                <span>{language === 'en' ? '100% Sustainable Hardwoods' : '100% Volhoubare Hardehout'}</span>
              </div>
            </div>

            {/* Right / Bottom Side: Spec Sheet & Selector controls */}
            <div className="lg:col-span-5 flex flex-col h-full justify-between">
              <div>
                 {/* Dynamic Material Heading */}
                <div className="mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedFinish.id}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <span className="text-[#8c6517] text-xs uppercase tracking-[0.2em] font-bold block mb-1">
                        {currentFinish.subtitle}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif text-stone-900 font-medium">
                        {currentFinish.name}
                      </h3>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Minimalist Material Swatch Selector */}
                <div 
                  id="finish-swatches-container"
                  className="flex flex-col gap-3 p-4 bg-white border border-stone-200 rounded-sm mb-6 select-none shadow-sm"
                >
                  <span className="text-[11px] font-sans tracking-widest text-stone-600 uppercase font-bold">
                    {language === 'en' ? 'SELECT MATERIAL SPECIMEN:' : 'KIES MATERIAAL-MONSTER:'}
                  </span>
                  <div className="flex gap-4 sm:gap-5 items-center">
                    {FINISH_OPTIONS.map((option) => {
                      const isSelected = selectedFinish.id === option.id;
                      return (
                        <button
                          key={option.id}
                          id={`finish-swatch-${option.id}`}
                          onClick={() => handleSelect(option)}
                          className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center focus:outline-none overflow-hidden
                            ${isSelected 
                              ? 'ring-2 ring-[#c5a059] ring-offset-2 ring-offset-white shadow-md scale-105' 
                              : 'hover:scale-105 ring-1 ring-stone-300 hover:ring-stone-400'}`}
                          style={{ backgroundColor: option.colorSwatch }}
                          title={option.name}
                          aria-label={`Select ${option.name} finish`}
                          aria-pressed={isSelected}
                        >
                          {/* Real wood grain preview zoomed inside circle */}
                          <img 
                            src={option.image} 
                            alt={option.name} 
                            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300 scale-150"
                          />
                          {/* Dark cover filter to preserve select checkmark visibility */}
                          <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isSelected ? 'opacity-50' : 'opacity-0 hover:opacity-15'}`} />
                          
                          {/* Selected Checkmark indicator */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute z-10 text-white"
                              >
                                <Check size={16} className="stroke-[3]" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Description */}
                <div className="mb-6 min-h-[90px]">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={selectedFinish.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="text-stone-700 font-sans font-light text-sm sm:text-base leading-relaxed"
                    >
                      {currentFinish.description}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Specifications Matrix */}
                <div className="space-y-3.5 border-t border-b border-stone-200/80 py-5 mb-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedFinish.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-3"
                    >
                      {/* Grain detail */}
                      <div className="grid grid-cols-3 gap-2 text-xs sm:text-[13px] font-sans">
                        <span className="text-stone-500 font-medium uppercase tracking-wider">
                          {language === 'en' ? 'Grain Character' : 'Greep-Karakter'}
                        </span>
                        <span className="col-span-2 text-stone-900 font-semibold">{currentFinish.character}</span>
                      </div>

                      {/* Hardness */}
                      <div className="grid grid-cols-3 gap-2 text-xs sm:text-[13px] font-sans">
                        <span className="text-stone-500 font-medium uppercase tracking-wider">
                          {language === 'en' ? 'Density Rating' : 'Digtheids-Graad'}
                        </span>
                        <span className="col-span-2 text-stone-900 font-semibold flex items-center gap-1.5">
                          <ShieldCheck size={15} className="text-[#c5a059] shrink-0" />
                          {currentFinish.hardness}
                        </span>
                      </div>

                      {/* Finish Method */}
                      <div className="grid grid-cols-3 gap-2 text-xs sm:text-[13px] font-sans">
                        <span className="text-stone-500 font-medium uppercase tracking-wider">
                          {language === 'en' ? 'Lustre Treatment' : 'Glans-Behandeling'}
                        </span>
                        <span className="col-span-2 text-stone-900 font-semibold">{currentFinish.finishMethod}</span>
                      </div>

                      {/* Ideal match */}
                      <div className="grid grid-cols-3 gap-2 text-xs sm:text-[13px] font-sans">
                        <span className="text-stone-500 font-medium uppercase tracking-wider">
                          {language === 'en' ? 'Aesthetic Cohesion' : 'Estetiese Samehang'}
                        </span>
                        <span className="col-span-2 text-stone-900 font-semibold flex items-center gap-1.5">
                          <Compass size={15} className="text-[#c5a059] shrink-0" />
                          {currentFinish.idealMatch}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Action Trigger */}
              <button
                id="finish-request-quote-button"
                onClick={handleRequestQuote}
                className="w-full min-h-[50px] flex items-center justify-center gap-3 bg-stone-950 text-white hover:bg-[#c5a059] transition-all duration-300 uppercase tracking-[0.16em] text-xs sm:text-[13px] font-bold py-4 px-6 rounded-sm shadow-md cursor-pointer active:scale-[0.98]"
              >
                <span>{language === 'en' ? `Request Custom Build In ${currentFinish.name}` : `Vra Pasgemaakte Bou In ${currentFinish.name}`}</span>
                <ArrowRight size={15} className="shrink-0" />
              </button>
            </div>

          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
