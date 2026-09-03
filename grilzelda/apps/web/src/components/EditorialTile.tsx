'use client';

import React from 'react';
import type { Editorial } from '../types/product';

interface EditorialTileProps {
  editorial: Editorial;
}

export function EditorialTile({ editorial }: EditorialTileProps) {
  return (
    <a
      href="#"
      className="group relative block border-b border-l border-hairline sm:col-span-2"
      aria-label={editorial.label}>
      <div className="aspect-[3/2] w-full" aria-hidden="true" />
      <div className="absolute inset-0 overflow-hidden bg-ink">
        <img
          src={editorial.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 ease-luxe group-hover:scale-[1.06]" />
      </div>
      <span className="absolute bottom-8 left-8 z-10 text-[15px] text-white underline underline-offset-[6px] decoration-white/90">
        {editorial.label}
      </span>
    </a>
  );
}
