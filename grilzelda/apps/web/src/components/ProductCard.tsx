'use client';

import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '../types/product';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
}

type SlideDir = 1 | -1 | null;

const SLIDE_DUR = 0.75;
const FADE_DUR = 1.1;
const EASE = [0.23, 1, 0.32, 1] as const;

// Variants receive dir baked in at render time via custom.
// We do NOT pass custom to AnimatePresence — so each exiting element
// keeps the dir it was born with, not whatever dir is now.
const variants = {
  enter: (dir: SlideDir) => ({
    x: dir === null ? 0 : dir > 0 ? '100%' : '-100%',
    opacity: dir === null ? 0 : 1,
  }),
  center: (dir: SlideDir) => ({
    x: 0,
    opacity: 1,
    transition: { duration: dir === null ? FADE_DUR : SLIDE_DUR, ease: EASE },
  }),
  exit: (dir: SlideDir) => ({
    x: dir === null ? 0 : dir > 0 ? '-100%' : '100%',
    opacity: dir === null ? 0 : 1,
    transition: { duration: dir === null ? FADE_DUR : SLIDE_DUR, ease: EASE },
  }),
};

interface ImgState {
  index: number;
  dir: SlideDir;
  uid: number; // unique per transition — locks dir to this instance's lifetime
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [state, setState] = useState<ImgState>({ index: 0, dir: null, uid: 0 });
  const animating = useRef(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAlternates = product.images.length > 1;

  const enter = () => {
    hoverTimer.current = setTimeout(() => {
      setHovered(true);
      if (hasAlternates) {
        setState(s => ({ index: 1, dir: null, uid: s.uid + 1 }));
      }
    }, 150);
  };

  const leave = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setHovered(false);
    setState(s => ({ index: 0, dir: null, uid: s.uid + 1 }));
  };

  const step = (direction: 1 | -1) => {
    if (animating.current) return;
    animating.current = true;
    setState(s => ({
      index: (s.index + direction + product.images.length) % product.images.length,
      dir: direction,
      uid: s.uid + 1,
    }));
    setTimeout(() => { animating.current = false; }, SLIDE_DUR * 1000);
  };

  const showControls = hovered && hasAlternates;

  return (
    <article
      className="group flex flex-col border-b border-l border-white"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}>
      <Link href={`/shop/${product.id}`} tabIndex={-1} aria-hidden="true" className="relative aspect-[3/4] w-full overflow-hidden bg-white block">
        <AnimatePresence initial={false}>
          <motion.img
            key={state.uid}
            src={product.images[state.index]}
            alt={product.name}
            custom={state.dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`absolute inset-0 h-full w-full ${state.index === 0 ? 'object-contain p-8' : 'object-cover'}`} />
        </AnimatePresence>

        {product.tag &&
          <span className="absolute left-5 top-5 z-10 text-[12px] leading-none text-muted">{product.tag}</span>
        }

        {hasAlternates &&
          <>
            <CarouselArrow
              side="left"
              visible={showControls}
              onClick={(e) => { e.preventDefault(); step(-1); }}
              label={`Previous image of ${product.name}`} />
            <CarouselArrow
              side="right"
              visible={showControls}
              onClick={(e) => { e.preventDefault(); step(1); }}
              label={`Next image of ${product.name}`} />
            <div
              className={`absolute bottom-0 left-0 flex w-1/2 transition-opacity duration-200 ease-luxe ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden="true">
              {product.images.map((image, imageIndex) =>
                <span
                  key={image}
                  className={`h-[3px] flex-1 ${imageIndex === state.index ? 'bg-ink' : 'bg-hairline'}`} />
              )}
            </div>
          </>
        }
      </Link>

      <div className="px-5 pb-8 pt-5">
        <p className="h-[14px] text-[10px] uppercase leading-[14px] tracking-[0.08em] text-muted">
          {product.soldOutOnline ? 'Sold out online' : ''}
        </p>
        <h3 className="mt-1.5 h-[18px] text-[13px] font-normal leading-[18px] text-ink">
          <Link
            href={`/shop/${product.id}`}
            title={product.name}
            className="block truncate whitespace-nowrap transition-opacity duration-150 ease-luxe hover:opacity-60">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 h-[18px] text-[13px] leading-[18px] text-ink">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}

interface CarouselArrowProps {
  side: 'left' | 'right';
  visible: boolean;
  onClick: (e: React.MouseEvent) => void;
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
