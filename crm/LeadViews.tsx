import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Copy, Mail, MessageCircle, Phone, Plus, Search, Trash2 } from 'lucide-react';
import { api } from './api';
import {
  SERVICE_LABELS, SOURCES, STAGES, addDays, formatZAR, groupFollowUps, todayZA, whatsappLink,
} from './shared';
import type { Activity, Lead, Source, Stage } from './shared';
import { Notice, Sheet, SourceChip, StageChip, btnDark, btnGold, btnLight, card, fmtDate, fmtDateTime, fmtDay, input, label } from './ui';

const LOST_REASONS = ['Price too high', 'Chose another supplier', 'No response', 'Project cancelled', 'Other'];

function FollowUpText({ lead, today }: { lead: Lead; today: string }) {
  if (!lead.next_follow_up) return <span className="text-stone-400">No follow-up set</span>;
  const open = lead.stage !== 'Won' && lead.stage !== 'Lost';
  const overdue = open && lead.next_follow_up < today;
  return (
    <span className={overdue ? 'text-rose-700 font-bold' : lead.next_follow_up === today && open ? 'text-[#8c6517] font-bold' : 'text-stone-600'}>
      {overdue ? 'Overdue · ' : lead.next_follow_up === today && open ? 'Today · ' : ''}
      {fmtDay(lead.next_follow_up)}
    </span>
  );
}

// ---------------- All Leads ----------------

