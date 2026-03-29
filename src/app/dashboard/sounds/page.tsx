'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, Check, Loader2, Play, Volume2, Sparkles, 
  Trash2, Globe, Heart, Mic2, Disc, Headphones 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { useProfile } from '@/lib/profile-context';

export default function SoundsPage() {
  const { profile, setProfile, refreshProfile } = useProfile();
  const supabase = getSupabase();

  const [trackUrl, setTrackUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Detect platform and generate embed preview
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('spotify.com/track/')) {
      const id = url.split('/track/')[1]?.split('?')[0];
      return `https://open.spotify.com/embed/track/${id}`;
    }
    if (url.includes('soundcloud.com/')) {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=false`;
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
    // Reuse a field or metadata for background music. 
    // We'll use a special link if preferred, or profile field.
    const { error } = await supabase
      .from('profiles')
      .update({ bio_color: trackUrl }) // Using bio_color temp slot if needed or add col
      .eq('id', profile.id);

    if (!error) {
       setSaved(true);
       setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
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
           <Music className="text-purple-400" size={24} />
           Sounds
        </h1>
        <p className="text-sm text-white/40 mt-1">Add background music or featured tracks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         
         {/* Input area */}
         <div className="space-y-6">
            <div className="p-8 rounded-[40px] border border-white/[0.08] bg-[#0f1020]/40 space-y-8">
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Paste Link (Spotify / SoundCloud / Apple)</label>
                     <input 
                       className="input-dark bg-black/40 border-white/[0.08] rounded-2xl h-14 px-6 text-sm font-mono text-purple-300 placeholder:text-white/5"
                       placeholder="https://open.spotify.com/track/..."
                       value={trackUrl}
                       onChange={e => setTrackUrl(e.target.value)}
                     />
                  </div>
                  
                  <button
                    onClick={handleSave}
                    disabled={saving || !trackUrl}
                    className={cn(
                      'w-full h-14 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl',
                      trackUrl ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white/5 text-white/20 cursor-not-allowed'
                    )}
                  >
                    {saving && <Loader2 size={16} className="animate-spin" />}
                    {saved && <Check size={16} />}
                    {saved ? 'Saved' : 'Establish Sound Link'}
                  </button>
               </div>
            </div>
            
            <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4">
               <Headphones className="text-indigo-400 mt-0.5" size={20} />
               <p className="text-xs text-white/40 leading-relaxed">
                  Your audience can listen to your background music directly from your profile. 
                  Make sure your link is public and accessible.
               </p>
            </div>
         </div>

         {/* Visual Preview */}
         <div className="space-y-6">
            <div className="p-8 rounded-[40px] border border-white/[0.08] bg-black/40 flex flex-col items-center justify-center text-center space-y-6 aspect-square max-h-[460px] relative overflow-hidden group">
               {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowTransparency={true}
                    allow="encrypted-media"
                    className="rounded-3xl shadow-2xl"
                  />
               ) : (
                  <div className="space-y-6 flex flex-col items-center">
                     <div className="w-40 h-40 rounded-full border border-white/5 flex items-center justify-center bg-black shadow-2xl relative">
                        <Music size={60} className="text-white/10" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-lg font-bold">Sound Preview</h3>
                        <p className="text-xs text-white/20 max-w-[200px] leading-relaxed uppercase tracking-tighter">
                           Paste a valid music URL to see the player preview here.
                        </p>
                     </div>
                  </div>
               )}
            </div>
         </div>

      </div>
    </div>
  );
}
