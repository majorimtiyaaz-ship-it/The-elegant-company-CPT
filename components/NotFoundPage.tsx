import React from 'react';
import { SERVICE_PAGES } from '../lib/servicePages';
import { whatsappUrl } from './BookCTA';

export const NOT_FOUND_META = {
  seoTitle: 'Page not found | The Elegant Company, Cape Town',
  seoDescription: 'We could not find that page. Go back to The Elegant Company home page or choose one of our services.',
};

export const NotFoundPage: React.FC = () => (
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
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#c5a059]">Error 404</p>
        <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl">This page could not be found</h1>
        <p className="mt-5 text-base font-light leading-relaxed text-stone-300 sm:text-lg">
          The link may be old or mistyped. Head back home, or pick a service below. If you were looking for a quote, we reply within 24 hours.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/"
            className="inline-flex min-h-[50px] items-center justify-center bg-[#c5a059] px-7 text-xs font-bold uppercase tracking-[0.18em] text-stone-950"
          >
            Back to home
          </a>
          <a
            href={whatsappUrl('Hi, I would like to enquire about a project.')}
            className="inline-flex min-h-[50px] items-center justify-center border border-stone-600 px-7 text-xs font-bold uppercase tracking-[0.18em] text-stone-200"
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </section>

    <main className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-2xl text-stone-900">Our services</h2>
        <ul className="mt-4 space-y-3 text-[15px] font-light text-stone-700">
          {SERVICE_PAGES.map((p) => (
            <li key={p.slug}>
              <a href={`/${p.slug}/`} className="text-[#8c6517] underline underline-offset-4">
                {p.h1}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>

    <footer className="bg-stone-950 px-5 py-10 text-sm text-stone-400 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p>
          The Elegant Company · Whitehall Close, Portland, Mitchells Plain, Cape Town
          <br />
          <a href="tel:0734851573" className="text-stone-300">073 485 1573</a>
          {' · '}
          <a href="/" className="text-stone-300">Home</a>
          {' · '}
          <a href="/privacy-policy/" className="text-stone-300">Privacy Policy</a>
        </p>
      </div>
    </footer>
  </div>
);
