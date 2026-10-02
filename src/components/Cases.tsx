import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useSpring } from 'framer-motion';
import { cases, type CaseStudy } from '../content';
import { scrollToTarget } from '../lib/scroll';
import { PrototypeEvolution, ProcessEvolution, StageFrame } from './CaseVisuals';
import GameScene from './GameScene';
import { FadeUp, RevealLines, SectionLabel, ease } from './ui';

function Step({
  step,
  index,
  last,
  active,
  onActive,
  stepRef,
}: {
  step: CaseStudy['steps'][number];
  index: number;
  last: boolean;
  active: boolean;
  onActive: (i: number) => void;
  stepRef: (el: HTMLLIElement | null) => void;
}) {
  const ref = useRef<HTMLLIElement | null>(null);
  // la fase diventa attiva quando attraversa la fascia centrale dello schermo
  const inBand = useInView(ref, { margin: '-48% 0px -42% 0px' });

  useEffect(() => {
    if (inBand) onActive(index);
  }, [inBand, index, onActive]);

  return (
    <li
      ref={(el) => {
        ref.current = el;
        stepRef(el);
      }}
      className="relative pb-24 pl-10 last:pb-0 md:min-h-[46vh] md:pb-0 md:pl-14"
    >
      <span
        className={`absolute top-[0.55rem] rounded-full border-2 transition-all duration-500 ${
          last ? '-left-[7px] h-[15px] w-[15px]' : '-left-[5px] h-[11px] w-[11px]'
        } ${active || last ? 'border-accent bg-accent' : 'border-muted-dark bg-ink'}`}
      />
      <div
        className={`transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-35'} ${
          last ? 'rounded-2xl border border-accent/40 bg-accent/10 p-6 md:p-8' : ''
        }`}
      >
        <p className={`text-sm tabular-nums transition-colors duration-500 ${active || last ? 'text-accent' : 'text-muted-dark'}`}>
          Fase 0{index + 1}
        </p>
        <h4 className="mt-2 text-[1.7rem] font-medium leading-tight tracking-[-0.03em] md:text-[2.2rem]">
          {last ? <em className="accent-serif">{step.phase}</em> : step.phase}
        </h4>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-paper/70">{step.text}</p>
      </div>
    </li>
  );
}

function CaseVisual({ study, stage, onSelect }: { study: CaseStudy; stage: number; onSelect: (i: number) => void }) {
  return (
    <StageFrame id={study.id} labels={study.steps.map((s) => s.short)} stage={stage} onSelect={onSelect}>
      {study.visual === 'game' && <GameScene stage={stage} />}
      {study.visual === 'prototype' && <PrototypeEvolution stage={stage} />}
      {study.visual === 'process' && <ProcessEvolution stage={stage} image={study.image} />}
    </StageFrame>
  );
}

export default function Cases() {
  const [active, setActive] = useState(0);
  const [stage, setStage] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);
  const stepEls = useRef<(HTMLLIElement | null)[]>([]);
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ['start 55%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const study = cases[active];

  const selectCase = (i: number) => {
    if (i === active) return;
    setActive(i);
    setStage(0);
    // se si è già scesi tra le fasi, si riparte dall'inizio del caso
    if (bodyRef.current && bodyRef.current.getBoundingClientRect().top < 0) scrollToTarget(bodyRef.current, -100);
  };

  const goToStage = (i: number) => {
    const el = stepEls.current[i];
    if (el) scrollToTarget(el, -window.innerHeight * 0.48);
  };

  return (
    <section id="casi" className="relative rounded-[2rem] bg-ink text-paper md:rounded-[3rem]">
      <div className="container-x py-28 md:py-40">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="min-w-0 md:col-span-6">
            <SectionLabel index="04" dark>
              Casi studio
            </SectionLabel>
            <RevealLines
              className="mt-10 text-display-2 font-medium"
              lines={[
                'Come lavora',
                <>
                  <em className="accent-serif">il laboratorio.</em>
                </>,
              ]}
            />
          </div>
          <div className="min-w-0 md:col-span-5 md:col-start-8">
            <FadeUp delay={0.15} className="text-lg leading-relaxed text-paper/65">
              Tre percorsi tipici: un componente fisico, un software su misura, un videogioco. Cambiano gli strumenti, il metodo resta lo
              stesso — capire il problema, sperimentare, arrivare a qualcosa che funziona.
            </FadeUp>
            <FadeUp delay={0.25} className="mt-8">
              <div role="tablist" aria-label="Casi studio" className="inline-flex max-w-full overflow-x-auto rounded-full border border-line-dark p-1">
                {cases.map((c, i) => (
                  <button
                    key={c.id}
                    role="tab"
                    type="button"
                    aria-selected={active === i}
                    onClick={() => selectCase(i)}
                    className="relative shrink-0 whitespace-nowrap rounded-full px-3 py-2.5 text-[0.85rem] sm:px-5 sm:text-[0.95rem]"
                  >
                    {active === i && (
                      <motion.span layoutId="case-tab" className="absolute inset-0 rounded-full bg-paper" transition={{ duration: 0.5, ease }} />
                    )}
                    <span className={`relative transition-colors duration-300 ${active === i ? 'text-ink' : 'text-paper/70 hover:text-paper'}`}>
                      {c.tab}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-dark">Esempi rappresentativi del metodo di lavoro.</p>
            </FadeUp>
          </div>
        </div>

        <div ref={bodyRef} className="mt-16 md:mt-24 md:grid md:grid-cols-12 md:gap-12 lg:gap-16">
          {/* visual fisso: cambia mentre si scorrono le fasi */}
          <div className="sticky top-0 z-10 -mx-5 self-start bg-ink px-5 pb-5 pt-[4.5rem] sm:-mx-8 sm:px-8 md:order-2 md:col-span-7 md:mx-0 md:h-[100svh] md:bg-transparent md:p-0">
            <div className="md:flex md:h-full md:items-center">
              <motion.div
                key={study.id}
                className="mx-auto aspect-[4/3] max-h-[42svh] w-full md:max-h-[72svh]"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease }}
              >
                <CaseVisual study={study} stage={stage} onSelect={goToStage} />
              </motion.div>
            </div>
          </div>

          <div className="mt-8 md:order-1 md:col-span-5 md:mt-0 md:pt-[22vh]">
            <motion.div key={study.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
              <p className="eyebrow text-muted-dark">Caso tipo · {study.tab}</p>
              <h3 className="mt-4 text-display-3 font-medium">{study.title}</h3>
              <p className="mt-3 max-w-md text-lg leading-relaxed text-paper/65">{study.summary}</p>
            </motion.div>

            <ol ref={stepsRef} className="relative mt-16 md:mt-[18vh]">
              <span className="absolute bottom-0 left-0 top-3 w-px bg-line-dark" />
              <motion.span className="absolute bottom-0 left-0 top-3 w-px origin-top bg-accent" style={{ scaleY: fill }} />
              {study.steps.map((step, i) => (
                <Step
                  key={step.phase}
                  step={step}
                  index={i}
                  last={i === study.steps.length - 1}
                  active={stage === i}
                  onActive={setStage}
                  stepRef={(el) => (stepEls.current[i] = el)}
                />
              ))}
            </ol>
            <div className="hidden md:block md:h-[30vh]" />
          </div>
        </div>
      </div>
    </section>
  );
}
