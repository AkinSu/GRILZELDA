'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, Rotate3dIcon, WebcamIcon } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const syncActive = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const slideWidth = el.scrollWidth / images.length;
    const index = Math.round(el.scrollLeft / slideWidth);
    setActive(Math.max(0, Math.min(images.length - 1, index)));
  }, [images.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncActive, { passive: true });
    return () => el.removeEventListener('scroll', syncActive);
  }, [syncActive]);

  const scrollToIndex = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const slideWidth = el.scrollWidth / images.length;
    el.scrollTo({ left: index * slideWidth, behavior: 'smooth' });
  };

  const step = (dir: number) => {
    const next = Math.max(0, Math.min(images.length - 1, active + dir));
    scrollToIndex(next);
  };

  return (
    <section className="bg-canvas" aria-label="Product images">
      {/* Row 1 — horizontally scrollable image strip */}
      <div id="gallery-row-1" className="relative">
        <div
          ref={trackRef}
          className="no-scrollbar flex h-screen snap-x snap-mandatory overflow-x-auto"
          tabIndex={0}
          aria-label="Product image carousel">
          {images.map((src, i) =>
            <div key={`${src}-${i}`} className="w-full shrink-0 snap-start md:w-1/2">
              <img
                src={src}
                alt={`${name} — view ${i + 1}`}
                className="h-full w-full object-cover"
                loading={i > 1 ? 'lazy' : 'eager'}
                draggable={false} />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => step(-1)}
          disabled={active === 0}
          aria-label="Previous image"
          className="absolute left-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-ink/15 bg-white/55 text-ink backdrop-blur-sm transition-colors duration-150 ease-out hover:border-ink/40 hover:bg-white disabled:pointer-events-none disabled:opacity-0 sm:flex">
          <ChevronLeftIcon className="h-5 w-5" strokeWidth={1} />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={active === images.length - 1}
          aria-label="Next image"
          className="absolute right-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-ink/15 bg-white/55 text-ink backdrop-blur-sm transition-colors duration-150 ease-out hover:border-ink/40 hover:bg-white disabled:pointer-events-none disabled:opacity-0 sm:flex">
          <ChevronRightIcon className="h-5 w-5" strokeWidth={1} />
        </button>

        <div
          className="absolute inset-x-0 bottom-7 z-20 flex items-center justify-center gap-2.5"
          role="tablist"
          aria-label="Image position">
          {images.map((src, i) =>
            <button
              key={`dot-${src}-${i}`}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Go to image ${i + 1} of ${images.length}`}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-150 ease-out ${
                active === i ? 'bg-ink' : 'bg-ink/25 hover:bg-ink/50'
              }`} />
          )}
        </div>
      </div>

      {/* Row 2 — reserved for the 3D viewer */}
      <div
        className="relative flex min-h-[70vh] w-full items-center justify-center border-t border-white bg-[#eceae8]"
        aria-label="3D product view">
        <div className="flex flex-col items-center gap-4 text-center">
          <Rotate3dIcon className="h-8 w-8 text-neutral-500" strokeWidth={1.25} />
          <p className="text-[13px] font-medium tracking-[0.16em] text-neutral-600">3D VIEW</p>
        </div>

        <div className="absolute inset-x-0 bottom-10 flex justify-center">
          <button
            type="button"
            className="group flex items-center gap-3 border-b border-ink pb-2 text-ink transition-opacity duration-150 ease-out hover:opacity-70">
            <WebcamIcon className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-[13px] font-medium tracking-[0.16em]">TRY ON</span>
          </button>
        </div>
      </div>
    </section>
  );
}
