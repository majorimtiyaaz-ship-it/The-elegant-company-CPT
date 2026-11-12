// Quote pricing. Pure functions only: the same code runs in the browser (live preview) and on the
// server (what actually gets saved), so the two can never disagree.

export type JobType = 'kitchen' | 'furniture' | 'restoration';
export type FurnitureSize = 'small' | 'medium' | 'large';

export interface PricingSettings {
  helperDayRate: number;   // what you pay your helper per day
  ownerDayFloor: number;   // the least one day of your own work may earn
  kitchenTake: number;     // your target take for a kitchen
  furnitureSmall: number;  // your target take for a custom piece, by size
  furnitureMedium: number;
  furnitureLarge: number;
  restorationMin: number;  // minimum take for a restoration
  consumablesPct: number;  // % of materials added for glue, sandpaper, finish, blades...
  depositPct: number;      // deposit that secures a booking
}

export const DEFAULT_PRICING: PricingSettings = {
  helperDayRate: 400,
  ownerDayFloor: 800,
  kitchenTake: 20000,
  furnitureSmall: 8000,
  furnitureMedium: 11500,
  furnitureLarge: 15000,
  restorationMin: 2000,
  consumablesPct: 0,
  depositPct: 60,
};

export const PRICING_LABELS: Record<keyof PricingSettings, string> = {
  helperDayRate: 'Helper cost per day (R)',
  ownerDayFloor: 'Your minimum per day of your own work (R)',
  kitchenTake: 'Kitchen: your target take (R)',
  furnitureSmall: 'Custom furniture, small: your take (R)',
  furnitureMedium: 'Custom furniture, medium: your take (R)',
  furnitureLarge: 'Custom furniture, large: your take (R)',
  restorationMin: 'Restoration: minimum take (R)',
  consumablesPct: 'Consumables added to materials (%)',
  depositPct: 'Deposit to secure a booking (%)',
};

const LIMITS: Record<keyof PricingSettings, [number, number]> = {
  helperDayRate: [0, 100000], ownerDayFloor: [0, 100000], kitchenTake: [0, 10000000],
  furnitureSmall: [0, 10000000], furnitureMedium: [0, 10000000], furnitureLarge: [0, 10000000],
  restorationMin: [0, 10000000], consumablesPct: [0, 100], depositPct: [0, 100],
};

/** Merge whatever was stored with the defaults, dropping anything that is not a sane number. */
export function mergePricing(raw: unknown): PricingSettings {
  const out: PricingSettings = { ...DEFAULT_PRICING };
  if (raw && typeof raw === 'object') {
    for (const k of Object.keys(DEFAULT_PRICING) as (keyof PricingSettings)[]) {
      const v = Number((raw as any)[k]);
      const [lo, hi] = LIMITS[k];
      if ((raw as any)[k] !== null && (raw as any)[k] !== '' && Number.isFinite(v) && v >= lo && v <= hi) out[k] = v;
    }
  }
  return out;
}

export interface QuoteInputs {
  jobType: JobType;
  size: FurnitureSize;      // only used for furniture
  materials: number;        // supplier cost for everything you buy for this job
  ownerDays: number;        // hands-on days of YOUR work (not waiting or drying)
  helperDays: number;       // days your helper works on it
  transport: number;        // delivery / travel for this job
  takeOverride: number | null; // set only if you deliberately want a different take
}

export interface QuoteResult {
  materials: number;
  consumables: number;
  helperCost: number;
  transport: number;
  take: number;             // what is left for you
  total: number;            // price to the customer, rounded up to the next R50
  deposit: number;
  targetTake: number;       // the target for this job type and size
  floorTake: number;        // ownerDays x your day floor
  effectiveOwnerDay: number | null;
  warnings: string[];
}

const n = (v: unknown): number => {
  const x = Number(v);
  return Number.isFinite(x) && x > 0 ? x : 0;
};

export function targetTake(jobType: JobType, size: FurnitureSize, s: PricingSettings): number {
  if (jobType === 'kitchen') return s.kitchenTake;
  if (jobType === 'restoration') return s.restorationMin;
  return size === 'small' ? s.furnitureSmall : size === 'large' ? s.furnitureLarge : s.furnitureMedium;
}

export function computeQuote(input: QuoteInputs, s: PricingSettings): QuoteResult {
  const materials = n(input.materials);
  const ownerDays = n(input.ownerDays);
  const helperDays = n(input.helperDays);
  const transport = n(input.transport);

  const consumables = materials * (s.consumablesPct / 100);
  const helperCost = helperDays * s.helperDayRate;
  const target = targetTake(input.jobType, input.size, s);
  const floorTake = ownerDays * s.ownerDayFloor;

  const override = input.takeOverride === null || input.takeOverride === undefined ? null : n(input.takeOverride);
  const wantedTake = override !== null ? override : Math.max(target, floorTake);

  const costs = materials + consumables + helperCost + transport;
  const total = Math.ceil((costs + wantedTake) / 50) * 50;
  const take = total - costs; // rounding up goes to you
  const deposit = Math.round((total * s.depositPct) / 100);
  const effectiveOwnerDay = ownerDays > 0 ? take / ownerDays : null;

  const warnings: string[] = [];
  if (materials === 0) warnings.push('Materials are R0. Enter what the supplier charges, or this quote is too low.');
  if (ownerDays === 0) warnings.push('Enter your hands-on days so your day value can be checked.');
  if (effectiveOwnerDay !== null && effectiveOwnerDay < s.ownerDayFloor - 0.5) {
    warnings.push(`Your take works out to R${Math.round(effectiveOwnerDay)} per day of your work, below your R${s.ownerDayFloor} floor.`);
  }
  if (override !== null && take < target - 0.5) {
    warnings.push(`This take is R${Math.round(target - take)} below your target for this job.`);
  }
  if (override === null && floorTake > target && input.jobType !== 'restoration') {
    warnings.push(`The job is long enough that your day floor (R${Math.round(floorTake)}) is higher than the usual target, so the price was raised.`);
  }

  return {
    materials, consumables, helperCost, transport, take, total, deposit,
    targetTake: target, floorTake, effectiveOwnerDay, warnings,
  };
}

export const fmtR = (v: number): string => 'R ' + Math.round(v).toLocaleString('en-ZA').replace(/\u00a0/g, ' ');

/** The text a customer sees. It shows the total only, never your costs or your take. */
export function quoteMessage(name: string, service: string, r: QuoteResult, depositPct: number): string {
  const first = (name || '').trim().split(/\s+/)[0] || 'there';
  return (
    `Hi ${first}, thank you for the opportunity to quote on your ${service.toLowerCase()}.\n\n` +
    `Your quote: ${fmtR(r.total)}, including all materials and labour.\n` +
    `A ${depositPct}% deposit (${fmtR(r.deposit)}) secures your booking.\n\n` +
    `Please let me know if you'd like anything explained or adjusted.\n` +
    `Imtiyaaz, The Elegant Company`
  );
}
