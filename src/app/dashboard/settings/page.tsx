'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Copy, Shield, AlertTriangle, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { useProfile } from '@/lib/profile-context';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { profile, refreshProfile } = useProfile();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const router = useRouter();
  const supabase = getSupabase();

  useEffect(() => {
    const loadUser = async () => {
      if (profile) setUsername(profile.username);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setEmail(user.email ?? '');
    };
    loadUser();
  }, [profile]);

  const handleSave = async () => {
    if (!profile || !username.trim()) return;
    setSaving(true);
    setUsernameError('');

    const { error } = await supabase
      .from('profiles')
      .update({ username: username.toLowerCase() })
      .eq('id', profile.id);

    if (error) {
      if (error.message.includes('unique') || error.code === '23505') {
        setUsernameError('That username is already taken.');
      } else {
        setUsernameError(error.message);
      }
    } else {
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This will permanently delete your account and all your links.')) return;
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!profile) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-accent" size={28} /></div>;

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-foreground/40 mt-1 text-sm">Manage your account and link URL.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "h-10 px-5 rounded-xl font-bold flex items-center gap-2 transition-all text-sm active:scale-[0.97] disabled:opacity-50",
            saved ? "bg-emerald-500 text-white" : "bg-accent text-background hover:opacity-90"
          )}
        >
          {saving ? <Loader2 className="animate-spin" size={15} /> : saved ? <Check size={15} strokeWidth={3} /> : <Save size={15} />}
          {saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      {/* Username */}
      <section className="glass rounded-2xl p-6 mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/30 mb-5">Your Public URL</h2>
        <div>
          <label className="text-xs font-bold text-foreground/40 mb-2 block">Username</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-foreground/30 text-sm select-none pointer-events-none">
                {typeof window !== 'undefined' ? window.location.host : 'smartbio.link'}/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')); setUsernameError(''); }}
                className={cn("w-full h-11 pl-32 pr-4 bg-accent/5 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/20 border transition-all",
                  usernameError ? "border-red-500/40" : "border-glass-border"
                )}
              />
            </div>
            <button
              onClick={copyLink}
              className={cn("h-11 px-4 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shrink-0",
                copied ? "bg-emerald-500 text-white" : "glass hover:bg-accent/5"
              )}
            >
              {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <a
              href={`/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 px-3 glass rounded-xl flex items-center justify-center hover:bg-accent/5 transition-all text-foreground/40"
            >
              <ExternalLink size={16} />
            </a>
          </div>
          {usernameError && <p className="text-xs text-red-400 mt-2 font-semibold">{usernameError}</p>}
        </div>
      </section>

      {/* Account */}
      <section className="glass rounded-2xl p-6 mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/30 mb-5">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-foreground/40 mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full h-11 px-4 bg-accent/5 rounded-xl text-sm font-medium opacity-50 cursor-not-allowed border border-glass-border"
            />
            <p className="text-[10px] text-foreground/30 mt-1">Email cannot be changed here. Contact support.</p>
          </div>
          <div>
            <label className="text-xs font-bold text-foreground/40 mb-2 block">Password</label>
            <button
              onClick={async () => {
                await supabase.auth.resetPasswordForEmail(email);
                alert('Password reset email sent!');
              }}
              className="h-11 px-4 glass rounded-xl text-sm font-semibold hover:bg-accent/5 transition-all flex items-center gap-2 border border-glass-border"
            >
              <Shield size={14} />
              Send Password Reset Email
            </button>
          </div>
        </div>
      </section>

      {/* Plan */}
      <section className="glass rounded-2xl p-6 mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/30 mb-4">Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold">Free Plan</span>
              <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-bold rounded-md uppercase">Active</span>
            </div>
            <p className="text-xs text-foreground/30">Unlimited links · Basic analytics</p>
          </div>
          <button className="h-9 px-5 bg-gradient-to-r from-violet-600 to-blue-500 text-white rounded-xl font-bold text-xs hover:opacity-90 transition-all">
            Upgrade to Pro
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-2xl p-6 border-2 border-red-500/20">
        <h2 className="text-xs font-bold uppercase tracking-widest text-red-500/60 mb-4 flex items-center gap-2">
          <AlertTriangle size={13} /> Danger Zone
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Delete Account</p>
            <p className="text-xs text-foreground/30">Permanently removes your account and all data.</p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="h-9 px-4 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-bold text-sm transition-all"
          >
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}
