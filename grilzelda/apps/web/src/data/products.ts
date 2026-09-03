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
    name: 'Shearling cape',
    price: 6500,
    tag: 'Runway',
    line: 'Ready-to-Wear',
    color: 'Brown',
    images: [G1, I1]
  },
  {
    id: 'w2',
    name: 'Soft nappa turtleneck top',
    price: 3800,
    tag: 'Runway',
    soldOutOnline: true,
    line: 'Ready-to-Wear',
    color: 'Black',
    images: [G2, I2]
  },
  {
    id: 'w3',
    name: 'Cotton denim pants with soft coating',
    price: 1150,
    tag: 'Runway',
    line: 'Ready-to-Wear',
    color: 'Blue',
    images: [G3, I3]
  },
  {
    id: 'w4',
    name: 'Horsebit Duomo medium top handle bag',
    price: 3950,
    tag: 'Runway',
    line: 'Handbags',
    color: 'Black',
    images: [G4, I4]
  },
  {
    id: 'w5',
    name: 'Horsebit ankle boot',
    price: 1690,
    line: 'Shoes',
    color: 'Black',
    images: [G5, I5]
  },
  {
    id: 'w6',
    name: 'Equestrian print silk scarf',
    price: 520,
    line: 'Accessories',
    color: 'Green',
    images: [G6, I6]
  },
  {
    id: 'w7',
    name: 'Double-breasted wool coat',
    price: 4900,
    tag: 'Runway',
    line: 'Ready-to-Wear',
    color: 'Beige',
    images: [G7, I7]
  },
  {
    id: 'w8',
    name: 'Oversize cat-eye sunglasses',
    price: 460,
    line: 'Accessories',
    color: 'Black',
    images: [G8, I8]
  }
];

export const menProducts: Product[] = [
  {
    id: 'm1',
    name: 'Horsebit leather loafer',
    price: 1290,
    tag: 'Runway',
    line: 'Shoes',
    color: 'Black',
    images: [G9, I9]
  },
  {
    id: 'm2',
    name: 'Nappa leather high-neck top',
    price: 3600,
    tag: 'Runway',
    line: 'Ready-to-Wear',
    color: 'Black',
    images: [G10, I10]
  },
  {
    id: 'm3',
    name: 'Straight-leg coated denim pants',
    price: 1050,
    line: 'Ready-to-Wear',
    color: 'Blue',
    images: [G11, I1]
  },
  {
    id: 'm4',
    name: 'Belted wool overcoat',
    price: 5200,
    tag: 'Runway',
    soldOutOnline: true,
    line: 'Ready-to-Wear',
    color: 'Beige',
    images: [G12, I2]
  },
  {
    id: 'm5',
    name: 'Printed silk pocket square',
    price: 320,
    line: 'Accessories',
    color: 'Green',
    images: [G1, I3]
  },
  {
    id: 'm6',
    name: 'Squared-frame acetate sunglasses',
    price: 440,
    line: 'Accessories',
    color: 'Black',
    images: [G2, I4]
  },
  {
    id: 'm7',
    name: 'Horsebit Duomo leather briefcase',
    price: 4300,
    line: 'Handbags',
    color: 'Black',
    images: [G3, I5]
  },
  {
    id: 'm8',
    name: 'Leather ankle boot with heel',
    price: 1590,
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

export const menuLinks = [
  'Primavera Collection',
  'Handbags',
  'Women',
  'Men',
  'New In',
  'Children',
  'Travel',
  'Jewelry & Watches',
  'Décor & Lifestyle',
  'Fragrances & Make-Up',
  'Gifts'
];

export const menuSecondaryLinks = ['Grilzelda Services', 'World of Grilzelda', 'Store Locator'];

export const filterLines = ['Ready-to-Wear', 'Handbags', 'Shoes', 'Accessories'];
export const filterColors = ['Black', 'Brown', 'Beige', 'Blue', 'Green'];
