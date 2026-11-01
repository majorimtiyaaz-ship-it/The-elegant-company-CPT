// Content for the three service pages. Every fact here comes from the owner's FAQ interview
// or from the existing website. Nothing is invented.

export type Fact = { title: string; body: string };
export type ServicePageData = {
  slug: string;
  service: 'restoration' | 'custom' | 'kitchen';
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  facts: Fact[];
  faqs: { q: string; a: string }[];
};

export const SITE_URL = 'https://the-elegant-company-cpt.vercel.app';

const PROCESS: Fact[] = [
  {
    title: '1. Get in touch',
    body: 'Send an enquiry below or message us on WhatsApp. We reply within 24 hours.',
  },
  {
    title: '2. Site visit',
    body: 'A site visit costs R550 in Cape Town and R700 in Stellenbosch and Paarl. If you go ahead with the job, the fee is deducted from your final price. We visit on weekends, usually within the same week that you get in touch.',
  },
  {
    title: '3. Written quote',
    body: 'You will have your written quote 3 to 5 working days after the site visit.',
  },
  {
    title: '4. Deposit and payment',
    body: 'A 60% deposit secures your job once you accept the quote. The balance is paid when the job is complete. We accept EFT, cash and card.',
  },
];

export const SERVICE_PAGES: ServicePageData[] = [
  {
    slug: 'furniture-restoration-cape-town',
    service: 'restoration',
    seoTitle: 'Furniture Restoration Cape Town | The Elegant Company',
    seoDescription:
      'Furniture restoration in Cape Town from R3,500. We collect or you drop off at our Mitchells Plain workshop. 3-month workmanship promise. Typically 2 to 4 weeks.',
    h1: 'Furniture Restoration in Cape Town',
    intro:
      'We restore solid wood and veneer furniture at our workshop in Portland, Mitchells Plain. You can drop your piece off, or we collect it. If a piece is too big to move, we can restore it at your home.',
    facts: [
      {
        title: 'What we restore',
        body: 'Dining and coffee tables, sideboards and cabinets, wooden chairs, bed frames, chests of drawers, veneer furniture and outdoor furniture. Antiques depend on their condition, so send us a photo. We do not restore headboards, upholstery (fabric or leather seats) or laminate furniture.',
      },
      {
        title: 'What it costs',
        body: 'Restoration starts from R3,500 for the smallest jobs. The final price depends on the size of the piece, how much stripping is needed, repairs, the wood and the finish.',
      },
      {
        title: 'How long it takes',
        body: 'Roughly 2 to 4 weeks for all types of work, from a repair to a full strip-and-refinish. The time starts once you approve the quote and your piece is in our workshop.',
      },
      {
        title: 'Collection and delivery',
        body: 'You choose: we collect it, or you drop it off at our workshop. Collection is free. Delivering it back to you costs R600.',
      },
      {
        title: 'Our workmanship promise',
        body: 'We give a 3-month workmanship promise. If something fails because of how the work was done, such as a finish peeling or a joint coming apart, we fix it free of charge. It does not cover water damage, heavy knocks, misuse or normal wear.',
      },
    ],
    faqs: [
      { q: 'Can you restore an antique?', a: 'It depends on its condition. Send us a photo and we will tell you honestly what is possible.' },
      { q: 'Do you restore upholstered chairs or headboards?', a: 'No. We restore wooden chairs and bed frames, but not upholstery, headboards or laminate furniture.' },
      { q: 'What does restoration start from?', a: 'From R3,500 for the smallest jobs. Size, stripping, repairs, the wood and the finish decide the final price.' },
      { q: 'How long will my furniture be with you?', a: 'Roughly 2 to 4 weeks, starting once you approve the quote and the piece is in our workshop.' },
    ],
  },
  {
    slug: 'custom-furniture-cape-town',
    service: 'custom',
    seoTitle: 'Custom Furniture Cape Town | The Elegant Company',
    seoDescription:
      'Made-to-order solid wood furniture in Cape Town: tables, benches, TV units, sideboards, built-in wardrobes and vanities. Pine, oak or walnut. 3-month workmanship promise.',
    h1: 'Custom Furniture in Cape Town',
    intro:
      'We build solid wood furniture to order at our workshop in Portland, Mitchells Plain. Every piece is made for your space, in the wood and finish you choose.',
    facts: [
      {
        title: 'What we make',
        body: 'Dining tables, coffee tables, benches, TV units, shelving and bookshelves, sideboards and cabinets, built-in wardrobes and cupboards, and bathroom vanities. We do not build chairs or steel frames.',
      },
      {
        title: 'Wood and finish',
        body: 'Pine is our most popular choice. Oak and walnut cost about 60% more than pine. You can choose a stain or lacquer finish.',
      },
      {
        title: 'How long it takes',
        body: 'Every piece is made to order. After your deposit, the timber arrives in about a week. The build then takes 2 to 4 weeks, starting once the deposit is paid and the timber has arrived. Large built-in wardrobes take 4 to 6 weeks.',
      },
      {
        title: 'Our workmanship promise',
        body: 'We give a 3-month workmanship promise. If something fails because of how it was made, such as a joint coming apart or a finish peeling, we fix it free of charge. It does not cover water damage, heavy knocks, misuse or normal wear.',
      },
    ],
    faqs: [
      { q: 'Do you build chairs?', a: 'No. We do not build chairs or steel frames.' },
      { q: 'Which woods can I choose?', a: 'Pine is our most popular choice. Oak and walnut cost about 60% more than pine.' },
      { q: 'How long does a custom piece take?', a: 'The timber arrives about a week after your deposit, then the build takes 2 to 4 weeks. Large built-in wardrobes take 4 to 6 weeks.' },
      { q: 'Can I see your previous work?', a: 'Yes. Browse the collection on our home page, or message us on WhatsApp and we will send photos of similar past jobs.' },
    ],
  },
  {
    slug: 'kitchen-installation-cape-town',
    service: 'kitchen',
    seoTitle: 'Kitchen Installation Cape Town | The Elegant Company',
    seoDescription:
      'Kitchen installation in Cape Town: new kitchens, replacements and upgrades, installed in 1 to 3 days. Site visit from R550, deducted if you proceed.',
    h1: 'Kitchen Installation in Cape Town',
    intro:
      'We install new kitchens, replacement kitchens and kitchen upgrades for homeowners and families across Cape Town, Stellenbosch and Paarl.',
    facts: [
      {
        title: 'How long installation takes',
        body: 'Installation at your home takes 1 to 3 days, depending on the size of the kitchen.',
      },
      {
        title: 'Plumbing and electrical',
        body: 'We do not do plumbing or electrical work. You need to hire your own plumber and electrician, and we recommend booking them early so they are ready when we are.',
      },
      {
        title: 'Before installation day',
        body: 'Someone must be home while we work. Your old kitchen must be emptied of plates, food and contents. You can remove the old kitchen yourself, or tell us when you enquire if you would like us to do it.',
      },
      {
        title: 'After we finish',
        body: 'We clean up and take our packaging away. If there are offcuts, we will ask if you would like to keep them.',
      },
    ],
    faqs: [
      { q: 'Do you do the plumbing and electrical work?', a: 'No. You hire your own plumber and electrician. Book them early so they are ready when we are.' },
      { q: 'How long does installation take?', a: '1 to 3 days, depending on the size of the kitchen.' },
      { q: 'What must I do before installation day?', a: 'Make sure someone is home, and that your old kitchen is emptied of plates, food and contents.' },
      { q: 'Will you clean up?', a: 'Yes. We clean up and take our packaging away, and we ask if you would like to keep any offcuts.' },
    ],
  },
];

export const COMMON = {
  process: PROCESS,
  areaTitle: 'Where we work',
  area: 'We work across Cape Town, including Mitchells Plain, Durbanville, Bellville, Brackenfell, Century City, Sea Point, Green Point, Camps Bay, Hout Bay, Tokai and Steenberg, and we also take jobs in Stellenbosch and Paarl.',
  hoursTitle: 'Opening hours',
  hours: 'Saturday and Sunday, 08:00 to 20:00. Site visits are by appointment.',
};

export function findServicePage(pathname: string): ServicePageData | undefined {
  const clean = pathname.replace(/\/+$/, '').replace(/^\//, '');
  return SERVICE_PAGES.find((p) => p.slug === clean);
}
