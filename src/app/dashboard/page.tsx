'use client';

import React, { useState, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { 
  Plus, GripVertical, Trash2, ExternalLink, ToggleLeft, ToggleRight, 
  Clock, MousePointer2, Globe, ChevronDown, ChevronUp, Pencil, X, Check, Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  is_visible: boolean;
  clicks: number;
}

export default function DashboardLinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewLink, setShowNewLink] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const supabase = getSupabase();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profile) {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('profile_id', profile.id)
        .order('position', { ascending: true });

      if (data) setLinks(data);
    }
    setLoading(false);
  };

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setLinks(links.map(l => l.id === id ? { ...l, is_visible: newStatus } : l));
    
    await supabase
      .from('links')
      .update({ is_visible: newStatus })
      .eq('id', id);
  };

  const deleteLink = async (id: string) => {
    const originalLinks = [...links];
    setLinks(links.filter(l => l.id !== id));
    
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id);
    
    if (error) {
      setLinks(originalLinks);
      alert('Failed to delete link');
    }
  };

  const addLink = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    setSaving(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const url = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
    
    const { data, error } = await supabase
      .from('links')
      .insert({
        profile_id: user.id,
        title: newTitle,
        url: url,
        position: links.length,
        is_visible: true
      })
      .select()
      .single();

    if (data) {
      setLinks([data, ...links]);
      setNewTitle('');
      setNewUrl('');
      setShowNewLink(false);
    }
    setSaving(false);
  };

  const updateOrder = async (newLinks: LinkItem[]) => {
    setLinks(newLinks);
    // Batch update positions in Supabase
    const updates = newLinks.map((link, index) => ({
      id: link.id,
      position: index
    }));
    
    // Using Supabase RPC or individual updates for simplicity
    for (const update of updates) {
      await supabase.from('links').update({ position: update.position }).eq('id', update.id);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Links</h1>
          <p className="text-foreground/50 mt-1 text-sm">Real-time link management for your bio.</p>
        </div>
        <button
          onClick={() => setShowNewLink(true)}
          className="h-10 px-5 bg-accent text-background rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all text-sm"
        >
          <Plus size={16} />
          Add Link
        </button>
      </div>

      <AnimatePresence>
        {showNewLink && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="glass rounded-2xl p-5 space-y-3 shadow-xl">
              <input
                type="text"
                placeholder="Link title (e.g. My Website)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full h-11 px-4 bg-accent/5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                autoFocus
              />
              <input
                type="text"
                placeholder="URL (e.g. smartbio.site)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full h-11 px-4 bg-accent/5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <div className="flex gap-2">
                <button 
                  onClick={addLink} 
                  disabled={saving}
                  className="h-9 px-4 bg-accent text-background rounded-lg font-semibold text-sm flex items-center gap-1 hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />} Add
                </button>
                <button onClick={() => setShowNewLink(false)} className="h-9 px-4 glass rounded-lg font-semibold text-sm flex items-center gap-1 hover:bg-accent/5">
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Reorder.Group axis="y" values={links} onReorder={updateOrder} className="space-y-3">
        {links.map((link) => (
          <Reorder.Item key={link.id} value={link}>
            <div className={cn("glass rounded-2xl overflow-hidden transition-all", !link.is_visible && "opacity-50")}>
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="cursor-grab active:cursor-grabbing text-foreground/20 hover:text-foreground/50 transition-colors">
                  <GripVertical size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{link.title}</p>
                  <p className="text-xs text-foreground/40 truncate mt-0.5">{link.url}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleVisibility(link.id, link.is_visible)} className="p-2 hover:bg-accent/5 rounded-lg transition-colors">
                    {link.is_visible ? <ToggleRight size={20} className="text-emerald-500" /> : <ToggleLeft size={20} className="text-foreground/30" />}
                  </button>
                  <button onClick={() => deleteLink(link.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors text-foreground/30 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
