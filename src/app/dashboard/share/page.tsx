'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, Copy, Check, Download, QrCode as QrIcon, 
  Palette, Smartphone, Globe, Sparkles, Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfile } from '@/lib/profile-context';
import { QRCodeSVG } from 'qrcode.react';

export default function SharePage() {
  const { profile } = useProfile();
  const [copied, setCopied] = useState(false);
  const [qrColor, setQrColor] = useState('#8b5cf6');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState(250);
  const [generating, setGenerating] = useState(false);

  const profileUrl = profile 
    ? `${window.location.host}/${profile.username}` 
    : 'smartbio.link/username';

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${profileUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    setGenerating(true);
    // Simple SVG to PNG download trick
    const svg = document.querySelector('#qr-container svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = qrSize * 2;
      canvas.height = qrSize * 2;
      ctx?.drawImage(img, 0, 0, qrSize * 2, qrSize * 2);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr_${profile?.username || 'smartbio'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      setGenerating(false);
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (!profile) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-purple-400" size={28} />
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
           <Share2 size={24} className="text-indigo-400" />
           Share Profile
        </h1>
        <p className="text-sm text-white/40 mt-1">Generate a high-resolution QR and share your bio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         
         {/* REAL QR Preview */}
         <div className="space-y-6">
            <div className="p-10 rounded-[48px] border border-white/[0.08] bg-[#020617] flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[80px] group-hover:bg-indigo-500/20 transition-all" />
               
               <div id="qr-container" className="relative mb-10 p-8 rounded-[40px] bg-white shadow-2xl z-10">
                  <QRCodeSVG 
                    value={`https://${profileUrl}`} 
                    size={qrSize} 
                    fgColor={qrColor} 
                    bgColor={bgColor} 
                    includeMargin={true}
                    level="H"
                  />
               </div>

               <div className="space-y-2">
                  <h3 className="text-xl font-bold">Dynamic QR Code</h3>
                  <p className="text-xs text-indigo-400 uppercase tracking-widest font-bold">@{profile.username}</p>
               </div>
            </div>

            <button
               onClick={handleDownload}
               disabled={generating}
               className="w-full h-16 rounded-[28px] bg-indigo-600 font-bold text-white flex items-center justify-center gap-3 shadow-xl hover:bg-indigo-500 transform active:scale-[0.98] transition-all disabled:opacity-50"
            >
               {generating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
               {generating ? 'Processing PNG...' : 'Download PNG'}
            </button>
         </div>

         {/* Configuration Side */}
         <div className="space-y-6">
            
            <div className="p-8 rounded-[40px] border border-white/[0.08] bg-[#0f1020]/40 space-y-6">
               <h3 className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Identity Link</h3>
               <div className="flex items-center gap-3 p-2 pl-6 rounded-2xl bg-black/40 border border-white/5 pr-2 h-16">
                  <span className="text-sm font-bold text-white/20 truncate flex-1">{profileUrl}</span>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      'px-6 h-full rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2',
                      copied ? 'bg-green-600 text-white' : 'bg-white/5 text-white/60 hover:text-white/10'
                    )}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
               </div>
            </div>

            <div className="p-8 rounded-[40px] border border-white/[0.08] bg-[#0f1020]/40 space-y-8">
               <h3 className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Customizer</h3>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                     <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">QR Color</p>
                     <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-white/5">
                        <input type="color" value={qrColor} onChange={e => setQrColor(e.target.value)} className="w-8 h-8 rounded-lg overflow-hidden cursor-pointer" />
                        <span className="text-[11px] font-mono text-white/30 uppercase">{qrColor}</span>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Background</p>
                     <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-white/5">
                        <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded-lg overflow-hidden cursor-pointer" />
                        <span className="text-[11px] font-mono text-white/30 uppercase">{bgColor}</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Image Size</p>
                  <div className="grid grid-cols-4 gap-2">
                     {[150, 200, 250, 300].map(sz => (
                        <button
                          key={sz}
                          onClick={() => setQrSize(sz)}
                          className={cn(
                            'py-3 rounded-xl border transition-all text-[11px] font-bold',
                            qrSize === sz 
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                              : 'bg-white/[0.02] border-white/5 text-white/20 hover:text-white/40'
                          )}
                        >
                           {sz}px
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
