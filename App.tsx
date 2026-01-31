
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, AuthState, TabType } from './types';
import { db } from './lib/db';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await db.getCurrentUser();
        if (currentUser) {
          setAuth({ user: currentUser, isAuthenticated: true, isLoading: false });
        } else {
          setAuth(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    };
    checkSession();
  }, []);

  const handleLogin = (user: User) => {
    setAuth({ user, isAuthenticated: true, isLoading: false });
  };

  const handleLogout = async () => {
    await db.logout();
    setAuth({ user: null, isAuthenticated: false, isLoading: false });
  };

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 bg-indigo-600 rounded-full blur-xl"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-100 font-sans selection:bg-indigo-500/30">
      <AnimatePresence mode="wait">
        {!auth.isAuthenticated ? (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Login onLogin={handleLogin} />
          </motion.div>
        ) : (
          <div className="flex h-screen overflow-hidden">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
            
            <main className="flex-1 overflow-y-auto relative px-10 py-10">
              <div className="max-w-7xl mx-auto">
                 <Dashboard 
                   activeTab={activeTab} 
                   user={auth.user!} 
                   setActiveTab={setActiveTab}
                 />
              </div>

              {/* Decorative Background Elements */}
              <div className="fixed top-0 right-0 w-[40%] h-[40%] bg-indigo-600/5 blur-[150px] pointer-events-none -z-10" />
              <div className="fixed bottom-0 left-[20%] w-[30%] h-[30%] bg-cyan-600/5 blur-[150px] pointer-events-none -z-10" />
            </main>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
