import type { Arch, Editorial, Product } from '../types/product';
import { frontTeeth } from './taxonomy';

/* Lifestyle / worn shots (card hover state) */
const I1 = '/inspo1.jpg';
const I2 = '/inspo2.jpg';
const I3 = '/inspo3.jpg';
const I4 = '/inspo4.webp';
const I5 = '/inspo5.webp';
const I6 = '/inspo6.webp';
const I7 = '/inspo7.webp';
const I8 = '/inspo8.webp';
const I9 = '/inspo9.webp';
const I10 = '/inspo10.webp';

/* Studio shots on white (card default state) */
const G1 = '/grill1.webp';
const G2 = '/grill2.webp';
const G3 = '/grill3.webp';
const G4 = '/grill4.webp';
const G5 = '/grill5.webp';
const G6 = '/grill6.webp';
const G7 = '/grill7.webp';
const G8 = '/grill8.webp';
const G9 = '/grill9.webp';
const G10 = '/grill10.webp';
const G11 = '/grill11.webp';
const G12 = '/grill12.webp';

const noTeeth = { top: [], bottom: [] };

/**
 * Gallery presets. Each is a starting configuration for the configurator,
 * not a fixed SKU — prices are derived from `config` via `priceOf()`.
 *
 * NOTE: images are mapped sequentially as placeholders. Reassign them so each
 * preset shows a photo that actually matches its style and finish.
 */
export const products: Product[] = [
  {
    id: 'classic-open-face',
    name: 'Classic Open Face',
    config: {
      teeth: { ...noTeeth, top: frontTeeth(6) },
      style: 'open-face',
      finish: 'solid',
      metal: 'yellow-gold',
      karat: 10,
      extras: [],
    },
    images: [G1, I1],
    featured: true,
  },
  {
    id: 'eight-top-open-face',
    name: 'Eight Top Open Face',
    config: {
      teeth: { ...noTeeth, top: frontTeeth(8) },
      style: 'open-face',
      finish: 'solid',
      metal: 'yellow-gold',
      karat: 14,
      extras: [],
    },
    images: [G2, I2],
  },
  {
    id: 'diamond-cut-open-face',
    name: 'Diamond Cut Open Face',
    config: {
      teeth: { ...noTeeth, top: frontTeeth(10) },
      style: 'open-face',
      finish: 'diamond-cut',
      metal: 'yellow-gold',
      karat: 18,
      extras: [],
    },
    images: [G3, I3],
    featured: true,
  },
  {
    id: 'classic-closed-face',
    name: 'Classic Closed Face',
    config: {
      teeth: { ...noTeeth, top: frontTeeth(8) },
      style: 'closed-face',
      finish: 'solid',
      metal: 'yellow-gold',
      karat: 14,
      extras: [],
    },
    images: [G4, I4],
  },
  {
    id: 'bottom-six-closed-face',
    name: 'Bottom Six Closed Face',
    config: {
      teeth: { ...noTeeth, bottom: frontTeeth(6) },
      style: 'closed-face',
      finish: 'solid',
      metal: 'yellow-gold',
      karat: 10,
      extras: [],
    },
    images: [G5, I5],
  },
  {
    id: 'diamond-dust-closed-face',
    name: 'Diamond Dust Closed Face',
    config: {
      teeth: { ...noTeeth, top: frontTeeth(8) },
      style: 'closed-face',
      finish: 'diamond-dust',
      metal: 'yellow-gold',
      karat: 14,
      extras: [],
    },
    images: [G6, I6],
  },
  {
    id: 'yellow-gold-fang-set',
    name: 'Yellow Gold Fang Set',
    config: {
      teeth: { ...noTeeth, top: frontTeeth(8) },
      style: 'fang-set',
      finish: 'solid',
      metal: 'yellow-gold',
      karat: 14,
      extras: ['extended-fangs'],
    },
    images: [G7, I7],
    featured: true,
  },
  {
    id: 'white-gold-diamond-cut-fangs',
    name: 'White Gold Diamond Cut Fangs',
    config: {
      teeth: { ...noTeeth, top: frontTeeth(8) },
      style: 'fang-set',
      finish: 'diamond-cut',
      metal: 'white-gold',
      karat: 18,
      extras: ['extended-fangs'],
    },
    images: [G8, I8],
  },
  {
    id: 'single-gold-cap',
    name: 'Single Gold Cap',
    config: {
      teeth: { ...noTeeth, top: frontTeeth(1) },
      style: 'single-cap',
      finish: 'solid',
      metal: 'yellow-gold',
      karat: 10,
      extras: [],
    },
    images: [G9, I9],
  },
  {
    id: 'iced-single-cap',
    name: 'Iced Single Cap',
    config: {
      teeth: { ...noTeeth, top: frontTeeth(1) },
      style: 'single-cap',
      finish: 'iced-out',
      metal: 'yellow-gold',
      karat: 18,
      extras: [],
    },
    images: [G10, I10],
  },
  {
    id: 'double-gold-cap',
    name: 'Double Gold Cap',
    config: {
      teeth: { ...noTeeth, top: frontTeeth(2) },
      style: 'double-cap',
      finish: 'solid',
      metal: 'yellow-gold',
      karat: 14,
      extras: [],
    },
    images: [G11, I1],
  },
  {
    id: 'deep-cut-double-cap',
    name: 'Deep Cut Double Cap',
    config: {
      teeth: { ...noTeeth, top: frontTeeth(2) },
      style: 'double-cap',
      finish: 'deep-cut',
      metal: 'yellow-gold',
      karat: 14,
      extras: [],
    },
    images: [G12, I2],
  },
  {
    id: 'two-tone-diamond-cut',
    name: 'Two-Tone Diamond Cut',
    config: {
      teeth: { ...noTeeth, top: frontTeeth(8) },
      style: 'closed-face',
      finish: 'diamond-cut',
      metal: 'two-tone',
      karat: 14,
      extras: [],
    },
    images: [G1, I3],
  },
  {
    id: 'tri-color-closed-face',
    name: 'Tri-Color Closed Face',
    config: {
      teeth: { ...noTeeth, top: frontTeeth(10) },
      style: 'closed-face',
      finish: 'solid',
      metal: 'tri-color',
      karat: 14,
      extras: [],
    },
    images: [G2, I4],
  },
  {
    id: 'iced-out-closed-face',
    name: 'Iced Out Closed Face',
    config: {
      teeth: { ...noTeeth, top: frontTeeth(8) },
      style: 'closed-face',
      finish: 'iced-out',
      metal: 'yellow-gold',
      karat: 14,
      extras: [],
    },
    images: [G3, I5],
    featured: true,
  },
  {
    id: 'bottom-eight-closed-face',
    name: 'Bottom Eight Closed Face',
    config: {
      teeth: { ...noTeeth, bottom: frontTeeth(8) },
      style: 'closed-face',
      finish: 'solid',
      metal: 'yellow-gold',
      karat: 14,
      extras: [],
    },
    images: [G6, I7],
  },
  {
    id: 'diamond-cut-bottom-six',
    name: 'Diamond Cut Bottom Six',
    config: {
      teeth: { ...noTeeth, bottom: frontTeeth(6) },
      style: 'open-face',
      finish: 'diamond-cut',
      metal: 'yellow-gold',
      karat: 14,
      extras: [],
    },
    images: [G7, I8],
  },
  {
    id: 'full-set-open-face',
    name: 'Full Set Open Face',
    config: {
      teeth: { top: frontTeeth(8), bottom: frontTeeth(8) },
      style: 'open-face',
      finish: 'solid',
      metal: 'yellow-gold',
      karat: 14,
      extras: [],
    },
    images: [G4, I6],
    featured: true,
  },
  {
    id: 'full-set-diamond-cut',
    name: 'Full Set Diamond Cut',
    config: {
      teeth: { top: frontTeeth(8), bottom: frontTeeth(6) },
      style: 'closed-face',
      finish: 'diamond-cut',
      metal: 'yellow-gold',
      karat: 18,
      extras: [],
    },
    images: [G8, I9],
  },
];

