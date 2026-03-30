'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, Check, Loader2, Play, Volume2, Sparkles, 
  Trash2, Globe, Heart, Mic2, Disc, Headphones, Zap, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { useProfile } from '@/lib/profile-context';

export default function SoundsPage() {
  const { profile, setProfile, refreshProfile } = useProfile();
  const supabase = getSupabase();

  const [trackUrl, setTrackUrl] = useState(profile?.bio_color || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile?.bio_color) {
      setTrackUrl(profile.bio_color);
    }
  }, [profile]);

  // Detect platform and generate embed preview
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('spotify.com/track/')) {
      const id = url.split('/track/')[1]?.split('?')[0];
      return `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
    }
    if (url.includes('soundcloud.com/')) {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=false&color=%238b5cf6&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;
    }
    if (url.includes('music.apple.com/')) {
      return url.replace('music.apple.com', 'embed.music.apple.com');
    }
    return null;
  };

  const embedUrl = getEmbedUrl(trackUrl);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ bio_color: trackUrl }) 
      .eq('id', profile.id);

    if (!error) {
       await refreshProfile();
       setSaved(true);
       setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (!profile) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-indigo-500" size={32} />
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Music size={24} />
             </div>
             SONICS
          </h1>
          <p className="text-[11px] text-white/30 mt-2 uppercase tracking-[0.3em] font-black">Background Audio Matrix</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving || (trackUrl === profile.bio_color && trackUrl !== '')}
          className={cn(
            'px-10 h-14 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 relative overflow-hidden group w-full md:w-auto',
            saved ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-black hover:bg-white/90 shadow-2xl shadow-black/80'
          )}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <Check size={18} /> : <Zap size={18} className="fill-current" />}
          <span>{saved ? 'Synchronized' : saving ? 'Transmitting' : 'Deploy Frequency'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
         
         {/* Configuration Node */}
         <div className="lg:col-span-3 space-y-8">
            <div className="p-8 lg:p-10 rounded-[48px] border border-white/[0.08] bg-[#0a0b1e]/60 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
               
               <div className="space-y-8 relative z-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Audio Endpoint URL</label>
                     <div className="relative">
                        <Disc className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" size={20} />
                        <input 
                          className="w-full bg-black/40 border-2 border-white/[0.05] focus:border-indigo-500/50 rounded-3xl h-16 lg:h-20 pl-16 pr-8 text-sm lg:text-base font-mono text-indigo-400 placeholder:text-white/5 outline-none transition-all"
                          placeholder="https://open.spotify.com/track/..."
                          value={trackUrl}
                          onChange={e => setTrackUrl(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-[11px] font-black text-white/20 border-b border-white/5 pb-4 uppercase tracking-[0.2em]">Supported Protocols</h4>
                     <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group/plat">
                           <div className="w-10 h-10 rounded-xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center transition-all group-hover/plat:scale-110">
                              <ExternalLink size={18} />
                           </div>
                           <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Spotify</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group/plat">
                           <div className="w-10 h-10 rounded-xl bg-[#FF3300]/10 text-[#FF3300] flex items-center justify-center transition-all group-hover/plat:scale-110">
                              <Volume2 size={18} />
                           </div>
                           <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">SoundCloud</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group/plat">
                           <div className="w-10 h-10 rounded-xl bg-[#FA243C]/10 text-[#FA243C] flex items-center justify-center transition-all group-hover/plat:scale-110">
                              <Mic2 size={18} />
                           </div>
                           <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Apple</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 rounded-[40px] border border-white/[0.05] bg-[#1a1b2e]/20 flex gap-6 items-start">
               <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <Headphones size={24} />
               </div>
               <div className="space-y-1">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Background Transmission</h4>
                  <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                     Your background frequency will automatically activate when a visitor verifies their audio connection. 
                     Make sure your link is public.
                  </p>
               </div>
            </div>
         </div>

         {/* Visual Feedback / Preview */}
         <div className="lg:col-span-3 space-y-6">
            <div className="h-full min-h-[460px] p-8 lg:p-12 rounded-[48px] border border-white/[0.08] bg-black/40 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden group shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
               {embedUrl ? (
                  <div className="w-full h-full relative z-10 animate-in fade-in zoom-in duration-500">
                     <iframe
                        src={embedUrl}
                        width="100%"
                        height="380"
                        frameBorder="0"
                        allowTransparency={true}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                     />
                     <div className="mt-8 flex items-center justify-center gap-4">
                        <div className="flex gap-1">
                           {[1, 2, 3, 4, 5].map(i => (
                              <motion.div 
                                 key={i}
                                 animate={{ height: [10, 25, 10] }}
                                 transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                                 className="w-1 bg-indigo-500/40 rounded-full"
                              />
                           ))}
                        </div>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Signal Active</span>
                     </div>
                  </div>
               ) : (
                  <div className="space-y-8 relative z-10">
                     <div className="relative">
                        <div className="absolute -inset-10 bg-indigo-500/5 blur-[50px] rounded-full" />
                        <div className="w-48 h-48 rounded-[64px] border-2 border-dashed border-white/5 flex items-center justify-center bg-[#05060f] relative group-hover:border-white/20 transition-all duration-700">
                           <Music size={64} className="text-white/5 group-hover:text-indigo-500/20 transition-all" />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <h3 className="text-xl font-bold tracking-tight">FREQUENCY PREVIEW</h3>
                        <p className="text-[10px] text-white/20 max-w-[240px] mx-auto leading-relaxed uppercase tracking-[0.2em] font-black">
                           VERIFY YOUR ENDPOINT URL TO ACTIVATE <br /> THE SONIC MONITOR.
                        </p>
                     </div>
                  </div>
               )}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.05)_0%,transparent_70%)]" />
            </div>
         </div>

      </div>
    </div>
  );
}
