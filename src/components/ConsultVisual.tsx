import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Check, Cloud, Cpu, Database, Factory, LayoutDashboard, Server, type LucideIcon } from 'lucide-react';
import { useI18n } from '../i18n';
import { ease } from './ui';

/*
 * "Dall'idea al progetto preliminare": la richiesta del cliente diventa
 * requisiti, i requisiti diventano calcoli scritti in diretta, i calcoli
 * diventano un'architettura con i dati che scorrono e infine uno strumento
 * di dimensionamento che il visitatore può usare. Le misure sono in cqw
 * (larghezza del riquadro), così l'insieme scala come un'immagine.
 */

// ----------------------------------------------------------------
// Il calcolo vero, lo stesso mostrato nell'editor
// ----------------------------------------------------------------
const BYTES = 16; // timestamp + id segnale + valore
type Tier = 'small' | 'medium' | 'large';

export function sizing(machines: number, signals: number, hz: number, years: number) {
  const perSecond = machines * signals * hz;
  const perDay = perSecond * 86400;
  const gb = (perDay * BYTES * 365 * years) / 1e9;
  const kbps = (perSecond * BYTES * 8) / 1000;
  const tier: Tier = gb < 50 && kbps < 50 ? 'small' : gb > 2000 || kbps > 5000 ? 'large' : 'medium';
  return { perDay, gb, kbps, tier };
}

type NodeKey = 'machines' | 'gateway' | 'server' | 'database' | 'cloud' | 'dashboard';
const ICONS: Record<NodeKey, LucideIcon> = {
  machines: Factory,
  gateway: Cpu,
  server: Server,
  database: Database,
  cloud: Cloud,
  dashboard: LayoutDashboard,
};
const CHAINS: Record<Tier, NodeKey[]> = {
  small: ['machines', 'server', 'dashboard'],
  medium: ['machines', 'gateway', 'database', 'dashboard'],
  large: ['machines', 'gateway', 'cloud', 'dashboard'],
};

// ----------------------------------------------------------------
// Editor: evidenziazione della sintassi e scrittura in diretta
// ----------------------------------------------------------------
const COLORS = {
  comment: '#7D7A73',
  result: '#F2A57A',
  string: '#A9D6A0',
  number: '#F2C46D',
  keyword: '#FF8150',
  fn: '#8CC8FF',
  punct: '#A3A19B',
  plain: '#ECE9E2',
} as const;
type Tok = { text: string; kind: keyof typeof COLORS };

