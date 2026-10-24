// PRIVATE endpoint: every action except "login" requires the signed session cookie.
import {
  LEAD_COLS, addActivity, clean, clearCookie, clientKey, db, ensureSchema, isLoggedIn, passwordMatches,
  pickSource, pickStage, rateLimit, readBody, sameOrigin, send, sessionCookie, validateLead,
} from './_lib/core.js';
import type { LeadInput } from './_lib/core.js';
import { SERVICE_LABELS, STAGES, todayZA } from '../crm/shared.js';

const YMD = /^\d{4}-\d{2}-\d{2}$/;
const ID = /^[0-9a-f-]{36}$/;

function ymdOrNull(v: unknown): string | null | undefined {
  if (v === null || v === '') return null;
  if (typeof v === 'string' && YMD.test(v) && !Number.isNaN(Date.parse(v))) return v;
  return undefined; // invalid
}

export default async function handler(req: any, res: any) {
  if (!sameOrigin(req)) return send(res, 403, { ok: false, error: 'Not allowed' });
  const action = String(req.query?.action || '');

  try {
    // ---- login (the only action that does not need a session) ----
    if (action === 'login') {
      if (req.method !== 'POST') return send(res, 405, { ok: false });
      await ensureSchema();
      if (!(await rateLimit('login:' + clientKey(req), 8, 900))) {
        return send(res, 429, { ok: false, error: 'Too many attempts. Please wait 15 minutes.' });
      }
      const body = readBody(req) || {};
      if (typeof body.password === 'string' && passwordMatches(body.password)) {
        return send(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie() });
      }
      return send(res, 401, { ok: false, error: 'Incorrect password.' });
    }
    if (action === 'logout') return send(res, 200, { ok: true }, { 'Set-Cookie': clearCookie() });

    // ---- everything below needs a valid session ----
    if (!isLoggedIn(req)) return send(res, 401, { ok: false, error: 'Please sign in.' });
    if (req.method !== 'GET' && req.headers['x-crm'] !== '1') return send(res, 403, { ok: false, error: 'Not allowed' });

    await ensureSchema();
    const sql = db();
    const body = req.method === 'GET' ? {} : readBody(req) || {};
    const id = String(req.query?.id || '');

    if (action === 'list' && req.method === 'GET') {
      const rows = await sql.query(`select ${LEAD_COLS} from leads order by created_at desc limit 2000`);
      return send(res, 200, { ok: true, leads: rows });
    }

    if (action === 'lead' && req.method === 'GET') {
      if (!ID.test(id)) return send(res, 400, { ok: false });
      const rows = await sql.query(`select ${LEAD_COLS} from leads where id = $1`, [id]);
      if (!rows.length) return send(res, 404, { ok: false });
      const acts = await sql.query(
        `select id::int as id, to_char(at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS"Z"') as at, kind, text
         from activities where lead_id = $1 order by at asc, id asc`, [id]);
      return send(res, 200, { ok: true, lead: rows[0], activities: acts });
    }

    if (action === 'create' && req.method === 'POST') {
      const checked = validateLead(body, 'manual');
      if (!checked.ok) return send(res, 400, { ok: false, error: checked.error || 'Invalid request.' });
      const source = pickSource(body.source);
      if (!source) return send(res, 400, { ok: false, error: 'Please choose where this lead came from.' });
      const stage = pickStage(body.stage) || 'New Lead';
      const fu = ymdOrNull(body.next_follow_up);
      if (fu === undefined) return send(res, 400, { ok: false, error: 'Invalid follow-up date.' });
      const amount = body.quote_amount === null || body.quote_amount === '' || body.quote_amount === undefined ? null : Number(body.quote_amount);
      if (amount !== null && (!Number.isFinite(amount) || amount < 0 || amount > 1e9)) return send(res, 400, { ok: false, error: 'Invalid amount.' });
      const v = checked.value as LeadInput;
      const rows = await sql.query(
        `insert into leads (name, phone, email, service, suburb, details, entry, source, stage, quote_amount, next_follow_up)
         values ($1,$2,$3,$4,$5,$6,'manual',$7,$8,$9,$10) returning id::text as id`,
        [v.name, v.phone, v.email, v.service, v.suburb, v.details, source, stage, amount, fu]);
      await addActivity(rows[0].id, 'lead_added', `Lead added manually (source: ${source}).`);
      return send(res, 201, { ok: true, id: rows[0].id });
    }

    if (action === 'update' && req.method === 'POST') {
      if (!ID.test(id)) return send(res, 400, { ok: false });
      const cur = (await sql.query(`select ${LEAD_COLS} from leads where id = $1`, [id]))[0];
      if (!cur) return send(res, 404, { ok: false });

      const sets: string[] = [];
      const vals: any[] = [];
      const log: [string, string][] = [];
      const set = (col: string, val: any) => { vals.push(val); sets.push(`${col} = $${vals.length}`); };

      if ('stage' in body) {
        const s = pickStage(body.stage);
        if (!s) return send(res, 400, { ok: false, error: 'Invalid stage.' });
        if (s !== cur.stage) { set('stage', s); log.push(['stage_change', `Stage changed from ${cur.stage} to ${s}.`]); }
      }
      if ('source' in body) {
        const s = pickSource(body.source);
        if (!s) return send(res, 400, { ok: false, error: 'Invalid source.' });
        if (s !== cur.source) { set('source', s); log.push(['source_change', `Source changed from ${cur.source} to ${s} (by you).`]); }
      }
      if ('quote_amount' in body) {
        const raw = body.quote_amount;
        const n = raw === null || raw === '' ? null : Number(raw);
        if (n !== null && (!Number.isFinite(n) || n < 0 || n > 1e9)) return send(res, 400, { ok: false, error: 'Invalid amount.' });
        if (n !== cur.quote_amount) {
          set('quote_amount', n);
          log.push(['amount_change', n === null ? 'Quote amount cleared.' : `Quote amount set to R ${Math.round(n).toLocaleString('en-ZA')}.`]);
        }
      }
      for (const col of ['next_follow_up', 'last_contact'] as const) {
        if (col in body) {
          const d = ymdOrNull(body[col]);
          if (d === undefined) return send(res, 400, { ok: false, error: 'Invalid date.' });
          if (d !== cur[col]) {
            set(col, d);
            if (col === 'next_follow_up') log.push(['follow_up_set', d ? `Next follow-up set for ${d}.` : 'Follow-up date cleared.']);
            else log.push(['last_contact_set', d ? `Last contact recorded as ${d}.` : 'Last contact cleared.']);
          }
        }
      }
      if ('lost_reason' in body) {
        const r = clean(body.lost_reason, 200) || null;
        if (r !== cur.lost_reason) { set('lost_reason', r); log.push(['lost_reason', r ? `Lost reason: ${r}.` : 'Lost reason cleared.']); }
      }
      for (const [col, max] of [['name', 100], ['phone', 30], ['email', 254], ['suburb', 100], ['details', 2000]] as const) {
        if (col in body) {
          const val = clean(body[col], max) || null;
          if ((col === 'name' || col === 'phone') && !val) return send(res, 400, { ok: false, error: 'Name and phone are required.' });
          if (val !== cur[col]) { set(col, val); log.push(['edit', `${col[0].toUpperCase() + col.slice(1)} edited.`]); }
        }
      }
      if ('service' in body) {
        const s = clean(body.service, 100);
        if (!SERVICE_LABELS.includes(s)) return send(res, 400, { ok: false, error: 'Invalid service.' });
        if (s !== cur.service) { set('service', s); log.push(['edit', 'Service edited.']); }
      }

      if (sets.length) {
        sets.push('updated_at = now()');
        vals.push(id);
        await sql.query(`update leads set ${sets.join(', ')} where id = $${vals.length}`, vals);
        for (const [kind, text] of log) await addActivity(id, kind, text);
      }
      return send(res, 200, { ok: true });
    }

    // You confirm you actually contacted the customer; the CRM never assumes a message was sent.
    if (action === 'contacted' && req.method === 'POST') {
      if (!ID.test(id)) return send(res, 400, { ok: false });
      const next = 'next_follow_up' in body ? ymdOrNull(body.next_follow_up) : null;
      if (next === undefined) return send(res, 400, { ok: false, error: 'Invalid date.' });
      const today = todayZA();
      const r = await sql.query('update leads set last_contact = $2, next_follow_up = $3, updated_at = now() where id = $1 returning id', [id, today, next]);
      if (!r.length) return send(res, 404, { ok: false });
      await addActivity(id, 'contacted', next ? `You confirmed you contacted the customer. Next follow-up: ${next}.` : 'You confirmed you contacted the customer. No further follow-up set.');
      return send(res, 200, { ok: true });
    }

    if (action === 'note' && req.method === 'POST') {
      if (!ID.test(id)) return send(res, 400, { ok: false });
      const text = clean(body.text, 2000);
      if (!text) return send(res, 400, { ok: false, error: 'Please type a note.' });
      const r = await sql.query('select 1 from leads where id = $1', [id]);
      if (!r.length) return send(res, 404, { ok: false });
      await addActivity(id, 'note', text);
      return send(res, 201, { ok: true });
    }

    if (action === 'delete' && req.method === 'POST') {
      if (!ID.test(id)) return send(res, 400, { ok: false });
      await sql.query('delete from leads where id = $1', [id]);
      return send(res, 200, { ok: true });
    }

    return send(res, 404, { ok: false, error: 'Unknown action' });
  } catch (e: any) {
    console.error('crm error:', action, e?.message);
    return send(res, 500, { ok: false, error: 'Something went wrong. Please try again.' });
  }
}
