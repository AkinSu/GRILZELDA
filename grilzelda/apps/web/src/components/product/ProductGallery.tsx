'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, Rotate3dIcon, WebcamIcon } from 'lucide-react';
import { RingViewer } from '../ThreeDViewer';
import { CameraPermissionSheet } from './CameraPermissionSheet';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [permissionSheet, setPermissionSheet] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [viewerKey, setViewerKey] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      setCameraActive(true);
      // Attach stream to video element after it mounts
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 50);
    } catch {
      // User denied browser prompt
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setOverlayVisible(true);
    setViewerKey(k => k + 1); // remount RingViewer to reset rotation
  };

  const handleTryOn = async () => {
    const CONSENT_KEY = 'grilzelda_camera_consent';
    const hasConsented = localStorage.getItem(CONSENT_KEY) === 'true';

    if (hasConsented) {
      try {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        if (result.state === 'granted') {
          await startCamera();
          return;
        }
      } catch {
        // permissions API not supported — fall through to sheet
      }
    }

    setPermissionSheet(true);
  };

  const handleAccept = async () => {
    localStorage.setItem('grilzelda_camera_consent', 'true');
    setPermissionSheet(false);
    await startCamera();
  };

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting) setOverlayVisible(true); },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    <>
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

      {/* Row 2 — 3D viewer / Camera */}
      <div
        ref={viewerRef}
        className="relative min-h-[70vh] w-full overflow-hidden border-t border-white bg-[#eceae8]"
        aria-label="3D product view">

        {cameraActive ? (
          <>
            {/* Live camera feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 h-full w-full object-cover"
              style={{ transform: 'scaleX(-1)' }} />

            {/* Close button — scaleX(-1) to undo the video mirror */}
            <button
              type="button"
              onClick={stopCamera}
              aria-label="Close camera"
              style={{ transform: 'scaleX(-1)' }}
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center bg-black/40 text-white backdrop-blur-sm transition-opacity hover:opacity-70">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </>
        ) : (
          <>
            {/* Live 3D model — always spinning */}
            <div className="absolute inset-0">
              <RingViewer key={viewerKey} active={!overlayVisible} />
            </div>

            {/* Dark overlay — fades out when user interacts */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{
                background: 'rgba(0,0,0,0.45)',
                transition: 'opacity 500ms ease',
                opacity: overlayVisible ? 1 : 0,
                pointerEvents: overlayVisible ? 'auto' : 'none',
              }}
              onPointerDown={() => setOverlayVisible(false)}>
              <Rotate3dIcon className="h-9 w-9 text-white" strokeWidth={1.25} />
              <p className="mt-3 text-[13px] font-medium tracking-[0.16em] text-white">3D VIEW</p>
              <p className="mt-2 text-[12px] tracking-[0.08em] text-white/60">Click &amp; drag to explore</p>
            </div>

            {/* TRY ON — always visible, color flips with overlay */}
            <div className="absolute inset-x-0 bottom-10 flex justify-center" style={{ pointerEvents: 'none' }}>
              <button
                type="button"
                onClick={handleTryOn}
                style={{
                  pointerEvents: 'auto',
                  transition: 'color 500ms ease, border-color 500ms ease',
                  color: overlayVisible ? '#ffffff' : '#1c1c1c',
                  borderColor: overlayVisible ? '#ffffff' : '#1c1c1c',
                }}
                className="flex items-center gap-3 border-b pb-2 transition-opacity duration-150 hover:opacity-70">
                <WebcamIcon className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-[13px] font-medium tracking-[0.16em]">TRY ON</span>
              </button>
            </div>
          </>
        )}
      </div>
    </section>

    <CameraPermissionSheet
      open={permissionSheet}
      onAccept={handleAccept}
      onDecline={() => setPermissionSheet(false)} />
    </>
  );
}
