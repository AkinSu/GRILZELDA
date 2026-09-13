import type {
  Extra,
  Finish,
  GrillConfig,
  Karat,
  Metal,
  ToothSelection,
} from '../types/product';

/* ────────────────────────────────────────────────────────────────
 * PRICE TABLE — this is the only block to edit when rates change.
 * Everything on the site derives from these four maps.
 * ──────────────────────────────────────────────────────────────── */

/** Base cost of one tooth in solid yellow gold, by karat. */
export const PRICE_PER_TOOTH: Record<Karat, number> = {
  10: 130,
  14: 180,
  18: 260,
};

/** Applied to the per-tooth base. Silver is cheaper; mixed metals cost more labour. */
export const METAL_MULTIPLIER: Record<Metal, number> = {
  'yellow-gold': 1,
  'white-gold': 1.05,
  'rose-gold': 1.05,
  silver: 0.35,
  'two-tone': 1.15,
  'tri-color': 1.25,
};

/** Added per tooth on top of the base. */
export const FINISH_PER_TOOTH: Record<Finish, number> = {
  solid: 0,
  'diamond-cut': 40,
  'deep-cut': 55,
  'diamond-dust': 65,
  'iced-out': 150,
};

/** Flat additions to the order, not per tooth. */
export const EXTRA_FLAT: Record<Extra, number> = {
  'extended-fangs': 120,
  'laser-engraving': 60,
  'abstract-design': 250,
};

/* ──────────────────────────────────────────────────────────────── */

export interface PriceBreakdown {
  toothCount: number;
  /** Cost of a single tooth at this metal + karat + finish. */
  perTooth: number;
  teethSubtotal: number;
  extrasSubtotal: number;
  total: number;
}

export function countTeeth(teeth: ToothSelection): number {
  return teeth.top.length + teeth.bottom.length;
}

export function calculatePrice(config: GrillConfig): PriceBreakdown {
  const toothCount = countTeeth(config.teeth);

  const base = PRICE_PER_TOOTH[config.karat] * METAL_MULTIPLIER[config.metal];
  const perTooth = Math.round(base + FINISH_PER_TOOTH[config.finish]);

  const teethSubtotal = perTooth * toothCount;
  const extrasSubtotal = config.extras.reduce(
    (sum, extra) => sum + EXTRA_FLAT[extra],
    0,
  );

  return {
    toothCount,
    perTooth,
    teethSubtotal,
    extrasSubtotal,
    total: teethSubtotal + extrasSubtotal,
  };
}

/** Convenience for cards and listings, where only the total matters. */
export function priceOf(config: GrillConfig): number {
  return calculatePrice(config).total;
}
