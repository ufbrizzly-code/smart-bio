'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const THEMES = [
  { id: 'minimal', name: 'Minimal', bg: '#fafafa', text: '#0a0a0a', accent: '#000' },
  { id: 'dark', name: 'Midnight', bg: '#0a0a0a', text: '#ffffff', accent: '#fff' },
  { id: 'ocean', name: 'Ocean', bg: '#0c1426', text: '#e0f0ff', accent: '#3b82f6' },
  { id: 'sunset', name: 'Sunset', bg: '#1a0a0a', text: '#ffeedd', accent: '#f97316' },
  { id: 'forest', name: 'Forest', bg: '#0a1a0f', text: '#d4f0d8', accent: '#22c55e' },
  { id: 'lavender', name: 'Lavender', bg: '#f5f0ff', text: '#2d1b69', accent: '#8b5cf6' },
];

const BUTTON_STYLES = [
  { id: 'rounded', label: 'Rounded', className: 'rounded-2xl' },
  { id: 'pill', label: 'Pill', className: 'rounded-full' },
  { id: 'sharp', label: 'Sharp', className: 'rounded-md' },
  { id: 'outline', label: 'Outline', className: 'rounded-2xl border-2 bg-transparent' },
];

export default function AppearancePage() {
  const [selectedTheme, setSelectedTheme] = useState('minimal');
  const [selectedButton, setSelectedButton] = useState('rounded');
  const [bio, setBio] = useState('Creator & Developer 🚀 Building cool things on the internet.');
  const [displayName, setDisplayName] = useState('Abdullah');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appearance</h1>
          <p className="text-foreground/50 mt-1 text-sm">Customize your profile and page style.</p>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            "h-10 px-5 rounded-xl font-semibold flex items-center gap-2 transition-all text-sm active:scale-[0.97]",
            saved 
              ? "bg-emerald-500 text-white" 
              : "bg-accent text-background hover:opacity-90"
          )}
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Profile Section */}
      <section className="glass rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground/40 mb-5">Profile</h2>
        
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <img
              src="https://api.dicebear.com/7.x/shapes/svg?seed=abdullah"
              alt="Avatar"
              className="w-20 h-20 rounded-2xl object-cover bg-accent/5"
            />
            <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={20} className="text-white" />
            </button>
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/40 mb-1.5 block">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full h-11 px-4 bg-accent/5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/40 mb-1.5 block">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={160}
                className="w-full px-4 py-3 bg-accent/5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none"
              />
              <p className="text-[11px] text-foreground/30 mt-1 text-right">{bio.length}/160</p>
            </div>
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section className="glass rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground/40 mb-5">Theme</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {THEMES.map((theme) => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTheme(theme.id)}
              className={cn(
                "relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all",
                selectedTheme === theme.id 
                  ? "border-accent ring-2 ring-accent/20" 
                  : "border-transparent hover:border-accent/20"
              )}
            >
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-2"
                style={{ background: theme.bg }}
              >
                <div className="w-6 h-6 rounded-full" style={{ background: theme.accent }} />
                <div className="w-full h-2.5 rounded-full" style={{ background: theme.accent, opacity: 0.7 }} />
                <div className="w-full h-2.5 rounded-full" style={{ background: theme.accent, opacity: 0.4 }} />
                <div className="w-full h-2.5 rounded-full" style={{ background: theme.accent, opacity: 0.2 }} />
              </div>
              {selectedTheme === theme.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-5 h-5 bg-accent text-background rounded-full flex items-center justify-center"
                >
                  <Check size={12} />
                </motion.div>
              )}
              <p 
                className="absolute bottom-1.5 inset-x-0 text-center text-[10px] font-bold"
                style={{ color: theme.text }}
              >
                {theme.name}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Button Styles */}
      <section className="glass rounded-2xl p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground/40 mb-5">Button Style</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BUTTON_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedButton(style.id)}
              className={cn(
                "p-4 border-2 rounded-xl transition-all hover:border-accent/30",
                selectedButton === style.id 
                  ? "border-accent bg-accent/5" 
                  : "border-glass-border"
              )}
            >
              <div className={cn(
                "w-full h-10 bg-accent/80 mb-2",
                style.className
              )} />
              <div className={cn(
                "w-full h-10 bg-accent/40 mb-2",
                style.className
              )} />
              <p className="text-xs font-bold text-center mt-3">{style.label}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
