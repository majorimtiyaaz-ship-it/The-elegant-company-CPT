import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarClock, Copy, Download, LayoutDashboard, LogOut, Plus, Settings as SettingsIcon, Users } from 'lucide-react';
import { api } from './api';
import { AddLeadSheet, FollowUpsView, LeadSheet, LeadsView } from './LeadViews';
import { OPEN_STAGES, SOURCES, computeMetrics, formatZAR, groupFollowUps, todayZA } from './shared';
import type { Lead } from './shared';
import { Notice, SourceChip, StageChip, btnGold, btnLight, card, fmtDate, fmtDay, input, label } from './ui';

type Tab = 'dashboard' | 'leads' | 'followups' | 'settings';

// ---------------- Login ----------------

const Login: React.FC<{ onIn: () => void }> = ({ onIn }) => {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    const r = await api('login', { body: { password: pw } });
    setBusy(false);
    if (r.ok) onIn();
    else setErr(r.data?.error || 'Could not sign in.');
  };
  return (
    <div className="min-h-screen bg-[#0e0d0c] flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="font-serif text-2xl tracking-[0.25em] text-white">THE ELEGANT</div>
          <div className="font-serif text-xs tracking-[0.5em] text-[#c5a059] mt-1">COMPANY</div>
          <div className="w-12 h-px bg-[#c5a059]/50 mx-auto my-5" />
          <p className="text-stone-400 text-sm">Private business dashboard</p>
        </div>
        {err && <Notice tone="error">{err}</Notice>}
        <div>
          <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-[0.14em] mb-1.5" htmlFor="pw">Password</label>
          <input id="pw" type="password" autoComplete="current-password" className={input} value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
        </div>
        <button className={`${btnGold} w-full`} disabled={busy || !pw}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
};

// ---------------- Dashboard ----------------

const Stat: React.FC<{ title: string; value: string; note: string }> = ({ title, value, note }) => (
  <div className={`${card} p-4`}>
    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8c6517] leading-tight min-h-[26px]">{title}</div>
    <div className="font-serif text-2xl sm:text-3xl mt-1 leading-tight">{value}</div>
    <div className="text-[11px] text-stone-500 mt-1 leading-snug">{note}</div>
  </div>
);

