import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/scroll';

/*
 * "Lanterna": un piccolo platformer immaginario che attraversa le fasi di
 * sviluppo di un videogioco. Lo stesso livello viene disegnato come
 * schizzo, greybox, alpha, beta e demo; il passaggio tra fasi è una dissolvenza.
 */

const W = 800;
const H = 600;

type Ctx = CanvasRenderingContext2D;
type Pose = { x: number; y: number; air: boolean; fade: number; dir: number };

const ISLANDS = [
  { x: 80, y: 400, w: 190 },
  { x: 330, y: 335, w: 140 },
  { x: 530, y: 390, w: 190 },
];
const ORBS = [
  { x: 205, y: 360 },
  { x: 405, y: 292 },
  { x: 630, y: 350 },
];
const MOON = { x: 600, y: 140, r: 58 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);

function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry(7);
const STARS = Array.from({ length: 90 }, () => ({ x: rnd() * W, y: rnd() * 330, r: rnd() * 1.4 + 0.3, p: rnd() * Math.PI * 2 }));
const FLIES = Array.from({ length: 34 }, () => ({ x: rnd() * W, y: 230 + rnd() * 260, p: rnd() * Math.PI * 2, s: 0.4 + rnd() * 0.8 }));

// percorso del personaggio: corsa, salto, corsa, salto, corsa, pausa
const SEGMENTS: { d: number; at: (u: number) => Omit<Pose, 'fade'> & { fade?: number } }[] = [
  { d: 1.3, at: (u) => ({ x: lerp(115, 250, u), y: 400, air: false, dir: 1 }) },
  { d: 0.62, at: (u) => ({ x: lerp(250, 362, u), y: lerp(400, 335, u) - Math.sin(Math.PI * u) * 75, air: true, dir: 1 }) },
  { d: 0.9, at: (u) => ({ x: lerp(362, 442, u), y: 335, air: false, dir: 1 }) },
  { d: 0.62, at: (u) => ({ x: lerp(442, 565, u), y: lerp(335, 390, u) - Math.sin(Math.PI * u) * 62, air: true, dir: 1 }) },
  { d: 1.3, at: (u) => ({ x: lerp(565, 690, u), y: 390, air: false, dir: 1 }) },
  { d: 0.9, at: (u) => ({ x: 690, y: 390, air: false, dir: 1, fade: u }) },
];
const LOOP = SEGMENTS.reduce((a, s) => a + s.d, 0);

function poseAt(t: number): Pose {
  let local = t % LOOP;
  for (const seg of SEGMENTS) {
    if (local <= seg.d) {
      const p = seg.at(local / seg.d);
      return { fade: 0, ...p };
    }
    local -= seg.d;
  }
  return { x: 115, y: 400, air: false, dir: 1, fade: 0 };
}

const orbTaken = (pose: Pose, orb: { x: number }) => pose.fade > 0 || pose.x > orb.x - 6;

// ----------------------------------------------------------------
// Primitive di disegno
// ----------------------------------------------------------------
function islandPath(ctx: Ctx, i: (typeof ISLANDS)[number], depth = 70) {
  ctx.beginPath();
  ctx.moveTo(i.x, i.y);
  ctx.lineTo(i.x + i.w, i.y);
  ctx.lineTo(i.x + i.w - 12, i.y + 26);
  ctx.lineTo(i.x + i.w * 0.62, i.y + depth);
  ctx.lineTo(i.x + i.w * 0.4, i.y + depth - 12);
  ctx.lineTo(i.x + 14, i.y + 24);
  ctx.closePath();
}

function mountains(ctx: Ctx, base: number, amp: number, seed: number, offset: number) {
  ctx.beginPath();
  ctx.moveTo(-20, H);
  for (let x = -20; x <= W + 20; x += 20) {
    const xx = x + offset;
    const y = base - (Math.sin(xx * 0.008 + seed) * 0.6 + Math.sin(xx * 0.019 + seed * 2) * 0.3 + Math.sin(xx * 0.043 + seed) * 0.1) * amp;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W + 20, H);
  ctx.closePath();
}

