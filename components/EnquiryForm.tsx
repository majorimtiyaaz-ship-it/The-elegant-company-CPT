import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { whatsappUrl, track } from './BookCTA';
import { getAttribution } from '../lib/attribution';

// One ID per enquiry, so a retried send can never create a duplicate lead in the CRM.
const newSubmissionId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}-web`;

// Same Formspree endpoint the previous contact form used.
const FORMSPREE_URL = 'https://formspree.io/f/xeeweynw';

type Opt = { label: string; value?: string };
type Step = {
  id: string;
  title: string;
  hint?: string;
  kind: 'cards' | 'text' | 'contact';
  options?: Opt[];
  optional?: boolean;
  multiline?: boolean;
  placeholder?: string;
};
type Answers = Record<string, string>;

const SERVICE_OPTS: Opt[] = [
  { label: 'Furniture Restoration', value: 'restoration' },
  { label: 'Custom Furniture', value: 'custom' },
  { label: 'Kitchen Installation', value: 'kitchen' },
];

// Finishes already offered on the previous form, so no new claims are introduced.
const FINISH_OPTS: Opt[] = [
  { label: 'American Walnut (Natural Satin)', value: 'walnut' },
  { label: 'French Oak (Warm Honey)', value: 'french-oak' },
  { label: 'Nordic Ash (Pale Linen)', value: 'nordic-ash' },
  { label: 'Burmese Teak (Golden Amber)', value: 'teak' },
  { label: 'Not sure yet', value: 'other' },
];

const suburb: Step = { id: 'area', title: 'Which suburb is the project in?', kind: 'text', placeholder: 'e.g. Mitchells Plain' };
const notes: Step = {
  id: 'notes',
  title: 'Anything else we should know?',
  hint: 'Optional. Photos can be sent on WhatsApp after you submit.',
  kind: 'text',
  optional: true,
  multiline: true,
};

const PATHS: Record<string, Step[]> = {
  restoration: [
    { id: 'item', title: 'What needs attention?', kind: 'cards', options: [{ label: 'Dining or coffee table' }, { label: 'Cabinet or sideboard' }, { label: 'Chest of drawers' }, { label: 'Bed or headboard' }, { label: 'Chairs' }, { label: 'Something else' }] },
    { id: 'work', title: 'What work is needed?', kind: 'cards', options: [{ label: 'Repairs' }, { label: 'New colour or finish' }, { label: 'Full restoration' }, { label: 'Professional advice' }] },
    { id: 'pieces', title: 'How many pieces?', kind: 'cards', options: [{ label: '1 piece' }, { label: '2 to 3 pieces' }, { label: '4 or more' }] },
    { id: 'condition', title: 'What condition is it in?', kind: 'cards', options: [{ label: 'Good, needs a refresh' }, { label: 'Worn' }, { label: 'Damaged' }, { label: 'Not sure' }] },
    suburb,
    notes,
  ],
  custom: [
    { id: 'item', title: 'What would you like made?', kind: 'cards', options: [{ label: 'Built-in cupboards or wardrobes', value: 'cupboards' }, { label: 'Dining or coffee table', value: 'table' }, { label: 'Wooden bench', value: 'bench' }, { label: 'Cabinetry', value: 'other' }, { label: 'Bed or headboard', value: 'other' }, { label: 'Something else', value: 'other' }] },
    { id: 'dimensions', title: 'Do you know the approximate size?', hint: 'Optional. A rough idea or a room size is fine.', kind: 'text', optional: true, placeholder: 'e.g. 2.4m x 1.0m' },
    { id: 'finish', title: 'Any preferred wood or finish?', hint: 'Optional.', kind: 'cards', optional: true, options: FINISH_OPTS },
    { id: 'use', title: 'Where will it be used?', kind: 'cards', options: [{ label: 'Dining area' }, { label: 'Living room' }, { label: 'Bedroom' }, { label: 'Office' }, { label: 'Other' }] },
    suburb,
    notes,
  ],
  kitchen: [
    { id: 'project', title: 'What kind of project is it?', kind: 'cards', options: [{ label: 'New installation' }, { label: 'Replacement' }, { label: 'Upgrade' }] },
    { id: 'size', title: 'Roughly how big is the kitchen?', kind: 'cards', options: [{ label: 'Small' }, { label: 'Medium' }, { label: 'Large' }, { label: 'Not sure' }] },
    { id: 'finish', title: 'Any preferred wood or finish?', hint: 'Optional.', kind: 'cards', optional: true, options: FINISH_OPTS },
    suburb,
    notes,
  ],
};

const STEP_SERVICE: Step = { id: 'service', title: 'What can we help you with?', kind: 'cards', options: SERVICE_OPTS };
const STEP_STAGE: Step = {
  id: 'stage',
  title: 'Where are you with this project?',
  hint: 'Optional. This helps us respond in the right way.',
  kind: 'cards',
  optional: true,
  options: [{ label: 'Ready to proceed' }, { label: 'Starting in 1 to 3 months' }, { label: 'Planning for later' }, { label: 'Exploring and want advice' }],
};
const STEP_CONTACT: Step = { id: 'contact', title: 'How can we reach you?', kind: 'contact' };

const LABELS: Record<string, string> = {
  serviceLabel: 'Service', item: 'Item', work: 'Work needed', pieces: 'Pieces', condition: 'Condition',
  project: 'Project', size: 'Kitchen size', dimensions: 'Approx. size', finishLabel: 'Wood / finish',
  use: 'Use', area: 'Suburb', stage: 'Stage', notes: 'Notes',
};

const fieldCls =
  'w-full px-4 py-3 border border-stone-300 rounded-sm text-stone-900 text-base bg-white focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none transition-colors';
const labelCls = 'block text-xs font-bold text-stone-700 uppercase tracking-[0.14em] mb-1.5';
const primaryBtn =
  'btn-sheen min-h-[50px] px-7 uppercase tracking-[0.18em] text-xs font-bold rounded-sm bg-stone-950 text-white hover:bg-[#c5a059] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed';
const ghostBtn =
  'min-h-[50px] px-6 uppercase tracking-[0.18em] text-xs font-bold rounded-sm border border-stone-300 text-stone-700 hover:text-stone-900 hover:border-stone-900 transition-colors cursor-pointer disabled:opacity-60';

export const EnquiryForm: React.FC<{ prefillDetails?: string }> = ({ prefillDetails }) => {
  const [answers, setAnswers] = useState<Answers>({});
  const [idx, setIdx] = useState(0);
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);
  const [phase, setPhase] = useState<'form' | 'review' | 'sending' | 'done'>('form');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hp = useRef<HTMLInputElement>(null);
  const started = useRef(false);
  const sending = useRef(false);
  const mounted = useRef(false);
  const submissionId = useRef<string>(newSubmissionId());

  useEffect(() => {
    if (prefillDetails) setAnswers((a) => ({ ...a, notes: prefillDetails }));
  }, [prefillDetails]);

  const steps = useMemo<Step[]>(
    () => [STEP_SERVICE, ...(answers.service ? PATHS[answers.service] : []), STEP_STAGE, STEP_CONTACT],
    [answers.service],
  );
  const step = steps[idx];
  const set = (k: string, v: string) => setAnswers((a) => ({ ...a, [k]: v }));

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; } // do not steal focus on page load
    headingRef.current?.focus({ preventScroll: true });
  }, [idx, phase]);

  const begin = () => {
    if (!started.current) { started.current = true; track('form', 'form_start'); }
  };

  const labelOf = (s: Step, v: string) => s.options?.find((o) => (o.value ?? o.label) === v)?.label ?? v;

  const lines = (): [string, string][] => {
    const out: [string, string][] = [];
    const svc = SERVICE_OPTS.find((o) => o.value === answers.service)?.label;
    if (svc) out.push([LABELS.serviceLabel, svc]);
    for (const s of PATHS[answers.service] || []) {
      const v = answers[s.id];
      if (v) out.push([LABELS[s.id === 'finish' ? 'finishLabel' : s.id] || s.id, s.kind === 'cards' ? labelOf(s, v) : v]);
    }
    if (answers.stage) out.push([LABELS.stage, answers.stage]);
    return out;
  };

  const validate = (): string => {
    if (step.kind === 'cards') return step.optional || answers[step.id] ? '' : 'Please choose an option to continue.';
    if (step.kind === 'text') return step.optional || (answers[step.id] || '').trim() ? '' : 'Please fill this in, or go back.';
    const digits = (answers.phone || '').replace(/[\s()+-]/g, '');
    if (!(answers.name || '').trim()) return 'Please enter your name.';
    if (!/^\d{9,15}$/.test(digits)) return 'Enter a valid phone or WhatsApp number (9 to 15 digits).';
    if (answers.email && !/^\S+@\S+\.\S+$/.test(answers.email)) return 'That email address does not look right.';
    if (!consent) return 'Please tick the box so we may respond to your enquiry.';
    return '';
  };

  const go = (to: number) => {
    setError('');
    setIdx(to);
    track('form', `step_${steps[to]?.id ?? 'review'}`); // lets analytics show where people stop
  };

  const next = () => {
    begin();
    const msg = validate();
    if (msg) return setError(msg);
    if (idx === steps.length - 1) { setError(''); setPhase('review'); return; }
    go(idx + 1);
  };

  const choose = (o: Opt) => {
    begin();
    set(step.id, o.value ?? o.label);
    setError('');
    window.setTimeout(() => go(Math.min(idx + 1, steps.length - 1)), 200);
  };

  const back = () => {
    if (phase === 'review') { setError(''); return setPhase('form'); }
    go(Math.max(0, idx - 1));
  };

  const skip = () => { set(step.id, ''); go(idx + 1); };

  const send = async () => {
    if (sending.current) return; // blocks double taps
    if (hp.current?.value) return; // spam trap
    sending.current = true;
    setPhase('sending');
    setError('');
    const summary = lines().map(([k, v]) => `${k}: ${v}`).join('\n');
    const typeValue =
      answers.service === 'custom'
        ? PATHS.custom[0].options!.find((o) => (o.value ?? o.label) === answers.item)?.value ?? 'other'
        : answers.service; // 'restoration' | 'kitchen' match the old form's values
    const payload = {
      name: answers.name,
      phone: answers.phone,
      email: answers.email || '',
      type: typeValue,
      area: answers.area || '',
      dimensions: answers.dimensions || '',
      finish: answers.finish || '',
      details: `${answers.notes || ''}\n\n--- Guided form answers ---\n${summary}`.trim(),
      consent: 'Agreed (POPIA)',
      _subject: 'New quote request - The Elegant Company website (guided form)',
    };
    // 1) Save to the CRM first (the CRM is the main record).
    //    Invalid input or rate limiting is shown to the visitor. If the CRM is simply unreachable,
    //    carry on: the email below still goes out and is flagged so the lead can be added by hand.
    let crmSaved = false;
    try {
      const crmRes = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, _gotcha: '', submission_id: submissionId.current, attribution: getAttribution() }),
      });
      if (crmRes.ok) {
        crmSaved = true;
      } else if (crmRes.status === 400 || crmRes.status === 429) {
        const result = await crmRes.json().catch(() => ({}));
        setError(result.error || 'Please check your details and try again.');
        setPhase('review');
        sending.current = false;
        return;
      }
    } catch {
      // network error: fall through to the email backup
    }

    // 2) Email notification and backup (Formspree), as before.
    let emailSent = false;
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...payload, crm_saved: crmSaved ? 'yes' : 'NO - not saved in the CRM, please add it manually' }),
      });
      emailSent = res.ok;
    } catch {
      emailSent = false;
    }

    // Success is shown only if the enquiry genuinely reached the CRM or the inbox.
    if (crmSaved || emailSent) {
      track('form', 'lead_form_submit');
      submissionId.current = newSubmissionId();
      setPhase('done');
    } else {
      track('form', 'form_error');
      setError('We could not send your enquiry. Please check your connection and try again, or message us on WhatsApp.');
      setPhase('review');
    }
    sending.current = false;
  };

  const waMessage = () =>
    [`Hi, my name is ${answers.name}. I just sent a quote request on your website.`, ...lines().map(([k, v]) => `${k}: ${v}`), 'I would like to send photos.'].join('\n');

  const pct = phase === 'form' ? Math.round((idx / steps.length) * 100) : 100;

  if (phase === 'done') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 my-auto" role="status">
        <div className="w-16 h-16 bg-[#c5a059]/15 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-[#c5a059]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 tabIndex={-1} ref={headingRef} className="text-2xl font-serif text-stone-900 mb-4 font-medium outline-none">Proposal Received</h3>
        <p className="text-stone-600 font-light max-w-sm mb-6 leading-relaxed text-sm sm:text-base">
          Thank you, {answers.name.split(' ')[0]}. Your enquiry has been delivered to our workshop in Cape Town.
        </p>
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#8c6517]">We respond within 24 hours</p>
        <a
          href={whatsappUrl(waMessage())}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('form', 'book_click')}
          className="btn-sheen mt-7 inline-flex min-h-[50px] items-center justify-center gap-3 rounded-sm bg-[#1a1a1a] px-7 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-black"
        >
          <WhatsAppIcon className="h-5 w-5 shrink-0" />
          Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <style>{`@keyframes ecIn{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:none}}.ec-pane{animation:ecIn .25s ease}@media (prefers-reduced-motion:reduce){.ec-pane{animation:none}}`}</style>
      <div className="h-[2px] bg-stone-200" role="progressbar" aria-label="Enquiry progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className="h-full bg-[#c5a059] transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-stone-500 mt-2 mb-7">{phase === 'form' ? `Step ${idx + 1} of ${steps.length}` : 'Review your enquiry'}</p>

      {phase === 'form' && (
        <div className="ec-pane" key={step.id}>
          <h3 tabIndex={-1} ref={headingRef} className="text-2xl font-serif text-stone-900 mb-2 outline-none">{step.title}</h3>
          {step.hint && <p className="text-sm text-stone-500 mb-4">{step.hint}</p>}

          {step.kind === 'cards' && (
            <div className="grid gap-2.5 mt-5" role="group" aria-label={step.title}>
              {step.options!.map((o) => {
                const on = answers[step.id] === (o.value ?? o.label);
                return (
                  <button
                    key={o.label}
                    type="button"
                    aria-pressed={on}
                    onClick={() => choose(o)}
                    className={`w-full text-left min-h-[56px] px-5 py-3.5 rounded-sm border text-stone-900 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a059] ${on ? 'border-[#c5a059] bg-[#c5a059]/10' : 'border-stone-300 hover:border-[#c5a059]'}`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          )}

          {step.kind === 'text' && (
            <div className="mt-5">
              <label htmlFor="ef-field" className="sr-only">{step.title}</label>
              {step.multiline ? (
                <textarea id="ef-field" rows={4} value={answers[step.id] || ''} onChange={(e) => set(step.id, e.target.value)} placeholder={step.placeholder} className={`${fieldCls} resize-none`} />
              ) : (
                <input id="ef-field" type="text" value={answers[step.id] || ''} onChange={(e) => set(step.id, e.target.value)} placeholder={step.placeholder} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), next())} className={fieldCls} />
              )}
            </div>
          )}

          {step.kind === 'contact' && (
            <div className="space-y-4 mt-5">
              <div>
                <label htmlFor="ef-name" className={labelCls}>Your Name *</label>
                <input id="ef-name" type="text" autoComplete="name" value={answers.name || ''} onChange={(e) => set('name', e.target.value)} className={fieldCls} />
              </div>
              <div>
                <label htmlFor="ef-phone" className={labelCls}>Phone / WhatsApp *</label>
                <input id="ef-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="073 000 0000" value={answers.phone || ''} onChange={(e) => set('phone', e.target.value)} className={fieldCls} />
              </div>
              <div>
                <label htmlFor="ef-email" className={labelCls}>Email (optional)</label>
                <input id="ef-email" type="email" autoComplete="email" value={answers.email || ''} onChange={(e) => set('email', e.target.value)} className={fieldCls} />
              </div>
              <label className="flex items-start gap-3 text-xs text-stone-600 leading-relaxed cursor-pointer">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#c5a059]" />
                <span>I agree that The Elegant Company may use these details to respond to my enquiry and keep them for that purpose, in line with POPIA.</span>
              </label>
            </div>
          )}

          {error && (
            <p role="alert" className="mt-4 flex items-center gap-2 text-sm text-rose-700">
              <AlertCircle size={16} className="shrink-0" /> {error}
            </p>
          )}

          <div className="flex items-center gap-3 mt-7">
            {idx > 0 && <button type="button" onClick={back} className={ghostBtn}>Back</button>}
            {(step.kind !== 'cards' || answers[step.id]) && idx < steps.length && (
              <button type="button" onClick={next} className={primaryBtn}>Continue</button>
            )}
            {step.optional && (
              <button type="button" onClick={skip} className="ml-auto min-h-[44px] text-sm text-stone-500 underline cursor-pointer">Skip</button>
            )}
          </div>
        </div>
      )}

      {(phase === 'review' || phase === 'sending') && (
        <div className="ec-pane">
          <h3 tabIndex={-1} ref={headingRef} className="text-2xl font-serif text-stone-900 mb-2 outline-none">Check your details</h3>
          <p className="text-sm text-stone-500 mb-5">We will use these to prepare your quotation. This is not a final price.</p>
          <dl className="border-t border-stone-200">
            {[...lines(), ['Name', answers.name], ['Contact', answers.phone], ...(answers.email ? [['Email', answers.email]] : [])].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3 border-b border-stone-200 text-sm">
                <dt className="text-stone-500">{k}</dt>
                <dd className="text-stone-900 text-right break-words">{v}</dd>
              </div>
            ))}
          </dl>
          <input ref={hp} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          {error && (
            <p role="alert" className="mt-4 flex items-start gap-2 text-sm text-rose-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
            </p>
          )}
          <div className="flex items-center gap-3 mt-7">
            <button type="button" onClick={back} disabled={phase === 'sending'} className={ghostBtn}>Back</button>
            <button type="button" onClick={send} disabled={phase === 'sending'} className={`${primaryBtn} flex-1`}>
              {phase === 'sending' ? 'Sending…' : 'Submit My Enquiry'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
