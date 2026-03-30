'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Zap, Palette, Image as ImageIcon, Sparkles, LayoutGrid, Type, Footprints, MousePointer2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { useProfile } from '@/lib/profile-context';
import { Profile } from '@/lib/types';

// ── Themes Gallery ──────────────────────────────────────────────────────────
const THEMES = [
  {
    id: 'void',
    label: 'Void',
    desc: 'Dark ethereal with purple glow',
    bg: 'linear-gradient(135deg, #020617, #0f0520)',
    accent: '#a855f7',
    preview: { topGlow: '#a855f7', bottomGlow: '#3b82f6' },
  },
  {
    id: 'minimalist',
    label: 'Minimalist',
    desc: 'Clean, simple, no distractions',
    bg: '#111111',
    accent: '#ffffff',
    preview: { topGlow: '#444', bottomGlow: '#222' },
  },
  {
    id: 'neon',
    label: 'Neon',
    desc: 'Vibrant cyberpunk glow',
    bg: 'linear-gradient(135deg, #000, #0d0014)',
    accent: '#f0abfc',
    border: '#f0abfc',
    preview: { topGlow: '#f0abfc', bottomGlow: '#818cf8' },
  },
  {
    id: 'premium_aurora',
    label: 'Aurora Borealis',
    desc: 'Flowing northern colors',
    bg: 'linear-gradient(135deg, #020617, #0a2e2d)',
    accent: '#34d399',
    premium: true,
    preview: { topGlow: '#34d399', bottomGlow: '#2dd4bf' },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    desc: 'Deep blue sea waves',
    bg: 'linear-gradient(135deg, #0c1a2e, #0f2040)',
    accent: '#38bdf8',
    preview: { topGlow: '#38bdf8', bottomGlow: '#0ea5e9' },
  },
  {
    id: 'sunset',
    label: 'Sunset',
    desc: 'Warm purple-pink hues',
    bg: 'linear-gradient(135deg, #1a0a2e, #2d1040)',
    accent: '#f472b6',
    preview: { topGlow: '#f472b6', bottomGlow: '#c084fc' },
  },
];

const FONTS = ['Inter', 'Roboto', 'Outfit', 'Playfair Display', 'Bebas Neue', 'JetBrains Mono', 'Poppins', 'Lato'];

type Tab = 'profile' | 'themes' | 'buttons' | 'colors' | 'text' | 'footer';
const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'profile', label: 'Profile', icon: ImageIcon },
  { id: 'themes', label: 'Themes', icon: LayoutGrid },
  { id: 'buttons', label: 'Buttons', icon: MousePointer2 },
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'footer', label: 'Footer', icon: Footprints },
];

// ── Shared UI Components ───────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
     <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
     {children}
  </h3>
);

const ColorControl = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
    <div className="flex-1">
       <p className="text-[13px] font-medium text-white/70">{label}</p>
       <p className="text-[11px] text-white/20 font-mono">{value}</p>
    </div>
    <div className="relative w-10 h-10 rounded-xl overflow-hidden cursor-pointer ring-1 ring-white/10 p-0.5">
       <input type="color" value={value} onChange={e => onChange(e.target.value)} className="absolute -inset-2 w-16 h-16 cursor-pointer" />
       <div className="w-full h-full rounded-lg" style={{ backgroundColor: value }} />
    </div>
  </div>
);

const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
  <div className="flex items-center gap-2">
    <button 
      onClick={onClick} 
      className={cn(
        'w-10 h-5 rounded-full relative transition-all',
        on ? 'bg-purple-600' : 'bg-white/[0.1]'
      )}
    >
      <div className={cn('absolute top-1 w-3 h-3 rounded-full bg-white transition-all', on ? 'left-6' : 'left-1')} />
    </button>
  </div>
);

