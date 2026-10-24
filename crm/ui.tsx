import React from 'react';
import { X } from 'lucide-react';
import type { Source, Stage } from './shared';

export const GOLD = '#c5a059';

export const card = 'bg-[#faf8f5] text-stone-900 border border-stone-200 rounded-sm';
export const label = 'block text-[11px] font-bold text-stone-600 uppercase tracking-[0.14em] mb-1.5';
export const input =
  'w-full px-3 py-3 border border-stone-300 rounded-sm text-stone-900 text-base bg-white focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none';
export const btnGold =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-sm bg-[#c5a059] text-stone-950 text-xs font-bold uppercase tracking-[0.14em] active:scale-[0.98] hover:bg-[#d4b06a] disabled:opacity-50';
export const btnDark =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-sm bg-stone-950 text-white text-xs font-bold uppercase tracking-[0.14em] active:scale-[0.98] hover:bg-black disabled:opacity-50';
export const btnLight =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-sm bg-white border border-stone-300 text-stone-800 text-xs font-bold uppercase tracking-[0.14em] active:scale-[0.98] hover:border-stone-900 disabled:opacity-50';

const STAGE_STYLE: Record<Stage, string> = {
  'New Lead': 'bg-stone-200 text-stone-800',
  Contacted: 'bg-sky-100 text-sky-900',
  'Site Visit Booked': 'bg-violet-100 text-violet-900',
  'Quote Sent': 'bg-amber-100 text-amber-900',
  Negotiation: 'bg-orange-100 text-orange-900',
  Won: 'bg-emerald-100 text-emerald-900',
  Lost: 'bg-rose-100 text-rose-900',
};

export const StageChip: React.FC<{ stage: Stage }> = ({ stage }) => (
  <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap ${STAGE_STYLE[stage]}`}>
    {stage}
  </span>
);

export const SourceChip: React.FC<{ source: Source }> = ({ source }) => (
  <span
    className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-[0.1em] border whitespace-nowrap ${
      source === 'Unknown' ? 'border-dashed border-stone-400 text-stone-500' : 'border-[#c5a059]/60 text-[#8c6517]'
    }`}
  >
    {source}
  </span>
);

export const fmtDay = (ymd: string | null): string => {
  if (!ymd) return '—';
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', timeZone: 'UTC' });
};

export const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Africa/Johannesburg' });

export const fmtDateTime = (iso: string): string =>
  new Date(iso).toLocaleString('en-ZA', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Johannesburg',
  });

/** Full-height sheet on phones, centred panel on larger screens. */
export const Sheet: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70" role="dialog" aria-modal="true" aria-label={title}>
    <div className="w-full sm:max-w-xl max-h-[96vh] flex flex-col bg-[#faf8f5] text-stone-900 sm:rounded-sm rounded-t-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 bg-[#141211] text-white border-b border-white/10">
        <h2 className="font-serif text-lg tracking-wide">{title}</h2>
        <button onClick={onClose} aria-label="Close" className="p-2 -mr-2 text-stone-300 hover:text-white">
          <X size={22} />
        </button>
      </div>
      <div className="overflow-y-auto p-5 pb-8 space-y-5">{children}</div>
    </div>
  </div>
);

export const Notice: React.FC<{ tone?: 'error' | 'info'; children: React.ReactNode }> = ({ tone = 'info', children }) => (
  <div className={`p-3 text-sm rounded-sm border ${tone === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-amber-50 border-amber-200 text-stone-700'}`}>
    {children}
  </div>
);
