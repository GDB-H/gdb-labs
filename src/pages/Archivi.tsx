import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Gamepad2, Code, Box } from 'lucide-react';

const projects = [
  { tag: "LOGIC", title: "Gestionali PMI", icon: Terminal, desc: "Sviluppo di piattaforme gestionali sartoriali. Traduco processi complessi in interfacce pulite.", details: ["Node.js", "React", "PostgreSQL", "Docker"], img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000" },
  { tag: "GAMES", title: "Interactive Worlds", icon: Gamepad2, desc: "Programmazione logica e sviluppo meccaniche. Mondi dove estetica e codice si fondono coerentemente.", details: ["Unity 3D", "C#", "Unreal Engine", "Blueprints"], img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000" },
  { tag: "WEB", title: "App & Client Custom", icon: Code, desc: "Applicazioni web ad alte prestazioni pensate per risolvere problemi specifici reali.", details: ["Next.js", "TypeScript", "TailwindCSS", "Framer Motion"], img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" },
  { tag: "HARDWARE", title: "Prototipazione 3D", icon: Box, desc: "Modellazione e stampa 3D. Dal concept digitale all'oggetto fisico, ottimizzando materiali e geometrie.", details: ["Fusion 360", "BambuLab", "PLA/PETG", "CNC"], img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2000" }
];

export default function Archivi() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-48 w-full px-8 md:px-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-32 text-right">
          <h2 className="text-sm font-mono tracking-[0.4em] text-[#ff0055] uppercase mb-4">Database</h2>
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white leading-[1.1]">Archivi</h1>
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-[#64748b] font-serif italic leading-[1.1]">Selezionati.</h1>
        </div>
        
        <div className="relative">
          {projects.map((proj, idx) => (
            <div key={idx} className="sticky group" style={{ top: `${15 + (idx * 2)}vh`, marginBottom: '15vh' }}>
              <div className="block w-full h-[75vh] bg-[#050507] rounded-3xl overflow-hidden relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-[#1e293b] transition-transform duration-500 ease-out hover:scale-[0.98]">
                <div className="absolute inset-0 bg-cover bg-center transition-all duration-[2s] ease-out group-hover:scale-105 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-70 mix-blend-luminosity group-hover:mix-blend-normal" style={{ backgroundImage: `url(${proj.img})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/80 to-transparent z-10 opacity-100 transition-opacity duration-700 group-hover:opacity-80"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white transition-transform duration-1000 scale-[2] opacity-[0.02] z-10"><proj.icon className="w-96 h-96" /></div>
                
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-20 flex flex-col md:flex-row justify-between items-end gap-12">
                  <div className="max-w-3xl transform transition-transform duration-500 group-hover:translate-x-4 flex-1">
                    <p className="text-[#00f0ff] font-mono text-sm mb-4 tracking-[0.2em] flex items-center gap-4"><span className="w-8 h-[1px] bg-[#00f0ff] block"></span>{proj.tag}</p>
                    <h3 className="text-4xl md:text-7xl font-bold text-white mb-4 tracking-tighter">{proj.title}</h3>
                    <p className="text-[#64748b] text-lg font-light leading-relaxed max-w-xl">{proj.desc}</p>
                  </div>
                  <div className="pb-2 transform transition-transform duration-500 group-hover:-translate-y-2 text-right">
                    <p className="text-[#ff0055] font-mono text-xs mb-4 tracking-[0.2em]">TECH_STACK</p>
                    <div className="flex flex-col gap-2">
                      {proj.details.map(tech => (
                         <span key={tech} className="text-[#f1f5f9] font-mono text-sm border border-[#1e293b] bg-[#050507]/50 px-4 py-2 rounded-lg backdrop-blur-sm">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
