'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Plus, Trash2, GripVertical, Check, Loader2, Globe, Sparkles, 
  ExternalLink, Eye, EyeOff, LayoutPanelTop, Music, ShoppingBag,
  Mail, Phone, MessageCircle, Video, PlayCircle, Radio, Disc,
  Send, Share2, Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { useProfile } from '@/lib/profile-context';
import { Link as LinkItem } from '@/lib/types';

// Expanded list of 20 platforms
const SOCIAL_PRESETS = [
  { id: 'instagram', label: 'Instagram', color: '#E4405F', url: 'https://instagram.com/' },
  { id: 'whatsapp', label: 'WhatsApp', color: '#25D366', url: 'https://wa.me/' },
  { id: 'tiktok', label: 'TikTok', color: '#010101', url: 'https://tiktok.com/@' },
  { id: 'youtube', label: 'YouTube', color: '#FF0000', url: 'https://youtube.com/' },
  { id: 'spotify', label: 'Spotify', color: '#1DB954', url: 'https://open.spotify.com/' },
  { id: 'threads', label: 'Threads', color: '#000000', url: 'https://threads.net/' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2', url: 'https://facebook.com/' },
  { id: 'twitter', label: 'X / Twitter', color: '#000000', url: 'https://twitter.com/' },
  { id: 'snapchat', label: 'Snapchat', color: '#FFFC00', url: 'https://snapchat.com/add/' },
  { id: 'discord', label: 'Discord', color: '#5865F2', url: 'https://discord.gg/' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', url: 'https://linkedin.com/in/' },
  { id: 'github', label: 'GitHub', color: '#333', url: 'https://github.com/' },
  { id: 'telegram', label: 'Telegram', color: '#26A5E4', url: 'https://t.me/' },
  { id: 'twitch', label: 'Twitch', color: '#9146FF', url: 'https://twitch.tv/' },
  { id: 'pinterest', label: 'Pinterest', color: '#E60023', url: 'https://pinterest.com/' },
  { id: 'applemusic', label: 'Apple Music', color: '#FA243C', url: 'https://music.apple.com/' },
  { id: 'soundcloud', label: 'SoundCloud', color: '#FF3300', url: 'https://soundcloud.com/' },
  { id: 'patreon', label: 'Patreon', color: '#F96854', url: 'https://patreon.com/' },
  { id: 'reddit', label: 'Reddit', color: '#FF4500', url: 'https://reddit.com/u/' },
  { id: 'email', label: 'Email', color: '#6366F1', url: 'mailto:' }
];

const PresetIcon = ({ id, color }: { id: string, color: string }) => {
  const props = { size: 24, style: { color } };
  const svgStyle = { color };
  
  switch (id) {
    case 'instagram': return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style={svgStyle}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
    case 'whatsapp': return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style={svgStyle}>
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.539 2.016 2.126-.54c1.029.563 2.025.861 3.162.861 3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.586-5.767-5.768-5.767zm3.391 8.205c-.142.404-.704.755-1.121.802-.379.043-.873.064-1.391-.219-.344-.188-.748-.466-1.171-.889-.423-.423-.746-.867-1.161-1.281C9.46 11.233 8.354 10.3 8.354 9.1c0-.441.175-.853.488-1.166.313-.313.725-.488 1.166-.488.163 0 .326.005.483.015.066.004.133.007.199.011l.24.48c.159.39.387.944.417 1.006.059.122.091.258.091.399 0 .221-.082.434-.233.585l-.47.47c-.07.07-.123.155-.154.249-.06.183.003.376.103.522l1.623 2.164c.2.267.494.423.81.423.23 0 .445-.083.616-.234l.325-.325c.15-.15.364-.233.585-.233.141 0 .277.032.399.091.062.03.616.258 1.006.417l.48.24c.004.066.007.133.011.199.01.157.015.32.015.483 0 .441-.175.853-.488 1.166-.313.313-.725.488-1.166.488-.344 0-.61-.097-.81-.22z" />
      </svg>
    );
    case 'tiktok': return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style={svgStyle}>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z" />
      </svg>
    );
    case 'youtube': return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style={svgStyle}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432S15.818 12l-6.273 3.568z" />
      </svg>
    );
    case 'spotify': return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style={svgStyle}>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    );
    case 'twitter': return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style={svgStyle}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    );
    case 'facebook': return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style={svgStyle}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
    case 'linkedin': return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style={svgStyle}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
    case 'github': return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style={svgStyle}>
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    );
    case 'discord': return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style={svgStyle}>
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
      </svg>
    );
    case 'threads': return <Disc {...props} />;
    case 'telegram': return <Send {...props} />;
    case 'twitch': return <PlayCircle {...props} />;
    case 'pinterest': return <Share2 {...props} />;
    case 'applemusic': return <Music {...props} />;
    case 'soundcloud': return <Music {...props} />;
    case 'patreon': return <ShoppingBag {...props} />;
    case 'reddit': return <Hash {...props} />;
    case 'email': return <Mail {...props} />;
    default: return <Plus {...props} />;
  }
};