const Dashboard: React.FC<{ leads: Lead[]; onAdd: () => void; onOpen: (id: string) => void; goStage: (s: string) => void; goFollowups: () => void }> = ({ leads, onAdd, onOpen, goStage, goFollowups }) => {
  const today = todayZA();
  const m = useMemo(() => computeMetrics(leads, today), [leads, today]);
  const fu = useMemo(() => groupFollowUps(leads, today), [leads, today]);
  const upcoming = [...fu.overdue, ...fu.today, ...fu.upcoming].slice(0, 5);
  const recent = leads.slice(0, 5);
  const chartStages = m.byStage.filter((s) => s.stage !== 'Lost');
  const maxVal = Math.max(1, ...chartStages.map((s) => s.value));
  const lost = m.byStage.find((s) => s.stage === 'Lost')?.count || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-white">Dashboard</h1>
          <p className="text-xs text-stone-400">{m.total} lead{m.total === 1 ? '' : 's'} · all figures come from your saved records</p>
        </div>
        <button className={btnGold} onClick={onAdd}><Plus size={16} /> Add Lead</button>
      </div>

      {m.total === 0 && (
        <Notice>No leads yet — there is no sample data here. Website enquiries appear automatically; you can also add one by hand.</Notice>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Stat title="Open pipeline value" value={formatZAR(m.pipelineValue)} note={`${m.openCount} open lead${m.openCount === 1 ? '' : 's'}${m.openMissingAmount ? ` · ${m.openMissingAmount} with no value yet` : ''}. Potential, not guaranteed.`} />
        <Stat title="Quotes awaiting acceptance" value={formatZAR(m.quotesAwaitingValue)} note={`${m.quotesAwaitingCount} quote${m.quotesAwaitingCount === 1 ? '' : 's'} sent, undecided`} />
        <Stat title="Won revenue" value={formatZAR(m.wonValue)} note={`${m.wonCount} job${m.wonCount === 1 ? '' : 's'} won${m.wonMissingAmount ? ` · ${m.wonMissingAmount} with no value recorded` : ''}. Agreed value, not cash received.`} />
        <button onClick={goFollowups} className="text-left"><Stat title="Outstanding follow-ups" value={String(m.followUpsOutstanding)} note={`${m.followUpsOverdue} overdue · ${m.followUpsDueToday} due today`} /></button>
      </div>

      <section className="bg-[#1a1a1a] border border-white/10 rounded-sm p-4 space-y-3">
        <div>
          <h2 className="font-serif text-lg text-white">Pipeline by stage</h2>
          <p className="text-[11px] text-stone-400">Potential revenue from quote amounts you recorded. Tap a stage to see its leads.</p>
        </div>
        {chartStages.map((s) => (
          <button key={s.stage} onClick={() => goStage(s.stage)} className={`w-full text-left ${s.stage === 'Won' ? 'pt-3 mt-1 border-t border-white/10' : ''}`}>
            <div className="flex justify-between text-xs text-stone-300 mb-1">
              <span>{s.stage === 'Won' ? 'Won (kept separate)' : s.stage} · {s.count}</span>
              <span className="text-[#c5a059] font-bold">{s.value ? formatZAR(s.value) : s.count ? 'no value yet' : '—'}</span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-sm overflow-hidden">
              <div className={`h-full ${s.stage === 'Won' ? 'bg-emerald-500/80' : 'bg-[#c5a059]'}`} style={{ width: `${(s.value / maxVal) * 100}%`, minWidth: s.count ? 4 : 0 }} />
            </div>
          </button>
        ))}
        {lost > 0 && <button onClick={() => goStage('Lost')} className="text-[11px] text-stone-400 underline">{lost} lost (not counted in the pipeline)</button>}
      </section>

      <section className={`${card} p-4 space-y-3`}>
        <div>
          <h2 className="font-serif text-lg">Where your leads come from</h2>
          <p className="text-[11px] text-stone-500">“Unknown” means the source could not be identified. It is never guessed.</p>
        </div>
        {m.bySource.map((s) => (
          <div key={s.source}>
            <div className="flex justify-between text-sm">
              <span className={s.source === 'Unknown' ? 'text-stone-500' : ''}>{s.source}</span>
              <span><b>{s.total}</b>{s.total ? <span className="text-stone-500 text-xs"> · {Math.round((s.total / m.total) * 100)}%</span> : null}</span>
            </div>
            <div className="h-1.5 bg-stone-200 rounded-sm mt-1"><div className="h-full bg-[#c5a059]" style={{ width: `${m.total ? (s.total / m.total) * 100 : 0}%` }} /></div>
            {s.won > 0 && <div className="text-[11px] text-emerald-800 mt-0.5">{s.won} job{s.won === 1 ? '' : 's'} won{s.wonValue ? ` · ${formatZAR(s.wonValue)}` : ''}</div>}
          </div>
        ))}
        <div className="text-xs text-stone-600 border-t border-stone-200 pt-2">Total leads: <b>{m.total}</b></div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-lg text-white">Upcoming follow-ups</h2>
        {upcoming.length === 0 && <p className="text-sm text-stone-400">Nothing scheduled.</p>}
        {upcoming.map((l) => (
          <button key={l.id} onClick={() => onOpen(l.id)} className={`${card} w-full p-3 text-left flex justify-between gap-3 items-center`}>
            <div className="min-w-0"><div className="font-serif truncate">{l.name}</div><div className="text-xs text-stone-500 truncate">{l.service}</div></div>
            <div className={`text-xs font-bold whitespace-nowrap ${(l.next_follow_up as string) < today ? 'text-rose-700' : 'text-[#8c6517]'}`}>{(l.next_follow_up as string) < today ? 'Overdue · ' : ''}{fmtDay(l.next_follow_up)}</div>
          </button>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-lg text-white">Recent leads</h2>
        {recent.map((l) => (
          <button key={l.id} onClick={() => onOpen(l.id)} className={`${card} w-full p-3 text-left space-y-1`}>
            <div className="flex justify-between gap-2"><span className="font-serif truncate">{l.name}</span><StageChip stage={l.stage} /></div>
            <div className="flex items-center gap-3 text-xs text-stone-500"><SourceChip source={l.source} /><span className="truncate">{l.service}</span><span className="ml-auto whitespace-nowrap">{fmtDate(l.created_at)}</span></div>
          </button>
        ))}
      </section>
    </div>
  );
};

// ---------------- Settings ----------------

function csvCell(v: unknown): string {
  let s = v === null || v === undefined ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // stops spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
}

const SettingsView: React.FC<{ leads: Lead[]; onLogout: () => void }> = ({ leads, onLogout }) => {
  const [channel, setChannel] = useState('instagram');
  const [medium, setMedium] = useState('social');
  const [campaign, setCampaign] = useState('');
  const [copied, setCopied] = useState(false);
  const link = useMemo(() => {
    const p = new URLSearchParams({ utm_source: channel, utm_medium: medium });
    if (campaign.trim()) p.set('utm_campaign', campaign.trim().toLowerCase().replace(/\s+/g, '-'));
    return `${window.location.origin}/?${p.toString()}`;
  }, [channel, medium, campaign]);

  const exportCsv = () => {
    const cols = ['created_at', 'name', 'phone', 'email', 'service', 'suburb', 'source', 'source_first', 'source_first_detail', 'source_last', 'stage', 'quote_amount', 'lost_reason', 'next_follow_up', 'last_contact', 'details'] as const;
    const csv = [cols.join(','), ...leads.map((l) => cols.map((c) => csvCell((l as any)[c])).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = `elegant-leads-${todayZA()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-white">Settings</h1>

      <section className={`${card} p-4 space-y-3`}>
        <h2 className="font-serif text-lg">Campaign link builder</h2>
        <p className="text-xs text-stone-600">Website visitors can only be traced to Instagram, Facebook or Google when the link they click carries these tags. Use a tagged link in your bio, posts and ads.</p>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={label}>Channel</label><select className={input} value={channel} onChange={(e) => { setChannel(e.target.value); setMedium(e.target.value === 'google' ? 'cpc' : 'social'); }}><option value="instagram">Instagram</option><option value="facebook">Facebook</option><option value="google">Google</option><option value="whatsapp">WhatsApp</option></select></div>
          <div><label className={label}>Type</label><select className={input} value={medium} onChange={(e) => setMedium(e.target.value)}><option value="social">Organic post / bio</option><option value="cpc">Paid ad</option><option value="message">Message</option></select></div>
        </div>
        <div><label className={label}>Campaign name (optional)</label><input className={input} placeholder="e.g. restoration reel" value={campaign} onChange={(e) => setCampaign(e.target.value)} /></div>
        <div className="break-all text-xs bg-white border border-stone-300 p-3 rounded-sm select-all">{link}</div>
        <button className={btnLight} onClick={async () => { try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ } }}><Copy size={16} /> {copied ? 'Copied' : 'Copy link'}</button>
      </section>

      <section className={`${card} p-4 space-y-3`}>
        <h2 className="font-serif text-lg">Your data</h2>
        <p className="text-xs text-stone-600">Download every lead as a spreadsheet file. Do this regularly as your own backup.</p>
        <button className={btnLight} onClick={exportCsv}><Download size={16} /> Export all leads (CSV)</button>
      </section>

      <section className={`${card} p-4 space-y-2`}>
        <h2 className="font-serif text-lg">Lead sources</h2>
        <p className="text-xs text-stone-600">Fixed list: {SOURCES.join(', ')}. Change a lead’s source on its detail page if the automatic one is wrong.</p>
      </section>

      <button className={btnLight} onClick={onLogout}><LogOut size={16} /> Sign out</button>
    </div>
  );
};

// ---------------- Shell ----------------

export default function CRMApp() {
  const [auth, setAuth] = useState<'loading' | 'out' | 'in'>('loading');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [stageFilter, setStageFilter] = useState('');
  const [loadErr, setLoadErr] = useState('');

  useEffect(() => {
    document.title = 'CRM · The Elegant Company';
    const meta = document.createElement('meta');
    meta.name = 'robots'; meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { meta.remove(); };
  }, []);

  const refresh = useCallback(async () => {
    const r = await api<{ leads: Lead[] }>('list');
    if (r.status === 401) { setAuth('out'); return; }
    if (!r.ok) { setLoadErr(r.data?.error || 'Could not load your leads.'); setAuth((a) => (a === 'loading' ? 'in' : a)); return; }
    setLoadErr(''); setLeads(r.data.leads); setAuth('in');
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const logout = async () => { await api('logout', { body: {} }); setLeads([]); setAuth('out'); };

  if (auth === 'loading') return <div className="min-h-screen bg-[#0e0d0c] text-stone-400 flex items-center justify-center text-sm">Loading…</div>;
  if (auth === 'out') return <Login onIn={refresh} />;

  const nav: { id: Tab; name: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'leads', name: 'All Leads', icon: <Users size={20} /> },
    { id: 'followups', name: 'Follow-ups', icon: <CalendarClock size={20} /> },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon size={20} /> },
  ];
  const dueCount = leads.filter((l) => OPEN_STAGES.includes(l.stage) && l.next_follow_up && l.next_follow_up <= todayZA()).length;

  return (
    <div className="min-h-screen bg-[#0e0d0c] text-stone-100 font-sans">
      <header className="sticky top-0 z-40 bg-[#141211] border-b border-white/10 pt-[env(safe-area-inset-top)]">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="leading-none"><div className="font-serif tracking-[0.22em] text-white text-sm">THE ELEGANT</div><div className="font-serif text-[10px] tracking-[0.5em] text-[#c5a059] mt-1">COMPANY</div></div>
          <nav className="hidden md:flex gap-1">
            {nav.map((n) => (
              <button key={n.id} onClick={() => { setTab(n.id); if (n.id !== 'leads') setStageFilter(''); }} className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] border-b-2 ${tab === n.id ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-stone-400 hover:text-white'}`}>{n.name}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6 pb-28 space-y-6">
        {loadErr && <Notice tone="error">{loadErr} <button className="underline font-bold ml-1" onClick={refresh}>Try again</button></Notice>}
        {tab === 'dashboard' && <Dashboard leads={leads} onAdd={() => setAdding(true)} onOpen={setOpenId} goStage={(s) => { setStageFilter(s); setTab('leads'); }} goFollowups={() => setTab('followups')} />}
        {tab === 'leads' && (<>
          <div className="flex items-center justify-between"><h1 className="font-serif text-2xl text-white">All Leads</h1><button className={btnGold} onClick={() => setAdding(true)}><Plus size={16} /> Add Lead</button></div>
          <LeadsView leads={leads} stageFilter={stageFilter} setStageFilter={setStageFilter} onOpen={setOpenId} />
        </>)}
        {tab === 'followups' && (<>
          <h1 className="font-serif text-2xl text-white">Follow-ups</h1>
          <FollowUpsView leads={leads} onOpen={setOpenId} onChanged={refresh} />
        </>)}
        {tab === 'settings' && <SettingsView leads={leads} onLogout={logout} />}
      </main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#141211] border-t border-white/10 grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        {nav.map((n) => (
          <button key={n.id} onClick={() => { setTab(n.id); if (n.id !== 'leads') setStageFilter(''); }} className={`relative flex flex-col items-center gap-1 py-3 text-[10px] font-bold uppercase tracking-[0.08em] ${tab === n.id ? 'text-[#c5a059]' : 'text-stone-400'}`}>
            {n.icon}{n.name}
            {n.id === 'followups' && dueCount > 0 && <span className="absolute top-1.5 right-[28%] min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] flex items-center justify-center">{dueCount}</span>}
          </button>
        ))}
      </nav>

      {openId && <LeadSheet id={openId} onClose={() => setOpenId(null)} onChanged={refresh} />}
      {adding && <AddLeadSheet onClose={() => setAdding(false)} onSaved={refresh} />}
    </div>
  );
}
