'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function RingViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xffffff, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    mount.appendChild(renderer.domElement);

    // Fit to container
    const fit = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(mount);

    // Environment
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(4, 6, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 1.5);
    fill.position.set(-4, 2, 2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 2);
    rim.position.set(0, -4, -4);
    scene.add(rim);

    // Load GLB
    let model: THREE.Object3D | null = null;
    const loader = new GLTFLoader();
    loader.load('/dental_cast.glb', (gltf) => {
      model = gltf.scene;

      // Center and scale to fit view
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3 / maxDim;
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      model.rotation.z = Math.PI;
      model.rotation.y = Math.PI;
      model.rotation.x = -0.9;

      // Apply gold material
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#d4a843'),
            metalness: 1.0,
            roughness: 0.12,
            envMapIntensity: 2.0,
          });
        }
      });

      scene.add(model);
      setLoading(false);
    });

    // Drag to rotate
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      mount.setPointerCapture(e.pointerId);
      mount.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || !model) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      model.rotation.y += dx * 0.005;
      model.rotation.x += dy * 0.005;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onPointerUp = () => {
      dragging = false;
      mount.style.cursor = 'grab';
    };

    // Scroll to zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(2, Math.min(10, camera.position.z + e.deltaY * 0.01));
    };

    // Pinch to zoom
    let lastPinchDist = 0;
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastPinchDist > 0) {
        const delta = lastPinchDist - dist;
        camera.position.z = Math.max(2, Math.min(10, camera.position.z + delta * 0.02));
      }
      lastPinchDist = dist;
    };
    const onTouchEnd = () => { lastPinchDist = 0; };

    mount.style.cursor = 'grab';
    mount.addEventListener('pointerdown', onPointerDown);
    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerup', onPointerUp);
    mount.addEventListener('pointercancel', onPointerUp);
    mount.addEventListener('wheel', onWheel, { passive: false });
    mount.addEventListener('touchmove', onTouchMove, { passive: false });
    mount.addEventListener('touchend', onTouchEnd);

    // Animate
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!dragging && model) model.rotation.y += 0.0015;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      mount.removeEventListener('pointerdown', onPointerDown);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('pointercancel', onPointerUp);
      mount.removeEventListener('wheel', onWheel);
      mount.removeEventListener('touchmove', onTouchMove);
      mount.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      {loading &&
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: '#eceae8',
          gap: '16px',
        }}>
          <div style={{
            width: '32px', height: '32px',
            border: '2px solid #d4a843',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '12px', letterSpacing: '0.14em', color: '#6b6b6b' }}>LOADING</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      }
    </div>
  );;
}
