'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import { menuLinks, menuSecondaryLinks } from '../data/products';

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

// Measured from reference recording — do not change these values
const EASE = [0.4, 0.14, 0.01, 1] as const;
const OPEN_DUR = 0.7;
const CLOSE_DUR = 0.6;
const SUBMENU_DUR = 0.65;
const CLOSE_BTN_DELAY = 0.38;
const CLOSE_BTN_DUR = 0.25;

// Active subpanel: null = root, string = link label
type Panel = null | string;

export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const [panel, setPanel] = useState<Panel>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Reset subpanel on close
  useEffect(() => {
    if (!open) setTimeout(() => setPanel(null), (CLOSE_DUR + 0.05) * 1000);
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (panel !== null) setPanel(null);
        else onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, panel]);

  // Focus trap
  useEffect(() => {
    if (!open) return;
    const el = panelRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    el.addEventListener('keydown', trap);
    return () => el.removeEventListener('keydown', trap);
  }, [open, panel]);

  const activeMenu = menuLinks.find(l => l.label === panel);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation">

          {/* Backdrop */}
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: OPEN_DUR, ease: EASE }}
            style={{ WebkitBackdropFilter: 'blur(15px)', backdropFilter: 'blur(15px)' }}
            className="absolute inset-0 cursor-default bg-black/40" />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              x: open
                ? { duration: OPEN_DUR, ease: EASE }
                : { duration: CLOSE_DUR, ease: EASE }
            }}
            style={{ willChange: 'transform', width: 600, maxWidth: '100vw' }}
            className="absolute right-0 top-0 flex h-full flex-col bg-white overflow-hidden">

            {/* Close button — delayed fade in */}
            <div className="flex justify-end p-5 shrink-0">
              <motion.button
                ref={firstFocusRef}
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: CLOSE_BTN_DELAY, duration: CLOSE_BTN_DUR }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white hover:scale-105 transition-transform duration-150">
                <XIcon className="h-4 w-4" strokeWidth={1.75} />
              </motion.button>
            </div>

            {/* Content area with submenu drill-in */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence initial={false} mode="popLayout">

                {/* Root panel */}
                {panel === null && (
                  <motion.div
                    key="root"
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ duration: SUBMENU_DUR, ease: EASE }}
                    className="absolute inset-0 overflow-y-auto px-10 pb-12">
                    <ul className="space-y-[26px]">
                      {menuLinks.map((link) => (
                        <li key={link.label}>
                          {link.sub.length > 0 ? (
                            <button
                              type="button"
                              onClick={() => setPanel(link.label)}
                              className="flex w-full items-center justify-between text-[19px] leading-none text-ink transition-opacity duration-150 ease-luxe hover:opacity-55">
                              {link.label}
                              <ChevronRightIcon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                            </button>
                          ) : (
                            <a
                              href="#"
                              onClick={onClose}
                              className="text-[19px] leading-none text-ink transition-opacity duration-150 ease-luxe hover:opacity-55">
                              {link.label}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-12 space-y-6">
                      {menuSecondaryLinks.map((link) => (
                        <li key={link}>
                          <a
                            href="#"
                            onClick={onClose}
                            className="text-[13px] leading-none text-ink transition-opacity duration-150 ease-luxe hover:opacity-55">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Subpanel */}
                {panel !== null && activeMenu && (
                  <motion.div
                    key={panel}
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: SUBMENU_DUR, ease: EASE }}
                    className="absolute inset-0 overflow-y-auto px-10 pb-12">
                    <button
                      type="button"
                      onClick={() => setPanel(null)}
                      className="flex items-center gap-2 text-[13px] text-muted transition-opacity duration-150 ease-luxe hover:opacity-60 mb-8">
                      <ChevronLeftIcon className="h-4 w-4" strokeWidth={1.5} />
                      Back
                    </button>
                    <h2 className="text-[19px] leading-none text-ink mb-8">{activeMenu.label}</h2>
                    <ul className="space-y-[22px]">
                      {activeMenu.sub.map((sub) => (
                        <li key={sub}>
                          <a
                            href="#"
                            onClick={onClose}
                            className="text-[17px] leading-none text-ink transition-opacity duration-150 ease-luxe hover:opacity-55">
                            {sub}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
