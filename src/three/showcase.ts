import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/*
 * Vetrina 3D: due oggetti costruiti in codice (una staffa meccanica e una
 * lanterna da videogioco) che attraversano le fasi della modellazione:
 * concept → wireframe → low poly → mesh → definitivo.
 * Lo scroll decide rotazione e fase; il passaggio tra fasi è una dissolvenza.
 */

export type ShowcaseKind = 'proto' | 'game';
export type Showcase = {
  setKind: (kind: ShowcaseKind) => void;
  setPhase: (phase: number) => void;
  setProgress: (progress: number) => void;
  dispose: () => void;
};

const PHASES = 5;
const PAPER = 0xf3f1ec;
const ACCENT = 0xee5420;
const PENCIL = 0x2a2a30;

type Role = 'body' | 'frame' | 'glass' | 'candle' | 'flame';
type Part = {
  make: (seg: number, detail: boolean) => THREE.BufferGeometry;
  role: Role;
  pos?: [number, number, number];
  rot?: [number, number, number];
};

// ----------------------------------------------------------------
// Modelli
// ----------------------------------------------------------------
function bracketParts(): Part[] {
  const P = (x: number, y: number): [number, number] => [(x - 200) / 40, -(y - 129) / 40];
  const outline: [number, number][] = [
    [110, 62],
    [150, 62],
    [150, 112],
    [204, 156],
    [290, 156],
    [290, 196],
    [110, 196],
  ];
  const holes: [number, number][] = [
    [130, 87],
    [130, 176],
    [250, 176],
  ];

  const make = (seg: number, detail: boolean) => {
    const shape = new THREE.Shape();
    outline.forEach(([x, y], i) => (i === 0 ? shape.moveTo(...P(x, y)) : shape.lineTo(...P(x, y))));
    shape.closePath();
    holes.forEach(([x, y]) => {
      const h = new THREE.Path();
      const [cx, cy] = P(x, y);
      h.absarc(cx, cy, 0.22, 0, Math.PI * 2, true);
      shape.holes.push(h);
    });
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: 0.85,
      curveSegments: seg,
      bevelEnabled: detail,
      bevelThickness: 0.07,
      bevelSize: 0.06,
      bevelSegments: detail ? 4 : 0,
    });
    g.center();
    return g;
  };

  return [{ make, role: 'body' }];
}

function lanternParts(): Part[] {
  const cyl = (rt: number, rb: number, h: number) => (seg: number) => new THREE.CylinderGeometry(rt, rb, h, seg);
  const parts: Part[] = [
    { make: cyl(0.78, 0.9, 0.24), role: 'frame', pos: [0, -1.38, 0] },
    { make: cyl(0.68, 0.72, 0.1), role: 'frame', pos: [0, -1.21, 0] },
    { make: (seg) => new THREE.CylinderGeometry(0.56, 0.56, 1.5, seg, 1, true), role: 'glass', pos: [0, -0.41, 0] },
    { make: cyl(0.74, 0.7, 0.12), role: 'frame', pos: [0, 0.42, 0] },
    { make: (seg) => new THREE.ConeGeometry(0.84, 0.72, seg), role: 'frame', pos: [0, 0.84, 0] },
    { make: cyl(0.11, 0.16, 0.26), role: 'frame', pos: [0, 1.3, 0] },
    {
      make: (seg) => new THREE.TorusGeometry(0.26, 0.045, Math.max(3, Math.round(seg / 4)), seg),
      role: 'frame',
      pos: [0, 1.68, 0],
    },
    { make: cyl(0.14, 0.15, 0.45), role: 'candle', pos: [0, -0.95, 0] },
    {
      make: (seg) => {
        const g = new THREE.SphereGeometry(0.13, seg, Math.max(4, Math.round(seg / 2)));
        g.scale(1, 1.7, 1);
        return g;
      },
      role: 'flame',
      pos: [0, -0.55, 0],
    },
  ];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    parts.push({
      make: (seg) => new THREE.CylinderGeometry(0.045, 0.045, 1.62, Math.max(4, Math.round(seg / 4))),
      role: 'frame',
      pos: [Math.cos(a) * 0.62, -0.41, Math.sin(a) * 0.62],
    });
  }
  return parts;
}

// ----------------------------------------------------------------
// Utilità
// ----------------------------------------------------------------
function radialTexture(inner: string, outer: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function setOpacity(obj: THREE.Object3D, k: number) {
  obj.visible = k > 0.004;
  if (!obj.visible) return;
  obj.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
    if (!m) return;
    (Array.isArray(m) ? m : [m]).forEach((mat) => {
      if (mat.userData.base === undefined) mat.userData.base = mat.opacity;
      mat.opacity = mat.userData.base * k;
    });
  });
}

const approach = (v: number, target: number, rate: number) => v + (target - v) * Math.min(1, rate);

