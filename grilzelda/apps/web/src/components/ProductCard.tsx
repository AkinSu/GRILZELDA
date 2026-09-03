'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { Product } from '../types/product';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [index, setIndex] = useState(0);
  const hasAlternates = product.images.length > 1;

  const enter = () => {
    setHovered(true);
    if (hasAlternates) setIndex(1);
  };

  const leave = () => {
    setHovered(false);
    setIndex(0);
  };

  const step = (direction: 1 | -1) => {
    setIndex((current) => (current + direction + product.images.length) % product.images.length);
  };

  const showControls = hovered && hasAlternates;

  return (
    <article
      className="group flex flex-col border-b border-l border-hairline"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-shade">
        <AnimatePresence initial={false}>
          <motion.img
            key={product.images[index]}
            src={product.images[index]}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className={`absolute inset-0 h-full w-full ${index === 0 ? 'object-contain p-8' : 'object-cover'}`} />
        </AnimatePresence>

        {product.tag &&
          <span className="absolute left-5 top-5 z-10 text-[12px] leading-none text-muted">{product.tag}</span>
        }

        {hasAlternates &&
          <>
            <CarouselArrow
              side="left"
              visible={showControls}
              onClick={() => step(-1)}
              label={`Previous image of ${product.name}`} />
            <CarouselArrow
              side="right"
              visible={showControls}
              onClick={() => step(1)}
              label={`Next image of ${product.name}`} />
            <div
              className={`absolute bottom-0 left-0 flex w-1/2 transition-opacity duration-200 ease-luxe ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden="true">
              {product.images.map((image, imageIndex) =>
                <span
                  key={image}
                  className={`h-[3px] flex-1 ${imageIndex === index ? 'bg-ink' : 'bg-hairline'}`} />
              )}
            </div>
          </>
        }
      </div>

      <div className="px-5 pb-8 pt-5">
        <p className="h-[14px] text-[10px] uppercase leading-[14px] tracking-[0.08em] text-muted">
          {product.soldOutOnline ? 'Sold out online' : ''}
        </p>
        <h3 className="mt-1.5 h-[18px] text-[13px] font-normal leading-[18px] text-ink">
          <a
            href="#"
            title={product.name}
            className="block truncate whitespace-nowrap transition-opacity duration-150 ease-luxe hover:opacity-60">
            {product.name}
          </a>
        </h3>
        <p className="mt-2 h-[18px] text-[13px] leading-[18px] text-ink">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}

interface CarouselArrowProps {
  side: 'left' | 'right';
  visible: boolean;
  onClick: () => void;
  label: string;
}

function CarouselArrow({ side, visible, onClick, label }: CarouselArrowProps) {
  const Icon = side === 'left' ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      aria-label={label}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={onClick}
      className={`absolute top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white transition-[opacity,background-color] duration-200 ease-luxe hover:bg-black/45 md:flex ${
        side === 'left' ? 'left-3' : 'right-3'} ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      <Icon className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}
