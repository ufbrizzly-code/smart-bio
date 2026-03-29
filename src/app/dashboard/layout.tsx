'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LogOut, Sparkles, ExternalLink, Eye, EyeOff, Copy, Check,
  User, AtSign, Link as LinkIcon, Image, Music, ShoppingBag,
  Share2, LayoutTemplate, BarChart3, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { useProfile, ProfileProvider } from '@/lib/profile-context';
import { motion, AnimatePresence } from 'framer-motion';
import { LinkTree } from '@/components/LinkTree';

// ── All 9 VoidLinks-style tabs ────────────────────────────────────────────────
const TABS = [
  { label: 'Profile',    href: '/dashboard',              icon: User,          exact: true },
  { label: 'Username',   href: '/dashboard/username',     icon: AtSign,        exact: false },
  { label: 'Links',      href: '/dashboard/links',        icon: LinkIcon,      exact: false },
  { label: 'Media',      href: '/dashboard/media',        icon: Image,         exact: false },
  { label: 'Sounds',     href: '/dashboard/sounds',       icon: Music,         exact: false },
  { label: 'Shop',       href: '/dashboard/shop',         icon: ShoppingBag,   exact: false },
  { label: 'Templates',  href: '/dashboard/appearance',   icon: LayoutTemplate,exact: false },
  { label: 'Share',      href: '/dashboard/share',        icon: Share2,        exact: false },
  { label: 'Analytics',  href: '/dashboard/analytics',    icon: BarChart3,     exact: false },
];

// ── Live Preview Panel ────────────────────────────────────────────────────────
function LivePreview({ hidden }: { hidden: boolean }) {
  const { profile, links } = useProfile();
  const [copied, setCopied] = useState(false);

  const publicUrl = profile
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${profile.username}`
    : '';

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (hidden) return null;

  return (
    <div className="hidden lg:flex flex-col w-[350px] shrink-0 sticky top-0 h-screen border-l border-white/[0.06] bg-[#020617] overflow-hidden">
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Preview Frame Container */}
        <div className="relative flex-1 rounded-[32px] border border-white/[0.08] bg-[#0a0a0a] shadow-2xl overflow-hidden flex flex-col group">
          
          {/* Top Bar with dot indicators */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-white/[0.04]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-white/30 uppercase tracking-widest">Live Preview</span>
              <div className="flex gap-1.5 ml-2">
                <div className="w-2 h-2 rounded-full bg-red-400 opacity-60" />
                <div className="w-2 h-2 rounded-full bg-yellow-400 opacity-60" />
                <div className="w-2 h-2 rounded-full bg-green-400 opacity-60" />
              </div>
            </div>
            <button
              onClick={copyUrl}
              className="text-[11px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
              {copied ? 'Copied' : 'Copy URL'}
            </button>
          </div>

          {/* Actual Phone Render */}
          <div className="relative flex-1 overflow-hidden bg-black grid place-items-center p-6">
             {/* Mock Phone Wrapper */}
             <div className="relative w-[260px] h-[520px] rounded-[44px] border-[6px] border-[#1a1a1a] bg-[#020617] shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden flex-shrink-0">
                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-20">
                    <div className="w-20 h-3.5 bg-black rounded-b-2xl border-x border-b border-white/[0.05]" />
                </div>
                {/* Scaled iframe-like content */}
                <div className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-none pt-7 pb-4">
                  <div style={{ transform: 'scale(0.58)', transformOrigin: 'top center', width: '440px', marginLeft: '-90px' }}>
                    {profile && <LinkTree profile={profile} links={links} />}
                  </div>
                </div>
             </div>
          </div>

          {/* Footer Info */}
          {profile && (
            <div className="px-5 py-3 border-t border-white/[0.04] bg-white/[0.02]">
              <div className="flex items-center justify-between text-[10px] text-white/20">
                <span className="capitalize">Theme: {profile.theme || 'void'}</span>
                <span className="font-mono text-[9px] uppercase tracking-tighter opacity-50">v1.2 // Production</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Shell ───────────────────────────────────────────────────────────
function DashboardShell({ children, user }: { children: React.ReactNode; user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = getSupabase();
  const { profile } = useProfile();
  const [previewHidden, setPreviewHidden] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const publicUrl = profile ? `/${profile.username}` : '#';

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col h-screen overflow-hidden">

      {/* ── Main Top Header ────────────────────────────────────────────────── */}
      <header className="border-b border-white/[0.06] bg-[#020617] z-50 flex-shrink-0 h-[60px] flex items-center px-6 justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-[18px] tracking-tight">VoidLinks</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href={publicUrl}
            target="_blank"
            className="flex items-center gap-2 text-[13px] font-medium text-white/50 hover:text-white transition-colors"
          >
            <ExternalLink size={14} />
            View Page
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-[13px] font-medium text-white/30 hover:text-red-400 transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Main Sidebar / Content Column ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
           {/* ── Sub Navigation (Tabs) ────────────────────────────────────────── */}
           <div className="px-6 pt-8 pb-4 flex items-center justify-between flex-shrink-0">
              <div className="space-y-1">
                 <h1 className="text-2xl font-bold tracking-tight text-white/90">SmartBio Dashboard</h1>
                 <p className="text-[13px] text-white/30 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    System Online // v2.4 High Consistency Mode
                 </p>
              </div>
             <button
               onClick={() => setPreviewHidden(h => !h)}
               className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-[13px] font-medium text-white/60 hover:text-white hover:border-white/20 transition-all shadow-lg"
             >
                {previewHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                {previewHidden ? 'Show Preview' : 'Hide Preview'}
             </button>
          </div>

          {/* Scrolling Tab Bar */}
          <div className="px-6 mb-6 flex-shrink-0">
             <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2" style={{ scrollbarWidth: 'none' }}>
               {TABS.map(tab => {
                 const isActive = tab.exact 
                   ? pathname === tab.href 
                   : pathname.startsWith(tab.href);
                 return (
                   <Link
                     key={tab.href}
                     href={tab.href}
                     className={cn(
                       'flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap relative',
                       isActive ? 'text-white' : 'text-white/40 hover:text-white/80'
                     )}
                   >
                     {isActive && (
                       <motion.div
                         layoutId="tab-indicator"
                         className="absolute inset-0 bg-purple-600 rounded-full -z-10 shadow-[0_0_25px_rgba(147,51,234,0.3)] ring-1 ring-white/20"
                         transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                       />
                     )}
                     {tab.label}
                   </Link>
                 );
               })}
             </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-20">
            <div className="max-w-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Subtle Glow at bottom */}
          <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none bg-gradient-to-t from-purple-500/5 to-transparent z-0" />
        </div>

        {/* ── Live Preview ─────────────────────────────────────────────────── */}
        <LivePreview hidden={previewHidden} />
      </div>
    </div>
  );
}

// ── Root Layout with Auth Check ───────────────────────────────────────────────
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  useEffect(() => {
    const init = async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push('/login'); return; }
      setUser(u);
      setLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.push('/login');
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] grid place-items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(79,70,229,0.3)] ring-1 ring-white/20">
            <Sparkles size={24} className="text-white" />
          </div>
          <p className="text-[10px] text-white/20 tracking-[0.4em] uppercase font-bold">Initializing Voidlinks</p>
        </div>
      </div>
    );
  }

  return (
    <ProfileProvider userId={user.id}>
      <DashboardShell user={user}>
        {children}
      </DashboardShell>
    </ProfileProvider>
  );
}
