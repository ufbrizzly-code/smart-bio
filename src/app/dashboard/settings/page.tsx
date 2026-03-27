'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Check, Copy, Shield, Trash2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [username, setUsername] = useState('simon');
  const [email, setEmail] = useState('simon@example.com');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`smartbio.link/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-foreground/50 mt-1 text-sm">Manage your account and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            "h-10 px-5 rounded-xl font-semibold flex items-center gap-2 transition-all text-sm active:scale-[0.97]",
            saved
              ? "bg-emerald-500 text-white"
              : "bg-accent text-background hover:opacity-90"
          )}
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Username & URL */}
      <section className="glass rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground/40 mb-5">Your Link</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-foreground/40 mb-1.5 block">Username</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-foreground/30 text-sm font-medium">smartbio.link/</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  className="w-full h-11 pl-28 pr-4 bg-accent/5 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
              <button
                onClick={handleCopyLink}
                className={cn(
                  "h-11 px-4 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all",
                  copied ? "bg-emerald-500 text-white" : "glass hover:bg-accent/5"
                )}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="glass rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground/40 mb-5">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-foreground/40 mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 bg-accent/5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-foreground/40 mb-1.5 block">Password</label>
            <button className="h-11 px-4 glass rounded-xl text-sm font-semibold hover:bg-accent/5 transition-all flex items-center gap-2">
              <Shield size={14} />
              Change Password
            </button>
          </div>
        </div>
      </section>

      {/* Subscription */}
      <section className="glass rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground/40 mb-5">Subscription</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold">Free Plan</span>
              <span className="px-2 py-0.5 bg-accent/10 text-accent rounded-md text-[10px] font-bold uppercase">Current</span>
            </div>
            <p className="text-xs text-foreground/40">5 links · Basic analytics · 1 theme</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-10 px-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-shadow"
          >
            Upgrade to Pro
          </motion.button>
        </div>
        <div className="mt-4 p-4 bg-accent/[0.03] rounded-xl border border-accent/10">
          <p className="text-xs font-bold text-accent mb-1">Pro Plan — €5/month</p>
          <p className="text-[11px] text-foreground/50">Unlimited links · Smart Rules · Full analytics · All themes · Priority support</p>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="border-2 border-red-200 dark:border-red-500/20 rounded-2xl p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-red-500/70 mb-4 flex items-center gap-2">
          <AlertTriangle size={14} />
          Danger Zone
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Delete Account</p>
            <p className="text-xs text-foreground/40">Permanently delete your account, links, and analytics.</p>
          </div>
          <button className="h-9 px-4 bg-red-500/10 text-red-500 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-red-500/20 transition-all">
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}