// ----------------------------------------------------------------
// Scena
// ----------------------------------------------------------------
export function createShowcase(canvas: HTMLCanvasElement, options: { reducedMotion?: boolean } = {}): Showcase {
  const trash: { dispose: () => void }[] = [];
  const keep = <T extends { dispose: () => void }>(x: T) => {
    trash.push(x);
    return x;
  };

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.6, 11);
  // si guarda leggermente sopra l'oggetto: resta un po' sotto il centro, lontano dal titolo
  camera.lookAt(0, 0.45, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d0c4, 0.8));
  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  key.position.set(4, 6, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffd2b0, 0.9);
  rim.position.set(-5, 2, -4);
  scene.add(rim);

  // ogni oggetto ha i suoi materiali, così le dissolvenze non si disturbano
  const transparent = { transparent: true };
  const makeMaterials = () => ({
    pencil: keep(new THREE.LineBasicMaterial({ color: PENCIL, opacity: 0.85, ...transparent })),
    pencilEcho: keep(new THREE.LineBasicMaterial({ color: PENCIL, opacity: 0.28, ...transparent })),
    guide: keep(new THREE.LineDashedMaterial({ color: PENCIL, dashSize: 0.14, gapSize: 0.1, opacity: 0.28, ...transparent })),
    wire: keep(new THREE.LineBasicMaterial({ color: ACCENT, opacity: 0.9, ...transparent })),
    occluder: keep(
      new THREE.MeshBasicMaterial({ color: PAPER, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, ...transparent }),
    ),
    clayFlat: keep(new THREE.MeshStandardMaterial({ color: 0xd9d2c5, roughness: 0.92, flatShading: true, ...transparent })),
    clay: keep(new THREE.MeshStandardMaterial({ color: 0xc8c2b6, roughness: 0.5, ...transparent })),
    topology: keep(new THREE.LineBasicMaterial({ color: PENCIL, opacity: 0.09, ...transparent })),
    plastic: keep(
      new THREE.MeshPhysicalMaterial({ color: ACCENT, roughness: 0.4, clearcoat: 0.35, clearcoatRoughness: 0.25, ...transparent }),
    ),
    metal: keep(new THREE.MeshStandardMaterial({ color: 0x2b211a, metalness: 0.85, roughness: 0.32, ...transparent })),
    glass: keep(
      new THREE.MeshStandardMaterial({
        color: 0xffe2b8,
        emissive: 0xff9a3c,
        emissiveIntensity: 0.55,
        roughness: 0.1,
        opacity: 0.42,
        depthWrite: false,
        side: THREE.DoubleSide,
        ...transparent,
      }),
    ),
    wax: keep(new THREE.MeshStandardMaterial({ color: 0xf2e7d2, roughness: 0.7, emissive: 0x7a4a20, emissiveIntensity: 0.3, ...transparent })),
    flame: keep(new THREE.MeshBasicMaterial({ color: 0xffd27a, ...transparent })),
  });
  type Materials = ReturnType<typeof makeMaterials>;

  const finalMaterial = (M: Materials, kind: ShowcaseKind, role: Role) => {
    if (kind === 'proto') return M.plastic;
    if (role === 'glass') return M.glass;
    if (role === 'candle') return M.wax;
    if (role === 'flame') return M.flame;
    return M.metal;
  };

  const place = <T extends THREE.Object3D>(obj: T, p: Part) => {
    if (p.pos) obj.position.set(...p.pos);
    if (p.rot) obj.rotation.set(...p.rot);
    return obj;
  };

  function buildPhases(kind: ShowcaseKind, parts: Part[], M: Materials) {
    const phases = Array.from({ length: PHASES }, () => new THREE.Group());
    const [concept, wire, low, mesh, final] = phases;

    parts.forEach((p) => {
      // concept: solo i contorni, ripassati due volte come a matita
      // poche facce: ogni spigolo diventa una linea di costruzione, come in uno schizzo
      const edges = keep(new THREE.EdgesGeometry(keep(p.make(10, false)), 15));
      concept.add(place(new THREE.LineSegments(edges, M.pencil), p));
      const echo = place(new THREE.LineSegments(edges, M.pencilEcho), p);
      echo.position.add(new THREE.Vector3(0.025, 0.018, 0));
      echo.scale.setScalar(1.01);
      concept.add(echo);

      // wireframe con linee nascoste
      const wg = keep(p.make(12, false));
      wire.add(place(new THREE.Mesh(wg, M.occluder), p));
      wire.add(place(new THREE.LineSegments(keep(new THREE.WireframeGeometry(wg)), M.wire), p));

      low.add(place(new THREE.Mesh(keep(p.make(6, false)), M.clayFlat), p));

      const hg = keep(p.make(40, true));
      mesh.add(place(new THREE.Mesh(hg, M.clay), p));
      mesh.add(place(new THREE.LineSegments(keep(new THREE.WireframeGeometry(hg)), M.topology), p));

      final.add(place(new THREE.Mesh(hg, finalMaterial(M, kind, p.role)), p));
    });

    // linee di costruzione tratteggiate attorno allo schizzo
    const box = new THREE.Box3().setFromObject(concept);
    const size = box.getSize(new THREE.Vector3()).multiplyScalar(1.12);
    const guide = new THREE.LineSegments(keep(new THREE.EdgesGeometry(keep(new THREE.BoxGeometry(size.x, size.y, size.z)))), M.guide);
    guide.position.copy(box.getCenter(new THREE.Vector3()));
    guide.computeLineDistances();
    concept.add(guide);

    return phases;
  }

  // staffa
  const protoRig = new THREE.Group();
  const protoPhases = buildPhases('proto', bracketParts(), makeMaterials());
  protoPhases.forEach((g) => protoRig.add(g));
  protoRig.scale.setScalar(0.62);
  scene.add(protoRig);

  // lanterna + luce calda nella fase finale
  const gameRig = new THREE.Group();
  const gameMaterials = makeMaterials();
  const gamePhases = buildPhases('game', lanternParts(), gameMaterials);
  gameRig.scale.setScalar(0.82);
  gamePhases.forEach((g) => gameRig.add(g));
  const flameLight = new THREE.PointLight(0xffb45e, 0, 7, 1.6);
  flameLight.position.set(0, -0.5, 0);
  gamePhases[4].add(flameLight);
  const glowTex = keep(radialTexture('rgba(255,190,110,0.9)', 'rgba(255,150,60,0)'));
  const glow = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })));
  glow.position.set(0, -0.5, 0);
  glow.scale.setScalar(3.4);
  gamePhases[4].add(glow);
  const flameMesh = gamePhases[4].children.find((c) => (c as THREE.Mesh).material === gameMaterials.flame);
  scene.add(gameRig);

  // ombra morbida sotto gli oggetti
  const shadowTex = keep(radialTexture('rgba(18,18,20,0.35)', 'rgba(18,18,20,0)'));
  const makeShadow = (y: number, w: number) => {
    const s = new THREE.Mesh(keep(new THREE.PlaneGeometry(w, w * 0.45)), keep(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })));
    s.rotation.x = -Math.PI / 2;
    s.position.y = y;
    scene.add(s);
    return s;
  };
  const protoShadow = makeShadow(-1.55, 3.6);
  const gameShadow = makeShadow(-1.4, 2.8);

  // ----------------------------------------------------------------
  // stato e animazione
  // ----------------------------------------------------------------
  let kind: ShowcaseKind = 'proto';
  let phase = 0;
  let targetRot = 0;
  let rot = 0;
  const kindWeight = { proto: 1, game: 0 };
  const phaseWeight = { proto: [1, 0, 0, 0, 0], game: [1, 0, 0, 0, 0] };

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    // allontana la camera sugli schermi stretti per non tagliare l'oggetto
    camera.position.z = Math.max(11, 4.4 / (2 * Math.tan(halfFov) * camera.aspect));
    camera.updateProjectionMatrix();
  };

  const clock = new THREE.Clock();
  let elapsed = 0;
  let raf = 0;
  let running = false;

  const frame = () => {
    const dt = Math.min(0.05, clock.getDelta());
    elapsed += options.reducedMotion ? 0 : dt;

    rot = approach(rot, targetRot, dt * 6);
    (['proto', 'game'] as const).forEach((k) => {
      kindWeight[k] = approach(kindWeight[k], k === kind ? 1 : 0, dt * 5);
      phaseWeight[k] = phaseWeight[k].map((w, i) => approach(w, i === phase ? 1 : 0, dt * 5));
    });

    protoPhases.forEach((g, i) => setOpacity(g, kindWeight.proto * phaseWeight.proto[i]));
    gamePhases.forEach((g, i) => setOpacity(g, kindWeight.game * phaseWeight.game[i]));
    protoRig.visible = kindWeight.proto > 0.004;
    gameRig.visible = kindWeight.game > 0.004;
    setOpacity(protoShadow, kindWeight.proto);
    setOpacity(gameShadow, kindWeight.game * (1 - phaseWeight.game[4] * 0.6));

    const idle = elapsed * 0.06;
    protoRig.rotation.set(0.42 + Math.sin(elapsed * 0.6) * 0.03, rot + idle, 0.05);
    gameRig.rotation.set(0.06, rot * 0.9 + idle, 0);
    gameRig.position.y = 0.05 + Math.sin(elapsed * 1.1) * 0.05;

    const lit = kindWeight.game * phaseWeight.game[4];
    const flicker = 1 + Math.sin(elapsed * 13) * 0.08 + Math.sin(elapsed * 7.3) * 0.06;
    flameLight.intensity = 9 * lit * flicker;
    glow.material.opacity = 0.85 * lit * flicker;
    if (flameMesh) flameMesh.scale.set(1, flicker, 1);

    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  };

  const play = () => {
    if (running) return;
    running = true;
    clock.getDelta();
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

  return {
    setKind: (k) => (kind = k),
    setPhase: (p) => (phase = Math.max(0, Math.min(PHASES - 1, p))),
    setProgress: (p) => (targetRot = -0.7 + p * Math.PI * 2.3),
    dispose: () => {
      pause();
      ro.disconnect();
      io.disconnect();
      trash.forEach((t) => t.dispose());
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
