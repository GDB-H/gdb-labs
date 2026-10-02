import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useT } from '../i18n';
import { ease } from './ui';

/*
 * "Dalla norma al software": i documenti diventano regole, le regole
 * diventano codice scritto in diretta, il codice si compila in una piccola
 * app vera che il visitatore può usare. Tutte le misure sono in cqw
 * (larghezza del riquadro), così l'insieme scala come un'immagine.
 */

// ----------------------------------------------------------------
// La logica vera, la stessa mostrata nell'editor
// ----------------------------------------------------------------
type Atm = 'G' | 'D';
const ZONES: Record<number, { atm: Atm; cat: number[] }> = {
  0: { atm: 'G', cat: [1] },
  1: { atm: 'G', cat: [1, 2] },
  2: { atm: 'G', cat: [1, 2, 3] },
  20: { atm: 'D', cat: [1] },
  21: { atm: 'D', cat: [1, 2] },
  22: { atm: 'D', cat: [1, 2, 3] },
};
const ZONE_KEYS = [0, 1, 2, 20, 21, 22];
const DEVICES = ['1G', '2G', '3G', '1D', '2D', '3D'];

export function check(zone: number, device: string) {
  const rule = ZONES[zone];
  const cat = Number(device[0]);
  if (device[1] !== rule.atm) return { ok: false, atmMismatch: true, rule };
  return { ok: rule.cat.includes(cat), atmMismatch: false, rule };
}

const modelCode = (comment: string) => `${comment}
const ZONES = {
  0:  { atm: 'G', cat: [1] },
  1:  { atm: 'G', cat: [1, 2] },
  2:  { atm: 'G', cat: [1, 2, 3] },
  20: { atm: 'D', cat: [1] },
  21: { atm: 'D', cat: [1, 2] },
  22: { atm: 'D', cat: [1, 2, 3] },
};`;

const fnCode = (comment: string) => `${comment}
export function check(zone, device) {
  const rule = ZONES[zone];
  const cat = Number(device[0]);
  if (device[1] !== rule.atm) return false;
  return rule.cat.includes(cat);
}`;

const TESTS: [number, string][] = [
  [0, '1G'],
  [1, '3G'],
  [21, '2D'],
  [2, '2D'],
];

// ----------------------------------------------------------------
// Editor: evidenziazione della sintassi e scrittura in diretta
// ----------------------------------------------------------------
const COLORS = {
  comment: '#7D7A73',
  string: '#A9D6A0',
  number: '#F2C46D',
  keyword: '#FF8150',
  fn: '#8CC8FF',
  punct: '#A3A19B',
  plain: '#ECE9E2',
} as const;
type Tok = { text: string; kind: keyof typeof COLORS };

