'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Zap, Shield, BarChart3, Globe, 
  ExternalLink, MousePointer2, Smartphone, Layout, 
  Play, Hexagon, Layers, Cpu, Radio, Fingerprint
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/login?username=${username.toLowerCase()}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-hidden selection:bg-indigo-500/30 font-inter">
      
      {/* ── DYNAMIC COLOR BACKGROUND ────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-[10%] left-[-5%] w-[45%] h-[45%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] right-[5%] w-[50%] h-[50%] bg-rose-500/10 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* ── NAVIGATION ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 h-24 flex items-center justify-between px-6 md:px-16 lg:px-24 z-[100] transition-all">
        <div className="absolute inset-x-0 top-0 h-full bg-black/40 backdrop-blur-2xl border-b border-white/[0.08]" />
        
        <div className="relative flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-rose-500 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(79,70,229,0.5)] group-hover:scale-110 transition-all duration-500 rotate-3 group-hover:rotate-0">
            <Sparkles size={24} className="animate-pulse" />
          </div>
          <div>
            <span className="font-black text-2xl tracking-tighter block leading-none">Smart Link</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Next-Gen Interface</span>
          </div>
        </div>

        <div className="relative hidden lg:flex items-center space-x-12">
          {['Ecosystem', 'Interface', 'Global Nodes', 'Docs'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all relative group">
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-indigo-500 transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="relative flex items-center gap-6">
           <Link href="/login" className="hidden sm:block text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all">Sign In</Link>
           <Link href="/login" className="px-8 py-3.5 bg-white text-black text-[12px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">Launch Studio</Link>
        </div>
      </nav>

      {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
      <main className="relative pt-48 lg:pt-60 pb-32 px-6 max-w-7xl mx-auto z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-full mb-12 backdrop-blur-md"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-400">Hyper-Connectivity Ready</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl xl:text-9xl font-black tracking-tighter mb-10 leading-[0.85] select-none"
            >
              YOUR DIGITAL <br />
              <span className="relative inline-block mt-4">
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-500">AURA CENTER.</span>
                 <div className="absolute -bottom-4 left-0 w-full h-2 bg-indigo-500/20 blur-sm rounded-full" />
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-2xl text-white/40 max-w-2xl mb-16 font-medium leading-relaxed"
            >
              The most sophisticated digital presence for high-performance entities. 
              <span className="text-white/80"> Dynamic link optimization, instant sonics, and boutique boutiques.</span>
            </motion.p>

            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleClaim}
              className="w-full max-w-xl group relative"
            >
              <div className="relative h-20 lg:h-24 p-2 bg-white/[0.03] border border-white/10 rounded-[32px] backdrop-blur-3xl flex items-center transition-all group-focus-within:border-indigo-500/50 group-focus-within:ring-4 group-focus-within:ring-indigo-500/10 shadow-2xl">
                 <div className="pl-6 pr-4 border-r border-white/10 text-white/20 font-black tracking-widest text-[11px] hidden sm:block">SMARTLINK.LINK/</div>
                 <input 
                   type="text" 
                   placeholder="IDENTITY"
                   value={username}
                   onChange={(e) => setUsername(e.target.value.toLowerCase())}
                   className="flex-1 bg-transparent border-none outline-none px-6 text-xl lg:text-2xl font-black placeholder:text-white/5 tracking-tighter text-white"
                 />
                 <button 
                   type="submit"
                   className="h-full px-10 bg-indigo-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all active:scale-[0.95] shadow-xl shadow-indigo-600/40"
                 >
                   CLAIM HANDLE
                   <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                 <Radio size={12} className="text-indigo-400" />
                 Global Domain Propagation Active
              </div>
            </motion.form>
          </div>

          {/* ── MOBILE MOCKUP / PREVIEW ────────────────────────────────────────── */}
          <div className="lg:col-span-5 relative perspective-1000 hidden lg:block">
             <motion.div
               style={{ y: y1 }}
               className="relative z-20 w-[380px] h-[760px] mx-auto rounded-[64px] border-[12px] border-black bg-[#020617] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/10"
             >
                {/* Simulated Bio Page Content */}
                <div className="absolute inset-0 p-8 pt-16 flex flex-col items-center bg-gradient-to-b from-indigo-950 to-black overflow-y-auto no-scrollbar">
                   <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-rose-400 mb-6 p-1">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-black text-3xl">JS</div>
                   </div>
                   <h3 className="text-2xl font-black tracking-tight mb-2">James Studio</h3>
                   <p className="text-xs text-white/40 uppercase tracking-[0.3em] font-black mb-10">Sound Architect</p>
                   
                   <div className="w-full space-y-4">
                      {[
                        { label: 'Latest Transmission', color: '#6366f1' },
                        { label: 'Global Ecosystem', color: '#10b981' },
                        { label: 'Digital Terminal', color: '#f59e0b' }
                      ].map((link, i) => (
                        <div key={i} className="w-full p-5 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.08] transition-all">
                           <span className="text-sm font-black uppercase tracking-widest">{link.label}</span>
                           <ExternalLink size={14} className="text-white/20 group-hover:text-white" />
                        </div>
                      ))}
                      <div className="w-full p-6 rounded-[40px] bg-gradient-to-br from-rose-500/20 to-indigo-500/20 border border-white/10 mt-10">
                         <div className="w-12 h-12 rounded-2xl bg-white/10 mb-4 flex items-center justify-center rotate-3"><Zap size={24} /></div>
                         <h4 className="text-lg font-black tracking-tight mb-2">Exclusive Artifact</h4>
                         <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-6">Vault Drop v1.2</p>
                         <button className="w-full py-4 rounded-3xl bg-white text-black font-black text-[10px] uppercase tracking-widest">Access Vault</button>
                      </div>
                   </div>

                   <div className="mt-12 text-[9px] font-black text-white/10 tracking-[0.2em]">BROADCAST BY SMART LINK</div>
                </div>
                
                {/* Floating elements attached to device */}
                <motion.div 
                  animate={{ y: [0, -20, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -right-20 top-20 w-40 p-6 rounded-[32px] bg-black/60 backdrop-blur-3xl border border-white/10 shadow-2xl z-30"
                >
                   <Fingerprint className="text-indigo-400 mb-4" size={24} />
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Biometric Check</p>
                </motion.div>

                <motion.div 
                  animate={{ x: [0, 20, 0] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -left-24 bottom-40 w-48 p-6 rounded-[32px] bg-black/60 backdrop-blur-3xl border border-white/10 shadow-2xl z-30"
                >
                   <div className="flex gap-1 mb-4">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-6 bg-cyan-400/40 rounded-full" />)}
                   </div>
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Real-time Oscilloscope</p>
                </motion.div>
             </motion.div>
          </div>

        </div>

        {/* ── STATS / TRUST SECTION ───────────────────────────────────────────── */}
        <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <StatCard label="Global Nodes" value="1,248+" detail="Fully Propagated" />
            <StatCard label="Live Streams" value="98.2M" detail="Total Interactions" />
            <StatCard label="Sync Latency" value="0.04ms" detail="Sub-Atomic Level" />
            <StatCard label="Trust Score" value="100%" detail="Protocol Integrity" />
        </div>

        {/* ── CAPABILITIES SECTION ────────────────────────────────────────────── */}
        <section id="ecosystem" className="mt-60 w-full relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
           
           <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
              <div className="max-w-2xl text-center md:text-left">
                <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-6 font-space">Protocol Artifacts</h2>
                <p className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">ELITE INFRASTRUCTURE <br /> FOR MODERN ENTITIES.</p>
              </div>
              <button className="px-10 py-5 rounded-3xl bg-white/[0.03] border border-white/10 text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all font-space shrink-0 mb-2">View Technical Stack</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <ModernCard 
               icon={<Hexagon className="text-cyan-400" />}
               label="MORPHOLOGY"
               title="Adaptive Skins"
               desc="Hyper-responsive theme engine that shifts aesthetics based on viewer interaction signals."
               color="cyan"
             />
             <ModernCard 
               icon={<Radio className="text-indigo-400" />}
               label="RESONANCE"
               title="Sonic Backgrounds"
               desc="Embed immersive background frequencies that activate the moment a user enters your space."
               color="indigo"
             />
             <ModernCard 
               icon={<Layers className="text-rose-400" />}
               label="COMMERCE"
               title="Instant Checkout"
               desc="The first bio link with built-in boutique capabilities. Sell anything, 0% platform fees."
               color="rose"
             />
             <ModernCard 
               icon={<Cpu className="text-purple-400" />}
               label="INTELLIGENCE"
               title="Neural Analytics"
               desc="Go beyond clicks. Understand the emotional resonance of every visitor interaction."
               color="purple"
             />
             <ModernCard 
               icon={<Zap className="text-green-400" />}
               label="CONNECTIVITY"
               title="Mesh Propagation"
               desc="Deploy your identity across our global mesh network for unshakeable 100% uptime."
               color="green"
             />
             <ModernCard 
               icon={<Shield className="text-orange-400" />}
               label="SECURITY"
               title="Biometric Protection"
               desc="Next-generation identity shielding. Your digital aura is protected by advanced protocols."
               color="orange"
             />
           </div>
        </section>

      </main>

      {/* ── CTA BOTTOM SECTION ────────────────────────────────────────────────── */}
      <section className="py-60 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-600/5 to-transparent" />
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <motion.div
               whileInView={{ opacity: 1, scale: 1 }}
               initial={{ opacity: 0, scale: 0.9 }}
               transition={{ duration: 0.8 }}
               className="p-16 md:p-32 rounded-[64px] border border-white/[0.08] bg-white/[0.02] backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col items-center"
            >
               <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-12">THE FUTURE IS <br /> <span className="text-indigo-400">WAITING FOR YOU.</span></h2>
               <Link href="/login" className="px-12 py-6 bg-white text-black text-lg font-black uppercase tracking-widest rounded-3xl hover:scale-110 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)]">Establish Connection</Link>
               <p className="mt-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Secured with 256-bit encryption</p>
            </motion.div>
         </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.08] py-32 px-6 lg:px-24 relative overflow-hidden bg-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-8 items-start mb-24">
             <div className="lg:col-span-4 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400">
                    <Sparkles size={24} />
                  </div>
                  <span className="font-black text-2xl tracking-tighter">Smart Link</span>
                </div>
                <p className="text-sm text-white/30 font-medium leading-relaxed max-w-sm">
                   Designing and engineering the global standard for digital identity and creative resonance.
                </p>
             </div>
             
             <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                  { title: 'Identity', links: ['Studio', 'Profile', 'Domains', 'Safety'] },
                  { title: 'Protocol', links: ['Economics', 'Network', 'Analytics', 'APIs'] },
                  { title: 'Company', links: ['About', 'Dispatch', 'Vault', 'Legal'] },
                  { title: 'Sonics', links: ['Oscillator', 'Resonance', 'Noise', 'Bass'] }
                ].map((col) => (
                  <div key={col.title} className="space-y-6">
                     <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] opacity-40">{col.title}</h4>
                     <ul className="space-y-4">
                        {col.links.map(link => (
                          <li key={link}><a href="#" className="text-[13px] font-black uppercase tracking-widest text-white/30 hover:text-indigo-400 transition-all">{link}</a></li>
                        ))}
                     </ul>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 pt-12 border-t border-white/5 opacity-40">
            <div className="text-[10px] font-black uppercase tracking-[0.4em]">© 2026 SMART LINK TRANSMISSION PROTOCOL</div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.4em]">
                <a href="#" className="hover:text-white transition-all">TWITTER</a>
                <a href="#" className="hover:text-white transition-all">DISCORD</a>
                <a href="#" className="hover:text-white transition-all">TERMINAL</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

function StatCard({ label, value, detail }: { label: string, value: string, detail: string }) {
   return (
      <div className="p-8 rounded-[40px] border border-white/[0.08] bg-black/40 backdrop-blur-xl group hover:border-indigo-500/30 transition-all duration-500">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">{label}</p>
         <h4 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-2 group-hover:text-indigo-400 transition-colors uppercase">{value}</h4>
         <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400/40">{detail}</p>
      </div>
   );
}

function ModernCard({ icon, label, title, desc, color }: { icon: React.ReactNode, label: string, title: string, desc: string, color: string }) {
  const colors: Record<string, string> = {
    indigo: 'group-hover:shadow-indigo-500/10 group-hover:border-indigo-500/40',
    cyan: 'group-hover:shadow-cyan-500/10 group-hover:border-cyan-500/40',
    rose: 'group-hover:shadow-rose-500/10 group-hover:border-rose-500/40',
    purple: 'group-hover:shadow-purple-500/10 group-hover:border-purple-500/40',
    green: 'group-hover:shadow-green-500/10 group-hover:border-green-500/40',
    orange: 'group-hover:shadow-orange-500/10 group-hover:border-orange-500/40',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "p-12 rounded-[48px] border border-white/[0.08] bg-black/20 hover:bg-white/[0.03] backdrop-blur-xl transition-all duration-700 flex flex-col group",
        colors[color]
      )}
    >
      <div className="flex items-center justify-between mb-12">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{label}</div>
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6">
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-black mb-6 tracking-tight text-white">{title}</h3>
      <p className="text-base text-white/30 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}
