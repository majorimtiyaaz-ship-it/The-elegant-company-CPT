// Remembers HOW a visitor arrived (campaign tags and referring site) so the quote form can
// send it with the enquiry. Stores only what is needed to classify the source:
// utm tags, whether a Google/Meta click ID was present (not the ID itself), and the referring
// site's host name (not the full address). Nothing else is collected.

export interface Touch {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  gclid?: boolean;
  fbclid?: boolean;
  referrer_host?: string;
}

const FIRST = 'ec_attr_first';
const LAST = 'ec_attr_last';

function cap(v: string | null): string | undefined {
  const s = (v || '').trim().slice(0, 100);
  return s || undefined;
}

function currentTouch(): Touch {
  const p = new URLSearchParams(window.location.search);
  const t: Touch = {
    utm_source: cap(p.get('utm_source')),
    utm_medium: cap(p.get('utm_medium')),
    utm_campaign: cap(p.get('utm_campaign')),
    gclid: p.has('gclid') || undefined,
    fbclid: p.has('fbclid') || undefined,
  };
  try {
    if (document.referrer) {
      const host = new URL(document.referrer).host;
      if (host && host !== window.location.host) t.referrer_host = host.slice(0, 100);
    }
  } catch {
    /* ignore bad referrer */
  }
  return t;
}

function hasSignal(t: Touch): boolean {
  return Object.values(t).some((v) => v !== undefined);
}

export function captureAttribution(): void {
  try {
    const t = currentTouch();
    if (!hasSignal(t)) return; // never invent a source: no signal, nothing stored
    localStorage.setItem(LAST, JSON.stringify(t));
    if (!localStorage.getItem(FIRST)) localStorage.setItem(FIRST, JSON.stringify(t));
  } catch {
    /* storage blocked: the lead is simply recorded with an unknown source */
  }
}

export function getAttribution(): { first: Touch | null; last: Touch | null } {
  try {
    const read = (k: string) => {
      const raw = localStorage.getItem(k);
      return raw ? (JSON.parse(raw) as Touch) : null;
    };
    return { first: read(FIRST), last: read(LAST) };
  } catch {
    return { first: null, last: null };
  }
}
