'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Image, Upload, Trash2, Check, Camera, 
  Video, Film, Music, Globe, Play, Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { useProfile } from '@/lib/profile-context';

type MediaTab = 'photo' | 'background' | 'music';
const TABS: { id: MediaTab; label: string; icon: any }[] = [
  { id: 'photo', label: 'Profile Photo', icon: Camera },
  { id: 'background', label: 'Background', icon: Image },
  { id: 'music', label: 'Music', icon: Music },
];

export default function MediaPage() {
  const { profile, setProfile } = useProfile();
  const supabase = getSupabase();
  const [activeTab, setActiveTab] = useState<MediaTab>('photo');
  
  const fileRef = useRef<HTMLInputElement>(null);
  const bgRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar_url' | 'wallpaper') => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);

    const ext = file.name.split('.').pop();
    const path = `media/${profile.id}_${field}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars') // Using universal media bucket
      .upload(path, file, { upsert: true });

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);

    const { error } = await supabase
      .from('profiles')
      .update({ [field]: publicUrl })
      .eq('id', profile.id);

    if (!error) {
      setProfile({ ...profile, [field]: publicUrl });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setUploading(false);
  };

  const removeItem = async (field: 'avatar_url' | 'wallpaper') => {
    if (!profile) return;
    const { error } = await supabase
      .from('profiles')
      .update({ [field]: null })
      .eq('id', profile.id);
    if (!error) setProfile({ ...profile, [field]: undefined });
  };

  if (!profile) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-purple-400" size={28} />
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Media Library</h1>
        <p className="text-sm text-white/40 mt-1">Personalize your page with visuals and sound</p>
      </div>

      {/* Sub-Tabs for Media Categories */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
        {TABS.map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={cn(
               'flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all transition-transform active:scale-95',
               activeTab === tab.id
                 ? 'bg-white/[0.07] text-white shadow-sm ring-1 ring-white/10'
                 : 'text-white/40 hover:text-white/60'
             )}
           >
             <tab.icon size={14} />
             {tab.label}
           </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, x: 10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -10 }}
           transition={{ duration: 0.2 }}
        >
          {/* PROFILE PHOTO TAB */}
          {activeTab === 'photo' && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0f172a]/40 p-10 flex flex-col items-center text-center space-y-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 bg-[#1e293b] flex items-center justify-center shadow-2xl relative z-10">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      {(profile.full_name || profile.username || '?')[0].toUpperCase()}
                    </span>
                  )}
                </div>
                {/* Glow behind avatar */}
                <div className="absolute -inset-4 bg-purple-500/20 blur-2xl rounded-full opacity-40 group-hover:opacity-70 transition-opacity" />
                
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-purple-600 border-2 border-[#1a1c2e] flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-90 transition-all z-20"
                >
                   <Camera size={18} />
                </button>
              </div>

              <div className="max-w-xs space-y-2">
                 <h3 className="text-lg font-bold">Profile Identity</h3>
                 <p className="text-xs text-white/30 leading-relaxed">
                   Upload a high-quality square image for your profile. 
                   JPG, PNG or GIF are supported.
                 </p>
              </div>

              <div className="flex gap-3">
                 <button
                   onClick={() => fileRef.current?.click()}
                   disabled={uploading}
                   className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-50"
                 >
                   {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                   {uploading ? 'Processing...' : 'Upload Image'}
                 </button>
                 {profile.avatar_url && (
                    <button
                      onClick={() => removeItem('avatar_url')}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                 )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleUpload(e, 'avatar_url')} className="hidden" />
            </div>
          )}

          {/* BACKGROUND TAB */}
          {activeTab === 'background' && (
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                 <div 
                   className="rounded-2xl border border-white/[0.08] bg-[#0f172a]/40 p-8 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer hover:border-white/20 transition-all group"
                   onClick={() => bgRef.current?.click()}
                 >
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center text-white/20 group-hover:text-white/60 transition-colors">
                       <Image size={32} />
                    </div>
                    <div>
                       <h4 className="font-bold text-white">Full Background</h4>
                       <p className="text-xs text-white/30 mt-1">Upload a wallpaper image</p>
                    </div>
                    <button className="px-4 py-1.5 rounded-lg border border-white/10 text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-colors">
                       Select File
                    </button>
                    <input ref={bgRef} type="file" accept="image/*" onChange={(e) => handleUpload(e, 'wallpaper')} className="hidden" />
                 </div>

                 <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] p-8 flex flex-col items-center justify-center text-center space-y-4 opacity-50 grayscale cursor-not-allowed">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center text-white/20">
                       <Film size={32} />
                    </div>
                    <div>
                       <h4 className="font-bold text-white">Video Background</h4>
                       <p className="text-xs text-white/30 mt-1">Upload an MP4 or GIF</p>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 uppercase tracking-widest">
                       Premium Only
                    </span>
                 </div>
               </div>

               {profile.wallpaper && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="rounded-2xl border border-white/[0.08] bg-[#0f172a]/40 p-4"
                 >
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <img src={profile.wallpaper} className="w-16 h-16 rounded-lg object-cover ring-1 ring-white/10" alt="background preview" />
                          <div>
                             <p className="text-sm font-bold">Active Background</p>
                             <p className="text-[11px] text-white/20">High definition wallpaper</p>
                          </div>
                       </div>
                       <button
                         onClick={() => removeItem('wallpaper')}
                         className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                 </motion.div>
               )}
            </div>
          )}

          {/* MUSIC TAB */}
          {activeTab === 'music' && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0f172a]/40 p-10 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/10 ring-1 ring-white/10">
                 <Music size={32} />
              </div>
              
              <div className="max-w-sm space-y-2">
                 <h3 className="text-lg font-bold">Background Music</h3>
                 <p className="text-xs text-white/30 leading-relaxed">
                   Visitors in demo mode or users who enable sound will hear this
                   track in the background. Supports Spotify & SoundCloud.
                 </p>
              </div>

              <div className="w-full max-w-md bg-white/[0.03] rounded-2xl p-4 border border-white/5">
                 <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] block text-left mb-2 ml-1">SoundCloud/Spotify URL</label>
                 <div className="flex gap-2">
                    <input 
                      className="flex-1 bg-black/40 border-none outline-none rounded-xl px-4 py-3 text-sm font-mono text-purple-300 placeholder:text-white/10"
                      placeholder="https://soundcloud.com/..."
                    />
                    <button className="px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center justify-center font-bold text-sm">
                       Save
                    </button>
                 </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-white/20">
                 <Sparkles size={12} className="text-indigo-500" />
                 Enhanced audio spatialization enabled
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