function tokenize(code: string): Tok[] {
  const re = /(\/\/[^\n]*)|('[^']*')|(\b\d+(?:\.\d+)?(?:e\d+)?\b)|\b(const|function|export|return|if)\b|([A-Za-z_]\w*)(?=\()|([{}[\]();,.:=!<>*/+-]+)/g;
  const out: Tok[] = [];
  let last = 0;
  for (let m = re.exec(code); m; m = re.exec(code)) {
    if (m.index > last) out.push({ text: code.slice(last, m.index), kind: 'plain' });
    let kind: Tok['kind'] = 'punct';
    if (m[1]) kind = m[1].includes('→') ? 'result' : 'comment';
    else if (m[2]) kind = 'string';
    else if (m[3]) kind = 'number';
    else if (m[4]) kind = 'keyword';
    else if (m[5]) kind = 'fn';
    out.push({ text: m[0], kind });
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push({ text: code.slice(last), kind: 'plain' });
  return out;
}

function useTyping(length: number, play: boolean, cps: number) {
  const [count, setCount] = useState(play ? 0 : length);
  useEffect(() => {
    if (!play) {
      setCount(length);
      return;
    }
    setCount(0);
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const n = Math.min(length, Math.max(0, Math.floor(((now - t0) / 1000) * cps)));
      setCount(n);
      if (n < length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [length, play, cps]);
  return count;
}

function Code({ code, play }: { code: string; play: boolean }) {
  const tokens = useMemo(() => tokenize(code), [code]);
  const count = useTyping(code.length, play, 110);
  let left = count;
  const parts = [];
  for (let i = 0; i < tokens.length && left > 0; i++) {
    const tok = tokens[i];
    const piece = tok.text.slice(0, left);
    left -= piece.length;
    parts.push(
      <span
        key={i}
        style={{
          color: COLORS[tok.kind],
          fontStyle: tok.kind === 'comment' ? 'italic' : undefined,
          textShadow: tok.kind === 'result' ? '0 0 12px rgba(238,84,32,0.45)' : undefined,
        }}
      >
        {piece}
      </span>,
    );
  }
  const typing = count < code.length;
  return (
    <pre className="m-0 whitespace-pre font-mono" style={{ fontSize: 'clamp(6px, 1.7cqw, 11.5px)', lineHeight: 1.55 }}>
      {parts}
      <motion.span
        className="ml-px inline-block bg-accent align-[-0.15em]"
        style={{ width: '0.55em', height: '1.1em' }}
        animate={{ opacity: typing ? 1 : [1, 0, 1] }}
        transition={typing ? { duration: 0 } : { duration: 1, repeat: Infinity }}
      />
    </pre>
  );
}

// ----------------------------------------------------------------
// Schema dell'architettura, con i dati che scorrono
// ----------------------------------------------------------------
function ArchNode({ k, compact = false }: { k: NodeKey; compact?: boolean }) {
  const labels = useI18n().t.visuals.consult.arch[k];
  const Icon = ICONS[k];
  return (
    <div className="flex min-w-0 flex-col items-center text-center">
      <span
        className={`grid place-items-center rounded-[1.4cqw] ${compact ? 'bg-ink text-paper' : 'border border-white/15 bg-white/[0.07] text-paper'}`}
        style={{ width: compact ? '5.6cqw' : '9cqw', height: compact ? '5.6cqw' : '9cqw' }}
      >
        <Icon style={{ width: '45%', height: '45%' }} strokeWidth={1.6} />
      </span>
      <span className={`mt-[1cqw] font-medium leading-tight ${compact ? 'consult-archlabel' : ''}`} style={{ fontSize: compact ? 'clamp(7.5px, 1.45cqw, 10.5px)' : 'clamp(8px, 1.8cqw, 12.5px)' }}>
        {labels[0]}
      </span>
      {!compact && (
        <span className="leading-tight opacity-55" style={{ fontSize: 'clamp(7px, 1.45cqw, 10.5px)' }}>
          {labels[1]}
        </span>
      )}
    </div>
  );
}

function Flow({ compact = false, delay = 0 }: { compact?: boolean; delay?: number }) {
  return (
    <div className="relative flex-1 self-start" style={{ height: compact ? '5.6cqw' : '9cqw' }}>
      <span className={`absolute inset-x-[8%] top-1/2 h-px ${compact ? 'bg-ink/20' : 'bg-white/20'}`} />
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          className="absolute top-1/2 rounded-full bg-accent shadow-[0_0_10px_rgba(238,84,32,0.8)]"
          style={{ width: '1cqw', height: '1cqw', marginTop: '-0.5cqw' }}
          animate={{ left: ['8%', '88%'], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: delay + i * 0.8, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// Lo strumento finale, usabile dal visitatore
// ----------------------------------------------------------------
function AnimatedNumber({ value, format }: { value: number; format: (v: number) => string }) {
  const spring = useSpring(value, { stiffness: 90, damping: 20 });
  useEffect(() => spring.set(value), [value, spring]);
  const text = useTransform(spring, format);
  return <motion.span>{text}</motion.span>;
}

function Segmented({
  options,
  value,
  onChange,
  unit,
  group,
  decimal,
}: {
  options: number[];
  value: number;
  onChange: (v: number) => void;
  unit: (v: number) => string;
  group: string;
  decimal: string;
}) {
  return (
    <div className="flex gap-[0.6cqw] rounded-full bg-ink/[0.05] p-[0.5cqw]">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={o === value}
          onClick={() => onChange(o)}
          className={`relative flex-1 whitespace-nowrap rounded-full font-medium tabular-nums transition-colors ${o === value ? 'text-paper' : 'text-ink/65 hover:text-ink'}`}
          style={{ padding: '0.5em 0.4em', fontSize: 'clamp(8.5px, 1.65cqw, 11.5px)' }}
        >
          {o === value && <motion.span layoutId={group} className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
          <span className="relative">
            {String(o).replace('.', decimal)} {unit(o)}
          </span>
        </button>
      ))}
    </div>
  );
}

function SizingApp({ live }: { live: boolean }) {
  const { t, locale } = useI18n();
  const v = t.visuals.consult;
  const [machines, setMachines] = useState(12);
  const [signals, setSignals] = useState(8);
  const [hz, setHz] = useState(1);
  const [years, setYears] = useState(3);
  const r = sizing(machines, signals, hz, years);
  const lang = locale === 'it' ? 'it-IT' : 'en-GB';
  const decimal = locale === 'it' ? ',' : '.';

  const fmtCount = useCallback((n: number) => new Intl.NumberFormat(lang, { notation: 'compact', maximumFractionDigits: 1 }).format(n), [lang]);
  const fmtStorage = useCallback(
    (gb: number) => {
      const nf = (d: number) => new Intl.NumberFormat(lang, { maximumFractionDigits: d });
      return gb >= 1000 ? `${nf(1).format(gb / 1000)} TB` : `${nf(gb < 10 ? 1 : 0).format(gb)} GB`;
    },
    [lang],
  );
  const fmtBand = useCallback(
    (k: number) => {
      const nf = (d: number) => new Intl.NumberFormat(lang, { maximumFractionDigits: d });
      return k >= 1000 ? `${nf(1).format(k / 1000)} Mbit/s` : `${nf(k < 10 ? 1 : 0).format(k)} kbit/s`;
    },
    [lang],
  );

  const label: CSSProperties = { fontSize: 'clamp(7.5px, 1.45cqw, 10px)' };
  const sliderValue: CSSProperties = { fontSize: 'clamp(9px, 1.9cqw, 13px)' };

  return (
    <div className="consult-card flex h-full flex-col rounded-[2.4cqw] bg-paper text-ink shadow-[0_3cqw_8cqw_-2cqw_rgba(0,0,0,0.6)]" style={{ padding: '2.8cqw 3.2cqw' }}>
      <div className="flex items-center justify-between gap-[2cqw]">
        <p className="flex items-center gap-[1.2cqw] font-semibold" style={{ fontSize: 'clamp(10.5px, 2.3cqw, 15px)' }}>
          <span className="relative flex h-[1.4cqw] w-[1.4cqw]">
            {live && <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />}
            <span className="relative h-full w-full rounded-full bg-accent" />
          </span>
          {v.app.title}
        </p>
        <code className="shrink-0 rounded-full bg-ink/5 font-mono text-ink/60" style={{ fontSize: 'clamp(7.5px, 1.5cqw, 10.5px)', padding: '0.35em 0.8em' }}>
          {machines} × {signals} × {String(hz).replace('.', decimal)} Hz
        </code>
      </div>

      <div className="consult-gap mt-[2.2cqw] grid grid-cols-2 gap-x-[3cqw] gap-y-[1.6cqw]">
        {[
          { name: v.app.machines, value: machines, set: setMachines, max: 60 },
          { name: v.app.signals, value: signals, set: setSignals, max: 32 },
        ].map((s) => (
          <label key={s.name} className="block">
            <span className="flex items-baseline justify-between gap-[1cqw]">
              <span className="eyebrow truncate text-ink/50" style={label}>
                {s.name}
              </span>
              <span className="font-semibold tabular-nums" style={sliderValue}>
                {s.value}
              </span>
            </span>
            <input
              type="range"
              min={1}
              max={s.max}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              className="mt-[0.6cqw] w-full cursor-pointer"
              style={{ accentColor: '#EE5420', height: '2.4cqw' }}
            />
          </label>
        ))}
        <div>
          <span className="eyebrow mb-[0.8cqw] block text-ink/50" style={label}>
            {v.app.rate}
          </span>
          <Segmented options={[0.1, 1, 10]} value={hz} onChange={setHz} unit={() => 'Hz'} group="sizing-hz" decimal={decimal} />
        </div>
        <div>
          <span className="eyebrow mb-[0.8cqw] block text-ink/50" style={label}>
            {v.app.history}
          </span>
          <Segmented options={[1, 3, 5]} value={years} onChange={setYears} unit={(y) => (y === 1 ? v.app.year : v.app.years)} group="sizing-years" decimal={decimal} />
        </div>
      </div>

      <div className="consult-gap mt-[2.2cqw] grid grid-cols-3 gap-[1.2cqw]">
        {[
          { name: v.app.perDay, node: <AnimatedNumber value={r.perDay} format={fmtCount} /> },
          { name: v.app.storage, node: <AnimatedNumber value={r.gb} format={fmtStorage} /> },
          { name: v.app.band, node: <AnimatedNumber value={r.kbps} format={fmtBand} /> },
        ].map((stat) => (
          <div key={stat.name} className="min-w-0 rounded-[1.4cqw] bg-ink/[0.05]" style={{ padding: '1.4cqw 1.6cqw' }}>
            <span className="block truncate text-ink/50" style={label}>
              {stat.name}
            </span>
            <span className="block truncate font-semibold tabular-nums tracking-tight" style={{ fontSize: 'clamp(11px, 2.6cqw, 18px)' }}>
              {stat.node}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-[2cqw]">
        <div className="flex items-start">
          {CHAINS[r.tier].map((k, i) => (
            <div key={`${r.tier}-${k}`} className="contents">
              {i > 0 && <Flow compact delay={i * 0.2} />}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22, delay: i * 0.06 }}
                style={{ width: '14cqw' }}
              >
                <ArchNode k={k} compact />
              </motion.div>
            </div>
          ))}
        </div>
        <motion.p
          key={r.tier}
          className="consult-note mt-[1.2cqw] text-center text-ink/60"
          style={{ fontSize: 'clamp(8px, 1.6cqw, 11px)' }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {v.app.tiers[r.tier]}
        </motion.p>
        <p className="consult-disclaimer mt-[0.8cqw] text-center text-ink/35" style={{ fontSize: 'clamp(7px, 1.25cqw, 9.5px)' }}>
          {v.app.disclaimer}
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Il visual a fasi
// ----------------------------------------------------------------
const layer = (on: boolean, dim = false) => ({
  opacity: on ? 1 : dim ? 0.14 : 0,
  scale: on ? 1 : dim ? 0.92 : 0.95,
  filter: on ? 'blur(0px)' : dim ? 'blur(3px)' : 'blur(10px)',
});
const layerTransition = { duration: 0.8, ease };

export function ConsultEvolution({ stage }: { stage: number }) {
  const v = useI18n().t.visuals.consult;
  const c = v.code;
  const code = `${c.title}
const machines = 12;
const signals  = 8;    ${c.perMachine}
const hz       = 1;    ${c.perSecond}
const bytes    = 16;   ${c.perReading}

const perDay = machines * signals * hz * 86400;
${c.resultDay}
const gb = perDay * bytes * 365 * 3 / 1e9;
${c.resultStorage}
const kbps = machines * signals * hz * bytes * 8 / 1000;
${c.resultBand}`;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#131316] text-paper" style={{ containerType: 'inline-size' }}>
      {/* nei riquadri stretti (telefono) lo strumento diventa più compatto */}
      <style>{`@container (max-width: 460px) {
        .consult-area { top: 3% !important; bottom: 23% !important; }
        .consult-card { padding: 2cqw 2.6cqw !important; }
        .consult-gap { margin-top: 1.4cqw !important; }
        .consult-note, .consult-disclaimer, .consult-archlabel { display: none; }
      }`}</style>

      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(rgba(243,241,236,0.12) 1px, transparent 1px)',
          backgroundSize: '3.2cqw 3.2cqw',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%)',
        }}
      />
      <motion.div
        aria-hidden
        className="absolute rounded-full blur-3xl"
        style={{ width: '60cqw', height: '40cqw', left: '20cqw', top: '8cqw', background: 'rgba(238,84,32,0.18)' }}
        animate={{ opacity: stage >= 3 ? 1 : 0.35, scale: stage === 4 ? 1.15 : 1 }}
        transition={{ duration: 1.2, ease }}
      />

      <div className="consult-area absolute inset-x-[4.5%] bottom-[17%] top-[5%]">
        {/* 0–1: la richiesta del cliente, poi i requisiti */}
        <motion.div className="pointer-events-none absolute inset-0" initial={false} animate={layer(stage <= 1)} transition={layerTransition}>
          <motion.div
            className="absolute left-0 top-0 rounded-[1.6cqw] bg-paper text-ink shadow-[0_2cqw_6cqw_-1cqw_rgba(0,0,0,0.6)]"
            style={{ width: '56cqw', padding: '3cqw', originX: 0, originY: 0 }}
            initial={false}
            animate={stage === 0 ? { x: '6cqw', y: '3cqw', scale: 1, opacity: 1 } : { x: '0cqw', y: '0cqw', scale: 0.7, opacity: 0.55 }}
            transition={{ duration: 0.9, ease }}
          >
            <p className="accent-serif leading-[1.15]" style={{ fontSize: 'clamp(13px, 3.6cqw, 24px)' }}>
              {v.quote}
            </p>
            <p className="mt-[1.6cqw] text-ink/50" style={{ fontSize: 'clamp(7.5px, 1.5cqw, 10.5px)' }}>
              {v.client}
            </p>
          </motion.div>

          <motion.div
            className="absolute inset-x-0 bottom-[2%] flex justify-center gap-[2cqw]"
            initial={false}
            animate={stage === 0 ? { opacity: 1, y: '0%' } : { opacity: 0, y: '20%' }}
            transition={{ duration: 0.7, ease }}
          >
            {Array.from({ length: 6 }).map((_, i) => {
              const down = i === 1 || i === 4;
              return (
                <div key={i} className="relative grid place-items-center rounded-[1.2cqw] border border-white/10 bg-white/[0.06]" style={{ width: '9cqw', height: '9cqw' }}>
                  <Factory style={{ width: '45%', height: '45%' }} strokeWidth={1.5} className="text-paper/70" />
                  <motion.span
                    className={`absolute right-[0.9cqw] top-[0.9cqw] rounded-full ${down ? 'bg-accent' : 'bg-[#5FD39A]'}`}
                    style={{ width: '1.1cqw', height: '1.1cqw' }}
                    animate={down ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                  />
                  {down && (
                    <motion.span
                      className="absolute -top-[3.4cqw] font-semibold text-accent"
                      style={{ fontSize: 'clamp(9px, 2.2cqw, 15px)' }}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
                    >
                      ?
                    </motion.span>
                  )}
                </div>
              );
            })}
          </motion.div>

          <div className="absolute right-0 top-0 flex flex-col gap-[1.2cqw]" style={{ width: '46cqw' }}>
            <motion.p
              className="eyebrow text-paper/50"
              style={{ fontSize: 'clamp(7.5px, 1.5cqw, 10.5px)' }}
              initial={false}
              animate={{ opacity: stage === 1 ? 1 : 0 }}
              transition={{ duration: 0.5, delay: stage === 1 ? 0.2 : 0 }}
            >
              {v.reqTitle}
            </motion.p>
            {v.reqs.map((req, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-[1.4cqw] rounded-[1.2cqw] border border-white/10 bg-white/[0.06] backdrop-blur"
                style={{ padding: '1.3cqw 1.8cqw' }}
                initial={false}
                animate={stage === 1 ? { opacity: 1, x: '0%', filter: 'blur(0px)' } : { opacity: 0, x: '16%', filter: 'blur(8px)' }}
                transition={{ duration: 0.8, ease, delay: stage === 1 ? 0.3 + i * 0.12 : 0 }}
              >
                <motion.span
                  className="grid shrink-0 place-items-center rounded-full bg-accent text-white"
                  style={{ width: '2.6cqw', height: '2.6cqw' }}
                  initial={false}
                  animate={{ scale: stage === 1 ? 1 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18, delay: stage === 1 ? 0.6 + i * 0.12 : 0 }}
                >
                  <Check style={{ width: '62%', height: '62%' }} strokeWidth={3} />
                </motion.span>
                <span className="text-paper/85" style={{ fontSize: 'clamp(8.5px, 1.85cqw, 13px)' }}>
                  {req}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 2: i calcoli */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex flex-col overflow-hidden rounded-[1.6cqw] border border-white/10 bg-[#1A1A1E] shadow-[0_3cqw_8cqw_-2cqw_rgba(0,0,0,0.7)]"
          initial={false}
          animate={layer(stage === 2)}
          transition={layerTransition}
        >
          <div className="flex shrink-0 items-center gap-[1cqw] border-b border-white/10" style={{ padding: '1.4cqw 2cqw' }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((col) => (
              <span key={col} className="rounded-full" style={{ width: '1.3cqw', height: '1.3cqw', background: col, opacity: 0.85 }} />
            ))}
            <span className="ml-[1.4cqw] font-mono text-paper/55" style={{ fontSize: 'clamp(7px, 1.6cqw, 11px)' }}>
              sizing.ts
            </span>
          </div>
          <div className="relative flex-1 overflow-hidden" style={{ padding: '2cqw 2.4cqw' }}>
            {stage >= 2 && <Code code={code} play={stage === 2} />}
          </div>
        </motion.div>

        {/* 3: l'architettura, con i dati che scorrono */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex flex-col justify-center"
          initial={false}
          animate={layer(stage === 3, stage === 4)}
          transition={layerTransition}
        >
          <div className="flex items-start px-[1cqw]">
            {CHAINS.medium.map((k, i) => (
              <div key={k} className="contents">
                {i > 0 && (
                  <motion.div
                    className="flex flex-1 self-start"
                    initial={false}
                    animate={{ opacity: stage >= 3 ? 1 : 0, scaleX: stage >= 3 ? 1 : 0 }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.6, ease, delay: stage === 3 ? 0.35 + i * 0.25 : 0 }}
                  >
                    <Flow delay={i * 0.3} />
                  </motion.div>
                )}
                <motion.div
                  initial={false}
                  animate={stage >= 3 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 14, scale: 0.9 }}
                  transition={{ duration: 0.7, ease, delay: stage === 3 ? 0.15 + i * 0.25 : 0 }}
                  style={{ width: '17cqw' }}
                >
                  <ArchNode k={k} />
                </motion.div>
              </div>
            ))}
          </div>
          <motion.div
            className="mx-auto mt-[4cqw] flex flex-wrap justify-center gap-[1.4cqw] font-mono text-paper/60"
            style={{ fontSize: 'clamp(7px, 1.55cqw, 11px)' }}
            initial={false}
            animate={{ opacity: stage === 3 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: stage === 3 ? 1.4 : 0 }}
          >
            {[c.resultDay, c.resultStorage, c.resultBand].map((line) => (
              <span key={line} className="rounded-full border border-white/10 bg-white/[0.05]" style={{ padding: '0.5em 0.9em' }}>
                {line.replace(/^\/\/ → /, '')}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* lampo quando nasce lo strumento */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-[30%] bg-gradient-to-r from-transparent via-white/25 to-transparent"
          initial={false}
          animate={stage === 4 ? { left: ['-30%', '110%'], opacity: [0, 1, 0] } : { left: '-30%', opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />

        {/* 4: lo strumento */}
        <motion.div
          className={`absolute inset-y-0 left-1/2 ${stage === 4 ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{ width: '82cqw', marginLeft: '-41cqw' }}
          initial={false}
          animate={stage === 4 ? { opacity: 1, y: '0%', scale: 1, filter: 'blur(0px)' } : { opacity: 0, y: '8%', scale: 0.9, filter: 'blur(12px)' }}
          transition={stage === 4 ? { type: 'spring', stiffness: 170, damping: 22, delay: 0.25 } : { duration: 0.4 }}
        >
          <SizingApp live={stage === 4} />
        </motion.div>
      </div>
    </div>
  );
}
