
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Sparkles, 
  Wind, 
  MessageSquare, 
  PenTool, 
  Target, 
  ArrowRight,
  Send,
  Loader2,
  Bot,
  User as UserIcon,
  Smile, Frown, AlertCircle, Zap,
  Activity,
  History,
  Settings as SettingsIcon,
  Moon,
  Clock,
  Palette,
  ChevronRight,
  X,
  ShieldAlert,
  Camera,
  Bell,
  Lock,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { User, MoodType, MoodEntry, ChatMessage, TabType } from '../types';
import { db } from '../lib/db';
import { getGeminiResponse } from '../services/geminiService';
import BreathingExercise from './exercises/BreathingExercise';
import GratitudeJournal from './exercises/GratitudeJournal';
import GroundingTechnique from './exercises/GroundingTechnique';
import BackButton from './ui/BackButton';

interface DashboardProps {
  activeTab: TabType;
  user: User;
  setActiveTab: (tab: TabType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activeTab, user, setActiveTab }) => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Show loader only if we have no data yet
      if (moods.length === 0 && chats.length === 0) {
        setIsInitialLoading(true);
      }
      try {
        const [moodData, chatData] = await Promise.all([
          db.getMoods(user.id),
          db.getChats(user.id)
        ]);
        setMoods(moodData);
        setChats(chatData);
      } catch (error) {
        console.error("Dashboard synchronization error:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchData();
  }, [user.id, activeTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, isTyping]);

  const detectCrisis = (text: string) => {
    const keywords = ['suicide', 'kill myself', 'self-harm', 'end it all', 'die', 'cutting'];
    return keywords.some(k => text.toLowerCase().includes(k));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const content = input;
    setInput('');
    
    if (detectCrisis(content)) {
      setShowCrisisBanner(true);
    }

    try {
      // 1. Persist User Message to Supabase
      const savedUserMsg = await db.addChat({ userId: user.id, role: 'user', content });
      setChats(prev => [...prev, savedUserMsg]);
      
      setIsTyping(true);

      // 2. Prepare context for Gemini (last 10 messages for continuity)
      const historyData = chats.slice(-10).map(c => ({ role: c.role, content: c.content }));
      
      // 3. Request Gemini AI Response
      const responseText = await getGeminiResponse(historyData, content);
      
      // 4. Persist AI Message to Supabase
      const savedAiMsg = await db.addChat({ userId: user.id, role: 'ai', content: responseText });
      setChats(prev => [...prev, savedAiMsg]);
    } catch (error: any) {
      console.error("Chat failure:", error);
      // Fallback local UI error message if DB fails
      const errorMsg: ChatMessage = {
        id: 'error-' + Date.now(),
        userId: user.id,
        role: 'ai',
        content: "I'm having trouble connecting to my memory banks right now, but I'm still here for you. Is there something specific on your mind?",
        createdAt: Date.now()
      };
      setChats(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const containerVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (isInitialLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
        <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           className="p-1 rounded-full border-t-2 border-indigo-500"
        >
          <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center">
            <Sparkles className="text-indigo-500 w-5 h-5 animate-pulse" />
          </div>
        </motion.div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Synching Sanctuary</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {showCrisisBanner && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-rose-600/20 border border-rose-500/50 rounded-3xl p-6 flex items-start gap-4 shadow-xl z-50"
          >
            <ShieldAlert className="text-rose-400 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h4 className="text-rose-100 font-bold text-sm uppercase tracking-wider mb-1">Support is here for you</h4>
              <p className="text-rose-200/70 text-sm leading-relaxed">
                You matter. Please consider reaching out to a professional. You can call or text <span className="text-white font-bold">988</span> in the USA, or contact your local emergency services immediately.
              </p>
            </div>
            <button onClick={() => setShowCrisisBanner(false)} className="text-rose-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === 'dashboard' && (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="space-y-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">Focusing on you, {user.name.split(' ')[0]}</h1>
              <p className="text-sm md:text-lg text-slate-500 font-medium tracking-tight">Cloud-synced. Your sanctuary is secure.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 space-y-8">
              <motion.section 
                whileHover={{ scale: 1.005 }}
                className="relative p-10 md:p-14 rounded-[50px] overflow-hidden group cursor-pointer shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-indigo-900 to-slate-900" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
                
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 shadow-xl">
                    <Sparkles size={12} className="text-cyan-400" /> System Recommended
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white max-w-2xl leading-[1.1] tracking-tighter">Quiet the noise within with Box Breathing.</h2>
                  <p className="text-base md:text-xl text-indigo-100/70 max-w-lg leading-relaxed font-medium">Reset your nervous system and lower cortisol levels in under 3 minutes.</p>
                  <button 
                    onClick={() => setActiveTab('exercises')}
                    className="bg-white text-indigo-900 px-8 py-4 rounded-[24px] font-black text-sm md:text-base flex items-center gap-4 shadow-2xl hover:bg-indigo-50 transition-all active:scale-95 group"
                  >
                    Start Guided Meditation <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.section>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <ExerciseCard icon={<Wind />} title="Breathing" color="bg-cyan-600 shadow-cyan-600/20" onClick={() => setActiveTab('exercises')} />
                 <ExerciseCard icon={<PenTool />} title="Journal" color="bg-emerald-600 shadow-emerald-600/20" onClick={() => setActiveTab('exercises')} />
                 <ExerciseCard icon={<Target />} title="Anchor" color="bg-orange-600 shadow-orange-600/20" onClick={() => setActiveTab('exercises')} />
              </div>
            </div>

            <div className="md:col-span-4 space-y-8">
               <section className="glass-card p-10 rounded-[50px] space-y-10 shadow-2xl border border-white/5 bg-[#0d1015]">
                  <h3 className="text-xs font-black flex items-center gap-3 text-slate-500 tracking-[0.3em] uppercase">
                     Personal Pulse
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => setActiveTab('mood-check')} className="p-6 rounded-[32px] bg-[#1a1d24] border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all text-center space-y-3 shadow-sm group">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                          <Smile className="text-emerald-400 w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Log Mood</p>
                     </button>
                     <button onClick={() => setActiveTab('history')} className="p-6 rounded-[32px] bg-[#1a1d24] border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all text-center space-y-3 shadow-sm group">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                          <History className="text-cyan-400 w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Insights</p>
                     </button>
                  </div>
                  <div className="pt-8 border-t border-white/5">
                     <p className="text-[10px] text-slate-600 mb-8 font-black uppercase tracking-[0.2em]">Energy Matrix (7D)</p>
                     <div className="flex items-end gap-3 h-24 px-1">
                        {[40, 70, 45, 90, 65, 55, 80].map((h, i) => (
                          <div key={i} className="flex-1 bg-white/5 rounded-2xl relative group overflow-hidden">
                             <motion.div 
                                initial={{ height: 0 }} 
                                animate={{ height: `${h}%` }} 
                                className={`absolute bottom-0 left-0 right-0 rounded-2xl ${i === 6 ? 'bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-slate-700 opacity-40'}`} 
                             />
                          </div>
                        ))}
                     </div>
                  </div>
               </section>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'chat' && (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="h-[calc(100vh-140px)] flex flex-col max-w-4xl mx-auto">
          <div className="mb-6 flex justify-start">
            <BackButton onClick={() => setActiveTab('dashboard')} />
          </div>
          <header className="mb-10 flex items-center justify-between">
             <div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">AI Companion</h2>
                <p className="text-sm md:text-base text-slate-500 font-medium mt-1 uppercase tracking-widest">Powered by Gemini 3 Flash</p>
             </div>
             <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center border-4 border-[#0a0c10] shadow-2xl"><Bot size={32} className="text-white" /></div>
          </header>

          <div className="flex-1 overflow-y-auto space-y-8 pr-4 mb-8 scrollbar-hide">
            {chats.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 text-slate-500 max-w-sm mx-auto opacity-50">
                 <div className="w-20 h-20 rounded-[40px] bg-white/5 border border-white/5 flex items-center justify-center text-indigo-400"><MessageSquare size={40} /></div>
                 <p className="text-lg leading-relaxed font-medium uppercase tracking-widest text-xs">How is your heart today? I am here to witness your truth.</p>
              </div>
            )}
            {chats.map((chat) => (
              <div key={chat.id} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`flex gap-5 max-w-[85%] ${chat.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-2xl border border-white/5 ${chat.role === 'user' ? 'bg-indigo-600' : 'bg-[#1a1d24]'}`}>
                      {chat.role === 'user' ? <UserIcon size={24} className="text-white" /> : <Bot size={24} className="text-cyan-400" />}
                    </div>
                    <div className={`p-6 rounded-[32px] text-base leading-relaxed shadow-xl font-medium ${chat.role === 'user' ? 'bg-indigo-800 text-white rounded-tr-none' : 'bg-[#1a1d24] text-slate-200 rounded-tl-none border border-white/5'}`}>
                      {chat.content}
                    </div>
                 </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex justify-start">
                 <div className="flex gap-5 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#1a1d24] border border-white/5 flex items-center justify-center shadow-xl"><Bot size={24} className="text-cyan-400" /></div>
                    <div className="p-6 bg-[#1a1d24] border border-white/5 rounded-[32px] rounded-tl-none flex gap-2 items-center shadow-xl">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                 </div>
               </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="relative group mb-4">
             <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Speak your truth to MindMenders AI..."
                className="w-full bg-[#161a21] border border-slate-800 rounded-[32px] py-6 pl-10 pr-24 outline-none focus:border-indigo-600/50 transition-all text-white placeholder:text-slate-700 text-lg shadow-2xl"
             />
             <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 text-white rounded-[24px] hover:bg-indigo-500 disabled:opacity-30 transition-all active:scale-95 shadow-xl"
             >
                {isTyping ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send size={24} />}
             </button>
          </form>
          <div className="text-[9px] text-slate-700 uppercase tracking-widest text-center mt-2 px-10">
            MindMenders AI is a supportive companion, not a replacement for clinical psychiatric help.
          </div>
        </motion.div>
      )}

      {activeTab === 'exercises' && (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="space-y-12 max-w-5xl mx-auto">
          <div className="flex justify-start mb-4">
            <BackButton onClick={() => setActiveTab('dashboard')} />
          </div>
          <header className="text-center space-y-3">
             <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Exercise Lab</h2>
             <p className="text-slate-500 text-base md:text-lg font-medium tracking-tight uppercase tracking-widest">Nervous system regulation tools</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <ExerciseItem icon={<Wind size={44} />} title="Box Breathing" desc="Regulate your nervous system via controlled respiratory pacing (4-4-4-4)." color="text-cyan-400" Component={BreathingExercise} />
             <ExerciseItem icon={<PenTool size={44} />} title="Gratitude Journal" desc="Document small victories to increase your neuroplasticity for joy." color="text-emerald-400" Component={GratitudeJournal} />
             <ExerciseItem icon={<Target size={44} />} title="5-4-3-2-1 Grounding" desc="Stop cognitive spirals by anchoring your awareness in the sensory now." color="text-orange-400" Component={GroundingTechnique} />
          </div>
        </motion.div>
      )}

      {activeTab === 'mood-check' && (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="max-w-3xl mx-auto space-y-12">
          <div className="flex justify-start mb-4">
            <BackButton onClick={() => setActiveTab('dashboard')} />
          </div>
          <header className="text-center space-y-2">
             <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Current State</h2>
             <p className="text-slate-500 text-base font-medium leading-relaxed uppercase tracking-widest">Persisting your emotional fingerprint to the cloud.</p>
          </header>
          <MoodCheckIn user={user} onCancel={() => setActiveTab('dashboard')} onSuccess={() => setActiveTab('dashboard')} />
       </motion.div>
      )}

      {activeTab === 'history' && (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="max-w-4xl mx-auto space-y-8">
          <div className="mb-6 flex justify-start">
            <BackButton onClick={() => setActiveTab('dashboard')} />
          </div>
          <header className="mb-10">
             <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Emotional Flow</h2>
             <p className="text-sm md:text-base text-slate-500 font-medium mt-1 uppercase tracking-widest">History synced from Supabase</p>
          </header>

          <div className="space-y-4 pb-20">
             {moods.length === 0 ? (
               <div className="text-center py-24 glass-card rounded-[48px] border-white/5 bg-[#0d1015] shadow-2xl opacity-50">
                  <History className="mx-auto text-slate-800 mb-6" size={64} />
                  <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">No entries recorded in sanctuary.</p>
               </div>
             ) : (
               moods.map(entry => (
                 <motion.div 
                   key={entry.id} 
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="glass-card p-8 rounded-[40px] border border-white/5 bg-[#1a1d24] flex items-center justify-between group hover:border-indigo-500/30 transition-all shadow-xl"
                 >
                    <div className="flex items-center gap-8">
                       <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-white shadow-2xl ${
                          entry.mood === MoodType.HAPPY ? 'bg-emerald-600' :
                          entry.mood === MoodType.CALM ? 'bg-cyan-600' :
                          entry.mood === MoodType.STRESSED ? 'bg-orange-600' :
                          entry.mood === MoodType.ANXIOUS ? 'bg-rose-600' : 'bg-slate-700'
                       }`}>
                          <Smile size={28} />
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-white capitalize tracking-tight">{entry.mood}</h4>
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                            {new Date(entry.createdAt).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                          </p>
                       </div>
                    </div>
                    <div className="max-w-[200px] md:max-w-md text-right">
                      <p className="text-slate-300 text-sm md:text-base italic leading-relaxed font-medium">"{entry.note || 'Recorded without notes.'}"</p>
                    </div>
                 </motion.div>
               ))
             )}
          </div>
        </motion.div>
      )}

      {activeTab === 'settings' && (
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="max-w-4xl mx-auto space-y-12">
          <div className="mb-6 flex justify-start">
            <BackButton onClick={() => setActiveTab('dashboard')} />
          </div>
          <header className="mb-10 flex items-center gap-6">
            <div className="w-20 h-20 rounded-[40px] bg-indigo-600 flex items-center justify-center border-4 border-[#0a0c10] shadow-2xl">
              <SettingsIcon size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Settings</h2>
              <p className="text-sm md:text-base text-slate-500 font-medium mt-1 uppercase tracking-widest">Personalize your Sanctuary Experience</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-20">
            {/* Profile Section */}
            <div className="md:col-span-4 space-y-6">
              <section className="glass-card p-8 rounded-[40px] bg-[#0d1015] border border-white/5 shadow-2xl flex flex-col items-center text-center">
                <div className="relative group mb-6">
                  <div className="w-32 h-32 rounded-[48px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl border-4 border-[#0d1015] group-hover:scale-105 transition-all">
                    {user.name.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 p-3 bg-[#1a1d24] border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all shadow-xl">
                    <Camera size={18} />
                  </button>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-tight">{user.name}</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 mb-6">{user.email}</p>
                <div className="w-full h-px bg-white/5 mb-6" />
                <div className="w-full space-y-4 text-left">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                    <span>Member Since</span>
                    <span className="text-indigo-400">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                    <span>Sanctuary Level</span>
                    <span className="text-emerald-400">Zen Master</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Config Section */}
            <div className="md:col-span-8 space-y-8">
              <section className="glass-card p-10 rounded-[50px] bg-[#0d1015] border border-white/5 shadow-2xl space-y-8">
                <div>
                  <h3 className="text-xs font-black flex items-center gap-3 text-slate-500 tracking-[0.3em] uppercase mb-8">
                     Preferences
                  </h3>
                  <div className="space-y-2">
                    <SettingsItem icon={<Moon size={20} />} label="Dark Mode" desc="Optimized for late-night reflection" hasToggle defaultToggleValue={true} />
                    <SettingsItem icon={<Bell size={20} />} label="Notifications" desc="Daily mindfulness reminders" hasToggle defaultToggleValue={true} />
                    <SettingsItem icon={<Zap size={20} />} label="AI Proactive Support" desc="Gemini detects mood shifts early" hasToggle defaultToggleValue={false} />
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <h3 className="text-xs font-black flex items-center gap-3 text-slate-500 tracking-[0.3em] uppercase mb-8">
                     Sanctuary Security
                  </h3>
                  <div className="space-y-2">
                    <SettingsItem icon={<Lock size={20} />} label="Password Security" desc="Manage your access keys" hasArrow />
                    <SettingsItem icon={<ShieldAlert size={20} />} label="Privacy Mode" desc="Hide history from shared devices" hasToggle />
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <h3 className="text-xs font-black flex items-center gap-3 text-rose-500 tracking-[0.3em] uppercase mb-8">
                     Danger Zone
                  </h3>
                  <div className="flex items-center justify-between p-6 bg-rose-500/5 rounded-[32px] border border-rose-500/10">
                    <div>
                      <p className="text-sm font-black text-rose-100 uppercase tracking-tight">Erase Sanctuary Data</p>
                      <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Permanently delete mood and chat history</p>
                    </div>
                    <button 
                      onClick={() => confirm("Are you sure you want to erase all your data from the sanctuary? This cannot be undone.")}
                      className="p-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl transition-all shadow-xl group"
                    >
                      <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const SettingsItem = ({ icon, label, desc, hasToggle, hasArrow, defaultToggleValue = false }: any) => {
  const [toggle, setToggle] = useState(defaultToggleValue);
  return (
    <div className="flex items-center justify-between px-6 py-5 hover:bg-white/5 transition-all duration-300 cursor-pointer group rounded-3xl">
       <div className="flex items-center gap-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20 group-hover:bg-indigo-600/20 transition-all">
             {React.cloneElement(icon, { className: 'text-indigo-400' })}
          </div>
          <div className="flex flex-col">
             <span className="text-sm font-black text-white tracking-tight uppercase">{label}</span>
             <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{desc}</span>
          </div>
       </div>
       <div className="flex items-center">
          {hasToggle && (
             <button onClick={() => setToggle(!toggle)} className={`w-10 h-5 rounded-full relative transition-all duration-500 ${toggle ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-500 ${toggle ? 'left-6' : 'left-1'}`} />
             </button>
          )}
          {hasArrow && <ChevronRight size={16} className="text-slate-800 group-hover:text-white group-hover:translate-x-1 transition-all" />}
       </div>
    </div>
  );
}

const MoodCheckIn = ({ user, onSuccess, onCancel }: { user: User, onSuccess: () => void, onCancel: () => void }) => {
  const [selected, setSelected] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const submit = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      await db.addMood({ userId: user.id, mood: selected, note });
      onSuccess();
    } catch (e) {
      console.error(e);
      alert("Error saving mood. Please check your cloud connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-12 rounded-[50px] space-y-12 border border-white/5 shadow-2xl bg-[#0d1015]">
      <div className="grid grid-cols-5 gap-4">
        <MoodBtn mood={MoodType.HAPPY} icon={<Smile size={32} />} label="Happy" active={selected === MoodType.HAPPY} onClick={() => setSelected(MoodType.HAPPY)} color="bg-emerald-600" />
        <MoodBtn mood={MoodType.CALM} icon={<Sparkles size={32} />} label="Calm" active={selected === MoodType.CALM} onClick={() => setSelected(MoodType.CALM)} color="bg-cyan-600" />
        <MoodBtn mood={MoodType.STRESSED} icon={<Zap size={32} />} label="Stress" active={selected === MoodType.STRESSED} onClick={() => setSelected(MoodType.STRESSED)} color="bg-orange-600" />
        <MoodBtn mood={MoodType.ANXIOUS} icon={<AlertCircle size={32} />} label="Anxious" active={selected === MoodType.ANXIOUS} onClick={() => setSelected(MoodType.ANXIOUS)} color="bg-rose-600" />
        <MoodBtn mood={MoodType.SAD} icon={<Frown size={32} />} label="Sad" active={selected === MoodType.SAD} onClick={() => setSelected(MoodType.SAD)} color="bg-slate-700" />
      </div>
      <div className="space-y-4">
        <label className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black ml-4">Daily Reflection</label>
        <textarea 
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="What's unfolding in your internal landscape?"
          className="w-full bg-[#161a21] border border-slate-800 rounded-[32px] p-8 outline-none focus:border-indigo-600/50 min-h-[180px] text-white text-lg transition-all placeholder:text-slate-800 shadow-inner font-medium"
        />
      </div>
      <div className="flex gap-4">
        <button 
          onClick={onCancel}
          className="flex-1 bg-white/5 py-6 rounded-[24px] font-black text-xs text-slate-500 uppercase tracking-widest hover:bg-white/10 transition-all active:scale-[0.98]"
        >
          Discard
        </button>
        <button 
          disabled={!selected || submitting}
          onClick={submit}
          className="flex-[2] bg-indigo-600 py-6 rounded-[24px] font-black text-xs text-white shadow-2xl shadow-indigo-500/30 disabled:opacity-20 transition-all hover:bg-indigo-500 active:scale-[0.98] uppercase tracking-[0.3em]"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Commit to History'}
        </button>
      </div>
    </div>
  );
};

const MoodBtn = ({ icon, label, active, onClick, color }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-5 p-6 rounded-[32px] transition-all duration-300 border-2 ${active ? `${color} text-white border-white shadow-2xl scale-105` : 'bg-[#1a1d24] text-slate-700 border-slate-800 hover:border-slate-700 hover:bg-slate-800'}`}
  >
    <div className={`${active ? 'text-white' : 'text-slate-600'}`}>{icon}</div>
    <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${active ? 'text-white' : 'text-slate-700'}`}>{label}</span>
  </button>
);

const ExerciseCard = ({ icon, title, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="glass-card p-8 rounded-[40px] flex items-center gap-6 hover:bg-white/5 transition-all border border-white/5 text-left group shadow-xl bg-[#0d1015]"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <span className="font-black text-white text-xs tracking-[0.2em] uppercase">{title}</span>
  </button>
);

const ExerciseItem = ({ icon, title, desc, color, Component }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col h-full">
      <div className="glass-card p-12 rounded-[50px] flex-1 flex flex-col space-y-8 border border-white/5 shadow-2xl group hover:border-indigo-500/30 transition-all bg-[#0d1015]">
        <div className={`${color} group-hover:scale-110 transition-transform duration-700`}>{icon}</div>
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none">{title}</h3>
          <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed tracking-tight">{desc}</p>
        </div>
        <button onClick={() => setIsOpen(true)} className="mt-auto w-full py-6 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-600/30 rounded-3xl text-indigo-400 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-xl">Launch Activity</button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-black/98 backdrop-blur-[60px]">
            <div className="relative w-full max-w-4xl max-h-screen overflow-y-auto pr-2">
               <button 
                 onClick={() => setIsOpen(false)} 
                 className="fixed top-8 right-8 text-slate-500 hover:text-white p-4 bg-white/5 rounded-full border border-white/10 z-[110] transition-all hover:rotate-90"
                 aria-label="Close"
               >
                 <X size={24} />
               </button>
               <Component onClose={() => setIsOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
