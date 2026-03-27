'use client';

import React, { useState, useCallback } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Plus, GripVertical, Trash2, ToggleLeft, ToggleRight, X, Check, Loader2, ExternalLink, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { useProfile } from '@/lib/profile-context';

export default function DashboardLinksPage() {
  const { links, setLinks, loading, profile } = useProfile();
  const [showNewLink, setShowNewLink] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const supabase = getSupabase();

  const toggleVisibility = async (id: string, cur: boolean) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, is_visible: !cur } : l));
    await supabase.from('links').update({ is_visible: !cur }).eq('id', id);
  };

  const deleteLink = async (id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
    await supabase.from('links').delete().eq('id', id);
  };

  const addLink = async () => {
    if (!newTitle.trim() || !newUrl.trim() || !profile) return;
    setSaving(true);
    const url = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
    const { data, error } = await supabase
      .from('links')
      .insert({ profile_id: profile.id, title: newTitle, url, position: links.length, is_visible: true })
      .select().single();
    if (data && !error) {
      setLinks(prev => [...prev, data]);
      setNewTitle('');
      setNewUrl('');
      setShowNewLink(false);
    }
    setSaving(false);
  };

  const startEdit = (id: string, title: string, url: string) => {
    setEditingId(id);
    setEditTitle(title);
    setEditUrl(url);
  };

  const saveEdit = async (id: string) => {
    if (!editTitle.trim()) return;
    setLinks(prev => prev.map(l => l.id === id ? { ...l, title: editTitle, url: editUrl } : l));
    await supabase.from('links').update({ title: editTitle, url: editUrl }).eq('id', id);
    setEditingId(null);
  };

  const updateOrder = async (newLinks: typeof links) => {
    setLinks(newLinks);
    await Promise.all(newLinks.map((link, i) =>
      supabase.from('links').update({ position: i }).eq('id', link.id)
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-accent" size={28} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Links</h1>
          <p className="text-foreground/40 mt-1 text-sm">{links.length} link{links.length !== 1 ? 's' : ''} · Drag to reorder</p>
        </div>
        <button
          onClick={() => { setShowNewLink(true); setNewTitle(''); setNewUrl(''); }}
          className="h-10 px-5 bg-accent text-background rounded-xl font-bold flex items-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all text-sm"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Link
        </button>
      </div>

      {/* New Link Form */}
      <AnimatePresence>
        {showNewLink && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-5"
          >
            <div className="glass rounded-2xl p-5 space-y-3 ring-1 ring-accent/10">
              <input
                type="text"
                placeholder="Title  (e.g. My YouTube Channel)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full h-11 px-4 bg-accent/5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && document.getElementById('url-input')?.focus()}
              />
              <input
                id="url-input"
                type="text"
                placeholder="URL  (e.g. youtube.com/@you)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full h-11 px-4 bg-accent/5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
              />
              <div className="flex gap-2 pt-1">
                <button
                  onClick={addLink}
                  disabled={saving || !newTitle.trim() || !newUrl.trim()}
                  className="h-9 px-5 bg-accent text-background rounded-lg font-bold text-sm flex items-center gap-1.5 hover:opacity-90 disabled:opacity-40 transition-all"
                >
                  {saving ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} strokeWidth={3} />}
                  Add
                </button>
                <button
                  onClick={() => setShowNewLink(false)}
                  className="h-9 px-4 glass rounded-lg font-semibold text-sm flex items-center gap-1.5 hover:bg-accent/5 text-foreground/50"
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links Reorder List */}
      {links.length === 0 && !showNewLink ? (
        <div className="flex flex-col items-center justify-center py-16 text-center glass rounded-2xl">
          <div className="w-12 h-12 bg-accent/5 rounded-2xl flex items-center justify-center mb-4">
            <Plus size={24} className="text-foreground/20" />
          </div>
          <p className="font-bold text-foreground/40">No links yet</p>
          <p className="text-sm text-foreground/20 mt-1">Click &quot;Add Link&quot; to get started</p>
        </div>
      ) : (
        <Reorder.Group axis="y" values={links} onReorder={updateOrder} className="space-y-2">
          <AnimatePresence initial={false}>
            {links.map((link) => (
              <Reorder.Item key={link.id} value={link} className="list-none">
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className={cn(
                    "glass rounded-2xl overflow-hidden transition-opacity",
                    !link.is_visible && "opacity-40"
                  )}
                >
                  {editingId === link.id ? (
                    /* Edit Mode */
                    <div className="p-4 space-y-2">
                      <input
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="w-full h-10 px-3 bg-accent/5 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/20"
                        autoFocus
                      />
                      <input
                        value={editUrl}
                        onChange={e => setEditUrl(e.target.value)}
                        className="w-full h-10 px-3 bg-accent/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                        onKeyDown={e => e.key === 'Enter' && saveEdit(link.id)}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(link.id)} className="h-8 px-4 bg-accent text-background rounded-lg text-xs font-bold flex items-center gap-1">
                          <Check size={12} strokeWidth={3} /> Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="h-8 px-3 glass rounded-lg text-xs font-semibold text-foreground/50">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div className="flex items-center gap-2 px-3 py-3.5">
                      <div className="cursor-grab active:cursor-grabbing p-1 text-foreground/20 hover:text-foreground/50 transition-colors shrink-0">
                        <GripVertical size={16} />
                      </div>
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => startEdit(link.id, link.title, link.url)}>
                        <p className="font-semibold text-sm truncate">{link.title}</p>
                        <p className="text-[11px] text-foreground/30 truncate mt-0.5">{link.url}</p>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={() => startEdit(link.id, link.title, link.url)}
                          className="p-2 hover:bg-accent/5 rounded-lg transition-colors text-foreground/20 hover:text-foreground/60"
                        >
                          <Pencil size={14} />
                        </button>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-accent/5 rounded-lg transition-colors text-foreground/20 hover:text-foreground/60"
                          onClick={e => e.stopPropagation()}
                        >
                          <ExternalLink size={14} />
                        </a>
                        <button
                          onClick={() => toggleVisibility(link.id, link.is_visible)}
                          className="p-2 hover:bg-accent/5 rounded-lg transition-colors"
                        >
                          {link.is_visible
                            ? <ToggleRight size={20} className="text-emerald-500" />
                            : <ToggleLeft size={20} className="text-foreground/20" />
                          }
                        </button>
                        <button
                          onClick={() => deleteLink(link.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-foreground/20 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}
    </div>
  );
}
