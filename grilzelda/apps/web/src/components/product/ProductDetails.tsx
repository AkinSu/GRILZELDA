'use client';

import React, { useState } from 'react';
import { PlusIcon, MinusIcon, ChevronDownIcon } from 'lucide-react';
import type { Product } from '../../types/product';
import { formatPrice } from '../../utils/format';
import { calculatePrice } from '../../utils/pricing';
import {
  EXTRA_LABEL,
  FINISH_LABEL,
  METAL_LABEL,
  STYLE_LABEL,
  metalLabel,
  toothCountLabel,
} from '../../data/taxonomy';

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

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-hairline py-3.5">
      <dt className="text-[13px] uppercase tracking-[0.08em] text-muted">{label}</dt>
      <dd className="text-right text-[15px] text-ink">{value}</dd>
    </div>
  );
}

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [readMore, setReadMore] = useState(false);
  const { config } = product;
  const price = calculatePrice(config);

  const extrasLabel =
    config.extras.length > 0
      ? config.extras.map((extra) => EXTRA_LABEL[extra]).join(', ')
      : 'None';

  return (
    <div className="pb-4">
      <p className="text-[13px] text-ink">{metalLabel(config)}</p>
      <h1 className="mt-1 text-[26px] font-normal leading-tight text-ink">{product.name}</h1>

      <p className="mt-6 text-[22px] text-ink">
        <span className="text-muted">from </span>
        {formatPrice(price.total)}
      </p>
      <p className="mt-2 text-[14px] text-muted">
        {price.toothCount} {price.toothCount === 1 ? 'tooth' : 'teeth'} × {formatPrice(price.perTooth)} per tooth
        {price.extrasSubtotal > 0 && <> + {formatPrice(price.extrasSubtotal)} in extras</>}
      </p>

      <div className="mt-12">
        <h2 className="text-[13px] uppercase tracking-[0.08em] text-muted">Specification</h2>
        <dl className="mt-4 border-t border-hairline">
          <SpecRow label="Style" value={STYLE_LABEL[config.style]} />
          <SpecRow label="Finish" value={FINISH_LABEL[config.finish]} />
          <SpecRow label="Metal" value={`${config.karat}K ${METAL_LABEL[config.metal]}`} />
          <SpecRow label="Teeth" value={toothCountLabel(config.teeth)} />
          <SpecRow label="Extras" value={extrasLabel} />
        </dl>
        <p className="mt-4 text-[14px] leading-relaxed text-muted">
          This is a starting point, not a fixed set — every piece is cut for your teeth.
          Adjust the teeth, metal, and finish when you configure your order.
        </p>
      </div>

      <div className="mt-16">
        <h2 className="text-[19px] font-semibold tracking-[0.02em] text-ink">PRODUCT DESCRIPTION</h2>
        <p className="mt-6 max-w-[62ch] text-[17px] leading-[1.65] text-ink">
          A {STYLE_LABEL[config.style].toLowerCase()} set in {config.karat}K{' '}
          {METAL_LABEL[config.metal].toLowerCase()}, finished{' '}
          {FINISH_LABEL[config.finish].toLowerCase()}. Cast from an impression of your own teeth
          so it seats flush and comes out clean.
          {readMore &&
            ' Grilzelda pieces are made from dental-grade alloys, hand-finished, and inspected before they leave the studio. Nothing is permanent and nothing is glued — your set lifts in and out, and your teeth are untouched underneath.'}
          {!readMore && '…'}
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
          <li>{STYLE_LABEL[config.style]} · {FINISH_LABEL[config.finish]} finish</li>
          <li>{config.karat}K {METAL_LABEL[config.metal].toLowerCase()}</li>
          <li>Covers {toothCountLabel(config.teeth).toLowerCase()}</li>
          <li>Removable — no drilling, no permanent modification</li>
          <li>Hand-finished and made to order in the USA</li>
        </Accordion>
        <Accordion title="Our Commitment">
          <li>Ethically sourced alloys in every piece</li>
          <li>Made to order, so nothing is produced that nobody wears</li>
          <li>Packaging is recyclable and plastic-free</li>
        </Accordion>
        <Accordion title="Care Instructions">
          <li>Remove before eating or sleeping</li>
          <li>Rinse with warm water after each wear</li>
          <li>Clean weekly with a soft brush and mild soap — no bleach or abrasives</li>
          <li>Store dry in the case it shipped in</li>
        </Accordion>
      </div>
    </div>
  );
}
