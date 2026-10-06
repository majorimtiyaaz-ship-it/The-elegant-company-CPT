import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { WhatsAppIcon } from './WhatsAppIcon';
import { whatsappUrl, track } from './BookCTA';
import { LIMITS, PIECES, WOOD_OPTIONS, type PieceType, type WoodKey } from './design/config';
import type { PieceScene } from './design/buildPieceScene';

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

type Dims = { length: number; width: number; height: number };

const defaultsFor = (t: PieceType): Dims => ({
  length: LIMITS[t].length[2],
  width: LIMITS[t].width[2],
  height: LIMITS[t].height[2],
});

const chip = (active: boolean) =>
  `min-h-[44px] rounded-sm border px-4 text-[13px] font-medium tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] ${
    active
      ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
      : 'border-stone-300 bg-white text-stone-700 hover:border-[#c5a059]'
  }`;

export const DesignYourPiece: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<PieceScene | null>(null);

  const [type, setType] = useState<PieceType>('dining');
  const [wood, setWood] = useState<WoodKey>('walnut');
  const [dims, setDims] = useState<Dims>(defaultsFor('dining'));
  const [gl, setGl] = useState<'pending' | 'yes' | 'no'>('pending');
  const [ready, setReady] = useState(false);

  // Latest design, readable inside long-lived callbacks
  const designRef = useRef({ type, wood, dims });
  designRef.current = { type, wood, dims };

  useEffect(() => {
    setGl(webglAvailable() ? 'yes' : 'no');
  }, []);

  // Load three.js and build the scene shortly before the section scrolls into view
  useEffect(() => {
    if (gl !== 'yes') return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!section || !stage || !canvas) return;

    let disposed = false;
    let inView = false;
    let loading = false;
    let last = performance.now();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const push = () => {
      const d = designRef.current;
      sceneRef.current?.update({
        type: d.type,
        wood: d.wood,
        length: d.dims.length / 100,
        width: d.dims.width / 100,
        height: d.dims.height / 100,
      });
    };

    const load = async () => {
      if (loading || sceneRef.current || disposed) return;
      loading = true;
      const { buildPieceScene } = await import('./design/buildPieceScene');
      if (disposed) return;
      const r = stage.getBoundingClientRect();
      sceneRef.current = buildPieceScene(canvas, Math.max(1, r.width), Math.max(1, r.height));
      sceneRef.current.setAutoRotate(!reduced);
      push();
      setReady(true);
    };

    const tick = () => {
      const now = performance.now();
      const dt = now - last;
      last = now;
      if (inView) sceneRef.current?.frame(dt);
    };

    const loadObserver = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) load();
      },
      { rootMargin: '200% 0px 200% 0px' }
    );
    loadObserver.observe(section);

    const viewObserver = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      last = performance.now();
    });
    viewObserver.observe(section);

    const ro = new ResizeObserver(() => {
      const r = stage.getBoundingClientRect();
      sceneRef.current?.resize(Math.max(1, r.width), Math.max(1, r.height));
    });
    ro.observe(stage);

    // Drag to rotate (vertical page scroll still works on touch screens)
    let dragging = false;
    let lastX = 0;
    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
      sceneRef.current?.setDragging(true);
      sceneRef.current?.setAutoRotate(false);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      sceneRef.current?.rotateBy(dx * 0.008);
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
      sceneRef.current?.setDragging(false);
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);

    gsap.ticker.add(tick);

    return () => {
      disposed = true;
      gsap.ticker.remove(tick);
      loadObserver.disconnect();
      viewObserver.disconnect();
      ro.disconnect();
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [gl]);

  // Send every change to the 3D scene
  useEffect(() => {
    sceneRef.current?.update({
      type,
      wood,
      length: dims.length / 100,
      width: dims.width / 100,
      height: dims.height / 100,
    });
  }, [type, wood, dims, ready]);

  const pickType = (t: PieceType) => {
    setType(t);
    setDims(defaultsFor(t));
  };

  const pieceNoun = PIECES.find((p) => p.key === type)!.noun;
  const woodLabel = WOOD_OPTIONS.find((w) => w.key === wood)!.label;
  const summary = `${dims.length} × ${dims.width} × ${dims.height} cm ${woodLabel} ${pieceNoun}`;

  const href = useMemo(
    () =>
      whatsappUrl(
        `Hi, I'd like a quote for a custom ${pieceNoun}: ${dims.length} cm long, ${dims.width} cm wide, ${dims.height} cm high, in ${woodLabel}. (Designed on your website)`
      ),
    [pieceNoun, dims, woodLabel]
  );

  const sliders: Array<{ key: keyof Dims; label: string }> = [
    { key: 'length', label: 'Length' },
    { key: 'width', label: 'Width' },
    { key: 'height', label: 'Height' },
  ];

  return (
    <section
      id="design-your-piece"
      ref={sectionRef}
      aria-labelledby="design-heading"
      className="relative w-full overflow-hidden bg-[#f3eee6] px-5 py-20 sm:px-8 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6517] md:text-sm">
            Design Your Piece
          </span>
          <h2 id="design-heading" className="font-serif text-3xl leading-tight text-stone-900 sm:text-4xl md:text-5xl">
            Shape it. See it. Send it.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-stone-600 sm:text-base">
            Choose a piece, a wood and a size. Send us your design and we will quote it.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          {/* 3D preview */}
          <div
            ref={stageRef}
            className="relative aspect-[4/3] min-h-[280px] w-full overflow-hidden rounded-sm border border-stone-200 bg-gradient-to-b from-[#f7f3ec] to-[#e9e2d6] shadow-sm lg:sticky lg:top-24"
          >
            <canvas
              ref={canvasRef}
              aria-label={`3D preview of a ${summary}`}
              role="img"
              className={`absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing ${gl === 'yes' ? '' : 'hidden'}`}
              style={{ touchAction: 'pan-y' }}
            />
            {gl === 'yes' && !ready && (
              <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.25em] text-stone-400">
                Loading preview
              </div>
            )}
            {gl === 'no' && (
              <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-sm text-stone-500">
                The 3D preview isn&rsquo;t available on this device, but you can still choose your options and send us your design.
              </div>
            )}
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-sm bg-white/85 px-3 py-1.5 text-[11px] font-medium tracking-wide text-stone-700 backdrop-blur-sm">
              {summary}
            </div>
            {gl === 'yes' && ready && (
              <div className="pointer-events-none absolute right-3 top-3 text-[10px] uppercase tracking-[0.2em] text-stone-400">
                Drag to rotate
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-7">
            <fieldset>
              <legend className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">1. Piece</legend>
              <div className="flex flex-wrap gap-2">
                {PIECES.map((p) => (
                  <button key={p.key} type="button" aria-pressed={type === p.key} onClick={() => pickType(p.key)} className={chip(type === p.key)}>
                    {p.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">2. Wood &amp; finish</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {WOOD_OPTIONS.map((w) => (
                  <button
                    key={w.key}
                    type="button"
                    aria-pressed={wood === w.key}
                    onClick={() => setWood(w.key)}
                    className={`flex min-h-[48px] items-center gap-2.5 rounded-sm border px-3 text-left text-[13px] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] ${
                      wood === w.key ? 'border-[#c5a059] bg-white shadow-sm' : 'border-stone-300 bg-white/70 hover:border-[#c5a059]'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-5 w-5 shrink-0 rounded-full border ${wood === w.key ? 'border-[#c5a059] ring-2 ring-[#c5a059]/40' : 'border-stone-300'}`}
                      style={{ background: w.swatch }}
                    />
                    <span className="leading-tight text-stone-800">{w.label}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">3. Size</legend>
              <div className="space-y-5">
                {sliders.map(({ key, label }) => {
                  const [min, max] = LIMITS[type][key];
                  return (
                    <div key={key}>
                      <div className="mb-1 flex items-baseline justify-between text-sm">
                        <label htmlFor={`dyp-${key}`} className="text-stone-700">{label}</label>
                        <span className="tabular-nums font-medium text-stone-900">{dims[key]} cm</span>
                      </div>
                      <input
                        id={`dyp-${key}`}
                        type="range"
                        min={min}
                        max={max}
                        step={1}
                        value={dims[key]}
                        onChange={(e) => setDims((d) => ({ ...d, [key]: Number(e.target.value) }))}
                        className="h-8 w-full cursor-pointer accent-[#8c6517]"
                      />
                    </div>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('design')}
                className="inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-sm bg-[#1a1a1a] px-8 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition-colors duration-300 hover:bg-black active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3eee6]"
              >
                <WhatsAppIcon className="h-6 w-6 shrink-0" />
                Send my design on WhatsApp
              </a>
              <p className="mt-3 text-center text-xs text-stone-500">
                Free quote from your design. A R550 call-out fee applies to site visits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
