'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon, CheckIcon } from 'lucide-react';
import { filterColors, filterLines } from '../data/products';

export type SortKey = 'recommended' | 'newest' | 'price-asc' | 'price-desc';

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' }
];

interface FilterSortDrawerProps {
  open: boolean;
  onClose: () => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  lines: string[];
  colors: string[];
  onToggleLine: (line: string) => void;
  onToggleColor: (color: string) => void;
  onClear: () => void;
  resultCount: number;
}

export function FilterSortDrawer({
  open,
  onClose,
  sort,
  onSortChange,
  lines,
  colors,
  onToggleLine,
  onToggleColor,
  onClear,
  resultCount
}: FilterSortDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
        <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Filter and sort">
          <motion.button
            type="button"
            aria-label="Close filters"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 cursor-default bg-black/15" />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[400px] flex-col bg-white">
            <div className="flex items-center justify-between border-b border-hairline px-8 py-5">
              <h2 className="text-[13px] uppercase tracking-[0.1em]">Filter and sort</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="text-ink transition-opacity duration-150 ease-luxe hover:opacity-60">
                <XIcon className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8">
              <fieldset>
                <legend className="mb-4 text-[12px] uppercase tracking-[0.1em] text-muted">Sort by</legend>
                <div className="space-y-3">
                  {SORT_OPTIONS.map((option) =>
                    <label key={option.id} className="flex cursor-pointer items-center gap-3 text-[15px]">
                      <input
                        type="radio"
                        name="sort"
                        checked={sort === option.id}
                        onChange={() => onSortChange(option.id)}
                        className="h-3.5 w-3.5 appearance-none rounded-full border border-ink checked:border-[4px] checked:border-ink" />
                      {option.label}
                    </label>
                  )}
                </div>
              </fieldset>

              <FilterGroup
                title="Category"
                options={filterLines}
                selected={lines}
                onToggle={onToggleLine} />

              <FilterGroup
                title="Color"
                options={filterColors}
                selected={colors}
                onToggle={onToggleColor} />
            </div>

            <div className="flex items-center gap-3 border-t border-hairline px-8 py-5">
              <button
                type="button"
                onClick={onClear}
                className="flex-1 border border-ink py-3 text-[12px] uppercase tracking-[0.1em] transition-colors duration-150 ease-luxe hover:bg-shade">
                Clear all
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-ink py-3 text-[12px] uppercase tracking-[0.1em] text-white transition-opacity duration-150 ease-luxe hover:opacity-85">
                View {resultCount} items
              </button>
            </div>
          </motion.div>
        </div>
      }
    </AnimatePresence>
  );
}

interface FilterGroupProps {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

function FilterGroup({ title, options, selected, onToggle }: FilterGroupProps) {
  return (
    <fieldset className="mt-10 border-t border-hairline pt-8">
      <legend className="mb-4 text-[12px] uppercase tracking-[0.1em] text-muted">{title}</legend>
      <div className="space-y-3">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <label key={option} className="flex cursor-pointer items-center gap-3 text-[15px]">
              <span
                className={`flex h-4 w-4 items-center justify-center border transition-colors duration-150 ease-luxe ${
                  checked ? 'border-ink bg-ink text-white' : 'border-ink bg-white text-transparent'
                }`}>
                <CheckIcon className="h-3 w-3" strokeWidth={2.5} />
              </span>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(option)}
                className="sr-only" />
              {option}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
