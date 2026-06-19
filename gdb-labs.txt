import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Mail, Terminal, Cpu, Code, Gamepad2, Briefcase, Linkedin, Github, MapPin, Palette, Box, ChevronLeft, ArrowRight } from 'lucide-react';

// ==========================================
// 0. MOTORE TEMI
// ==========================================
const themes = {
  neutro: {
    '--bg-main': '#0a0a0a', '--bg-card': '#141414', '--text-main': '#f5f5f5', '--text-muted': '#737373', '--accent': '#ffffff', '--border-color': 'rgba(255, 255, 255, 0.1)', '--cursor-color': '#ffffff'
  },
  luce: {
    '--bg-main': '#fafafa', '--bg-card': '#f0f0f0', '--text-main': '#171717', '--text-muted': '#737373', '--accent': '#000000', '--border-color': 'rgba(0, 0, 0, 0.1)', '--cursor-color': '#000000'
  },
  argilla: {
    '--bg-main': '#e8e4dc', '--bg-card': '#dfdbd3', '--text-main': '#2d2a26', '--text-muted': '#7c766b', '--accent': '#b04b3a', '--border-color': 'rgba(45, 42, 38, 0.15)', '--cursor-color': '#b04b3a'
  },
  cianotipo: {
    '--bg-main': '#0d131a', '--bg-card': '#151c26', '--text-main': '#e2e8f0', '--text-muted': '#64748b', '--accent': '#38bdf8', '--border-color': 'rgba(226, 232, 240, 0.1)', '--cursor-color': '#38bdf8'
  }
};

// ==========================================
// 1. UTILITY & COMPONENTI BASE
// ==========================================
function useOnScreen(options) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
    }, options);
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [options]);
  return [ref, isVisible];
}

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursor = (e) => setPos({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e) => setIsHovering(['A', 'BUTTON', 'g'].includes(e.target.tagName) || e.target.closest('.interactive'));

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[100] mix-blend-difference transition-transform duration-300 ease-out flex items-center justify-center hidden md:flex"
      style={{ 
        transform: `translate3d(${pos.x - 16}px, ${pos.y - 16}px, 0) scale(${isHovering ? 2.5 : 1})`,
        backgroundColor: isHovering ? 'var(--cursor-color)' : 'transparent',
        border: `1px solid var(--cursor-color)`,
        borderWidth: isHovering ? '0px' : '1px'
      }}
    >
      <div className={`w-1 h-1 bg-[var(--cursor-color)] rounded-full transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`} />
    </div>
  );
};

