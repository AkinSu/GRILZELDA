import type { Product, Gender, Editorial } from '../types/product';

const MODEL = "/1b70cd61-2997-4b97-b020-4c3e63987e64.jpg";
const CAPE = "/bc7b602c-fb91-4652-9005-ac47ad5538a7.jpg";
const TURTLENECK = "/4ab374bc-db29-4563-96e6-987e4455759d.jpg";
const DENIM = "/102428b6-178e-4b27-ae71-da9f464fea74.jpg";
const BAG = "/92c956c5-0c32-43e1-b843-c8277ece5fb2.jpg";
const BOOTS = "/5032ea96-677a-4f3e-9b28-ef103ecd55fb.jpg";
const SCARF = "/5f716fca-299c-498d-aacd-af74e72b9c03.jpg";
const COAT = "/96f6af08-e218-44be-a31e-ffd19892df9f.jpg";
const SUNGLASSES = "/4de34b65-ea41-4dd7-bb89-0b5a51438c19.jpg";
const LOAFER = "/bc4d68dc-9e92-495d-a4b2-2af62d13a4f8.jpg";
const MODEL_MEN = "/13f9b3a4-b93f-4464-8edf-75671fdc08e0.jpg";

export const womenProducts: Product[] = [
  {
    id: 'w1',
    name: 'Shearling cape',
    price: 6500,
    tag: 'Runway',
    line: 'Ready-to-Wear',
    color: 'Brown',
    images: [CAPE, MODEL]
  },
  {
    id: 'w2',
    name: 'Soft nappa turtleneck top',
    price: 3800,
    tag: 'Runway',
    soldOutOnline: true,
    line: 'Ready-to-Wear',
    color: 'Black',
    images: [TURTLENECK, MODEL]
  },
  {
    id: 'w3',
    name: 'Cotton denim pants with soft coating',
    price: 1150,
    tag: 'Runway',
    line: 'Ready-to-Wear',
    color: 'Blue',
    images: [DENIM, MODEL]
  },
  {
    id: 'w4',
    name: 'Horsebit Duomo medium top handle bag',
    price: 3950,
    tag: 'Runway',
    line: 'Handbags',
    color: 'Black',
    images: [BAG, MODEL]
  },
  {
    id: 'w5',
    name: 'Horsebit ankle boot',
    price: 1690,
    line: 'Shoes',
    color: 'Black',
    images: [BOOTS]
  },
  {
    id: 'w6',
    name: 'Equestrian print silk scarf',
    price: 520,
    line: 'Accessories',
    color: 'Green',
    images: [SCARF]
  },
  {
    id: 'w7',
    name: 'Double-breasted wool coat',
    price: 4900,
    tag: 'Runway',
    line: 'Ready-to-Wear',
    color: 'Beige',
    images: [COAT, MODEL]
  },
  {
    id: 'w8',
    name: 'Oversize cat-eye sunglasses',
    price: 460,
    line: 'Accessories',
    color: 'Black',
    images: [SUNGLASSES]
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
    images: [LOAFER, MODEL_MEN]
  },
  {
    id: 'm2',
    name: 'Nappa leather high-neck top',
    price: 3600,
    tag: 'Runway',
    line: 'Ready-to-Wear',
    color: 'Black',
    images: [TURTLENECK, MODEL_MEN]
  },
  {
    id: 'm3',
    name: 'Straight-leg coated denim pants',
    price: 1050,
    line: 'Ready-to-Wear',
    color: 'Blue',
    images: [DENIM, MODEL_MEN]
  },
  {
    id: 'm4',
    name: 'Belted wool overcoat',
    price: 5200,
    tag: 'Runway',
    soldOutOnline: true,
    line: 'Ready-to-Wear',
    color: 'Beige',
    images: [COAT, MODEL_MEN]
  },
  {
    id: 'm5',
    name: 'Printed silk pocket square',
    price: 320,
    line: 'Accessories',
    color: 'Green',
    images: [SCARF]
  },
  {
    id: 'm6',
    name: 'Squared-frame acetate sunglasses',
    price: 440,
    line: 'Accessories',
    color: 'Black',
    images: [SUNGLASSES]
  },
  {
    id: 'm7',
    name: 'Horsebit Duomo leather briefcase',
    price: 4300,
    line: 'Handbags',
    color: 'Black',
    images: [BAG]
  },
  {
    id: 'm8',
    name: 'Leather ankle boot with heel',
    price: 1590,
    line: 'Shoes',
    color: 'Black',
    images: [BOOTS]
  }
];

export const editorialsByGender: Record<Gender, Editorial[]> = {
  women: [
    {
      id: 'e-women-1',
      image: "/d907763c-20b3-49d7-b35f-2de04bdac9db.jpg",
      label: "Shop Women's Ready-to-Wear",
      position: 4
    },
    {
      id: 'e-women-2',
      image: "/3f6b1d83-54af-43f9-83ae-7124498f9302.jpg",
      label: 'Shop All Handbags',
      position: 8
    }
  ],
  men: [
    {
      id: 'e-men-1',
      image: "/d907763c-20b3-49d7-b35f-2de04bdac9db.jpg",
      label: "Shop Men's Ready-to-Wear",
      position: 4
    },
    {
      id: 'e-men-2',
      image: "/3f6b1d83-54af-43f9-83ae-7124498f9302.jpg",
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
  women: BAG,
  men: LOAFER
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
