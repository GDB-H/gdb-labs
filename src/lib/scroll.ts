import Lenis from 'lenis';

let lenis: Lenis | null = null;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scroll inerziale su tutta la pagina. Disattivato se l'utente preferisce meno movimento. */
export function initSmoothScroll() {
  if (prefersReducedMotion()) return () => {};
  lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: true });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToTarget(target: string | number | HTMLElement, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target + offset });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
}

export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : '';
  if (locked) lenis?.stop();
  else lenis?.start();
}
