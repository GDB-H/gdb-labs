import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { dictionaries, LOCALES, type Content, type Locale } from './content';
import { prefersReducedMotion } from './lib/scroll';
import { transmute } from './lib/transmute';

const STORAGE_KEY = 'gdb-locale';

type I18n = {
  locale: Locale;
  t: Content;
  switchLocale: (next: Locale, origin?: { x: number; y: number }) => void;
};

const I18nContext = createContext<I18n | null>(null);

function initialLocale(): Locale {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl && (LOCALES as string[]).includes(fromUrl)) return fromUrl as Locale;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (LOCALES as string[]).includes(saved)) return saved as Locale;
  } catch {
    /* storage non disponibile */
  }
  return navigator.language?.toLowerCase().startsWith('it') ? 'it' : 'en';
}

// ----------------------------------------------------------------
// Il sigillo: cerchio, quadrato, triangolo e cerchio interno
// (la "quadratura del cerchio" alchemica) che si disegna e si espande
// ----------------------------------------------------------------
const SIGIL = [
  'M0 -44 A44 44 0 1 1 -0.01 -44',
  'M-31.1 -31.1 H31.1 V31.1 H-31.1 Z',
  'M0 -31.1 L31.1 31.1 L-31.1 31.1 Z',
  'M0 -7.3 A19.2 19.2 0 1 1 -0.01 -7.3',
];

function Sigil({ x, y }: { x: number; y: number }) {
  const reach = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) * 2;
  return (
    <motion.div className="pointer-events-none fixed inset-0 z-[95]" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {[0, 0.14].map((delay, i) => (
        <motion.span
          key={delay}
          className="absolute rounded-full border border-accent"
          style={{
            left: x - reach / 2,
            top: y - reach / 2,
            width: reach,
            height: reach,
            boxShadow: i === 0 ? '0 0 60px 6px rgba(238,84,32,0.16), inset 0 0 60px 6px rgba(238,84,32,0.12)' : undefined,
          }}
          initial={{ scale: 0, opacity: i === 0 ? 0.7 : 0.35 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 1.05, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      <motion.svg
        viewBox="-50 -50 100 100"
        className="absolute h-24 w-24 overflow-visible"
        style={{ left: x - 48, top: y - 48 }}
        initial={{ rotate: -30, scale: 0.6, opacity: 0 }}
        animate={{ rotate: 60, scale: [0.6, 1, 1.6], opacity: [0, 1, 0] }}
        transition={{ duration: 1.25, times: [0, 0.35, 1], ease: 'easeOut' }}
      >
        {SIGIL.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="#EE5420"
            strokeWidth={1.4}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeInOut' }}
          />
        ))}
        <circle r="2.4" fill="#EE5420" cy="11.9" />
      </motion.svg>
    </motion.div>
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [fx, setFx] = useState<{ x: number; y: number; id: number } | null>(null);
  const busy = useRef(false);
  const t = dictionaries[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* storage non disponibile */
    }
  }, [locale, t]);

  const switchLocale = useCallback(
    (next: Locale, origin?: { x: number; y: number }) => {
      if (next === locale || busy.current) return;
      if (prefersReducedMotion()) {
        setLocale(next);
        return;
      }
      busy.current = true;
      const from = origin ?? { x: window.innerWidth - 60, y: 40 };
      setFx({ ...from, id: Date.now() });
      transmute(from, () => flushSync(() => setLocale(next))).finally(() => {
        busy.current = false;
        setFx(null);
      });
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, t, switchLocale }}>
      {children}
      <AnimatePresence>{fx && <Sigil key={fx.id} x={fx.x} y={fx.y} />}</AnimatePresence>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n va usato dentro I18nProvider');
  return ctx;
}

export const useT = () => useI18n().t;
