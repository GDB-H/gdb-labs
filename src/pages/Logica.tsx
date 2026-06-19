import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Beaker, Cpu, Gamepad2, Server } from 'lucide-react';

export default function Logica() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Panning path:
  // 0.00: Room 1 (0, 0)
  // 0.25: Room 2 (-100vw, 0)
  // 0.50: Room 3 (-200vw, 0)
  // 0.75: Room 4 (-200vw, -100vh)
  // 1.00: Room 5 (-100vw, -100vh)

  const x = useTransform(scrollYProgress, 
    [0, 0.25, 0.5, 0.75, 1], 
    ['0vw', '-100vw', '-200vw', '-200vw', '-100vw']
  );
  
  const y = useTransform(scrollYProgress, 
    [0, 0.25, 0.5, 0.75, 1], 
    ['0vh', '0vh', '0vh', '-100vh', '-100vh']
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef} 
      className="relative w-full h-[500vh] bg-[#050507]"
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        
        {/* HUD Indicator */}
        <div className="absolute top-8 left-8 z-50 font-mono text-xs text-[#00f0ff] uppercase tracking-widest bg-[#050507]/80 p-4 border border-[#1e293b] rounded-xl backdrop-blur-md">
          <p>LAB_SECTOR: <motion.span>{useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], ["01_ENTRY", "02_CHEMISTRY", "03_MECHATRONICS", "04_ROBOTICS", "05_SERVERS"])}</motion.span></p>
          <p className="text-[#64748b] mt-1">SCROLL DOWN TO EXPLORE</p>
        </div>

        <motion.div 
          className="absolute top-0 left-0 w-[300vw] h-[200vh] flex flex-wrap"
          style={{ x, y }}
        >
          {/* ======================================= */}
          {/* TOP ROW (y: 0vh) */}
          {/* ======================================= */}
          
          {/* Room 1 (0, 0) - Entry */}
          <div className="w-[100vw] h-[100vh] relative border-r border-b border-[#1e293b] flex items-center justify-center p-24">
            <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-[#ff0055]/30 rounded-bl-full" />
            <div className="max-w-2xl">
              <h1 className="text-7xl font-bold text-white mb-6">Logica<br/><span className="text-[#64748b] italic font-serif">Applicata.</span></h1>
              <p className="text-xl text-[#64748b] font-light leading-relaxed">
                Benvenuto nel laboratorio sotterraneo. Ogni stanza rappresenta un diverso strato della mia architettura mentale. Scrolla per scendere nelle profondità.
              </p>
            </div>
            {/* Scenery details */}
            <div className="absolute bottom-0 left-1/4 w-[500px] h-80 border-t border-l border-r border-[#1e293b] bg-[#0a0a0e] flex flex-col justify-end p-8 overflow-hidden rounded-t-3xl">
               <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(transparent_50%,rgba(0,240,255,0.05)_50%)] bg-[length:100%_4px]" />
               <div className="relative z-10 space-y-4">
                 <div className="flex gap-2">
                   {[...Array(5)].map((_, i) => (
                     <div key={i} className={`w-12 h-32 border border-[#00f0ff]/30 flex flex-col justify-end p-1`}>
                       <motion.div 
                         className="w-full bg-[#00f0ff]/50" 
                         animate={{ height: ['20%', '80%', '40%', '90%', '10%'] }}
                         transition={{ duration: 2 + i, repeat: Infinity, ease: 'linear' }}
                       />
                     </div>
                   ))}
                 </div>
                 <div className="w-full h-2 bg-[#00f0ff]/20 rounded-full overflow-hidden">
                   <div className="w-1/3 h-full bg-[#00f0ff] animate-pulse" />
                 </div>
                 <div className="text-[#00f0ff] font-mono text-[10px] tracking-widest flex justify-between">
                   <span>SYS_MONITORING</span>
                   <span className="animate-pulse">REC</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Room 2 (100vw, 0) - Chemistry / Algorithms */}
          <div className="w-[100vw] h-[100vh] relative border-r border-b border-[#1e293b] flex items-center justify-center p-24">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00f0ff]/5 to-transparent pointer-events-none" />
             <div className="max-w-2xl relative z-10">
               <Beaker className="w-16 h-16 text-[#00f0ff] mb-8 animate-bounce" />
               <h2 className="text-5xl font-bold text-white mb-6">Algoritmi & Dati</h2>
               <p className="text-xl text-[#64748b] font-light leading-relaxed">
                 Come alambicchi chimici, i dati grezzi entrano, vengono distillati da logiche complesse e si trasformano in interfacce pulite e reattive.
               </p>
             </div>
             {/* Scenery details: SVG Alembics */}
             <div className="absolute bottom-10 right-32 flex items-end gap-12 opacity-80">
                <div className="relative">
                  <motion.div animate={{ y: [-10, -50], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute left-1/2 w-4 h-4 rounded-full bg-[#00f0ff]" />
                  <motion.div animate={{ y: [-10, -60], opacity: [0, 1, 0] }} transition={{ duration: 2.5, delay: 0.5, repeat: Infinity }} className="absolute left-1/3 w-2 h-2 rounded-full bg-[#00f0ff]" />
                  <svg width="120" height="180" viewBox="0 0 100 150">
                    <path d="M40 20 L40 80 C20 90 10 110 10 130 C10 150 90 150 90 130 C90 110 80 90 60 80 L60 20 Z" fill="rgba(0,240,255,0.1)" stroke="#00f0ff" strokeWidth="2"/>
                    <path d="M15 130 Q50 140 85 130" fill="none" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                    <line x1="60" y1="50" x2="100" y2="50" stroke="#00f0ff" strokeWidth="2" />
                  </svg>
                </div>
                
                <div className="relative">
                  <motion.div animate={{ y: [-10, -40], opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute left-1/2 w-3 h-3 rounded-full bg-[#ff0055]" />
                  <svg width="100" height="140" viewBox="0 0 80 120">
                    <rect x="20" y="20" width="40" height="80" rx="20" fill="rgba(255,0,85,0.1)" stroke="#ff0055" strokeWidth="2"/>
                    <line x1="20" y1="60" x2="60" y2="60" stroke="#ff0055" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse"/>
                    <line x1="0" y1="50" x2="20" y2="50" stroke="#ff0055" strokeWidth="2" />
                  </svg>
                </div>

                {/* Connecting Pipe */}
                <svg className="absolute bottom-[80px] left-[105px] w-24 h-12" viewBox="0 0 100 50">
                  <path d="M0 0 C 50 0, 50 50, 100 50" fill="none" stroke="#64748b" strokeWidth="4" strokeDasharray="5 5">
                    <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
                  </path>
                </svg>
             </div>
          </div>

          {/* Room 3 (200vw, 0) - Mechatronics */}
          <div className="w-[100vw] h-[100vh] relative border-b border-[#1e293b] flex items-center justify-center p-24">
             <div className="absolute right-0 top-1/2 w-64 h-1 bg-[#ff0055] opacity-20" />
             <div className="max-w-2xl relative z-10 text-right">
               <Cpu className="w-16 h-16 text-[#ff0055] mb-8 ml-auto" />
               <h2 className="text-5xl font-bold text-white mb-6">Meccatronica & 3D</h2>
               <p className="text-xl text-[#64748b] font-light leading-relaxed">
                 La logica si fa materia. Progettazione CAD e stampa 3D per testare soluzioni nel mondo reale. Creare pezzi che non esistono per risolvere problemi che esistono.
               </p>
             </div>
             {/* Scenery details: Robotic Arm & Gears */}
             <div className="absolute left-32 bottom-0 w-80 h-[500px] border-t border-r border-l border-[#1e293b] bg-[#0a0a0e] rounded-t-[3rem] flex flex-col items-center justify-end p-8 overflow-hidden">
                <svg className="absolute top-10 left-10 w-32 h-32 opacity-20 animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
                  <path d="M50 5 L55 15 A40 40 0 0 1 85 45 L95 50 L85 55 A40 40 0 0 1 55 85 L50 95 L45 85 A40 40 0 0 1 15 55 L5 50 L15 45 A40 40 0 0 1 45 15 Z" fill="none" stroke="#ff0055" strokeWidth="2"/>
                  <circle cx="50" cy="50" r="20" fill="none" stroke="#ff0055" strokeWidth="2"/>
                </svg>
                <svg className="absolute top-20 right-10 w-24 h-24 opacity-20 animate-[spin_8s_linear_infinite_reverse]" viewBox="0 0 100 100">
                  <path d="M50 5 L55 15 A40 40 0 0 1 85 45 L95 50 L85 55 A40 40 0 0 1 55 85 L50 95 L45 85 A40 40 0 0 1 15 55 L5 50 L15 45 A40 40 0 0 1 45 15 Z" fill="none" stroke="#00f0ff" strokeWidth="2"/>
                  <circle cx="50" cy="50" r="15" fill="none" stroke="#00f0ff" strokeWidth="2"/>
                </svg>
                
                <motion.div 
                  animate={{ rotate: [-20, 20, -20] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-12 h-64 border-4 border-[#ff0055]/50 rounded-full origin-bottom relative z-10"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-[#00f0ff] rounded-full flex items-center justify-center">
                     <div className="w-4 h-4 bg-[#ff0055] rounded-full animate-pulse" />
                  </div>
                </motion.div>
                <div className="w-48 h-32 bg-[#1e293b] rounded-t-full mt-[-20px] relative z-20 border-t-4 border-[#ff0055]" />
             </div>
          </div>


          {/* ======================================= */}
          {/* BOTTOM ROW (y: 100vh) */}
          {/* ======================================= */}

          {/* Room 4 (0, 100vh) - Empty / Blocked */}
          <div className="w-[100vw] h-[100vh] relative border-r border-[#1e293b] bg-black/50 flex items-center justify-center">
             <div className="text-[#1e293b] font-mono text-4xl rotate-45">AREA_RESTRICTED</div>
          </div>

          {/* Room 5 (100vw, 100vh) - Servers */}
          <div className="w-[100vw] h-[100vh] relative border-r border-[#1e293b] flex items-center justify-center p-24">
             <div className="max-w-2xl relative z-10">
               <Server className="w-16 h-16 text-[#00f0ff] mb-8" />
               <h2 className="text-5xl font-bold text-white mb-6">Ecosistemi PMI</h2>
               <p className="text-xl text-[#64748b] font-light leading-relaxed">
                 Gestionali su misura, sistemi distribuiti, monitoraggio. Sviluppo di infrastrutture robuste e invisibili che fanno funzionare l'azienda.
               </p>
             </div>
             {/* Scenery details: Server Racks */}
             <div className="absolute top-1/4 left-16 flex gap-6 opacity-60">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-32 h-[600px] border-2 border-[#00f0ff]/30 bg-[#0a0a0e] flex flex-col p-4 gap-4 rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                    <div className="w-full h-8 bg-[#1e293b] rounded flex items-center px-2 mb-4">
                      <div className="w-2 h-2 bg-[#00f0ff] rounded-full" />
                    </div>
                    {[...Array(12)].map((_, j) => (
                      <div key={j} className="w-full h-8 bg-[#1e293b]/50 border border-[#1e293b] rounded flex items-center px-3 justify-between">
                        <div className="flex gap-2">
                          <div className={`w-2 h-2 rounded-full ${Math.random() > 0.3 ? 'bg-[#00f0ff]' : 'bg-[#ff0055]'} animate-pulse`} style={{ animationDelay: `${Math.random()}s` }} />
                          <div className={`w-2 h-2 rounded-full ${Math.random() > 0.5 ? 'bg-[#00f0ff]' : 'bg-[#64748b]'}`} />
                        </div>
                        <div className="w-8 h-1 bg-[#00f0ff]/20" />
                      </div>
                    ))}
                  </div>
                ))}
             </div>
          </div>

          {/* Room 6 (200vw, 100vh) - Robotics / Games */}
          <div className="w-[100vw] h-[100vh] relative flex items-center justify-center p-24">
             <div className="max-w-2xl relative z-10 text-center">
               <Gamepad2 className="w-16 h-16 text-[#ff0055] mx-auto mb-8 animate-pulse" />
               <h2 className="text-5xl font-bold text-white mb-6">Interactive Worlds</h2>
               <p className="text-xl text-[#64748b] font-light leading-relaxed">
                 Game Design tecnico, mondi virtuali e meccaniche di interazione avanzate. Dove la rigidità del codice si piega all'espressione creativa.
               </p>
             </div>
             {/* Scenery details: Holographic Geometry */}
             <div className="absolute top-1/4 left-32 w-[600px] h-[600px] pointer-events-none perspective-[1000px]">
                <motion.div 
                  className="w-full h-full border border-[#00f0ff]/20"
                  animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="absolute inset-20 border-2 border-[#ff0055]/30 rounded-full" style={{ transform: 'translateZ(100px)' }} />
                  <div className="absolute inset-32 border-2 border-[#00f0ff]/40" style={{ transform: 'translateZ(-100px) rotate(45deg)' }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#ff0055] opacity-20 blur-xl" />
                </motion.div>
             </div>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
}