const RevealText = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  return (
    <div ref={ref} className={`overflow-hidden pb-6 -mb-6 ${className}`}>
      <div className="transition-transform duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) ease-out" style={{ transform: isVisible ? 'translateY(0)' : 'translateY(110%)', transitionDelay: `${delay}ms` }}>
        {children}
      </div>
    </div>
  );
};

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  return (
    <div ref={ref} className={`transition-all duration-[1.5s] ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

// ==========================================
// 2. COMPONENTE LOGO ANIMATO (Isolato e Perfetto)
// ==========================================
const AnimatedLogo = () => (
  <div className="w-full max-w-xl mx-auto relative z-10 py-20">
    <style>
      {`
        .draw-wave-sec { stroke-dasharray: 500; stroke-dashoffset: 500; animation: drawWave 3s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .draw-wave-sec-1 { animation-delay: 0.2s; }
        .draw-wave-sec-2 { animation-delay: 0.4s; }
        .draw-wave { stroke-dasharray: 400; stroke-dashoffset: 400; animation: drawWave 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; animation-delay: 0.5s; }
        .fade-in-element { opacity: 0; animation: fadeIn 1.5s ease-out forwards; animation-delay: 2s; }
        @keyframes drawWave { to { stroke-dashoffset: 0; } }
        @keyframes fadeIn { to { opacity: 1; } }
      `}
    </style>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" className="w-full h-auto drop-shadow-2xl">
      <path className="draw-wave-sec draw-wave-sec-1" d="M 30 100 L 80 100 C 100 100, 110 65, 125 65 C 140 65, 145 135, 170 135 C 185 135, 195 100, 220 100" fill="none" stroke="var(--accent)" opacity="0.15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path className="draw-wave-sec draw-wave-sec-2" d="M 30 100 L 80 100 C 100 100, 115 85, 125 85 C 135 85, 155 115, 170 115 C 185 115, 195 100, 220 100" fill="none" stroke="var(--accent)" opacity="0.08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path className="draw-wave" d="M 30 100 L 80 100 C 100 100, 105 40, 125 40 C 145 40, 150 160, 170 160 C 190 160, 195 100, 220 100" fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      
      <g className="fade-in-element">
        <circle cx="240" cy="100" r="20" fill="none" stroke="var(--accent)" strokeWidth="8" />
        <path d="M 260 80 V 140 A 20 20 0 0 1 220 140 C 220 100, 260 140, 284 100" fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" />
        <circle cx="304" cy="100" r="20" fill="none" stroke="var(--accent)" strokeWidth="8" />
        <path d="M 324 50 V 120" fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" />
        <path d="M 340 30 V 120" fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" />
        <circle cx="360" cy="100" r="20" fill="none" stroke="var(--accent)" strokeWidth="8" />
        <text x="315" y="165" fontFamily="'Playfair Display', 'Times New Roman', serif" fontSize="42" fontWeight="600" fill="var(--text-muted)" letterSpacing="0">labs</text>
      </g>
    </svg>
  </div>
);

// ==========================================
// 3. LA HOME (Testo + Mappa Interattiva)
// ==========================================
const HomeView = ({ setView }) => {
  const [zoomingTo, setZoomingTo] = useState(null);

  const handleEnterLab = (id) => {
    setZoomingTo(id);
    // Timeout per permettere all'animazione di zoom (1s) di finire
    setTimeout(() => {
      setView(id);
    }, 1000); 
  };

  // Coordinate di fuga per lo zoom
  const zoomOrigins = {
    logica: '25% 25%',
    progetti: '75% 25%',
    palette: '25% 75%',
    contatti: '75% 75%'
  };

  return (
    <div className={`pb-32 transition-opacity duration-700 ease-in-out overflow-hidden min-h-screen relative`}>
      
      {/* Container del testo che sfuma via durante lo zoom */}
      <div className={`transition-opacity duration-500 ${zoomingTo ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* HERO LOGO */}
        <section className="relative pt-24 pb-12 flex flex-col items-center justify-center px-4">
          <AnimatedLogo />
        </section>

        {/* MANIFESTO */}
        <section className="py-16 px-6 sm:px-12 md:px-24 max-w-7xl mx-auto">
          <div className="mb-16">
            <RevealText><h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-[var(--text-main)] leading-[1.1]">Non mi fermo</h2></RevealText>
            <RevealText delay={100}><h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-[var(--text-muted)] font-serif italic leading-[1.1]">alla superficie.</h2></RevealText>
          </div>

          <div className="grid md:grid-cols-2 gap-16 border-t border-[var(--border-color)] pt-16">
            <FadeIn delay={200}>
              <p className="text-xl md:text-2xl text-[var(--text-main)] font-light leading-relaxed">
                Sono un progettista software ed engineer. Trasformo le necessità aziendali e le idee complesse in architetture digitali pure. Il mio approccio unisce una logica matematica ferrea a una sensibilità estetica e funzionale.
              </p>
            </FadeIn>
            <FadeIn delay={400}>
              <p className="text-lg md:text-xl text-[var(--text-muted)] font-light leading-relaxed">
                Dal codice per gestire i processi di una PMI, alle meccaniche interattive, al client web ad alte prestazioni, fino alla prototipazione 3D. Cerco l'essenza del problema per costruire sistemi veloci e tangibili.
              </p>
            </FadeIn>
          </div>
        </section>
        
        {/* INDICATORE SCROLL */}
        <FadeIn delay={600} className="flex justify-center my-12">
          <div className="flex flex-col items-center">
             <span className="text-[var(--text-muted)] uppercase tracking-[0.3em] text-xs mb-4 font-mono">Inizializza Moduli</span>
             <ArrowDown className="text-[var(--text-muted)] w-5 h-5 animate-bounce" />
          </div>
        </FadeIn>
      </div>

      {/* PLANIMETRIA LABORATORIO (Interactive Blueprint) */}
      <section className="py-12 px-4 md:px-12 max-w-[1400px] mx-auto flex justify-center items-center relative z-20">
        <div 
          className="w-full aspect-[16/9] md:aspect-[21/9] transition-transform duration-[1.2s] ease-[cubic-bezier(0.85,0,0.15,1)]"
          style={{ 
            transform: zoomingTo ? 'scale(25)' : 'scale(1)', 
            transformOrigin: zoomingTo ? zoomOrigins[zoomingTo] : 'center' 
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 450" className="w-full h-full drop-shadow-2xl">
            <style>
              {`
                .schematic-line { stroke: var(--border-color); stroke-width: 1; fill: none; transition: stroke 0.4s ease; }
                .zone-group { cursor: pointer; }
                .zone-group:hover .schematic-line { stroke: var(--accent); stroke-width: 1.5;}
                .zone-group:hover .zone-bg { fill: var(--bg-card); opacity: 0.8; }
                .zone-text { fill: var(--text-muted); font-family: monospace; font-size: 14px; letter-spacing: 4px; transition: fill 0.4s ease; }
                .zone-subtext { fill: var(--text-muted); font-family: monospace; font-size: 9px; opacity: 0.5; transition: opacity 0.4s ease; }
                .zone-group:hover .zone-text { fill: var(--accent); }
                .zone-group:hover .zone-subtext { opacity: 1; fill: var(--text-main); }
                
                .crosshair { stroke: var(--text-muted); stroke-width: 1; opacity: 0.5; }
              `}
            </style>

            {/* Griglia Blueprint */}
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--border-color)" strokeWidth="0.5" opacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Nodo Centrale (Core) */}
            <circle cx="500" cy="225" r="30" fill="var(--bg-main)" stroke="var(--border-color)" strokeWidth="2" />
            <circle cx="500" cy="225" r="10" fill="var(--accent)" opacity="0.5" className="animate-pulse" />
            
            {/* Linee di Connessione dal Core alle stanze */}
            <path d="M 500 225 L 260 120 M 500 225 L 740 120 M 500 225 L 260 330 M 500 225 L 740 330" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5"/>

            {/* ==================================================== */}
            {/* ZONA 1: METODO / LOGICA (In alto a sinistra) */}
            {/* ==================================================== */}
            <g className="zone-group interactive" onClick={() => handleEnterLab('logica')}>
              <rect className="zone-bg transition-all duration-500" x="50" y="40" width="420" height="160" fill="var(--bg-main)" opacity="0.3" />
              <rect className="schematic-line" x="50" y="40" width="420" height="160" />
              
              <path className="schematic-line" d="M 80 140 L 120 140 L 140 160 L 250 160" />
              <rect className="schematic-line" x="350" y="60" width="90" height="100" strokeDasharray="2 4" />
              <circle className="schematic-line" cx="395" cy="110" r="20" />

              <text x="80" y="80" className="zone-text">01 // LOGICA APPLICATA</text>
              <text x="80" y="105" className="zone-subtext">[ SOFTWARE ARCHITECTURE & GAME DESIGN ]</text>
            </g>

            {/* ==================================================== */}
            {/* ZONA 2: ARCHIVI (In alto a destra) */}
            {/* ==================================================== */}
            <g className="zone-group interactive" onClick={() => handleEnterLab('progetti')}>
              <rect className="zone-bg transition-all duration-500" x="530" y="40" width="420" height="160" fill="var(--bg-main)" opacity="0.3" />
              <rect className="schematic-line" x="530" y="40" width="420" height="160" />
              
              <path className="schematic-line" d="M 750 80 L 880 80 L 850 120 L 720 120 Z" />
              <path className="schematic-line" d="M 750 110 L 880 110 L 850 150 L 720 150 Z" />
              <circle className="schematic-line" cx="620" cy="130" r="30" strokeDasharray="2 6" />

              <text x="560" y="80" className="zone-text">02 // ARCHIVI</text>
              <text x="560" y="105" className="zone-subtext">[ GESTIONALI PMI & PROTOTIPAZIONE 3D ]</text>
            </g>

            {/* ==================================================== */}
            {/* ZONA 3: COLORI (In basso a sinistra) */}
            {/* ==================================================== */}
            <g className="zone-group interactive" onClick={() => handleEnterLab('palette')}>
              <rect className="zone-bg transition-all duration-500" x="50" y="250" width="420" height="160" fill="var(--bg-main)" opacity="0.3" />
              <rect className="schematic-line" x="50" y="250" width="420" height="160" />
              
              <circle className="schematic-line" cx="150" cy="330" r="35" />
              <circle className="schematic-line" cx="190" cy="330" r="35" />
              <circle className="schematic-line" cx="170" cy="365" r="35" />

              <text x="80" y="290" className="zone-text">03 // LABORATORIO COLORI</text>
              <text x="80" y="315" className="zone-subtext">[ IMPOSTAZIONI TEMA & AMBIENTE VISIVO ]</text>
            </g>

            {/* ==================================================== */}
            {/* ZONA 4: CONTATTI (In basso a destra) */}
            {/* ==================================================== */}
            <g className="zone-group interactive" onClick={() => handleEnterLab('contatti')}>
              <rect className="zone-bg transition-all duration-500" x="530" y="250" width="420" height="160" fill="var(--bg-main)" opacity="0.3" />
              <rect className="schematic-line" x="530" y="250" width="420" height="160" />
              
              <path className="schematic-line" d="M 600 380 Q 700 280 850 380" />
              <path className="schematic-line" d="M 640 380 Q 700 320 760 380" />
              <circle className="schematic-line" cx="700" cy="380" r="5" fill="var(--accent)" />

              <text x="560" y="290" className="zone-text">04 // DIALOGO</text>
              <text x="560" y="315" className="zone-subtext">[ CANALI DI COMUNICAZIONE & AVVIO PROGETTI ]</text>
            </g>

            {/* Croci di collimazione estetiche */}
            <path className="crosshair" d="M 40 30 L 60 30 M 50 20 L 50 40" />
            <path className="crosshair" d="M 940 30 L 960 30 M 950 20 L 950 40" />
            <path className="crosshair" d="M 40 420 L 60 420 M 50 410 L 50 430" />
            <path className="crosshair" d="M 940 420 L 960 420 M 950 410 L 950 430" />
          </svg>
        </div>
      </section>
    </div>
  );
};


// ==========================================
// 4. I SINGOLI MODULI (LE PAGINE INTERNE)
// ==========================================

const LogicaView = () => (
  <div className="pt-48 pb-48 px-6 sm:px-12 md:px-24 max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out_forwards]">
    <div className="mb-48">
      <RevealText><h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-[var(--text-main)] leading-[1.1]">Logica</h1></RevealText>
      <RevealText delay={100}><h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-[var(--text-muted)] font-serif italic leading-[1.1]">Applicata.</h1></RevealText>
      <FadeIn delay={300}>
        <p className="text-2xl md:text-3xl text-[var(--text-muted)] font-light max-w-4xl mt-16 leading-relaxed">
          La programmazione non è solo scrittura di codice. È architettura del pensiero. È prendere il caos e dargli una forma esatta.
        </p>
      </FadeIn>
    </div>
    <div className="grid md:grid-cols-2 gap-y-40 gap-x-24">
      <FadeIn>
        <div className="space-y-8 relative group">
          <div className="text-8xl font-serif text-[var(--text-main)] opacity-5 absolute -top-12 -left-8 pointer-events-none transition-opacity group-hover:opacity-10">01</div>
          <Code className="w-10 h-10 text-[var(--text-muted)] group-hover:text-[var(--accent)] relative z-10 transition-all duration-500" />
          <h3 className="text-4xl font-semibold tracking-tight text-[var(--text-main)]">Sviluppo Puro</h3>
          <p className="text-[var(--text-muted)] leading-relaxed font-light text-xl mt-6">Scrivo codice pulito. Affronto i sistemi per ricavarne strutture logiche infallibili, che si tratti del backend per una web app o dell'algoritmo per un client custom.</p>
        </div>
      </FadeIn>
      <FadeIn delay={200}>
        <div className="space-y-8 relative group">
          <div className="text-8xl font-serif text-[var(--text-main)] opacity-5 absolute -top-12 -left-8 pointer-events-none transition-opacity group-hover:opacity-10">02</div>
          <Briefcase className="w-10 h-10 text-[var(--text-muted)] group-hover:text-[var(--accent)] relative z-10 transition-all duration-500" />
          <h3 className="text-4xl font-semibold tracking-tight text-[var(--text-main)]">Ecosistemi per PMI</h3>
          <p className="text-[var(--text-muted)] leading-relaxed font-light text-xl mt-6">Non sono un semplice esecutore. Aiuto le imprese a ottimizzare i processi analizzando il problema alla radice. Progetto gestionali sartoriali e CRM.</p>
        </div>
      </FadeIn>
      <FadeIn>
        <div className="space-y-8 relative group">
          <div className="text-8xl font-serif text-[var(--text-main)] opacity-5 absolute -top-12 -left-8 pointer-events-none transition-opacity group-hover:opacity-10">03</div>
          <Gamepad2 className="w-10 h-10 text-[var(--text-muted)] group-hover:text-[var(--accent)] relative z-10 transition-all duration-500" />
          <h3 className="text-4xl font-semibold tracking-tight text-[var(--text-main)]">Game Design Tecnico</h3>
          <p className="text-[var(--text-muted)] leading-relaxed font-light text-xl mt-6">Sviluppare un videogioco significa fondere la matematica rigorosa con l'espressione creativa. Mi occupo della programmazione della logica e delle meccaniche.</p>
        </div>
      </FadeIn>
      <FadeIn delay={200}>
        <div className="space-y-8 relative group">
          <div className="text-8xl font-serif text-[var(--text-main)] opacity-5 absolute -top-12 -left-8 pointer-events-none transition-opacity group-hover:opacity-10">04</div>
          <Box className="w-10 h-10 text-[var(--text-muted)] group-hover:text-[var(--accent)] relative z-10 transition-all duration-500" />
          <h3 className="text-4xl font-semibold tracking-tight text-[var(--text-main)]">Prototipazione 3D</h3>
          <p className="text-[var(--text-muted)] leading-relaxed font-light text-xl mt-6">La logica che prende forma fisica. Dall'idea al modello CAD, fino alla stampa 3D. Prototipazione rapida per testare soluzioni reali e componenti custom.</p>
        </div>
      </FadeIn>
    </div>
  </div>
);

const ProgettiView = () => (
  <div className="pt-48 pb-32 min-h-screen animate-[fadeIn_0.5s_ease-out_forwards]">
    <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-24">
      <div className="mb-48">
        <RevealText><h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-[var(--text-main)] leading-[1.1]">Archivi</h1></RevealText>
        <RevealText delay={100}><h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-[var(--text-muted)] font-serif italic leading-[1.1]">Selezionati.</h1></RevealText>
      </div>
      <div className="relative">
        {[
          { tag: "LOGIC", title: "Gestionali PMI", icon: Terminal, desc: "Sviluppo di piattaforme gestionali sartoriali. Traduco processi complessi in interfacce pulite.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000" },
          { tag: "GAMES", title: "Interactive Worlds", icon: Gamepad2, desc: "Programmazione logica e sviluppo meccaniche. Mondi dove estetica e codice si fondono coerentemente.", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000" },
          { tag: "WEB", title: "App & Client Custom", icon: Cpu, desc: "Applicazioni web ad alte prestazioni pensate per risolvere problemi specifici reali.", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" },
          { tag: "HARDWARE", title: "Prototipazione 3D", icon: Box, desc: "Modellazione e stampa 3D. Dal concept digitale all'oggetto fisico, ottimizzando materiali e geometrie.", img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2000" }
        ].map((proj, idx) => (
          <div key={idx} className="sticky interactive group" style={{ top: `${15 + (idx * 2)}vh`, marginBottom: '15vh' }}>
            <div className="w-full h-[75vh] bg-[var(--bg-card)] rounded-[3rem] overflow-hidden relative shadow-2xl border border-[var(--border-color)] transition-transform duration-500 ease-out group-hover:scale-[0.98]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] group-hover:scale-105 opacity-40 mix-blend-luminosity" style={{ backgroundImage: `url(${proj.img})` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/90 to-[var(--bg-main)]/40 z-10 opacity-90 transition-opacity duration-700"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--text-main)] transition-transform duration-1000 scale-[2] opacity-[0.03] z-10"><proj.icon className="w-96 h-96" /></div>
              <div className="absolute bottom-0 left-0 w-full p-12 md:p-20 z-20 flex flex-col md:flex-row justify-between items-end gap-12">
                <div className="max-w-3xl transform transition-transform duration-500 group-hover:translate-x-4">
                  <p className="text-[var(--accent)] font-mono text-sm mb-6 tracking-[0.2em] flex items-center gap-4"><span className="w-8 h-[1px] bg-[var(--accent)] block"></span>{proj.tag}</p>
                  <h3 className="text-5xl md:text-8xl font-bold text-[var(--text-main)] mb-6 tracking-tighter">{proj.title}</h3>
                </div>
                <div className="max-w-md pb-4 transform transition-transform duration-500 group-hover:-translate-y-2">
                  <p className="text-[var(--text-muted)] text-xl font-light leading-relaxed">{proj.desc}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PaletteView = ({ activeTheme, setActiveTheme }) => (
  <div className="pt-48 pb-32 px-6 sm:px-12 md:px-24 max-w-7xl mx-auto min-h-screen animate-[fadeIn_0.5s_ease-out_forwards]">
    <div className="mb-32">
      <RevealText><h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-[var(--text-main)] leading-[1.1]">Laboratorio</h1></RevealText>
      <RevealText delay={100}><h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-[var(--text-muted)] font-serif italic leading-[1.1]">Colori.</h1></RevealText>
      <FadeIn delay={300}>
        <p className="text-2xl text-[var(--text-muted)] font-light max-w-3xl mt-12 leading-relaxed">
          Un'identità visiva non deve strillare. Cambia il tema globale dell'interfaccia per trovare la vibrazione che risuona con te oggi.
        </p>
      </FadeIn>
    </div>
    <div className="grid md:grid-cols-2 gap-12">
      {Object.entries(themes).map(([themeKey, themeData], idx) => (
        <FadeIn key={themeKey} delay={idx * 100}>
          <button onClick={() => setActiveTheme(themeKey)} className={`interactive w-full text-left p-12 rounded-[2rem] border transition-all duration-300 ${activeTheme === themeKey ? 'border-[var(--accent)] scale-105 shadow-2xl' : 'border-[var(--border-color)] hover:border-[var(--text-muted)] hover:scale-[1.02]'}`} style={{ backgroundColor: themeData['--bg-card'] }}>
            <div className="flex gap-4 mb-10">
              <div className="w-10 h-10 rounded-full shadow-inner border border-[var(--border-color)]" style={{ backgroundColor: themeData['--bg-main'] }}></div>
              <div className="w-10 h-10 rounded-full shadow-inner border border-[var(--border-color)]" style={{ backgroundColor: themeData['--accent'] }}></div>
            </div>
            <h3 className="text-3xl font-semibold capitalize mb-4" style={{ color: themeData['--text-main'] }}>{themeKey}</h3>
            <p className="text-lg font-light leading-relaxed" style={{ color: themeData['--text-muted'] }}>
              {themeKey === 'neutro' && 'L\'abisso. Monocromatico, profondo, senza distrazioni.'}
              {themeKey === 'luce' && 'Il foglio di carta. Struttura chirurgica, pulizia estrema.'}
              {themeKey === 'argilla' && 'Materico. Toni caldi, desaturati, color pietra e ruggine.'}
              {themeKey === 'cianotipo' && 'Il progetto tecnico. Blu ardesia ispirato ai vecchi blueprint.'}
            </p>
          </button>
        </FadeIn>
      ))}
    </div>
  </div>
);

const ContattiView = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-6 sm:px-12 text-center relative overflow-hidden animate-[fadeIn_0.5s_ease-out_forwards]">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent)] opacity-[0.02] rounded-full blur-3xl pointer-events-none"></div>
    <div className="interactive z-10">
      <RevealText><h1 className="text-7xl md:text-[10rem] font-bold tracking-tighter leading-none text-[var(--text-main)]">Dialogo.</h1></RevealText>
      <FadeIn delay={200}>
        <p className="text-2xl md:text-3xl text-[var(--text-muted)] font-light mt-16 mb-24 max-w-4xl mx-auto leading-relaxed font-serif italic">Interessato a sfide architetturali complesse e persone che non si fermano alla superficie delle cose.</p>
      </FadeIn>
      <FadeIn delay={400}>
        <a href="mailto:gabriele.boffa@example.com" className="inline-flex items-center justify-center gap-6 px-16 py-8 bg-[var(--text-main)] text-[var(--bg-main)] rounded-full font-semibold hover:opacity-80 transition-opacity duration-300 text-xl uppercase tracking-widest group">
          <Mail className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" /> Inizia un progetto
        </a>
      </FadeIn>
    </div>
  </div>
);

// ==========================================
// 5. MAIN APP (Router & "Lab" Layout)
// ==========================================
export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [activeTheme, setActiveTheme] = useState('neutro'); 

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeView]);

  return (
    <div 
      className="min-h-screen font-sans selection:bg-[var(--accent)] selection:text-[var(--bg-main)] overflow-x-hidden cursor-none transition-colors duration-1000 ease-in-out"
      style={{ 
        ...themes[activeTheme],
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-main)'
      }}
    >
      <CustomCursor />

      {/* HEADER DINAMICO: Appare solo quando sei "dentro" un modulo (non in Home) */}
      {activeView !== 'home' && (
        <nav className="fixed top-0 w-full z-50 mix-blend-difference px-8 md:px-12 py-8 flex justify-between items-center bg-gradient-to-b from-[var(--bg-main)] to-transparent animate-[fadeIn_1s_ease-out_forwards]">
          <button 
            onClick={() => setActiveView('home')} 
            className="interactive group flex items-center gap-4 text-xs font-mono tracking-[0.2em] uppercase text-[var(--text-main)] hover:text-[var(--accent)] transition-colors bg-[var(--bg-card)] px-6 py-3 rounded-full border border-[var(--border-color)]"
          >
            <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>Ritorna al Core</span>
          </button>
          
          <div className="hidden md:flex items-center gap-3 text-xs font-mono tracking-[0.2em] uppercase text-[var(--text-main)]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
            Modulo Attivo: {activeView}
          </div>
        </nav>
      )}

      {/* RENDER VIEW */}
      <main>
        {activeView === 'home' && <HomeView setView={setActiveView} />}
        {activeView === 'logica' && <LogicaView />}
        {activeView === 'progetti' && <ProgettiView />}
        {activeView === 'palette' && <PaletteView activeTheme={activeTheme} setActiveTheme={setActiveTheme} />}
        {activeView === 'contatti' && <ContattiView />}
      </main>

      {/* FOOTER GLOBALE */}
      {activeView !== 'contatti' && activeView !== 'home' && (
        <footer className="border-t border-[var(--border-color)] py-16 text-center text-[var(--text-muted)] text-[11px] font-mono uppercase tracking-[0.3em] transition-colors duration-1000 mt-32">
          <p>© {new Date().getFullYear()} Gabriele Boffa. System Architecture & Development.</p>
        </footer>
      )}
    </div>
  );
}