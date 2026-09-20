'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface CameraPermissionSheetProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function CameraPermissionSheet({ open, onAccept, onDecline }: CameraPermissionSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <>
      {/* Backdrop — portaled to body, escapes all stacking contexts */}
      <div
        className="fixed inset-0 bg-black/75"
        style={{ zIndex: 200, animation: 'fadeIn 300ms ease forwards' }}
        onClick={onDecline} />

      {/* Sheet — above backdrop */}
      <div className="fixed inset-0 flex items-center justify-center px-6" style={{ zIndex: 201, pointerEvents: 'none' }}>
      <div
        ref={sheetRef}
        className="relative w-full max-w-2xl bg-white px-10 pb-14 pt-12"
        style={{ animation: 'slideUp 600ms cubic-bezier(0.23, 1, 0.32, 1) forwards', pointerEvents: 'auto' }}>

        <button
          type="button"
          onClick={onDecline}
          aria-label="Close"
          className="absolute right-6 top-6 text-ink opacity-40 transition-opacity hover:opacity-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-[17px] font-semibold uppercase leading-snug tracking-[0.04em] text-ink">
          To use Virtual Try-On, Grilzelda needs access to your camera.
        </h2>

        <p className="mt-6 text-[16px] leading-relaxed text-muted">
          Your image is analyzed in real time to show how the grillz look on you.
          It is not stored on any server, system, or location outside of your device,
          and is deleted automatically when you close the try-on experience.
        </p>

        <p className="mt-5 text-[16px] leading-relaxed text-muted">
          See the{' '}
          <a href="#" className="text-ink underline underline-offset-4">Grilzelda Privacy Policy</a>
          {' '}for more information on how we handle your data.
          By clicking Accept, you also agree to the{' '}
          <a href="#" className="text-ink underline underline-offset-4">Grilzelda Terms of Service</a>.
        </p>

        <div className="mt-12 flex gap-4">
          <button
            type="button"
            onClick={onDecline}
            className="flex-1 border border-hairline py-5 text-[13px] font-semibold tracking-[0.12em] text-ink transition-colors duration-150 hover:border-ink">
            DECLINE
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="flex-1 bg-ink py-5 text-[13px] font-semibold tracking-[0.12em] text-white transition-opacity duration-150 hover:opacity-85">
            ACCEPT
          </button>
        </div>
      </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </>,
    document.body
  );
}
