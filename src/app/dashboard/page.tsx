'use client';

import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { 
  Plus, GripVertical, Trash2, ExternalLink, ToggleLeft, ToggleRight, 
  Clock, MousePointer2, Globe, ChevronDown, ChevronUp, Pencil, X, Check 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  is_visible: boolean;
  clicks: number;
  rules: SmartRule[];
}

interface SmartRule {
  type: 'time_based' | 'click_limit' | 'location_based';
  config: Record<string, string | number | string[]>;
  is_active: boolean;
}

const DEMO_LINKS: LinkItem[] = [
  { id: '1', title: '🎵 My Latest Track on Spotify', url: 'https://spotify.com', is_visible: true, clicks: 342, rules: [] },
  { id: '2', title: '🛒 Exclusive Merch Store', url: 'https://store.example.com', is_visible: true, clicks: 218, rules: [] },
  { id: '3', title: '📸 Follow me on Instagram', url: 'https://instagram.com/me', is_visible: true, clicks: 156, rules: [] },
  { id: '4', title: '🇸🇪 Swedish Summer Offer', url: 'https://offer.example.com', is_visible: true, clicks: 89, rules: [
    { type: 'click_limit', config: { max_clicks: 500 }, is_active: true }
  ]},
];

export default function DashboardLinksPage() {
  const [links, setLinks] = useState<LinkItem[]>(DEMO_LINKS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewLink, setShowNewLink] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const toggleVisibility = (id: string) => {
    setLinks(links.map(l => l.id === id ? { ...l, is_visible: !l.is_visible } : l));
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const addLink = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: newTitle,
      url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
      is_visible: true,
      clicks: 0,
      rules: [],
    };
    setLinks([newLink, ...links]);
    setNewTitle('');
    setNewUrl('');
    setShowNewLink(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Links</h1>
          <p className="text-foreground/50 mt-1 text-sm">Drag to reorder. Click to edit. Toggle to show/hide.</p>
        </div>
        <button
          onClick={() => setShowNewLink(true)}
          className="h-10 px-5 bg-accent text-background rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all text-sm"
        >
          <Plus size={16} />
          Add Link
        </button>
      </div>

      {/* New Link Form */}
      <AnimatePresence>
        {showNewLink && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="glass rounded-2xl p-5 space-y-3">
              <input
                type="text"
                placeholder="Link title (e.g. My YouTube Channel)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full h-11 px-4 bg-accent/5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                autoFocus
              />
              <input
                type="text"
                placeholder="URL (e.g. https://youtube.com/@you)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full h-11 px-4 bg-accent/5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
              />
              <div className="flex gap-2">
                <button onClick={addLink} className="h-9 px-4 bg-accent text-background rounded-lg font-semibold text-sm flex items-center gap-1 hover:opacity-90">
                  <Check size={14} /> Add
                </button>
                <button onClick={() => setShowNewLink(false)} className="h-9 px-4 glass rounded-lg font-semibold text-sm flex items-center gap-1 hover:bg-accent/5">
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links List */}
      <Reorder.Group axis="y" values={links} onReorder={setLinks} className="space-y-3">
        <AnimatePresence>
          {links.map((link) => (
            <Reorder.Item
              key={link.id}
              value={link}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="relative"
            >
              <div className={cn(
                "glass rounded-2xl overflow-hidden transition-all",
                !link.is_visible && "opacity-50"
              )}>
                {/* Main Row */}
                <div className="flex items-center gap-3 px-4 py-4">
                  {/* Drag Handle */}
                  <div className="cursor-grab active:cursor-grabbing text-foreground/20 hover:text-foreground/50 transition-colors">
                    <GripVertical size={18} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {editingId === link.id ? (
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => setLinks(links.map(l => l.id === link.id ? { ...l, title: e.target.value } : l))}
                        onBlur={() => setEditingId(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                        className="w-full bg-transparent font-semibold text-sm focus:outline-none border-b-2 border-accent pb-0.5"
                        autoFocus
                      />
                    ) : (
                      <p 
                        className="font-semibold text-sm truncate cursor-pointer hover:text-accent transition-colors"
                        onClick={() => setEditingId(link.id)}
                      >
                        {link.title}
                      </p>
                    )}
                    <p className="text-xs text-foreground/40 truncate mt-0.5">{link.url}</p>
                  </div>

                  {/* Click Count */}
                  <div className="text-xs text-foreground/40 font-medium flex items-center gap-1 px-2">
                    <MousePointer2 size={12} />
                    {link.clicks}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setExpandedId(expandedId === link.id ? null : link.id)}
                      className="p-2 hover:bg-accent/5 rounded-lg transition-colors text-foreground/40 hover:text-foreground"
                    >
                      {expandedId === link.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <button
                      onClick={() => toggleVisibility(link.id)}
                      className="p-2 hover:bg-accent/5 rounded-lg transition-colors"
                    >
                      {link.is_visible 
                        ? <ToggleRight size={20} className="text-emerald-500" />
                        : <ToggleLeft size={20} className="text-foreground/30" />
                      }
                    </button>
                    <button
                      onClick={() => deleteLink(link.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors text-foreground/30 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Expanded Section - Smart Rules */}
                <AnimatePresence>
                  {expandedId === link.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2 border-t border-glass-border space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-foreground/40">Smart Rules</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <SmartRuleCard
                            icon={<Clock size={16} />}
                            title="Time-Based"
                            description="Show only at certain hours"
                            active={link.rules.some(r => r.type === 'time_based' && r.is_active)}
                          />
                          <SmartRuleCard
                            icon={<MousePointer2 size={16} />}
                            title="Click Limit"
                            description="Hide after X clicks"
                            active={link.rules.some(r => r.type === 'click_limit' && r.is_active)}
                          />
                          <SmartRuleCard
                            icon={<Globe size={16} />}
                            title="Location"
                            description="Show by country"
                            active={link.rules.some(r => r.type === 'location_based' && r.is_active)}
                          />
                        </div>

                        {/* URL Editor */}
                        <div className="space-y-1.5 pt-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-foreground/40">URL</label>
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => setLinks(links.map(l => l.id === link.id ? { ...l, url: e.target.value } : l))}
                            className="w-full h-10 px-4 bg-accent/5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {links.length === 0 && (
        <div className="text-center py-20">
          <p className="text-foreground/40 text-sm">No links yet. Click &quot;Add Link&quot; to get started!</p>
        </div>
      )}
    </div>
  );
}

function SmartRuleCard({ icon, title, description, active }: { 
  icon: React.ReactNode; title: string; description: string; active: boolean 
}) {
  return (
    <button className={cn(
      "flex items-start gap-3 p-3 rounded-xl border text-left transition-all hover:scale-[1.02]",
      active 
        ? "border-accent/30 bg-accent/5" 
        : "border-glass-border hover:border-accent/20"
    )}>
      <div className={cn(
        "mt-0.5 transition-colors",
        active ? "text-accent" : "text-foreground/30"
      )}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold">{title}</p>
        <p className="text-[11px] text-foreground/40 mt-0.5">{description}</p>
      </div>
    </button>
  );
}