/** Linea "a matita": tremola leggermente come un'animazione a mano. */
function pencil(ctx: Ctx, pts: [number, number][], jitter: number, seed: number, close = false) {
  const r = mulberry(seed);
  for (let pass = 0; pass < 2; pass++) {
    ctx.beginPath();
    pts.forEach(([x, y], i) => {
      const jx = (r() - 0.5) * jitter;
      const jy = (r() - 0.5) * jitter;
      if (i === 0) ctx.moveTo(x + jx, y + jy);
      else ctx.lineTo(x + jx, y + jy);
    });
    if (close) ctx.closePath();
    ctx.stroke();
  }
}

function circlePts(cx: number, cy: number, r: number, n = 28): [number, number][] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
}

function glow(ctx: Ctx, x: number, y: number, r: number, color: string, alpha: number) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color.replace('A', String(alpha)));
  g.addColorStop(1, color.replace('A', '0'));
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function hero(ctx: Ctx, pose: Pose, t: number, body: string, lantern: string | null) {
  const step = pose.air ? 0 : Math.sin(t * 16) * 4;
  ctx.save();
  ctx.translate(pose.x, pose.y);
  ctx.globalAlpha *= 1 - pose.fade;
  ctx.fillStyle = body;
  // mantello
  ctx.beginPath();
  ctx.moveTo(-9, -6);
  ctx.quadraticCurveTo(-11, -26, 0, -30);
  ctx.quadraticCurveTo(11, -26, 9, -6);
  ctx.closePath();
  ctx.fill();
  // testa con cappuccio a punta
  ctx.beginPath();
  ctx.moveTo(-7, -28);
  ctx.quadraticCurveTo(0, -46, 6, -40);
  ctx.quadraticCurveTo(9, -32, 6, -27);
  ctx.closePath();
  ctx.fill();
  // gambe
  ctx.fillRect(-5 + step * 0.5, -7, 3.5, 7);
  ctx.fillRect(2 - step * 0.5, -7, 3.5, 7);
  if (lantern) {
    ctx.strokeStyle = body;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(8, -20);
    ctx.lineTo(15, -16);
    ctx.stroke();
    ctx.fillStyle = lantern;
    ctx.fillRect(12, -16, 7, 9);
  }
  ctx.restore();
}

