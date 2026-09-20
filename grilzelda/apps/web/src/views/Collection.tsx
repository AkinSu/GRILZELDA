'use client';

import React, { useMemo, useState } from 'react';
import { SlidersHorizontalIcon } from 'lucide-react';
import { ArchToggle } from '../components/ArchToggle';
import { ProductCard } from '../components/ProductCard';
import { EditorialTile } from '../components/EditorialTile';
import { FilterSortDrawer, type SortKey } from '../components/FilterSortDrawer';
import { products, editorials } from '../data/products';
import { archOf } from '../data/taxonomy';
import { priceOf } from '../utils/pricing';
import type {
  Arch,
  Editorial,
  Finish,
  GrillStyle,
  Karat,
  Metal,
  Product,
} from '../types/product';

interface CollectionProps {
  arch: Arch;
  onArchChange: (arch: Arch) => void;
}

const SORT_LABEL: Record<SortKey, string> = {
  recommended: 'Recommended',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
};

type GridItem = { kind: 'product'; product: Product } | { kind: 'editorial'; editorial: Editorial };

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function Collection({ arch, onArchChange }: CollectionProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>('recommended');
  const [styles, setStyles] = useState<GrillStyle[]>([]);
  const [finishes, setFinishes] = useState<Finish[]>([]);
  const [metals, setMetals] = useState<Metal[]>([]);
  const [karats, setKarats] = useState<Karat[]>([]);

  const filtersActive =
    styles.length > 0 ||
    finishes.length > 0 ||
    metals.length > 0 ||
    karats.length > 0 ||
    sort !== 'recommended';

  const visible = useMemo(() => {
    const source = products.filter(({ config }) => {
      if (archOf(config.teeth) !== arch) return false;
      if (styles.length > 0 && !styles.includes(config.style)) return false;
      if (finishes.length > 0 && !finishes.includes(config.finish)) return false;
      if (metals.length > 0 && !metals.includes(config.metal)) return false;
      if (karats.length > 0 && !karats.includes(config.karat)) return false;
      return true;
    });

    if (sort === 'price-asc') {
      return [...source].sort((a, b) => priceOf(a.config) - priceOf(b.config));
    }
    if (sort === 'price-desc') {
      return [...source].sort((a, b) => priceOf(b.config) - priceOf(a.config));
    }
    return [...source].sort(
      (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
    );
  }, [arch, styles, finishes, metals, karats, sort]);

  const gridItems = useMemo<GridItem[]>(() => {
    const items: GridItem[] = visible.map((product) => ({ kind: 'product', product }));
    if (filtersActive) return items;

    let offset = 0;
    editorials.forEach((editorial) => {
      const at = Math.min(editorial.position + offset, items.length);
      items.splice(at, 0, { kind: 'editorial', editorial });
      offset += 1;
    });
    return items;
  }, [visible, filtersActive]);

  const clearAll = () => {
    setStyles([]);
    setFinishes([]);
    setMetals([]);
    setKarats([]);
  };

  return (
    <main>
      <div className="px-4 pb-6 pt-2 md:px-8">
        <h1 className="text-[17px] uppercase tracking-[0.06em] text-ink">Grilzelda Gallery</h1>
        <p className="mt-2 max-w-[60ch] text-[14px] leading-relaxed text-muted">
          Every set is made to order and fitted to your teeth. Start from a piece below,
          then adjust the teeth, metal, and finish to your own specification.
        </p>
      </div>

      <div className="border-t border-hairline px-4 py-8 md:px-8">
        <ArchToggle value={arch} onChange={onArchChange} />
      </div>

      <div className="flex items-center justify-between px-4 pb-6 md:px-8">
        <p className="text-[15px] text-ink">
          {visible.length} {visible.length === 1 ? 'piece' : 'pieces'} sorted by{' '}
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

      {visible.length > 0 ?
        <section
          aria-label="Grillz"
          className="grid grid-cols-1 border-r border-t border-white sm:grid-cols-2 lg:grid-cols-4">
          {gridItems.map((item) =>
            item.kind === 'product' ?
              <ProductCard key={item.product.id} product={item.product} /> :
              <EditorialTile key={item.editorial.id} editorial={item.editorial} />
          )}
        </section> :
        <section className="border-t border-hairline px-4 py-28 text-center md:px-8">
          <p className="text-[17px] text-ink">No pieces match these filters.</p>
          <button
            type="button"
            onClick={clearAll}
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
        styles={styles}
        finishes={finishes}
        metals={metals}
        karats={karats}
        onToggleStyle={(value) => setStyles((current) => toggle(current, value))}
        onToggleFinish={(value) => setFinishes((current) => toggle(current, value))}
        onToggleMetal={(value) => setMetals((current) => toggle(current, value))}
        onToggleKarat={(value) => setKarats((current) => toggle(current, value))}
        onClear={() => {
          clearAll();
          setSort('recommended');
        }}
        resultCount={visible.length} />
    </main>
  );
}
