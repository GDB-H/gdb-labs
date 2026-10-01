import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/scroll';

const INK = [18, 18, 20];
const ACCENT = [238, 84, 32];
const GAP = 26;
const RADIUS = 170;

/**
 * Griglia di punti su canvas: un'onda lenta la attraversa e i punti
 * vicini al puntatore si allontanano e si accendono di arancio.
 */
export default function DotField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let dots: { x: number; y: number }[] = [];
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, strength: 0, target: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const cols = Math.ceil(w / GAP) + 1;
      const rows = Math.ceil(h / GAP) + 1;
      const ox = (w - (cols - 1) * GAP) / 2;
      const oy = (h - (rows - 1) * GAP) / 2;
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) dots.push({ x: ox + i * GAP, y: oy + j * GAP });
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (inside && pointer.target === 0) {
        pointer.x = x;
        pointer.y = y;
      }
      pointer.tx = x;
      pointer.ty = y;
      pointer.target = inside ? 1 : 0;
    };
    const onLeave = () => (pointer.target = 0);

    let raf = 0;
    let running = false;
    const start = performance.now();

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      pointer.strength += (pointer.target - pointer.strength) * 0.08;

      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const dist = Math.hypot(dx, dy) || 1;
        let k = dist < RADIUS ? 1 - dist / RADIUS : 0;
        k = k * k * (3 - 2 * k) * pointer.strength;

        const wave = reduce ? 0.5 : (Math.sin(d.x * 0.011 + d.y * 0.007 - t * 1.1) + 1) / 2;
        const push = k * 12;
        const x = d.x + (dx / dist) * push;
        const y = d.y + (dy / dist) * push;
        const r = 0.9 + wave * 0.35 + k * 1.7;
        const alpha = 0.15 + wave * 0.13 + k * 0.7;

        const c0 = Math.round(INK[0] + (ACCENT[0] - INK[0]) * k);
        const c1 = Math.round(INK[1] + (ACCENT[1] - INK[1]) * k);
        const c2 = Math.round(INK[2] + (ACCENT[2] - INK[2]) * k);
        ctx.fillStyle = `rgba(${c0},${c1},${c2},${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const play = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()));
    io.observe(canvas);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none h-full w-full ${className}`} />;
}
