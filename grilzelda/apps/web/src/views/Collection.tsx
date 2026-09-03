'use client';

import React, { useMemo, useState } from 'react';
import { SlidersHorizontalIcon } from 'lucide-react';
import { GenderToggle } from '../components/GenderToggle';
import { ProductCard } from '../components/ProductCard';
import { EditorialTile } from '../components/EditorialTile';
import { FilterSortDrawer, type SortKey } from '../components/FilterSortDrawer';
import { productsByGender, editorialsByGender } from '../data/products';
import type { Editorial, Gender, Product } from '../types/product';

interface CollectionProps {
  gender: Gender;
  onGenderChange: (gender: Gender) => void;
}

const SORT_LABEL: Record<SortKey, string> = {
  recommended: 'Recommended',
  newest: 'Newest',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low'
};

type GridItem = { kind: 'product'; product: Product } | { kind: 'editorial'; editorial: Editorial };

export function Collection({ gender, onGenderChange }: CollectionProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>('recommended');
  const [lines, setLines] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  const filtersActive = lines.length > 0 || colors.length > 0 || sort !== 'recommended';

  const products = useMemo(() => {
    const source = productsByGender[gender].filter((product) => {
      const lineMatch = lines.length === 0 || lines.includes(product.line);
      const colorMatch = colors.length === 0 || colors.includes(product.color);
      return lineMatch && colorMatch;
    });

    if (sort === 'price-asc') return [...source].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...source].sort((a, b) => b.price - a.price);
    if (sort === 'newest') return [...source].reverse();
    return source;
  }, [gender, lines, colors, sort]);

  const gridItems = useMemo<GridItem[]>(() => {
    const items: GridItem[] = products.map((product) => ({ kind: 'product', product }));
    if (filtersActive) return items;

    const editorials = editorialsByGender[gender];
    let offset = 0;
    editorials.forEach((editorial) => {
      const at = Math.min(editorial.position + offset, items.length);
      items.splice(at, 0, { kind: 'editorial', editorial });
      offset += 1;
    });
    return items;
  }, [products, gender, filtersActive]);

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

  return (
    <main>
      <div className="px-4 pb-6 pt-2 md:px-8">
        <h1 className="text-[17px] uppercase tracking-[0.06em] text-ink">Grilzelda Primavera</h1>
      </div>

      <div className="border-t border-hairline px-4 py-8 md:px-8">
        <GenderToggle value={gender} onChange={onGenderChange} />
      </div>

      <div className="flex items-center justify-between px-4 pb-6 md:px-8">
        <p className="text-[15px] text-ink">
          {products.length} Items sorted by{' '}
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="underline underline-offset-4 transition-opacity duration-150 ease-luxe hover:opacity-60">
            {SORT_LABEL[sort]}
          </button>
        </p>
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-2 text-[15px] transition-opacity duration-150 ease-luxe hover:opacity-60">
          <SlidersHorizontalIcon className="h-[18px] w-[18px]" strokeWidth={1.4} />
          <span className="underline underline-offset-4">Filter and sort</span>
        </button>
      </div>

      {products.length > 0 ?
        <section
          aria-label="Products"
          className="grid grid-cols-1 border-r border-t border-white sm:grid-cols-2 lg:grid-cols-4">
          {gridItems.map((item) =>
            item.kind === 'product' ?
              <ProductCard key={item.product.id} product={item.product} /> :
              <EditorialTile key={item.editorial.id} editorial={item.editorial} />
          )}
        </section> :
        <section className="border-t border-hairline px-4 py-28 text-center md:px-8">
          <p className="text-[17px] text-ink">No items match these filters.</p>
          <button
            type="button"
            onClick={() => {
              setLines([]);
              setColors([]);
            }}
            className="mt-5 border border-ink px-8 py-3 text-[12px] uppercase tracking-[0.1em] transition-colors duration-150 ease-luxe hover:bg-shade">
            Clear filters
          </button>
        </section>
      }

      <FilterSortDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        sort={sort}
        onSortChange={setSort}
        lines={lines}
        colors={colors}
        onToggleLine={(line) => setLines((current) => toggle(current, line))}
        onToggleColor={(color) => setColors((current) => toggle(current, color))}
        onClear={() => {
          setLines([]);
          setColors([]);
          setSort('recommended');
        }}
        resultCount={products.length} />
    </main>
  );
}
