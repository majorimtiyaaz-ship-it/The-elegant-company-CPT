import React from 'react';
import { Armchair, ChefHat, BedDouble, Hammer, ArrowRight } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';
import { WhatsAppIcon } from './WhatsAppIcon';
import { whatsappUrl, track } from './BookCTA';

const SERVICES = [
  {
    icon: Armchair,
    title: 'Custom Furniture',
    text: 'Dining tables, coffee tables, benches, beds and desks in solid wood, built to your size and finish.',
    ask: 'custom furniture',
  },
  {
    icon: ChefHat,
    title: 'Kitchen Installation',
    text: 'Bespoke kitchens, measured on site and installed by our team in Cape Town.',
    ask: 'a kitchen installation',
  },
  {
    icon: BedDouble,
    title: 'Bedroom & Built-in Cabinets',
    text: 'Built-in cupboards, wardrobes and bedroom cabinets planned around your room.',
    ask: 'bedroom or built-in cabinets',
  },
  {
    icon: Hammer,
    title: 'Furniture Restoration',
    text: 'Scratched, stained or tired pieces brought back to life. Send photos for a free quote. Collection and return delivery: R600.',
    ask: 'furniture restoration',
  },
];

export const Services: React.FC = () => (
  <section id="services" aria-labelledby="services-heading" className="w-full bg-[#faf8f5] px-6 py-16 md:py-24">
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6517] md:text-sm">
          What we do
        </span>
        <h2 id="services-heading" className="font-serif text-3xl leading-tight text-stone-900 sm:text-4xl">
          Custom furniture, kitchens and restoration in Cape Town
        </h2>
        <p className="mt-4 text-sm font-light leading-relaxed text-stone-600 sm:text-base">
          Tell us what you need on WhatsApp. Photos and rough measurements help us quote faster.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <RevealOnScroll key={s.title} delay={i * 0.08} className="h-full">
            <div className="group flex h-full flex-col rounded-sm border border-stone-200 bg-white p-6 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-[#c5a059] hover:shadow-xl sm:p-7">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-sm border border-stone-200 bg-[#faf8f5] text-[#8c6517]">
                <s.icon size={20} aria-hidden="true" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-stone-900">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-stone-600">{s.text}</p>
              <a
                href={whatsappUrl(`Hi, I'd like a quote for ${s.ask}. (via website: services)`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('services')}
                aria-label={`Get a quote for ${s.title} on WhatsApp`}
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8c6517] transition-colors hover:text-stone-900"
              >
                Get a quote
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href={whatsappUrl("Hi, I'd like a quote for a project. (via website: services)")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('services')}
          className="btn-sheen inline-flex min-h-[54px] w-full max-w-sm items-center justify-center gap-3 rounded-sm bg-[#1a1a1a] px-8 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-black sm:w-auto"
        >
          <WhatsAppIcon className="h-6 w-6 shrink-0" />
          Discuss your project
        </a>
        <p className="mt-3 text-xs text-stone-500">Free quote. A R550 call-out fee applies to site visits.</p>
      </div>
    </div>
  </section>
);
