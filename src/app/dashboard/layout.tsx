'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link2, BarChart3, Palette, Settings, 
  Sparkles, Eye, ChevronRight, Smartphone, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';

const navItems = [
  { href: '/dashboard', label: 'Links', icon: Link2 },
  { href: '/dashboard/appearance', label: 'Appearance', icon: Palette },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    };
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login');
      else setUser(session.user);
    });
    
    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background grid place-items-center">
        <Sparkles className="animate-pulse text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row h-screen overflow-hidden">
      <div className="glow-bg" />

      {/* Sidebar */}
      <aside className="w-full md:w-[260px] shrink-0 border-r border-glass-border flex flex-col h-auto md:h-screen sticky top-0 bg-background/50 backdrop-blur-xl z-50">
        <div className="px-6 py-6 flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center text-background">
            <Sparkles size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight">SmartBio</span>
        </div>

        <div className="px-4 mb-4">
          <Link
            href="/demo"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 h-10 glass rounded-xl text-sm font-semibold hover:bg-accent/5 transition-all"
          >
            <Eye size={16} />
            View My Page
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group',
                  isActive 
                    ? 'bg-accent/10 text-accent' 
                    : 'text-foreground/60 hover:text-foreground hover:bg-accent/5'
                )}
              >
                <item.icon size={18} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-y-0 -left-1 w-1 bg-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-glass-border">
          <button 
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto relative h-screen">
        <div className="grid lg:grid-cols-[1fr_400px] h-full">
          {/* Form Content */}
          <div className="p-8 lg:p-12">
            <div className="max-w-2xl mx-auto">
              {children}
            </div>
          </div>

          {/* Real-time Preview Pane */}
          <div className="hidden lg:flex shrink-0 bg-accent/[0.02] border-l border-glass-border items-center justify-center sticky top-0 h-screen">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/20 mb-6">
                <Smartphone size={12} />
                Live Preview
              </div>
              
              {/* Phone Mockup */}
              <div className="relative w-[300px] h-[600px] rounded-[3rem] border-[8px] border-zinc-900 bg-zinc-950 shadow-2xl overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-6 bg-zinc-900 rounded-b-xl z-20 flex justify-center items-center">
                  <div className="w-12 h-1 bg-zinc-800 rounded-full" />
                </div>
                
                <div className="w-full h-full overflow-y-auto overflow-x-hidden pt-10 px-4 scrollbar-hide">
                  <iframe 
                    src="/demo" 
                    className="w-full h-[150%] scale-[0.9] origin-top border-none pointer-events-none" 
                  />
                </div>
              </div>
              
              <div className="mt-8 px-4 py-2 glass rounded-full flex items-center gap-2">
                <Globe size={14} className="text-foreground/40" />
                <span className="text-[10px] font-bold text-foreground/40">smartbio.link/{user?.email?.split('@')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogOut({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  );
}
