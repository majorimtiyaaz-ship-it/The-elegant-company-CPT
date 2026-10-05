import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/**
 * Procedural walnut dining table that flies from an exploded layout to fully
 * assembled. Everything is generated in code: no model file, no image
 * downloads, so the only cost is the three.js chunk (loaded on demand).
 */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => t * t * (3 - 2 * t);
const easeOutBack = (t: number) => {
  const c1 = 1.1;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

function makeWoodTexture(dark: string, light: string, seed: number, rotate: boolean) {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  g.fillStyle = dark;
  g.fillRect(0, 0, size, size);

  // Seeded pseudo-random so every part gets a slightly different grain
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  // Long streaks (rows) in light/dark tones
  for (let y = 0; y < size; y += 1) {
    const wave = Math.sin(y * 0.045 + rnd() * 0.6) * 0.5 + 0.5;
    const a = 0.05 + wave * 0.16 + rnd() * 0.07;
    g.fillStyle = rnd() > 0.5 ? `rgba(0,0,0,${a})` : hexToRgba(light, a * 0.8);
    g.fillRect(0, y, size, 1 + (rnd() > 0.85 ? 1 : 0));
  }
  // Fine pores
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

function hexToRgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function makeShadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(128, 128, 8, 128, 128, 128);
  grad.addColorStop(0, 'rgba(0,0,0,0.75)');
  grad.addColorStop(0.55, 'rgba(0,0,0,0.28)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface Part {
  mesh: THREE.Mesh;
  home: THREE.Vector3;
  offset: THREE.Vector3; // exploded displacement (added to home)
  spin: THREE.Euler; // exploded rotation (removed on assembly)
  start: number;
  end: number;
  overshoot?: boolean;
}

export interface TableScene {
  setProgress: (p: number) => void; // 0..1, already smoothed by the caller
  render: () => void;
  resize: (w: number, h: number) => void;
  dispose: () => void;
}

export interface TableRig {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  group: THREE.Group;
  setProgress: (p: number) => void;
  resize: (w: number, h: number) => void;
  dispose: () => void;
}

export function createTableRig(width: number, height: number): TableRig {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 50);

  // Lighting: warm key, gold rim, soft fill. No shadow maps (keeps it fast).
  scene.add(new THREE.HemisphereLight(0xfff0dc, 0x2a1d12, 0.8));
  const key = new THREE.DirectionalLight(0xffe2b8, 2.7);
  key.position.set(3.5, 3.2, 3.2);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc5a059, 1.1);
  rim.position.set(-2.5, 5, -3);
  scene.add(rim);

  // Materials
  const texTop = makeWoodTexture('#472b18', '#855a34', 7, false);
  const texCap = makeWoodTexture('#3b2515', '#6f4a2c', 31, true);
  const texLeg = makeWoodTexture('#52341f', '#9c6d42', 53, true);
  const texApr = makeWoodTexture('#563720', '#9a6b40', 91, false);

  const mat = (map: THREE.Texture) =>
    new THREE.MeshPhysicalMaterial({
      map,
      roughness: 0.62,
      metalness: 0,
      clearcoat: 0.1,
      clearcoatRoughness: 0.55,
    });
  const mTop = mat(texTop);
  const mCap = mat(texCap);
  const mLeg = mat(texLeg);
  const mApr = mat(texApr);

  const geoms: THREE.BufferGeometry[] = [];
  const g = <T extends THREE.BufferGeometry>(geo: T) => (geoms.push(geo), geo);

  const parts: Part[] = [];
  const group = new THREE.Group();
  scene.add(group);

  const add = (
    geo: THREE.BufferGeometry,
    material: THREE.Material,
    home: [number, number, number],
    offset: [number, number, number],
    spin: [number, number, number],
    start: number,
    end: number,
    overshoot = false
  ) => {
    const mesh = new THREE.Mesh(geo, material);
    group.add(mesh);
    parts.push({
      mesh,
      home: new THREE.Vector3(...home),
      offset: new THREE.Vector3(...offset),
      spin: new THREE.Euler(...spin),
      start,
      end,
      overshoot,
    });
  };

  // Narrow (phone) screens get less sideways spread so the table stays in frame
  let spreadX = 1;
  let spreadZ = 1;

  // Dimensions
  const LEG_X = 0.82;
  const LEG_Z = 0.34;
  const LEG_H = 0.7;
  const TOP_Y = 0.75;

  // Legs: square tapered (4-sided cylinder turned 45 degrees)
  const legGeo = g(new THREE.CylinderGeometry(0.06, 0.038, LEG_H, 4, 1));
  legGeo.rotateY(Math.PI / 4);
  const legs: Array<[number, number]> = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  legs.forEach(([sx, sz], i) => {
    add(
      legGeo,
      mLeg,
      [sx * LEG_X, LEG_H / 2, sz * LEG_Z],
      [sx * 0.55, 0.15, sz * 0.5],
      [0.35 * sz, 0, -0.3 * sx],
      0.02 + i * 0.02,
      0.4 + i * 0.02,
      true
    );
  });

  // Aprons
  const longLen = LEG_X * 2 - 0.07;
  const shortLen = LEG_Z * 2 - 0.07;
  const longApr = g(new RoundedBoxGeometry(longLen, 0.09, 0.028, 2, 0.006));
  const shortApr = g(new RoundedBoxGeometry(0.028, 0.09, shortLen, 2, 0.006));
  const aprY = LEG_H - 0.055;
  [-1, 1].forEach((sz, i) => {
    add(longApr, mApr, [0, aprY, sz * (LEG_Z - 0.005)], [0, 0.35, sz * 0.75], [sz * 0.25, 0, 0], 0.16 + i * 0.03, 0.52 + i * 0.03);
  });
  [-1, 1].forEach((sx, i) => {
    add(shortApr, mApr, [sx * (LEG_X - 0.005), aprY, 0], [sx * 0.85, 0.35, 0], [0, 0, -sx * 0.25], 0.2 + i * 0.03, 0.56 + i * 0.03);
  });

  // Tabletop (main boards) and two breadboard ends
  const topGeo = g(new RoundedBoxGeometry(1.8, 0.055, 0.95, 3, 0.012));
  add(topGeo, mTop, [0, TOP_Y - 0.0275, 0], [0, 1.05, 0], [0, 0.35, 0], 0.46, 0.8);
  const capGeo = g(new RoundedBoxGeometry(0.11, 0.055, 0.95, 3, 0.012));
  [-1, 1].forEach((sx, i) => {
    add(capGeo, mCap, [sx * 0.955, TOP_Y - 0.0275, 0], [sx * 0.9, 0.7, 0], [0, sx * 0.5, 0], 0.4 + i * 0.03, 0.74 + i * 0.03);
  });

  // Soft contact shadow on the floor
  const shadowTex = makeShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.4 });
  const shadow = new THREE.Mesh(g(new THREE.PlaneGeometry(1, 1)), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.002;
  scene.add(shadow);

  // Camera rig
  let aspect = width / height;
  const lookAt = new THREE.Vector3(0, 0.62, 0);

  const placeCamera = (p: number) => {
    const portrait = aspect < 0.85;
    const base = portrait ? Math.min(11.5, Math.max(7.2, 4.9 / aspect)) : Math.max(6, 9 / aspect);
    // Once assembled, ease in a little so the finished table feels present
    const dist = base * (1 - (portrait ? 0.12 : 0.17) * easeInOut(seg(p, 0.6, 0.92)));
    // Orbit: starts right-front, ends slightly left-front; settles in the last 20%
    const a0 = portrait ? 1.05 : 0.75;
    const a1 = portrait ? 0.8 : -0.5;
    const a = a0 + (a1 - a0) * easeInOut(clamp01(p / 0.95));
    const h = 1.9 - easeInOut(clamp01(p / 0.85)) * 0.95;
    camera.position.set(Math.sin(a) * dist, h + (portrait ? 0.3 : 0), Math.cos(a) * dist);
    // Aim high while exploded, lower when assembled so the table sits above the text
    lookAt.y = 0.95 - easeInOut(clamp01(p / 0.8)) * (portrait ? 0.95 : 0.65);
    camera.lookAt(lookAt);
  };

  const setProgress = (p: number) => {
    parts.forEach((part) => {
      const t0 = seg(p, part.start, part.end);
      const t = part.overshoot ? easeOutBack(t0) : easeInOut(t0);
      const k = 1 - t; // 1 = exploded, 0 = assembled
      part.mesh.position.set(
        part.home.x + part.offset.x * k * spreadX,
        part.home.y + part.offset.y * k,
        part.home.z + part.offset.z * k * spreadZ
      );
      part.mesh.rotation.set(part.spin.x * k, part.spin.y * k, part.spin.z * k);
    });
    // Whole table turns a touch once assembled
    group.rotation.y = easeInOut(seg(p, 0.8, 1)) * 0.22;
    shadow.scale.setScalar(2.6 + (1 - easeInOut(seg(p, 0.1, 0.8))) * 0.4);
    shadowMat.opacity = 0.28 + easeInOut(seg(p, 0.2, 0.85)) * 0.32;
    placeCamera(p);
  };

  const resize = (w: number, h: number) => {
    aspect = w / h;
    const portrait = aspect < 0.85;
    spreadX = portrait ? 0.4 : 1;
    spreadZ = portrait ? 0.7 : 1;
    camera.aspect = aspect;
    camera.fov = portrait ? 36 : 32;
    camera.updateProjectionMatrix();
  };

  resize(width, height);
  setProgress(0);

  return {
    scene,
    camera,
    group,
    setProgress,
    resize,
    dispose: () => {
      geoms.forEach((x) => x.dispose());
      [mTop, mCap, mLeg, mApr, shadowMat].forEach((m) => m.dispose());
      [texTop, texCap, texLeg, texApr, shadowTex].forEach((t) => t.dispose());
    },
  };
}

export function buildTableScene(canvas: HTMLCanvasElement, width: number, height: number): TableScene {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const rig = createTableRig(width, height);

  return {
    setProgress: rig.setProgress,
    render: () => renderer.render(rig.scene, rig.camera),
    resize: (w, h) => {
      renderer.setSize(w, h, false);
      rig.resize(w, h);
    },
    dispose: () => {
      rig.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
