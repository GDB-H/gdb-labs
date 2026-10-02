/*
 * Trasmutazione del testo al cambio lingua.
 *
 * Un "fronte" di simboli alchemici attraversa i testi visibili partendo dal
 * selettore della lingua: davanti al fronte resta la parola vecchia, dietro
 * compare quella nuova, e solo i caratteri sul fronte diventano simboli.
 * React cambia lingua subito; qui si riscrive temporaneamente il valore dei
 * nodi di testo e alla fine ognuno torna esattamente al testo nuovo.
 */

// simboli planetari ed elementali alternati a lettere greche: segni sottili,
// con un ingombro vicino a quello delle lettere, così il testo non "salta"
const GLYPHS = Array.from('☉☽☿♃♄△▽∴ψξλφθΔΩ');

const WAVE = 860; // tempo che il fronte impiega ad attraversare lo schermo (ms)
const LINE_MIN = 230; // anche le parole brevi vengono attraversate, non cambiano tutte insieme
const LINE_MAX = 720; // tempo massimo per attraversare un singolo testo (ms)
const PER_CHAR = 18; // ms per carattere, entro LINE_MIN..LINE_MAX
const BAND = 7; // larghezza del fronte, in caratteri
const GLYPH_LIFE = [34, 210]; // quanto resta simbolo ogni carattere (ms), min..max
const FLICKER = 80; // ogni quanto cambia il simbolo (ms)
const SAFETY = 4200; // in ogni caso, dopo questo tempo si chiude

type Point = { x: number; y: number };
type Entry = {
  node: Text;
  from: string;
  to: string;
  start: number; // ms dall'inizio, quando il fronte raggiunge il testo
  sweep: number; // ms per attraversarlo
  life: number; // ms per cui ogni carattere resta simbolo
  written: string;
};

const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'TITLE']);

function visibleTextNodes(): Text[] {
  const out: Text[] = [];
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || SKIP.has(parent.tagName) || !node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
      if (parent.closest('[data-no-transmute]')) return NodeFilter.FILTER_REJECT;
      const r = parent.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw || r.width === 0) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  while (walker.nextNode()) out.push(walker.currentNode as Text);
  return out;
}

function glyph(i: number, now: number) {
  return GLYPHS[(i * 7 + ((i * i) % 11) + Math.floor(now / FLICKER) * 3) % GLYPHS.length];
}

function compose(e: Entry, elapsed: number, now: number) {
  const len = Math.max(e.from.length, e.to.length);
  let s = '';
  for (let i = 0; i < len; i++) {
    const local = elapsed - e.start - (len > 1 ? (i / (len - 1)) * e.sweep : 0);
    if (local < 0) s += e.from[i] ?? '';
    else if (local < e.life) {
      const a = e.from[i];
      const b = e.to[i];
      // gli spazi restano spazi; dopo ogni simbolo uno spazio invisibile permette di andare a capo
      s += (a === undefined || a === ' ') && (b === undefined || b === ' ') ? b ?? '' : glyph(i, now) + '\u200B';
    } else s += e.to[i] ?? '';
  }
  return s;
}

export function transmute(origin: Point, swap: () => void): Promise<void> {
  return new Promise((resolve) => {
    const reach = Math.hypot(Math.max(origin.x, window.innerWidth - origin.x), Math.max(origin.y, window.innerHeight - origin.y));

    // testo prima del cambio
    const before = new Map<Text, string>();
    for (const n of visibleTextNodes()) before.set(n, n.nodeValue ?? '');

    swap();

    // testo dopo il cambio: si anima solo ciò che è cambiato
    const entries: Entry[] = [];
    for (const node of visibleTextNodes()) {
      const to = node.nodeValue ?? '';
      const from = before.get(node) ?? '';
      if (from === to) continue;
      const r = node.parentElement!.getBoundingClientRect();
      const dist = Math.hypot(Math.max(r.left, Math.min(origin.x, r.right)) - origin.x, r.top + r.height / 2 - origin.y);
      const len = Math.max(from.length, to.length);
      const sweep = Math.max(LINE_MIN, Math.min(LINE_MAX, len * PER_CHAR));
      const e: Entry = {
        node,
        from,
        to,
        start: (dist / reach) * WAVE,
        sweep,
        life: Math.max(GLYPH_LIFE[0], Math.min(GLYPH_LIFE[1], (sweep / Math.max(1, len - 1)) * BAND)),
        written: from,
      };
      node.nodeValue = from; // il primo fotogramma mostra ancora il testo vecchio
      entries.push(e);
    }

    document.documentElement.classList.add('is-transmuting');
    const t0 = performance.now();
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      for (const e of entries) {
        if (e.node.isConnected && e.node.nodeValue === e.written) e.node.nodeValue = e.to;
      }
      document.documentElement.classList.remove('is-transmuting');
      resolve();
    };

    const frame = (now: number) => {
      if (finished) return;
      const elapsed = now - t0;
      let pending = false;
      for (const e of entries) {
        // se React ha riscritto il nodo nel frattempo, lo si lascia stare
        if (!e.node.isConnected || e.node.nodeValue !== e.written) continue;
        if (elapsed < e.start + e.sweep + e.life) pending = true;
        const next = compose(e, elapsed, now);
        if (next !== e.written) {
          e.node.nodeValue = next;
          e.written = next;
        }
      }
      if (pending) requestAnimationFrame(frame);
      else finish();
    };

    requestAnimationFrame(frame);
    window.setTimeout(finish, SAFETY);
  });
}
