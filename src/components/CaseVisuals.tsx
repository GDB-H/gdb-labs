import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ACCENT, INK, LINE, PAPER, useSvgId } from './ProjectVisuals';
import { ease } from './ui';

// ----------------------------------------------------------------
// Cornice comune: visual + selettore delle fasi in vetro smerigliato
// ----------------------------------------------------------------
export function StageFrame({
  id,
  labels,
  stage,
  onSelect,
  children,
}: {
  id: string;
  labels: string[];
  stage: number;
  onSelect?: (i: number) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] bg-paper-2 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.75)]">
      <div className="absolute inset-0">{children}</div>
      <div
        className="absolute inset-x-2.5 bottom-2.5 grid gap-1 rounded-[1.1rem] bg-ink/70 p-1 text-[0.74rem] text-paper backdrop-blur-md sm:inset-x-3 sm:bottom-3 sm:text-[0.8rem]"
        style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}
      >
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => onSelect?.(i)}
            className="relative truncate rounded-[0.8rem] px-1 py-2 text-center sm:px-2"
            aria-current={stage === i ? 'step' : undefined}
          >
            {stage === i && (
              <motion.span layoutId={`stage-pill-${id}`} className="absolute inset-0 rounded-[0.8rem] bg-paper/15" transition={{ duration: 0.45, ease }} />
            )}
            <span className={`relative transition-colors duration-300 ${stage === i ? 'text-paper' : 'text-paper/55'}`}>
              <span className="mr-1 hidden tabular-nums text-accent lg:inline">0{i + 1}</span>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Prototipazione: brief → guasto → CAD → stampa → prodotto
// ----------------------------------------------------------------
const BRACKET =
  'M110 62 L150 62 L150 112 L204 156 L290 156 L290 196 L110 196 Z M122 87 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 Z M242 176 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 Z';

const show = (on: boolean) => ({ opacity: on ? 1 : 0, transition: { duration: 0.6, ease } });

