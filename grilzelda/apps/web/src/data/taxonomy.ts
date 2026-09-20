import type {
  Arch,
  Extra,
  Finish,
  GrillConfig,
  GrillStyle,
  Karat,
  Metal,
  ToothSelection,
} from '../types/product';
import { TEETH_PER_ARCH } from '../types/product';

/* ── Display labels ─────────────────────────────────────────── */

export const STYLE_LABEL: Record<GrillStyle, string> = {
  'open-face': 'Open Face',
  'closed-face': 'Closed Face',
  'fang-set': 'Fang Set',
  'single-cap': 'Single Cap',
  'double-cap': 'Double Cap',
};

export const FINISH_LABEL: Record<Finish, string> = {
  solid: 'Solid',
  'diamond-cut': 'Diamond Cut',
  'deep-cut': 'Deep Cut',
  'diamond-dust': 'Diamond Dust',
  'iced-out': 'Iced Out',
};

export const METAL_LABEL: Record<Metal, string> = {
  'yellow-gold': 'Yellow Gold',
  'white-gold': 'White Gold',
  'rose-gold': 'Rose Gold',
  silver: 'Silver',
  'two-tone': 'Two-Tone',
  'tri-color': 'Tri-Color',
};

export const ARCH_LABEL: Record<Arch, string> = {
  top: 'Top',
  bottom: 'Bottom',
  both: 'Top & Bottom',
};

export const EXTRA_LABEL: Record<Extra, string> = {
  'extended-fangs': 'Extended Fangs',
  'laser-engraving': 'Laser Engraving',
  'abstract-design': 'Abstract Design',
};

/* ── Filter options — ordered, and typed to the unions ──────── */

export const STYLE_OPTIONS: GrillStyle[] = [
  'open-face',
  'closed-face',
  'fang-set',
  'single-cap',
  'double-cap',
];

export const FINISH_OPTIONS: Finish[] = [
  'solid',
  'diamond-cut',
  'deep-cut',
  'diamond-dust',
  'iced-out',
];

export const METAL_OPTIONS: Metal[] = [
  'yellow-gold',
  'white-gold',
  'rose-gold',
  'silver',
  'two-tone',
  'tri-color',
];

export const KARAT_OPTIONS: Karat[] = [10, 14, 18];

export const ARCH_OPTIONS: Arch[] = ['top', 'bottom', 'both'];

/* ── Derivations ────────────────────────────────────────────── */

/** Which arch (or both) a selection actually covers. */
export function archOf(teeth: ToothSelection): Arch {
  const hasTop = teeth.top.length > 0;
  const hasBottom = teeth.bottom.length > 0;
  if (hasTop && hasBottom) return 'both';
  return hasBottom ? 'bottom' : 'top';
}

/** "14K Yellow Gold" — the line shown over a product image. */
export function metalLabel(config: GrillConfig): string {
  return `${config.karat}K ${METAL_LABEL[config.metal]}`;
}

/** "8 Top", "6 Bottom", "16 Top & Bottom" — what people actually compare. */
export function toothCountLabel(teeth: ToothSelection): string {
  const total = teeth.top.length + teeth.bottom.length;
  return `${total} ${ARCH_LABEL[archOf(teeth)]}`;
}

/**
 * The centred `count` teeth of an arch. Grillz are worn across the front,
 * so a "6" is the middle six of the twelve visible positions, not the first six.
 */
export function frontTeeth(count: number): number[] {
  const clamped = Math.max(0, Math.min(TEETH_PER_ARCH, count));
  const start = Math.floor((TEETH_PER_ARCH - clamped) / 2) + 1;
  return Array.from({ length: clamped }, (_, i) => start + i);
}
