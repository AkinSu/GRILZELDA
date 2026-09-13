/**
 * Grillz are made to order and priced per tooth. Nothing here is a fixed SKU —
 * a `Product` is a *preset*: a starting configuration a customer adjusts.
 */

/** Which arch a set covers. */
export type Arch = 'top' | 'bottom' | 'both';

/** The physical form of the piece. */
export type GrillStyle =
  | 'open-face'
  | 'closed-face'
  | 'fang-set'
  | 'single-cap'
  | 'double-cap';

/** Surface treatment applied to the metal. */
export type Finish =
  | 'solid'
  | 'diamond-cut'
  | 'deep-cut'
  | 'diamond-dust'
  | 'iced-out';

export type Metal =
  | 'yellow-gold'
  | 'white-gold'
  | 'rose-gold'
  | 'silver'
  | 'two-tone'
  | 'tri-color';

export type Karat = 10 | 14 | 18;

/** Add-ons from the custom order form. */
export type Extra = 'extended-fangs' | 'laser-engraving' | 'abstract-design';

/**
 * Teeth are numbered 1–12 per arch, left → right from the viewer's perspective
 * (i.e. as you look at someone's smile). Position 6 and 7 are the two front
 * centre teeth. Only visible teeth are addressable — molars are not.
 */
export const TEETH_PER_ARCH = 12;

export interface ToothSelection {
  top: number[];
  bottom: number[];
}

/** A full specification of one piece — everything needed to quote it. */
export interface GrillConfig {
  teeth: ToothSelection;
  style: GrillStyle;
  finish: Finish;
  metal: Metal;
  karat: Karat;
  extras: Extra[];
}

/**
 * A gallery preset. `config` is the starting point the configurator loads;
 * price is always derived from it, never stored, so the two can't drift.
 */
export interface Product {
  id: string;
  name: string;
  config: GrillConfig;
  images: string[];
  featured?: boolean;
}

export interface Editorial {
  id: string;
  image: string;
  label: string;
  href: string;
  /** Index in the product list this tile is inserted before. */
  position: number;
}
