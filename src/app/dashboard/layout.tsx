'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LogOut, Sparkles, ExternalLink, Eye, EyeOff, Copy, Check,
  User, AtSign, Link as LinkIcon, Image, Music, ShoppingBag,
  Share2, LayoutTemplate, BarChart3, Settings, ChevronRight,
  Monitor, Smartphone, Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { useProfile, ProfileProvider } from '@/lib/profile-context';
import { motion, AnimatePresence } from 'framer-motion';
import { LinkTree } from '@/components/LinkTree';

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

function LivePreview({ show, onClose }: { show: boolean, onClose: () => void }) {
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

  return (
    <div className={cn(
       "fixed inset-0 lg:relative lg:inset-auto z-50 lg:z-0 transition-all duration-500 flex flex-col",
       show ? "translate-y-0 opacity-100 lg:w-[400px] border-l border-white/[0.06] bg-[#020617]" : "translate-y-full lg:translate-y-0 opacity-0 lg:opacity-100 lg:w-0 overflow-hidden"
    )}>
      <div className="flex-1 flex flex-col p-4 lg:p-8 overflow-hidden relative">
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md border border-white/10"
        >
          <X size={20} />
        </button>

        {/* Preview Frame */}
        <div className="relative flex-1 rounded-[32px] lg:rounded-[48px] border border-white/[0.08] bg-black shadow-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 lg:py-5 flex items-center justify-between border-b border-white/[0.04]">
             <div className="flex items-center gap-2">
                <Smartphone size={14} className="text-white/40" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Broadcasting Live</span>
             </div>
             <button onClick={copyUrl} className="text-[10px] font-bold text-white/30 hover:text-white transition-colors flex items-center gap-2">
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
             </button>
          </div>

          <div className="relative flex-1 bg-[#020617] p-4 lg:p-8 overflow-hidden grid place-items-center">
             <div className="relative w-full max-w-[280px] aspect-[9/19] rounded-[40px] lg:rounded-[54px] border-[6px] lg:border-[8px] border-[#121212] bg-[#020617] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-4 lg:h-6 flex justify-center z-20">
                    <div className="w-16 lg:w-24 h-3 lg:h-4 bg-black rounded-b-2xl lg:rounded-b-3xl border-x border-b border-white/[0.05]" />
                </div>
                <div className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-none pt-6 lg:pt-8 pb-4">
                  <div className="flex justify-center" style={{ transform: 'scale(0.62)', transformOrigin: 'top center', width: '450px', marginLeft: '-85px' }}>
                    {profile && <LinkTree profile={profile} links={links} />}
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = getSupabase();
  const { profile } = useProfile();
  const [showPreview, setShowPreview] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    // Hide preview on path change for mobile
    if (window.innerWidth < 1024) {
      setShowPreview(false);
    }
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex overflow-hidden font-inter">
      
      {/* ── VERTICAL SIDEBAR (Desktop) ────────────────────────────────────────────── */}
      <aside className="w-[280px] shrink-0 border-r border-white/[0.06] bg-[#020617] hidden xl:flex flex-col z-50">
         <div className="p-8 pb-12">
            <Link href="/" className="flex items-center gap-4 group">
               <div className="w-10 h-10 rounded-[14px] bg-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:scale-110 transition-all">
                  <Sparkles size={18} />
               </div>
               <div>
                  <h1 className="font-black text-lg tracking-tight">SMART LINK</h1>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] -mt-1">Identity Studio</p>
               </div>
            </Link>
         </div>

         <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-none">
            {TABS.map(tab => {
               const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
               return (
                  <Link key={tab.href} href={tab.href} className={cn(
                     "flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all group relative",
                     isActive ? "text-white bg-white/[0.03]" : "text-white/30 hover:text-white/60 hover:bg-white/[0.01]"
                  )}>
                     <tab.icon size={18} className={cn("transition-all", isActive ? "text-indigo-400" : "group-hover:text-white/40")} />
                     <span className="flex-1">{tab.label}</span>
                     {isActive && <motion.div layoutId="sidebar-dot" className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.8)]" />}
                     {isActive && <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full" />}
                  </Link>
               );
            })}
         </nav>

         <div className="p-6 border-t border-white/[0.03]">
            <button onClick={handleSignOut} className="flex items-center gap-4 px-6 py-4 rounded-2xl w-full text-sm font-bold text-white/20 hover:text-red-400 hover:bg-red-500/5 transition-all">
               <LogOut size={16} />
               Sign Out
            </button>
         </div>
      </aside>

      {/* ── MOBILE OVERLAY MENU ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-[#020617] p-6 xl:hidden overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[14px] bg-indigo-600 flex items-center justify-center">
                    <Sparkles size={18} />
                  </div>
                  <h1 className="font-black text-lg tracking-tight">SMART LINK</h1>
               </div>
               <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <X size={20} />
               </button>
            </div>
            <nav className="grid grid-cols-2 gap-3 pb-20">
              {TABS.map(tab => {
                 const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
                 return (
                    <Link key={tab.href} href={tab.href} className={cn(
                       "flex flex-col items-center gap-4 p-5 rounded-3xl text-sm font-bold transition-all border",
                       isActive ? "text-white bg-indigo-600/10 border-indigo-500/30 ring-1 ring-indigo-500/20" : "text-white/30 bg-white/[0.02] border-white/5"
                    )}>
                       <tab.icon size={20} className={isActive ? "text-indigo-400" : ""} />
                       <span>{tab.label}</span>
                    </Link>
                 );
              })}
              <button onClick={handleSignOut} className="col-span-2 flex items-center justify-center gap-4 p-5 rounded-3xl text-sm font-bold text-red-400 bg-red-400/5 border border-red-400/10 mt-4">
                 <LogOut size={18} />
                 Sign Out Transmission
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN WORKSET area ─────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#05060f]">
         {/* Static Glow */}
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
         
         {/* Global Toolbar */}
         <header className="h-[70px] lg:h-[90px] shrink-0 flex items-center px-4 lg:px-10 justify-between relative z-10 border-b border-white/[0.03] lg:border-none">
            <div className="flex items-center gap-3 lg:gap-6">
               <button onClick={() => setMobileMenuOpen(true)} className="xl:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Menu size={20} />
               </button>
               <div className="space-y-0.5 lg:space-y-1">
                  <h2 className="hidden lg:block text-[8px] lg:text-sm font-black text-white/20 uppercase tracking-[0.2em]">Transmission Center</h2>
                  <div className="flex items-center gap-2 lg:gap-3">
                     <span className="hidden lg:block text-xl font-bold">Workspace</span>
                     <ChevronRight size={12} className="hidden lg:block text-white/20" />
                     <span className="text-sm lg:text-xl font-bold text-indigo-400 capitalize">{pathname.split('/').pop() || 'Dashboard'}</span>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
               {profile && (
                  <Link href={`/${profile.username}`} target="_blank" className="flex items-center gap-2 px-3 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl bg-white/[0.02] border border-white/[0.05] text-[10px] lg:text-[13px] font-bold text-white/60 hover:text-white transition-all">
                     <ExternalLink size={14} className="lg:size-14" />
                     <span className="hidden sm:inline">Live Page</span>
                  </Link>
               )}
               <button onClick={() => setShowPreview(!showPreview)} className={cn(
                  "flex items-center gap-2 px-3 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl text-[10px] lg:text-[13px] font-bold transition-all border",
                  showPreview ? "bg-indigo-600 border-transparent text-white shadow-xl shadow-indigo-900/20" : "bg-white/[0.02] border-white/[0.05] text-white/40"
               )}>
                  {showPreview ? <Eye size={14} /> : <EyeOff size={14} />}
                  <span className="hidden sm:inline">Preview</span>
               </button>
            </div>
         </header>

         {/* Scalable Content Surface */}
         <section className="flex-1 overflow-y-auto custom-scrollbar px-4 lg:px-10 pb-20 relative z-10">
            <div className="max-w-4xl pt-4 mx-auto">
               <AnimatePresence mode="popLayout" initial={false}>
                 <motion.div key={pathname} initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
                   {children}
                 </motion.div>
               </AnimatePresence>
            </div>
         </section>

         {/* Mobile Bottom Bar Placeholder or High Consistency Status */}
         <footer className="h-10 shrink-0 border-t border-white/[0.03] bg-[#020617] hidden lg:flex items-center justify-between px-10 relative z-10">
            <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
               <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /> Nodes Ready</span>
               <span>v2.4 Nocturnal Architecture</span>
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/10">Smart Link Studio © 2026</div>
         </footer>
      </main>

      {/* ── DYNAMIC PREVIEW PANEL ────────────────────────────────────────── */}
      <LivePreview show={showPreview} onClose={() => setShowPreview(false)} />
    </div>
  );
}

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
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(79,70,229,0.4)] ring-1 ring-white/20">
            <Sparkles size={32} className="text-white" />
          </div>
          <p className="text-[10px] text-white/30 tracking-[0.4em] uppercase font-bold animate-pulse">Initializing Transmission</p>
        </div>
      </div>
    );
  }

  return (
    <ProfileProvider userId={user.id}>
      <DashboardShell>
        {children}
      </DashboardShell>
    </ProfileProvider>
  );
}
