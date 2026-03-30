'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AtSign, Check, Loader2, Copy, ExternalLink, Globe, 
  AlertCircle, ShieldCheck, Zap, Sparkles, Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { useProfile } from '@/lib/profile-context';

export default function UsernamePage() {
  const { profile, setProfile, refreshProfile } = useProfile();
  const supabase = getSupabase();

  const [username, setUsername] = useState(profile?.username || '');
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check availability on change
  useEffect(() => {
    if (!username || username === profile?.username) {
      setAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setChecking(true);
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .single();
      
      setAvailable(!data);
      setChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [username, profile?.username, supabase]);

  const handleSave = async () => {
    if (!profile || !available || username === profile.username) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ username: username.toLowerCase() })
      .eq('id', profile.id);
    
    if (!error) {
       await refreshProfile();
       setAvailable(null);
    }
    setSaving(false);
  };

  const copyUrl = () => {
    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!profile) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-purple-400" size={28} />
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
           <AtSign className="text-indigo-400" size={24} />
           Username
        </h1>
        <p className="text-sm text-white/40 mt-1">Claim your unique digital namespace</p>
      </div>

      <div className="max-w-xl space-y-8">
        
        {/* URL Preview Box */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative group p-10 rounded-[40px] border border-white/[0.08] bg-[#020617] shadow-2xl overflow-hidden text-center space-y-4"
        >
           <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent blur-sm" />
           <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto text-indigo-400 ring-1 ring-white/10 mb-2">
              <Globe size={28} />
           </div>
           
           <div>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-2 uppercase">Live Global Routing</p>
                  <div className="flex items-center justify-center gap-2 group/url cursor-pointer" onClick={copyUrl}>
                     <span className="text-sm font-bold text-white/30 lowercase">smartlink.link/</span>
                     <span className={cn(
                       'text-xl font-black transition-all lowercase',
                       username ? 'text-white' : 'text-white/10 italic'
                     )}>
                       {username || 'yourname'}
                     </span>
                     <Copy size={14} className="text-white/10 group-hover/url:text-indigo-400 transition-colors" />
                  </div>
               </div>

               {copied && (
                  <motion.div 
                     initial={{ opacity: 0, y: 5 }} 
                     animate={{ opacity: 1, y: 0 }} 
                     className="text-[10px] text-green-400 font-bold uppercase tracking-widest mt-2"
                  >
                     Identity Path Copied
                  </motion.div>
               )}
            </motion.div>

            {/* Input area */}
            <div className="p-8 lg:p-12 rounded-[48px] border border-white/[0.08] bg-[#0a0b1e]/60 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
               
               <div className="space-y-8 relative z-10">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Namespace Terminal</label>
                        <AnimatePresence>
                           {checking && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Loader2 size={14} className="animate-spin text-indigo-400" /></motion.div>}
                           {available === true && <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-[10px] font-black text-green-400 uppercase tracking-widest flex items-center gap-2 bg-green-400/10 px-3 py-1 rounded-full"><Check size={12} strokeWidth={3} /> Available</motion.span>}
                           {available === false && <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2 bg-red-400/10 px-3 py-1 rounded-full"><AlertCircle size={12} strokeWidth={3} /> Taken</motion.span>}
                        </AnimatePresence>
                     </div>

                     <div className="relative group/input">
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl font-black text-white/10 group-focus-within/input:text-indigo-500/40 transition-colors tracking-tighter">smartlink.link/</div>
                        <input 
                          className={cn(
                            'w-full bg-black/40 border-2 border-white/[0.05] focus:border-indigo-500/50 rounded-3xl h-20 pl-[184px] pr-8 text-2xl font-black transition-all outline-none tracking-tighter selection:bg-indigo-500/30',
                            available === true ? 'border-green-500/20 text-green-400' : 'text-white'
                          )}
                      placeholder="ufbrizzly" 
                      value={username} 
                      onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} 
                    />
                 </div>
                 
                 <div className="flex flex-wrap items-center gap-3 px-4 text-[10px] font-black uppercase tracking-widest text-white/10">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/5">
                       <ShieldCheck size={12} className="text-indigo-400" />
                       Verified String
                    </div>
                    <span>•</span>
                    <span>Alphanumeric Only</span>
                    <span>•</span>
                    <span>3-20 Chars</span>
                 </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving || !available || username === profile.username}
                className={cn(
                  'w-full h-18 lg:h-20 rounded-3xl font-black uppercase tracking-[0.2em] text-xs transition-all transform active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group',
                  available === true 
                    ? 'bg-white text-black shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:bg-indigo-50' 
                    : 'bg-white/5 text-white/20 grayscale cursor-not-allowed'
                )}
              >
                {saving ? (
                   <Loader2 size={24} className="animate-spin" />
                ) : (
                   <>
                      <Zap size={20} className="fill-current" />
                      <span>Execute Protocol Update</span>
                   </>
                )}
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
