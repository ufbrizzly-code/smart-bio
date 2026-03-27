'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Link2, BarChart3, User, Palette, Settings, 
  Sparkles, LogOut, Eye, ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Links', icon: Link2 },
  { href: '/dashboard/appearance', label: 'Appearance', icon: Palette },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex">
      <div className="glow-bg" />

      {/* Sidebar */}
      <aside className="w-[260px] shrink-0 border-r border-glass-border flex flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="px-6 py-6 flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center text-background">
            <Sparkles size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight">SmartBio</span>
        </div>

        {/* Preview Button */}
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

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group',
                  isActive 
                    ? 'bg-accent text-background' 
                    : 'text-foreground/60 hover:text-foreground hover:bg-accent/5'
                )}
              >
                <item.icon size={18} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-accent rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-glass-border space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl glass">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">@username</p>
              <p className="text-xs text-foreground/40">Free Plan</p>
            </div>
            <ChevronRight size={14} className="text-foreground/30" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
