
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, label = "Back" }) => {
  return (
    <motion.button
      whileHover={{ x: -4, backgroundColor: "rgba(30, 41, 59, 0.6)" }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-slate-800/40 border border-slate-700/40 rounded-xl text-slate-200 text-sm font-medium transition-all group hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
    >
      <ArrowLeft size={16} className="group-hover:text-cyan-400 transition-colors" />
      <span className="group-hover:text-white transition-colors">{label}</span>
    </motion.button>
  );
};

export default BackButton;
