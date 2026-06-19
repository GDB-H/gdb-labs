import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { theme } from '../App';

// ==========================================
// ELEVATOR SHAFT EFFECT & TOWER
// ==========================================

const ElevatorShaft = ({ progress }: { progress: any }) => {
  const rotateZ = useTransform(progress, [0, 1], [0, 120]);
  const scale = useTransform(progress, [0, 1], [1, 3.5]);

  // Opacities for the top-down SVG maps based on scroll depth
  const mapLogicaOpacity = useTransform(progress, [0.1, 0.3, 0.5], [0, 1, 0]);
  const mapArchiviOpacity = useTransform(progress, [0.4, 0.6, 0.8], [0, 1, 0]);
  const mapDialogoOpacity = useTransform(progress, [0.7, 0.9, 1.0], [0, 1, 1]);

  return (
    <motion.div className="fixed inset-0 pointer-events-none z-[-1] flex items-center justify-center overflow-hidden">
      <motion.div style={{ scale, rotateZ }} className="absolute flex items-center justify-center">
        <svg viewBox="0 0 800 800" className="w-[150vh] h-[150vh] mix-blend-screen opacity-30">
          {/* Complex Hexagonal Outer Shell */}
          <polygon points="400,20 730,210 730,590 400,780 70,590 70,210" fill="none" stroke={theme.grid} strokeWidth="1" />
          
          {/* Rotating Inner Rings */}
          <circle cx="400" cy="400" r="350" fill="none" stroke={theme.grid} strokeWidth="1" strokeDasharray="2 12" />
          <circle cx="400" cy="400" r="280" fill="none" stroke={theme.grid} strokeWidth="2" />
          <circle cx="400" cy="400" r="200" fill="none" stroke={theme.grid} strokeWidth="1" strokeDasharray="40 10" />
          <circle cx="400" cy="400" r="100" fill="none" stroke={theme.grid} strokeWidth="1" />
          
          {/* Grid Lines */}
          <line x1="0" y1="400" x2="800" y2="400" stroke={theme.grid} strokeWidth="1" opacity="0.5" />
          <line x1="400" y1="0" x2="400" y2="800" stroke={theme.grid} strokeWidth="1" opacity="0.5" />

          {/* ========================================== */}
          {/* TOP-DOWN MAP: LOGICA (Server Racks & Nodes) */}
          {/* ========================================== */}
          <motion.g style={{ opacity: mapLogicaOpacity }}>
             <g fill="none" stroke={theme.accentCyan} strokeWidth="2" opacity="0.6">
               <rect x="250" y="250" width="40" height="100" />
               <rect x="310" y="250" width="40" height="100" />
               <rect x="450" y="250" width="40" height="100" />
               <rect x="510" y="250" width="40" height="100" />
               
               <rect x="250" y="450" width="40" height="100" />
               <rect x="310" y="450" width="40" height="100" />
               <rect x="450" y="450" width="40" height="100" />
               <rect x="510" y="450" width="40" height="100" />
             </g>
             <circle cx="400" cy="400" r="80" fill="rgba(0,240,255,0.1)" stroke={theme.accentCyan} strokeWidth="2" strokeDasharray="10 10" className="animate-pulse" />
          </motion.g>

          {/* ========================================== */}
          {/* TOP-DOWN MAP: ARCHIVI (Data Vaults / Grid) */}
          {/* ========================================== */}
          <motion.g style={{ opacity: mapArchiviOpacity }}>
             <g fill="none" stroke={theme.accentRed} strokeWidth="2" opacity="0.6">
               {[...Array(6)].map((_, i) => (
                 <circle key={`arch-${i}`} cx="400" cy="400" r={120 + (i * 20)} strokeDasharray="5 30" />
               ))}
               <path d="M 400 200 L 400 100 M 400 600 L 400 700 M 200 400 L 100 400 M 600 400 L 700 400" strokeWidth="4" />
             </g>
             <rect x="350" y="350" width="100" height="100" fill="none" stroke={theme.accentRed} strokeWidth="4" className="animate-[spin_4s_linear_infinite]" />
          </motion.g>

          {/* ========================================== */}
          {/* TOP-DOWN MAP: DIALOGO (Antenna Array) */}
          {/* ========================================== */}
          <motion.g style={{ opacity: mapDialogoOpacity }}>
             <circle cx="400" cy="400" r="180" fill="none" stroke={theme.text} strokeWidth="1" strokeDasharray="4 4" />
             <path d="M 400 400 L 550 250 M 400 400 L 250 550 M 400 400 L 550 550 M 400 400 L 250 250" stroke={theme.text} strokeWidth="2" opacity="0.5" />
             <circle cx="550" cy="250" r="20" fill="none" stroke={theme.accentCyan} strokeWidth="2" className="animate-ping" />
             <circle cx="250" cy="550" r="20" fill="none" stroke={theme.accentRed} strokeWidth="2" className="animate-ping" />
             <circle cx="550" cy="550" r="20" fill="none" stroke={theme.accentCyan} strokeWidth="2" className="animate-ping" />
             <circle cx="250" cy="250" r="20" fill="none" stroke={theme.accentRed} strokeWidth="2" className="animate-ping" />
          </motion.g>

          {/* Core Hub */}
          <circle cx="400" cy="400" r="30" fill="none" stroke={theme.text} strokeWidth="4" />
          <circle cx="400" cy="400" r="10" fill={theme.accentCyan} className="animate-pulse" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

const AnimatedLogo = () => (
  <div className="w-full max-w-xl mx-auto relative py-12 pointer-events-none">
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
      <path className="draw-wave-sec draw-wave-sec-1" d="M 30 100 L 80 100 C 100 100, 110 65, 125 65 C 140 65, 145 135, 170 135 C 185 135, 195 100, 220 100" fill="none" stroke={theme.accentCyan} opacity="0.15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path className="draw-wave-sec draw-wave-sec-2" d="M 30 100 L 80 100 C 100 100, 115 85, 125 85 C 135 85, 155 115, 170 115 C 185 115, 195 100, 220 100" fill="none" stroke={theme.accentCyan} opacity="0.08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path className="draw-wave" d="M 30 100 L 80 100 C 100 100, 105 40, 125 40 C 145 40, 150 160, 170 160 C 190 160, 195 100, 220 100" fill="none" stroke={theme.text} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      
      <g className="fade-in-element">
        <circle cx="240" cy="100" r="20" fill="none" stroke={theme.text} strokeWidth="8" />
        <path d="M 260 80 V 140 A 20 20 0 0 1 220 140 C 220 100, 260 140, 284 100" fill="none" stroke={theme.text} strokeWidth="8" strokeLinecap="round" />
        <circle cx="304" cy="100" r="20" fill="none" stroke={theme.text} strokeWidth="8" />
        <path d="M 324 50 V 120" fill="none" stroke={theme.text} strokeWidth="8" strokeLinecap="round" />
        <path d="M 340 30 V 120" fill="none" stroke={theme.text} strokeWidth="8" strokeLinecap="round" />
        <circle cx="360" cy="100" r="20" fill="none" stroke={theme.text} strokeWidth="8" />
        <text x="315" y="165" fontFamily="monospace" fontSize="42" fontWeight="600" fill={theme.accentRed} letterSpacing="0">labs</text>
      </g>
    </svg>
  </div>
);

// ==========================================
// SCROLL TRACKER
// ==========================================
const ScrollTracker = ({ progress }: { progress: any }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    return progress.onChange((latest: number) => {
      setVal(Math.round(latest * -9999));
    });
  }, [progress]);
  
  return (
    <div className="fixed bottom-32 left-8 p-4 flex flex-col pointer-events-none z-50 font-mono text-[10px] tracking-widest text-[#64748b] uppercase border-l border-[#00f0ff]">
      <p>DEPTH METERS: <span className="text-[#00f0ff]">{val}</span>m</p>
    </div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 flex flex-col items-center h-[500vh]"
    >
      <ElevatorShaft progress={scrollYProgress} />
      <ScrollTracker progress={scrollYProgress} />

      {/* LEVEL 0: SUPERFICIE */}
      <section className="h-[100vh] w-full flex flex-col justify-center items-center px-8 text-center pt-20">
        <AnimatedLogo />
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: false, margin: "-100px" }}
          className="max-w-4xl"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.1] mb-2">Non mi fermo</h2>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-[#64748b] font-serif italic leading-[1.1] mb-12">alla superficie.</h2>
          
          <p className="text-xl md:text-2xl text-white font-light leading-relaxed mb-6">
            Sono un progettista software ed engineer. Trasformo le necessità aziendali e le idee complesse in architetture digitali pure. Il mio approccio unisce una logica matematica ferrea a una sensibilità estetica e funzionale.
          </p>
          <p className="text-lg md:text-xl text-[#64748b] font-light leading-relaxed">
            Dal codice per gestire i processi di una PMI, alle meccaniche interattive, al client web ad alte prestazioni, fino alla prototipazione 3D. Cerco l'essenza del problema per costruire sistemi veloci e tangibili.
          </p>

          <div className="mt-24 flex flex-col items-center opacity-50 animate-bounce">
            <span className="font-mono text-[10px] tracking-widest text-[#00f0ff] mb-4">INIZIA LA DISCESA</span>
            <ChevronDown className="w-8 h-8 text-[#00f0ff]" />
          </div>
        </motion.div>
      </section>

      {/* LEVEL 01: LOGICA */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center border-t border-[#00f0ff]/10 bg-[#050507]/60 backdrop-blur-md px-8 text-center relative group">
         <div className="absolute top-8 left-8 text-[#00f0ff] font-mono text-xs tracking-widest border border-[#00f0ff]/30 px-4 py-2 bg-[#050507]">
           SEC_01 // LOGICA
         </div>
         <h2 className="text-8xl md:text-[14rem] font-bold text-transparent font-serif italic absolute opacity-10 pointer-events-none" style={{ WebkitTextStroke: `2px ${theme.grid}` }}>01</h2>
         
         <h3 className="text-5xl md:text-8xl font-bold text-white mb-6 relative z-10 tracking-tighter">Logica</h3>
         <p className="text-xl md:text-2xl text-[#64748b] max-w-3xl font-light leading-relaxed relative z-10 mb-12">
           L'architettura del sistema, gli algoritmi e l'intelligenza dietro le quinte. Entra nel laboratorio di progettazione matematica.
         </p>
         
         <Link to="/logica" className="relative z-10 px-8 py-4 border-2 border-[#00f0ff] text-[#00f0ff] uppercase tracking-widest font-mono text-sm hover:bg-[#00f0ff] hover:text-[#050507] transition-all transform hover:scale-105">
           Accedi alla Logica
         </Link>
      </section>

      {/* LEVEL 02: ARCHIVI */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center border-t border-[#ff0055]/10 bg-[#050507]/60 backdrop-blur-md px-8 text-center relative group">
         <div className="absolute top-8 left-8 text-[#ff0055] font-mono text-xs tracking-widest border border-[#ff0055]/30 px-4 py-2 bg-[#050507]">
           SEC_02 // ARCHIVI
         </div>
         <h2 className="text-8xl md:text-[14rem] font-bold text-transparent font-serif italic absolute opacity-10 pointer-events-none" style={{ WebkitTextStroke: `2px ${theme.grid}` }}>02</h2>
         
         <h3 className="text-5xl md:text-8xl font-bold text-white mb-6 relative z-10 tracking-tighter">Archivi</h3>
         <p className="text-xl md:text-2xl text-[#64748b] max-w-3xl font-light leading-relaxed relative z-10 mb-12">
           Il database visivo e tecnico dei progetti passati. Gestionali PMI, web app e mondi interattivi 3D catalogati con precisione.
         </p>
         
         <Link to="/archivi" className="relative z-10 px-8 py-4 border-2 border-[#ff0055] text-[#ff0055] uppercase tracking-widest font-mono text-sm hover:bg-[#ff0055] hover:text-[#050507] transition-all transform hover:scale-105">
           Consulta Archivi
         </Link>
      </section>

      {/* LEVEL 03: DIALOGO */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center border-t border-[#64748b]/30 bg-[#050507]/60 backdrop-blur-md px-8 text-center relative group">
         <div className="absolute top-8 left-8 text-slate-300 font-mono text-xs tracking-widest border border-slate-700 px-4 py-2 bg-[#050507]">
           SEC_03 // DIALOGO
         </div>
         <h2 className="text-8xl md:text-[14rem] font-bold text-transparent font-serif italic absolute opacity-10 pointer-events-none" style={{ WebkitTextStroke: `2px ${theme.grid}` }}>03</h2>
         
         <h3 className="text-5xl md:text-8xl font-bold text-white mb-6 relative z-10 tracking-tighter">Dialogo</h3>
         <p className="text-xl md:text-2xl text-[#64748b] max-w-3xl font-light leading-relaxed relative z-10 mb-12">
           Stabilisci un collegamento sicuro. Trasmetti il payload delle tue specifiche per iniziare lo sviluppo del sistema.
         </p>
         
         <Link to="/dialogo" className="relative z-10 px-8 py-4 border-2 border-slate-300 text-slate-300 uppercase tracking-widest font-mono text-sm hover:bg-slate-300 hover:text-[#050507] transition-all transform hover:scale-105">
           Inizializza Trasmissione
         </Link>
      </section>

    </motion.div>
  );
}
