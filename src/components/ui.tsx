import { useId, useRef, type ReactNode, type ElementType } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const ease = [0.16, 1, 0.3, 1] as const;

// ----------------------------------------------------------------
// Testo che entra riga per riga da sotto una maschera
// ----------------------------------------------------------------
export function RevealLines({
  lines,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  immediate = false,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em] pr-[0.1em] -mr-[0.1em]">
          <motion.span
            className="block"
            initial={{ y: '110%' }}
            {...(immediate ? { animate: { y: '0%' } } : { whileInView: { y: '0%' }, viewport: { once: true, margin: '0px 0px -12% 0px' } })}
            transition={{ duration: 1.1, ease, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function FadeUp({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

// ----------------------------------------------------------------
// Etichetta di sezione: "01 — Competenze"
// ----------------------------------------------------------------
export function SectionLabel({ index, children, dark = false }: { index: string; children: ReactNode; dark?: boolean }) {
  return (
    <FadeUp className={`flex items-center gap-3 eyebrow ${dark ? 'text-muted-dark' : 'text-muted'}`}>
      <span className="tabular-nums text-accent">{index}</span>
      <span className={`h-px w-8 ${dark ? 'bg-line-dark' : 'bg-line'}`} />
      <span>{children}</span>
    </FadeUp>
  );
}

// ----------------------------------------------------------------
// Elemento "magnetico": segue leggermente il puntatore
// ----------------------------------------------------------------
export function Magnetic({ children, strength = 0.3, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 16, mass: 0.4 });
  const y = useSpring(0, { stiffness: 200, damping: 16, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

// ----------------------------------------------------------------
// Testo che "rotola" in verticale all'hover del gruppo
// ----------------------------------------------------------------
export function RollText({ children }: { children: string }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">{children}</span>
      <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
        {children}
      </span>
    </span>
  );
}

type ButtonVariant = 'ink' | 'paper' | 'accent' | 'ghost' | 'ghost-dark';

const variants: Record<ButtonVariant, string> = {
  ink: 'bg-ink text-paper',
  paper: 'bg-paper text-ink',
  accent: 'bg-accent text-white',
  ghost: 'border border-line text-ink hover:border-ink',
  'ghost-dark': 'border border-line-dark text-paper hover:border-paper',
};

export function Button({
  href,
  onClick,
  type = 'button',
  variant = 'ink',
  children,
  icon = true,
  className = '',
}: {
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: ButtonVariant;
  children: string;
  icon?: boolean;
  className?: string;
}) {
  const cls = `group inline-flex items-center gap-3 whitespace-nowrap rounded-full py-3.5 pl-6 ${icon ? 'pr-3.5' : 'pr-6'} text-[0.95rem] font-medium transition-colors duration-300 ${variants[variant]} ${className}`;
  const inner = (
    <>
      <RollText>{children}</RollText>
      {icon && (
        <span className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-full">
          <span className={`absolute inset-0 rounded-full ${variant === 'ink' ? 'bg-paper' : variant === 'paper' ? 'bg-ink' : variant === 'accent' ? 'bg-white' : 'bg-accent'} scale-0 transition-transform duration-500 ease-out-expo group-hover:scale-100`} />
          <ArrowUpRight
            className={`relative h-4 w-4 transition-all duration-500 ease-out-expo group-hover:rotate-45 ${
              variant === 'ink' ? 'group-hover:text-ink' : variant === 'paper' ? 'group-hover:text-paper' : variant === 'accent' ? 'group-hover:text-accent' : 'group-hover:text-white'
            }`}
            strokeWidth={2}
          />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

// ----------------------------------------------------------------
// Marchio: una sfera arancione orbita attorno alla G su un'ellisse
// inclinata, passando davanti e dietro la lettera
// ----------------------------------------------------------------
const G_PATH = 'M21.66 10.34 A8 8 0 1 0 24 16 H17';

export function LogoMark({
  className = 'h-8 w-8',
  inverted = false,
  bare = false,
  speed = 1,
  draw = false,
}: {
  className?: string;
  inverted?: boolean;
  /** senza il quadrato di fondo (per fondi scuri) */
  bare?: boolean;
  speed?: number;
  /** la G si disegna all'ingresso */
  draw?: boolean;
}) {
  const id = useId().replace(/:/g, '');
  const reduce = useReducedMotion();
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const t = useRef(0);
  const cx = useMotionValue(24.5);
  const cy = useMotionValue(8);
  const r = useMotionValue(2.3);
  const front = useMotionValue(1);
  const back = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    t.current += (delta / 1000) * speedRef.current;
    const a = t.current * 1.4 - 0.9;
    const ex = Math.cos(a) * 12;
    const ey = Math.sin(a) * 4.4;
    const tilt = -0.62;
    cx.set(16 + ex * Math.cos(tilt) - ey * Math.sin(tilt));
    cy.set(16 + ex * Math.sin(tilt) + ey * Math.cos(tilt));
    const depth = Math.sin(a);
    r.set(2.3 + depth * 0.55);
    front.set(depth >= 0 ? 1 : 0);
    back.set(depth < 0 ? 0.75 : 0);
  });

  const ink = '#121214';
  const paper = '#F3F1EC';
  const letter = bare ? (inverted ? ink : paper) : inverted ? ink : paper;

  return (
    <svg viewBox="0 0 32 32" className={`overflow-visible ${className}`} aria-hidden>
      <defs>
        <radialGradient id={`${id}-sphere`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#FFB792" />
          <stop offset="0.5" stopColor="#EE5420" />
          <stop offset="1" stopColor="#A9360D" />
        </radialGradient>
      </defs>
      {!bare && <rect width="32" height="32" rx="8" fill={inverted ? paper : ink} />}
      <ellipse
        cx="16"
        cy="16"
        rx="12"
        ry="4.4"
        transform="rotate(-35.5 16 16)"
        fill="none"
        stroke={letter}
        strokeOpacity="0.16"
        strokeWidth="0.5"
      />
      <motion.circle cx={cx} cy={cy} r={r} fill={`url(#${id}-sphere)`} style={{ opacity: back }} />
      <motion.path
        d={G_PATH}
        fill="none"
        stroke={letter}
        strokeWidth="3"
        strokeLinecap="round"
        initial={draw ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.circle cx={cx} cy={cy} r={r} fill={`url(#${id}-sphere)`} style={{ opacity: front }} />
    </svg>
  );
}
