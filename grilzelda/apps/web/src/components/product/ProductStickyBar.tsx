'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '../../types/product';
import { formatPrice } from '../../utils/format';

interface ProductStickyBarProps {
  product: Product;
}

export function ProductStickyBar({ product }: ProductStickyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const anchor = document.getElementById('buy-panel');
      if (!anchor) return;
      setVisible(anchor.getBoundingClientRect().bottom < 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible &&
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-6">
          <div className="pointer-events-auto flex w-full max-w-3xl items-center gap-4 bg-ink/90 pr-6 backdrop-blur-sm">
            <img
              src={product.images[0]}
              alt=""
              className="h-16 w-16 shrink-0 bg-white object-contain p-2" />
            <span className="flex-1 truncate text-[15px] text-white">{product.name}</span>
            <span className="text-[15px] text-white">{formatPrice(product.price)}</span>
            <button type="button" className="text-[15px] text-white underline underline-offset-4">
              Select Options
            </button>
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
}
