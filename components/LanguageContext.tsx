import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'af';

export interface TranslationDict {
  // Navigation
  navHome: string;
  navCollection: string;
  navProcess: string;
  navFinishes: string;
  navBts: string;
  navTestimonials: string;
  navContact: string;

  // Hero Section
  heroTitle: string;
  heroSub: string;
  heroBtnStart: string;
  heroBtnExplore: string;
  heroScroll: string;

  // Portfolio Section
  portfolioTitle: string;
  portfolioSub: string;
  portfolioFilterAll: string;
  portfolioFilterKitchens: string;
  portfolioFilterWardrobes: string;
  portfolioFilterCabinets: string;
  portfolioFilterFurniture: string;
  portfolioBtnInquire: string;
  portfolioSpecTitle: string;
  portfolioSpecMaterials: string;
  portfolioSpecFinish: string;

  // Finishes Configurator
  configTitle: string;
  configSub: string;
  configSectionHout: string;
  configSectionFinish: string;
  configHoutSelection: string;
  configFinishSelection: string;
  configBtnInquiry: string;
  configPromptPrefill: string;

  // Behind the Scenes
  btsTitle: string;
  btsSub: string;
  btsBtnContact: string;

  // Process Section
  processTitle: string;
  processSub: string;
  processStep1Title: string;
  processStep1Desc: string;
  processStep2Title: string;
  processStep2Desc: string;
  processStep3Title: string;
  processStep3Desc: string;
  processStep4Title: string;
  processStep4Desc: string;
  processFooterTitle: string;
  processFooterSub: string;

  // Testimonials Section
  testiTitle: string;
  testiSub: string;

  // Contact Section
  contactTitle: string;
  contactSub: string;
  contactLabelName: string;
  contactLabelEmail: string;
  contactLabelPhone: string;
  contactLabelMessage: string;
  contactPlaceholderMessage: string;
  contactBtnSend: string;
  contactBtnSending: string;
  contactSuccessMsg: string;

  // Footer Section
  footerDesc: string;
  footerRights: string;
  footerTagline: string;
}

