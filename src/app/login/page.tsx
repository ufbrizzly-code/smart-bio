'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Github, Mail, Lock, Check, Loader2 } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = getSupabase();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background relative overflow-hidden">
      <div className="glow-bg" />
      
      {/* Decorative Left Side */}
      <div className="hidden lg:flex flex-col justify-center p-20 relative z-10 border-r border-glass-border">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-background mb-8 shadow-xl shadow-accent/10"
        >
          <Sparkles size={24} />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-bold tracking-tighter max-w-sm mb-6 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent"
        >
          Launch <br />
          Your Link <br />
          In Seconds.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-foreground/40 max-w-sm"
        >
          The most intelligent bio link tool for creators and businesses.
          Join 850+ users growing their audience today.
        </motion.p>
      </div>

      {/* Auth Form Right Side */}
      <div className="flex flex-col justify-center items-center p-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass p-10 rounded-3xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-sm text-foreground/40 font-medium">
              Start your journey with SmartBio.
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-accent/5 border border-glass-border rounded-2xl pl-12 pr-4 outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-accent/5 border border-glass-border rounded-2xl pl-12 pr-4 outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/20 transition-all font-medium"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs font-bold text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/10"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              disabled={loading}
              type="submit"
              className="w-full h-14 bg-accent text-background rounded-2xl font-bold flex items-center justify-center space-x-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <span>{isSignUp ? 'Get Started' : 'Continue'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-glass-border opacity-50"></div></div>
            <span className="relative bg-background px-4 text-[10px] font-bold uppercase tracking-widest text-foreground/20">or</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button className="h-12 glass rounded-2xl flex items-center justify-center space-x-2 text-sm font-semibold hover:bg-accent/5 transition-all">
              <Github size={18} />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs font-bold text-foreground/40 hover:text-accent transition-colors"
            >
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign up free"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
