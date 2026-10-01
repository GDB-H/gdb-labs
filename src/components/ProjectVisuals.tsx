import { useEffect, useId } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import type { Bench } from '../content';

export const INK = '#121214';
export const PAPER = '#F3F1EC';
export const PAPER_2 = '#E8E5DE';
export const ACCENT = '#EE5420';
export const LINE = 'rgba(18,18,20,0.12)';

// gli id di React contengono ':' che non sono validi dentro url(#...)
export const useSvgId = () => useId().replace(/:/g, '');

const svgProps = { viewBox: '0 0 400 300', className: 'h-full w-full', 'aria-hidden': true } as const;

// ----------------------------------------------------------------
// Gestionale: dashboard con KPI e grafico vivo
// ----------------------------------------------------------------
function Dashboard() {
  const clip = useSvgId();
  const bars = [0.35, 0.55, 0.42, 0.7, 0.5, 0.82, 0.95, 0.6, 0.74, 0.88];

  return (
    <svg {...svgProps}>
      <defs>
        <clipPath id={clip}>
          <rect x="36" y="32" width="328" height="236" rx="14" />
        </clipPath>
      </defs>
      <rect x="36" y="32" width="328" height="236" rx="14" fill={PAPER} stroke={LINE} />
      <g clipPath={`url(#${clip})`}>
        <rect x="36" y="32" width="60" height="236" fill={INK} />
        <circle cx="66" cy="56" r="8" fill={ACCENT} />
        {[88, 106, 124, 142].map((y, i) => (
          <rect key={y} x="52" y={y} width="28" height="5" rx="2.5" fill={PAPER} opacity={i === 1 ? 0.9 : 0.25} />
        ))}
      </g>

      <rect x="112" y="48" width="90" height="8" rx="4" fill={INK} opacity="0.85" />
      <rect x="112" y="62" width="58" height="5" rx="2.5" fill={INK} opacity="0.25" />
      <circle cx="342" cy="56" r="9" fill={PAPER_2} />

      {[112, 196, 280].map((x, i) => (
        <g key={x}>
          <rect x={x} y="80" width="76" height="44" rx="8" fill={PAPER_2} />
          <rect x={x + 10} y="91" width="28" height="4" rx="2" fill={INK} opacity="0.35" />
          <motion.rect
            x={x + 10}
            y="102"
            width="30"
            height="9"
            rx="3"
            fill={i === 1 ? ACCENT : INK}
            opacity="0.85"
            initial={{ width: 30 }}
            animate={{ width: [30, 46, 38, 30] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
          />
        </g>
      ))}

      <rect x="112" y="136" width="244" height="86" rx="8" fill={PAPER_2} />
      {bars.map((h, i) => {
        const heights = [h, Math.min(1, h * 0.6 + 0.35), h * 0.75, h].map((v) => v * 62);
        return (
          <motion.rect
            key={i}
            x={128 + i * 22}
            y={212 - heights[0]}
            width="14"
            height={heights[0]}
            rx="3"
            fill={i === 6 ? ACCENT : INK}
            opacity={i === 6 ? 1 : 0.8}
            initial={{ height: heights[0], attrY: 212 - heights[0] }}
            animate={{ height: heights, attrY: heights.map((v) => 212 - v) }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 }}
          />
        );
      })}

      {[234, 250].map((y, i) => (
        <g key={y}>
          <circle cx="118" cy={y + 3} r="3" fill={i === 0 ? ACCENT : INK} opacity={i === 0 ? 1 : 0.4} />
          <rect x="128" y={y} width="80" height="6" rx="3" fill={INK} opacity="0.55" />
          <rect x="226" y={y} width="50" height="6" rx="3" fill={INK} opacity="0.2" />
          <rect x="308" y={y} width="48" height="6" rx="3" fill={INK} opacity="0.2" />
        </g>
      ))}
    </svg>
  );
}

// ----------------------------------------------------------------
// Web app: una pagina che si compone e un cursore che clicca
// ----------------------------------------------------------------
function Browser() {
  const loop = { duration: 5, repeat: Infinity, ease: 'easeInOut' as const };
  const times = [0, 0.35, 0.5, 0.56, 0.78, 1];

  return (
    <svg {...svgProps}>
      <rect x="36" y="32" width="328" height="236" rx="14" fill={PAPER} stroke={LINE} />
      <line x1="36" y1="62" x2="364" y2="62" stroke={LINE} />
      {[54, 66, 78].map((cx) => (
        <circle key={cx} cx={cx} cy="47" r="3.5" fill={INK} opacity="0.15" />
      ))}
      <rect x="130" y="40" width="140" height="14" rx="7" fill={PAPER_2} />
      <rect x="140" y="45" width="60" height="4" rx="2" fill={INK} opacity="0.3" />

      <rect x="60" y="84" width="168" height="14" rx="4" fill={INK} opacity="0.88" />
      <rect x="60" y="104" width="118" height="14" rx="4" fill={INK} opacity="0.88" />
      <rect x="60" y="130" width="148" height="5" rx="2.5" fill={INK} opacity="0.22" />
      <rect x="60" y="140" width="126" height="5" rx="2.5" fill={INK} opacity="0.22" />

      <motion.rect
        x="60"
        y="160"
        width="76"
        height="24"
        rx="12"
        animate={{ fill: [INK, INK, ACCENT, ACCENT, INK, INK] }}
        transition={{ ...loop, times }}
      />
      <rect x="74" y="170" width="40" height="4" rx="2" fill={PAPER} />
      <motion.circle
        cx="98"
        cy="172"
        r="0"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        initial={{ r: 0, opacity: 0 }}
        animate={{ r: [0, 0, 0, 28, 28, 0], opacity: [0, 0, 0.8, 0, 0, 0] }}
        transition={{ ...loop, times }}
      />

      <rect x="250" y="80" width="94" height="104" rx="10" fill={PAPER_2} />
      <circle cx="320" cy="104" r="9" fill={ACCENT} opacity="0.9" />
      <path d="M256 178 L286 138 L306 162 L318 148 L340 178 Z" fill={INK} opacity="0.75" />

      {[60, 158, 256].map((x, i) => (
        <motion.g
          key={x}
          animate={{ opacity: [0, 1, 1, 1, 1, 0], y: [12, 0, 0, 0, 0, 0] }}
          transition={{ ...loop, times: [0, 0.15 + i * 0.06, 0.5, 0.7, 0.92, 1] }}
        >
          <rect x={x} y="200" width="86" height="48" rx="8" fill={PAPER_2} />
          <rect x={x + 10} y="212" width="36" height="5" rx="2.5" fill={INK} opacity="0.7" />
          <rect x={x + 10} y="224" width="58" height="4" rx="2" fill={INK} opacity="0.25" />
          <rect x={x + 10} y="233" width="44" height="4" rx="2" fill={INK} opacity="0.25" />
        </motion.g>
      ))}

      <motion.g
        animate={{ x: [310, 100, 100, 100, 290, 310], y: [250, 174, 174, 174, 120, 250], scale: [1, 1, 0.85, 1, 1, 1] }}
        transition={{ ...loop, times }}
      >
        <path d="M0 0 L0 17 L4.5 13 L7.8 20 L10.6 18.8 L7.4 12 L13 12 Z" fill={INK} stroke={PAPER} strokeWidth="1.5" strokeLinejoin="round" />
      </motion.g>
    </svg>
  );
}

// ----------------------------------------------------------------
// Stampa 3D: il pezzo cresce strato dopo strato
// ----------------------------------------------------------------
const VASE = 'M150 236 C150 200 140 172 158 142 C172 118 178 98 170 78 L230 78 C222 98 228 118 242 142 C260 172 250 200 250 236 Z';

function Printer() {
  const clip = useSvgId();
  const layers = useSvgId();
  const progress = useMotionValue(0);
  const nozzleX = useMotionValue(200);
  const clipY = useTransform(progress, (p) => 236 - p * 158);
  const clipH = useTransform(progress, (p) => p * 158 + 1);
  const nozzleY = useTransform(progress, (p) => 236 - p * 158);

  useEffect(() => {
    const a = animate(progress, [0, 1, 1], { duration: 7, times: [0, 0.86, 1], ease: 'linear', repeat: Infinity });
    const b = animate(nozzleX, [160, 240], { duration: 0.55, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' });
    return () => {
      a.stop();
      b.stop();
    };
  }, [progress, nozzleX]);

  return (
    <svg {...svgProps}>
      <defs>
        <pattern id={layers} width="8" height="4" patternUnits="userSpaceOnUse">
          <rect width="8" height="4" fill={ACCENT} />
          <rect y="3" width="8" height="1" fill={INK} opacity="0.18" />
        </pattern>
        <clipPath id={clip}>
          <motion.rect x="0" width="400" y={clipY} height={clipH} />
        </clipPath>
      </defs>

      <line x1="80" y1="36" x2="80" y2="244" stroke={LINE} strokeWidth="2" />
      <line x1="320" y1="36" x2="320" y2="244" stroke={LINE} strokeWidth="2" />

      <path d={VASE} fill="none" stroke={INK} strokeOpacity="0.25" strokeDasharray="3 4" />
      <path d={VASE} fill={`url(#${layers})`} clipPath={`url(#${clip})`} />

      <rect x="104" y="236" width="192" height="8" rx="3" fill={INK} />
      <rect x="118" y="244" width="8" height="16" fill={INK} opacity="0.6" />
      <rect x="274" y="244" width="8" height="16" fill={INK} opacity="0.6" />

      <motion.g style={{ y: nozzleY }}>
        <line x1="80" y1="-30" x2="320" y2="-30" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <motion.g style={{ x: nozzleX }}>
          <rect x="-13" y="-42" width="26" height="24" rx="4" fill={INK} />
          <circle cx="0" cy="-30" r="3" fill={ACCENT} />
          <path d="M-6 -18 L6 -18 L1.5 -3 L-1.5 -3 Z" fill={INK} />
        </motion.g>
      </motion.g>
    </svg>
  );
}

// ----------------------------------------------------------------
// Game: un personaggio attraversa un piccolo labirinto
// ----------------------------------------------------------------
const T = 28;
const OX = 46;
const OY = 54;
const COLS = 11;
const ROWS = 7;
const WALLS = [
  [2, 0], [3, 0], [2, 1], [3, 1], [4, 1], [5, 1], [0, 2], [0, 5], [0, 6], [1, 5], [2, 5], [3, 5],
  [5, 4], [5, 5], [6, 5], [8, 1], [8, 2], [8, 3], [8, 4], [10, 1], [10, 2], [10, 3],
];
const PATH = [[0, 0], [1, 0], [1, 3], [7, 3], [7, 0], [9, 0], [9, 6], [10, 6]];

function Game() {
  const center = (c: number) => c * T + T / 2;
  const lengths = PATH.slice(1).map((p, i) => Math.abs(p[0] - PATH[i][0]) + Math.abs(p[1] - PATH[i][1]));
  const total = lengths.reduce((a, b) => a + b, 0);
  let acc = 0;
  const times = [0, ...lengths.map((l) => (acc += l) / total * 0.86), 1];
  const xs = [...PATH.map((p) => OX + center(p[0])), OX + center(PATH[PATH.length - 1][0])];
  const ys = [...PATH.map((p) => OY + center(p[1])), OY + center(PATH[PATH.length - 1][1])];
  const goal = PATH[PATH.length - 1];

  return (
    <svg {...svgProps}>
      <rect x="46" y="30" width="44" height="6" rx="3" fill={INK} opacity="0.7" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={318 + i * 14} y="28" width="10" height="10" rx="2" fill={i < 2 ? ACCENT : LINE} />
      ))}

      {Array.from({ length: COLS * ROWS }).map((_, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        const wall = WALLS.some(([wc, wr]) => wc === c && wr === r);
        return (
          <rect
            key={i}
            x={OX + c * T + 1}
            y={OY + r * T + 1}
            width={T - 2}
            height={T - 2}
            rx="4"
            fill={wall ? INK : PAPER}
            stroke={wall ? 'none' : LINE}
          />
        );
      })}

      {[[4, 0], [6, 1], [3, 4]].map(([c, r], i) => (
        <motion.circle
          key={i}
          cx={OX + center(c)}
          cy={OY + center(r)}
          r="4"
          fill={INK}
          animate={{ scale: [1, 1.35, 1] }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <motion.circle
        cx={OX + center(goal[0])}
        cy={OY + center(goal[1])}
        r="5"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        initial={{ r: 5, opacity: 1 }}
        animate={{ r: [5, 11, 5], opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />

      <motion.g
        animate={{ x: [OX + center(1), OX + center(4), OX + center(1)] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ y: OY + center(4) }}
      >
        <circle r="8" fill={INK} opacity="0.85" />
        <circle cx="-3" cy="-2" r="1.6" fill={PAPER} />
        <circle cx="3" cy="-2" r="1.6" fill={PAPER} />
      </motion.g>

      <motion.g animate={{ x: xs, y: ys }} transition={{ duration: 6.5, times, repeat: Infinity, ease: 'linear' }}>
        <rect x="-10" y="-10" width="20" height="20" rx="5" fill={ACCENT} />
        <rect x="-5" y="-4" width="3" height="5" rx="1.5" fill={PAPER} />
        <rect x="2" y="-4" width="3" height="5" rx="1.5" fill={PAPER} />
      </motion.g>
    </svg>
  );
}

export function ProjectVisual({ kind }: { kind: NonNullable<Bench['visual']> }) {
  switch (kind) {
    case 'dashboard':
      return <Dashboard />;
    case 'web':
      return <Browser />;
    case 'print':
      return <Printer />;
    case 'game':
      return <Game />;
  }
}
