'use client';

import React, { useState } from 'react';
import { PlusIcon, MinusIcon, ChevronDownIcon } from 'lucide-react';
import type { Product } from '../../types/product';
import { formatPrice } from '../../utils/format';

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-hairline">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-7 text-left">
        <span className="text-lg font-medium text-ink">{title}</span>
        <ChevronDownIcon
          className={`h-5 w-5 text-ink transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.5} />
      </button>
      {open &&
        <ul className="space-y-1.5 pb-7 text-[15px] leading-relaxed text-muted">
          {React.Children.toArray(children)}
        </ul>
      }
    </div>
  );
}

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [sizeOpen, setSizeOpen] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const sizes = ['10 Karat', '14 Karat', '18 Karat'];

  return (
    <div className="pb-4">
      <p className="text-[13px] text-ink">{product.tag}</p>
      <h1 className="mt-1 text-[26px] font-normal leading-tight text-ink">{product.name}</h1>
      <p className="mt-6 text-[22px] text-ink">{formatPrice(product.price)}</p>

      <div className="mt-12 border-b border-hairline">
        <button
          type="button"
          onClick={() => setSizeOpen((v) => !v)}
          aria-expanded={sizeOpen}
          className="flex w-full items-center justify-between pb-4 text-left">
          <span className="text-[15px] text-ink">
            Karat{selectedSize ? <span className="text-muted"> — {selectedSize}</span> : null}
          </span>
          {sizeOpen
            ? <MinusIcon className="h-4 w-4" strokeWidth={1.5} />
            : <PlusIcon className="h-4 w-4" strokeWidth={1.5} />
          }
        </button>
        {sizeOpen &&
          <div className="flex flex-wrap gap-2 pb-6">
            {sizes.map((size) =>
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`h-11 min-w-[80px] border px-4 text-[13px] tracking-wide transition-colors duration-150 ease-out ${
                  selectedSize === size
                    ? 'border-ink bg-ink text-white'
                    : 'border-hairline text-ink hover:border-ink'
                }`}>
                {size}
              </button>
            )}
          </div>
        }
      </div>

      <div className="mt-16">
        <h2 className="text-[19px] font-semibold tracking-[0.02em] text-ink">PRODUCT DESCRIPTION</h2>
        <p className="mt-6 max-w-[62ch] text-[17px] leading-[1.65] text-ink">
          A signature Grilzelda piece, handcrafted to order. Each set is custom-fitted to your teeth
          and finished to your exact specification — from karat weight to surface treatment.
          {readMore && ' Every piece undergoes rigorous quality inspection before leaving our studio. Grilzelda grillz are made using dental-grade gold alloys for a comfortable, lasting fit that feels natural from day one.'}
          {!readMore && '...'}
        </p>
        <button
          type="button"
          onClick={() => setReadMore((v) => !v)}
          className="mt-6 flex items-center gap-2 text-[15px] text-ink">
          {readMore
            ? <MinusIcon className="h-4 w-4" strokeWidth={1.5} />
            : <PlusIcon className="h-4 w-4" strokeWidth={1.5} />
          }
          {readMore ? 'Read Less' : 'Read More'}
        </button>
      </div>

      <div className="mt-20 border-t border-hairline">
        <Accordion title="Product Details">
          <li>Handcrafted {product.tag} gold</li>
          <li>Custom-fitted to your dental impression</li>
          <li>Removable — no permanent modification</li>
          <li>Available in open face, closed face, and fang styles</li>
          <li>Made in the USA</li>
        </Accordion>
        <Accordion title="Our Commitment">
          <li>Ethically sourced gold alloys in every piece</li>
          <li>All grillz are made to order — reducing waste</li>
          <li>Packaging is 100% recyclable and plastic-free</li>
        </Accordion>
      </div>
    </div>
  );
}
