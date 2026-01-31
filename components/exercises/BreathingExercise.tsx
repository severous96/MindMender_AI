
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import FloatingOrbScene from '../animations/FloatingOrb';
import BackButton from '../ui/BackButton';

const PHASES = [
  { label: 'Inhale', duration: 4, text: 'Fill your lungs with light...' },
  { label: 'Hold', duration: 4, text: 'Hold the peace within...' },
  { label: 'Exhale', duration: 4, text: 'Release the tension...' },
  { label: 'Hold', duration: 4, text: 'Rest in the stillness...' }
];

interface BreathingExerciseProps {
  onClose: () => void;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isActive) {
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setPhaseIndex(p => (p + 1) % PHASES.length);
            return 0;
          }
          return prev + (100 / (PHASES[phaseIndex].duration * 10)); // 10 ticks per second
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isActive, phaseIndex]);

  const currentPhase = PHASES[phaseIndex];

  return (
    <div className="glass-card p-12 rounded-[50px] border-white/10 overflow-hidden relative max-w-2xl mx-auto shadow-2xl">
      <div className="absolute top-8 left-8 z-20">
        <BackButton onClick={onClose} label="Exit Lab" />
      </div>

      <div className="flex flex-col items-center space-y-12 text-center pt-8">
        <header className="space-y-2">
           <h2 className="text-3xl font-bold text-white tracking-tight uppercase">Box Breathing</h2>
           <p className="text-slate-500 font-medium text-sm">Nervous system regulation (4-4-4-4)</p>
        </header>

        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
           <motion.div 
              animate={{ 
                scale: isActive ? (phaseIndex === 0 ? [1, 1.8] : phaseIndex === 2 ? [1.8, 1] : phaseIndex === 1 ? 1.8 : 1) : 1,
                opacity: isActive ? 1 : 0.6
              }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <FloatingOrbScene />
            </motion.div>
            <div className="z-10 bg-black/40 backdrop-blur-xl px-8 py-3 rounded-3xl border border-white/10 shadow-2xl">
               <span className="text-xl font-black text-white tracking-[0.2em] uppercase">{isActive ? currentPhase.label : 'Begin'}</span>
            </div>
        </div>

        <div className="space-y-8 w-full max-w-sm">
           <AnimatePresence mode="wait">
             <motion.p 
               key={phaseIndex} 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -10 }}
               className="text-indigo-300 font-bold h-6 uppercase tracking-widest text-xs"
             >
               {isActive ? currentPhase.text : 'Find your rhythm. Calm your mind.'}
             </motion.p>
           </AnimatePresence>

           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 bg-[length:200%_100%]"
                style={{ transition: 'width 0.1s linear' }}
              />
           </div>

           <div className="flex items-center justify-center gap-6">
              <button 
                onClick={() => { setIsActive(false); setPhaseIndex(0); setProgress(0); }}
                className="p-5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-3xl transition-all active:scale-95"
              >
                <RotateCcw size={24} />
              </button>
              <button 
                onClick={() => setIsActive(!isActive)}
                className="w-20 h-20 bg-white text-indigo-700 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/20 hover:scale-105 transition-all active:scale-95"
              >
                {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
