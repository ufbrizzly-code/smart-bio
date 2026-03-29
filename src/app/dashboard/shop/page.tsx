'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, ShoppingBag, Plus, Trash2, Save, 
  Upload, Package, Eye, Settings, ClipboardList, Palette,
  ChevronDown, X, TrendingUp, User, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';
import { useProfile } from '@/lib/profile-context';

interface Product {
  id: string;
  title: string;
  price: string;
  url: string;
  image_url?: string;
  description?: string;
  type?: 'digital' | 'physical';
  active?: boolean;
}

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: 'paid' | 'pending' | 'shipped';
  date: string;
}

interface DBLink {
  id: string;
  title: string;
  url: string;
  position: number;
  is_visible: boolean;
}

type ShopTab = 'customize' | 'settings' | 'orders';

export default function ShopPage() {
  const { profile } = useProfile();
  const supabase = getSupabase();

  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<ShopTab>('customize');
  
  // Customization State
  const [bannerUrl, setBannerUrl] = useState('');
  const [shopDesc, setShopDesc] = useState('Welcome to my shop! Find amazing products here.');
  const [accentColor, setAccentColor] = useState('#8B5CF6');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  
  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [currency] = useState('USD $');
  const [description, setDescription] = useState('');
  const [productType, setProductType] = useState<'digital' | 'physical'>('digital');
  const [url, setUrl] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [applying, setApplying] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  // Mock Orders State
  const [orders] = useState<Order[]>([
    { id: '1', customer: 'alex@example.com', product: 'Digital Art Pack', amount: '29.99', status: 'paid', date: '2 hours ago' },
    { id: '2', customer: 'sarah.j@web.net', product: 'Minimalist Presets', amount: '15.00', status: 'paid', date: '5 hours ago' },
    { id: '3', customer: 'mike_ru@proton.me', product: 'Signed Hoodie', amount: '85.00', status: 'shipped', date: 'Yesterday' },
  ]);

  useEffect(() => {
    if (!profile) return;
    const load = async () => {
      const { data } = await supabase
        .from('links')
        .select('*')
        .eq('profile_id', profile.id)
        .like('title', '[SHOP]%')
        .order('position', { ascending: true });

      if (data) {
        setProducts((data as DBLink[]).map((d) => {
          const parts = d.url.split('||');
          const meta: Record<string, string> = {};
          parts.forEach((p: string) => {
             if (p.includes(':')) {
                const [k, ...v] = p.split(':');
                meta[k] = v.join(':');
             }
          });
          
          return {
            id: d.id,
            title: d.title.replace('[SHOP] ', ''),
            url: parts[0],
            price: meta.price || '',
            image_url: meta.img || '',
            description: meta.desc || '',
            type: (meta.type as 'digital' | 'physical') || 'digital',
            active: d.is_visible
          };
        }));
      }
    };
    load();
  }, [profile, supabase]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'img' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    
    const ext = file.name.split('.').pop();
    const path = `shop/${profile.id}_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file);
    
    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    if (target === 'img') setImageUrl(publicUrl);
    if (target === 'banner') setBannerUrl(publicUrl);
    setUploading(false);
  };

  const handleApplyCustomization = async () => {
     setApplying(true);
     setTimeout(() => {
        setApplying(false);
        alert('Shop appearance updated successfully!');
     }, 800);
  };

  const handleAdd = async () => {
    if (!title.trim() || !profile) return;
    setSaving(true);
    
    const metaStr = `price:${price}||img:${image_url}||desc:${description}||type:${productType}`;
    const encodedUrl = `${url || '#'}${metaStr ? '||' + metaStr : ''}`;
    
    const { data, error } = await supabase
      .from('links')
      .insert({
        profile_id: profile.id,
        title: `[SHOP] ${title}`,
        url: encodedUrl,
        position: products.length,
        is_visible: isActive,
      })
      .select()
      .single();

    if (!error && (data as DBLink)) {
      const d = data as DBLink;
      setProducts(prev => [...prev, { id: d.id, title, price, url, image_url, description, type: productType, active: isActive }]);
      setTitle(''); setPrice(''); setUrl(''); setImageUrl(''); setDescription(''); setProductType('digital');
      setShowForm(false);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    await supabase.from('links').delete().eq('id', id);
  };

  if (!profile) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-purple-400" size={28} /></div>;

  return (
    <div className="space-y-8 pb-32 max-w-5xl mx-auto">
      
      {/* Top Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/40 border border-white/5 w-fit">
         {[
           { id: 'customize', label: 'Customize', icon: Palette },
           { id: 'settings', label: 'Settings', icon: Settings },
           { id: 'orders', label: 'Orders', icon: ClipboardList }
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as ShopTab)}
             className={cn(
               "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all",
               activeTab === tab.id ? "bg-white/5 text-white" : "text-white/30 hover:text-white/50"
             )}
           >
              <tab.icon size={14} />
              {tab.label}
           </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* CUSTOMIZE TAB */}
        {activeTab === 'customize' && (
          <motion.div key="customize" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="p-10 rounded-[40px] border border-white/[0.08] bg-[#0a0c16]/50 backdrop-blur-xl space-y-10">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-xl ring-1 ring-white/10">
                       <Palette size={24} />
                    </div>
                    <div>
                       <h2 className="text-xl font-bold text-white">Shop Appearance</h2>
                       <p className="text-sm text-white/30">Customize how your shop looks</p>
                    </div>
                  </div>
                  <button onClick={handleApplyCustomization} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all bg-purple-600 hover:bg-purple-500 shadow-lg">
                     {applying ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                     Save Changes
                  </button>
               </div>

               {/* Banner UI */}
               <div className="space-y-4">
                  <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Shop Banner</label>
                  <div 
                    onClick={() => bannerRef.current?.click()}
                    className="w-full aspect-[4/1] rounded-[32px] border-2 border-dashed border-white/5 bg-white/[0.02] flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-white/20 transition-all overflow-hidden relative"
                  >
                     {bannerUrl ? (
                         // eslint-disable-next-line @next/next/no-img-element
                         <img src={bannerUrl} className="w-full h-full object-cover" alt="Banner" />
                     ) : (
                        <>
                           <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white/40">
                              <Upload size={20} />
                           </div>
                           <p className="text-sm text-white/20 font-medium">Click to upload banner</p>
                        </>
                     )}
                     <input ref={bannerRef} type="file" className="hidden" onChange={e => handleFileUpload(e, 'banner')} />
                  </div>
               </div>

               {/* Description UI */}
               <div className="space-y-4">
                  <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Shop Description</label>
                  <textarea 
                    value={shopDesc}
                    onChange={e => setShopDesc(e.target.value)}
                    className="w-full bg-black/60 border border-white/[0.08] rounded-[24px] p-6 text-sm text-white/70 min-h-[120px] focus:border-purple-500/50 outline-none transition-all"
                  />
               </div>

               {/* Accent & Layout UI */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Accent Color</label>
                     <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/5 max-w-md">
                           <div className="w-10 h-6 rounded shadow-[0_0_15px_rgba(168,85,247,0.4)]" style={{ backgroundColor: accentColor }} />
                           <span className="text-sm font-mono text-white/40 uppercase">{accentColor}</span>
                        </div>
                        <div className="flex gap-4">
                           {['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'].map(c => (
                              <button key={c} onClick={() => setAccentColor(c)} className={cn("w-8 h-8 rounded-full border-2 transition-all", accentColor === c ? "border-white" : "border-transparent")} style={{ backgroundColor: c }} />
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Product Layout</label>
                     <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setLayout('grid')} className={cn("flex items-center justify-center gap-3 h-14 rounded-2xl font-bold text-sm transition-all", layout === 'grid' ? "bg-purple-600 text-white shadow-xl shadow-purple-900/20" : "bg-black text-white/30 border border-white/5")}>
                           <Package size={18} />
                           Grid View
                        </button>
                        <button onClick={() => setLayout('list')} className={cn("flex items-center justify-center gap-3 h-14 rounded-2xl font-bold text-sm transition-all", layout === 'list' ? "bg-purple-600 text-white shadow-xl shadow-purple-900/20" : "bg-black text-white/30 border border-white/5")}>
                           <ClipboardList size={18} />
                           List View
                        </button>
                     </div>
                  </div>
               </div>

               <div className="pt-6 border-t border-white/5">
                  <button className="w-full h-14 rounded-2xl bg-black border border-white/[0.08] flex items-center justify-center gap-3 text-sm font-bold text-white hover:bg-white/5 transition-all">
                     <Eye size={18} />
                     Preview Your Shop
                  </button>
               </div>
            </div>

            {/* Inventory UI */}
            <div className="space-y-6 pt-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-white px-2">Vault Inventory</h2>
                  <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg">
                     <Plus size={16} /> New Product
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map(p => (
                     <div key={p.id} className="group relative p-4 rounded-[24px] border border-white/[0.05] bg-black/40 flex items-center gap-4 hover:border-white/20 transition-all">
                        <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                           {p.image_url ? 
                             // eslint-disable-next-line @next/next/no-img-element
                             <img src={p.image_url} className="w-full h-full object-cover" alt="" /> 
                             : <Package className="w-full h-full p-4 text-white/10" />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h3 className="font-bold text-white truncate text-md">{p.title}</h3>
                           <p className="text-xs font-black text-purple-400 mt-0.5">${p.price || '0.00'}</p>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => handleDelete(p.id)} className="p-2.5 rounded-xl bg-red-500/5 text-red-500/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 max-w-3xl">
             <div className="p-10 rounded-[40px] border border-white/[0.08] bg-[#0a0c16]/50 space-y-12">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-xl ring-1 ring-white/10">
                      <Settings size={24} />
                   </div>
                   <div>
                      <h2 className="text-xl font-bold text-white">General Settings</h2>
                      <p className="text-sm text-white/30">Manage your store currency and configuration</p>
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Store Display Name</label>
                         <input className="input-dark bg-black/60 rounded-2xl" placeholder="My Shop" defaultValue={profile.full_name + "'s Store"} />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Default Currency</label>
                         <select className="input-dark bg-black/60 rounded-2xl cursor-pointer">
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                         </select>
                      </div>
                   </div>

                   <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between">
                      <div>
                         <h4 className="font-bold text-white">Maintenance Mode</h4>
                         <p className="text-xs text-white/30">Hide your shop while you make updates</p>
                      </div>
                      <div className="w-14 h-7 rounded-full bg-white/10 relative cursor-pointer">
                         <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-lg" />
                      </div>
                   </div>

                   <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 flex items-center justify-between">
                      <div>
                         <h4 className="font-bold text-red-500">Deactivate Store</h4>
                         <p className="text-xs text-red-500/40">Completely remove your shop listings</p>
                      </div>
                      <button className="px-5 py-2 rounded-xl bg-red-500 text-white font-bold text-xs">Deactivate</button>
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Revenue', value: '$2,450.00', icon: TrendingUp, color: 'text-green-400' },
                  { label: 'Total Sales', value: '142', icon: ShoppingBag, color: 'text-indigo-400' },
                  { label: 'Avg Order', value: '$17.25', icon: Tag, color: 'text-purple-400' }
                ].map(stat => (
                   <div key={stat.label} className="p-6 rounded-[32px] bg-black/40 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                         <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">{stat.label}</p>
                         <stat.icon size={16} className={stat.color} />
                      </div>
                      <h4 className="text-2xl font-black text-white">{stat.value}</h4>
                   </div>
                ))}
             </div>

             <div className="p-6 rounded-[40px] border border-white/[0.08] bg-[#0a0c16]/50 overflow-hidden">
                <div className="flex items-center gap-4 mb-8 px-4">
                   <History size={20} className="text-white/20" />
                   <h2 className="text-lg font-bold text-white tracking-tight">Recent Sales</h2>
                </div>
                <div className="space-y-2">
                   {orders.map(order => (
                      <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl hover:bg-white/[0.02] transition-colors gap-4">
                         <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                               <User size={20} />
                            </div>
                            <div>
                               <p className="font-bold text-white">{order.customer}</p>
                               <p className="text-xs text-white/30">{order.product} • {order.date}</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between md:justify-end gap-10">
                            <span className="text-lg font-black text-white">${order.amount}</span>
                            <span className={cn(
                               "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                               order.status === 'paid' ? "bg-green-500/10 text-green-500" : "bg-indigo-500/10 text-indigo-500"
                            )}>{order.status}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* New Product Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] grid place-items-center p-6 bg-black/90 backdrop-blur-3xl overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-4xl rounded-[48px] border border-white/10 bg-[#020617] p-12 shadow-2xl relative">
               <button onClick={() => setShowForm(false)} className="absolute top-8 right-8 p-3 rounded-full bg-white/5 text-white/40 hover:text-white transition-all"><X size={20} /></button>
               <h2 className="text-3xl font-black text-white mb-12 tracking-tight">New Product</h2>
               <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-sm font-bold text-white">Product Name *</label>
                        <input className="w-full h-14 px-6 rounded-2xl bg-black border border-white/[0.08] text-white focus:border-purple-500 outline-none" placeholder="My Awesome Product" value={title} onChange={e => setTitle(e.target.value)} />
                     </div>
                     <div className="space-y-3">
                        <label className="text-sm font-bold text-white">Price *</label>
                        <div className="flex gap-4">
                           <input className="flex-1 h-14 px-6 rounded-2xl bg-black border border-white/[0.08] text-white focus:border-purple-500 outline-none" placeholder="9.99" value={price} onChange={e => setPrice(e.target.value)} />
                           <div className="h-14 px-6 rounded-2xl border border-white/10 bg-black font-bold flex items-center justify-between gap-3 cursor-pointer min-w-[120px]">
                              <span className="text-sm">{currency}</span>
                              <ChevronDown size={14} className="text-white/30" />
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-sm font-bold text-white">Description</label>
                     <textarea className="w-full min-h-[140px] p-6 rounded-2xl bg-black border border-white/[0.08] text-white focus:border-purple-500 outline-none resize-none" placeholder="Describe your product..." value={description} onChange={e => setDescription(e.target.value)} />
                  </div>
                  <div className="space-y-4">
                     <label className="text-sm font-bold text-white">Product Type</label>
                     <div className="flex gap-4">
                        <button onClick={() => setProductType('digital')} className={cn("flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all", productType === 'digital' ? "bg-purple-600 text-white" : "bg-black text-white/40 border border-white/5")}>
                           <FileText size={18} /> Digital
                        </button>
                        <button onClick={() => setProductType('physical')} className={cn("flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all", productType === 'physical' ? "bg-purple-600 text-white" : "bg-black text-white/40 border border-white/5")}>
                           <Package size={18} /> Physical
                        </button>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-sm font-bold text-white">Product Image</label>
                        <div onClick={() => imgRef.current?.click()} className="h-16 px-6 rounded-2xl bg-black border border-white/[0.08] flex items-center justify-between cursor-pointer hover:border-white/20">
                           <div className="flex items-center gap-3">
                              <span className="px-4 py-1.5 rounded-lg bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">Choose File</span>
                              <span className="text-xs text-white/20 truncate max-w-[150px]">{image_url ? 'file-uploaded.png' : 'No file chosen'}</span>
                           </div>
                           {uploading && <Loader2 size={16} className="animate-spin text-purple-400" />}
                        </div>
                        <input ref={imgRef} type="file" className="hidden" onChange={e => handleFileUpload(e, 'img')} />
                     </div>
                     <div className="space-y-4">
                        <label className="text-sm font-bold text-white">Digital File</label>
                        <div className="h-16 px-6 rounded-2xl bg-black border border-white/[0.08] flex items-center justify-between cursor-pointer opacity-40">
                           <div className="flex items-center gap-3">
                              <span className="px-4 py-1.5 rounded-lg bg-white/5 text-[10px] font-black uppercase tracking-widest">Choose File</span>
                              <span className="text-xs">No file chosen</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                     <span className="text-sm font-bold text-white">Active Listing</span>
                     <button onClick={() => setIsActive(!isActive)} className={cn("w-14 h-7 rounded-full relative transition-all", isActive ? "bg-purple-600" : "bg-white/10")}>
                        <div className={cn("absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-lg", isActive ? "left-8" : "left-1")} />
                     </button>
                  </div>
                  <div className="flex gap-6 pt-10">
                     <button onClick={handleAdd} disabled={saving} className="h-16 px-12 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-500 shadow-xl shadow-purple-900/40 disabled:opacity-50 min-w-[200px] transition-all transform active:scale-95">
                        {saving ? <Loader2 className="animate-spin mx-auto" /> : 'Create Product'}
                     </button>
                     <button onClick={() => setShowForm(false)} className="h-16 px-12 rounded-2xl text-white font-bold hover:bg-white/5 transition-all">Cancel</button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Icons from lucide-react brand that we can't import directly without build errors are handled in LinkTree or other pages
const Tag = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/>
  </svg>
);

const History = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/><path d="M12 2a10 10 0 1 0 10 10"/>
  </svg>
);
