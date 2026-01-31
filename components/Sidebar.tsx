
import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageCircle, 
  CheckCircle, 
  Activity, 
  History, 
  Settings, 
  Heart, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onLogout: () => void;
}

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, thumb: 'bg-gradient-to-br from-indigo-500 to-purple-500' },
  { id: 'chat', label: 'AI Companion', icon: <MessageCircle size={20} />, thumb: 'bg-gradient-to-br from-cyan-500 to-blue-500' },
  { id: 'mood-check', label: 'Mood Check-in', icon: <CheckCircle size={20} />, thumb: 'bg-gradient-to-br from-orange-400 to-rose-400' },
  { id: 'exercises', label: 'Guided Exercises', icon: <Activity size={20} />, thumb: 'bg-gradient-to-br from-emerald-400 to-teal-400' },
  { id: 'history', label: 'Mood History', icon: <History size={20} />, thumb: 'bg-gradient-to-br from-slate-400 to-slate-600' },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} />, thumb: 'bg-gradient-to-br from-violet-400 to-fuchsia-400' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <aside className="w-80 h-full bg-[#0a0c10] border-r border-white/5 flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Heart className="text-white fill-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">MindMenders</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">AI Sanctuary</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as TabType)}
            className={`w-full group relative flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 ${
              activeTab === item.id 
                ? 'bg-white/10 text-white' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            {/* Active Glow Pill */}
            {activeTab === item.id && (
              <motion.div layoutId="activePill" className="absolute left-[-24px] w-1.5 h-8 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
            )}
            
            {/* Soft Thumbnail */}
            <div className={`w-8 h-8 rounded-lg ${item.thumb} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white/40 group-hover:text-white/80`}>
              {/* Fix: Cast icon to any ReactElement to allow setting custom props like size and strokeWidth */}
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 14, strokeWidth: 3 })}
            </div>

            <span className="text-sm font-semibold tracking-wide flex-1 text-left">{item.label}</span>
            
            <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
        <div className="p-4 bg-white/5 rounded-2xl">
          <p className="text-xs text-slate-500 mb-1">Weekly Focus</p>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-2">
            <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-indigo-500" />
          </div>
          <p className="text-[10px] text-indigo-400 font-bold">65% of sessions complete</p>
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 text-slate-500 hover:text-rose-400 hover:bg-rose-400/5 rounded-2xl transition-all font-semibold text-sm"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
