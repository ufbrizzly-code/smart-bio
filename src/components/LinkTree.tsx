'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, Globe, Layout, Share2, 
  Music, ShoppingBag, Mail, Phone, MessageCircle, Play, 
  Plus, Disc, Send, ShoppingCart, Package, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { Profile, Link as LinkItem } from '@/lib/types';

interface LinkTreeProps {
  profile: Profile;
  links: LinkItem[];
}

const ROUNDNESS_STYLES: Record<string, string> = {
  square: 'rounded-none',
  round: 'rounded-xl',
  rounder: 'rounded-2xl',
  full: 'rounded-full',
};

const SHADOW_STYLES: Record<string, string> = {
  none: '',
  soft: 'shadow-lg',
  strong: 'shadow-2xl shadow-black/30',
  hard: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]',
};

// Custom SVGs to avoid lucide-react brand errors
const SocialIcon = ({ id }: { id: string }) => {
  const props = { size: 20, fill: "currentColor" };
  switch (id) {
    case 'instagram': return (
      <svg viewBox="0 0 24 24" {...props} width="20" height="20">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
    case 'youtube': return (
      <svg viewBox="0 0 24 24" {...props} width="20" height="20">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432S15.818 12l-6.273 3.568z" />
      </svg>
    );
    case 'facebook': return (
      <svg viewBox="0 0 24 24" {...props} width="20" height="20">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
    default: return <Globe size={20} />;
  }
};

function getBrandConfig(title: string, url: string) {
  const t = title.toLowerCase();
  const u = url.toLowerCase();

  if (t.includes('instagram') || u.includes('instagram.com')) return { color: '#E4405F', label: 'Instagram', icon: <SocialIcon id="instagram" />, gradient: 'linear-gradient(135deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)' };
  if (t.includes('youtube') || u.includes('youtube.com')) return { color: '#FF0000', label: 'YouTube', icon: <SocialIcon id="youtube" />, gradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)' };
  if (t.includes('spotify') || u.includes('spotify.com')) return { color: '#1DB954', label: 'Spotify', icon: <Disc size={20} />, gradient: 'linear-gradient(135deg, #1DB954 0%, #191414 100%)' };
  if (t.includes('tiktok') || u.includes('tiktok.com')) return { color: '#000000', label: 'TikTok', icon: <Music size={20} />, gradient: 'linear-gradient(135deg, #000000 0%, #333333 100%)' };
  if (t.includes('twitter') || t.includes(' x ') || u.includes('twitter.com') || u.includes('x.com')) return { color: '#1DA1F2', label: 'X / Twitter', icon: <Send size={20} />, gradient: 'linear-gradient(135deg, #1DA1F2 0%, #0D8ECF 100%)' };
  if (t.includes('facebook') || u.includes('facebook.com')) return { color: '#1877F2', label: 'Facebook', icon: <SocialIcon id="facebook" />, gradient: 'linear-gradient(135deg, #1877F2 0%, #0C5DC7 100%)' };
  if (t.includes('mail') || u.includes('mailto:')) return { color: '#EA4335', label: 'Email', icon: <Mail size={20} />, gradient: 'linear-gradient(135deg, #EA4335 0%, #C5221F 100%)' };
  
  return { color: '#6366f1', label: 'Website', icon: <Globe size={20} />, gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' };
}

function getThemeStyles(theme: string | undefined) {
  const themes: Record<string, any> = {
    void: { background: 'linear-gradient(135deg, #020617 0%, #0f0520 100%)' },
    minimalist: { background: '#050505' },
    neon: { background: 'linear-gradient(135deg, #000000 0%, #0d0014 100%)' },
    ocean: { background: 'linear-gradient(135deg, #0c1a2e 0%, #0f2040 100%)' },
    dark: { background: '#000000' },
    midnight: { background: 'linear-gradient(135deg, #000010 0%, #050520 100%)' },
    aurora: { background: 'linear-gradient(135deg, #020617 0%, #0a1628 50%, #020810 100%)' },
  };
  return themes[theme || 'void'] || themes['void'];
}

export function LinkTree({ profile, links }: LinkTreeProps) {
  const supabase = getSupabase();

  const handleLinkClick = async (linkId: string) => {
    await supabase.from('analytics').insert({
      link_id: linkId,
      profile_id: profile.id,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    });
  };

  const regularLinks = (links || [])
    .filter(link => link.is_visible && !link.title.startsWith('[SHOP]'))
    .sort((a, b) => a.position - b.position);

  const shopItems = (links || [])
    .filter(link => link.is_visible && link.title.startsWith('[SHOP]'))
    .sort((a, b) => a.position - b.position);

  const shopSettings = (profile as any).shop_settings || {};
  const shopLayout = shopSettings.layout || 'grid';
  const shopBanner = shopSettings.banner_url || '';
  const shopDesc = shopSettings.description || '';
  const shopAccent = shopSettings.accent_color || profile.accent_color || '#8B5CF6';

  const themeStyle = getThemeStyles(profile.theme);
  const bgStyle: React.CSSProperties = {
    background: profile.custom_bg?.startsWith('http') || profile.custom_bg?.startsWith('https') ? 'transparent' : (profile.custom_bg || (themeStyle as any).background || '#020617'),
    fontFamily: profile.page_font ? `'${profile.page_font}', sans-serif` : 'Inter, sans-serif',
  };

  const isVideo = profile.custom_bg?.match(/\.(mp4|webm|ogg)$/) || profile.custom_bg?.includes('video');
  const isImage = profile.custom_bg?.match(/\.(jpg|jpeg|png|gif|webp)$/) || (profile.custom_bg?.startsWith('http') && !isVideo);

  const roundness = ROUNDNESS_STYLES[profile.button_roundness || 'rounder'];
  const shadow = SHADOW_STYLES[profile.button_shadow || 'soft'];
  const accentColor = profile.accent_color || '#a855f7';

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden" style={bgStyle}>
      
      {/* Immersive Media Background Layer */}
      {isVideo && (
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none brightness-[0.4]">
           <source src={profile.custom_bg} />
        </video>
      )}
      {isImage && (
        <div className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none brightness-[0.4]" style={{ backgroundImage: `url(${profile.custom_bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      )}

      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 600px 400px at 30% 10%, ${accentColor}18 0%, transparent 60%), radial-gradient(ellipse 400px 300px at 80% 80%, #3b82f618 0%, transparent 60%)` }} />

      <div className="relative z-10 w-full max-w-[560px] px-5 py-16 flex flex-col items-center">

        {/* Avatar + Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center mb-10 text-center">
          <div className="relative mb-5">
            <div className="absolute -inset-3 rounded-full opacity-40 blur-xl" style={{ backgroundColor: accentColor }} />
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 flex items-center justify-center" style={{ borderColor: `${accentColor}60` }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold" style={{ background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}10)`, color: accentColor }}>
                  {(profile.full_name || profile.username || '?')[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: profile.title_color || '#f8fafc', fontSize: profile.title_size === 'large' ? '28px' : '20px' }}>
            {profile.full_name || `@${profile.username}`}
          </h1>
          {profile.bio && <p className="text-sm leading-relaxed max-w-xs" style={{ color: profile.page_text_color || 'rgba(248,250,252,0.55)' }}>{profile.bio}</p>}
        </motion.div>

        {/* REGULAR LINKS SECTION */}
        <div className="w-full space-y-3">
          <AnimatePresence>
            {regularLinks.map((link, index) => {
              const brand = getBrandConfig(link.title, link.url);
              let cardStyle: React.CSSProperties = {
                background: (brand as any).gradient,
                borderColor: `${(brand as any).color}25`,
              };

              if (profile.button_style === 'solid' && profile.button_color) {
                cardStyle = { backgroundColor: profile.button_color, borderColor: 'transparent' };
              } else if (profile.button_style === 'outline') {
                cardStyle = { backgroundColor: 'transparent', borderColor: profile.button_color || (brand as any).color, borderWidth: '2px' };
              }

              return (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -3, boxShadow: `0 12px 40px ${(brand as any).color}30`, borderColor: `${(brand as any).color}50` }}
                  className={cn("flex items-center gap-4 p-4 h-[68px] border cursor-pointer transition-all select-none group relative overflow-hidden", roundness, shadow)}
                  style={cardStyle}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${(brand as any).color}20`, color: (brand as any).color }}>
                    {(brand as any).icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[16px] block truncate" style={{ color: profile.button_text_color || '#f8fafc' }}>{link.title}</span>
                    <span className="text-[9px] uppercase font-black tracking-widest text-white/10 group-hover:text-white/30 transition-colors block mt-0.5">{(brand as any).label}</span>
                  </div>
                  <ExternalLink size={14} className="flex-shrink-0 opacity-0 group-hover:opacity-40 transition-opacity" style={{ color: profile.button_text_color || '#f8fafc' }} />
                </motion.a>
              );
            })}
          </AnimatePresence>
        </div>

        {/* DEDICATED SHOP SECTION */}
        {shopItems.length > 0 && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="w-full mt-20 space-y-12">
              <div className="space-y-6 text-center">
                 {shopBanner && (
                    <div className="w-full aspect-[3/1] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl mb-8">
                       <img src={shopBanner} className="w-full h-full object-cover" alt="" />
                    </div>
                 )}
                 <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                       <ShoppingCart size={12} className="text-purple-400" />
                       Vault Collection
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">The Boutique</h2>
                    {shopDesc && <p className="text-sm text-white/40 max-w-sm leading-relaxed mx-auto">{shopDesc}</p>}
                 </div>
              </div>

              <div className={cn(
                 "w-full gap-6",
                 shopLayout === 'grid' ? "grid grid-cols-2" : "flex flex-col"
              )}>
                 {shopItems.map((item) => {
                    const parts = item.url.split('||');
                    const meta: any = {};
                    parts.forEach(p => { if (p.includes(':')) { const [k, ...v] = p.split(':'); meta[k] = v.join(':'); }});
                    
                    return (
                       <motion.a
                          key={item.id}
                          href={parts[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleLinkClick(item.id)}
                          whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                          className={cn(
                             "group relative overflow-hidden bg-black/40 border border-white/[0.08] p-5 transition-all hover:bg-black/60 hover:border-white/20",
                             (profile.button_roundness || 'rounder') === 'square' ? 'rounded-none' : (profile.button_roundness || 'rounder') === 'round' ? 'rounded-[32px]' : 'rounded-[40px]'
                          )}
                       >
                          <div className={cn("relative w-full aspect-square overflow-hidden mb-6", (profile.button_roundness || 'rounder') === 'square' ? 'rounded-none' : 'rounded-[24px]')}>
                             {meta.img ? (
                                <img src={meta.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                             ) : (
                                <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/10"><Package size={48} /></div>
                             )}
                             <div className="absolute top-4 right-4 px-4 py-2 rounded-2xl bg-black/80 backdrop-blur-xl text-xs font-black text-white shadow-2xl border border-white/10">
                                ${meta.price || '0.00'}
                             </div>
                          </div>
                          <div className="space-y-4">
                             <h4 className="font-bold text-white text-lg truncate leading-tight tracking-tight">{item.title.replace('[SHOP] ', '')}</h4>
                             <button 
                                className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl transition-all transform active:scale-95 group-hover:brightness-110"
                                style={{ backgroundColor: shopAccent, boxShadow: `0 10px 30px ${shopAccent}30` }}
                             >
                                Get Instant Access
                             </button>
                          </div>
                       </motion.a>
                    );
                 })}
              </div>
           </motion.div>
        )}

        {/* CTA Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.4 }} className="mt-24">
          <a href="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-90 hover:scale-105" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7, #3b82f6)', boxShadow: '0 15px 40px rgba(168,85,247,0.4)' }}>
            <span>✦</span>
            Brand your own Bio
          </a>
        </motion.div>

        {/* Footer */}
        {profile.show_footer !== false && (
          <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-20 flex flex-col items-center gap-5">
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(248,250,252,0.2)' }}>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(248,250,252,0.2)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              <span>Broadcast by <strong className="text-white/40">SmartBio</strong></span>
            </div>
          </motion.footer>
        )}
      </div>
    </div>
  );
}