/** Tiles woven into the grid — these point at the process, not more product. */
export const editorials: Editorial[] = [
  {
    id: 'e-process',
    image: '/inspo10.webp',
    label: 'How a Grilzelda Set Is Made',
    href: '/how-it-works',
    position: 4,
  },
  {
    id: 'e-custom',
    image: '/inspo9.webp',
    label: 'Design Your Own',
    href: '/design',
    position: 10,
  },
];

/** Thumbnails for the arch toggle. */
export const archThumbnails: Record<Arch, string> = {
  top: G1,
  bottom: G5,
  both: G4,
};

export const menuLinks: { label: string; sub: string[] }[] = [
  { label: 'Shop Grillz', sub: ['Open Face', 'Closed Face', 'Fang Sets', 'Single Cap', 'Double Cap'] },
  { label: 'Book Appointment', sub: ['Custom Fitting', 'Video Consultation', 'Repair & Resize', 'Group Booking'] },
  { label: 'Gold & Materials', sub: ['10 Karat Gold', '14 Karat Gold', '18 Karat Gold', 'White & Rose Gold', 'Two-Tone & Tri-Color'] },
  { label: 'Finishes', sub: ['Solid', 'Diamond Cut', 'Deep Cut', 'Diamond Dust', 'Iced Out'] },
  { label: 'New Arrivals', sub: [] },
  { label: 'Custom Order', sub: ['Design Your Own', 'Order a Mold Kit', 'Pricing Guide'] },
  { label: 'Care & Repairs', sub: ['Cleaning Guide', 'Repair Service', 'Warranty'] },
];

export const menuSecondaryLinks = ['Our Story', 'Grilzelda Lookbook', 'Find Us', 'Contact'];
