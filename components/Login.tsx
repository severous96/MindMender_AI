
import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { db } from '../lib/db';
import { User } from '../types';
import FloatingOrbScene from './animations/FloatingOrb';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name || !email || !password) throw new Error("Complete all fields to proceed.");
        const user = await db.register(name, email, password);
        onLogin(user);
      } else {
        if (!email || !password) throw new Error("Please enter your credentials.");
        const user = await db.login(email, password);
        onLogin(user);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || 'Authentication failed');
      // If registration was successful but session is null (due to confirmation)
      if (err.message.includes('Please check your email')) {
        // We stay on registration but show success
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0a0c10] text-white overflow-hidden relative font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/40 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-900/30 blur-[150px] pointer-events-none" />

      <div className="hidden lg:flex flex-1 items-center justify-center relative">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <FloatingOrbScene />
          </Suspense>
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-lg">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}>
            <h2 className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-200 drop-shadow-2xl">
              MindMenders AI
            </h2>
            <p className="text-slate-100 text-xl font-medium tracking-wide mt-6 leading-relaxed max-w-md mx-auto">
              Your personal sanctuary for clarity, healing, and peace.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 z-20">
        <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full max-w-md glass-card p-12 rounded-[48px] shadow-2xl relative">
          <div className="absolute top-0 right-0 p-8 opacity-60"><Sparkles className="w-10 h-10 text-cyan-400" /></div>
          <header className="mb-12">
            <h1 className="text-4xl font-black mb-3 text-white tracking-tight">{isRegister ? 'Begin Your Journey' : 'Welcome Back'}</h1>
            <p className="text-slate-400 text-sm font-medium">{isRegister ? 'Create a secure account to begin your transformation.' : 'Sign in to continue your mental wellness journey.'}</p>
          </header>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-8 p-5 border rounded-2xl font-medium text-xs flex gap-3 items-start ${
                error.includes('Check your email') 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-100' 
                : 'bg-rose-500/10 border-rose-500/50 text-rose-100'
              }`}
            >
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest text-slate-500 font-black ml-1">Full Name</label>
                <div className="relative"><UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#161a21] border border-slate-800 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-cyan-500 text-sm text-white transition-all" placeholder="Jane Doe" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-slate-500 font-black ml-1">Email Address</label>
              <div className="relative"><Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#161a21] border border-slate-800 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-cyan-500 text-sm text-white transition-all" placeholder="hello@wellness.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-slate-500 font-black ml-1">Secure Password</label>
              <div className="relative"><Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#161a21] border border-slate-800 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-cyan-500 text-sm text-white transition-all" placeholder="••••••••" />
              </div>
            </div>
            <button disabled={loading} className="w-full bg-indigo-600 py-5 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-3 transition-all hover:bg-indigo-500 active:scale-95 text-white disabled:opacity-50 mt-4">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isRegister ? 'Start Journey' : 'Enter Sanctuary'} <ArrowRight size={18} /></>}
            </button>
          </form>
          <footer className="mt-10 text-center">
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-xs font-bold text-cyan-500 uppercase tracking-widest hover:text-cyan-400 transition-colors">
              {isRegister ? 'Already registered? Sign in' : "Don't have an account? Start here"}
            </button>
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
