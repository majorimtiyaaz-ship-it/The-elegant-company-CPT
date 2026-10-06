import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/**
 * Parametric furniture preview. Builds a dining table, coffee table or bench from
 * simple solids, in a chosen wood, at any size within sensible limits. Everything is
 * generated in code (no model files), so the only cost is the three.js chunk.
 * Units are metres.
 */

import type { PieceType, WoodKey } from './config';
export type { PieceType, WoodKey } from './config';

export interface PieceParams {
  type: PieceType;
  wood: WoodKey;
  length: number; // m
  width: number; // m
  height: number; // m
}

interface WoodDef {
  dark: string;
  light: string;
  tint: number; // colour multiplier applied over the texture
  rough: number;
  coat: number;
  coatRough: number;
  solid?: number; // plain colour instead of a grain texture
}

export const WOODS: Record<WoodKey, WoodDef> = {
  walnut: { dark: '#472b18', light: '#855a34', tint: 0xffffff, rough: 0.62, coat: 0.1, coatRough: 0.55 },
  oak: { dark: '#a97c4a', light: '#d9b787', tint: 0xf2ece4, rough: 0.6, coat: 0.08, coatRough: 0.6 },
  ebonised: { dark: '#171412', light: '#3b342d', tint: 0xffffff, rough: 0.5, coat: 0.15, coatRough: 0.5 },
  piano: { dark: '#000000', light: '#000000', tint: 0xffffff, rough: 0.16, coat: 1, coatRough: 0.06, solid: 0x0a0a0c },
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function hexToRgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function makeWoodTexture(dark: string, light: string, seed: number, rotate: boolean) {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  g.fillStyle = dark;
  g.fillRect(0, 0, size, size);
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let y = 0; y < size; y += 1) {
    const wave = Math.sin(y * 0.045 + rnd() * 0.6) * 0.5 + 0.5;
    const a = 0.05 + wave * 0.16 + rnd() * 0.07;
    g.fillStyle = rnd() > 0.5 ? `rgba(0,0,0,${a})` : hexToRgba(light, a * 0.8);
    g.fillRect(0, y, size, 1 + (rnd() > 0.85 ? 1 : 0));
  }
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(0,0,0,${0.05 + rnd() * 0.1})`;
    g.fillRect(rnd() * size, rnd() * size, 8 + rnd() * 40, 1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  if (rotate) {
    tex.center.set(0.5, 0.5);
    tex.rotation = Math.PI / 2;
  }
  return tex;
}

function makeShadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(128, 128, 8, 128, 128, 128);
  grad.addColorStop(0, 'rgba(0,0,0,0.8)');
  grad.addColorStop(0.55, 'rgba(0,0,0,0.3)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface WoodMats {
  top: THREE.MeshPhysicalMaterial;
  cap: THREE.MeshPhysicalMaterial;
  leg: THREE.MeshPhysicalMaterial;
  rail: THREE.MeshPhysicalMaterial;
  textures: THREE.Texture[];
}

function makeMats(key: WoodKey): WoodMats {
  const w = WOODS[key];
  const textures: THREE.Texture[] = [];
  const mk = (seed: number, rotate: boolean, shade = 1) => {
    const m = new THREE.MeshPhysicalMaterial({
      roughness: w.rough,
      metalness: 0,
      clearcoat: w.coat,
      clearcoatRoughness: w.coatRough,
    });
    if (w.solid !== undefined) {
      m.color.setHex(w.solid);
    } else {
      const t = makeWoodTexture(w.dark, w.light, seed, rotate);
      textures.push(t);
      m.map = t;
      m.color.setHex(w.tint).multiplyScalar(shade);
    }
    return m;
  };
  return { top: mk(7, false), cap: mk(31, true, 0.86), leg: mk(53, true, 0.95), rail: mk(91, false, 0.95), textures };
}

export interface PieceRig {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update: (p: PieceParams, snap?: boolean) => void;
  frame: (dtMs: number) => boolean; // returns true if anything changed (needs a render)
  resize: (w: number, h: number) => void;
  rotateBy: (dx: number) => void;
  setDragging: (d: boolean) => void;
  setAutoRotate: (on: boolean) => void;
  dispose: () => void;
}

export function createPieceRig(width: number, height: number): PieceRig {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, width / height, 0.05, 40);

  scene.add(new THREE.HemisphereLight(0xfff0dc, 0x2a1d12, 0.9));
  const key = new THREE.DirectionalLight(0xffe2b8, 2.6);
  key.position.set(3.5, 3.2, 3.2);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc5a059, 1.1);
  rim.position.set(-2.5, 5, -3);
  scene.add(rim);

  const stage = new THREE.Group(); // rotates
  scene.add(stage);

  const shadowTex = makeShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.55 });
  const shadowGeo = new THREE.PlaneGeometry(1, 1);
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.002;
  scene.add(shadow);

  const matCache = new Map<WoodKey, WoodMats>();
  const getMats = (k: WoodKey) => {
    let m = matCache.get(k);
    if (!m) {
      m = makeMats(k);
      matCache.set(k, m);
    }
    return m;
  };

  let pieceGroup: THREE.Group | null = null;
  let pieceGeoms: THREE.BufferGeometry[] = [];
  let lastType: PieceType | null = null;

  const disposePiece = () => {
    if (pieceGroup) stage.remove(pieceGroup);
    pieceGeoms.forEach((g) => g.dispose());
    pieceGeoms = [];
    pieceGroup = null;
  };

  const build = (p: PieceParams) => {
    disposePiece();
    const mats = getMats(p.wood);
    const group = new THREE.Group();
    const geoms: THREE.BufferGeometry[] = [];
    const put = (geo: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number) => {
      geoms.push(geo);
      const mesh = new THREE.Mesh(geo, m);
      mesh.position.set(x, y, z);
      group.add(mesh);
    };

    const L = p.length;
    const W = p.width;
    const H = p.height;
    const spec = {
      dining: { topT: 0.055, inset: 0.075, rt: 0.06, rb: 0.038, apronH: 0.09, caps: true },
      coffee: { topT: 0.05, inset: 0.07, rt: 0.055, rb: 0.04, apronH: 0.07, caps: false },
      bench: { topT: 0.045, inset: 0.06, rt: 0.05, rb: 0.035, apronH: 0.07, caps: true },
    }[p.type];

    const legH = H - spec.topT;
    const legX = L / 2 - spec.inset;
    const legZ = W / 2 - spec.inset;

    // Top (with breadboard ends on dining tables and benches)
    const capW = 0.1;
    if (spec.caps) {
      put(new RoundedBoxGeometry(L - capW * 2, spec.topT, W, 3, 0.012), mats.top, 0, H - spec.topT / 2, 0);
      const capGeo = new RoundedBoxGeometry(capW + 0.01, spec.topT, W, 3, 0.012);
      put(capGeo, mats.cap, -(L / 2 - capW / 2), H - spec.topT / 2, 0);
      put(capGeo.clone(), mats.cap, L / 2 - capW / 2, H - spec.topT / 2, 0);
    } else {
      put(new RoundedBoxGeometry(L, spec.topT, W, 3, 0.014), mats.top, 0, H - spec.topT / 2, 0);
    }

    // Tapered square legs
    const legGeo = new THREE.CylinderGeometry(spec.rt, spec.rb, legH, 4, 1);
    legGeo.rotateY(Math.PI / 4);
    geoms.push(legGeo);
    ([[-1, -1], [1, -1], [1, 1], [-1, 1]] as const).forEach(([sx, sz]) => {
      const mesh = new THREE.Mesh(legGeo, mats.leg);
      mesh.position.set(sx * legX, legH / 2, sz * legZ);
      group.add(mesh);
    });

    // Aprons
    const aprY = legH - spec.apronH / 2 - 0.004;
    const longLen = legX * 2 - 0.07;
    const shortLen = Math.max(0.08, legZ * 2 - 0.07);
    const longGeo = new RoundedBoxGeometry(longLen, spec.apronH, 0.028, 2, 0.006);
    put(longGeo, mats.rail, 0, aprY, legZ - 0.005);
    put(longGeo.clone(), mats.rail, 0, aprY, -(legZ - 0.005));
    const shortGeo = new RoundedBoxGeometry(0.028, spec.apronH, shortLen, 2, 0.006);
    put(shortGeo, mats.rail, legX - 0.005, aprY, 0);
    put(shortGeo.clone(), mats.rail, -(legX - 0.005), aprY, 0);

    // Coffee table gets a low shelf
    if (p.type === 'coffee') {
      put(new RoundedBoxGeometry(legX * 2 - 0.05, 0.022, legZ * 2 - 0.05, 2, 0.006), mats.rail, 0, 0.11, 0);
    }

    // Dining tables over 2.4 m get a centre support so they read as properly built
    if (p.type === 'dining' && L > 2.4) {
      put(new RoundedBoxGeometry(0.028, spec.apronH, shortLen, 2, 0.006), mats.rail, 0, aprY, 0);
    }

    pieceGeoms = geoms;
    pieceGroup = group;
    stage.add(group);
    shadow.scale.set(L * 1.45, W * 2.6 + 0.2, 1);
  };

  // Camera state (damped)
  let vfov = (camera.fov * Math.PI) / 180;
  let aspect = width / height;
  let tgtDist = 4;
  let tgtY = 0.35;
  let curDist = 4;
  let curY = 0.35;
  let rotVel = 0;
  let dragging = false;
  let autoRotate = true;
  let pop = 1; // 0..1 entrance animation after a piece-type change
  let dirty = true;

  const fit = (p: PieceParams, snap: boolean) => {
    const r = 0.5 * Math.sqrt(p.length * p.length + p.width * p.width + p.height * p.height);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
    tgtDist = (r / Math.sin(Math.min(vfov, hfov) / 2)) * 1.06;
    tgtY = p.height * 0.42;
    if (snap) {
      curDist = tgtDist;
      curY = tgtY;
    }
  };

  const placeCamera = () => {
    const el = (20 * Math.PI) / 180;
    camera.position.set(0, curY + Math.sin(el) * curDist, Math.cos(el) * curDist);
    camera.lookAt(0, curY, 0);
  };

  const update = (p: PieceParams, snap = false) => {
    const typeChanged = lastType !== null && lastType !== p.type;
    build(p);
    fit(p, snap || lastType === null);
    if (typeChanged || lastType === null) {
      stage.rotation.y = -0.55;
      pop = 0;
    }
    lastType = p.type;
    dirty = true;
  };

  const frame = (dtMs: number) => {
    let changed = dirty;
    const dt = Math.min(64, dtMs);
    if (!dragging) {
      if (Math.abs(rotVel) > 0.00002) {
        stage.rotation.y += rotVel * dt;
        rotVel *= Math.pow(0.92, dt / 16);
        changed = true;
      } else if (autoRotate) {
        stage.rotation.y += 0.00038 * dt;
        changed = true;
      }
    }
    const k = 1 - Math.pow(0.001, dt / 1000); // critically-damped feel
    if (Math.abs(tgtDist - curDist) > 0.0005 || Math.abs(tgtY - curY) > 0.0005) {
      curDist += (tgtDist - curDist) * k;
      curY += (tgtY - curY) * k;
      changed = true;
    }
    if (pop < 1) {
      pop = clamp01(pop + dt / 650);
      const s = 0.9 + 0.1 * easeOut(pop);
      if (pieceGroup) pieceGroup.scale.setScalar(s);
      changed = true;
    }
    if (changed) placeCamera();
    dirty = false;
    return changed;
  };

  const resize = (w: number, h: number) => {
    aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    dirty = true;
  };

  return {
    scene,
    camera,
    update: (p, snap) => {
      update(p, snap);
      placeCamera();
    },
    frame,
    resize,
    rotateBy: (dx) => {
      stage.rotation.y += dx;
      rotVel = dx / 16; // flick momentum
      dirty = true;
    },
    setDragging: (d) => {
      dragging = d;
      if (d) rotVel = 0;
    },
    setAutoRotate: (on) => {
      autoRotate = on;
    },
    dispose: () => {
      disposePiece();
      matCache.forEach((m) => {
        [m.top, m.cap, m.leg, m.rail].forEach((x) => x.dispose());
        m.textures.forEach((t) => t.dispose());
      });
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
    },
  };
}

export interface PieceScene {
  update: (p: PieceParams) => void;
  frame: (dtMs: number) => void;
  resize: (w: number, h: number) => void;
  rotateBy: (dx: number) => void;
  setDragging: (d: boolean) => void;
  setAutoRotate: (on: boolean) => void;
  dispose: () => void;
}

export function buildPieceScene(canvas: HTMLCanvasElement, width: number, height: number): PieceScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const rig = createPieceRig(width, height);
  return {
    update: (p) => {
      rig.update(p);
      renderer.render(rig.scene, rig.camera);
    },
    frame: (dt) => {
      if (rig.frame(dt)) renderer.render(rig.scene, rig.camera);
    },
    resize: (w, h) => {
      renderer.setSize(w, h, false);
      rig.resize(w, h);
      renderer.render(rig.scene, rig.camera);
    },
    rotateBy: rig.rotateBy,
    setDragging: rig.setDragging,
    setAutoRotate: rig.setAutoRotate,
    dispose: () => {
      rig.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
