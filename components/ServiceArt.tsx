import React from 'react';

export type ArtKind = 'kitchen' | 'custom' | 'restoration';

/* Lightweight inline SVG line art. No libraries. All motion is one-shot and
   disabled under prefers-reduced-motion (see ART_CSS). */
export const ART_CSS = `
.ec-art{fill:none;stroke:#c5a059;stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round;overflow:visible}
.ec-art .ec-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:ecDraw 1.1s ease-out var(--d,0s) forwards}
.ec-art .ec-soft{opacity:.55}
.ec-art .ec-worn path{stroke-dasharray:3 3;opacity:0;animation:ecFade .9s ease-out var(--d,0s) forwards}
@keyframes ecDraw{to{stroke-dashoffset:0}}
@keyframes ecFade{to{opacity:.6}}
.ec-art .mv{transform-box:fill-box}
.ec-art.is-on .ec-drawer{animation:ecDrawer .8s ease .7s both}
.ec-art.is-on .ec-door{transform-origin:left center;animation:ecDoor .8s ease .7s both}
.ec-art .ec-clip{transform-box:fill-box;transform-origin:left center;transform:scaleX(0)}
.ec-art.is-on .ec-clip{animation:ecSweep 1.1s ease .5s both}
.ec-art .ec-sweepline{opacity:0}
.ec-art.is-on .ec-sweepline{animation:ecSweepLine 1.1s ease .5s both}
@keyframes ecDrawer{to{transform:translateY(3px)}}
@keyframes ecDoor{to{transform:scaleX(.8)}}
@keyframes ecSweep{to{transform:scaleX(1)}}
@keyframes ecSweepLine{0%{opacity:1;transform:translateX(0)}90%{opacity:1}100%{opacity:0;transform:translateX(160px)}}
@media (prefers-reduced-motion:reduce){
 .ec-art .ec-draw{animation:none;stroke-dashoffset:0}
 .ec-art .ec-worn path{animation:none;opacity:.6}
 .ec-art.is-on .ec-drawer,.ec-art.is-on .ec-door,.ec-art.is-on .ec-sweepline{animation:none}
 .ec-art.is-on .ec-clip{animation:none;transform:scaleX(1)}
}
`;

// pathLength="1" lets every stroke "draw" with the same dash values.
const D: React.FC<{ d: string; delay?: number; soft?: boolean }> = ({ d, delay = 0, soft }) => (
  <path d={d} pathLength={1} className={`ec-draw${soft ? ' ec-soft' : ''}`} style={{ ['--d' as any]: `${delay}s` }} />
);

const Kitchen: React.FC = () => (
  <>
    <D d="M8 90 H152" soft />
    <D d="M16 56 H144 V88 H16 Z" delay={0.1} />
    <D d="M10 52 H150 V56 H10 Z" delay={0.25} />
    <D d="M60 56 V88 M100 56 V88" delay={0.4} />
    <D d="M52 68 V76 M108 68 V76 M76 82 H84" delay={0.55} />
    <g className="mv ec-drawer"><D d="M64 60 H96 V72 H64 Z M76 66 H84" delay={0.6} /></g>
    <D d="M16 12 H56 V40 H16 Z M104 12 H144 V40 H104 Z" delay={0.45} />
    <g className="mv ec-door"><D d="M19 15 H53 V37 H19 Z M48 28 V34" delay={0.7} /></g>
    <D d="M110 28 V34 M68 12 H92 L88 32 H72 Z M74 12 V6 H86 V12" delay={0.8} />
  </>
);

const Custom: React.FC = () => (
  <>
    <D d="M16 24 H144 M16 20 V28 M144 20 V28" delay={0.1} soft />
    <D d="M16 36 H144 V42 H16 Z" delay={0.2} />
    <D d="M20 42 H140 V72 H20 Z M80 42 V72" delay={0.35} />
    <g className="mv ec-door"><D d="M26 48 H74 V66 H26 Z M68 54 V60" delay={0.55} /></g>
    <D d="M86 58 H134 V66 H86 Z M106 62 H114" delay={0.65} />
    <g className="mv ec-drawer"><D d="M86 48 H134 V56 H86 Z M106 52 H114" delay={0.7} /></g>
    <D d="M26 72 L32 92 H35 L34 72 M126 72 L125 92 H128 L134 72" delay={0.85} />
  </>
);

const CHAIR = [
  'M52 10 V60 M108 10 V60',
  'M50 14 Q80 6 110 14 V22 Q80 14 50 22 Z',
  'M64 24 V56 M80 22 V56 M96 24 V56',
  'M44 60 H116 L122 70 H38 Z',
  'M42 70 V94 M118 70 V94 M42 84 H118',
];

const Restoration: React.FC = () => (
  <>
    <g className="ec-worn">
      {CHAIR.map((d, i) => (
        <path key={i} d={d} style={{ ['--d' as any]: `${i * 0.12}s` }} />
      ))}
      <path d="M62 38 l3 4 l-3 4 M88 50 l4 2 M70 64 l4 -1 M104 66 l3 1" style={{ ['--d' as any]: '0.6s' }} />
    </g>
    <defs>
      <clipPath id="ecChairClip">
        <rect className="ec-clip" x="0" y="0" width="160" height="100" />
      </clipPath>
    </defs>
    <g clipPath="url(#ecChairClip)">
      {CHAIR.map((d, i) => (
        <path key={i} d={d} strokeWidth={1.6} />
      ))}
    </g>
    <path className="ec-sweepline" d="M0 4 V96" strokeWidth={1} />
  </>
);

export const ServiceArt: React.FC<{ kind: ArtKind; on: boolean; play: number }> = ({ kind, on, play }) => (
  <svg
    key={play}
    viewBox="0 0 160 100"
    className={`ec-art w-full h-auto ${on ? 'is-on' : ''}`}
    aria-hidden="true"
    focusable="false"
  >
    {kind === 'kitchen' ? <Kitchen /> : kind === 'custom' ? <Custom /> : <Restoration />}
  </svg>
);
