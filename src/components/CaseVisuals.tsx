import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useT } from '../i18n';
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

const show = (on: boolean) => ({ opacity: on ? 1 : 0, transition: { duration: 0.6, ease } });

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
  const v = useT().visuals;
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
              {v.oneTool}
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
                  {v.docs[i] ?? d.label}
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
            {v.duplicated}
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