// ── Main Appearance Component ─────────────────────────────────────────────────
export default function AppearancePage() {
  const { profile, setProfile, refreshProfile } = useProfile();
  const supabase = getSupabase();

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [local, setLocal] = useState<Partial<Profile>>({});
  const initialized = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile && !initialized.current) {
      initialized.current = true;
      const clean: Partial<Profile> = {};
      (Object.keys(profile) as Array<keyof Profile>).forEach(k => {
        (clean as any)[k] = (profile as any)[k] ?? undefined;
      });
      setLocal(clean);
    }
  }, [profile]);

  const update = (field: keyof Profile, value: any) => {
    setLocal(prev => ({ ...prev, [field]: value }));
    setProfile(prev => prev ? { ...prev, [field]: value } : prev);
    setSaved(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    
    const ext = file.name.split('.').pop();
    const path = `avatars/${profile.id}_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file);
    
    if (uploadError) {
      console.error('Upload failed:', uploadError);
      alert('Upload failed. Ensure the "avatars" bucket exists and is public.');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    update('avatar_url', publicUrl);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update(local).eq('id', profile.id);
    if (!error) {
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      alert('Error saving: ' + error.message);
    }
    setSaving(false);
  };

  if (!profile) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-purple-400" size={28} />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">STUDIO</h1>
          <p className="text-xs lg:text-sm text-white/30 mt-1 uppercase tracking-widest font-bold">Visual customization engine</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            'px-8 lg:px-10 h-12 lg:h-14 rounded-2xl text-[12px] lg:text-[14px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 relative overflow-hidden group w-full md:w-auto',
            saved ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'bg-white text-black hover:bg-white/90 shadow-xl shadow-black/80'
          )}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <Check size={18} /> : <Zap size={18} />}
          <span>{saved ? 'Synchronized' : saving ? 'Transmitting' : 'Apply Changes'}</span>
        </button>
      </div>

      {/* Primary Studio Navigation */}
      <div className="flex gap-2 p-1.5 rounded-[18px] bg-white/[0.03] border border-white/[0.06] overflow-x-auto scrollbar-none w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              'flex items-center gap-2.5 px-6 py-2 rounded-xl text-[13px] font-bold transition-all relative overflow-hidden',
              activeTab === t.id
                ? 'bg-white/[0.07] text-white shadow-xl ring-1 ring-white/10'
                : 'text-white/40 hover:text-white/70'
            )}
          >
            {activeTab === t.id && (
              <motion.div layoutId="studio-active" className="absolute -inset-4 bg-purple-500/10 blur-xl rounded-full" />
            )}
            <t.icon size={14} className={activeTab === t.id ? 'text-purple-400' : ''} />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.15 }}
           className="min-h-[400px]"
        >
          {/* ── PROFILE ──────────────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="space-y-10 max-w-2xl">
               <section className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="space-y-4 flex flex-col items-center">
                     <SectionTitle>Profile Photo</SectionTitle>
                     <div 
                        className="relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                     >
                        <div className="absolute -inset-4 rounded-full bg-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-all" />
                        <div className="relative w-32 h-32 rounded-full border-2 border-white/10 overflow-hidden bg-white/5 flex items-center justify-center transition-all group-hover:border-purple-500/50">
                           {local.avatar_url ? (
                              <img src={local.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                           ) : (
                              <div className="flex flex-col items-center text-white/20">
                                 <ImageIcon size={32} />
                              </div>
                           )}
                           {uploading && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                 <Loader2 size={24} className="animate-spin text-white" />
                              </div>
                           )}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <Sparkles size={20} className="text-white" />
                           </div>
                        </div>
                        <input 
                           ref={fileInputRef}
                           type="file" 
                           accept="image/*" 
                           onChange={handleImageUpload} 
                           className="hidden" 
                        />
                     </div>
                     <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest text-center leading-relaxed">
                        PNG or JPG.<br/>Max 2MB recommended.
                     </p>
                  </div>

                  <div className="flex-1 space-y-8 w-full">
                     <div className="space-y-3">
                        <SectionTitle>Bio Details</SectionTitle>
                        <div className="space-y-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Display Name</label>
                              <input 
                                 className="input-dark bg-black/40 rounded-2xl h-14 px-6 text-sm font-bold" 
                                 placeholder="Your Name" 
                                 value={local.full_name || ''} 
                                 onChange={e => update('full_name', e.target.value)} 
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Bio / Description</label>
                              <textarea 
                                 className="input-dark bg-black/40 rounded-2xl p-6 text-sm leading-relaxed min-h-[120px] resize-none" 
                                 placeholder="Write a short summary about yourself..." 
                                 value={local.bio || ''} 
                                 onChange={e => update('bio', e.target.value)} 
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </section>
            </div>
          )}

          {/* ── THEMES ───────────────────────────────────────────────────── */}
          {activeTab === 'themes' && (
            <div className="space-y-10">
              <section>
                 <div className="flex items-center justify-between mb-6">
                    <SectionTitle>Select Theme</SectionTitle>
                    <span className="text-[10px] filter grayscale opacity-40 flex items-center gap-1 font-bold">
                       <Sparkles size={10} />
                       New Themes weekly
                    </span>
                 </div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                    {THEMES.map(theme => {
                      const selected = (local.theme || 'void') === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => update('theme', theme.id)}
                          className={cn(
                            'group relative rounded-[24px] lg:rounded-[28px] overflow-hidden border-2 text-left transition-all hover:scale-[1.02] active:scale-95',
                            selected 
                              ? 'border-indigo-600 shadow-[0_20px_40px_rgba(79,70,229,0.3)] ring-1 ring-indigo-600/50' 
                              : 'border-white/[0.06] hover:border-white/20'
                          )}
                        >
                          {/* Visual Preview */}
                          <div className="h-24 lg:h-28 relative overflow-hidden" style={{ background: theme.bg }}>
                             {/* Floating elements to simulate the theme */}
                             <div 
                               className="absolute top-2 left-1/2 -to-x-1/2 w-20 h-20 rounded-full blur-2xl opacity-40 animate-pulse" 
                               style={{ backgroundColor: theme.preview.topGlow }} 
                             />
                             <div className="absolute top-6 left-1/2 -translate-x-1/2 space-y-2 w-full px-4">
                                <div className="mx-auto w-6 h-6 rounded-full border border-white/20 bg-white/10" />
                                <div className="h-1.5 w-1/2 mx-auto rounded-full bg-white/20" />
                             </div>
                             {/* Selected Dot */}
                             {selected && (
                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-xl">
                                   <Check size={14} strokeWidth={3} />
                                </div>
                             )}
                          </div>
                          {/* Details */}
                          <div className="p-3 lg:p-4 bg-white/[0.02]">
                             <p className="text-[12px] lg:text-[14px] font-bold text-white flex items-center gap-2">
                                {theme.label}
                             </p>
                             <p className="text-[10px] lg:text-[11px] text-white/30 mt-0.5">{theme.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                 </div>
              </section>

              <section className="p-10 rounded-[48px] border border-white/[0.08] bg-black/40 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[120px] -z-10 group-hover:bg-indigo-600/20 transition-all duration-700" />
                 <div className="flex flex-col md:flex-row gap-10">
                    <div className="flex-1 space-y-6">
                       <div>
                          <SectionTitle>Immersive Wallpaper</SectionTitle>
                          <p className="text-xs text-white/20 leading-relaxed">Broadcast a cinematic masterpiece. Upload a high-res image or a seamless loop video (.mp4) for the entire background.</p>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ColorControl 
                            label="Solid Override" 
                            value={local.custom_bg || '#020617'} 
                            onChange={v => update('custom_bg', v)} 
                          />
                          <button 
                            onClick={() => update('custom_bg', '')}
                            className="h-14 px-6 rounded-2xl border border-white/5 bg-white/[0.02] text-[11px] font-black text-white/30 uppercase tracking-widest hover:bg-white/5 transition-all"
                          >
                            Reset to Theme
                          </button>
                       </div>
                    </div>

                    <div className="w-full md:w-64">
                       <input 
                         ref={fileInputRef} 
                         type="file" 
                         accept="image/*,video/*" 
                         className="hidden" 
                         onChange={async (e) => {
                           const file = e.target.files?.[0];
                           if (!file || !profile) return;
                           setUploading(true);
                           const ext = file.name.split('.').pop();
                           const path = `wallpapers/${profile.id}_${Date.now()}.${ext}`;
                           // Upload to wallpaper or generic bucket
                           const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file);
                           if (uploadError) {
                             console.error(uploadError);
                             alert('Upload failed: Ensure bucket is public.');
                             setUploading(false);
                             return;
                           }
                           const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
                           update('custom_bg', publicUrl);
                           setUploading(false);
                         }}
                       />
                       <button
                         onClick={() => fileInputRef.current?.click()}
                         disabled={uploading}
                         className="w-full aspect-video rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.01] hover:border-white/30 hover:bg-white/[0.03] transition-all flex flex-col items-center justify-center gap-2 group overflow-hidden relative"
                       >
                          {local.custom_bg?.startsWith('http') ? (
                             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center z-10">
                                <ImageIcon className="text-white/40" />
                             </div>
                          ) : (
                             <>
                                <Upload className="text-white/10 group-hover:text-white/40 transition-colors" size={24} />
                             <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Upload Media</p>
                             </>
                          )}
                          {uploading && (
                             <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                                <Loader2 size={20} className="animate-spin text-white" />
                             </div>
                          )}
                       </button>
                    </div>
                 </div>
              </section>
            </div>
          )}

          {/* ── BUTTONS ─────────────────────────────────────────────────── */}
          {activeTab === 'buttons' && (
            <div className="space-y-10">
               <section>
                  <SectionTitle>Button Style</SectionTitle>
                  <div className="grid grid-cols-3 gap-6">
                    {(['solid', 'glass', 'outline'] as const).map(style => (
                      <button
                        key={style}
                        onClick={() => update('button_style', style)}
                        className={cn(
                          'p-6 rounded-3xl border-2 text-center space-y-4 transition-all',
                          (local.button_style || 'solid') === style ? 'border-purple-600 bg-purple-600/5' : 'border-white/5 hover:border-white/20'
                        )}
                      >
                         <div className={cn(
                           'h-10 w-full rounded-xl mx-auto shadow-lg',
                           style === 'solid' ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : '',
                           style === 'glass' ? 'bg-white/10 backdrop-blur-md border border-white/20' : '',
                           style === 'outline' ? 'border-2 border-white/40' : ''
                         )} />
                         <p className="text-xs font-bold text-white uppercase tracking-widest">{style}</p>
                      </button>
                    ))}
                  </div>
               </section>

               <div className="grid grid-cols-2 gap-10 text-left">
                  <section>
                    <SectionTitle>Corner Roundness</SectionTitle>
                    <div className="grid grid-cols-4 gap-3">
                       {(['square', 'round', 'rounder', 'full'] as const).map(r => (
                          <button
                            key={r}
                            onClick={() => update('button_roundness', r)}
                            className={cn(
                              'aspect-square rounded-2xl border-2 flex items-center justify-center transition-all',
                              (local.button_roundness || 'rounder') === r ? 'border-purple-600 bg-purple-600/10' : 'border-white/5 hover:border-white/20 text-white/20 hover:text-white/40'
                            )}
                          >
                             <div className={cn(
                               'w-6 h-6 border-2 border-current',
                               r === 'square' ? 'rounded-none' : '',
                               r === 'round' ? 'rounded-md' : '',
                               r === 'rounder' ? 'rounded-lg' : '',
                               r === 'full' ? 'rounded-full' : ''
                             )} />
                          </button>
                       ))}
                    </div>
                  </section>

                  <section>
                    <SectionTitle>Button Shadow</SectionTitle>
                    <div className="grid grid-cols-4 gap-3">
                       {(['none', 'soft', 'strong', 'hard'] as const).map(s => (
                          <button
                            key={s}
                            onClick={() => update('button_shadow', s)}
                            className={cn(
                              'aspect-square rounded-2xl border-2 pt-1 transition-all',
                              (local.button_shadow || 'soft') === s ? 'border-purple-600 bg-purple-600/10' : 'border-white/5 hover:border-white/20 text-white/20 hover:text-white/40'
                            )}
                          >
                             <div className={cn(
                               'w-8 h-4 bg-current mx-auto rounded',
                               s === 'soft' ? 'shadow-lg shadow-black/80' : '',
                               s === 'strong' ? 'shadow-2xl shadow-indigo-500/50' : '',
                               s === 'hard' ? 'border border-black' : ''
                             )} />
                          </button>
                       ))}
                    </div>
                  </section>
               </div>
            </div>
          )}

          {/* ── COLORS ──────────────────────────────────────────────────── */}
          {activeTab === 'colors' && (
            <div className="max-w-2xl space-y-4">
              <SectionTitle>Custom Color Palette</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                 <ColorControl label="Button Background" value={local.button_color || '#ffffff'} onChange={v => update('button_color', v)} />
                 <ColorControl label="Button Text" value={local.button_text_color || '#000000'} onChange={v => update('button_text_color', v)} />
                 <ColorControl label="Accent & Glow" value={local.accent_color || '#a855f7'} onChange={v => update('accent_color', v)} />
                 <ColorControl label="Text Color (Bio)" value={local.page_text_color || '#94a3b8'} onChange={v => update('page_text_color', v)} />
              </div>
            </div>
          )}

          {/* ── TEXT ────────────────────────────────────────────────────── */}
          {activeTab === 'text' && (
            <div className="space-y-10">
               <section>
                  <SectionTitle>Typography</SectionTitle>
                  <div className="grid grid-cols-4 gap-3">
                     {FONTS.map(f => (
                        <button
                          key={f}
                          onClick={() => update('page_font', f)}
                          className={cn(
                            'p-4 rounded-2xl border-2 text-center transition-all',
                            (local.page_font || 'Inter') === f ? 'border-purple-600 bg-purple-600/10 text-white' : 'border-white/5 text-white/40 hover:text-white/60 hover:border-white/10'
                          )}
                          style={{ fontFamily: f }}
                        >
                           <span className="text-xl">Aa</span>
                           <p className="text-[10px] mt-1 font-bold">{f}</p>
                        </button>
                     ))}
                  </div>
               </section>

               <div className="grid grid-cols-2 gap-8">
                  <ColorControl label="Main Title Color" value={local.title_color || '#ffffff'} onChange={v => update('title_color', v)} />
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                     <p className="text-[13px] font-medium text-white/70">Large Title Size</p>
                     <Toggle 
                        on={local.title_size === 'large'} 
                        onClick={() => update('title_size', local.title_size === 'large' ? 'small' : 'large')} 
                     />
                  </div>
               </div>
            </div>
          )}

          {/* ── FOOTER ──────────────────────────────────────────────────── */}
          {activeTab === 'footer' && (
            <div className="max-w-md space-y-4">
               <SectionTitle>Page Meta & Footer</SectionTitle>
               <div className="flex items-center justify-between p-6 rounded-[32px] border border-white/5 bg-white/[0.02]">
                  <div>
                    <h4 className="text-sm font-bold">Smart Link Branding</h4>
                    <p className="text-[11px] text-white/30 mt-0.5">Show the broadcast signature</p>
                  </div>
                  <Toggle on={local.show_footer !== false} onClick={() => update('show_footer', !local.show_footer)} />
               </div>
               
               <div className="p-6 rounded-3xl border border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center text-center py-10">
                  <Footprints size={32} className="text-white/20 mb-3" />
                  <h4 className="text-sm font-bold">Custom Footer Links</h4>
                  <p className="text-[11px] text-white/30">Add external policy or legal links</p>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