// ----------------------------------------------------------------
// Fase 0 — Idea: schizzo su carta
// ----------------------------------------------------------------
function drawIdea(ctx: Ctx, t: number, pose: Pose) {
  ctx.fillStyle = '#F2EEE5';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(70,110,200,0.14)';
  ctx.lineWidth = 1;
  for (let y = 60; y < H; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(220,70,60,0.35)';
  ctx.beginPath();
  ctx.moveTo(70, 0);
  ctx.lineTo(70, H);
  ctx.stroke();

  const seed = Math.floor(t * 7);
  ctx.strokeStyle = 'rgba(30,30,36,0.72)';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  pencil(ctx, circlePts(MOON.x, MOON.y, MOON.r), 2.4, seed);
  const ridge: [number, number][] = [];
  for (let x = 80; x <= 780; x += 35) ridge.push([x, 300 - Math.abs(Math.sin(x * 0.012)) * 70 - (x % 70 === 10 ? 12 : 0)]);
  pencil(ctx, ridge, 2, seed + 1);
  ISLANDS.forEach((i, k) => {
    pencil(
      ctx,
      [
        [i.x, i.y],
        [i.x + i.w, i.y],
        [i.x + i.w * 0.62, i.y + 66],
        [i.x + 12, i.y + 22],
      ],
      2.4,
      seed + 3 + k,
      true,
    );
  });

  // omino stilizzato con lanterna
  const p = { x: 180, y: 400 };
  pencil(ctx, circlePts(p.x, p.y - 34, 6, 12), 1.2, seed + 9);
  pencil(ctx, [[p.x, p.y - 28], [p.x, p.y - 12]], 1, seed + 10);
  pencil(ctx, [[p.x - 7, p.y], [p.x, p.y - 12], [p.x + 7, p.y]], 1, seed + 11);
  pencil(ctx, [[p.x, p.y - 22], [p.x + 12, p.y - 18]], 1, seed + 12);
  pencil(ctx, circlePts(p.x + 15, p.y - 14, 4, 10), 1, seed + 13);

  // freccia del salto
  ctx.setLineDash([5, 6]);
  pencil(ctx, Array.from({ length: 12 }, (_, i) => {
    const u = i / 11;
    return [lerp(200, 380, u), lerp(380, 318, u) - Math.sin(Math.PI * u) * 70] as [number, number];
  }), 1.2, seed + 14);
  ctx.setLineDash([]);

  ctx.fillStyle = 'rgba(30,30,36,0.78)';
  ctx.font = 'italic 30px "Instrument Serif", Georgia, serif';
  ctx.fillText('Lanterna', 92, 92);
  ctx.font = 'italic 21px "Instrument Serif", Georgia, serif';
  ctx.fillText('— idea di gioco', 196, 92);
  ctx.fillText('salto!', 270, 262);
  ctx.fillText('luna enorme, luce calda', 470, 236);
  ctx.fillText('lei porta la luce', 122, 470);
  pencil(ctx, [[92, 102], [190, 99]], 1.4, seed + 15);

  // la "mano" che sta ancora disegnando
  const hx = 520 + Math.sin(t * 1.3) * 60;
  const hy = 470 + Math.cos(t * 1.7) * 14;
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(-0.6);
  ctx.fillStyle = '#E9B44C';
  ctx.fillRect(-4, -60, 8, 52);
  ctx.fillStyle = '#F4D8A8';
  ctx.beginPath();
  ctx.moveTo(-4, -8);
  ctx.lineTo(4, -8);
  ctx.lineTo(0, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ----------------------------------------------------------------
// Fase 1 — Pre-alpha: greybox, collider e texture mancanti
// ----------------------------------------------------------------
function drawPreAlpha(ctx: Ctx, t: number, pose: Pose) {
  ctx.fillStyle = '#2A2A2F';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // luna con la classica texture mancante
  ctx.save();
  ctx.beginPath();
  ctx.arc(MOON.x, MOON.y, MOON.r, 0, Math.PI * 2);
  ctx.clip();
  for (let x = MOON.x - MOON.r; x < MOON.x + MOON.r; x += 16)
    for (let y = MOON.y - MOON.r; y < MOON.y + MOON.r; y += 16) {
      ctx.fillStyle = ((x + y) / 16) % 2 === 0 ? '#FF00D4' : '#111';
      ctx.fillRect(x, y, 16, 16);
    }
  ctx.restore();

  ctx.fillStyle = '#3A3A40';
  ctx.fillRect(0, 430, W, H - 430);

  ISLANDS.forEach((i) => {
    ctx.fillStyle = '#6E6E76';
    ctx.fillRect(i.x, i.y, i.w, 34);
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = '#3DDC84';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(i.x - 2, i.y - 2, i.w + 4, 38);
    ctx.setLineDash([]);
  });

  ORBS.forEach((o) => {
    if (orbTaken(pose, o)) return;
    ctx.strokeStyle = '#9A9AA2';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(o.x, o.y, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(o.x, o.y, 9, 3.5, 0, 0, Math.PI * 2);
    ctx.stroke();
  });

  // giocatore = capsula + vettore velocità
  ctx.save();
  ctx.globalAlpha *= 1 - pose.fade;
  ctx.fillStyle = '#C9C9CF';
  ctx.beginPath();
  ctx.roundRect(pose.x - 9, pose.y - 36, 18, 36, 9);
  ctx.fill();
  ctx.strokeStyle = '#3DDC84';
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(pose.x - 11, pose.y - 38, 22, 38);
  ctx.setLineDash([]);
  ctx.strokeStyle = '#FFD23F';
  ctx.lineWidth = 2;
  const vy = pose.air ? -20 : 0;
  ctx.beginPath();
  ctx.moveTo(pose.x, pose.y - 18);
  ctx.lineTo(pose.x + 34, pose.y - 18 + vy);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = 'rgba(230,230,235,0.85)';
  ctx.font = '15px ui-monospace, SFMono-Regular, Menlo, monospace';
  const lines = [
    'PRE-ALPHA  build 0.1.3',
    `fps 60   dt ${(16.6 + Math.sin(t * 9) * 0.4).toFixed(1)}ms`,
    `player.pos (${pose.x.toFixed(0)}, ${pose.y.toFixed(0)})`,
    `grounded ${pose.air ? 'false' : 'true'}   colliders ON`,
  ];
  lines.forEach((l, i) => ctx.fillText(l, 28, 42 + i * 22));
  ctx.fillStyle = '#FF00D4';
  ctx.fillText('MISSING_TEXTURE: moon.png', 470, 232);
}

// ----------------------------------------------------------------
// Fase 2 — Alpha: colori piatti, regole complete
// ----------------------------------------------------------------
function drawAlpha(ctx: Ctx, t: number, pose: Pose) {
  ctx.fillStyle = '#1B2240';
  ctx.fillRect(0, 0, W, H);
  STARS.forEach((s) => {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillRect(s.x, s.y, 1.6, 1.6);
  });
  ctx.fillStyle = '#E9E3CF';
  ctx.beginPath();
  ctx.arc(MOON.x, MOON.y, MOON.r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#28305A';
  mountains(ctx, 330, 90, 1, 0);
  ctx.fill();
  ctx.fillStyle = '#323C6B';
  mountains(ctx, 420, 60, 4, 0);
  ctx.fill();

  ISLANDS.forEach((i) => {
    ctx.fillStyle = '#6A5545';
    islandPath(ctx, i);
    ctx.fill();
    ctx.fillStyle = '#5F9A62';
    ctx.fillRect(i.x, i.y - 6, i.w, 10);
  });

  ORBS.forEach((o) => {
    if (orbTaken(pose, o)) return;
    ctx.fillStyle = '#FFC857';
    ctx.beginPath();
    ctx.arc(o.x, o.y + Math.sin(t * 3 + o.x) * 3, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  hero(ctx, pose, t, '#F3F1EC', '#FFC857');

  ctx.fillStyle = '#EE5420';
  for (let i = 0; i < 3; i++) ctx.fillRect(28 + i * 26, 32, 18, 16);
  ctx.fillStyle = '#F3F1EC';
  ctx.font = '600 18px "Inter Tight", system-ui, sans-serif';
  const taken = ORBS.filter((o) => orbTaken(pose, o)).length;
  ctx.fillText(`${taken}/3`, 112, 47);
  ctx.font = '600 13px "Inter Tight", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(243,241,236,0.55)';
  ctx.fillText('ALPHA 0.4', 700, 46);
}

// ----------------------------------------------------------------
// Fase 3/4 — Beta e Demo: luce, profondità, atmosfera
// ----------------------------------------------------------------
function drawNight(ctx: Ctx, t: number, pose: Pose, demo: boolean) {
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#0A0F26');
  sky.addColorStop(0.45, '#251E4A');
  sky.addColorStop(0.72, '#7A3449');
  sky.addColorStop(1, '#E2683C');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  STARS.forEach((s) => {
    const a = 0.35 + Math.sin(t * 2 + s.p) * 0.3;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // luna con alone
  glow(ctx, MOON.x, MOON.y, MOON.r * (demo ? 4.2 : 3.4), 'rgba(255,226,180,A)', demo ? 0.38 + Math.sin(t * 1.2) * 0.05 : 0.3);
  ctx.fillStyle = '#FFF1D6';
  ctx.beginPath();
  ctx.arc(MOON.x, MOON.y, MOON.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(214,190,150,0.35)';
  [[-18, -12, 11], [16, 8, 8], [-6, 22, 6]].forEach(([dx, dy, r]) => {
    ctx.beginPath();
    ctx.arc(MOON.x + dx, MOON.y + dy, r, 0, Math.PI * 2);
    ctx.fill();
  });

  if (demo) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) {
      const a = -2.2 + i * 0.28 + Math.sin(t * 0.3 + i) * 0.03;
      ctx.fillStyle = 'rgba(255,214,160,0.035)';
      ctx.beginPath();
      ctx.moveTo(MOON.x, MOON.y);
      ctx.lineTo(MOON.x + Math.cos(a) * 900, MOON.y - Math.sin(a) * 900);
      ctx.lineTo(MOON.x + Math.cos(a + 0.1) * 900, MOON.y - Math.sin(a + 0.1) * 900);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  const drift = t * 6;
  const m1 = ctx.createLinearGradient(0, 230, 0, 420);
  m1.addColorStop(0, '#3B2A5C');
  m1.addColorStop(1, '#1C1838');
  ctx.fillStyle = m1;
  mountains(ctx, 345, 100, 1, drift * 0.3);
  ctx.fill();
  const m2 = ctx.createLinearGradient(0, 330, 0, 470);
  m2.addColorStop(0, '#221A40');
  m2.addColorStop(1, '#120F26');
  ctx.fillStyle = m2;
  mountains(ctx, 430, 70, 4, drift * 0.7);
  ctx.fill();

  // nebbia
  const fog = ctx.createLinearGradient(0, 400, 0, 520);
  fog.addColorStop(0, 'rgba(226,104,60,0)');
  fog.addColorStop(1, 'rgba(240,150,110,0.28)');
  ctx.fillStyle = fog;
  ctx.fillRect(0, 400, W, 200);

  ISLANDS.forEach((i, k) => {
    const bob = Math.sin(t * 0.9 + k * 1.7) * 3;
    const isl = { ...i, y: i.y + bob };
    const rock = ctx.createLinearGradient(0, isl.y, 0, isl.y + 80);
    rock.addColorStop(0, '#2C2340');
    rock.addColorStop(1, '#120E22');
    ctx.fillStyle = rock;
    islandPath(ctx, isl, 84);
    ctx.fill();
    ctx.fillStyle = '#3E5A56';
    ctx.fillRect(isl.x, isl.y - 5, isl.w, 8);
    ctx.strokeStyle = 'rgba(62,90,86,0.8)';
    ctx.lineWidth = 1.2;
    for (let v = 0; v < 4; v++) {
      const vx = isl.x + 20 + v * (isl.w / 4);
      ctx.beginPath();
      ctx.moveTo(vx, isl.y + 2);
      ctx.quadraticCurveTo(vx + Math.sin(t + v) * 4, isl.y + 22, vx + 2, isl.y + 30 + (v % 2) * 12);
      ctx.stroke();
    }
  });

  ORBS.forEach((o) => {
    if (orbTaken(pose, o)) return;
    const y = o.y + Math.sin(t * 2.4 + o.x) * 4;
    glow(ctx, o.x, y, 28, 'rgba(255,200,110,A)', 0.55);
    ctx.fillStyle = '#FFE2A8';
    ctx.beginPath();
    ctx.arc(o.x, y, 4.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // la luce della lanterna
  if (pose.fade < 1) glow(ctx, pose.x + 15, pose.y - 12, demo ? 120 : 95, 'rgba(255,180,90,A)', 0.42 * (1 - pose.fade));
  hero(ctx, pose, t, '#0B0918', '#FFD38A');

  const flies = demo ? FLIES : FLIES.slice(0, 14);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  flies.forEach((f) => {
    const x = (f.x + Math.sin(t * f.s + f.p) * 30 + t * 8 * f.s) % W;
    const y = f.y + Math.cos(t * f.s * 1.3 + f.p) * 18;
    const a = 0.5 + Math.sin(t * 3 + f.p) * 0.5;
    glow(ctx, x, y, 10, 'rgba(255,214,120,A)', 0.5 * a);
  });
  ctx.restore();

  if (!demo) {
    ctx.fillStyle = 'rgba(255,236,210,0.85)';
    ctx.font = '600 15px "Inter Tight", system-ui, sans-serif';
    const taken = ORBS.filter((o) => orbTaken(pose, o)).length;
    ctx.fillText(`✦ ${taken} / 3`, 30, 46);
    ctx.fillStyle = 'rgba(255,236,210,0.5)';
    ctx.font = '600 13px "Inter Tight", system-ui, sans-serif';
    ctx.fillText('BETA 0.9', 708, 46);
  }

  // vignettatura
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.9);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, `rgba(0,0,0,${demo ? 0.55 : 0.35})`);
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);

  if (demo) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(255,190,120,0.8)';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#FFF3E0';
    ctx.font = 'italic 92px "Instrument Serif", Georgia, serif';
    ctx.fillText('Lanterna', W / 2, 200);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,243,224,0.7)';
    ctx.font = '500 15px "Inter Tight", system-ui, sans-serif';
    ctx.fillText('D E M O   G I O C A B I L E', W / 2, 236);
    const blink = (Math.sin(t * 3.2) + 1) / 2;
    ctx.fillStyle = `rgba(255,243,224,${0.35 + blink * 0.6})`;
    ctx.font = '600 17px "Inter Tight", system-ui, sans-serif';
    ctx.fillText('PREMI  START', W / 2, 452);
    ctx.restore();
  }
}

const STAGES = [drawIdea, drawPreAlpha, drawAlpha, (c: Ctx, t: number, p: Pose) => drawNight(c, t, p, false), (c: Ctx, t: number, p: Pose) => drawNight(c, t, p, true)];

export default function GameScene({ stage }: { stage: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target = useRef(stage);
  target.current = Math.max(0, Math.min(STAGES.length - 1, stage));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = prefersReducedMotion();

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    let from = target.current;
    let to = target.current;
    let mix = 1;
    let raf = 0;
    let running = false;
    let last = performance.now();
    let clock = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += reduce ? 0 : dt;

      if (target.current !== to) {
        from = mix < 0.5 ? from : to;
        to = target.current;
        mix = 0;
      }
      mix = Math.min(1, mix + dt / 0.7);

      // riempie il riquadro mantenendo le proporzioni della scena (effetto "cover")
      const s = Math.max(w / W, h / H);
      ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * (w - W * s) / 2, dpr * (h - H * s) / 2);
      if (to === 4 && !reduce) {
        // in demo la "camera" respira lentamente
        const z = 1.03 + Math.sin(clock * 0.25) * 0.02;
        ctx.translate(W / 2, H / 2);
        ctx.scale(z, z);
        ctx.translate(-W / 2, -H / 2);
      }

      const pose = poseAt(clock);
      ctx.globalAlpha = 1;
      STAGES[from](ctx, clock, pose);
      if (mix < 1 || from !== to) {
        ctx.globalAlpha = ease(mix);
        STAGES[to](ctx, clock, pose);
        ctx.globalAlpha = 1;
        if (mix >= 1) from = to;
      }
      raf = requestAnimationFrame(frame);
    };

    const play = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : pause()));
    io.observe(canvas);
    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" aria-label="Scena di gioco che evolve dallo schizzo alla demo" role="img" />;
}
