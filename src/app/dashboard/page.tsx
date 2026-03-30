'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Check, Loader2, Save, AtSign, Globe, Sparkles, 
  Trash2, Upload, Camera, PenTool, Terminal, Shield,
  Fingerprint, Zap, Cpu, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { useProfile } from '@/lib/profile-context';
import { Profile } from '@/lib/types';

export default function ProfilePage() {
  const { profile, setProfile, refreshProfile } = useProfile();
  const supabase = getSupabase();
  const avatarRef = useRef<HTMLInputElement>(null);

  const [local, setLocal] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (profile && !initialized.current) {
      initialized.current = true;
      setLocal({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const update = (field: keyof Profile, value: any) => {
    setLocal(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update(local).eq('id', profile.id);
    if (!error) {
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert('Error saving: ' + error.message);
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `avatars/${profile.id}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id);
      await refreshProfile();
    }
    setUploading(false);
  };

  if (!profile) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
         <Loader2 className="animate-spin text-indigo-500" size={32} />
         <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">Querying Identity</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ── Top Identity Cluster ───────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-white/[0.03]">
         <div className="flex items-center gap-8">
            <div className="relative group">
               <div className="w-24 h-24 rounded-[32px] overflow-hidden bg-[#0a0b1e] border-2 border-white/[0.05] shadow-2xl relative z-10">
                  {profile.avatar_url ? (
                     <img src={profile.avatar_url} alt="profile" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white/10 uppercase tracking-tighter">
                        {(profile.full_name || profile.username || '?')[0]}
                     </div>
                  )}
                  {uploading && (
                     <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-sm">
                        <Loader2 className="animate-spin text-white" size={20} />
                     </div>
                  )}
               </div>
               
               <button onClick={() => avatarRef.current?.click()} className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-indigo-600 text-white border-4 border-[#05060f] flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-30">
                  <Camera size={16} />
               </button>
               <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
               <div className="absolute -inset-4 bg-indigo-500/10 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            <div className="space-y-2">
               <h1 className="text-3xl font-black tracking-tighter text-white">Public Profile</h1>
               <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                     <AtSign size={10} className="text-indigo-400" />
                     {profile.username || 'Unclaimed'}
                  </span>
                  <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                     <Fingerprint size={10} className="text-purple-400" />
                     ID_{profile.id.slice(0, 8)}
                  </span>
               </div>
            </div>
         </div>

         <button
           onClick={handleSave}
           disabled={saving}
           className={cn(
             'px-4 lg:px-10 h-12 lg:h-14 rounded-2xl text-[12px] lg:text-[14px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 relative overflow-hidden group w-full md:w-auto',
             saved ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'bg-white text-black hover:bg-white/90 shadow-xl shadow-black/80'
           )}
         >
           <AnimatePresence mode="wait">
              {saving ? (
                 <motion.div key="saving" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                    <Loader2 size={18} className="animate-spin" />
                 </motion.div>
              ) : saved ? (
                 <motion.div key="saved" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}>
                    <Check size={18} />
                 </motion.div>
              ) : (
                 <motion.div key="save" initial={{ y: 10 }} animate={{ y: 0 }} className="flex items-center gap-3">
                    <Save size={18} />
                    <span>Synchronize</span>
                 </motion.div>
              )}
           </AnimatePresence>
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 items-start">
         
         {/* Main Work Surface */}
         <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#0a0b1e]/40 border border-white/[0.06] rounded-[32px] lg:rounded-[40px] p-6 lg:p-10 space-y-8 lg:space-y-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />

               {/* Display Name */}
               <div className="space-y-4 lg:space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20">
                           <User size={18} />
                        </div>
                        <label className="text-xs font-black uppercase tracking-[0.3em] text-white/20">Display Identity</label>
                     </div>
                     <span className="hidden sm:block text-[10px] font-bold text-white/10 uppercase tracking-widest">Global Field</span>
                  </div>
                  <input 
                    className="w-full bg-[#05060f]/60 border border-white/[0.06] focus:border-indigo-500/50 rounded-2xl h-14 lg:h-16 px-6 lg:px-8 text-lg lg:text-xl font-bold text-white transition-all outline-none"
                    placeholder="E.g. Void Studio" 
                    value={local.full_name || ''} 
                    onChange={e => update('full_name', e.target.value)} 
                  />
               </div>

               {/* Bio Area */}
               <div className="space-y-4 lg:space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20">
                           <PenTool size={18} />
                        </div>
                        <label className="text-xs font-black uppercase tracking-[0.3em] text-white/20">Transmission Bio</label>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-[10px] font-bold text-white/10 uppercase tracking-widest">Buffer Status</span>
                        <div className={cn("w-2 h-2 rounded-full", (local.bio?.length || 0) > 160 ? "bg-red-500" : "bg-green-500")} />
                     </div>
                  </div>
                  <div className="relative group">
                     <textarea 
                       rows={5}
                       className="w-full bg-[#05060f]/60 border border-white/[0.06] focus:border-purple-500/50 rounded-3xl lg:rounded-[32px] p-6 lg:p-8 text-base lg:text-lg font-medium text-white/80 transition-all outline-none resize-none leading-relaxed"
                       placeholder="Enter your transmission details..." 
                       value={local.bio || ''} 
                       onChange={e => update('bio', e.target.value)} 
                     />
                     <div className="absolute bottom-6 right-8 flex items-center gap-4 pointer-events-none">
                        <span className={cn(
                           'text-[10px] font-black uppercase tracking-widest p-2 rounded-lg bg-black/40',
                           (local.bio?.length || 0) > 160 ? 'text-red-400' : 'text-white/20'
                        )}>
                           {(local.bio?.length || 0)} / 512
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Security Notice */}
            <div className="bg-[#1a1b2e]/20 border border-white/[0.03] rounded-[40px] p-8 flex items-center justify-between group">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.02] flex items-center justify-center text-white/20 group-hover:text-indigo-400 transition-all">
                     <Shield size={28} />
                  </div>
                  <div>
                     <h4 className="text-lg font-bold">Metadata Privacy</h4>
                     <p className="text-sm text-white/30">Your profile data is encrypted on the VoidMesh network.</p>
                  </div>
               </div>
               <div className="w-10 h-10 rounded-full border border-white/[0.05] flex items-center justify-center text-white/10 group-hover:text-white/40 transition-all">
                  <Zap size={16} />
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
