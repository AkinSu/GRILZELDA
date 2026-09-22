import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { FaceLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { createGrill, type Metal } from './grillModel';

// Pinned to the installed @mediapipe/tasks-vision version. The WASM bundle is
// ~34MB so it is loaded from the CDN rather than committed to /public.
const WASM_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

// MediaPipe's face geometry solves head pose against this virtual camera, so
// rendering with the same one puts canonical-space objects back on the face.
const MP_CAMERA = { fov: 63, near: 1, far: 10000 };

// Inner lip contour, in drawing order. This polygon is the mouth opening and
// is what occludes the grill behind the lips.
const INNER_LIP_RING = [
  78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95,
];
// Skull-fixed points around the base of the nose, with their canonical-space
// positions. The head-pose fit is global, so it can be a few pixels off at the
// mouth; re-registering against these pins the grill to the nearest rigid
// anatomy instead.
const NOSE_BASE = [
  { index: 2, canonical: new THREE.Vector3(0, -2.089024, 6.058267) },
  { index: 98, canonical: new THREE.Vector3(-1.405627, -1.714196, 5.241087) },
  { index: 327, canonical: new THREE.Vector3(1.405627, -1.714196, 5.241087) },
];
const LIP_TOP = 13;
const LIP_BOTTOM = 14;
const MOUTH_LEFT = 78;
const MOUTH_RIGHT = 308;

export type TryOnStatus = 'loading' | 'searching' | 'closed-mouth' | 'tracking';

export interface TryOnEngineOptions {
  source: HTMLVideoElement | HTMLImageElement;
  canvas: HTMLCanvasElement;
  metal: Metal;
  onStatus: (status: TryOnStatus) => void;
}

// MediaPipe's WASM runtime prints its startup log ("INFO: Created TensorFlow
// Lite XNNPACK delegate for CPU.") to stderr, which lands on console.error and
// trips the Next.js dev error overlay. Drop those lines while an engine is alive.
let mutedEngines = 0;
let originalConsoleError: typeof console.error | null = null;
function muteMediapipeInfoLogs() {
  if (mutedEngines++ === 0) {
    const original = console.error;
    originalConsoleError = original;
    console.error = (...args: unknown[]) => {
      if (typeof args[0] === 'string' && args[0].startsWith('INFO:')) return;
      original(...args);
    };
  }
  return () => {
    if (--mutedEngines === 0 && originalConsoleError) {
      console.error = originalConsoleError;
      originalConsoleError = null;
    }
  };
}

const smoothstep = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export async function createTryOnEngine({ source, canvas, metal, onStatus }: TryOnEngineOptions) {
  const width = 'videoWidth' in source ? source.videoWidth : source.naturalWidth;
  const height = 'videoHeight' in source ? source.videoHeight : source.naturalHeight;

  const unmuteLogs = muteMediapipeInfoLogs();
  let landmarker: FaceLandmarker;
  try {
    const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
    const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
    landmarker = await FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFacialTransformationMatrixes: true,
    });
  } catch (err) {
    unmuteLogs();
    throw err;
  }

  // The grill renders offscreen, then gets composited through the lip mask
  // onto the visible 2D canvas.
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(2, 6, 8);
  scene.add(key);

  const camera = new THREE.PerspectiveCamera(MP_CAMERA.fov, width / height, MP_CAMERA.near, MP_CAMERA.far);

  const grill = await createGrill(metal);
  grill.group.matrixAutoUpdate = false;
  grill.group.visible = false;
  scene.add(grill.group);

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const canBlur = typeof ctx.filter === 'string';

  // Tiny canvas for sampling scene brightness around the mouth.
  const probe = document.createElement('canvas');
  probe.width = probe.height = 8;
  const probeCtx = probe.getContext('2d', { willReadFrequently: true })!;

  // Smoothed state
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const scale = new THREE.Vector3(1, 1, 1);
  const rawPos = new THREE.Vector3();
  const rawQuat = new THREE.Quaternion();
  const rawMatrix = new THREE.Matrix4();
  const ring = INNER_LIP_RING.map(() => ({ x: 0, y: 0 }));
  const correction = new THREE.Vector3();
  const placed = new THREE.Vector3();
  const projected = new THREE.Vector3();
  const focal = 1 / Math.tan(THREE.MathUtils.degToRad(MP_CAMERA.fov / 2));
  const aspect = width / height;
  let hasPose = false;
  let exposure = 1;
  let frame = 0;
  let status: TryOnStatus | null = null;
  let running = true;
  let handle = 0;

  const setStatus = (next: TryOnStatus) => {
    if (next !== status) {
      status = next;
      onStatus(next);
    }
  };

  const updatePose = (data: number[]) => {
    rawMatrix.fromArray(data);
    rawMatrix.decompose(rawPos, rawQuat, scale);
    if (!hasPose) {
      pos.copy(rawPos);
      quat.copy(rawQuat);
      return;
    }
    // Smooth harder when the head is still (kills jitter), follow faster when it moves (kills lag).
    const moved = pos.distanceTo(rawPos) + quat.angleTo(rawQuat) * 10;
    const alpha = Math.min(1, 0.25 + moved * 0.6);
    pos.lerp(rawPos, alpha);
    quat.slerp(rawQuat, alpha);
  };

  // Camera-space x/y nudge that lines the projected nose base up with where
  // the landmarks actually are.
  const updateCorrection = (landmarks: NormalizedLandmark[]) => {
    let dx = 0;
    let dy = 0;
    let depth = 0;
    for (const { index, canonical } of NOSE_BASE) {
      projected.copy(canonical).applyMatrix4(rawMatrix);
      const d = -projected.z;
      dx += landmarks[index].x - ((projected.x / d) * (focal / aspect) * 0.5 + 0.5);
      dy += landmarks[index].y - (0.5 - (projected.y / d) * focal * 0.5);
      depth += d;
    }
    const n = NOSE_BASE.length;
    const targetX = ((dx / n) * 2 * aspect * (depth / n)) / focal;
    const targetY = ((-dy / n) * 2 * (depth / n)) / focal;
    const alpha = hasPose ? 0.3 : 1;
    correction.x += (targetX - correction.x) * alpha;
    correction.y += (targetY - correction.y) * alpha;
  };

  const updateRing = (landmarks: NormalizedLandmark[]) => {
    const alpha = hasPose ? 0.65 : 1;
    INNER_LIP_RING.forEach((index, i) => {
      const target = landmarks[index];
      ring[i].x += (target.x * width - ring[i].x) * alpha;
      ring[i].y += (target.y * height - ring[i].y) * alpha;
    });
  };

  const sampleExposure = (cx: number, cy: number, size: number) => {
    try {
      probeCtx.drawImage(source, cx - size, cy - size, size * 2, size * 2, 0, 0, 8, 8);
      const { data } = probeCtx.getImageData(0, 0, 8, 8);
      let luma = 0;
      for (let i = 0; i < data.length; i += 4) {
        luma += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      }
      const target = 0.4 + luma / (data.length / 4) / 255;
      exposure += (target - exposure) * 0.3;
    } catch {
      // Cross-origin source — keep the default exposure.
    }
  };

  const tracePath = () => {
    ctx.beginPath();
    ring.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.closePath();
  };

  const drawFrame = () => {
    const result = landmarker.detectForVideo(source, performance.now());
    const landmarks = result.faceLandmarks[0];
    const matrix = result.facialTransformationMatrixes[0];

    ctx.clearRect(0, 0, width, height);
    if (!landmarks || !matrix) {
      hasPose = false;
      setStatus('searching');
      return;
    }

    updatePose(matrix.data);
    updateCorrection(landmarks);
    updateRing(landmarks);
    hasPose = true;

    const px = (i: number) => ({ x: landmarks[i].x * width, y: landmarks[i].y * height });
    const top = px(LIP_TOP);
    const bottom = px(LIP_BOTTOM);
    const left = px(MOUTH_LEFT);
    const right = px(MOUTH_RIGHT);
    const mouthWidth = Math.hypot(right.x - left.x, right.y - left.y);
    const opening = Math.hypot(bottom.x - top.x, bottom.y - top.y);
    const visibility = smoothstep(0.04, 0.12, opening / mouthWidth);

    setStatus(visibility > 0.05 ? 'tracking' : 'closed-mouth');
    if (visibility <= 0) return;

    if (frame++ % 12 === 0) {
      sampleExposure((left.x + right.x) / 2, (top.y + bottom.y) / 2, mouthWidth);
    }
    renderer.toneMappingExposure = exposure;

    grill.group.matrix.compose(placed.copy(pos).add(correction), quat, scale);
    grill.group.visible = true;
    renderer.render(scene, camera);

    // 1. Feathered mouth-opening mask
    const feather = Math.max(1, mouthWidth * 0.015);
    ctx.save();
    ctx.globalAlpha = visibility;
    if (canBlur) {
      ctx.filter = `blur(${feather}px)`;
      tracePath();
      ctx.fill();
    } else {
      // Safari: no ctx.filter, so use an offset shadow as the blurred fill.
      ctx.shadowColor = '#000';
      ctx.shadowBlur = feather * 2;
      ctx.shadowOffsetX = width * 2;
      ctx.translate(-width * 2, 0);
      tracePath();
      ctx.fill();
    }
    ctx.restore();

    // 2. Keep only the part of the grill inside the mask
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(renderer.domElement, 0, 0, width, height);

    // 3. Shadow cast by the upper lip onto the teeth
    ctx.globalCompositeOperation = 'source-atop';
    const lipY = Math.min(...ring.map((p) => p.y));
    const shade = ctx.createLinearGradient(0, lipY, 0, lipY + Math.max(opening * 0.45, mouthWidth * 0.06));
    shade.addColorStop(0, 'rgba(0,0,0,0.5)');
    shade.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#000';
    ctx.globalCompositeOperation = 'source-over';
  };

  const useVideoFrames = 'requestVideoFrameCallback' in source;
  const schedule = () => {
    handle = useVideoFrames
      ? (source as HTMLVideoElement).requestVideoFrameCallback(loop)
      : requestAnimationFrame(loop);
  };
  const loop = () => {
    if (!running) return;
    drawFrame();
    schedule();
  };
  setStatus('searching');
  schedule();

  return {
    setMetal: grill.setMetal,
    dispose() {
      running = false;
      if (useVideoFrames) (source as HTMLVideoElement).cancelVideoFrameCallback(handle);
      else cancelAnimationFrame(handle);
      landmarker.close();
      grill.dispose();
      scene.environment?.dispose();
      renderer.dispose();
      unmuteLogs();
    },
  };
}

export type TryOnEngine = Awaited<ReturnType<typeof createTryOnEngine>>;
