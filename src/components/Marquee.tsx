import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { useT } from '../i18n';

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** Nastro infinito che accelera e cambia verso seguendo lo scroll. */
function VelocityRow({ children, baseVelocity }: { children: React.ReactNode; baseVelocity: number }) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) direction.current = -1;
    else if (vf > 0) direction.current = 1;
    moveBy += direction.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className="flex shrink-0 flex-nowrap" style={{ x }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function Spark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`mx-6 h-[0.45em] w-[0.45em] shrink-0 md:mx-10 ${className}`} aria-hidden>
      <path d="M12 0 C12.8 7.5 16.5 11.2 24 12 C16.5 12.8 12.8 16.5 12 24 C11.2 16.5 7.5 12.8 0 12 C7.5 11.2 11.2 7.5 12 0Z" fill="currentColor" />
    </svg>
  );
}

export default function Marquee() {
  const { marquee } = useT();
  return (
    <section aria-label={marquee.label} className="select-none overflow-hidden border-y border-line py-8 md:py-12">
      <VelocityRow baseVelocity={-1.6}>
        {marquee.disciplines.map((item) => (
          <span key={item} className="flex items-center text-[clamp(2.2rem,6vw,5.5rem)] font-medium leading-none tracking-[-0.04em]">
            {item}
            <Spark className="text-accent" />
          </span>
        ))}
      </VelocityRow>
      <div className="mt-4 md:mt-6">
        <VelocityRow baseVelocity={1.2}>
          {marquee.stack.map((item) => (
            <span key={item} className="accent-serif flex items-center text-[clamp(1.4rem,3vw,2.6rem)] leading-none text-muted">
              {item}
              <span className="mx-6 h-1.5 w-1.5 rounded-full bg-line md:mx-10" />
            </span>
          ))}
        </VelocityRow>
      </div>
    </section>
  );
}
