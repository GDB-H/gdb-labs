import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import Logica from './pages/Logica';
import Archivi from './pages/Archivi';
import Dialogo from './pages/Dialogo';

// ==========================================
// PALETTE "Dark Blueprint"
// ==========================================
export const theme = {
  bg: '#0a0a0f',
  grid: '#1e293b',
  text: '#f1f5f9',
  muted: '#64748b',
  accentRed: '#ff0055', // keep original neon
  accentCyan: '#00f0ff', // keep original neon but base will be softer
};

// ==========================================
// BACKGROUND GRID
// ==========================================
const BackgroundGrid = () => (
  <div className="fixed inset-0 pointer-events-none z-[-2]" style={{ backgroundColor: theme.bg }}>
    <div 
      className="absolute inset-0 opacity-10" 
      style={{
        backgroundImage: `linear-gradient(${theme.grid} 1px, transparent 1px), linear-gradient(90deg, ${theme.grid} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center'
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-transparent to-[#050507]" />
  </div>
);

// ==========================================
// COMMAND BAR
// ==========================================
const CommandBar = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-8 py-4 rounded-full border border-[#1e293b] bg-[#050507]/80 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-3 pr-6 border-r border-[#1e293b]">
        <div className="w-2 h-2 bg-[#ff0055] rounded-full animate-pulse" />
        <Link to="/" className="font-mono text-xs tracking-widest text-white hover:text-[#00f0ff] transition-colors">SYS.ARCH</Link>
      </div>
      <div className="flex items-center gap-6 font-mono text-[10px] tracking-widest uppercase text-[#64748b]">
        <Link to="/logica" className={`transition-colors ${location.pathname === '/logica' ? 'text-[#00f0ff]' : 'hover:text-[#00f0ff]'}`}>Logica</Link>
        <Link to="/archivi" className={`transition-colors ${location.pathname === '/archivi' ? 'text-[#00f0ff]' : 'hover:text-[#00f0ff]'}`}>Archivi</Link>
        <Link to="/dialogo" className={`transition-colors ${location.pathname === '/dialogo' ? 'text-[#ff0055]' : 'hover:text-[#ff0055]'}`}>Dialogo</Link>
      </div>
    </div>
  );
};

// ==========================================
// VISITOR INTRUSION HUD
// ==========================================
const VisitorIntrusionHUD = () => {
  const [visitorData, setVisitorData] = useState({
    ip: 'DETECTING...',
    location: 'TRACING...',
    isp: 'SCANNING...',
    os: 'UNKNOWN',
    cores: 'UNKNOWN',
    res: 'UNKNOWN'
  });

  useEffect(() => {
    const os = navigator.platform || 'UNKNOWN';
    const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} CORES` : 'UNKNOWN';
    const res = `${window.screen.width}x${window.screen.height}`;
    
    setVisitorData(prev => ({ ...prev, os, cores, res }));

    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if(data.ip) {
          setVisitorData(prev => ({
            ...prev,
            ip: data.ip,
            location: `${data.city}, ${data.country_name}`,
            isp: data.org || 'UNKNOWN'
          }));
        }
      })
      .catch(() => {
        setVisitorData(prev => ({...prev, ip: 'ANONYMIZED', location: 'PROXY DETECTED', isp: 'UNKNOWN'}));
      });
  }, []);

  return (
    <div className="fixed top-8 right-8 z-50 flex flex-col items-end pointer-events-none font-mono text-[10px] tracking-widest text-[#00f0ff] uppercase text-right">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-[#ff0055] animate-pulse rounded-full" />
        <span className="text-[#ff0055]">TARGET ACQUIRED</span>
      </div>
      <p className="text-[#64748b]"><span className="text-slate-300">{visitorData.ip}</span> :IP_ADDR</p>
      <p className="text-[#64748b]"><span className="text-slate-300">{visitorData.location}</span> :GEO_LOC</p>
      <p className="text-[#64748b]"><span className="text-slate-300">{visitorData.isp}</span> :NET_ISP</p>
      <div className="w-full h-[1px] bg-[#1e293b] my-2" />
      <p className="text-[#64748b]"><span className="text-slate-300">{visitorData.os}</span> :SYS_ENV</p>
      <p className="text-[#64748b]"><span className="text-slate-300">{visitorData.cores}</span> :SYS_CPU</p>
      <p className="text-[#64748b]"><span className="text-slate-300">{visitorData.res}</span> :DISPLAY</p>
    </div>
  );
};

// ==========================================
// MAIN ROUTER
// ==========================================
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/logica" element={<Logica />} />
        <Route path="/archivi" element={<Archivi />} />
        <Route path="/dialogo" element={<Dialogo />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative w-full min-h-screen text-slate-100 font-sans selection:bg-[#ff0055] selection:text-white">
        <BackgroundGrid />
        <CommandBar />
        
        {/* HUD - Heads Up Display (Fixed Top Right) */}
        <VisitorIntrusionHUD />

        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}