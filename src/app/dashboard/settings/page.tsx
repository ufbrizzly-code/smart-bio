'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Check, Trash2, AlertTriangle } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { useProfile } from '@/lib/profile-context';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { profile, setProfile } = useProfile();
  const supabase = getSupabase();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [savingPass, setSavingPass] = useState(false);
  const [passSaved, setPassSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setEmail(user.email);
    };
    loadUser();
  }, []);

  // ── Update password via Supabase Auth ────────────────────────────────────
  const handleUpdatePassword = async () => {
    if (!newPass || newPass.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    setSavingPass(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (!error) {
      setPassSaved(true);
      setCurrentPass('');
      setNewPass('');
      setTimeout(() => setPassSaved(false), 2500);
    } else {
      alert('Error: ' + error.message);
    }
    setSavingPass(false);
  };

  // ── Delete account ────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      alert('Please type DELETE to confirm.');
      return;
    }
    if (!profile) return;
    setDeleting(true);

    // Delete links
    await supabase.from('links').delete().eq('profile_id', profile.id);
    // Delete analytics
    await supabase.from('analytics').delete().eq('profile_id', profile.id);
    // Delete profile
    await supabase.from('profiles').delete().eq('id', profile.id);
    // Sign out
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!profile) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-purple-400" size={28} /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-1">Manage your account</p>
      </div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-white/[0.08] bg-[#0f172a]/80 p-6 space-y-4"
      >
        <h2 className="text-sm font-semibold text-white">Account</h2>
        <div>
          <label className="text-xs font-medium text-white/40 uppercase tracking-wider block mb-2">Email</label>
          <div className="h-11 px-4 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center">
            <span className="text-sm text-white/50">{email || '—'}</span>
          </div>
          <p className="text-xs text-white/25 mt-1.5">Email cannot be changed here.</p>
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-white/[0.08] bg-[#0f172a]/80 p-6 space-y-4"
      >
        <h2 className="text-sm font-semibold text-white">Change Password</h2>

        <div>
          <label className="text-xs font-medium text-white/40 uppercase tracking-wider block mb-2">New Password</label>
          <input
            type="password"
            className="input-dark"
            placeholder="Min. 6 characters"
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
          />
        </div>

        <button
          onClick={handleUpdatePassword}
          disabled={savingPass || !newPass}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 ${
            passSaved ? 'bg-green-600 text-white' : 'text-white hover:opacity-90'
          }`}
          style={!passSaved ? { background: 'linear-gradient(135deg, #6366f1, #a855f7)' } : {}}
        >
          {savingPass && <Loader2 size={15} className="animate-spin" />}
          {passSaved && <Check size={15} />}
          {passSaved ? 'Password Updated!' : savingPass ? 'Updating...' : 'Update Password'}
        </button>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-400" />
          <h2 className="text-sm font-semibold text-red-400">Danger Zone</h2>
        </div>

        <p className="text-xs text-white/40">
          Deleting your account will permanently remove all your links, profile data, and analytics. This cannot be undone.
        </p>

        <div>
          <label className="text-xs font-medium text-white/40 uppercase tracking-wider block mb-2">
            Type <strong className="text-red-400">DELETE</strong> to confirm
          </label>
          <input
            className="input-dark"
            placeholder="DELETE"
            value={deleteConfirm}
            onChange={e => setDeleteConfirm(e.target.value)}
          />
        </div>

        <button
          onClick={handleDeleteAccount}
          disabled={deleting || deleteConfirm !== 'DELETE'}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-40 transition-all"
        >
          {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          {deleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </motion.div>
    </div>
  );
}
