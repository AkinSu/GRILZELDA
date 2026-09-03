import type { Product, Gender, Editorial } from '../types/product';

// Inspo / lifestyle images (hover state)
const I1 = "/inspo1.jpg";
const I2 = "/inspo2.jpg";
const I3 = "/inspo3.jpg";
const I4 = "/inspo4.webp";
const I5 = "/inspo5.webp";
const I6 = "/inspo6.webp";
const I7 = "/inspo7.webp";
const I8 = "/inspo8.webp";
const I9 = "/inspo9.webp";
const I10 = "/inspo10.webp";

// Grill product images (white background)
const G1 = "/grill1.webp";
const G2 = "/grill2.webp";
const G3 = "/grill3.webp";
const G4 = "/grill4.webp";
const G5 = "/grill5.webp";
const G6 = "/grill6.webp";
const G7 = "/grill7.webp";
const G8 = "/grill8.webp";
const G9 = "/grill9.webp";
const G10 = "/grill10.webp";
const G11 = "/grill11.webp";
const G12 = "/grill12.webp";

export const womenProducts: Product[] = [
  {
    id: 'w1',
    name: 'Diamond Cut Open Face',
    price: 6500,
    tag: '10 Karat Solid',
    line: 'Ready-to-Wear',
    color: 'Brown',
    images: [G1, I1]
  },
  {
    id: 'w2',
    name: 'Gemmed Closed Face',
    price: 3800,
    tag: '14 Karat Yellow',
    soldOutOnline: true,
    line: 'Ready-to-Wear',
    color: 'Black',
    images: [G2, I2]
  },
  {
    id: 'w3',
    name: 'Deep Cut Double Cap',
    price: 1150,
    tag: '18 Karat Solid',
    line: 'Ready-to-Wear',
    color: 'Blue',
    images: [G3, I3]
  },
  {
    id: 'w4',
    name: 'Two-Tone Fang Set',
    price: 3950,
    tag: '14 Karat Solid',
    line: 'Handbags',
    color: 'Black',
    images: [G4, I4]
  },
  {
    id: 'w5',
    name: 'Diamond Dust Single Cap',
    price: 1690,
    tag: '18 Karat Yellow',
    line: 'Shoes',
    color: 'Black',
    images: [G5, I5]
  },
  {
    id: 'w6',
    name: 'Tri-Color Open Face',
    price: 520,
    tag: '10 Karat Yellow',
    line: 'Accessories',
    color: 'Green',
    images: [G6, I6]
  },
  {
    id: 'w7',
    name: 'Gemmed Fang Set',
    price: 4900,
    tag: '14 Karat Solid',
    line: 'Ready-to-Wear',
    color: 'Beige',
    images: [G7, I7]
  },
  {
    id: 'w8',
    name: 'Diamond Cut Closed Face',
    price: 460,
    tag: '18 Karat Solid',
    line: 'Accessories',
    color: 'Black',
    images: [G8, I8]
  }
];

export const menProducts: Product[] = [
  {
    id: 'm1',
    name: 'Deep Cut Single Cap',
    price: 1290,
    tag: '10 Karat Yellow',
    line: 'Shoes',
    color: 'Black',
    images: [G9, I9]
  },
  {
    id: 'm2',
    name: 'Diamond Dust Closed Face',
    price: 3600,
    tag: '14 Karat Solid',
    line: 'Ready-to-Wear',
    color: 'Black',
    images: [G10, I10]
  },
  {
    id: 'm3',
    name: 'Two-Tone Double Cap',
    price: 1050,
    tag: '18 Karat Yellow',
    line: 'Ready-to-Wear',
    color: 'Blue',
    images: [G11, I1]
  },
  {
    id: 'm4',
    name: 'Gemmed Open Face',
    price: 5200,
    tag: '10 Karat Solid',
    soldOutOnline: true,
    line: 'Ready-to-Wear',
    color: 'Beige',
    images: [G12, I2]
  },
  {
    id: 'm5',
    name: 'Tri-Color Fang Set',
    price: 320,
    tag: '14 Karat Yellow',
    line: 'Accessories',
    color: 'Green',
    images: [G1, I3]
  },
  {
    id: 'm6',
    name: 'Diamond Cut Double Cap',
    price: 440,
    tag: '18 Karat Solid',
    line: 'Accessories',
    color: 'Black',
    images: [G2, I4]
  },
  {
    id: 'm7',
    name: 'Deep Cut Open Face',
    price: 4300,
    tag: '10 Karat Solid',
    line: 'Handbags',
    color: 'Black',
    images: [G3, I5]
  },
  {
    id: 'm8',
    name: 'Diamond Dust Fang Set',
    price: 1590,
    tag: '14 Karat Yellow',
    line: 'Shoes',
    color: 'Black',
    images: [G4, I6]
  }
];

export const editorialsByGender: Record<Gender, Editorial[]> = {
  women: [
    {
      id: 'e-women-1',
      image: "/inspo10.webp",
      label: "Shop Women's Ready-to-Wear",
      position: 4
    },
    {
      id: 'e-women-2',
      image: "/inspo9.webp",
      label: 'Shop All Handbags',
      position: 8
    }
  ],
  men: [
    {
      id: 'e-men-1',
      image: "/inspo10.webp",
      label: "Shop Men's Ready-to-Wear",
      position: 4
    },
    {
      id: 'e-men-2',
      image: "/inspo9.webp",
      label: 'Shop All Leather Goods',
      position: 8
    }
  ]
};

export const productsByGender: Record<Gender, Product[]> = {
  women: womenProducts,
  men: menProducts
};

export const genderThumbnails: Record<Gender, string> = {
  women: G1,
  men: G9
};

export const menuLinks: { label: string; sub: string[] }[] = [
  { label: 'Shop Grillz', sub: ['Open Face', 'Closed Face', 'Fang Sets', 'Single Cap', 'Double Cap', 'Deep Cut'] },
  { label: 'Book Appointment', sub: ['Custom Fitting', 'Consultation', 'Repair & Resize', 'Group Booking'] },
  { label: 'Gold & Materials', sub: ['10 Karat Gold', '14 Karat Gold', '18 Karat Gold', 'Diamond Dust', 'Gemmed Settings', 'Two-Tone & Tri-Color'] },
  { label: 'Collections', sub: ['Diamond Cut', 'Classic Solid', 'Iced Out', 'Custom Design'] },
  { label: 'New Arrivals', sub: [] },
  { label: 'Custom Order', sub: ['Start Your Design', 'Upload Reference', 'Pricing Guide'] },
  { label: 'Care & Repairs', sub: ['Cleaning Guide', 'Repair Service', 'Warranty'] },
];

export const menuSecondaryLinks = ['Our Story', 'Grilzelda Lookbook', 'Find Us', 'Contact'];

export const filterLines = ['Ready-to-Wear', 'Handbags', 'Shoes', 'Accessories'];
export const filterColors = ['Black', 'Brown', 'Beige', 'Blue', 'Green'];
