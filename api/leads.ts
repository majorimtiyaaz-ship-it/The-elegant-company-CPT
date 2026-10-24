// PUBLIC endpoint: the website quote form posts here. It can only CREATE a lead.
// It never returns any stored customer data.
import type { LeadInput } from './_lib/core.js';
import { addActivity, classifySource, clientKey, db, ensureSchema, rateLimit, readBody, sameOrigin, send, validateLead } from './_lib/core.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'Method not allowed' }, { Allow: 'POST' });
  if (!sameOrigin(req)) return send(res, 403, { ok: false, error: 'Not allowed' });

  const body = readBody(req);
  if (!body) return send(res, 400, { ok: false, error: 'Invalid request.' });

  // Hidden honeypot field: real visitors never fill it. Pretend success, save nothing.
  if (typeof body._gotcha === 'string' && body._gotcha.trim() !== '') return send(res, 200, { ok: true });

  const checked = validateLead(body, 'public');
  if (!checked.ok) return send(res, 400, { ok: false, error: checked.error || 'Invalid request.' });

  const submissionId = typeof body.submission_id === 'string' ? body.submission_id : '';
  if (!/^[A-Za-z0-9-]{16,64}$/.test(submissionId)) return send(res, 400, { ok: false, error: 'Invalid request.' });

  try {
    await ensureSchema();
    const key = clientKey(req);
    const allowed =
      (await rateLimit('lead10m:' + key, 5, 600)) && (await rateLimit('lead1d:' + key, 20, 86400));
    if (!allowed) return send(res, 429, { ok: false, error: 'Too many requests. Please try again later or contact us on WhatsApp.' });

    const first = classifySource(body.attribution?.first);
    const last = classifySource(body.attribution?.last);
    // Original acquisition source wins; if the first visit carried no signal, use the most recent one.
    const chosen = first.source !== 'Unknown' ? first : last;

    const v = checked.value as LeadInput;
    const rows = await db().query(
      `insert into leads (submission_id, name, phone, email, service, suburb, details, entry, source,
                          source_first, source_first_detail, source_last, source_last_detail)
       values ($1,$2,$3,$4,$5,$6,$7,'website',$8,$9,$10,$11,$12)
       on conflict (submission_id) do nothing
       returning id::text as id`,
      [submissionId, v.name, v.phone, v.email, v.service, v.suburb, v.details, chosen.source,
       first.source === 'Unknown' ? null : first.source, first.detail,
       last.source === 'Unknown' ? null : last.source, last.detail],
    );
    if (rows.length) {
      const how = chosen.source === 'Unknown' ? 'source could not be determined' : `source: ${chosen.source}`;
      try {
        await addActivity(rows[0].id, 'enquiry_received', `Enquiry received from the website quote form (${how}).`);
      } catch (e) {
        console.error('activity insert failed');
      }
    }
    // A retry of the same submission lands here with no new row: still a success, no duplicate.
    return send(res, 201, { ok: true });
  } catch (e: any) {
    console.error('lead save failed:', e?.message);
    return send(res, 500, { ok: false, error: 'save_failed' });
  }
}
