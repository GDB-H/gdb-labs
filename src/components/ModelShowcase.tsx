import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useT } from '../i18n';
import { prefersReducedMotion } from '../lib/scroll';
import type { Showcase, ShowcaseKind } from '../three/showcase';
import { SectionLabel, ease } from './ui';

const KINDS: ShowcaseKind[] = ['proto', 'game'];

/**
 * Oggetto 3D che ruota mentre si scorre e attraversa le fasi della modellazione.
 * three.js viene caricato solo quando la sezione si avvicina allo schermo.
 */
export default function ModelShowcase() {
  const { showcase } = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<Showcase | null>(null);
  const [kind, setKind] = useState<ShowcaseKind>('proto');
  const [phase, setPhase] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const state = useRef({ kind, phase });
  state.current = { kind, phase };

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    api.current?.setProgress(p);
    setPhase(Math.min(showcase.phases.length - 1, Math.floor(p * showcase.phases.length * 0.999)));
  });

  useEffect(() => {
    api.current?.setPhase(phase);
  }, [phase]);
  useEffect(() => {
    api.current?.setKind(kind);
  }, [kind]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    let instance: Showcase | null = null;
    let cancelled = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || instance) return;
        io.disconnect();
        import('../three/showcase')
          .then(({ createShowcase }) => {
            if (cancelled) return;
            instance = createShowcase(canvas, { reducedMotion: prefersReducedMotion() });
            instance.setKind(state.current.kind);
            instance.setPhase(state.current.phase);
            instance.setProgress(scrollYProgress.get());
            api.current = instance;
            setReady(true);
          })
          .catch(() => setFailed(true));
      },
      { rootMargin: '120% 0px' },
    );
    io.observe(section);

    return () => {
      cancelled = true;
      io.disconnect();
      instance?.dispose();
      api.current = null;
    };
  }, [scrollYProgress]);

  const object = showcase.objects[kind];
  const dark = kind === 'game' && phase === showcase.phases.length - 1;

  return (
    <section id="modello" ref={sectionRef} className="relative h-[460vh]">
      <div
        className={`sticky top-0 h-[100svh] overflow-hidden transition-colors duration-700 ${dark ? 'bg-ink text-paper' : 'bg-paper text-ink'}`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-700 [background:radial-gradient(ellipse_55%_50%_at_50%_55%,rgba(255,255,255,0.75),transparent_72%)]"
          style={{ opacity: dark ? 0 : 1 }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-700 [background:radial-gradient(ellipse_45%_45%_at_50%_55%,rgba(238,84,32,0.22),transparent_70%)]"
          style={{ opacity: dark ? 1 : 0 }}
        />

        <motion.canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1 }}
          aria-label={`${showcase.model}: ${object.name}, ${showcase.phaseWord} ${showcase.phases[phase]}`}
          role="img"
        />
        {failed && (
          <p className="absolute inset-0 grid place-items-center text-sm text-muted">{showcase.failed}</p>
        )}

        <div className="container-x pointer-events-none relative flex h-full flex-col justify-between pb-6 pt-24 md:pb-10 md:pt-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <SectionLabel index="03" dark={dark}>
                {showcase.label}
              </SectionLabel>
              <h2 className="mt-5 text-[clamp(2rem,4.2vw,4rem)] font-medium leading-[0.98] tracking-[-0.04em]">
                {showcase.title[0]}
                <br />
                <em className="accent-serif">{showcase.title[1]}</em>
              </h2>
            </div>
            <div
              role="tablist"
              aria-label={showcase.objectLabel}
              className={`pointer-events-auto inline-flex self-start rounded-full border p-1 backdrop-blur ${dark ? 'border-line-dark bg-ink/40' : 'border-line bg-paper/60'}`}
            >
              {KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={kind === k}
                  onClick={() => setKind(k)}
                  className="relative whitespace-nowrap rounded-full px-4 py-2 text-[0.9rem]"
                >
                  {kind === k && (
                    <motion.span
                      layoutId="model-kind"
                      className={`absolute inset-0 rounded-full ${dark ? 'bg-paper' : 'bg-ink'}`}
                      transition={{ duration: 0.5, ease }}
                    />
                  )}
                  <span
                    className={`relative transition-colors duration-300 ${
                      kind === k ? (dark ? 'text-ink' : 'text-paper') : dark ? 'text-paper/70' : 'text-ink/60'
                    }`}
                  >
                    {showcase.objects[k].tab}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid items-end gap-6 md:grid-cols-12">
            <div className="md:col-span-5">
              <motion.div key={kind + phase} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
                <p className="text-sm text-accent">
                  <span className="tabular-nums">0{phase + 1}</span> — {showcase.phases[phase]}
                </p>
                <p className={`mt-2 max-w-sm text-lg leading-snug ${dark ? 'text-paper/85' : 'text-ink/80'}`}>{object.notes[phase]}</p>
              </motion.div>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <p className={`mb-3 text-right text-[0.82rem] ${dark ? 'text-paper/55' : 'text-muted'}`}>{object.name}</p>
              <div className="grid grid-cols-5 gap-2">
                {showcase.phases.map((name, i) => (
                  <div key={name} className="text-[0.72rem] sm:text-[0.8rem]">
                    <span className={`block h-[2px] rounded-full ${i <= phase ? 'bg-accent' : dark ? 'bg-paper/15' : 'bg-ink/10'} transition-colors duration-500`} />
                    <span
                      className={`mt-2 block truncate transition-colors duration-500 ${
                        i === phase ? (dark ? 'text-paper' : 'text-ink') : dark ? 'text-paper/40' : 'text-ink/35'
                      }`}
                    >
                      {name}
                    </span>
                  </div>
                ))}
              </div>
              <div className={`mt-4 h-px overflow-hidden ${dark ? 'bg-paper/10' : 'bg-ink/10'}`}>
                <motion.div className="h-full origin-left bg-current opacity-40" style={{ scaleX: bar }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
