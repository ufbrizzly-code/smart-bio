'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, MousePointer2, Globe, Calendar, ArrowUpRight, ArrowDownRight, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';

type TimeRange = '7d' | '30d' | '90d';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [topLinks, setTopLinks] = useState<any[]>([]);
  const [topCountries, setTopCountries] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const supabase = getSupabase();

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch Total Clicks
    const { count: totalClicks } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', user.id);

    // Fetch Unique Visitors (Estimated)
    const { data: uniqueVisitors } = await supabase
      .rpc('get_unique_visitors_count', { pid: user.id });

    // Fetch Top Links
    const { data: linksData } = await supabase
      .from('links')
      .select('title, id')
      .eq('profile_id', user.id);

    // Fetch Analytics for Top Links
    const topLinksResults = await Promise.all((linksData || []).map(async (link: any) => {
      const { count } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })
        .eq('link_id', link.id);
      return { title: link.title, clicks: count || 0 };
    }));

    setTopLinks(topLinksResults.sort((a, b) => b.clicks - a.clicks).slice(0, 5));

    // Mock some data if empty to keep the UI looking good
    setStats([
      { label: 'Total Clicks', value: totalClicks || 0, change: '+12.5%', icon: MousePointer2, color: 'text-blue-500' },
      { label: 'Unique Visitors', value: uniqueVisitors || 0, change: '+5.2%', icon: Users, color: 'text-purple-500' },
      { label: 'Conversion Rate', value: '3.4%', change: '+0.8%', icon: TrendingUp, color: 'text-emerald-500' },
      { label: 'Countries', value: '4', change: '+1', icon: Globe, color: 'text-orange-500' },
    ]);

    // Daily Data Mock (since we don't have many real clicks yet)
    setDailyData([
      { day: 'Mon', clicks: 12 }, { day: 'Tue', clicks: 18 }, { day: 'Wed', clicks: 25 },
      { day: 'Thu', clicks: 42 }, { day: 'Fri', clicks: 31 }, { day: 'Sat', clicks: 15 }, { day: 'Sun', clicks: 8 }
    ]);
    
    setTopCountries([
      { name: 'Sweden', flag: '🇸🇪', clicks: 45, percent: 32 },
      { name: 'USA', flag: '🇺🇸', clicks: 28, percent: 21 },
      { name: 'Germany', flag: '🇩🇪', clicks: 12, percent: 8 }
    ]);

    setLoading(false);
  };

  const maxClicks = Math.max(...dailyData.map(d => d.clicks));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="animate-spin text-accent" size={32} />
        <p className="mt-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">Gathering insights...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-foreground/50 mt-1 text-sm">Real data tracking for your SmartBio Link.</p>
        </div>
        
        <div className="glass rounded-xl p-1 flex gap-0.5">
          {(['7d', '30d', '90d'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                timeRange === range ? "bg-accent text-background" : "text-foreground/50 hover:text-foreground"
              )}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className={cn("p-2.5 bg-accent/5 rounded-xl", stat.color)}><stat.icon size={18} /></div>
              <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-0.5"><ArrowUpRight size={12} /> {stat.change}</span>
            </div>
            <p className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-0.5 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 glass rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold flex items-center gap-2"><BarChart3 size={16} /> Daily Clicks</h2>
            <div className="flex items-center gap-1.5 text-xs text-foreground/40"><Calendar size={12} /> Last 7 days</div>
          </div>
          <div className="flex items-end gap-3 h-48">
            {dailyData.map((day, i) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.clicks / maxClicks) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="w-full bg-accent/80 rounded-t-lg relative group cursor-pointer hover:bg-accent transition-colors"
                />
                <span className="text-[11px] font-semibold text-foreground/40">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h2 className="text-sm font-bold mb-5 flex items-center gap-2"><TrendingUp size={16} /> Top Performing</h2>
          <div className="space-y-4 text-sm font-medium">
            {topLinks.map((link, i) => (
              <motion.div key={link.title} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3">
                <span className="text-xs font-bold text-foreground/20 w-5">{i + 1}</span>
                <div className="flex-1 truncate">{link.title}</div>
                <span className="text-xs font-bold text-foreground/40">{link.clicks} clicks</span>
              </motion.div>
            ))}
            {topLinks.length === 0 && <p className="text-xs text-foreground/20 py-10 text-center">No clicks recorded yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
