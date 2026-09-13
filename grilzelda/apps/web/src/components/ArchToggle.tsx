'use client';

import React from 'react';
import { archThumbnails } from '../data/products';
import { ARCH_LABEL, ARCH_OPTIONS } from '../data/taxonomy';
import type { Arch } from '../types/product';

interface ArchToggleProps {
  value: Arch;
  onChange: (value: Arch) => void;
}

export function ArchToggle({ value, onChange }: ArchToggleProps) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Shop by placement">
      {ARCH_OPTIONS.map((arch) => {
        const active = arch === value;
        return (
          <button
            key={arch}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(arch)}
            className={`flex items-center gap-3 py-2 pl-2 pr-6 text-[15px] transition-colors duration-150 ease-luxe ${
              active
                ? 'border border-ink bg-white text-ink'
                : 'border border-transparent bg-shade text-ink hover:bg-[#efeeec]'
            }`}>
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden bg-white">
              <img
                src={archThumbnails[arch]}
                alt=""
                className="h-full w-full object-contain mix-blend-multiply" />
            </span>
            {ARCH_LABEL[arch]}
          </button>
        );
      })}
    </div>
  );
}