const translations: Record<Language, TranslationDict> = {
  en: {
    navHome: 'HOME',
    navCollection: 'COLLECTION',
    navProcess: 'PROCESS',
    navFinishes: 'FINISHES',
    navBts: 'BEHIND THE SCENES',
    navTestimonials: 'REVIEWS',
    navContact: 'CONTACT',

    heroTitle: 'Crafted Without Compromise',
    heroSub: 'Bespoke kitchens, custom cabinetry and luxury interiors handcrafted with uncompromising attention to detail throughout Cape Town.',
    heroBtnStart: 'Begin Your Project',
    heroBtnExplore: 'Explore Our Craft',
    heroScroll: 'Scroll',

    portfolioTitle: 'OUR BESPOKE COLLECTION',
    portfolioSub: 'Every piece is meticulously constructed from premium grade hardwoods, designed to blend architectural form and ultimate utility.',
    portfolioFilterAll: 'ALL WORK',
    portfolioFilterKitchens: 'KITCHENS',
    portfolioFilterWardrobes: 'WARDROBES',
    portfolioFilterCabinets: 'CABINETS',
    portfolioFilterFurniture: 'FURNITURE',
    portfolioBtnInquire: 'Commission Similar Piece',
    portfolioSpecTitle: 'Specifications & Materials',
    portfolioSpecMaterials: 'Materials',
    portfolioSpecFinish: 'Finish',

    configTitle: 'MATERIAL CONFIGURATOR',
    configSub: 'Visualize your bespoke custom project. Choose from premium hardwoods and artisan finishes to configure your vision.',
    configSectionHout: 'Select Wood Specimen',
    configSectionFinish: 'Select Artisan Finish',
    configHoutSelection: 'Wood Type',
    configFinishSelection: 'Finish Style',
    configBtnInquiry: 'Request Quotation For This Build',
    configPromptPrefill: 'I am interested in a custom woodwork commission using',

    btsTitle: 'BEHIND THE SCENES',
    btsSub: 'Step inside our Cape Town workshop and see our master cabinetmakers and craftsmen shaping raw African timber into exquisite furniture.',
    btsBtnContact: 'Visit Our Workshop',

    processTitle: 'THE BESPOKE EXPERIENCE',
    processSub: 'Our meticulous design and manufacturing process guarantees exceptional results from initial concept to master installation.',
    processStep1Title: '01 / Consultation & Design',
    processStep1Desc: 'We sit down to understand your space, style, and functional needs, crafting detailed layout plans and selecting high-grade materials.',
    processStep2Title: '02 / Timber Selection',
    processStep2Desc: 'Our master craftsmen source the finest, sustainably harvested South African and international hardwoods, ensuring outstanding grain match.',
    processStep3Title: '03 / Handcrafted Precision',
    processStep3Desc: 'In our Cape Town workshop, we cut, assemble, and finish each unit by hand using classical joinery techniques coupled with modern precision.',
    processStep4Title: '04 / Flawless Installation',
    processStep4Desc: 'Our dedicated, highly-trained professional installers fit your custom cabinetry meticulously, ensuring millimeter-perfect alignment.',
    processFooterTitle: 'Ready to elevate your home?',
    processFooterSub: 'Schedule a tailored consultation with our design consultants in Cape Town today.',

    testiTitle: 'CLIENT CORRESPONDENCE',
    testiSub: 'Exquisite feedback from Cape Town clients who commissioned our bespoke kitchens and joinery services.',

    contactTitle: 'COMMISSION A CREATION',
    contactSub: 'Let us elevate your home. Contact us for a complimentary professional design consultation and detailed quotation.',
    contactLabelName: 'YOUR NAME',
    contactLabelEmail: 'EMAIL ADDRESS',
    contactLabelPhone: 'PHONE NUMBER',
    contactLabelMessage: 'PROJECT DESCRIPTION',
    contactPlaceholderMessage: 'Describe your custom kitchen, built-in wardrobe, or furniture idea in detail...',
    contactBtnSend: 'SEND COMMISSION INQUIRY',
    contactBtnSending: 'TRANSMITTING...',
    contactSuccessMsg: 'Thank you for your inquiry. Our design consultant will contact you shortly.',

    footerDesc: 'Luxury bespoke cabinet making, custom kitchens, and architectural joinery based in Cape Town, South Africa.',
    footerRights: 'All rights reserved.',
    footerTagline: 'CRAFTED IN CAPE TOWN',
  },
  af: {
    navHome: 'TUIS',
    navCollection: 'VERSAMELING',
    navProcess: 'PROSES',
    navFinishes: 'AFWERKINGS',
    navBts: 'AGTER DIE SKERMS',
    navTestimonials: 'REVIEWS',
    navContact: 'KONTAK',

    heroTitle: 'Gemaak Sonder Kompromie',
    heroSub: 'Pasgemaakte kombuise, eie kabinetwerk en luukse interieurs handgemaak met onwrikbare aandag aan detail regoor Kaapstad.',
    heroBtnStart: 'Begin Jou Projek',
    heroBtnExplore: 'Verken Ons Kuns',
    heroScroll: 'Rolle',

    portfolioTitle: 'ONS BESPOKE VERSAMELING',
    portfolioSub: 'Elke stuk word noukeurig gebou van premium gehalte hardehout, ontwerp om argitektoniese vorm en uiterste bruikbaarheid te verenig.',
    portfolioFilterAll: 'ALLE WERK',
    portfolioFilterKitchens: 'KOMBUISE',
    portfolioFilterWardrobes: 'KLEREKASTE',
    portfolioFilterCabinets: 'KABINETTE',
    portfolioFilterFurniture: 'MEUBELS',
    portfolioBtnInquire: 'Bestel Soortgelyke Stuk',
    portfolioSpecTitle: 'Spesifikasies en Materiale',
    portfolioSpecMaterials: 'Materiale',
    portfolioSpecFinish: 'Afwerking',

    configTitle: 'MATERIAAL-KONFIGURATOR',
    configSub: 'Visualiseer jou unieke pasgemaakte projek. Kies uit premium hardehout en meester-afwerkings om jou visie te konfigureer.',
    configSectionHout: 'Kies Houtsoort',
    configSectionFinish: 'Kies Meester-Afwerking',
    configHoutSelection: 'Houttipe',
    configFinishSelection: 'Afwerking-Styl',
    configBtnInquiry: 'Vra Kwotasie Vir Hierdie Bou',
    configPromptPrefill: 'Ek stel belang in \'n pasgemaakte houtwerkopdrag gemaak van',

    btsTitle: 'AGTER DIE SKERMS',
    btsSub: 'Stap in ons Kaapstadse werkswinkel en sien ons meester-skrynwerkers en ambagsmanne besig om rou Suid-Afrikaanse hout in pragtige meubels te omskep.',
    btsBtnContact: 'Besoek Ons Werkswinkel',

    processTitle: 'DIE BESPOKE ERVARING',
    processSub: 'Ons noukeurige ontwerp- en vervaardigingsproses waarborg uitsonderlike resultate vanaf die eerste konsep tot meesterlike installasie.',
    processStep1Title: '01 / Konsultasie & Ontwerp',
    processStep1Desc: 'Ons gaan sit saam om jou ruimte, styl en funksionele behoeftes te verstaan, en skep gedetailleerde planne en kies hoë-graad materiale.',
    processStep2Title: '02 / Hout Seleksie',
    processStep2Desc: 'Ons meester-ambagsmanne kry die beste, volhoubaar geoesde Suid-Afrikaanse en internasionale hardehout om die perfekte greep-passing te verseker.',
    processStep3Title: '03 / Handgemaakte Akkuraatheid',
    processStep3Desc: 'In ons Kaapstadse werkswinkel sny, monteer en voltooi ons elke eenheid met die hand deur gebruik te maak van klassieke skrynwerktegnieke.',
    processStep4Title: '04 / Foutlose Installasie',
    processStep4Desc: 'Ons toegewyde, hoogs opgeleide professionele installeerders pas jou pasgemaakte kaste noukeurig aan vir millimeter-perfekte belyning.',
    processFooterTitle: 'Gereed om jou huis te verfraai?',
    processFooterSub: 'Reël vandag nog \'n pasgemaakte konsultasie met ons ontwerpkonsultante in Kaapstad.',

    testiTitle: 'KLIËNTE-KORRESPONDENSIE',
    testiSub: 'Pragtige terugvoer van Kaapstadse kliënte wat ons pasgemaakte kombuise en skrynwerkdienste bestel het.',

    contactTitle: 'OPDRAG \'N SKEPPING',
    contactSub: 'Laat ons jou huis verhef. Kontak ons vir \'n gratis professionele ontwerpkonsultasie en gedetailleerde kwotasie.',
    contactLabelName: 'JOU NAAM',
    contactLabelEmail: 'E-POS ADRES',
    contactLabelPhone: 'TELEFOONNOMMER',
    contactLabelMessage: 'PROJEK BESKRYWING',
    contactPlaceholderMessage: 'Beskryf jou pasgemaakte kombuis, ingeboude klerekas, of meubelidee in detail...',
    contactBtnSend: 'STUUR OPDRAG NAVRAAG',
    contactBtnSending: 'STUUR DEUR...',
    contactSuccessMsg: 'Dankie vir jou navraag. Ons ontwerpkonsultant sal binnekort met jou in verbinding tree.',

    footerDesc: 'Luukse pasgemaakte kasmakery, pasgemaakte kombuise en argitektoniese skrynwerk gebaseer in Kaapstad, Suid-Afrika.',
    footerRights: 'Alle regte voorbehou.',
    footerTagline: 'GEMAAK IN KAAPSTAD',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('elegant_language');
    return (saved === 'af' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('elegant_language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
