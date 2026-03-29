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
                 <span className="text-sm font-bold text-white/30 lowercase">smartbio.link/</span>
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
        <div className="p-10 rounded-[40px] border border-white/[0.08] bg-[#0f1020]/40 space-y-8">
           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <label className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">Namespace Handle</label>
                 {checking && <Loader2 size={12} className="animate-spin text-white/20" />}
                 {available === true && <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-1"><Check size={12} />Available</span>}
                 {available === false && <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1"><AlertCircle size={12} />Taken</span>}
              </div>

              <div className="relative">
                 <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-bold text-lg">@</div>
                 <input 
                   className={cn(
                     'input-dark bg-black/40 border-white/[0.08] rounded-2xl h-16 px-12 text-xl font-bold transition-all',
                     available === true ? 'border-green-500/30 text-green-400' : '',
                     available === false ? 'border-red-500/30 text-red-500' : ''
                   )}
                   placeholder="username" 
                   value={username} 
                   onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} 
                 />
              </div>
              
              <div className="flex items-center gap-2 px-2 text-[10px] text-white/20 font-bold uppercase tracking-tighter">
                 <ShieldCheck size={12} className="text-indigo-500" />
                 Alphanumeric + Under-scores accepted
                 <span className="mx-2 filter grayscale opacity-40">|</span>
                 Min 3, Max 20 chars
              </div>
           </div>

           <button
             onClick={handleSave}
             disabled={saving || !available || username === profile.username}
             className={cn(
               'w-full h-14 rounded-2xl font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-3',
               available === true 
                 ? 'bg-gradient-to-r from-green-600 to-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] shadow-indigo-600/20' 
                 : 'bg-white/5 text-white/20 cursor-not-allowed'
             )}
           >
             {saving ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
             Update Identity Path
           </button>
        </div>

        {/* Suggestion AI - Placeholder teaser */}
        <div className="p-8 rounded-[40px] border border-dashed border-white/[0.08] bg-white/[0.01] flex items-center justify-between group cursor-pointer hover:bg-indigo-500/5 transition-all">
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-xl ring-1 ring-white/10 relative">
                 <Wand2 size={24} />
                 <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-black" />
              </div>
              <div>
                 <h4 className="text-md font-bold text-white/60 group-hover:text-white transition-all">AI Domain Suggestion</h4>
                 <p className="text-xs text-white/20">Find the perfect name if yours is taken.</p>
              </div>
           </div>
           <button className="px-5 py-2 rounded-full bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
              Try AI
           </button>
        </div>

      </div>
    </div>
  );
}
