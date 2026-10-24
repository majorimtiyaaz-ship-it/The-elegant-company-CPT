// Server-only helpers for the CRM API. Nothing here is ever sent to the browser.
import { neon } from '@neondatabase/serverless';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { STAGES, SOURCES, SERVICES, SERVICE_LABELS, phoneIsPlausible } from '../../crm/shared.js';
import type { Source, Stage } from '../../crm/shared.js';

// ---------- database ----------

let _sql: any = null;
export function db(): any {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');
    _sql = neon(url);
  }
  return _sql;
}

let schemaReady = false;
export async function ensureSchema(): Promise<void> {
  if (schemaReady) return;
  const sql = db();
  const stages = STAGES.map((s) => `'${s}'`).join(',');
  await sql.query(`create table if not exists leads (
    id uuid primary key default gen_random_uuid(),
    submission_id text unique,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    name text not null,
    phone text not null,
    email text,
    service text not null,
    suburb text,
    details text,
    entry text not null default 'website',
    source text not null default 'Unknown',
    source_first text, source_first_detail text,
    source_last text, source_last_detail text,
    stage text not null default 'New Lead' check (stage in (${stages})),
    quote_amount numeric(12,2),
    lost_reason text,
    next_follow_up date,
    last_contact date
  )`);
  await sql.query(`create table if not exists activities (
    id bigserial primary key,
    lead_id uuid not null references leads(id) on delete cascade,
    at timestamptz not null default now(),
    kind text not null,
    text text not null
  )`);
  await sql.query('create index if not exists activities_lead_idx on activities(lead_id, at)');
  await sql.query(`create table if not exists rate_events (
    key text not null,
    at timestamptz not null default now()
  )`);
  await sql.query('create index if not exists rate_events_idx on rate_events(key, at)');
  schemaReady = true;
}

// Dates/times are cast in SQL so the browser always receives plain strings and numbers.
export const LEAD_COLS = `id::text as id,
  to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
  name, phone, email, service, suburb, details, entry, source,
  source_first, source_first_detail, source_last, source_last_detail,
  stage, quote_amount::float8 as quote_amount, lost_reason,
  to_char(next_follow_up, 'YYYY-MM-DD') as next_follow_up,
  to_char(last_contact, 'YYYY-MM-DD') as last_contact`;

export async function addActivity(leadId: string, kind: string, text: string) {
  await db().query('insert into activities (lead_id, kind, text) values ($1, $2, $3)', [leadId, kind, text]);
}

// ---------- http helpers ----------

export function send(res: any, status: number, body: unknown, extraHeaders: Record<string, string> = {}) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  for (const [k, v] of Object.entries(extraHeaders)) res.setHeader(k, v);
  res.status(status).json(body);
}