export function PrototypeEvolution({ stage }: { stage: number }) {
  const layers = useSvgId();
  const grid = useSvgId();
  const printClip = useSvgId();

  return (
    <div className="absolute inset-x-4 bottom-16 top-6">
      <svg viewBox="40 30 320 215" className="h-full w-full" aria-hidden>
        <defs>
          <pattern id={layers} width="8" height="4" patternUnits="userSpaceOnUse">
            <rect width="8" height="4" fill={ACCENT} />
            <rect y="3" width="8" height="1" fill={INK} opacity="0.2" />
          </pattern>
          <pattern id={grid} width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M12 0 L0 0 0 12" fill="none" stroke={INK} strokeOpacity="0.07" />
          </pattern>
          <clipPath id={printClip}>
            <motion.rect
              x="0"
              y="206"
              width="400"
              height="0"
              initial={false}
              animate={stage >= 3 ? { attrY: 40, height: 170 } : { attrY: 206, height: 0 }}
              transition={{ duration: stage === 3 ? 2.2 : 0.4, ease: 'linear' }}
            />
          </clipPath>
        </defs>

        <motion.rect x="40" y="30" width="320" height="215" fill={`url(#${grid})`} initial={false} animate={show(stage === 2)} />

        {/* 0 — brief: lo schizzo si disegna */}
        <motion.g initial={false} animate={show(stage === 0)}>
          <motion.path
            d={BRACKET}
            fill="none"
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="7 5"
            transform="rotate(-2 200 130)"
            initial={false}
            animate={{ pathLength: stage === 0 ? 1 : 0 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          />
          <text x="178" y="95" fontSize="15" fill={INK} fontStyle="italic" fontFamily="Instrument Serif, Georgia, serif">
            supporto più robusto?
          </text>
        </motion.g>

        {/* 1 — guasto: il pezzo originale crepato */}
        <motion.g initial={false} animate={show(stage === 1)}>
          <motion.g animate={stage === 1 ? { x: [0, -1.5, 1.5, -1, 0] } : { x: 0 }} transition={{ duration: 0.5, repeat: stage === 1 ? Infinity : 0, repeatDelay: 1.2 }}>
            <path d={BRACKET} fill="#BDB6AA" fillRule="evenodd" stroke={INK} strokeOpacity="0.35" />
            <path d="M150 112 L160 124 L154 131 L167 141 L161 148 L176 156" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M178 160 L184 166 L176 168 Z M190 164 L194 170 L187 170 Z" fill="#BDB6AA" stroke={INK} strokeOpacity="0.35" />
          </motion.g>
          <circle cx="232" cy="112" r="13" fill={ACCENT} />
          <text x="232" y="117.5" textAnchor="middle" fontSize="16" fontWeight="700" fill={PAPER} fontFamily="Inter Tight, sans-serif">
            !
          </text>
        </motion.g>

        {/* 2 — CAD con quote */}
        <motion.g initial={false} animate={show(stage === 2)} fill="none" stroke={INK}>
          <path d={BRACKET} strokeWidth="1.5" fillRule="evenodd" />
          <g strokeOpacity="0.55" strokeWidth="0.8">
            <path d="M110 214 L290 214 M110 208 L110 220 M290 208 L290 220" />
            <path d="M88 62 L88 196 M82 62 L94 62 M82 196 L94 196" />
            <path d="M116 87 L144 87 M130 73 L130 101 M236 176 L264 176 M250 162 L250 190" strokeDasharray="3 2" />
            <path d="M150 112 L204 156" strokeDasharray="2 3" stroke={ACCENT} strokeOpacity="1" />
          </g>
          <text x="200" y="230" textAnchor="middle" fontSize="10" fill={INK} stroke="none" fontFamily="Inter Tight, sans-serif">
            180
          </text>
          <text x="80" y="132" textAnchor="middle" fontSize="10" fill={INK} stroke="none" fontFamily="Inter Tight, sans-serif" transform="rotate(-90 80 132)">
            134
          </text>
          <text x="214" y="128" fontSize="10" fill={ACCENT} stroke="none" fontFamily="Inter Tight, sans-serif">
            rinforzo
          </text>
        </motion.g>

        {/* 3 — stampa a strati */}
        <motion.g initial={false} animate={show(stage === 3)}>
          <path d={BRACKET} fill="none" stroke={INK} strokeOpacity="0.25" strokeDasharray="3 4" />
          <path d={BRACKET} fill={`url(#${layers})`} fillRule="evenodd" clipPath={`url(#${printClip})`} />
          <rect x="96" y="196" width="208" height="6" rx="2" fill={INK} />
        </motion.g>

        {/* 4 — prodotto finito */}
        <motion.g
          initial={false}
          animate={{ opacity: stage === 4 ? 1 : 0, scale: stage === 4 ? 1 : 0.94 }}
          transition={{ duration: 0.7, ease }}
        >
          <path d={BRACKET} fill={INK} fillRule="evenodd" />
          <path d="M114 66 L146 66 L146 110" fill="none" stroke={PAPER} strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
          <circle cx="300" cy="72" r="15" fill={ACCENT} />
          <path d="M292.5 72 L297.5 77 L307 67" fill="none" stroke={PAPER} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      </svg>
    </div>
  );
}

// ----------------------------------------------------------------
// Software: documenti sparsi → mappa del processo → flusso snello → gestionale
// ----------------------------------------------------------------
type Doc = 'sheet' | 'mail' | 'paper';
const DOCS: { kind: Doc; label: string; scatter: [number, number, number]; row: number; keep: number | null }[] = [
  { kind: 'sheet', label: 'Ordine', scatter: [95, 82, -8], row: 0, keep: 0 },
  { kind: 'mail', label: 'Email', scatter: [205, 66, 6], row: 1, keep: null },
  { kind: 'sheet', label: 'Produzione', scatter: [318, 100, 9], row: 2, keep: 1 },
  { kind: 'paper', label: 'Magazzino', scatter: [118, 186, 7], row: 3, keep: 2 },
  { kind: 'mail', label: 'Ricopia', scatter: [245, 170, -10], row: 4, keep: null },
  { kind: 'sheet', label: 'Consegna', scatter: [330, 198, -4], row: 5, keep: 3 },
];
const ROW_X = [45, 107, 169, 231, 293, 355];
const LEAN_X = [80, 160, 240, 320];
const FLOW_Y = 120;

function docTarget(d: (typeof DOCS)[number], stage: number) {
  if (stage <= 1) return { x: d.scatter[0], y: d.scatter[1], rotate: d.scatter[2], scale: 1, opacity: 1 };
  if (stage === 2) return { x: ROW_X[d.row], y: FLOW_Y, rotate: 0, scale: 0.72, opacity: d.keep === null ? 0.45 : 1 };
  if (d.keep === null) return { x: ROW_X[d.row], y: FLOW_Y, rotate: 0, scale: 0.4, opacity: 0 };
  return { x: LEAN_X[d.keep], y: FLOW_Y, rotate: 0, scale: 0.88, opacity: 1 };
}

function DocFace({ kind }: { kind: Doc }) {
  if (kind === 'mail')
    return <path d="M-35 -25 L0 4 L35 -25" fill="none" stroke={INK} strokeOpacity="0.5" strokeWidth="1.5" />;
  if (kind === 'paper')
    return (
      <g fill={INK} opacity="0.35">
        {[-14, -5, 4, 13].map((y, i) => (
          <rect key={y} x="-24" y={y} width={i === 3 ? 28 : 48} height="4" rx="2" />
        ))}
      </g>
    );
  return (
    <g stroke={INK} strokeOpacity="0.3" strokeWidth="1">
      <rect x="-35" y="-25" width="70" height="11" fill={INK} fillOpacity="0.1" stroke="none" />
      <path d="M-35 -3 L35 -3 M-35 8 L35 8 M-12 -25 L-12 25 M12 -25 L12 25" />
    </g>
  );
}

export function ProcessEvolution({ stage, image }: { stage: number; image?: { src: string; alt: string } }) {
  const arrow = useSvgId();

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-x-3 bottom-16 top-4">
        <svg viewBox="0 20 400 230" className="h-full w-full" aria-hidden>
          <defs>
            <marker id={arrow} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 Z" fill={INK} />
            </marker>
          </defs>

          {/* 1 — il problema: dati che rimbalzano e si duplicano */}
          <motion.g initial={false} animate={show(stage === 1)} fill="none" stroke={ACCENT} strokeWidth="1.6" strokeDasharray="5 5">
            <path d="M120 92 C 180 140, 200 150, 228 168" />
            <path d="M300 112 C 340 150, 345 170, 334 182" />
            <path d="M195 82 C 160 120, 140 150, 128 172" />
            <path d="M262 160 C 280 120, 290 110, 300 104" />
          </motion.g>

          {/* 2 — mappa: frecce tra tutti i passaggi */}
          <motion.g initial={false} animate={show(stage === 2)} stroke={INK} strokeWidth="1.2">
            {ROW_X.slice(0, -1).map((x, i) => (
              <line key={x} x1={x + 27} y1={FLOW_Y} x2={ROW_X[i + 1] - 27} y2={FLOW_Y} markerEnd={`url(#${arrow})`} />
            ))}
          </motion.g>

          {/* 3 — flusso snello */}
          <motion.g initial={false} animate={show(stage === 3)}>
            <rect x="34" y="72" width="332" height="100" rx="14" fill="none" stroke={ACCENT} strokeWidth="1.4" strokeDasharray="6 5" />
            <text x="200" y="64" textAnchor="middle" fontSize="11" fill={ACCENT} fontFamily="Inter Tight, sans-serif" fontWeight="600">
              UN SOLO STRUMENTO
            </text>
            <g stroke={INK} strokeWidth="1.4">
              {LEAN_X.slice(0, -1).map((x, i) => (
                <line key={x} x1={x + 33} y1={FLOW_Y} x2={LEAN_X[i + 1] - 33} y2={FLOW_Y} markerEnd={`url(#${arrow})`} />
              ))}
            </g>
          </motion.g>

          {DOCS.map((d, i) => {
            const target = docTarget(d, stage);
            return (
              <motion.g key={d.label} initial={false} animate={target} transition={{ duration: 0.9, ease, delay: stage >= 2 ? i * 0.04 : 0 }}>
                <motion.g
                  animate={stage === 1 ? { rotate: [0, -3, 3, 0] } : { rotate: 0 }}
                  transition={{ duration: 0.6, repeat: stage === 1 ? Infinity : 0, repeatDelay: 0.8 + i * 0.15 }}
                >
                  <rect x="-35" y="-25" width="70" height="50" rx="7" fill={PAPER} stroke={LINE} />
                  <motion.g initial={false} animate={show(stage < 2)}>
                    <DocFace kind={d.kind} />
                  </motion.g>
                  <motion.g initial={false} animate={show(stage >= 2)}>
                    <circle cx="-20" cy="0" r="6" fill={d.keep === null ? INK : ACCENT} opacity={d.keep === null ? 0.3 : 1} />
                    <rect x="-8" y="-7" width="32" height="5" rx="2.5" fill={INK} opacity="0.75" />
                    <rect x="-8" y="3" width="22" height="4" rx="2" fill={INK} opacity="0.3" />
                  </motion.g>
                </motion.g>
                <motion.text
                  y="44"
                  textAnchor="middle"
                  fontSize="12"
                  fill={INK}
                  fontFamily="Inter Tight, sans-serif"
                  initial={false}
                  animate={{ opacity: stage >= 2 ? 0.75 : 0 }}
                >
                  {d.label}
                </motion.text>
                {stage === 1 && i % 2 === 0 && (
                  <g>
                    <circle cx="32" cy="-24" r="9" fill={ACCENT} />
                    <text x="32" y="-19.5" textAnchor="middle" fontSize="12" fontWeight="700" fill={PAPER} fontFamily="Inter Tight, sans-serif">
                      !
                    </text>
                  </g>
                )}
                {stage === 2 && d.keep === null && (
                  <path d="M-16 -16 L16 16 M16 -16 L-16 16" stroke={ACCENT} strokeWidth="3.5" strokeLinecap="round" />
                )}
              </motion.g>
            );
          })}

          <motion.text
            x="200"
            y="236"
            textAnchor="middle"
            fontSize="12"
            fill={ACCENT}
            fontFamily="Inter Tight, sans-serif"
            fontWeight="600"
            initial={false}
            animate={show(stage === 1)}
          >
            STESSI DATI, INSERITI TRE VOLTE
          </motion.text>
        </svg>
      </div>

      {image && (
        <motion.img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          initial={false}
          animate={{ opacity: stage === 4 ? 1 : 0, scale: stage === 4 ? 1 : 1.08 }}
          transition={{ duration: 0.9, ease }}
        />
      )}
    </div>
  );
}