export default function LinksPage() {
  const { profile, links, setLinks } = useProfile();
  const supabase = getSupabase();

  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [successAnim, setSuccessAnim] = useState(false);

  const handleReorder = async (newOrder: LinkItem[]) => {
    setLinks(newOrder);
    try {
      await Promise.all(
        newOrder.map((link, index) => 
          supabase.from('links').update({ position: index }).eq('id', link.id)
        )
      );
    } catch (err) {
      console.error('Failed to update link positions:', err);
    }
  };

  const toggleVisibility = async (id: string, visible: boolean) => {
    setLinks(links.map(l => l.id === id ? { ...l, is_visible: visible } : l));
    await supabase.from('links').update({ is_visible: visible }).eq('id', id);
  };

  const deleteLink = async (id: string) => {
    setLinks(links.filter(l => l.id !== id));
    await supabase.from('links').delete().eq('id', id);
  };

  const createLink = async () => {
    if (!newTitle.trim() || !newUrl.trim() || !profile) return;
    setAdding(true);
    const { data, error } = await supabase.from('links').insert({
        profile_id: profile.id, title: newTitle, url: newUrl, position: links.length, is_visible: true,
    }).select().single();
    if (!error && data) {
      setLinks([...links, data]); 
      setNewTitle(''); 
      setNewUrl('');
      setSuccessAnim(true);
      setTimeout(() => {
         setSuccessAnim(false);
         setShowAddModal(false);
      }, 1500);
    }
    setAdding(false);
  };

  const selectPreset = (preset: typeof SOCIAL_PRESETS[0]) => {
    setNewTitle(preset.label);
    setNewUrl(preset.url);
    setShowAddModal(true);
  };

  if (!profile) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-purple-400" size={28} /></div>;

  return (
    <div className="space-y-12 pb-32 max-w-5xl mx-auto min-h-screen">
      {/* Visual Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Transmission Center</h1>
          <p className="text-[13px] text-white/30 mt-1 uppercase tracking-[0.2em] font-bold">Select Frequencies</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(79,70,229,0.4)]"
        >
          <Plus size={16} />
          Pulse Link
        </button>
      </div>

      {/* Brighter Logos / Compact Grid */}
      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-5 px-1">
         {SOCIAL_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => selectPreset(preset)}
              className="flex flex-col items-center gap-3 group"
            >
               <div className="bg-[#05060b] w-full aspect-square rounded-[28px] flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/[0.04] group-hover:scale-110 group-hover:-translate-y-2 group-hover:border-white/20 group-hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)] group-active:scale-95 transition-all duration-400 backdrop-blur-md">
                  <div className="drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] transition-all">
                     <PresetIcon id={preset.id} color="#ffffff" />
                  </div>
               </div>
               <span className="text-[10px] font-bold text-white/60 group-hover:text-white transition-colors tracking-[0.05em] uppercase text-center">{preset.label}</span>
            </button>
         ))}
      </div>

      <div className="space-y-8 pt-10">
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
           <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] ml-1">Live Broadcast Streams</h3>
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Signal Stable</span>
           </div>
        </div>
        
        {links.length === 0 ? (
          <div className="py-24 text-center rounded-[48px] border border-dashed border-white/5 bg-white/[0.01]">
            <Globe className="mx-auto text-white/5 mb-4" size={32} />
            <p className="text-xs text-white/10 uppercase tracking-widest font-black">Waiting for Data Packets...</p>
          </div>
        ) : (
          <Reorder.Group axis="y" values={links} onReorder={handleReorder} className="space-y-4">
            {links.map((link) => (
              <Reorder.Item
                key={link.id}
                value={link}
                className={cn(
                  'group flex items-center gap-5 p-6 rounded-[32px] border transition-all cursor-grab active:cursor-grabbing backdrop-blur-xl',
                  link.is_visible ? 'bg-[#0a0c16]/90 border-white/[0.05] hover:border-white/20 hover:bg-white/[0.02]' : 'bg-black/40 border-white/5 opacity-40 shadow-none'
                )}
              >
                <div className="flex-shrink-0 text-white/5 group-hover:text-indigo-500 transition-colors"><GripVertical size={20} /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[17px] font-bold text-white tracking-tight">{link.title}</h3>
                  <p className="text-[12px] text-white/20 truncate font-mono mt-0.5 group-hover:text-white/40 transition-colors">{link.url.split('||')[0]}</p>
                </div>
                <div className="flex items-center gap-3">
                   <button onClick={() => toggleVisibility(link.id, !link.is_visible)} className="p-3 rounded-2xl bg-white/[0.03] text-white/20 hover:bg-white/10 hover:text-white transition-all"><Eye size={18} /></button>
                   <button onClick={() => deleteLink(link.id)} className="p-3 rounded-2xl bg-red-500/5 text-red-500/10 hover:bg-red-500/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Modal - Add Link */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] grid place-items-center p-4 lg:p-6 bg-black/98 backdrop-blur-3xl">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="w-full max-w-lg rounded-[40px] lg:rounded-[60px] border border-white/10 bg-[#020617] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
               {/* Animated Success Background */}
               <AnimatePresence>
                  {successAnim && (
                     <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center z-50 pointer-events-none"
                     >
                        <div className="flex flex-col items-center gap-4">
                           <motion.div initial={{ scale: 0.5 }} animate={{ scale: [0.5, 1.2, 1] }} className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.5)]">
                              <Check size={32} className="text-white lg:size-40" />
                           </motion.div>
                           <span className="text-base lg:text-lg font-black text-white uppercase tracking-[0.3em]">Signal Connected</span>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>

               <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[150px]" />
               <h2 className="text-2xl lg:text-4xl font-black text-white mb-2 lg:mb-3 tracking-tighter">Initiate Transmission</h2>
               <p className="text-xs lg:text-sm text-white/30 mb-8 lg:mb-12 leading-relaxed">Map your digital frequency to the bio matrix.</p>
               
               <div className="space-y-6 lg:space-y-10 relative z-10">
                  <div className="space-y-3 lg:space-y-4">
                     <label className="text-[10px] lg:text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Alias Node</label>
                     <input className="input-dark bg-black/60 border-white/[0.08] rounded-2xl lg:rounded-3xl h-14 lg:h-16 px-6 lg:px-8 text-base lg:text-lg font-bold placeholder:text-white/5" placeholder="Twitter" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                  </div>
                  <div className="space-y-3 lg:space-y-4">
                     <label className="text-[10px] lg:text-[11px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Endpoint Port</label>
                     <input className="input-dark bg-black/60 border-white/[0.08] rounded-2xl lg:rounded-3xl h-14 lg:h-16 px-6 lg:px-8 text-base font-mono text-indigo-400 placeholder:text-white/5" placeholder="https://..." value={newUrl} onChange={e => setNewUrl(e.target.value)} />
                  </div>
                  <div className="flex gap-4 lg:gap-6 pt-4 lg:pt-6">
                     <button onClick={() => setShowAddModal(false)} className="flex-1 h-14 lg:h-16 rounded-2xl lg:rounded-3xl font-black text-white/20 hover:bg-white/5 transition-all text-[10px] lg:text-xs uppercase tracking-widest">Abort</button>
                     <button onClick={createLink} disabled={adding || !newTitle || !newUrl || successAnim} className="flex-[2] h-14 lg:h-16 px-6 lg:px-12 rounded-2xl lg:rounded-3xl font-black text-white transition-all bg-indigo-600 shadow-[0_15px_40px_rgba(79,70,229,0.4)] disabled:opacity-30 text-[10px] lg:text-xs uppercase tracking-widest">{adding ? <Loader2 size={20} className="animate-spin" /> : 'Confirm Connection'}</button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
