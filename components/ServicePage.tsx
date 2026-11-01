import React from 'react';
import { EnquiryForm } from './EnquiryForm';
import { ServicePageData, SERVICE_PAGES, COMMON } from '../lib/servicePages';
import { whatsappUrl } from './BookCTA';

const gold = 'text-[#8c6517]';

export const ServicePage: React.FC<{ page: ServicePageData }> = ({ page }) => {
  const others = SERVICE_PAGES.filter((p) => p.slug !== page.slug);
  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans">
      <header className="bg-stone-950 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <a href="/" className="font-serif text-lg uppercase tracking-[0.22em] text-[#f8f7f5] sm:text-xl">
            The Elegant Company
          </a>
          <a href="/" className="text-xs uppercase tracking-[0.18em] text-[#c5a059]">
            Home
          </a>
        </div>
      </header>

      <section className="bg-stone-950 px-5 pb-14 pt-6 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#c5a059]">
            Mitchells Plain · Cape Town
          </p>
          <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl">{page.h1}</h1>
          <p className="mt-5 text-base font-light leading-relaxed text-stone-300 sm:text-lg">{page.intro}</p>
          <a
            href="#enquiry"
            className="mt-8 inline-flex min-h-[50px] items-center bg-[#c5a059] px-7 text-xs font-bold uppercase tracking-[0.18em] text-stone-950"
          >
            Start your enquiry
          </a>
        </div>
      </section>

      <main className="px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          {page.facts.map((f) => (
            <section key={f.title} className="mb-10">
              <h2 className="mb-3 font-serif text-2xl text-stone-900">{f.title}</h2>
              <p className="font-light leading-relaxed text-stone-600">{f.body}</p>
            </section>
          ))}

          <section className="mb-12">
            <h2 className="mb-5 font-serif text-2xl text-stone-900">How it works</h2>
            <ol className="space-y-5">
              {COMMON.process.map((s) => (
                <li key={s.title}>
                  <h3 className={`mb-1 text-xs font-bold uppercase tracking-[0.18em] ${gold}`}>{s.title}</h3>
                  <p className="font-light leading-relaxed text-stone-600">{s.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="mb-3 font-serif text-2xl text-stone-900">{COMMON.areaTitle}</h2>
            <p className="font-light leading-relaxed text-stone-600">{COMMON.area}</p>
            <h3 className={`mb-1 mt-6 text-xs font-bold uppercase tracking-[0.18em] ${gold}`}>{COMMON.hoursTitle}</h3>
            <p className="font-light leading-relaxed text-stone-600">{COMMON.hours}</p>
          </section>

          <section className="mb-14">
            <h2 className="mb-3 font-serif text-2xl text-stone-900">Questions</h2>
            <div className="border-t border-stone-200">
              {page.faqs.map((i) => (
                <details key={i.q} className="group border-b border-stone-200">
                  <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base text-stone-900 sm:text-lg [&::-webkit-details-marker]:hidden">
                    <span>{i.q}</span>
                    <span aria-hidden="true" className="shrink-0 text-2xl leading-none text-[#c5a059] transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="pb-5 pr-8 text-sm font-light leading-relaxed text-stone-600 sm:text-base">{i.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="enquiry" className="scroll-mt-6 border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 font-serif text-2xl text-stone-900">Start your enquiry</h2>
            <EnquiryForm initialService={page.service} />
          </section>
        </div>
      </main>

      <footer className="bg-stone-950 px-5 py-12 text-sm text-stone-400 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="font-serif text-lg uppercase tracking-[0.22em] text-[#f8f7f5]">The Elegant Company</p>
          <p>
            Whitehall Close, Portland, Mitchells Plain, Cape Town, 7785
            <br />
            <a href="tel:0734851573" className="text-stone-300">073 485 1573</a>
            {' · '}
            <a href={whatsappUrl('Hi, I would like to enquire about a project.')} className="text-stone-300">WhatsApp</a>
          </p>
          <p>
            {others.map((o, i) => (
              <React.Fragment key={o.slug}>
                {i > 0 && ' · '}
                <a href={`/${o.slug}/`} className="text-stone-300">{o.h1.replace(' in Cape Town', '')}</a>
              </React.Fragment>
            ))}
            {' · '}
            <a href="/" className="text-stone-300">Home</a>
          </p>
        </div>
      </footer>
    </div>
  );
};
