'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Check, Loader2, Save, AtSign, Globe, Sparkles, 
  Trash2, Upload, Camera, PenTool, Terminal, Shield
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
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-purple-400" size={28} />
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <User size={24} className="text-purple-400" />
              Public Bio
           </h1>
           <p className="text-sm text-white/40 mt-1">Personalize how others see your profile</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            'px-8 h-11 rounded-full text-sm font-bold transition-all flex items-center gap-2 relative overflow-hidden',
            saved ? 'bg-green-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] shadow-[0_4px_15px_rgba(0,0,0,0.5)]'
          )}
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saved && <Check size={16} />}
          {saved ? 'Changes Saved' : saving ? 'Updating...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Avatar Card */}
        <div className="lg:col-span-1 space-y-6">
           <div className="p-8 rounded-[40px] border border-white/[0.08] bg-[#0f1020]/40 flex flex-col items-center text-center group">
              <div className="relative mb-6">
                 <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/5 bg-[#1a1b2e] flex items-center justify-center shadow-2xl relative z-10 transition-transform group-hover:scale-105 duration-500">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-white/20 uppercase tracking-tighter">
                         {(profile.full_name || profile.username || '?')[0]}
                      </span>
                    )}
                 </div>
                 <div className="absolute -inset-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl rounded-full opacity-40 group-hover:opacity-80 transition-opacity" />
                 
                 <button
                    onClick={() => avatarRef.current?.click()}
                    className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-white text-black border-4 border-[#0a0a0d] flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all z-20"
                 >
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                 </button>
                 <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>
              
              <h3 className="text-sm font-bold text-white mb-1">{(profile.full_name || profile.username)}</h3>
              <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold font-mono">Profile Token #1042</p>
              
              <div className="w-full h-px bg-white/[0.04] my-6" />
              
              <div className="flex flex-col gap-2 w-full">
                 <button onClick={() => avatarRef.current?.click()} className="w-full py-2.5 rounded-2xl bg-white/5 border border-white/5 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                    Upload New
                 </button>
                 <button className="w-full py-2.5 rounded-2xl bg-red-500/5 border border-red-500/10 text-[11px] font-bold uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-colors">
                    Purge Avatar
                 </button>
              </div>
           </div>

           {/* Quick Stats teaser */}
           <div className="p-6 rounded-[32px] border border-[#a855f7]/20 bg-[#a855f7]/5 relative overflow-hidden group">
              <Sparkles size={20} className="text-purple-400 mb-3" />
              <h4 className="text-sm font-bold text-white mb-1">Identity Verified</h4>
              <p className="text-[11px] text-purple-400/60 leading-relaxed uppercase tracking-tighter">
                 Your profile is currently active and reachable globally on the VoidLink mesh.
              </p>
           </div>
        </div>

        {/* Right Col: Fields */}
        <div className="lg:col-span-2 space-y-6">
           <div className="p-8 rounded-[40px] border border-white/[0.08] bg-[#0f1020]/40 space-y-10 shadow-2xl shadow-black/40">
              
              {/* Display Name */}
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 ring-1 ring-white/10">
                       <AtSign size={16} />
                    </div>
                    <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Identity Marker</label>
                 </div>
                 <input 
                   className="input-dark bg-black/40 border-white/[0.08] focus:border-indigo-500/50 rounded-2xl h-14 px-6 text-lg font-bold"
                   placeholder="Display Name" 
                   value={local.full_name || ''} 
                   onChange={e => update('full_name', e.target.value)} 
                 />
              </div>

              {/* Bio */}
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 ring-1 ring-white/10">
                       <PenTool size={16} />
                    </div>
                    <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Transmission Buffer (Bio)</label>
                 </div>
                 <textarea 
                   rows={4}
                   className="input-dark bg-black/40 border-white/[0.08] focus:border-purple-500/50 rounded-[32px] p-6 text-[15px] resize-none leading-relaxed text-white/80"
                   placeholder="Write a brief introduction..." 
                   value={local.bio || ''} 
                   onChange={e => update('bio', e.target.value)} 
                 />
                 <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] text-white/10 uppercase tracking-widest font-bold">Recommended: &lt; 160 chars</span>
                    <span className={cn(
                      'text-[10px] uppercase tracking-widest font-bold font-mono',
                      (local.bio?.length || 0) > 160 ? 'text-red-400' : 'text-white/20'
                    )}>
                       {(local.bio?.length || 0)} / 512
                    </span>
                 </div>
              </div>
           </div>

           {/* Security Area teaser */}
           <div className="p-8 rounded-[40px] border border-white/[0.08] bg-[#0f1020]/40 flex items-center justify-between group">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center text-white/20 transition-all group-hover:bg-white/[0.08] group-hover:text-white/40">
                    <Shield size={28} />
                 </div>
                 <div>
                    <h4 className="text-lg font-bold">Privacy Controls</h4>
                    <p className="text-xs text-white/20">Sensitive data fields are encrypted by default.</p>
                 </div>
              </div>
              <div className="flex gap-2 p-1 rounded-xl bg-black/40 border border-white/[0.06] hover:scale-105 active:scale-95 transition-all">
                 <span className="px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest shadow-lg">Mesh Encrypted</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
