'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, MousePointer2, TrendingUp, Calendar, Loader2, 
  ArrowUpRight, ArrowDownRight, Activity, Globe, Zap, Clock 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { useProfile } from '@/lib/profile-context';

export default function AnalyticsPage() {
  const { profile, links } = useProfile();
  const supabase = getSupabase();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    conversion: 0
  });
  const [clickMap, setClickMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!profile) return;
    const fetchRealData = async () => {
      // 1. Fetch total clicks from analytics table
      const { data: allAnalytics, error: err1 } = await supabase
        .from('analytics')
        .select('created_at, link_id')
        .eq('profile_id', profile.id);

      if (err1) {
         setLoading(false);
         return;
      }

      const total = allAnalytics?.length || 0;
      
      // 2. Fetch today's clicks
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayClicks = allAnalytics?.filter(a => new Date(a.created_at) >= todayStart).length || 0;

      // 3. Map clicks per link
      const map: Record<string, number> = {};
      allAnalytics?.forEach(a => {
        map[a.link_id] = (map[a.link_id] || 0) + 1;
      });

      setClickMap(map);
      setStats({
        total,
        today: todayClicks,
        conversion: total > 0 ? 100 : 0 // Simplified for now
      });
      setLoading(false);
    };
    fetchRealData();
  }, [profile, supabase]);

  if (!profile || loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-purple-400" size={28} />
    </div>
  );

  const maxClicks = Math.max(...Object.values(clickMap), 1) || 1;

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
           <BarChart3 className="text-purple-400" size={24} />
           Real-Time Analytics
        </h1>
        <p className="text-sm text-white/40 mt-1">Direct statistics from your live bio page</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[32px] border border-white/[0.08] bg-[#0f1020]/40 relative overflow-hidden group">
             <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                   <MousePointer2 size={18} />
                </div>
                <div className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">LIVE</div>
             </div>
             <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Total Clicks</p>
             <h3 className="text-3xl font-bold">{stats.total.toLocaleString()}</h3>
          </div>

          <div className="p-6 rounded-[32px] border border-white/[0.08] bg-[#0f1020]/40 relative overflow-hidden group">
             <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                   <Activity size={18} />
                </div>
             </div>
             <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Clicks Today</p>
             <h3 className="text-3xl font-bold">{stats.today.toLocaleString()}</h3>
          </div>

          <div className="p-6 rounded-[32px] border border-white/[0.08] bg-[#0f1020]/40 relative overflow-hidden group text-white/40 grayscale">
             <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                   <TrendingUp size={18} />
                </div>
             </div>
             <p className="text-[11px] font-bold uppercase tracking-widest">Growth Rate</p>
             <h3 className="text-3xl font-bold">-- %</h3>
          </div>
      </div>

      <section className="space-y-6">
         <h2 className="text-lg font-bold text-white pl-2">Individual Link Performance</h2>

         <div className="rounded-[32px] border border-white/[0.08] bg-[#0f1020]/40 overflow-hidden">
            {links.length === 0 ? (
              <div className="p-20 text-center text-white/20 font-bold uppercase tracking-widest text-[10px]">No link data</div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {links.map((link, i) => {
                  const clicks = clickMap[link.id] || 0;
                  const percent = (clicks / maxClicks) * 100;
                  return (
                    <div key={link.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                       <div className="flex items-center justify-between mb-4">
                          <div>
                             <p className="text-[14px] font-bold text-white">{link.title.replace('[SHOP] ', '🛍️ ')}</p>
                             <p className="text-[10px] text-white/20 font-mono mt-1">{link.url.split('||')[0]}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-lg font-bold text-white">{clicks}</p>
                             <p className="text-[9px] font-bold text-white/20 uppercase">Clicks</p>
                          </div>
                       </div>
                       <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                          />
                       </div>
                    </div>
                  );
                })}
              </div>
            )}
         </div>
      </section>
    </div>
  );
}
