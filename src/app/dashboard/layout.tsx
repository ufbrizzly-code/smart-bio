'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Link2, BarChart3, Palette, Settings, Sparkles, Eye, Smartphone, Globe, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { ProfileProvider, useProfile } from '@/lib/profile-context';

const navItems = [
  { href: '/dashboard', label: 'Links', icon: Link2 },
  { href: '/dashboard/appearance', label: 'Appearance', icon: Palette },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

function LogOutIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

function PhonePreview() {
  const { profile } = useProfile();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0);

  const refreshPreview = () => setKey(k => k + 1);

  if (!profile) return null;

  return (
    <div className="hidden lg:flex shrink-0 bg-accent/[0.02] border-l border-glass-border items-center justify-center sticky top-0 h-screen w-[380px]">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-between w-[300px] mb-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/30">
            <Smartphone size={12} />
            Live Preview
          </div>
          <button
            onClick={refreshPreview}
            className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/30 hover:text-accent transition-colors"
          >
            <RefreshCw size={10} />
            Refresh
          </button>
        </div>

        {/* Phone Mockup */}
        <div className="relative w-[300px] h-[580px] rounded-[3rem] border-[8px] border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden ring-1 ring-white/5">
          {/* Notch */}
          <div className="absolute top-0 inset-x-0 h-7 bg-zinc-800 z-20 flex justify-center items-end pb-1.5">
            <div className="w-16 h-1.5 bg-zinc-700 rounded-full" />
          </div>
          <div className="w-full h-full overflow-hidden">
            <iframe
              key={key}
              ref={iframeRef}
              src={`/${profile.username}`}
              className="w-[150%] h-[150%] scale-[0.667] origin-top-left border-none"
              title="Bio Page Preview"
            />
          </div>
        </div>

        <a
          href={`/${profile.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 px-4 py-2 glass rounded-full flex items-center gap-2 hover:bg-accent/5 transition-all"
        >
          <Globe size={13} className="text-foreground/40" />
          <span className="text-[11px] font-bold text-foreground/50">localhost:3000/{profile.username}</span>
        </a>
      </div>
    </div>
  );
}

function DashboardShell({ children, user }: { children: React.ReactNode; user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = getSupabase();
  const { profile } = useProfile();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background flex h-screen overflow-hidden">
      <div className="glow-bg" />

      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 border-r border-glass-border flex flex-col h-screen bg-background/80 backdrop-blur-xl z-50">
        {/* Logo */}
        <div className="px-5 py-5 flex items-center space-x-2.5 border-b border-glass-border">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-background">
            <Sparkles size={16} />
          </div>
          <span className="font-bold text-base tracking-tight">SmartBio</span>
        </div>

        {/* View My Page */}
        <div className="px-3 pt-4 pb-2">
          <a
            href={profile?.username ? `/${profile.username}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 h-9 glass rounded-xl text-xs font-bold hover:bg-accent/5 transition-all text-foreground/60 hover:text-foreground"
          >
            <Eye size={14} />
            View My Page
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative',
                  isActive
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'text-foreground/50 hover:text-foreground hover:bg-accent/5'
                )}
              >
                <item.icon size={17} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 inset-y-1.5 w-0.5 bg-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-glass-border space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-xs font-bold text-accent">
              {(profile?.username?.[0] ?? user?.email?.[0] ?? '?').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">@{profile?.username ?? '…'}</p>
              <p className="text-[10px] text-foreground/30 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-foreground/30 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOutIcon />
            Sign out
          </button>
        </div>
      </aside>

      {/* Content + Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-10">
            {children}
          </div>
        </div>

        {/* Phone Preview */}
        <PhonePreview />
      </div>
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
      if (!u) {
        router.push('/login');
        return;
      }
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
      <div className="min-h-screen bg-background grid place-items-center">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="animate-pulse text-accent" size={32} />
          <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest">Loading…</p>
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
