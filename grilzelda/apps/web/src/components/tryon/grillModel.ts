import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Grill geometry for the try-on. Units are centimetres in MediaPipe's canonical
 * face space (x right, y up, z toward the camera), so the face transform matrix
 * can be applied directly.
 *
 * The scanned model is the front eight upper crowns cut from /dental_cast.glb
 * (CC-BY-4.0, Nancy/Lanzi Luo — credit is embedded in the GLB and must stay
 * visible somewhere on the site). Its origin is the middle of the incisal edge
 * with the front surface at z = 0, teeth pointing down. A real product GLB
 * authored to the same convention can replace it by changing SCANNED_GRILL_URL.
 */
const SCANNED_GRILL_URL = '/tryon/grill-upper.glb';

export type Metal = 'yellow' | 'white' | 'rose';

export const METALS: Record<Metal, { label: string; color: string }> = {
  yellow: { label: 'Yellow Gold', color: '#d9a93e' },
  white: { label: 'White Gold', color: '#e3e3e6' },
  rose: { label: 'Rose Gold', color: '#d89a82' },
};

// Where the upper incisors sit in the canonical face. Canonical inner upper lip
// (landmark 13) is at y -3.99, z 5.22 and the nose base (landmark 2) at y -2.09;
// the incisal edge sits ~2.4cm below the nose base, just behind the lips.
export const TEETH_ANCHOR = {
  incisalEdgeY: -4.55,
  frontZ: 4.72,
};

// Arch is a parabola z = -ARCH_CURVE * x^2, opening toward the back of the head.
const ARCH_CURVE = 0.3;
const TOOTH_GAP = 0.035;

// Centre-out, one side: central incisor, lateral incisor, canine, first premolar.
const TEETH = [
  { width: 0.88, height: 1.12 },
  { width: 0.68, height: 0.98 },
  { width: 0.78, height: 1.08 },
  { width: 0.72, height: 0.9 },
];

function archPointAtLength(target: number) {
  // Walk the parabola until the arc length reaches `target`.
  const step = 0.005;
  let x = 0;
  let travelled = 0;
  while (travelled < target) {
    const slope = -2 * ARCH_CURVE * x;
    travelled += step * Math.sqrt(1 + slope * slope);
    x += step;
  }
  return { x, z: -ARCH_CURVE * x * x, slope: -2 * ARCH_CURVE * x };
}

const CAP_THICKNESS = 0.16;
const CAP_BULGE = 0.09;

// A pillow-shaped cap: a subdivided box squeezed into a rounded, slightly
// tapered crown with a convex front, so reflections roll across it instead of
// the whole face flashing at once. Origin is the middle of the incisal edge,
// front surface at z = 0.
function capGeometry(width: number, height: number) {
  const box = new THREE.BoxGeometry(2, 2, 2, 14, 14, 1);
  box.deleteAttribute('normal');
  box.deleteAttribute('uv');
  const geometry = mergeVertices(box);
  const position = geometry.getAttribute('position');

  for (let i = 0; i < position.count; i++) {
    const u = position.getX(i);
    const v = position.getY(i);
    const front = position.getZ(i) > 0;

    // Square -> squircle for rounded corners; narrower toward the gum line.
    const taper = 1 - 0.16 * Math.max(0, v) ** 2;
    const x = u * Math.sqrt(1 - 0.22 * v * v) * taper * (width / 2);
    const y = v * Math.sqrt(1 - 0.22 * u * u) * (height / 2);

    // Thickness falls to zero at the rim; the front face bows outward.
    const rim = ((1 - u ** 6) * (1 - v ** 6)) ** 0.4;
    const z = front
      ? (CAP_THICKNESS / 2) * rim + CAP_BULGE * (1 - u * u) * (1 - 0.5 * v * v) * rim
      : -(CAP_THICKNESS / 2) * rim;

    position.setXYZ(i, x, y + height / 2, z - CAP_THICKNESS / 2 - CAP_BULGE);
  }

  geometry.computeVertexNormals();
  return geometry;
}

function metalMaterial(metal: Metal) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(METALS[metal].color),
    metalness: 1,
    // Rough enough to blur the studio environment into a sheen — a mirror finish
    // turns every bump of a scanned surface into a hard white blotch.
    roughness: 0.36,
    envMapIntensity: 1.15,
  });
}

function wrapGrill(group: THREE.Group, material: THREE.MeshStandardMaterial) {
  const setMetal = (next: Metal) => material.color.set(METALS[next].color);
  const dispose = () => {
    material.dispose();
    const seen = new Set<THREE.BufferGeometry>();
    group.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && !seen.has(mesh.geometry)) {
        seen.add(mesh.geometry);
        mesh.geometry.dispose();
      }
    });
  };
  return { group, material, setMetal, dispose };
}

/** Scanned crowns, falling back to the procedural caps if the GLB can't load. */
export async function createGrill(metal: Metal) {
  try {
    const gltf = await new GLTFLoader().loadAsync(SCANNED_GRILL_URL);
    const material = metalMaterial(metal);
    const group = new THREE.Group();
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) (child as THREE.Mesh).material = material;
    });
    gltf.scene.position.set(0, TEETH_ANCHOR.incisalEdgeY, TEETH_ANCHOR.frontZ);
    group.add(gltf.scene);
    return wrapGrill(group, material);
  } catch (err) {
    console.warn('Try-on: scanned grill failed to load, using procedural caps', err);
    return createPlaceholderGrill(metal);
  }
}

/** Procedural fallback — an 8-tooth upper cap set laid out along a dental arch. */
export function createPlaceholderGrill(metal: Metal) {
  const group = new THREE.Group();
  const material = metalMaterial(metal);

  let offset = 0;
  for (const tooth of TEETH) {
    const centre = offset + tooth.width / 2;
    offset += tooth.width;

    const geometry = capGeometry(tooth.width - TOOTH_GAP, tooth.height);

    const { x, z, slope } = archPointAtLength(centre);
    for (const side of [-1, 1]) {
      const cap = new THREE.Mesh(geometry, material);
      cap.position.set(side * x, TEETH_ANCHOR.incisalEdgeY, TEETH_ANCHOR.frontZ + z);
      // Face each cap along the arch's outward normal.
      cap.rotation.y = Math.atan2(-slope * side, 1);
      group.add(cap);
    }
  }

  return wrapGrill(group, material);
}
