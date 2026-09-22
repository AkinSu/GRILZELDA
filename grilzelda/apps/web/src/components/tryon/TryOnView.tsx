'use client';

import React, { useEffect, useRef, useState } from 'react';
import { XIcon } from 'lucide-react';
import { METALS, type Metal } from './grillModel';
import { createTryOnEngine, type TryOnEngine, type TryOnStatus } from './tryOnEngine';

interface TryOnViewProps {
  productName: string;
  onClose: () => void;
}

type Phase = 'camera' | 'loading' | 'live' | 'denied' | 'unsupported' | 'error';

const PHASE_MESSAGE: Partial<Record<Phase, string>> = {
  camera: 'ALLOW CAMERA ACCESS TO TRY ON',
  loading: 'LOADING',
  denied: 'CAMERA ACCESS WAS BLOCKED — ENABLE IT IN YOUR BROWSER TO TRY ON',
  unsupported: 'THIS BROWSER DOES NOT SUPPORT CAMERA TRY ON',
  error: 'SOMETHING WENT WRONG STARTING TRY ON',
};

const STATUS_MESSAGE: Partial<Record<TryOnStatus, string>> = {
  searching: 'CENTRE YOUR FACE IN THE FRAME',
  'closed-mouth': 'SMILE TO SEE THE GRILL',
};

// Dev aid: /shop/w1?tryon-image=/inspo1.jpg runs the tracker on a still image
// instead of the camera. Same-origin paths only.
function debugImagePath() {
  const path = new URLSearchParams(window.location.search).get('tryon-image');
  return path && path.startsWith('/') && !path.startsWith('//') ? path : null;
}

/** Live try-on. Fills its nearest positioned ancestor (the gallery's viewer panel). */
export default function TryOnView({ productName, onClose }: TryOnViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<TryOnEngine | null>(null);

  const [phase, setPhase] = useState<Phase>('camera');
  const [status, setStatus] = useState<TryOnStatus>('loading');
  const [metal, setMetal] = useState<Metal>('yellow');
  const [stillImage] = useState(debugImagePath);

  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | null = null;
    let observer: ResizeObserver | null = null;

    // Size the stage to cover the container at the source's aspect ratio, so
    // the video and the overlay canvas stay pixel-aligned.
    const coverStage = (sourceWidth: number, sourceHeight: number) => {
      const container = containerRef.current;
      const stage = stageRef.current;
      if (!container || !stage) return;
      const fit = () => {
        const ratio = Math.max(container.clientWidth / sourceWidth, container.clientHeight / sourceHeight);
        stage.style.width = `${sourceWidth * ratio}px`;
        stage.style.height = `${sourceHeight * ratio}px`;
      };
      fit();
      observer = new ResizeObserver(fit);
      observer.observe(container);
    };

    const openSource = async (): Promise<HTMLVideoElement | HTMLImageElement | null> => {
      if (stillImage) {
        const image = imageRef.current!;
        await image.decode();
        return image;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setPhase('unsupported');
        return null;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
      } catch (err) {
        const name = (err as DOMException).name;
        setPhase(name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'error');
        return null;
      }
      const video = videoRef.current;
      if (cancelled || !video) {
        stream.getTracks().forEach((track) => track.stop());
        return null;
      }
      video.srcObject = stream;
      await video.play();
      return video;
    };

    (async () => {
      try {
        const source = await openSource();
        if (cancelled || !source || !canvasRef.current) return;
        setPhase('loading');
        const engine = await createTryOnEngine({
          source,
          canvas: canvasRef.current,
          metal: 'yellow',
          onStatus: setStatus,
        });
        if (cancelled) {
          engine.dispose();
          return;
        }
        engineRef.current = engine;
        coverStage(canvasRef.current.width, canvasRef.current.height);
        setPhase('live');
      } catch (err) {
        console.error('Try-on failed to start', err);
        if (!cancelled) setPhase('error');
      }
    })();

    return () => {
      cancelled = true;
      observer?.disconnect();
      engineRef.current?.dispose();
      engineRef.current = null;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stillImage]);

  useEffect(() => {
    engineRef.current?.setMetal(metal);
  }, [metal]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const message = phase === 'live' ? STATUS_MESSAGE[status] : PHASE_MESSAGE[phase];

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={`Try on ${productName}`}
      className="absolute inset-0 overflow-hidden bg-ink text-white">
      {/* Mirrored like a selfie camera; video and overlay share one box. */}
      <div
        ref={stageRef}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -scale-x-100 transition-opacity duration-500 ease-out ${
          phase === 'live' ? 'opacity-100' : 'opacity-0'
        }`}>
        {stillImage ?
          <img ref={imageRef} src={stillImage} alt="" className="h-full w-full" /> :
          <video ref={videoRef} playsInline muted className="h-full w-full" />
        }
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/55 to-transparent" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between px-6 pt-6 lg:px-10">
        <div>
          <p className="text-[11px] font-medium tracking-[0.2em] text-white/70">VIRTUAL TRY ON</p>
          <p className="logotype mt-1 text-2xl font-light">{productName}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close try on"
          className="flex h-12 w-12 items-center justify-center border border-white/25 bg-black/20 backdrop-blur-sm transition-colors duration-150 ease-out hover:border-white/60">
          <XIcon className="h-5 w-5" strokeWidth={1} />
        </button>
      </div>

      {message &&
        <p
          aria-live="polite"
          className={`absolute inset-x-0 px-10 text-center text-[13px] font-medium tracking-[0.16em] ${
            phase === 'live' ? 'bottom-32' : 'top-1/2 -translate-y-1/2'
          }`}>
          {message}
        </p>
      }

      {phase === 'live' &&
        <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-5" role="radiogroup" aria-label="Metal">
            {(Object.keys(METALS) as Metal[]).map((key) =>
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={metal === key}
                aria-label={METALS[key].label}
                onClick={() => setMetal(key)}
                className={`h-7 w-7 rounded-full border transition-transform duration-150 ease-out ${
                  metal === key ? 'scale-110 border-white' : 'border-white/30 hover:border-white/70'
                }`}
                style={{ backgroundColor: METALS[key].color, boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.35)' }} />
            )}
          </div>
          <p className="text-[11px] font-medium tracking-[0.2em] text-white/70">
            {METALS[metal].label.toUpperCase()} · PLACEHOLDER MODEL
          </p>
        </div>
      }
    </div>
  );
}
