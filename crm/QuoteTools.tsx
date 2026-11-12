import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { api } from './api';
import { whatsappLink } from './shared';
import type { Lead } from './shared';
import { DEFAULT_PRICING, PRICING_LABELS, computeQuote, fmtR, quoteMessage } from './pricing';
import type { FurnitureSize, JobType, PricingSettings, QuoteResult } from './pricing';
import { Notice, btnDark, btnGold, btnLight, card, fmtDate, input, label } from './ui';

const digits = (v: string) => v.replace(/[^\d.]/g, '');

function defaultJobType(service: string): JobType {
  if (/kitchen/i.test(service)) return 'kitchen';
  if (/restoration/i.test(service)) return 'restoration';
  return 'furniture'; // tables, benches, cupboards and other bespoke pieces use the furniture sizes
}

// ---------------- Quote builder (one lead) ----------------

export const QuoteBuilder: React.FC<{ lead: Lead; onChanged: () => Promise<void> | void }> = ({ lead, onChanged }) => {
  const [open, setOpen] = useState(false);
  const [pricing, setPricing] = useState<PricingSettings>(DEFAULT_PRICING);
  const [jobType, setJobType] = useState<JobType>(defaultJobType(lead.service));
  const [size, setSize] = useState<FurnitureSize>('medium');
  const [f, setF] = useState({ materials: '', helperDays: '', ownerDays: '', transport: '', take: '' });
  const [saved, setSaved] = useState<QuoteResult | null>(null);
  const [past, setPast] = useState<{ id: string; created_at: string; total: number }[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!open) return;
    (async () => {
      const [s, q] = await Promise.all([api('settings'), api('quotes', { id: lead.id })]);
      if (s.ok && s.data.pricing) setPricing(s.data.pricing);
      if (q.ok) setPast(q.data.quotes || []);
    })();
  }, [open, lead.id]);

  const inputs = useMemo(() => ({
    jobType, size,
    materials: Number(f.materials) || 0,
    helperDays: Number(f.helperDays) || 0,
    ownerDays: Number(f.ownerDays) || 0,
    transport: Number(f.transport) || 0,
    takeOverride: f.take === '' ? null : Number(f.take),
  }), [jobType, size, f]);
  const r = useMemo(() => computeQuote(inputs, pricing), [inputs, pricing]);

  const set = (k: keyof typeof f, v: string) => { setSaved(null); setF((p) => ({ ...p, [k]: digits(v) })); };

  const save = async () => {
    setErr(''); setBusy(true);
    const res = await api('quote_save', { id: lead.id, body: { inputs } });
    setBusy(false);
    if (!res.ok) { setErr(res.data?.error || 'Could not save the quote.'); return; }
    setSaved(res.data.result);
    const q = await api('quotes', { id: lead.id });
    if (q.ok) setPast(q.data.quotes || []);
    await onChanged();
  };

  const markSent = async () => {
    if (!saved) return;
    setErr(''); setBusy(true);
    const res = await api('update', { id: lead.id, body: { stage: 'Quote Sent', quote_amount: saved.total } });
    setBusy(false);
    if (!res.ok) { setErr(res.data?.error || 'Could not update the stage.'); return; }
    await onChanged();
  };

  const wa = saved ? whatsappLink(lead.phone, quoteMessage(lead.name, lead.service, saved, pricing.depositPct)) : null;
  const alreadyOut = lead.stage === 'Quote Sent' || lead.stage === 'Negotiation';
  const row = 'flex justify-between text-sm';

  return (
    <div className={`${card} p-4 space-y-4`}>
      <button className="w-full flex justify-between items-center" onClick={() => setOpen(!open)}>
        <h3 className="font-serif text-base">Quote builder</h3>
        <span className="text-xs font-bold uppercase tracking-wider text-[#8c6517]">{open ? 'Close' : 'Open'}</span>
      </button>

      {open && (
        <div className="space-y-4">
          {err && <Notice tone="error">{err}</Notice>}
          {past.length > 0 && (
            <p className="text-xs text-stone-500">Last saved quote: <b>{fmtR(past[0].total)}</b> on {fmtDate(past[0].created_at)}.</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div><label className={label}>Job type</label>
              <select className={input} value={jobType} onChange={(e) => { setSaved(null); setJobType(e.target.value as JobType); }}>
                <option value="kitchen">Kitchen</option><option value="furniture">Custom furniture</option><option value="restoration">Restoration</option>
              </select></div>
            {jobType === 'furniture' && (
              <div><label className={label}>Size</label>
                <select className={input} value={size} onChange={(e) => { setSaved(null); setSize(e.target.value as FurnitureSize); }}>
                  <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
                </select></div>
            )}
            <div><label className={label}>Materials from supplier (R)</label>
              <input className={input} inputMode="decimal" value={f.materials} onChange={(e) => set('materials', e.target.value)} /></div>
            <div><label className={label}>Transport / delivery (R)</label>
              <input className={input} inputMode="decimal" value={f.transport} onChange={(e) => set('transport', e.target.value)} /></div>
            <div><label className={label}>Your hands-on days</label>
              <input className={input} inputMode="decimal" placeholder="no waiting or drying" value={f.ownerDays} onChange={(e) => set('ownerDays', e.target.value)} /></div>
            <div><label className={label}>Helper days</label>
              <input className={input} inputMode="decimal" value={f.helperDays} onChange={(e) => set('helperDays', e.target.value)} /></div>
          </div>

          <div className="bg-white border border-stone-300 rounded-sm p-3 space-y-1.5">
            <div className={row}><span className="text-stone-500">Materials</span><span>{fmtR(r.materials)}</span></div>
            {r.consumables > 0 && <div className={row}><span className="text-stone-500">Consumables</span><span>{fmtR(r.consumables)}</span></div>}
            <div className={row}><span className="text-stone-500">Helper ({f.helperDays || 0} days)</span><span>{fmtR(r.helperCost)}</span></div>
            <div className={row}><span className="text-stone-500">Transport</span><span>{fmtR(r.transport)}</span></div>
            <div className={row}><span className="text-stone-500">Your take</span><b>{fmtR(r.take)}</b></div>
            <div className={`${row} border-t border-stone-200 pt-1.5 text-base`}><b>Quote to customer</b><b>{fmtR(r.total)}</b></div>
            <div className={row}><span className="text-stone-500">{pricing.depositPct}% deposit</span><span>{fmtR(r.deposit)}</span></div>
            {r.effectiveOwnerDay !== null && (
              <div className={row}><span className="text-stone-500">Your day value on this job</span><span>{fmtR(r.effectiveOwnerDay)}</span></div>
            )}
          </div>

          {r.warnings.map((w) => <Notice key={w}>{w}</Notice>)}

          <details className="text-sm">
            <summary className="cursor-pointer text-stone-600">Set my take by hand (advanced)</summary>
            <div className="mt-2">
              <input className={input} inputMode="decimal" placeholder={`Leave empty to use ${fmtR(Math.max(r.targetTake, r.floorTake))}`} value={f.take} onChange={(e) => set('take', e.target.value)} />
              <p className="text-xs text-stone-500 mt-1">You will be warned if this is below your target or your day floor.</p>
            </div>
          </details>

          {!saved ? (
            <button className={btnGold} disabled={busy || r.total <= 0} onClick={save}>{busy ? 'Saving…' : 'Save this quote'}</button>
          ) : (
            <div className="space-y-2">
              <Notice>Saved. The lead's quote amount is now {fmtR(saved.total)}.</Notice>
              {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className={`${btnGold} w-full`}><MessageCircle size={16} /> Open quote in WhatsApp</a>}
              {!alreadyOut && <button className={btnDark} disabled={busy} onClick={markSent}>I sent it: mark Quote Sent</button>}
              <p className="text-xs text-stone-500">The WhatsApp message shows only the total, never your costs. Press send there, then mark it sent here to schedule the day 2, 5 and 10 follow-ups.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------- Pricing settings ----------------

export const PricingSettingsCard: React.FC = () => {
  const [p, setP] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await api('settings');
      const src: PricingSettings = r.ok && r.data.pricing ? r.data.pricing : DEFAULT_PRICING;
      setP(Object.fromEntries(Object.entries(src).map(([k, v]) => [k, String(v)])));
      setLoaded(true);
    })();
  }, []);

  const save = async () => {
    setErr(''); setMsg(''); setBusy(true);
    const r = await api('settings_save', { body: { pricing: Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v === '' ? null : Number(v)])) } });
    setBusy(false);
    if (!r.ok) { setErr(r.data?.error || 'Could not save.'); return; }
    setP(Object.fromEntries(Object.entries(r.data.pricing as PricingSettings).map(([k, v]) => [k, String(v)])));
    setMsg('Saved. New quotes use these numbers.');
  };

  return (
    <section className={`${card} p-4 space-y-3`}>
      <h2 className="font-serif text-lg">Quote pricing</h2>
      <p className="text-xs text-stone-600">These are your own rules. The quote builder uses them on every quote, and you can change them any time. Quotes already saved do not change.</p>
      {!loaded ? <p className="text-sm text-stone-500">Loading…</p> : (
        <div className="space-y-3">
          {(Object.keys(PRICING_LABELS) as (keyof PricingSettings)[]).map((k) => (
            <div key={k}><label className={label}>{PRICING_LABELS[k]}</label>
              <input className={input} inputMode="decimal" value={p[k] ?? ''} onChange={(e) => { setMsg(''); setP({ ...p, [k]: digits(e.target.value) }); }} /></div>
          ))}
          {err && <Notice tone="error">{err}</Notice>}
          {msg && <Notice>{msg}</Notice>}
          <button className={btnLight} disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save pricing'}</button>
        </div>
      )}
    </section>
  );
};
