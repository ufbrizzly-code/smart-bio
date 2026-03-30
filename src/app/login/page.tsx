'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Sparkles, LogIn, UserPlus, 
  ChevronRight, Fingerprint, Cpu, ShieldCheck, 
  Hexagon, Zap, Globe, MessageCircle
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUsername = searchParams.get('username') || '';
  const supabase = getSupabase();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(initialUsername);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } }
        });
        if (signUpError) throw signUpError;
        router.push('/dashboard');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during transmission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex overflow-hidden font-inter relative">
      
      {/* ── BACKGROUND ACCENTS ────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-rose-600/20 rounded-full blur-[140px]" />
      </div>

      {/* ── LEFT SIDE: VISUAL STORYTELLING (Desktop Only) ─────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-24 z-10 overflow-hidden bg-white/[0.01] border-r border-white/5">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
         
         <Link href="/" className="absolute top-12 left-12 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-all">
               <Sparkles size={18} />
            </div>
            <span className="font-black text-xl uppercase tracking-tighter">Smart Link</span>
         </Link>

         <motion.div
           initial={{ opacity: 0, x: -40 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           className="space-y-12"
         >
            <div className="space-y-4">
              <h2 className="text-7xl font-black tracking-tighter leading-[0.85]">
                 ESTABLISH <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-rose-400">IDENTITY.</span>
              </h2>
              <p className="text-xl text-white/30 max-w-md font-medium leading-relaxed">
                 Enter the next generation of creative networking. Your digital resonance starts here.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <LandingInsight icon={<Cpu />} title="Hyper-Node" detail="Zero latency propagation" color="indigo" />
               <LandingInsight icon={<ShieldCheck />} title="Encrypted" detail="Biometric identity shielding" color="cyan" />
            </div>

            <div className="pt-20 flex items-center gap-6">
               <div className="flex -space-x-4">
                  {[1,2,3].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-[#020617] bg-white/5 bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=j')] scale-100 ring-2 ring-indigo-500/20" />)}
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Joining 90k+ elite entities</p>
            </div>
         </motion.div>
      </div>

      {/* ── RIGHT SIDE: AUTHENTICATION FORM ────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 md:px-24 py-20 z-10">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full max-w-[480px] space-y-12"
         >
            {/* Header / Mode Switch */}
            <div className="space-y-4 text-center lg:text-left">
               <h1 className="text-4xl lg:text-5xl font-black tracking-tight uppercase">
                 {mode === 'login' ? 'Welcome Back' : 'Create Profile'}
               </h1>
               <p className="text-white/40 font-medium">
                 {mode === 'login' 
                   ? "Synchronize your parameters with the central mesh." 
                   : "Begin your propagation across the smart network."}
               </p>
               
               <div className="pt-8 flex gap-4">
                  <button 
                    onClick={() => setMode('login')}
                    className={cn(
                      "px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all",
                      mode === 'login' ? "bg-white text-black shadow-xl" : "bg-white/[0.05] text-white/40 hover:bg-white/10"
                    )}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setMode('signup')}
                    className={cn(
                      "px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all",
                      mode === 'signup' ? "bg-white text-black shadow-xl" : "bg-white/[0.05] text-white/40 hover:bg-white/10"
                    )}
                  >
                    Sign Up
                  </button>
               </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-black uppercase tracking-widest leading-relaxed text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
               <AnimatePresence mode="popLayout">
                  {mode === 'signup' && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Identity Handle</label>
                       <div className="relative group">
                          <Hexagon className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-indigo-500 transition-colors" size={20} />
                          <input 
                            required
                            type="text" 
                            className="w-full h-16 bg-black/40 border border-white/10 rounded-3xl outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 pl-16 pr-6 text-xl font-bold tracking-tight text-white transition-all transition-all"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                          />
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Email Endpoint</label>
                  <div className="relative group">
                     <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-cyan-500 transition-colors" size={20} />
                     <input 
                       required
                       type="email" 
                       className="w-full h-16 bg-black/40 border border-white/10 rounded-3xl outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 pl-16 pr-6 text-xl font-bold tracking-tight text-white transition-all"
                       placeholder="entity@mesh.net"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Security Key</label>
                  <div className="relative group">
                     <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-rose-500 transition-colors" size={20} />
                     <input 
                       required
                       type="password" 
                       className="w-full h-16 bg-black/40 border border-white/10 rounded-3xl outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/5 pl-16 pr-6 text-xl font-bold tracking-tight text-white transition-all"
                       placeholder="••••••••"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>
               </div>

               <button 
                 disabled={loading}
                 className="w-full h-20 mt-10 rounded-[32px] bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 font-black uppercase text-sm tracking-[0.3em] shadow-2xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
               >
                 {loading ? <Zap className="animate-spin text-white" size={24} /> : (
                   <>
                     {mode === 'login' ? 'INITIATE CONNECTION' : 'GENERATE IDENTITY'}
                     <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
               </button>
            </form>

            <div className="pt-12 text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
               Secured by transmission protocol v2.4
            </div>
         </motion.div>
      </div>

    </div>
  );
}

function LandingInsight({ icon, title, detail, color }: { icon: React.ReactNode, title: string, detail: string, color: string }) {
   const colors: any = {
      indigo: 'text-indigo-400 bg-indigo-400/5 border-indigo-400/10',
      cyan: 'text-cyan-400 bg-cyan-400/5 border-cyan-400/10',
      rose: 'text-rose-400 bg-rose-400/5 border-rose-400/10',
   };

   return (
      <div className={cn("p-8 rounded-[40px] border flex flex-col items-start gap-5 transition-all hover:bg-white/[0.02]", colors[color])}>
         <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5">
            {icon}
         </div>
         <div>
            <h4 className="text-white font-black tracking-tighter text-xl uppercase mb-1">{title}</h4>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{detail}</p>
         </div>
      </div>
   );
}
