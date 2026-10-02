import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { about } from '../content';
import { FadeUp, SectionLabel } from './ui';

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <span className="relative mr-[0.24em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

/** Frase che si "accende" parola per parola mentre la si scorre. */
function ScrollStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const words = text.split(' ');

  return (
    <p ref={ref} className="text-[clamp(1.9rem,4.4vw,4.1rem)] font-medium leading-[1.08] tracking-[-0.035em]">
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  );
}

export default function About() {
  return (
    <section id="chi-sono" className="container-x py-28 md:py-40">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel index="05">Chi sono</SectionLabel>
        </div>
        <div className="md:col-span-9">
          <ScrollStatement text={about.statement} />
        </div>
      </div>

      <div className="mt-20 grid gap-16 md:mt-32 md:grid-cols-12 md:gap-6">
        <div className="space-y-6 text-lg leading-relaxed text-ink/75 md:col-span-6 md:col-start-4 lg:col-span-5 lg:col-start-4">
          {about.bio.map((p, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <p className={i === 0 ? 'text-xl text-ink md:text-[1.4rem] md:leading-snug' : ''}>{p}</p>
            </FadeUp>
          ))}
        </div>

        <div className="md:col-span-3 md:col-start-10">
          <FadeUp>
            <p className="eyebrow mb-6 text-muted">Principi</p>
          </FadeUp>
          <ul className="space-y-8 border-t border-line pt-8">
            {about.principles.map((pr, i) => (
              <li key={pr.title}>
                <FadeUp delay={i * 0.08}>
                  <h3 className="flex items-baseline gap-3 font-medium">
                    <span className="text-sm tabular-nums text-accent">0{i + 1}</span>
                    {pr.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink/65">{pr.text}</p>
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
