import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { useT } from '../i18n';
import DotField from './DotField';
import { Button, Magnetic, RevealLines, ease } from './ui';

function Rotator({ words, interval = 2600 }: { words: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className="relative inline-flex h-[1.35em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={index}
          className="block whitespace-nowrap"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function RotatingBadge() {
  const t = useT();
  const text = t.hero.badge;
  return (
    <a href="#contatti" aria-label={t.hero.badgeAria} className="group relative block h-40 w-40 shrink-0 xl:h-44 xl:w-44">
      <svg viewBox="0 0 200 200" className="h-full w-full animate-[spin_22s_linear_infinite] text-ink" aria-hidden>
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-current text-[15.5px] font-medium uppercase tracking-[0.22em]">
          <textPath href="#badge-circle" textLength="486" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-[30%] grid place-items-center rounded-full bg-accent text-white transition-transform duration-700 ease-out-expo group-hover:scale-110">
        <ArrowDownRight className="h-6 w-6 transition-transform duration-700 ease-out-expo group-hover:-rotate-45" strokeWidth={1.75} />
      </span>
    </a>
  );
}

export default function Hero({ startDelay = 0 }: { startDelay?: number }) {
  const d = startDelay;
  const { hero } = useT();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const fieldScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden">
      <motion.div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_75%_65%_at_65%_35%,black_25%,transparent_80%)]"
        style={{ scale: fieldScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: d + 0.3 }}
      >
        <DotField />
      </motion.div>

      <motion.div
        className="container-x relative flex min-h-[100svh] flex-col justify-end pb-6 pt-32 md:pb-8"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          className="eyebrow mb-6 flex items-center gap-3 text-muted md:mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: d + 0.1 }}
        >
          <span className="h-px w-8 bg-accent" />
          {hero.eyebrow}
        </motion.p>

        <div className="flex items-end justify-between gap-10">
          <RevealLines
            as="h1"
            immediate
            delay={d + 0.15}
            className="text-display-1 font-medium"
            lines={[
              hero.title[0],
              <>
                {hero.title[1]} <em className="accent-serif">{hero.title[2]}</em>
              </>,
            ]}
          />
          <motion.div
            className="mb-[1vw] hidden lg:block"
            initial={{ opacity: 0, scale: 0.6, rotate: -40 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.4, ease, delay: d + 0.8 }}
          >
            <Magnetic strength={0.2}>
              <RotatingBadge />
            </Magnetic>
          </motion.div>
        </div>

        <div className="mt-10 grid items-end gap-8 md:mt-14 md:grid-cols-12">
          <motion.p
            className="max-w-xl text-[1.08rem] leading-relaxed text-ink/75 md:col-span-7 md:text-[1.2rem] lg:col-span-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: d + 0.55 }}
          >
            {hero.lead}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3 md:col-span-5 md:justify-end lg:col-span-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: d + 0.7 }}
          >
            <Magnetic>
              <Button href="#contatti" variant="ink">
                {hero.ctaPrimary}
              </Button>
            </Magnetic>
            <Button href="#laboratorio" variant="ghost" icon={false}>
              {hero.ctaSecondary}
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 grid grid-cols-2 items-center gap-4 border-t border-line pt-5 text-[0.92rem] md:mt-16 md:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: d + 0.9 }}
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span>{hero.available}</span>
          </div>

          <div className="hidden items-center justify-center gap-2 whitespace-nowrap md:flex">
            <span className="text-muted">{hero.focus}</span>
            <span className="font-medium">
              <Rotator words={hero.rotating} />
            </span>
          </div>

          <a href="#laboratorio" className="group flex items-center justify-end gap-3 text-muted transition-colors hover:text-ink">
            {hero.scroll}
            <span className="relative h-8 w-px overflow-hidden bg-line">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-ink"
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
