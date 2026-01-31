
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Check } from 'lucide-react';
import BackButton from '../ui/BackButton';

interface GratitudeJournalProps {
  onClose: () => void;
}

const GratitudeJournal: React.FC<GratitudeJournalProps> = ({ onClose }) => {
  const [items, setItems] = useState<string[]>(['', '', '']);
  const [saved, setSaved] = useState(false);

  const updateItem = (i: number, val: string) => {
    const next = [...items];
    next[i] = val;
    setItems(next);
  };

  const submit = () => {
    if (items.some(it => it.trim())) {
      setSaved(true);
      setTimeout(onClose, 2000);
    }
  };

  return (
    <div className="glass-card p-12 rounded-[50px] border-white/10 relative overflow-hidden max-w-2xl mx-auto shadow-2xl">
      <div className="absolute top-8 left-8 z-20">
        <BackButton onClick={onClose} label="Exit Exercise" />
      </div>
      
      <div className="absolute top-[-10%] left-[-10%] w-60 h-60 bg-emerald-500/10 blur-[80px] pointer-events-none" />
      
      <div className="relative space-y-10 pt-8">
        <header className="text-center space-y-2">
           <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-lg">
              <Heart className="text-emerald-400" size={32} />
           </div>
           <h2 className="text-3xl font-bold text-white tracking-tight uppercase">Daily Gratitude</h2>
           <p className="text-slate-500 font-medium text-sm">Focus on the light in your life today.</p>
        </header>

        <AnimatePresence mode="wait">
          {!saved ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {items.map((it, i) => (
                <div key={i} className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 font-black text-xs group-focus-within:text-emerald-500 transition-colors tracking-widest">{i + 1}</span>
                  <input 
                    value={it} 
                    onChange={e => updateItem(i, e.target.value)}
                    placeholder="Today, I am grateful for..."
                    className="w-full bg-[#0d1015] border border-slate-800 rounded-3xl py-6 pl-14 pr-6 outline-none focus:border-emerald-500/50 text-white placeholder:text-slate-800 transition-all font-medium text-sm"
                  />
                </div>
              ))}
              <button 
                onClick={submit}
                disabled={!items.some(it => it.trim())}
                className="w-full bg-emerald-600 py-6 rounded-3xl font-black text-white shadow-2xl shadow-emerald-900/40 hover:bg-emerald-500 disabled:opacity-20 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs mt-6"
              >
                Save My Reflections
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="py-16 text-center space-y-6"
            >
              <div className="w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center mx-auto text-white shadow-2xl shadow-emerald-500/40 animate-pulse">
                <Check size={48} strokeWidth={3} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Gratitude Saved</h3>
                <p className="text-slate-500 font-medium">Your heart is now more aligned with abundance.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GratitudeJournal;
