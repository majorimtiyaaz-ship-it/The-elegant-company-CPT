import React, { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

const WHATSAPP_NUMBER = '27638980781';

export type Source = 'sticky' | 'gallery' | 'hero' | 'table' | 'services' | 'call' | 'form' | 'contact';

export const PHONE_TEL = 'tel:0734851573';

export function whatsappUrl(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// The table section's button says "call-out", so its message does too. Everywhere else the
// page promises a free quote, so the pre-filled message asks for one (not the paid call-out).
export function bookUrl(source: Source) {
  const text =
    source === 'table'
      ? `Hi, I'd like to book a call-out. (via website: ${source})`
      : `Hi, I'd like a quote for a project. (via website: ${source})`;
  return whatsappUrl(text);
}

export function track(source: Source, event = 'book_click') {
  const w = window as any;
  if (typeof w.gtag === 'function') {
    w.gtag('event', event, { source });
  }
}

/**
 * True once the visitor has scrolled past 30% of the page, and false again
 * when the contact form or footer is on screen (they're already at the end).
 */
export function useBookBarVisible() {
  const [pastThreshold, setPastThreshold] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setPastThreshold(max > 0 && window.scrollY / max > 0.3);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const id = (e.target as HTMLElement).id;
        if (e.isIntersecting) visible.add(id);
        else visible.delete(id);
      });
      setAtEnd(visible.size > 0);
    });
    ['contact', 'site-footer', 'table-story'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return pastThreshold && !atEnd;
}

/* Sticky bar: slides in after 30% scroll */
export const StickyBookBar: React.FC = () => {
  const show = useBookBarVisible();

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-[9998] px-4 pt-3 transition-all duration-300 motion-reduce:transition-none ${
        show
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-full opacity-0'
      }`}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex w-full max-w-md items-stretch gap-2">
      <a
        href={bookUrl('sticky')}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('sticky')}
        tabIndex={show ? 0 : -1}
        className="flex min-h-[52px] min-w-0 flex-1 items-center justify-center gap-3 rounded-sm border border-[#c5a059] bg-[#1a1a1a] px-6 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] focus-visible:ring-offset-2"
      >
        <WhatsAppIcon className="h-6 w-6 shrink-0" />
        Book on WhatsApp
      </a>
        <a
          href={PHONE_TEL}
          onClick={() => track('call', 'call_click')}
          tabIndex={show ? 0 : -1}
          aria-label="Call The Elegant Company"
          className="flex min-h-[52px] w-[56px] shrink-0 items-center justify-center rounded-sm border border-[#c5a059] bg-white text-[#1a1a1a] shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-transform duration-200 active:scale-[0.96]"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};

/* Full-width CTA: placed straight after the gallery */
export const GalleryCTA: React.FC = () => (
  <section className="w-full bg-[#1a1a1a] px-6 py-16 text-center md:py-24">
    <div className="mx-auto max-w-2xl">
      <h2 className="text-3xl leading-tight text-white md:text-5xl">
        Like what you see? Let's build yours.
      </h2>
      <p className="mt-4 text-base text-white/70 md:text-lg">
        Free quote, no obligation. We reply within 24 hours.
      </p>
      <a
        href={bookUrl('gallery')}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('gallery')}
        className="btn-sheen btn-sheen-gold mt-8 inline-flex min-h-[54px] w-full max-w-sm items-center justify-center gap-3 rounded-sm bg-white px-8 text-xs font-bold uppercase tracking-[0.2em] text-[#1a1a1a] transition-all duration-300 hover:bg-[#f5efe3] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] md:w-auto"
      >
        <WhatsAppIcon className="h-6 w-6 shrink-0" />
        Book on WhatsApp
      </a>
    </div>
  </section>
);
