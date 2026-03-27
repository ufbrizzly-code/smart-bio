'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, Check, Loader2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { useProfile } from '@/lib/profile-context';

const THEMES = [
  { id: 'minimal', name: 'Minimal', bg: '#fafafa', text: '#0a0a0a', accent: '#0a0a0a' },
  { id: 'dark', name: 'Midnight', bg: '#0d0d0d', text: '#ffffff', accent: '#ffffff' },
  { id: 'ocean', name: 'Ocean', bg: '#0c1426', text: '#e0f0ff', accent: '#3b82f6' },
  { id: 'sunset', name: 'Sunset', bg: '#18090a', text: '#ffeedd', accent: '#f97316' },
  { id: 'forest', name: 'Forest', bg: '#0a1a0f', text: '#d4f0d8', accent: '#22c55e' },
  { id: 'lavender', name: 'Lavender', bg: '#f5f0ff', text: '#2d1b69', accent: '#8b5cf6' },
];

const BUTTON_STYLES = [
  { id: 'rounded', label: 'Rounded', radius: '16px' },
  { id: 'pill', label: 'Pill', radius: '999px' },
  { id: 'sharp', label: 'Sharp', radius: '6px' },
  { id: 'outline', label: 'Outline', radius: '16px', outline: true },
];

export default function AppearancePage() {
  const { profile, refreshProfile } = useProfile();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('minimal');
  const [selectedButton, setSelectedButton] = useState('rounded');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = getSupabase();

  // Populate from real data
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.full_name ?? '');
      setBio(profile.bio ?? '');
      setSelectedTheme(profile.theme ?? 'minimal');
      setSelectedButton(profile.button_style ?? 'rounded');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      full_name: displayName,
      bio,
      theme: selectedTheme,
      button_style: selectedButton,
    }).eq('id', profile.id);

    if (!error) {
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  if (!profile) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-accent" size={28} /></div>;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appearance</h1>
          <p className="text-foreground/40 mt-1 text-sm">Customize how your page looks to visitors.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "h-10 px-5 rounded-xl font-bold flex items-center gap-2 transition-all text-sm active:scale-[0.97] disabled:opacity-50",
            saved ? "bg-emerald-500 text-white" : "bg-accent text-background hover:opacity-90"
          )}
        >
          {saving ? <Loader2 className="animate-spin" size={15} /> : saved ? <Check size={15} strokeWidth={3} /> : <Save size={15} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Profile */}
      <section className="glass rounded-2xl p-6 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/30 mb-5">Profile Info</h2>
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/shapes/svg?seed=${profile.username}`}
              alt="Avatar"
              className="w-20 h-20 rounded-2xl object-cover bg-accent/5 border border-glass-border"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Upload size={18} className="text-white" />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-1.5 block">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name"
                className="w-full h-11 px-4 bg-accent/5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all border border-glass-border"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-1.5 block">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={160}
                placeholder="Tell visitors who you are…"
                className="w-full px-4 py-3 bg-accent/5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none border border-glass-border"
              />
              <p className="text-[10px] text-foreground/20 mt-1 text-right">{bio.length}/160</p>
            </div>
          </div>
        </div>
      </section>

      {/* Theme */}
      <section className="glass rounded-2xl p-6 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/30 mb-5">Page Theme</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {THEMES.map((theme) => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedTheme(theme.id)}
              className={cn(
                "relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all",
                selectedTheme === theme.id
                  ? "border-accent ring-2 ring-accent/30"
                  : "border-glass-border hover:border-accent/30"
              )}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-2" style={{ background: theme.bg }}>
                <div className="w-5 h-5 rounded-full" style={{ background: theme.accent }} />
                <div className="w-full h-2 rounded-full" style={{ background: theme.accent, opacity: 0.6 }} />
                <div className="w-full h-2 rounded-full" style={{ background: theme.accent, opacity: 0.35 }} />
                <div className="w-full h-2 rounded-full" style={{ background: theme.accent, opacity: 0.15 }} />
              </div>
              {selectedTheme === theme.id && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-accent text-background rounded-full flex items-center justify-center">
                  <Check size={11} strokeWidth={3} />
                </div>
              )}
              <p className="absolute bottom-1.5 inset-x-0 text-center text-[10px] font-bold" style={{ color: theme.text }}>
                {theme.name}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Button Style */}
      <section className="glass rounded-2xl p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/30 mb-5">Button Shape</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BUTTON_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedButton(style.id)}
              className={cn(
                "p-4 border-2 rounded-xl transition-all",
                selectedButton === style.id ? "border-accent bg-accent/5" : "border-glass-border hover:border-accent/20"
              )}
            >
              <div
                className="w-full h-9 mb-2.5 flex items-center justify-center text-[10px] font-bold text-foreground/60"
                style={{
                  borderRadius: style.radius,
                  background: selectedButton === style.id ? 'hsl(var(--accent) / 0.8)' : 'hsl(var(--accent) / 0.15)',
                  border: style.outline ? '2px solid currentColor' : 'none',
                  color: selectedButton === style.id ? 'hsl(var(--background))' : undefined,
                }}
              >
                My Link
              </div>
              <p className="text-xs font-bold text-center">{style.label}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