export function readBody(req: any): Record<string, any> | null {
  const b = req.body;
  if (b && typeof b === 'object' && !Buffer.isBuffer(b)) return b;
  if (typeof b === 'string' && b.length < 20000) {
    try {
      const parsed = JSON.parse(b);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}

export function sameOrigin(req: any): boolean {
  const origin = req.headers?.origin;
  if (!origin) return true; // non-browser or same-origin GET; the other checks still apply
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

// ---------- rate limiting (stored in the database so it works across serverless instances) ----------

export function clientKey(req: any): string {
  const fwd = String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const salt = process.env.SESSION_SECRET || 'elegant';
  return createHash('sha256').update(salt + '|' + fwd).digest('hex').slice(0, 24);
}

/** Returns true if the action is allowed (and records it). */
export async function rateLimit(key: string, max: number, windowSeconds: number): Promise<boolean> {
  const sql = db();
  const rows = await sql.query(
    `select count(*)::int as n from rate_events where key = $1 and at > now() - ($2 || ' seconds')::interval`,
    [key, String(windowSeconds)],
  );
  if ((rows[0]?.n ?? 0) >= max) return false;
  await sql.query('insert into rate_events (key) values ($1)', [key]);
  if (Math.random() < 0.05) await sql.query(`delete from rate_events where at < now() - interval '2 days'`);
  return true;
}

// ---------- sessions (signed cookie, no extra packages) ----------

const COOKIE = 'crm_session';
const SESSION_DAYS = 7;

function sign(value: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET must be set (32+ characters)');
  return createHmac('sha256', secret).update(value).digest('hex');
}

export function sessionCookie(): string {
  const exp = Date.now() + SESSION_DAYS * 86400_000;
  const value = `${exp}.${sign(String(exp))}`;
  const secure = process.env.NODE_ENV === 'development' ? '' : '; Secure';
  return `${COOKIE}=${value}; HttpOnly; SameSite=Strict; Path=/api; Max-Age=${SESSION_DAYS * 86400}${secure}`;
}

export function clearCookie(): string {
  return `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/api; Max-Age=0`;
}

export function isLoggedIn(req: any): boolean {
  try {
    const header = String(req.headers?.cookie || '');
    const part = header.split(';').map((s) => s.trim()).find((s) => s.startsWith(COOKIE + '='));
    if (!part) return false;
    const [exp, sig] = part.slice(COOKIE.length + 1).split('.');
    if (!exp || !sig || Number(exp) < Date.now()) return false;
    const expected = sign(exp);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function passwordMatches(candidate: string): boolean {
  const real = process.env.CRM_PASSWORD;
  if (!real || real.length < 10) return false; // refuse to run with a weak or missing password
  const a = createHash('sha256').update(candidate).digest();
  const b = createHash('sha256').update(real).digest();
  return timingSafeEqual(a, b);
}

// ---------- input cleaning ----------

export function clean(v: unknown, max: number): string {
  if (typeof v !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  return v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, max);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface LeadInput {
  name: string;
  phone: string;
  email: string | null;
  service: string;
  suburb: string | null;
  details: string | null;
}

export function validateLead(body: Record<string, any>, mode: 'public' | 'manual'): { ok: boolean; value?: LeadInput; error?: string } {
  const name = clean(body.name, 100);
  if (name.length < 2) return { ok: false, error: 'Please enter your name.' };
  const phone = clean(body.phone, 30);
  if (!phone || !phoneIsPlausible(phone)) return { ok: false, error: 'Please enter a valid phone or WhatsApp number.' };
  const email = clean(body.email, 254);
  if (email && !EMAIL_RE.test(email)) return { ok: false, error: 'That email address does not look right.' };

  let service = '';
  if (mode === 'public') {
    const found = SERVICES.find((s) => s.code === body.type);
    if (!found) return { ok: false, error: 'Please choose what you need.' };
    service = found.label;
  } else {
    service = clean(body.service, 100);
    if (!SERVICE_LABELS.includes(service)) return { ok: false, error: 'Please choose a service.' };
  }

  let details = clean(body.details, 2000);
  if (mode === 'public') {
    // The form's optional extras are kept with the customer's message so nothing is lost.
    const extras: string[] = [];
    const dims = clean(body.dimensions, 120);
    const finish = clean(body.finish, 60);
    if (dims) extras.push(`Dimensions: ${dims}`);
    if (finish) extras.push(`Finish: ${finish}`);
    if (extras.length) details = [details, extras.join(' · ')].filter(Boolean).join('\n\n');
  }
  return {
    ok: true,
    value: {
      name,
      phone,
      email: email || null,
      service,
      suburb: clean(body.area ?? body.suburb, 100) || null,
      details: details || null,
    },
  };
}

// ---------- source detection (honest: Unknown when we cannot tell) ----------

export interface Touch {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  gclid?: boolean | string;
  fbclid?: boolean | string;
  referrer_host?: string;
}

export function classifySource(touch: Touch | null | undefined): { source: Source; detail: string | null } {
  if (!touch || typeof touch !== 'object') return { source: 'Unknown', detail: null };
  const t = (v: unknown) => clean(v, 100).toLowerCase();
  const us = t(touch.utm_source);
  const um = t(touch.utm_medium);
  const uc = t(touch.utm_campaign);
  const host = t(touch.referrer_host).replace(/^www\./, '');
  const campaign = [us && `utm: ${us}`, um, uc].filter(Boolean).join(' / ');

  if (us) {
    if (us.includes('instagram') || us === 'ig') return { source: 'Instagram', detail: campaign };
    if (us.includes('facebook') || us === 'fb' || us === 'meta') return { source: 'Facebook', detail: campaign };
    if (us.includes('google')) return { source: 'Google', detail: campaign };
    if (us.includes('whatsapp')) return { source: 'WhatsApp', detail: campaign };
    return { source: 'Other', detail: campaign };
  }
  const hostIs = (d: string) => host === d || host.endsWith('.' + d);
  if (hostIs('instagram.com')) return { source: 'Instagram', detail: `referrer: ${host}` };
  if (hostIs('facebook.com') || hostIs('fb.com') || hostIs('fb.me')) return { source: 'Facebook', detail: `referrer: ${host}` };
  if (touch.gclid) return { source: 'Google', detail: 'Google click ID (gclid)' };
  if (touch.fbclid) return { source: 'Facebook', detail: 'Meta click ID (fbclid) — could be Facebook or Instagram' };
  if (/(^|\.)google\.[a-z.]+$/.test(host)) return { source: 'Google', detail: `referrer: ${host} (search, not an ad)` };
  if (hostIs('wa.me') || hostIs('whatsapp.com')) return { source: 'WhatsApp', detail: `referrer: ${host}` };
  if (host) return { source: 'Other', detail: `referrer: ${host}` };
  return { source: 'Unknown', detail: null };
}

export function pickStage(v: unknown): Stage | null {
  return STAGES.includes(v as Stage) ? (v as Stage) : null;
}
export function pickSource(v: unknown): Source | null {
  return SOURCES.includes(v as Source) ? (v as Source) : null;
}
