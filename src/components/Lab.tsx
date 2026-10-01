import { useRef } from 'react';
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { lab, type Bench } from '../content';
import { useMediaQuery } from '../lib/hooks';
import { ProjectVisual } from './ProjectVisuals';
import { FadeUp, RevealLines, SectionLabel, ease } from './ui';

const layout = [
  'md:col-span-7 aspect-[4/3] md:aspect-auto',
  'md:col-span-5 aspect-[4/3] md:aspect-auto',
  'md:col-span-4 aspect-[4/3] md:aspect-auto',
  'md:col-span-4 aspect-[4/3] md:aspect-auto',
  'md:col-span-4 aspect-[4/3] md:aspect-auto',
];

function BenchTile({ bench, index }: { bench: Bench; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  const isPhoto = Boolean(bench.image);

  return (
    <motion.figure
      ref={ref}
      className={`group relative overflow-hidden rounded-[1.4rem] ${isPhoto ? 'bg-ink' : 'border border-line bg-paper-2'} ${layout[index] ?? 'md:col-span-4'}`}
      initial={{ opacity: 0, y: 40, clipPath: 'inset(6% 5% 6% 5% round 1.4rem)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 1.4rem)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease, delay: (index % 3) * 0.08 }}
    >
      {isPhoto ? (
        <>
          <motion.img
            src={bench.image}
            alt={bench.imageAlt ?? ''}
            loading="lazy"
            className="absolute left-0 top-[-8%] h-[116%] w-full object-cover grayscale-[70%] transition-[filter,transform] duration-[1.2s] ease-out-expo group-hover:scale-[1.04] group-hover:grayscale-0"
            style={{ y: imageY }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-x-0 bottom-[30%] top-12 transition-transform md:bottom-[24%] md:top-8 duration-[1.2s] ease-out-expo group-hover:scale-[1.04]">
          <ProjectVisual kind={bench.visual ?? 'dashboard'} />
        </div>
      )}

      <span
        className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[0.78rem] font-medium backdrop-blur ${
          isPhoto ? 'border border-white/20 bg-white/10 text-paper' : 'border border-line bg-paper/80 text-ink'
        }`}
      >
        {bench.label}
      </span>

      <figcaption className={`absolute inset-x-0 bottom-0 p-5 md:p-6 ${isPhoto ? 'text-paper' : 'text-ink'}`}>
        <p className="text-xl font-medium tracking-[-0.02em] md:text-2xl">{bench.title}</p>
        <p className={`mt-1 max-w-sm text-[0.95rem] leading-snug ${isPhoto ? 'text-paper/75' : 'text-ink/60'}`}>{bench.caption}</p>
      </figcaption>
    </motion.figure>
  );
}

/**
 * Apertura in stile "pagina prodotto": la foto del banco parte come una card
 * e, scorrendo, si espande fino a riempire lo schermo; poi compare il titolo.
 */
function LabIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const shrink = useTransform(scrollYProgress, [0, 0.42], [1, 0], { clamp: true });
  const insetY = useTransform(shrink, (v) => v * (isDesktop ? 17 : 24));
  const insetX = useTransform(shrink, (v) => v * (isDesktop ? 22 : 5));
  const radius = useTransform(shrink, (v) => v * 28);
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.3, 1]);
  const shade = useTransform(scrollYProgress, [0.25, 0.55], [0, 0.68]);
  const chrome = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0.4, 0.55], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.4, 0.6], [80, 0]);
  const titleScale = useTransform(scrollYProgress, [0.4, 0.6], [0.92, 1]);
  const introOpacity = useTransform(scrollYProgress, [0.58, 0.7], [0, 1]);
  const introY = useTransform(scrollYProgress, [0.58, 0.72], [30, 0]);

  return (
    <div ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0 overflow-hidden bg-ink" style={{ clipPath }}>
          <motion.img
            src={lab.hero.image}
            alt={lab.hero.alt}
            className="h-full w-full object-cover"
            style={{ scale: imageScale }}
          />
          <motion.div className="absolute inset-0 bg-ink" style={{ opacity: shade }} />
        </motion.div>

        <motion.div className="container-x absolute inset-x-0 top-[9%] md:top-[7%]" style={{ opacity: chrome }}>
          <SectionLabel index="01">Il laboratorio</SectionLabel>
        </motion.div>
        <motion.p
          className="container-x absolute inset-x-0 bottom-[9%] text-center text-[0.95rem] text-ink/60 md:bottom-[7%]"
          style={{ opacity: chrome }}
        >
          {lab.hero.caption}
        </motion.p>

        <div className="container-x absolute inset-0 flex flex-col items-center justify-center text-center text-paper">
          <motion.h2 className="text-display-1 font-medium" style={{ opacity: titleOpacity, y: titleY, scale: titleScale }}>
            Un laboratorio,
            <br />
            <em className="accent-serif">non un’agenzia.</em>
          </motion.h2>
          <motion.p
            className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/80 md:mt-10 md:text-xl"
            style={{ opacity: introOpacity, y: introY }}
          >
            {lab.intro}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export default function Lab() {
  return (
    <section id="laboratorio">
      <LabIntro />

      <div className="container-x pb-28 pt-24 md:pb-40 md:pt-32">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="eyebrow text-muted">I banchi di lavoro</p>
          </div>
          <RevealLines
            className="text-display-3 font-medium md:col-span-9 md:text-[clamp(2rem,4vw,3.6rem)]"
            lines={[
              'Discipline diverse, sullo stesso banco.',
              <>
                <em className="accent-serif">Ognuna rende migliori le altre.</em>
              </>,
            ]}
          />
        </div>

        <div className="mt-14 grid gap-4 md:mt-20 md:auto-rows-[300px] md:grid-cols-12 md:gap-5 lg:auto-rows-[360px]">
          {lab.benches.map((bench, i) => (
            <BenchTile key={bench.label + bench.title} bench={bench} index={i} />
          ))}
        </div>

        <div className="mt-20 grid gap-10 border-t border-line pt-10 md:mt-28 md:grid-cols-3 md:gap-6">
          {lab.verbs.map((verb, i) => (
            <FadeUp key={verb.title} delay={i * 0.08}>
              <p className="text-sm tabular-nums text-accent">0{i + 1}</p>
              <h3 className="mt-3 text-display-3 font-medium">
                <em className="accent-serif">{verb.title}</em>
              </h3>
              <p className="mt-3 max-w-xs leading-relaxed text-ink/65">{verb.text}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