export const LeadsView: React.FC<{
  leads: Lead[];
  stageFilter: string;
  setStageFilter: (v: string) => void;
  onOpen: (id: string) => void;
}> = ({ leads, stageFilter, setStageFilter, onOpen }) => {
  const [q, setQ] = useState('');
  const [source, setSource] = useState('');
  const [service, setService] = useState('');
  const today = todayZA();

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter(
      (l) =>
        (!stageFilter || l.stage === stageFilter) &&
        (!source || l.source === source) &&
        (!service || l.service === service) &&
        (!needle || [l.name, l.phone, l.email, l.suburb, l.service].some((v) => (v || '').toLowerCase().includes(needle))),
    );
  }, [leads, q, stageFilter, source, service]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input className={`${input} pl-10`} placeholder="Search name, phone, suburb…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search leads" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <select className={`${input} !px-2 !text-sm`} value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} aria-label="Filter by stage">
          <option value="">All stages</option>
          {STAGES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className={`${input} !px-2 !text-sm`} value={source} onChange={(e) => setSource(e.target.value)} aria-label="Filter by source">
          <option value="">All sources</option>
          {SOURCES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className={`${input} !px-2 !text-sm`} value={service} onChange={(e) => setService(e.target.value)} aria-label="Filter by service">
          <option value="">All services</option>
          {SERVICE_LABELS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <p className="text-xs text-stone-400">{shown.length} of {leads.length} leads</p>

      {leads.length === 0 && (
        <div className={`${card} p-6 text-center text-sm text-stone-600`}>
          No leads yet. Tap <b>Add Lead</b>, or wait for the first website enquiry to arrive.
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {shown.map((l) => (
          <button key={l.id} onClick={() => onOpen(l.id)} className={`${card} p-4 text-left hover:border-[#c5a059] active:scale-[0.99] transition`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-serif text-lg leading-tight truncate">{l.name}</div>
                <div className="text-sm text-stone-600 truncate">{l.service}</div>
              </div>
              <StageChip stage={l.stage} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <SourceChip source={l.source} />
              <span className="text-stone-500">Received {fmtDate(l.created_at)}</span>
              <FollowUpText lead={l} today={today} />
              {l.quote_amount ? <span className="font-bold text-stone-800">{formatZAR(l.quote_amount)}</span> : null}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ---------------- Lead detail ----------------

export const LeadSheet: React.FC<{ id: string; onClose: () => void; onChanged: () => void }> = ({ id, onClose, onChanged }) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [acts, setActs] = useState<Activity[]>([]);
  const [err, setErr] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [editing, setEditing] = useState(false);
  const [edit, setEdit] = useState({ name: '', phone: '', email: '', suburb: '', service: '' });
  const [contacting, setContacting] = useState(false);
  const [nextDate, setNextDate] = useState('');
  const [copied, setCopied] = useState('');
  const today = todayZA();

  const load = useCallback(async () => {
    const r = await api<{ lead: Lead; activities: Activity[] }>('lead', { id });
    if (!r.ok) { setErr(r.data?.error || 'Could not load this lead.'); return; }
    setLead(r.data.lead);
    setActs(r.data.activities);
    setAmount(r.data.lead.quote_amount ? String(r.data.lead.quote_amount) : '');
    setEdit({
      name: r.data.lead.name, phone: r.data.lead.phone, email: r.data.lead.email || '',
      suburb: r.data.lead.suburb || '', service: r.data.lead.service,
    });
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const patch = async (fields: Record<string, unknown>) => {
    setErr('');
    const r = await api('update', { id, body: fields });
    if (!r.ok) { setErr(r.data?.error || 'Could not save. Please try again.'); return false; }
    await load();
    onChanged();
    return true;
  };

  const copy = async (text: string, what: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(what); setTimeout(() => setCopied(''), 1500); } catch { setErr('Copy is not available on this browser.'); }
  };

  if (!lead) return <Sheet title="Lead" onClose={onClose}>{err ? <Notice tone="error">{err}</Notice> : <p className="text-stone-500">Loading…</p>}</Sheet>;

  const wa = whatsappLink(lead.phone, `Hi ${lead.name.split(' ')[0]}, this is The Elegant Company in Cape Town about your enquiry.`);

  return (
    <Sheet title={lead.name} onClose={onClose}>
      {err && <Notice tone="error">{err}</Notice>}

      <div className="flex flex-wrap items-center gap-2">
        <StageChip stage={lead.stage} /> <SourceChip source={lead.source} />
        <span className="text-xs text-stone-500">Received {fmtDate(lead.created_at)} · {lead.entry === 'website' ? 'website form' : 'added by you'}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {wa ? (
          <a href={wa} target="_blank" rel="noopener noreferrer" className={btnGold}><MessageCircle size={16} /> WhatsApp</a>
        ) : (
          <span className="text-xs text-stone-500 col-span-2">This phone number is not a valid South African number, so no WhatsApp link is shown.</span>
        )}
        <a href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`} className={btnLight}><Phone size={16} /> Call</a>
        <button className={btnLight} onClick={() => copy(lead.phone, 'phone')}><Copy size={16} /> {copied === 'phone' ? 'Copied' : 'Copy phone'}</button>
        {lead.email && <button className={btnLight} onClick={() => copy(lead.email as string, 'email')}><Mail size={16} /> {copied === 'email' ? 'Copied' : 'Copy email'}</button>}
      </div>
      <p className="text-xs text-stone-500 -mt-2">Opening WhatsApp does not record anything. Use “I contacted them” below once you really have.</p>

      <div className={`${card} p-4 space-y-4`}>
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-base">Details</h3>
          <button className="text-xs font-bold uppercase tracking-wider text-[#8c6517]" onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : 'Edit'}</button>
        </div>
        {editing ? (
          <div className="space-y-3">
            {(['name', 'phone', 'email', 'suburb'] as const).map((k) => (
              <div key={k}><label className={label}>{k}</label><input className={input} value={edit[k]} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} /></div>
            ))}
            <div><label className={label}>Service</label>
              <select className={input} value={edit.service} onChange={(e) => setEdit({ ...edit, service: e.target.value })}>{SERVICE_LABELS.map((s) => <option key={s}>{s}</option>)}</select></div>
            <button className={btnDark} onClick={async () => { if (await patch(edit)) setEditing(false); }}>Save details</button>
          </div>
        ) : (
          <dl className="text-sm grid grid-cols-[110px_1fr] gap-y-2">
            <dt className="text-stone-500">Phone</dt><dd>{lead.phone}</dd>
            <dt className="text-stone-500">Email</dt><dd className="break-all">{lead.email || '—'}</dd>
            <dt className="text-stone-500">Service</dt><dd>{lead.service}</dd>
            <dt className="text-stone-500">Suburb</dt><dd>{lead.suburb || '—'}</dd>
            <dt className="text-stone-500">Last contact</dt><dd>{fmtDay(lead.last_contact)}</dd>
          </dl>
        )}
        {lead.details && <div className="text-sm border-t border-stone-200 pt-3"><div className="text-stone-500 text-xs mb-1">Customer’s message</div><p className="whitespace-pre-wrap">{lead.details}</p></div>}
      </div>

      <div className={`${card} p-4 space-y-4`}>
        <h3 className="font-serif text-base">Stage &amp; follow-up</h3>
        <div><label className={label}>Stage</label>
          <select className={input} value={lead.stage} onChange={(e) => patch({ stage: e.target.value as Stage })}>{STAGES.map((s) => <option key={s}>{s}</option>)}</select></div>
        {lead.stage === 'Lost' && (
          <div><label className={label}>Why was it lost?</label>
            <select className={input} value={lead.lost_reason || ''} onChange={(e) => patch({ lost_reason: e.target.value })}>
              <option value="">Select a reason…</option>{LOST_REASONS.map((s) => <option key={s}>{s}</option>)}</select></div>
        )}
        <div><label className={label}>Current quote amount (R)</label>
          <div className="flex gap-2">
            <input className={input} inputMode="decimal" placeholder="Leave empty if not quoted yet" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} />
            {(amount === '' ? null : Number(amount)) !== lead.quote_amount && <button className={btnGold} onClick={() => patch({ quote_amount: amount === '' ? null : Number(amount) })}>Save</button>}
          </div>
          <p className="text-xs text-stone-500 mt-1">One amount per lead: the quote that currently stands. Leave empty rather than guessing.</p></div>
        <div><label className={label}>Next follow-up</label>
          <input type="date" className={input} value={lead.next_follow_up || ''} onChange={(e) => patch({ next_follow_up: e.target.value || null })} />
          <div className="flex gap-2 mt-2">
            {[1, 3, 7].map((d) => <button key={d} className={`${btnLight} !min-h-[36px] !px-3`} onClick={() => patch({ next_follow_up: addDays(today, d) })}>+{d} day{d > 1 ? 's' : ''}</button>)}
          </div></div>
        {!contacting ? (
          <button className={btnDark} onClick={() => { setNextDate(addDays(today, 3)); setContacting(true); }}><Check size={16} /> I contacted them</button>
        ) : (
          <div className="border border-stone-300 p-3 rounded-sm space-y-3 bg-white">
            <p className="text-sm">Records today as the last contact. When should you follow up next?</p>
            <input type="date" className={input} value={nextDate} onChange={(e) => setNextDate(e.target.value)} />
            <div className="flex gap-2">
              <button className={btnGold} onClick={async () => { const r = await api('contacted', { id, body: { next_follow_up: nextDate || null } }); if (r.ok) { setContacting(false); await load(); onChanged(); } else setErr(r.data?.error || 'Could not save.'); }}>Confirm</button>
              <button className={btnLight} onClick={async () => { const r = await api('contacted', { id, body: { next_follow_up: null } }); if (r.ok) { setContacting(false); await load(); onChanged(); } }}>No more follow-up</button>
            </div>
          </div>
        )}
      </div>

      <div className={`${card} p-4 space-y-3`}>
        <h3 className="font-serif text-base">Where this lead came from</h3>
        <select className={input} value={lead.source} onChange={(e) => patch({ source: e.target.value as Source })}>{SOURCES.map((s) => <option key={s}>{s}</option>)}</select>
        <p className="text-xs text-stone-500">
          {lead.entry === 'manual' ? 'You chose this source when adding the lead.' : (
            <>First visit: <b>{lead.source_first || 'no tracking information'}</b>{lead.source_first_detail ? ` (${lead.source_first_detail})` : ''}.
              {' '}Most recent visit: <b>{lead.source_last || 'no tracking information'}</b>{lead.source_last_detail ? ` (${lead.source_last_detail})` : ''}.
              {' '}If you know better, change it above.</>
          )}
        </p>
      </div>

      <div className={`${card} p-4 space-y-3`}>
        <h3 className="font-serif text-base">Notes &amp; history</h3>
        <textarea className={`${input} resize-none`} rows={2} placeholder="Add a note about a conversation…" value={note} onChange={(e) => setNote(e.target.value)} />
        <button className={btnDark} disabled={!note.trim()} onClick={async () => { const r = await api('note', { id, body: { text: note } }); if (r.ok) { setNote(''); await load(); } else setErr(r.data?.error || 'Could not save the note.'); }}><Plus size={16} /> Add note</button>
        <ol className="border-l border-stone-300 ml-1 pl-4 space-y-3 pt-1">
          {acts.map((a) => (
            <li key={a.id} className="text-sm relative">
              <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-[#c5a059]" />
              <div className="text-xs text-stone-500">{fmtDateTime(a.at)}</div>
              <div className="whitespace-pre-wrap">{a.text}</div>
            </li>
          ))}
        </ol>
      </div>

      <button className="flex items-center gap-2 text-xs text-rose-700 font-bold uppercase tracking-wider mx-auto"
        onClick={async () => { if (window.confirm(`Permanently delete ${lead.name}? This cannot be undone.`)) { const r = await api('delete', { id, body: {} }); if (r.ok) { onChanged(); onClose(); } } }}>
        <Trash2 size={14} /> Delete this lead
      </button>
    </Sheet>
  );
};

// ---------------- Add lead ----------------

export const AddLeadSheet: React.FC<{ onClose: () => void; onSaved: () => void }> = ({ onClose, onSaved }) => {
  const [f, setF] = useState({ name: '', phone: '', email: '', service: '', source: '', suburb: '', stage: 'New Lead', quote_amount: '', next_follow_up: '', details: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setErr(''); setBusy(true);
    const r = await api('create', { body: { ...f, quote_amount: f.quote_amount === '' ? null : Number(f.quote_amount), next_follow_up: f.next_follow_up || null } });
    setBusy(false);
    if (!r.ok) { setErr(r.data?.error || 'Could not save this lead.'); return; }
    onSaved(); onClose();
  };

  return (
    <Sheet title="Add Lead" onClose={onClose}>
      {err && <Notice tone="error">{err}</Notice>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className={label}>Customer name *</label><input className={input} value={f.name} onChange={(e) => set('name', e.target.value)} autoComplete="off" /></div>
        <div><label className={label}>Phone / WhatsApp *</label><input className={input} type="tel" inputMode="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="073 000 0000" /></div>
        <div><label className={label}>Service *</label><select className={input} value={f.service} onChange={(e) => set('service', e.target.value)}><option value="">Select service…</option>{SERVICE_LABELS.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className={label}>Where did this lead come from? *</label><select className={input} value={f.source} onChange={(e) => set('source', e.target.value)}><option value="">Select source…</option>{SOURCES.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className={label}>Email</label><input className={input} type="email" value={f.email} onChange={(e) => set('email', e.target.value)} /></div>
        <div><label className={label}>Suburb</label><input className={input} value={f.suburb} onChange={(e) => set('suburb', e.target.value)} /></div>
        <div><label className={label}>Stage</label><select className={input} value={f.stage} onChange={(e) => set('stage', e.target.value)}>{STAGES.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className={label}>Quote amount (R, if known)</label><input className={input} inputMode="decimal" value={f.quote_amount} onChange={(e) => set('quote_amount', e.target.value.replace(/[^\d.]/g, ''))} /></div>
        <div className="sm:col-span-2"><label className={label}>Next follow-up</label><input className={input} type="date" value={f.next_follow_up} onChange={(e) => set('next_follow_up', e.target.value)} /></div>
        <div className="sm:col-span-2"><label className={label}>Notes</label><textarea className={`${input} resize-none`} rows={3} value={f.details} onChange={(e) => set('details', e.target.value)} /></div>
      </div>
      <div className="flex gap-2"><button className={btnGold} disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save lead'}</button><button className={btnLight} onClick={onClose}>Cancel</button></div>
    </Sheet>
  );
};

// ---------------- Follow-ups ----------------

export const FollowUpsView: React.FC<{ leads: Lead[]; onOpen: (id: string) => void; onChanged: () => void }> = ({ leads, onOpen, onChanged }) => {
  const today = todayZA();
  const g = useMemo(() => groupFollowUps(leads, today), [leads, today]);
  const [doneFor, setDoneFor] = useState<string | null>(null);
  const [next, setNext] = useState('');
  const [err, setErr] = useState('');

  const finish = async (id: string, date: string | null) => {
    const r = await api('contacted', { id, body: { next_follow_up: date } });
    if (!r.ok) { setErr(r.data?.error || 'Could not save.'); return; }
    setDoneFor(null); onChanged();
  };

  const renderRow = (l: Lead) => {
    const wa = whatsappLink(l.phone);
    return (
      <div key={l.id} className={`${card} p-4 space-y-3`}>
        <button className="w-full text-left" onClick={() => onOpen(l.id)}>
          <div className="flex justify-between gap-3"><div className="font-serif text-lg leading-tight">{l.name}</div><StageChip stage={l.stage} /></div>
          <div className="text-sm text-stone-600">{l.service}</div>
          <div className="text-xs mt-1"><FollowUpText lead={l} today={today} /> · last contact {fmtDay(l.last_contact)}</div>
        </button>
        {doneFor === l.id ? (
          <div className="space-y-2 bg-white border border-stone-300 p-3 rounded-sm">
            <p className="text-xs text-stone-600">I contacted them. Next follow-up:</p>
            <input type="date" className={input} value={next} onChange={(e) => setNext(e.target.value)} />
            <div className="flex gap-2"><button className={btnGold} onClick={() => finish(l.id, next || null)}>Confirm</button><button className={btnLight} onClick={() => finish(l.id, null)}>No more</button></div>
          </div>
        ) : (
          <div className="flex gap-2">
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className={`${btnLight} flex-1`}><MessageCircle size={16} /> WhatsApp</a>}
            <button className={`${btnDark} flex-1`} onClick={() => { setDoneFor(l.id); setNext(addDays(today, 3)); }}><Check size={16} /> Done</button>
          </div>
        )}
      </div>
    );
  };

  const renderGroup = (title: string, items: Lead[], tone?: string) =>
    items.length ? (
      <section key={title} className="space-y-3">
        <h3 className={`text-xs font-bold uppercase tracking-[0.18em] ${tone || 'text-[#c5a059]'}`}>{title} ({items.length})</h3>
        {items.map((l) => renderRow(l))}
      </section>
    ) : null;

  const nothing = !g.overdue.length && !g.today.length && !g.upcoming.length && !g.none.length;
  return (
    <div className="space-y-6">
      {err && <Notice tone="error">{err}</Notice>}
      {nothing && <div className={`${card} p-6 text-center text-sm text-stone-600`}>Nothing to follow up. Open leads appear here once they exist.</div>}
      {renderGroup('Overdue', g.overdue, 'text-rose-400')}
      {renderGroup('Due today', g.today)}
      {renderGroup('Upcoming', g.upcoming, 'text-stone-300')}
      {renderGroup('No follow-up date set', g.none, 'text-stone-400')}
      <p className="text-xs text-stone-500">These are on-screen reminders only. The CRM does not send you or your customers any messages.</p>
    </div>
  );
};
