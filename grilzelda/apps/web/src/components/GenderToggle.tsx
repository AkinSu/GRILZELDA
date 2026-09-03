'use client';

import React from 'react';
import { genderThumbnails } from '../data/products';
import type { Gender } from '../types/product';

interface GenderToggleProps {
  value: Gender;
  onChange: (value: Gender) => void;
}

const OPTIONS: { id: Gender; label: string }[] = [
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' }
];

export function GenderToggle({ value, onChange }: GenderToggleProps) {
  return (
    <div className="flex gap-2" role="tablist" aria-label="Shop by gender">
      {OPTIONS.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={`flex items-center gap-3 py-2 pl-2 pr-6 text-[15px] transition-colors duration-150 ease-luxe ${
              active ? 'border border-ink bg-white text-ink' : 'border border-transparent bg-shade text-ink hover:bg-[#efeeec]'
            }`}>
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden bg-white">
              <img
                src={genderThumbnails[option.id]}
                alt=""
                className="h-full w-full object-contain mix-blend-multiply" />
            </span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
