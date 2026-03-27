'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, MousePointer2, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const stats = [
    { label: 'Total Clicks', value: '1,284', icon: <MousePointer2 className="text-blue-500" />, trend: '+12.5%' },
    { label: 'Unique Visitors', value: '852', icon: <Users className="text-purple-500" />, trend: '+5.2%' },
    { label: 'Conversion Rate', value: '3.4%', icon: <TrendingUp className="text-emerald-500" />, trend: '+0.8%' },
  ];

  return (
    <div className="min-h-screen bg-background p-8 lg:p-12">
      <div className="glow-bg" />
      
      {/* Dashboard Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-end mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Performance</h1>
          <p className="text-foreground/50 mt-1">Real-time insights for your smart-bio.link.</p>
        </div>
        <button className="h-11 px-6 bg-accent text-background rounded-full font-semibold flex items-center space-x-2 hover:opacity-90 active:scale-95 transition-all">
          <Plus size={18} />
          <span>Add New Link</span>
        </button>
      </header>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-accent/5 rounded-2xl">
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-emerald-500">{stat.trend}</span>
            </div>
            <p className="text-sm font-medium text-foreground/50">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity / Most Clicked */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 size={20} />
              Most Clicked Links
            </h2>
          </div>
          <div className="space-y-4">
            <LinkStatItem title="Follow on Twitter" clicks={482} percent={45} />
            <LinkStatItem title="My New Album (Spotify)" clicks={290} percent={28} />
            <LinkStatItem title="Exclusive Merch (Store)" clicks={185} percent={18} />
            <LinkStatItem title="Sweden Summer Offer" clicks={127} percent={9} />
          </div>
        </div>

        <div className="glass p-8 rounded-3xl flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-accent/5 rounded-3xl flex items-center justify-center text-accent mb-6 animate-pulse">
            <Settings size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Smart Rules Active</h3>
          <p className="text-foreground/50 max-w-xs mb-6">
            Your "Sweden Summer Offer" is currently showing only to visitors from Sweden and will hide after 500 clicks.
          </p>
          <button className="text-sm font-semibold hover:underline">Manage Rules →</button>
        </div>
      </div>
    </div>
  );
}

function LinkStatItem({ title, clicks, percent }: { title: string, clicks: number, percent: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span>{title}</span>
        <span className="text-foreground/50">{clicks} clicks</span>
      </div>
      <div className="w-full h-2 bg-accent/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full bg-accent rounded-full"
        />
      </div>
    </div>
  );
}
