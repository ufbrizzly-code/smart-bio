'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, BarChart3, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/${username.toLowerCase()}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-accent/10">
      <div className="glow-bg" />
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-background">
            <Sparkles size={18} />
          </div>
          <span>SmartBio</span>
        </div>
        <div className="flex items-center space-x-6 text-sm font-medium">
          <a href="#features" className="hover:text-accent/60 transition-colors">Features</a>
          <a href="/login" className="px-4 py-2 glass rounded-full hover:bg-accent hover:text-background transition-all">Login</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center space-x-2 glass px-4 py-1.5 rounded-full text-xs font-medium mb-8 border-accent/10"
        >
          <span className="text-secondary">Introducing Smart Links</span>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl mb-6 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent"
        >
          One Link. <br />
          Unlimited Intelligence.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-foreground/60 max-w-2xl mb-12"
        >
          The link-in-bio platform that adapts to your visitors. 
          Automated reordering, time-based offers, and location-smart links.
        </motion.p>

        {/* Claim Form */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleClaim}
          className="w-full max-w-md flex flex-col md:flex-row gap-3"
        >
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-4 flex items-center text-foreground/40 font-medium">smartbio.link/</div>
            <input 
              type="text" 
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-14 pl-32 pr-4 glass rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
            />
          </div>
          <button 
            type="submit"
            className="h-14 px-8 bg-accent text-background rounded-2xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-all group active:scale-[0.98]"
          >
            <span>Claim My Link</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.form>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full text-left">
          <FeatureCard 
            icon={<Zap />} 
            title="Auto-Reorder" 
            description="Our AI automatically moves your most clicked links to the top to maximize conversion."
          />
          <FeatureCard 
            icon={<Globe />} 
            title="Location Smart" 
            description="Show different links based on where your visitor is. Perfect for international brands."
          />
          <FeatureCard 
            icon={<BarChart3 />} 
            title="Deep Analytics" 
            description="Track every click, location, and device. Know exactly what converts."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass p-8 rounded-3xl group"
    >
      <div className="w-12 h-12 bg-accent/5 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-foreground/50 leading-relaxed">{description}</p>
    </motion.div>
  );
}
