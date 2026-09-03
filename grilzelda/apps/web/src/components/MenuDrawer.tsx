'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { menuLinks, menuSecondaryLinks } from '../data/products';

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Main navigation">
          <motion.button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 cursor-default bg-white/50 backdrop-blur-md" />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col border-l border-hairline bg-white">
            <div className="flex justify-end p-5">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white transition-transform duration-150 ease-luxe hover:scale-105">
                <XIcon className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-10 pb-12">
              <ul className="space-y-[26px]">
                {menuLinks.map((link) =>
                  <li key={link}>
                    <a
                      href="#"
                      onClick={onClose}
                      className="text-[19px] leading-none text-ink transition-opacity duration-150 ease-luxe hover:opacity-55">
                      {link}
                    </a>
                  </li>
                )}
              </ul>

              <ul className="mt-12 space-y-6">
                {menuSecondaryLinks.map((link) =>
                  <li key={link}>
                    <a
                      href="#"
                      onClick={onClose}
                      className="text-[13px] leading-none text-ink transition-opacity duration-150 ease-luxe hover:opacity-55">
                      {link}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        </div>
      }
    </AnimatePresence>
  );
}
