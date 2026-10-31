import React from 'react';
import { TextReveal } from './TextReveal';
import { RevealOnScroll } from './RevealOnScroll';

type QA = { q: string; a: string };
type Group = { title: string; items: QA[] };

const GROUPS: Group[] = [
  {
    title: 'General',
    items: [
      {
        q: 'Where do you work?',
        a: 'We work across Cape Town, including Mitchells Plain, Durbanville, Bellville, Brackenfell, Century City, Sea Point, Green Point, Camps Bay, Hout Bay, Tokai and Steenberg, and we also take jobs in Stellenbosch and Paarl. There is no extra travel charge.',
      },
      {
        q: 'How does it work from first message to finished job?',
        a: 'You message us on WhatsApp or send an enquiry through this website. We visit you for a site visit, send a written quote within 3 to 5 working days, and start once you accept the quote and pay your deposit.',
      },
      {
        q: 'How much is a site visit, and when can you come?',
        a: 'A site visit costs R550, the same in every area we serve. The R550 is separate from the final price and is not deducted if you go ahead. We visit on weekends, usually within the same week that you get in touch.',
      },
      { q: 'How quickly will you reply?', a: 'Within 24 hours.' },
      {
        q: 'How long does it take to get a quote?',
        a: 'You will have your written quote 3 to 5 working days after the site visit.',
      },
      {
        q: 'How do I pay?',
        a: 'A 60% deposit secures your job once you accept the quote. The balance is paid when the job is complete. We accept EFT, cash and card.',
      },
      {
        q: 'Do you guarantee your work?',
        a: 'On custom furniture and restoration, we offer a 3-month workmanship promise. If something fails because of how it was made, such as a joint coming apart or a finish peeling, we fix it free of charge. It does not cover water damage, heavy knocks, misuse or normal wear.',
      },
      {
        q: 'Can I see your previous work?',
        a: 'Yes. Browse the collection on this website, or message us on WhatsApp and we will send photos of similar past jobs.',
      },
    ],
  },
  {
    title: 'Kitchens',
    items: [
      {
        q: 'Do you do the plumbing and electrical work?',
        a: 'No. You need to hire your own plumber and electrician. We recommend booking them early so they are ready when we are.',
      },
      {
        q: 'How long does a kitchen installation take?',
        a: 'Installation at your home takes 1 to 3 days, depending on the size of the kitchen.',
      },
      {
        q: 'What do I need to do before installation day?',
        a: 'Someone must be home while we work. Your old kitchen must be emptied of plates, food and contents. You can remove the old kitchen yourself, or tell us when you enquire if you would like us to do it.',
      },
      {
        q: 'Will you clean up afterwards?',
        a: 'Yes. We clean up and take our packaging away. If there are offcuts, we will ask if you would like to keep them.',
      },
    ],
  },
  {
    title: 'Custom Furniture',
    items: [
      {
        q: 'What do you make?',
        a: 'Dining tables, coffee tables, benches, TV units, shelving and bookshelves, sideboards and cabinets, built-in wardrobes and cupboards, and bathroom vanities. We do not build chairs or steel frames.',
      },
      {
        q: 'What wood can I choose, and what finishes?',
        a: 'Pine is our most popular choice. Oak and walnut cost about 60% more than pine. You can choose a stain or lacquer finish.',
      },
      {
        q: 'How long does a custom piece take?',
        a: 'Every piece is made to order. After your deposit, the timber arrives in about a week. The build then takes 2 to 4 weeks, starting once the deposit is paid and the timber has arrived. Large built-in wardrobes take 4 to 6 weeks.',
      },
    ],
  },
  {
    title: 'Furniture Restoration',
    items: [
      {
        q: 'What can you restore?',
        a: 'Dining and coffee tables, sideboards and cabinets, wooden chairs, bed frames, chests of drawers, veneer furniture and outdoor furniture. Antiques depend on their condition, so send us a photo. We do not restore headboards, upholstery (fabric or leather seats) or laminate furniture.',
      },
      {
        q: 'How much does restoration cost?',
        a: 'Restoration starts from R3,500 for the smallest jobs. The final price depends on the size of the piece, how much stripping is needed, repairs, the wood and the finish.',
      },
      {
        q: 'How do you get my furniture, and what does it cost?',
        a: 'You choose: we collect it, or you drop it off at our workshop. Collection is free. Delivering it back to you costs R600. If a piece is too big to move, we can restore it at your home.',
      },
      {
        q: 'How long does a restoration take?',
        a: 'Roughly 2 to 4 weeks for all types of work, from a repair to a full strip-and-refinish. The time starts once you approve the quote and your piece is in our workshop.',
      },
    ],
  },
];

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: GROUPS.flatMap((g) => g.items).map((i) => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: i.a },
  })),
};

export const FAQ: React.FC = () => (
  <section className="bg-[#faf8f5] py-16 sm:py-24 px-5 sm:px-8" aria-labelledby="faq-heading">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <div className="max-w-3xl mx-auto">
      <RevealOnScroll duration={0.8}>
        <span className="text-[#8c6517] font-semibold tracking-[0.24em] uppercase mb-3 text-xs md:text-sm block">
          GOOD TO KNOW
        </span>
        <h2 id="faq-heading" className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 mb-5 leading-tight">
          <TextReveal text="Frequently Asked Questions" />
        </h2>
        <div className="w-16 h-[1.5px] bg-[#c5a059]/40 mb-10" />
      </RevealOnScroll>

      {GROUPS.map((g) => (
        <div key={g.title} className="mb-10">
          <h3 className="font-serif text-xl sm:text-2xl text-stone-900 mb-3">{g.title}</h3>
          <div className="border-t border-stone-200">
            {g.items.map((i) => (
              <details key={i.q} className="group border-b border-stone-200">
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-stone-900 text-base sm:text-lg [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-[#c5a059]">
                  <span>{i.q}</span>
                  <span aria-hidden="true" className="shrink-0 text-2xl leading-none text-[#c5a059] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-5 pr-8 text-stone-600 text-sm sm:text-base leading-relaxed font-light">{i.a}</p>
              </details>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);
