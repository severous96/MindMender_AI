
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Square, RefreshCcw } from 'lucide-react';
import Orb from './animations/Orb';

const BreathingTool: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('pause');
  const [timer, setTimer] = useState(0);

  const PHASES = {
    inhale: { duration: 4, text: "Inhale deeply..." },
    hold: { duration: 4, text: "Hold your breath..." },
    exhale: { duration: 4, text: "Exhale slowly..." },
    pause: { duration: 2, text: "Get ready..." }
  };

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev >= PHASES[phase].duration - 0.1) {
            // Switch phase
            if (phase === 'inhale') setPhase('hold');
            else if (phase === 'hold') setPhase('exhale');
            else if (phase === 'exhale') setPhase('pause');
            else setPhase('inhale');
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      setTimer(0);
      setPhase('pause');
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const getOrbScale = () => {
    if (!isActive) return 1;
    if (phase === 'inhale') return 1 + (timer / 4) * 0.8;
    if (phase === 'hold') return 1.8;
    if (phase === 'exhale') return 1.8 - (timer / 4) * 0.8;
    return 1;
  };

  const getOrbDistort = () => {
    if (phase === 'inhale') return 0.2 + (timer / 4) * 0.3;
    if (phase === 'hold') return 0.5;
    if (phase === 'exhale') return 0.5 - (timer / 4) * 0.3;
    return 0.2;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
      <div className="flex items-center gap-3 mb-8">
        <Wind className="w-6 h-6 text-indigo-500" />
        <h2 className="text-2xl font-bold">Box Breathing</h2>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64 flex items-center justify-center mb-12">
          <motion.div
            animate={{ scale: getOrbScale() }}
            transition={{ duration: 0.1, ease: "linear" }}
            className="w-full h-full"
          >
            <Orb 
              className="w-full h-full" 
              distort={getOrbDistort()} 
              speed={isActive ? 1 : 0.5} 
              color={phase === 'inhale' ? '#818cf8' : phase === 'exhale' ? '#34d399' : '#6366f1'} 
            />
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={phase + (isActive ? 'active' : 'inactive')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <span className="text-xl font-bold text-white drop-shadow-md text-center px-4">
                {isActive ? PHASES[phase].text : "Click Play to Start"}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-4">
          {!isActive ? (
            <button
              onClick={() => setIsActive(true)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center gap-2 transition-all shadow-lg"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Session
            </button>
          ) : (
            <button
              onClick={() => setIsActive(false)}
              className="px-8 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold rounded-2xl flex items-center gap-2 transition-all"
            >
              <Square className="w-5 h-5 fill-current" />
              Stop Session
            </button>
          )}
          
          <button
             onClick={() => { setIsActive(false); setTimer(0); setPhase('pause'); }}
             className="p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-8 text-sm text-slate-500 text-center max-w-xs leading-relaxed">
          Follow the orb's movement to regulate your nervous system. Inhale as it grows, hold at the peak, and exhale as it shrinks.
        </p>
      </div>
    </div>
  );
};

export default BreathingTool;
