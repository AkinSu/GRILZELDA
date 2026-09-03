export type Gender = 'women' | 'men';

export interface Product {
  id: string;
  name: string;
  price: number;
  tag?: string;
  soldOutOnline?: boolean;
  line: string;
  color: string;
  images: string[];
}

export interface Editorial {
  id: string;
  image: string;
  label: string;
  /** Index in the product list this tile is inserted before. */
  position: number;
}
