export type PieceType = 'dining' | 'coffee' | 'bench';
export type WoodKey = 'walnut' | 'oak' | 'ebonised' | 'piano';

export const PIECES: Array<{ key: PieceType; label: string; noun: string }> = [
  { key: 'dining', label: 'Dining table', noun: 'dining table' },
  { key: 'coffee', label: 'Coffee table', noun: 'coffee table' },
  { key: 'bench', label: 'Bench', noun: 'bench' },
];

export const WOOD_OPTIONS: Array<{ key: WoodKey; label: string; swatch: string }> = [
  { key: 'walnut', label: 'Walnut', swatch: '#5b3a22' },
  { key: 'oak', label: 'Oak', swatch: '#c9a06a' },
  { key: 'ebonised', label: 'Ebonised Oak', swatch: '#26211c' },
  { key: 'piano', label: 'Piano Black', swatch: '#0a0a0c' },
];

// Slider limits and defaults in centimetres: [min, max, default]
export const LIMITS: Record<PieceType, { length: [number, number, number]; width: [number, number, number]; height: [number, number, number] }> = {
  dining: { length: [120, 300, 200], width: [70, 120, 95], height: [70, 78, 75] },
  coffee: { length: [70, 160, 110], width: [45, 90, 60], height: [30, 55, 42] },
  bench: { length: [80, 220, 140], width: [28, 50, 38], height: [38, 52, 45] },
};
