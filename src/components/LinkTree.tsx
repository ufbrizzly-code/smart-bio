'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Share2, MoreHorizontal } from 'lucide-react';
import { Link, Profile } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LinkTreeProps {
  profile: Profile;
  links: Link[];
}

export function LinkTree({ profile, links }: LinkTreeProps) {
  // Logic to process smart links (time, clicks, etc.)
  const displayedLinks = links
    .filter((link) => {
      if (!link.is_visible) return false;
      
      // Apply Smart Rules logic here (future: server-side logic)
      if (link.rules) {
        for (const rule of link.rules) {
          if (!rule.is_active) continue;
          
          if (rule.rule_type === 'time_based' && rule.config) {
            const now = new Date();
            const hour = now.getHours();
            const start = parseInt(rule.config.start_time || '0');
            const end = parseInt(rule.config.end_time || '24');
            if (hour < start || hour >= end) return false;
          }
          
          if (rule.rule_type === 'click_limit' && rule.config.max_clicks) {
            if ((link.click_count || 0) >= rule.config.max_clicks) return false;
          }
        }
      }
      return true;
    })
    .sort((a, b) => a.position - b.position);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-6 py-12 min-h-screen">
      <div className="glow-bg" />
      
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-10 text-center"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <img 
            src={profile.avatar_url || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + profile.username}
            alt={profile.username}
            className="relative w-24 h-24 rounded-full border-4 border-background object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
          />
        </div>
        
        <h1 className="mt-6 text-xl font-semibold tracking-tight">@{profile.username}</h1>
        {profile.bio && (
          <p className="mt-2 text-foreground/60 max-w-sm text-sm leading-relaxed">
            {profile.bio}
          </p>
        )}
      </motion.div>

      {/* Links List */}
      <div className="w-full space-y-4">
        <AnimatePresence>
          {displayedLinks.map((link, index) => (
            <LinkCard key={link.id} link={link} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="mt-auto pt-16 pb-8"
      >
        <a 
          href="/" 
          className="text-xs font-medium tracking-widest uppercase hover:text-accent transition-colors"
        >
          Built with SmartBio
        </a>
      </motion.footer>
    </div>
  );
}

function LinkCard({ link, index }: { link: Link; index: number }) {
  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "glass flex items-center justify-between w-full p-4 hover-lift group relative overflow-hidden",
        "shimmer focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
      )}
    >
      <span className="font-medium truncate pr-4">{link.title}</span>
      <div className="flex items-center space-x-2 text-foreground/40 group-hover:text-foreground/80 transition-colors">
        <ExternalLink size={18} />
      </div>
    </motion.a>
  );
}
