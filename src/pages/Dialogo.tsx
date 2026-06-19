import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

export default function Dialogo() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('IDLE'); // IDLE, SENDING, SUCCESS

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SENDING');
    setTimeout(() => setStatus('SUCCESS'), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex flex-col justify-center items-center px-8 text-center pt-20 pb-32"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00f0ff] opacity-[0.02] rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="w-full max-w-2xl relative z-10 text-left">
        <div className="mb-12 border-l-2 border-[#ff0055] pl-6">
          <h2 className="text-sm font-mono tracking-[0.4em] text-[#ff0055] uppercase mb-4">Terminale di Contatto</h2>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">Avvia Dialogo.</h1>
          <p className="text-[#64748b] font-mono text-xs mt-4 uppercase">Secured Connection // AES-256</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0a0a0e] border border-[#1e293b] p-8 font-mono">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-[#1e293b]">
            <Terminal className="text-[#00f0ff] w-5 h-5" />
            <span className="text-[#00f0ff] text-sm tracking-widest uppercase">GDB_LABS_ROOT_ACCESS</span>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs text-[#64748b] mb-2 uppercase tracking-widest">&gt;&gt; Identificativo_Utente</label>
              <input 
                type="text" 
                required
                className="w-full bg-transparent border-b border-[#1e293b] text-white focus:border-[#00f0ff] focus:outline-none transition-colors py-2 text-sm"
                placeholder="_"
                value={formState.name}
                onChange={e => setFormState({...formState, name: e.target.value})}
                disabled={status !== 'IDLE'}
              />
            </div>
            <div>
              <label className="block text-xs text-[#64748b] mb-2 uppercase tracking-widest">&gt;&gt; Protocollo_Ritorno (Email)</label>
              <input 
                type="email" 
                required
                className="w-full bg-transparent border-b border-[#1e293b] text-white focus:border-[#00f0ff] focus:outline-none transition-colors py-2 text-sm"
                placeholder="_"
                value={formState.email}
                onChange={e => setFormState({...formState, email: e.target.value})}
                disabled={status !== 'IDLE'}
              />
            </div>
            <div>
              <label className="block text-xs text-[#64748b] mb-2 uppercase tracking-widest">&gt;&gt; Payload (Dettagli Progetto)</label>
              <textarea 
                required
                rows={5}
                className="w-full bg-[#050507] border border-[#1e293b] text-white focus:border-[#00f0ff] focus:outline-none transition-colors p-4 text-sm mt-2 resize-none"
                placeholder="Inserire specifiche architetturali..."
                value={formState.message}
                onChange={e => setFormState({...formState, message: e.target.value})}
                disabled={status !== 'IDLE'}
              />
            </div>

            <div className="pt-8 flex justify-end">
              <button 
                type="submit" 
                disabled={status !== 'IDLE'}
                className="relative inline-flex items-center justify-center gap-4 px-8 py-4 bg-transparent border border-[#ff0055] text-[#ff0055] text-xs tracking-widest uppercase hover:bg-[#ff0055] hover:text-black transition-all duration-300 group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'IDLE' && (
                  <>
                    <div className="absolute top-0 left-0 w-1 h-full bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                    Inizializza Trasmissione
                  </>
                )}
                {status === 'SENDING' && 'ENCRYPTING & SENDING...'}
                {status === 'SUCCESS' && 'PAYLOAD DELIVERED'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
