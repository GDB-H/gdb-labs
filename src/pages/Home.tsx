import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Terminal, Database, Network, Box, Gamepad2, ChevronsDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SvgLevelProg, SvgLevelGest, SvgLevelCons, SvgLevelStampa3D, SvgLevelGames, SvgDefs } from '../components/TowerSVGs';

// ----------------------------------------------------
// FLOOR COMPONENT
// ----------------------------------------------------
const FloorSection = ({ 
  SvgComponent, 
  title, 
  sectionNum, 
  icon: Icon, 
  description, 
  tags, 
  linkTo, 
  linkText 
}: any) => {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // We track the scroll of this specific 250vh container
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  // Facade animates out between 0 and 0.4
  const facadeScale = useTransform(scrollYProgress, [0, 0.4], [1, 8]);
  const facadeOpacity = useTransform(scrollYProgress, [0.2, 0.4], [1, 0]);
  
  // Interior animates in between 0.3 and 0.5
  const interiorScale = useTransform(scrollYProgress, [0.3, 0.5], [0.85, 1]);
  const interiorOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const interiorY = useTransform(scrollYProgress, [0.3, 0.5], [40, 0]);

  // Fade out everything when leaving this floor (0.8 -> 1.0)
  const wrapperOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  return (
    <div ref={targetRef} className="relative h-[250vh] w-full border-b border-[#1e293b]">
      <motion.div 
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden" 
        style={{ opacity: wrapperOpacity }}
      >
        
        {/* Facade SVG */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          style={{ scale: facadeScale, opacity: facadeOpacity, transformOrigin: 'center center' }}
        >
          <div className="w-full h-full max-w-6xl mx-auto flex items-center justify-center">
            <SvgComponent />
          </div>
        </motion.div>

        {/* Interior Content Box */}
        <motion.div 
          className="relative z-20 w-[85%] max-w-[850px] p-8 md:p-14 bg-[#0a0a0f]/95 border border-[#1e293b] shadow-[12px_12px_0_rgba(0,240,255,0.05)] backdrop-blur-xl"
          style={{ scale: interiorScale, opacity: interiorOpacity, y: interiorY }}
        >
          <div className="flex items-center mb-8">
            <div className="p-4 rounded-lg mr-6 border border-[#1e293b] bg-[#050507]">
              <Icon className="w-10 h-10 text-[#00f0ff]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#64748b] mb-1 font-mono tracking-widest">
                SEZIONE {sectionNum} //
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{title}</h2>
            </div>
          </div>
          
          <p className="text-lg md:text-xl mb-10 leading-relaxed text-[#f1f5f9] font-light">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-3 font-mono text-xs font-bold mb-10">
            {tags.map((tag: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-[#00f0ff]/10 text-[#00f0ff] rounded border border-[#00f0ff]/30">
                {tag}
              </span>
            ))}
          </div>

          {linkTo && (
            <Link 
              to={linkTo} 
              className="inline-flex items-center justify-center pointer-events-auto relative z-50 px-8 py-4 border border-[#00f0ff] text-[#00f0ff] uppercase tracking-widest font-mono text-sm hover:bg-[#00f0ff] hover:text-[#050507] transition-all transform hover:scale-105"
            >
              {linkText}
            </Link>
          )}
        </motion.div>
        
      </motion.div>
    </div>
  );
};

// ----------------------------------------------------
// HOME PAGE COMPONENT
// ----------------------------------------------------
export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 flex flex-col items-center w-full bg-[#050507]"
    >
      <SvgDefs />

      {/* INTRO HERO */}
      <section className="h-screen w-full flex flex-col justify-center items-center relative z-20">
        <div className="border border-[#1e293b] p-8 md:p-12 bg-[#0a0a0f] relative shadow-2xl max-w-4xl w-full mx-4">
          <div className="absolute top-0 left-0 w-full h-8 border-b border-[#1e293b] flex">
            <div className="w-1/2 border-r border-[#1e293b] px-4 flex items-center text-[10px] font-bold text-[#64748b] tracking-widest font-mono">CLIENTE: GABRIELE BOFFA</div>
            <div className="w-1/4 border-r border-[#1e293b] px-4 flex items-center text-[10px] font-bold text-[#64748b] tracking-widest font-mono">SCALA: N/A</div>
            <div className="w-1/4 px-4 flex items-center text-[10px] font-bold text-[#00f0ff] tracking-widest font-mono">SYS: ONLINE</div>
          </div>
          <div className="mt-8 text-center">
            <h1 className="text-5xl md:text-8xl font-black mb-2 tracking-tighter text-white">
              GDB<span className="text-[#00f0ff]">LABS</span>
            </h1>
            <h2 className="text-lg md:text-2xl font-bold border-t border-b border-[#1e293b] py-3 mb-8 uppercase tracking-widest text-[#64748b]">
              Architettura Multipotenziale
            </h2>
            <div className="text-sm text-[#f1f5f9] font-mono text-left bg-[#050507] p-6 border border-[#1e293b] leading-relaxed">
              <span className="text-[#00f0ff]">&gt; DESCRIZIONE ELABORATO:</span><br/>
              Sezione trasversale della struttura operativa ("Ducklair Tower"). Il presente documento illustra l'integrazione tra logica software, analisi gestionale, hardware e visione d'insieme.<br/><br/>
              <span className="text-[#00f0ff]">&gt; ISTRUZIONI:</span><br/>
              Scorrere verso il basso per l'ispezione dei livelli. Il rendering vettoriale rivelerà i dettagli strutturali.
            </div>
          </div>
        </div>
        
        <motion.div 
          className="absolute bottom-10 flex flex-col items-center font-bold text-[#00f0ff]"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] uppercase tracking-widest mb-2 font-mono">Avvia Ispezione</span>
          <ChevronsDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* TOWER FLOORS */}
      
      <FloorSection
        SvgComponent={SvgLevelProg}
        title="Programmazione"
        sectionNum="01"
        icon={Terminal}
        description="Il cervello operativo della struttura. Sviluppo di architetture logiche solide, API robuste e codice pulito per il controllo e l'automazione dei processi. Dalla riga di comando alla messa in produzione."
        tags={['PYTHON', 'JAVASCRIPT', 'ARCHITETTURE SW']}
        linkTo="/logica"
        linkText="Accedi alla Logica"
      />

      <FloorSection
        SvgComponent={SvgLevelGest}
        title="Sistemi Gestionali"
        sectionNum="02"
        icon={Database}
        description="Organizzazione matematica della realtà aziendale. Progettazione di database relazionali e software ERP/Gestionali capaci di mappare processi complessi, ottimizzare le risorse e fornire dati precisi per la dashboard direzionale."
        tags={['SQL / NO-SQL', 'ERP DESIGN', 'AUTOMAZIONE FLUSSI']}
        linkTo="/archivi"
        linkText="Consulta gli Archivi"
      />

      <FloorSection
        SvgComponent={SvgLevelCons}
        title="Consulenza"
        sectionNum="03"
        icon={Network}
        description="L'approccio trasversale ai problemi. Decifrare le vere necessità dietro le richieste del cliente, analizzare la fattibilità tecnica, le normative (es. ATEX) e progettare la strada più logica e sicura prima di scrivere codice."
        tags={['PROBLEM SOLVING', 'ANALISI NORMATIVA', 'DESIGN DI SISTEMA']}
        linkTo="/dialogo"
        linkText="Inizia Trasmissione"
      />

      <FloorSection
        SvgComponent={SvgLevelStampa3D}
        title="Stampa 3D"
        sectionNum="04"
        icon={Box}
        description="Il bisogno vitale di toccare con mano. Dal software alla plastica estrusa: modellazione 3D CAD per ingegnerizzare pezzi meccanici, supporti personalizzati o concept artistici. L'idea astratta diventa materia solida."
        tags={['CAD MODELING', 'FDM / SLA', 'PROTOTIPAZIONE RAPIDA']}
      />

      <FloorSection
        SvgComponent={SvgLevelGames}
        title="Videogiochi"
        sectionNum="05"
        icon={Gamepad2}
        description="Il livello più profondo, dove razionalità e immaginazione si fondono. Progettare videogiochi significa creare mondi retti da leggi matematiche, intrecciandoli con narrativa, estetica e pura interattività."
        tags={['GAME DESIGN', 'UNITY / C#', 'WORLD BUILDING']}
      />

      {/* FOOTER */}
      <section className="h-[60vh] w-full flex flex-col justify-center items-center bg-[#050507] border-t border-[#1e293b] font-mono">
        <div className="border border-[#1e293b] p-10 text-center max-w-2xl bg-[#0a0a0f]">
          <div className="w-12 h-12 mx-auto mb-6 border-2 border-[#00f0ff] rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-[#00f0ff] rounded-full animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white tracking-widest">GDB LABS // FINE ISPEZIONE</h2>
          <p className="text-[#64748b] mb-10 text-xs leading-relaxed">
            Tutti i sistemi sono operativi. Livelli di sicurezza stabili.<br/>
            Pronto per l'assegnazione di nuovi carichi di lavoro.
          </p>
          <Link to="/dialogo" className="inline-block px-8 py-4 border border-[#ff0055] text-[#ff0055] hover:bg-[#ff0055] hover:text-black transition-colors text-xs font-bold tracking-widest uppercase">
            Contatta Sistema
          </Link>
        </div>
        <div className="mt-12 text-[10px] text-[#334155] tracking-widest">
          STRUTTURA MULTIPOTENZIALE CENSITA: V.4.0.0
        </div>
      </section>

    </motion.div>
  );
}
