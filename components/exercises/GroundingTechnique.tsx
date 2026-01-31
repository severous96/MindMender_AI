
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2 } from 'lucide-react';
import BackButton from '../ui/BackButton';

const STEPS = [
  { count: 5, label: 'Things you SEE', color: 'text-blue-400', glow: 'shadow-blue-500/20' },
  { count: 4, label: 'Things you can FEEL', color: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  { count: 3, label: 'Things you can HEAR', color: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
  { count: 2, label: 'Things you can SMELL', color: 'text-orange-400', glow: 'shadow-orange-500/20' },
  { count: 1, label: 'Thing you can TASTE', color: 'text-rose-400', glow: 'shadow-rose-500/20' }
];

interface GroundingTechniqueProps {
  onClose: () => void;
}

const GroundingTechnique: React.FC<GroundingTechniqueProps> = ({ onClose }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(s => s + 1);
    } else {
      setFinished(true);
      setTimeout(onClose, 2500);
    }
  };

  const currentStep = STEPS[stepIndex];

  return (
    <div className="glass-card p-12 rounded-[50px] border-white/10 relative overflow-hidden min-h-[600px] flex flex-col justify-center max-w-2xl mx-auto shadow-2xl">
      <div className="absolute top-8 left-8 z-20">
        <BackButton onClick={onClose} label="Exit Session" />
      </div>

      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Target size={160} />
      </div>

      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div 
            key={stepIndex}
            initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}
            className="space-y-10 relative z-10 pt-8"
          >
             <div className="space-y-3">
                <div className="flex items-center gap-5">
                   <div className={`w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-5xl font-black ${currentStep.color} shadow-2xl ${currentStep.glow}`}>
                      {currentStep.count}
                   </div>
                   <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">{currentStep.label}</h2>
                </div>
                <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-sm">Anchoring your awareness. Name them out loud to silence the mind.</p>
             </div>

             <div className="grid grid-cols-1 gap-3">
                {Array.from({ length: currentStep.count }).map((_, i) => (
                   <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.1 }}
                    key={`${stepIndex}-${i}`} 
                    className="flex items-center gap-4 bg-white/5 border border-white/5 p-5 rounded-3xl group hover:bg-white/10 transition-all cursor-pointer shadow-sm"
                   >
                      <div className={`w-3 h-3 rounded-full bg-slate-800 group-hover:${currentStep.color} transition-colors`} />
                      <span className="text-slate-500 group-hover:text-white transition-colors font-bold text-xs uppercase tracking-widest">Identify Item #{i+1}</span>
                   </motion.div>
                ))}
             </div>

             <button 
              onClick={handleNext}
              className="w-full bg-white text-indigo-900 py-6 rounded-3xl font-black shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
             >
               {stepIndex === STEPS.length - 1 ? 'Complete Grounding' : 'Next Category'}
             </button>
          </motion.div>
        ) : (
          <motion.div 
            key="finish"
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-8"
          >
             <div className="w-24 h-24 bg-emerald-500/20 border border-emerald-500/30 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/10">
                <CheckCircle2 className="text-emerald-400" size={56} />
             </div>
             <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Anchored in Now</h2>
                <p className="text-slate-500 text-base font-medium leading-relaxed max-w-sm mx-auto">You have successfully reclaimed your consciousness from the spiral.</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroundingTechnique;
