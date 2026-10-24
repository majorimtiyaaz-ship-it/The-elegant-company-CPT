// Shared by the CRM screens (browser) and the CRM API (server).
// Keep this file free of browser-only and server-only code.

export const STAGES = [
  'New Lead',
  'Contacted',
  'Site Visit Booked',
  'Quote Sent',
  'Negotiation',
  'Won',
  'Lost',
] as const;
export type Stage = (typeof STAGES)[number];
export const OPEN_STAGES: readonly Stage[] = STAGES.slice(0, 5);
export const QUOTE_OUT_STAGES: readonly Stage[] = ['Quote Sent', 'Negotiation'];

export const SOURCES = [
  'Google',
  'Facebook',
  'Instagram',
  'Website — Direct',
  'WhatsApp',
  'Referral',
  'Other',
  'Unknown',
] as const;
export type Source = (typeof SOURCES)[number];

// Same six options as the website quote form (components/Contact.tsx).
export const SERVICES = [
  { code: 'cupboards', label: 'Built-in Cupboards & Wardrobes' },
  { code: 'kitchen', label: 'Custom Kitchen Installation' },
  { code: 'table', label: 'Solid Hardwood Dining / Coffee Table' },
  { code: 'bench', label: 'Custom Wooden Bench' },
  { code: 'restoration', label: 'Antique Furniture Restoration' },
  { code: 'other', label: 'Other Bespoke Wood Creation' },
] as const;
export const SERVICE_LABELS: string[] = SERVICES.map((s) => s.label);

export interface Lead {
  id: string;
  created_at: string; // ISO UTC
  name: string;
  phone: string;
  email: string | null;
  service: string;
  suburb: string | null;
  details: string | null;
  entry: 'website' | 'manual';
  source: Source;
  source_first: string | null;
  source_first_detail: string | null;
  source_last: string | null;
  source_last_detail: string | null;
  stage: Stage;
  quote_amount: number | null;
  lost_reason: string | null;
  next_follow_up: string | null; // YYYY-MM-DD
  last_contact: string | null; // YYYY-MM-DD
}

export interface Activity {
  id: number;
  at: string;
  kind: string;
  text: string;
}

// ---------- phone helpers ----------

/** Returns digits-only international form for South African numbers, or null if it can't be trusted. */
export function whatsappDigits(raw: string): string | null {
  let d = (raw || '').replace(/[^\d+]/g, '');
  const plus = d.startsWith('+');
  d = d.replace(/\D/g, '');
  if (plus) {
    return d.length >= 10 && d.length <= 15 ? d : null;
  }
  if (d.startsWith('00')) d = d.slice(2);
  else if (d.startsWith('0')) d = '27' + d.slice(1);
  else if (!d.startsWith('27')) return null;
  return d.length === 11 ? d : null; // 27 + 9 digits
}

export function whatsappLink(raw: string, text?: string): string | null {
  const d = whatsappDigits(raw);
  if (!d) return null;
  return `https://wa.me/${d}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export function phoneIsPlausible(raw: string): boolean {
  const d = (raw || '').replace(/\D/g, '');
  return d.length >= 9 && d.length <= 15;
}

// ---------- dates & money ----------

/** Today's date in South Africa as YYYY-MM-DD. */
export function todayZA(now: Date = new Date()): string {
  return now.toLocaleDateString('en-CA', { timeZone: 'Africa/Johannesburg' });
}

export function addDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

export function formatZAR(n: number): string {
  return 'R ' + Math.round(n).toLocaleString('en-ZA').replace(/\u00a0/g, ' ');
}

// ---------- dashboard numbers (all derived from real records) ----------

export interface Metrics {
  openCount: number;
  pipelineValue: number; // open stages, known amounts only
  openMissingAmount: number; // open leads with no amount recorded
  quotesAwaitingValue: number;
  quotesAwaitingCount: number;
  wonValue: number;
  wonCount: number;
  wonMissingAmount: number;
  followUpsOutstanding: number; // due today or overdue
  followUpsOverdue: number;
  followUpsDueToday: number;
  byStage: { stage: Stage; count: number; value: number }[];
  bySource: { source: Source; total: number; won: number; wonValue: number }[];
  total: number;
}

export function computeMetrics(leads: Lead[], today: string): Metrics {
  const amt = (l: Lead) => (typeof l.quote_amount === 'number' && l.quote_amount > 0 ? l.quote_amount : 0);
  const has = (l: Lead) => typeof l.quote_amount === 'number' && l.quote_amount > 0;
  const open = leads.filter((l) => OPEN_STAGES.includes(l.stage));
  const quotes = leads.filter((l) => QUOTE_OUT_STAGES.includes(l.stage));
  const won = leads.filter((l) => l.stage === 'Won');
  const due = open.filter((l) => l.next_follow_up && l.next_follow_up <= today);
  return {
    total: leads.length,
    openCount: open.length,
    pipelineValue: open.reduce((s, l) => s + amt(l), 0),
    openMissingAmount: open.filter((l) => !has(l)).length,
    quotesAwaitingValue: quotes.reduce((s, l) => s + amt(l), 0),
    quotesAwaitingCount: quotes.length,
    wonValue: won.reduce((s, l) => s + amt(l), 0),
    wonCount: won.length,
    wonMissingAmount: won.filter((l) => !has(l)).length,
    followUpsOutstanding: due.length,
    followUpsOverdue: due.filter((l) => (l.next_follow_up as string) < today).length,
    followUpsDueToday: due.filter((l) => l.next_follow_up === today).length,
    byStage: STAGES.map((stage) => {
      const inStage = leads.filter((l) => l.stage === stage);
      return { stage, count: inStage.length, value: inStage.reduce((s, l) => s + amt(l), 0) };
    }),
    bySource: SOURCES.map((source) => {
      const ofSource = leads.filter((l) => l.source === source);
      const w = ofSource.filter((l) => l.stage === 'Won');
      return { source, total: ofSource.length, won: w.length, wonValue: w.reduce((s, l) => s + amt(l), 0) };
    }),
  };
}

export type FollowUpGroups = {
  overdue: Lead[];
  today: Lead[];
  upcoming: Lead[];
  none: Lead[];
};

export function groupFollowUps(leads: Lead[], today: string): FollowUpGroups {
  const open = leads.filter((l) => OPEN_STAGES.includes(l.stage));
  const byDate = (a: Lead, b: Lead) => (a.next_follow_up || '').localeCompare(b.next_follow_up || '');
  return {
    overdue: open.filter((l) => l.next_follow_up && l.next_follow_up < today).sort(byDate),
    today: open.filter((l) => l.next_follow_up === today),
    upcoming: open.filter((l) => l.next_follow_up && l.next_follow_up > today).sort(byDate),
    none: open.filter((l) => !l.next_follow_up),
  };
}
