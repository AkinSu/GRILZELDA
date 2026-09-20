'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '../types/product';
import { formatPrice } from '../utils/format';
import { priceOf } from '../utils/pricing';
import { metalLabel, toothCountLabel } from '../data/taxonomy';

interface ProductCardProps {
  product: Product;
}

type SlideDir = 1 | -1 | null;

const SLIDE_DUR = 0.75;
const FADE_DUR = 1.1;
const EASE = [0.23, 1, 0.32, 1] as const;
const HOVER_DELAY = 150;

// `custom` goes to AnimatePresence as well as the child, so both halves of one
// transition share a direction: null fades, 1/-1 slides. Without it on
// AnimatePresence an exiting image keeps whatever direction it was *born* with
// and slides out of what should be a fade.
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
  uid: number; // bumped per transition so each image gets its own element
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [state, setState] = useState<ImgState>({ index: 0, dir: null, uid: 0 });
  const hoveredRef = useRef(false);
  const animating = useRef(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAlternates = product.images.length > 1;

  useEffect(() => () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (animTimer.current) clearTimeout(animTimer.current);
  }, []);

  const enter = () => {
    // Clicking an arrow refocuses inside the card and re-fires this. Without the
    // guard it restarts the hover timer and yanks the index back to 1 mid-slide.
    if (hoveredRef.current) return;
    hoveredRef.current = true;
    hoverTimer.current = setTimeout(() => {
      setHovered(true);
      if (hasAlternates) {
        setState(s => ({ index: 1, dir: null, uid: s.uid + 1 }));
      }
    }, HOVER_DELAY);
  };

  const leave = () => {
    if (!hoveredRef.current) return;
    hoveredRef.current = false;
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setHovered(false);
    // Same object back when already at rest, so React bails out of the render.
    setState(s => (s.index === 0 ? s : { index: 0, dir: null, uid: s.uid + 1 }));
  };

  // Focus moving between the arrows is not entering or leaving the card — only
  // react when focus actually crosses the card boundary.
  const handleFocus = (e: React.FocusEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    enter();
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    leave();
  };

  const step = (direction: 1 | -1) => {
    if (animating.current) return;
    animating.current = true;
    setState(s => ({
      index: (s.index + direction + product.images.length) % product.images.length,
      dir: direction,
      uid: s.uid + 1,
    }));
    animTimer.current = setTimeout(() => { animating.current = false; }, SLIDE_DUR * 1000);
  };

  const showControls = hovered && hasAlternates;

  return (
    <article
      className="group flex flex-col border-b border-l border-white"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={handleFocus}
      onBlur={handleBlur}>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
        <Link
          href={`/shop/${product.id}`}
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 block">
          {/* Base layer: the studio shot, always at full opacity, never animated.
              Overlays fade out to reveal it, so its white backdrop never fades in
              as a visible box over the lifestyle photo underneath. */}
          <img
            src={product.images[0]}
            alt=""
            className="absolute inset-0 h-full w-full object-contain p-8" />

          <AnimatePresence initial={false} custom={state.dir}>
            {state.index !== 0 &&
              <motion.img
                key={state.uid}
                src={product.images[state.index]}
                alt={product.name}
                custom={state.dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 h-full w-full object-cover" />
            }
          </AnimatePresence>
        </Link>

        <span className="absolute left-5 top-5 z-10 text-[12px] leading-none text-muted">
          {metalLabel(product.config)}
        </span>

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
              className={`absolute bottom-0 left-0 z-10 flex w-1/2 transition-opacity duration-200 ease-luxe ${
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
      </div>

      <div className="px-5 pb-8 pt-5">
        <p className="h-[14px] text-[10px] uppercase leading-[14px] tracking-[0.08em] text-muted">
          {toothCountLabel(product.config.teeth)}
        </p>
        <h3 className="mt-1.5 h-[18px] text-[13px] font-normal leading-[18px] text-ink">
          <Link
            href={`/shop/${product.id}`}
            title={product.name}
            className="block truncate whitespace-nowrap transition-opacity duration-150 ease-luxe hover:opacity-60">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 h-[18px] text-[13px] leading-[18px] text-ink">
          <span className="text-muted">from </span>
          {formatPrice(priceOf(product.config))}
        </p>
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