function tokenize(code: string): Tok[] {
  const re = /(\/\/[^\n]*)|('[^']*')|(\b\d+\b)|\b(const|function|export|return|if)\b|([A-Za-z_]\w*)(?=\()|([{}[\]();,.:=!<>]+)/g;
  const out: Tok[] = [];
  let last = 0;
  for (let m = re.exec(code); m; m = re.exec(code)) {
    if (m.index > last) out.push({ text: code.slice(last, m.index), kind: 'plain' });
    const kind: Tok['kind'] = m[1] ? 'comment' : m[2] ? 'string' : m[3] ? 'number' : m[4] ? 'keyword' : m[5] ? 'fn' : 'punct';
    out.push({ text: m[0], kind });
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push({ text: code.slice(last), kind: 'plain' });
  return out;
}

function useTyping(length: number, play: boolean, cps: number, delay = 0) {
  const [count, setCount] = useState(play ? 0 : length);
  useEffect(() => {
    if (!play) {
      setCount(length);
      return;
    }
    setCount(0);
    let raf = 0;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const n = Math.min(length, Math.max(0, Math.floor(((now - t0) / 1000) * cps)));
      setCount(n);
      if (n < length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [length, play, cps, delay]);
  return count;
}

function Code({ code, play, delay = 0, caret = true }: { code: string; play: boolean; delay?: number; caret?: boolean }) {
  const tokens = useMemo(() => tokenize(code), [code]);
  const count = useTyping(code.length, play, 95, delay);
  let left = count;
  const parts = [];
  for (let i = 0; i < tokens.length && left > 0; i++) {
    const piece = tokens[i].text.slice(0, left);
    left -= piece.length;
    parts.push(
      <span key={i} style={{ color: COLORS[tokens[i].kind], fontStyle: tokens[i].kind === 'comment' ? 'italic' : undefined }}>
        {piece}
      </span>,
    );
  }
  const typing = count < code.length;
  return (
    <pre className="m-0 whitespace-pre font-mono" style={{ fontSize: 'clamp(6px, 1.75cqw, 11.5px)', lineHeight: 1.55 }}>
      {parts}
      {caret && (play || typing) && (
        <motion.span
          className="ml-px inline-block align-[-0.15em] bg-accent"
          style={{ width: '0.55em', height: '1.1em' }}
          animate={{ opacity: typing ? 1 : [1, 0, 1] }}
          transition={typing ? { duration: 0 } : { duration: 1, repeat: Infinity }}
        />
      )}
    </pre>
  );
}

// ----------------------------------------------------------------
// L'app finale, usabile dal visitatore
// ----------------------------------------------------------------
function Chip({ on, children, onClick, group, style }: { on: boolean; children: string; onClick: () => void; group: string; style?: CSSProperties }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`relative rounded-full font-medium tabular-nums transition-colors duration-300 ${on ? 'text-paper' : 'text-ink/70 hover:text-ink'}`}
      style={{ padding: '0.55em 0.95em', ...style }}
    >
      {on && <motion.span layoutId={group} className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
      <span className="relative">{children}</span>
    </button>
  );
}

function AtexApp({ live }: { live: boolean }) {
  const v = useT().visuals.consult;
  const [zone, setZone] = useState(1);
  const [device, setDevice] = useState('2G');
  const result = check(zone, device);
  const atmName = (a: Atm) => (a === 'G' ? v.gas : v.dust);
  const allowed = result.rule.cat.map((c) => `${c}${result.rule.atm}`);
  const allowedText = allowed.length > 1 ? `${allowed.slice(0, -1).join(', ')} ${v.or} ${allowed[allowed.length - 1]}` : allowed[0];
  const reason = result.ok
    ? v.reasonOk(device, zone)
    : result.atmMismatch
      ? v.reasonAtm(atmName(device[1] as Atm), zone, atmName(result.rule.atm))
      : v.reasonCat(zone, allowedText);

  const chipFont: CSSProperties = { fontSize: 'clamp(9px, 1.85cqw, 12.5px)' };

  return (
    <div className="atex-card flex h-full flex-col rounded-[2.4cqw] bg-paper text-ink shadow-[0_3cqw_8cqw_-2cqw_rgba(0,0,0,0.6)]" style={{ padding: '3.2cqw' }}>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-[1.2cqw] font-semibold" style={{ fontSize: 'clamp(11px, 2.4cqw, 15px)' }}>
          <span className="relative flex h-[1.4cqw] w-[1.4cqw]">
            {live && <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />}
            <span className="relative h-full w-full rounded-full bg-accent" />
          </span>
          {v.appTitle}
        </p>
        <code className="rounded-full bg-ink/5 font-mono text-ink/60" style={{ fontSize: 'clamp(8px, 1.6cqw, 11px)', padding: '0.35em 0.8em' }}>
          check({zone}, '{device}') → <span className={result.ok ? 'text-[#2F9E6A]' : 'text-accent'}>{String(result.ok)}</span>
        </code>
      </div>

      <p className="atex-label eyebrow mt-[2.6cqw] text-ink/50" style={{ fontSize: 'clamp(8px, 1.5cqw, 10.5px)' }}>
        {v.zone}
      </p>
      <div className="mt-[1cqw] flex flex-wrap gap-[0.8cqw] rounded-full bg-ink/[0.05] p-[0.6cqw]">
        {ZONE_KEYS.map((z) => (
          <Chip key={z} on={zone === z} onClick={() => setZone(z)} group="atex-zone" style={chipFont}>
            {String(z)}
          </Chip>
        ))}
      </div>

      <p className="atex-label eyebrow mt-[2.2cqw] text-ink/50" style={{ fontSize: 'clamp(8px, 1.5cqw, 10.5px)' }}>
        {v.device}
      </p>
      <div className="mt-[1cqw] flex flex-wrap gap-[0.8cqw] rounded-full bg-ink/[0.05] p-[0.6cqw]">
        {DEVICES.map((d) => (
          <Chip key={d} on={device === d} onClick={() => setDevice(d)} group="atex-device" style={chipFont}>
            {d}
          </Chip>
        ))}
      </div>

      <motion.div
        key={`${zone}-${device}`}
        className="atex-result mt-auto flex items-center gap-[2cqw] rounded-[1.8cqw] border"
        style={{
          padding: '2cqw 2.4cqw',
          borderColor: result.ok ? 'rgba(47,158,106,0.35)' : 'rgba(238,84,32,0.4)',
          background: result.ok ? 'rgba(47,158,106,0.09)' : 'rgba(238,84,32,0.08)',
        }}
        initial={{ scale: 0.96, opacity: 0.4 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      >
        <span
          className="grid shrink-0 place-items-center rounded-full font-bold text-white"
          style={{ width: '5cqw', height: '5cqw', fontSize: 'clamp(10px, 2.4cqw, 16px)', background: result.ok ? '#2F9E6A' : '#EE5420' }}
        >
          {result.ok ? '✓' : '✕'}
        </span>
        <span className="min-w-0">
          <span className="block font-semibold" style={{ fontSize: 'clamp(11px, 2.4cqw, 16px)' }}>
            {result.ok ? v.ok : v.ko}
          </span>
          <span className="block leading-snug text-ink/65" style={{ fontSize: 'clamp(9px, 1.8cqw, 12.5px)' }}>
            {reason}
          </span>
        </span>
      </motion.div>
      <p className="atex-disclaimer mt-[1.4cqw] text-ink/40" style={{ fontSize: 'clamp(7.5px, 1.35cqw, 10px)' }}>
        {v.disclaimer}
      </p>
    </div>
  );
}

// ----------------------------------------------------------------
// Il visual a fasi
// ----------------------------------------------------------------
const layer = (on: boolean, dim = false) => ({
  opacity: on ? 1 : dim ? 0.16 : 0,
  scale: on ? 1 : dim ? 0.9 : 0.95,
  filter: on ? 'blur(0px)' : dim ? 'blur(3px)' : 'blur(10px)',
});
const layerTransition = { duration: 0.8, ease };

export function ConsultEvolution({ stage }: { stage: number }) {
  const v = useT().visuals.consult;
  const model = modelCode(v.modelComment);
  const fn = fnCode(v.fnComment);
  const fnTypingMs = (fn.length / 95) * 1000;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#131316] text-paper" style={{ containerType: 'inline-size' }}>
      {/* nei riquadri stretti (telefono) l'app diventa più compatta */}
      <style>{`@container (max-width: 460px) {
        .atex-card { padding: 2.2cqw 2.6cqw !important; }
        .atex-label { margin-top: 1.2cqw !important; }
        .atex-result { margin-top: 1.6cqw !important; padding: 1.4cqw 2cqw !important; }
        .atex-disclaimer { display: none; }
      }`}</style>
      {/* trama di fondo */}
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
        animate={{ opacity: stage === 4 ? 1 : 0.35, scale: stage === 4 ? 1.15 : 1 }}
        transition={{ duration: 1.2, ease }}
      />

      <div className="absolute inset-x-[4.5%] bottom-[17%] top-[5%]">
        {/* 0–1: documenti, poi regole */}
        <motion.div className="pointer-events-none absolute inset-0" initial={false} animate={layer(stage <= 1)} transition={layerTransition}>
          {v.docs.map((title, i) => {
            const fan = [
              { x: '-78%', rotate: -7, y: '6%' },
              { x: '0%', rotate: 0, y: '0%' },
              { x: '78%', rotate: 6, y: '6%' },
            ][i];
            const stacked = { x: `${-112 + i * 6}%`, rotate: -4 + i * 3, y: `${i * 4}%` };
            return (
              <motion.div
                key={i}
                className="absolute left-1/2 top-[6%] rounded-[1.2cqw] bg-paper text-ink shadow-[0_2cqw_5cqw_-1cqw_rgba(0,0,0,0.6)]"
                style={{ width: '27cqw', height: '36cqw', marginLeft: '-13.5cqw', padding: '2cqw' }}
                initial={false}
                animate={stage === 0 ? { ...fan, scale: 1, opacity: 1 } : { ...stacked, scale: 0.78, opacity: 0.55 }}
                transition={{ duration: 0.9, ease, delay: stage === 0 ? 0 : i * 0.05 }}
              >
                <p className="font-semibold" style={{ fontSize: 'clamp(6px, 1.45cqw, 10px)' }}>
                  {title}
                </p>
                <div className="mt-[1.6cqw] space-y-[1.1cqw]">
                  {Array.from({ length: 9 }).map((_, l) => {
                    const highlighted = (i + l) % 4 === 1;
                    return (
                      <div key={l} className="relative h-[0.7cqw] rounded-full bg-ink/15" style={{ width: `${62 + ((l * 37 + i * 11) % 34)}%` }}>
                        {highlighted && (
                          <motion.div
                            className="absolute -inset-y-[0.45cqw] left-0 rounded-sm bg-accent/35"
                            initial={false}
                            animate={{ width: stage <= 1 ? '100%' : '0%' }}
                            transition={{ duration: 0.6, delay: 0.25 + l * 0.08 + i * 0.12, ease }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

          <div className="absolute right-0 top-[8%] flex flex-col gap-[1.6cqw]" style={{ width: '50cqw' }}>
            {v.rules.map(([zone, cat], i) => (
              <motion.div
                key={zone}
                className="flex items-center justify-between rounded-[1.4cqw] border border-white/10 bg-white/[0.06] backdrop-blur"
                style={{ padding: '2cqw 2.4cqw' }}
                initial={false}
                animate={stage === 1 ? { opacity: 1, x: '0%', filter: 'blur(0px)' } : { opacity: 0, x: '18%', filter: 'blur(8px)' }}
                transition={{ duration: 0.8, ease, delay: stage === 1 ? 0.25 + i * 0.12 : 0 }}
              >
                <span className="text-paper/75" style={{ fontSize: 'clamp(9px, 2cqw, 14px)' }}>
                  {zone}
                </span>
                <span className="font-semibold text-accent" style={{ fontSize: 'clamp(11px, 2.8cqw, 19px)' }}>
                  → {cat}
                </span>
              </motion.div>
            ))}
            <motion.p
              className="text-right text-paper/45"
              style={{ fontSize: 'clamp(8px, 1.6cqw, 11px)' }}
              initial={false}
              animate={{ opacity: stage === 1 ? 1 : 0 }}
              transition={{ duration: 0.6, delay: stage === 1 ? 0.7 : 0 }}
            >
              {v.legend}
            </motion.p>
          </div>
        </motion.div>

        {/* 2–4: editor */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex flex-col overflow-hidden rounded-[1.6cqw] border border-white/10 bg-[#1A1A1E] shadow-[0_3cqw_8cqw_-2cqw_rgba(0,0,0,0.7)]"
          initial={false}
          animate={layer(stage === 2 || stage === 3, stage === 4)}
          transition={layerTransition}
        >
          <div className="flex shrink-0 items-center gap-[1cqw] border-b border-white/10" style={{ padding: '1.4cqw 2cqw' }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
              <span key={c} className="rounded-full" style={{ width: '1.3cqw', height: '1.3cqw', background: c, opacity: 0.85 }} />
            ))}
            <span className="ml-[1.4cqw] font-mono text-paper/55" style={{ fontSize: 'clamp(7px, 1.6cqw, 11px)' }}>
              atex.ts
            </span>
          </div>
          <div className="relative flex-1 overflow-hidden" style={{ padding: '2cqw 2.4cqw' }}>
            {stage >= 2 && <Code code={model} play={stage === 2} caret={stage === 2} />}
            {stage >= 3 && (
              <div style={{ marginTop: '1.4cqw' }}>
                <Code code={fn} play={stage === 3} caret={stage === 3} />
              </div>
            )}

            {/* test che passano uno dopo l'altro */}
            <div className="absolute right-[2.4cqw] top-[2cqw] flex flex-col gap-[0.8cqw] font-mono" style={{ fontSize: 'clamp(6.5px, 1.65cqw, 11px)' }}>
              {TESTS.map(([z, d], i) => {
                const ok = check(z, d).ok;
                return (
                  <motion.div
                    key={`${z}-${d}`}
                    className="flex items-center gap-[1cqw] rounded-[0.8cqw] bg-white/[0.06]"
                    style={{ padding: '0.7cqw 1.2cqw' }}
                    initial={false}
                    animate={stage === 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                    transition={{ duration: 0.5, ease, delay: stage === 3 ? fnTypingMs / 1000 + 0.2 + i * 0.22 : 0 }}
                  >
                    <span className="text-[#5FD39A]">✓</span>
                    <span className="text-paper/80">
                      check({z}, '{d}')
                    </span>
                    <span className={ok ? 'text-[#5FD39A]' : 'text-[#FF8150]'}>{String(ok)}</span>
                  </motion.div>
                );
              })}
              <motion.p
                className="text-right text-[#5FD39A]"
                initial={false}
                animate={{ opacity: stage === 3 ? 1 : 0 }}
                transition={{ duration: 0.5, delay: stage === 3 ? fnTypingMs / 1000 + 1.2 : 0 }}
              >
                {v.tests}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* lampo di "compilazione" quando nasce l'app */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-[30%] bg-gradient-to-r from-transparent via-white/25 to-transparent"
          initial={false}
          animate={stage === 4 ? { left: ['-30%', '110%'], opacity: [0, 1, 0] } : { left: '-30%', opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />

        {/* 4: l'app */}
        <motion.div
          className={`absolute inset-y-[1%] left-1/2 ${stage === 4 ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{ width: '76cqw', marginLeft: '-38cqw' }}
          initial={false}
          animate={
            stage === 4
              ? { opacity: 1, y: '0%', scale: 1, filter: 'blur(0px)' }
              : { opacity: 0, y: '8%', scale: 0.9, filter: 'blur(12px)' }
          }
          transition={stage === 4 ? { type: 'spring', stiffness: 170, damping: 22, delay: 0.25 } : { duration: 0.4 }}
        >
          <AtexApp live={stage === 4} />
        </motion.div>
      </div>
    </div>
  );
}
