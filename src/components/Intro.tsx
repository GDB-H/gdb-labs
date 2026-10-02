import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogoMark, ease } from './ui';

export const INTRO_DURATION = 1.9;

/** Breve apertura con il marchio animato, una sola volta per sessione. */
export default function Intro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(onDone, INTRO_DURATION * 1000);
    return () => window.clearTimeout(id);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] grid cursor-pointer place-items-center bg-ink text-paper"
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.9, ease }}
      onClick={onDone}
      aria-hidden
    >
      <div className="flex flex-col items-center gap-7">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease }}>
          <LogoMark bare draw speed={2.4} className="h-28 w-28 md:h-36 md:w-36" />
        </motion.div>
        <motion.p
          className="eyebrow text-paper/55"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.5 }}
        >
          GDB Labs — Laboratorio
        </motion.p>
      </div>
    </motion.div>
  );
}
