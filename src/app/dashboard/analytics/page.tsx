'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, MousePointer2, Globe, 
  ArrowUpRight, ArrowDownRight, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TimeRange = '7d' | '30d' | '90d';

const STATS = [
  { label: 'Total Clicks', value: '1,284', change: '+12.5%', up: true, icon: MousePointer2, color: 'text-blue-500' },
  { label: 'Unique Visitors', value: '852', change: '+5.2%', up: true, icon: Users, color: 'text-purple-500' },
  { label: 'Click Rate', value: '3.4%', change: '+0.8%', up: true, icon: TrendingUp, color: 'text-emerald-500' },
  { label: 'Countries', value: '24', change: '+3', up: true, icon: Globe, color: 'text-orange-500' },
];

const TOP_LINKS = [
  { title: 'Follow on Twitter', clicks: 482, change: '+24' },
  { title: 'My New Album (Spotify)', clicks: 290, change: '+18' },
  { title: 'Exclusive Merch (Store)', clicks: 185, change: '-3' },
  { title: 'Sweden Summer Offer', clicks: 127, change: '+42' },
  { title: 'YouTube Channel', clicks: 98, change: '+7' },
];

const TOP_COUNTRIES = [
  { name: 'Sweden', flag: '🇸🇪', clicks: 412, percent: 32 },
  { name: 'United States', flag: '🇺🇸', clicks: 298, percent: 23 },
  { name: 'Germany', flag: '🇩🇪', clicks: 187, percent: 15 },
  { name: 'United Kingdom', flag: '🇬🇧', clicks: 142, percent: 11 },
  { name: 'Norway', flag: '🇳🇴', clicks: 98, percent: 8 },
];

const DAILY_DATA = [
  { day: 'Mon', clicks: 180 },
  { day: 'Tue', clicks: 220 },
  { day: 'Wed', clicks: 195 },
  { day: 'Thu', clicks: 310 },
  { day: 'Fri', clicks: 280 },
  { day: 'Sat', clicks: 150 },
  { day: 'Sun', clicks: 120 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const maxClicks = Math.max(...DAILY_DATA.map(d => d.clicks));

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-foreground/50 mt-1 text-sm">Track your performance and know what converts.</p>
        </div>
        
        {/* Time Range Toggle */}
        <div className="glass rounded-xl p-1 flex gap-0.5">
          {(['7d', '30d', '90d'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                timeRange === range 
                  ? "bg-accent text-background" 
                  : "text-foreground/50 hover:text-foreground"
              )}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={cn("p-2.5 bg-accent/5 rounded-xl", stat.color)}>
                <stat.icon size={18} />
              </div>
              <span className={cn(
                "text-[11px] font-bold flex items-center gap-0.5",
                stat.up ? "text-emerald-500" : "text-red-400"
              )}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-0.5 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Chart + Top Links */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="lg:col-span-3 glass rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <BarChart3 size={16} />
              Daily Clicks
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-foreground/40">
              <Calendar size={12} />
              Last 7 days
            </div>
          </div>
          
          <div className="flex items-end gap-3 h-48">
            {DAILY_DATA.map((day, i) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.clicks / maxClicks) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="w-full bg-accent/80 rounded-t-lg relative group cursor-pointer hover:bg-accent transition-colors"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent text-background px-2 py-0.5 rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {day.clicks} clicks
                  </div>
                </motion.div>
                <span className="text-[11px] font-semibold text-foreground/40">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Links */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h2 className="text-sm font-bold mb-5 flex items-center gap-2">
            <TrendingUp size={16} />
            Top Performing
          </h2>
          <div className="space-y-4">
            {TOP_LINKS.map((link, i) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <span className="text-xs font-bold text-foreground/20 w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{link.title}</p>
                  <p className="text-[11px] text-foreground/40">{link.clicks} clicks</p>
                </div>
                <span className={cn(
                  "text-[11px] font-bold",
                  link.change.startsWith('+') ? "text-emerald-500" : "text-red-400"
                )}>
                  {link.change}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Countries */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-sm font-bold mb-5 flex items-center gap-2">
          <Globe size={16} />
          Top Countries
        </h2>
        <div className="space-y-4">
          {TOP_COUNTRIES.map((country, i) => (
            <motion.div
              key={country.name}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4"
            >
              <span className="text-xl">{country.flag}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold">{country.name}</span>
                  <span className="text-foreground/50 text-xs">{country.clicks} clicks</span>
                </div>
                <div className="w-full h-2 bg-accent/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${country.percent}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    className="h-full bg-accent rounded-full"
                  />
                </div>
              </div>
              <span className="text-xs font-bold text-foreground/40 w-10 text-right">{country.percent}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
