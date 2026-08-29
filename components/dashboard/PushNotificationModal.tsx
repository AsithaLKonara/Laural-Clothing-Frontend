"use client";

import { useState } from "react";
import { X, Bell, ImagePlus, Link, AlertCircle } from "lucide-react";
import { notificationsService } from "../../services/notifications.service";
import { useFlashSales } from "../../hooks/usePromotions";

interface PushNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PushNotificationModal({ isOpen, onClose }: PushNotificationModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [selectedFlashSale, setSelectedFlashSale] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: flashSalesData } = useFlashSales({ status: 'ACTIVE' });
  const activeFlashSales = flashSalesData || [];
  
  if (!isOpen) return null;

  async function handleSend() {
    setError(null);
    if (!title.trim() || !body.trim()) {
      setError("Please provide a title and body for the push notification.");
      return;
    }

    setIsSending(true);
    try {
      await notificationsService.broadcastPush({
        title,
        body,
        url: link || undefined,
        flashSaleId: selectedFlashSale || undefined
      });
      setTitle("");
      setBody("");
      setLink("");
      setSelectedFlashSale("");
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to broadcast push notification");
    } finally {
      setIsSending(false);
    }
  }

  function handleFlashSaleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const fsId = e.target.value;
    setSelectedFlashSale(fsId);
    
    if (fsId) {
      const fs = activeFlashSales.find((s: any) => s.id === fsId);
      if (fs) {
        if (!title) setTitle(`Flash Sale: ${fs.name}!`);
        if (!link) setLink(`https://laural.lk/sale`);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-[800px] bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
        
        {/* Left Side: Form */}
        <div className="flex-1 flex flex-col max-h-[50vh] md:max-h-none overflow-y-auto custom-scrollbar md:border-r border-stone-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
            <div>
              <h2 className="font-inter font-bold text-lg text-stone-900 flex items-center gap-2">
                <Bell size={18} className="text-amber-500" /> 
                Push Notification
              </h2>
              <p className="font-inter text-xs text-stone-500 mt-0.5">Send alerts to customers' devices.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-lg text-stone-600 transition-colors md:hidden">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-inter text-xs font-semibold text-stone-700">Notification Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={40}
                placeholder="e.g. Flash Sale Live Now!"
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-inter text-xs font-semibold text-stone-700">Message Body <span className="text-red-500">*</span></label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={3}
                maxLength={150}
                placeholder="Tap here to claim your 50% off before time runs out..."
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-inter text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Link size={12} /> Link to Flash Sale (Optional)
              </label>
              <select
                value={selectedFlashSale}
                onChange={handleFlashSaleSelect}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter bg-white appearance-none"
              >
                <option value="">-- None --</option>
                {activeFlashSales.map((fs: any) => (
                  <option key={fs.id} value={fs.id}>{fs.name} ({fs.discount}% off)</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-inter text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Link size={12} /> Target URL (Optional)
              </label>
              <input
                type="text"
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="https://laural.lk/sale"
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-inter text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <ImagePlus size={12} /> Rich Image (Optional)
              </label>
              <label className="h-24 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-stone-50 hover:border-accent transition-all group">
                <span className="font-inter text-xs text-stone-500 group-hover:text-accent transition-colors font-medium">Click to upload image</span>
                <span className="font-inter text-[10px] text-stone-400">JPG/PNG/WEBP under 1MB</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>

          <div className="mt-auto border-t border-stone-200 px-6 py-4 bg-stone-50 shrink-0 flex items-center justify-end gap-3">
            <button onClick={onClose} disabled={isSending} className="px-4 py-2 bg-white border border-stone-300 rounded-lg font-inter font-medium text-sm text-stone-700 hover:bg-stone-50 transition-colors shadow-sm hidden md:block">
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending || !title.trim() || !body.trim()}
              className="px-5 py-2 bg-stone-900 text-white rounded-lg font-inter font-medium text-sm hover:bg-stone-800 transition-colors shadow-md shadow-stone-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Bell size={14} /> {isSending ? "Sending..." : "Send Now"}
            </button>
          </div>
        </div>

        {/* Right Side: Live Preview */}
        <div className="w-[320px] bg-stone-100 shrink-0 hidden md:flex flex-col items-center justify-center p-6 border-l border-stone-200 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-stone-200 rounded-lg text-stone-600 transition-colors">
            <X size={20} />
          </button>
          
          <h3 className="font-inter text-xs font-bold text-stone-400 uppercase tracking-wider mb-6">Device Preview</h3>
          
          {/* Fake Phone Lockscreen */}
          <div className="w-[280px] h-[550px] bg-black rounded-[2rem] p-3 shadow-2xl relative border-8 border-stone-900">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-stone-900 rounded-b-2xl"></div>
            
            {/* Screen Wallpaper */}
            <div className="w-full h-full rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden relative">
              <div className="absolute inset-x-0 top-16 flex flex-col items-center">
                <span className="text-white font-inter text-5xl font-light">12:34</span>
                <span className="text-white/70 font-inter text-sm mt-1">Friday, August 16</span>
              </div>

              {/* Notification Bubble */}
              <div className="absolute top-40 inset-x-3 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg flex gap-3 transform transition-all">
                <div className="w-10 h-10 bg-stone-900 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-white font-serif italic font-bold text-lg leading-none">L</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="font-inter text-xs font-bold text-stone-900">Laural Clothing</span>
                    <span className="font-inter text-[10px] text-stone-500">now</span>
                  </div>
                  <p className="font-inter text-sm font-semibold text-stone-900 mt-0.5 truncate">{title || "Notification Title"}</p>
                  <p className="font-inter text-xs text-stone-700 mt-0.5 line-clamp-2 leading-relaxed">{body || "Your message body will appear right here."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
