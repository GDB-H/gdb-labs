import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { capabilities, type Capability } from '../content';
import { useMediaQuery } from '../lib/hooks';
import { RevealLines, SectionLabel } from './ui';

function CapabilityCard({ cap, index, total }: { cap: Capability; index: number; total: number }) {
  return (
    <article className="relative flex w-[84vw] shrink-0 snap-start flex-col overflow-hidden rounded-[1.6rem] border border-line bg-paper-2 p-6 sm:w-[62vw] sm:p-8 md:w-[440px] md:p-9 lg:w-[500px]">
      <span aria-hidden className="accent-serif pointer-events-none absolute -right-2 -top-6 text-[8rem] leading-none text-ink/[0.06] md:text-[10rem]">
        0{index + 1}
      </span>
      <p className="text-sm tabular-nums text-muted">
        <span className="text-accent">0{index + 1}</span> / 0{total}
      </p>
      <h3 className="mt-6 text-[1.8rem] font-medium leading-[1.05] tracking-[-0.03em] md:mt-10 md:text-[2.3rem]">{cap.title}</h3>
      <p className="accent-serif mt-3 text-[1.25rem] leading-snug text-ink/70 md:text-[1.4rem]">{cap.summary}</p>
      <p className="mt-5 text-[0.95rem] leading-relaxed text-ink/75 md:text-base">{cap.description}</p>
      <ul className="mt-6 flex flex-wrap gap-1.5 md:mt-auto md:pt-8">
        {cap.deliverables.map((d) => (
          <li key={d} className="rounded-full bg-paper px-3 py-1.5 text-[0.8rem]">
            {d}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[0.82rem] text-muted">{cap.tools.join(' · ')}</p>
    </article>
  );
}

/**
 * Galleria orizzontale "agganciata": mentre si scorre in verticale la sezione
 * resta ferma e le schede scorrono di lato. Su schermi bassi diventa una
 * normale galleria scorrevole.
 */
export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const pinned = useMediaQuery('(min-height: 680px)');

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const smoothX = useSpring(x, { stiffness: 260, damping: 40, mass: 0.4 });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  const gutter = 'pl-5 pr-5 sm:pl-8 sm:pr-8 lg:pl-[max(3rem,calc((100vw-1440px)/2+3rem))] lg:pr-[max(3rem,calc((100vw-1440px)/2+3rem))]';

  return (
    <section
      id="competenze"
      ref={sectionRef}
      className="relative"
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div className={pinned ? 'sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden py-20' : 'py-28'}>
        <div className="container-x grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-3">
            <SectionLabel index="02">Competenze</SectionLabel>
          </div>
          <div className="md:col-span-6">
            <RevealLines
              className="text-[clamp(2.2rem,4.6vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.04em]"
              lines={[
                'Cinque discipline,',
                <>
                  <em className="accent-serif">un solo metodo.</em>
                </>,
              ]}
            />
          </div>
          <div className="hidden items-center gap-4 md:col-span-3 md:flex md:justify-end">
            <span className="text-sm text-muted">{pinned ? 'Scorri' : 'Trascina'}</span>
            <span className="relative h-px w-28 overflow-hidden bg-line">
              <motion.span className="absolute inset-0 origin-left bg-ink" style={{ scaleX: pinned ? progress : 1 }} />
            </span>
          </div>
        </div>

        <motion.div
          ref={trackRef}
          className={`mt-10 flex gap-4 md:mt-14 md:gap-5 ${gutter} ${pinned ? 'w-max' : 'snap-x snap-mandatory overflow-x-auto pb-4'}`}
          style={pinned ? { x: smoothX } : undefined}
        >
          {capabilities.map((cap, i) => (
            <CapabilityCard key={cap.title} cap={cap} index={i} total={capabilities.length} />
          ))}
          <div className="flex w-[70vw] shrink-0 flex-col justify-center sm:w-[40vw] md:w-[320px]">
            <p className="text-[1.4rem] font-medium leading-snug tracking-[-0.02em] md:text-[1.6rem]">
              Il profilo trasversale è una scelta: vedere il problema per intero porta a soluzioni{' '}
              <em className="accent-serif">più semplici.</em>
            </p>
            <a href="#casi" className="mt-6 inline-flex items-center gap-2 text-[0.95rem] text-accent">
              Guarda come lavoro <span aria-hidden>→</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
