"use client";

import { useState } from "react";
import {
  Layout, Image as ImageIcon, FileText, Megaphone, Plus, Trash2,
  GripVertical, Eye, EyeOff, Edit3, Check, X, ChevronDown, ChevronUp,
  Globe, Save, ExternalLink
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import type { MediaFile } from "@/components/admin/MediaPickerModal";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  image: string;
  active: boolean;
  order: number;
}

interface Banner {
  id: string;
  text: string;
  link: string;
  bgColor: string;
  active: boolean;
  type: "PROMO" | "ANNOUNCEMENT" | "SALE";
}

interface HomepageSection {
  id: string;
  name: string;
  description: string;
  visible: boolean;
  order: number;
}

interface StaticPage {
  id: string;
  title: string;
  slug: string;
  lastEdited: string;
  content: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const INITIAL_HERO: HeroSlide[] = [
  { id: "HS-1", title: "New Arrivals", subtitle: "Explore the latest styles this season.", cta: "Shop Now", ctaLink: "/shop", image: "/hero-1.jpg", active: true, order: 1 },
  { id: "HS-2", title: "End of Season Sale", subtitle: "Up to 50% off selected items.", cta: "View Sale", ctaLink: "/sale", image: "/hero-2.jpg", active: true, order: 2 },
  { id: "HS-3", title: "Quiet Luxury", subtitle: "Elevated minimalism. Timeless pieces.", cta: "Explore", ctaLink: "/collection/luxury", image: "/hero-3.jpg", active: false, order: 3 },
];

const INITIAL_BANNERS: Banner[] = [
  { id: "BNR-1", text: "Free shipping on orders over Rs. 5,000 🎁", link: "/shop", bgColor: "#1c1c1c", active: true, type: "PROMO" },
  { id: "BNR-2", text: "Summer Sale: 30% OFF — Use code SUMMER30", link: "/sale", bgColor: "#b45309", active: false, type: "SALE" },
  { id: "BNR-3", text: "Colombo Store now open! 📍 Majestic City, Level 2", link: "/about", bgColor: "#1d4ed8", active: false, type: "ANNOUNCEMENT" },
];

const INITIAL_SECTIONS: HomepageSection[] = [
  { id: "SEC-1", name: "Hero Carousel", description: "Full-width rotating banners at the top of homepage", visible: true, order: 1 },
  { id: "SEC-2", name: "New Arrivals", description: "Horizontal scroll of recently added products", visible: true, order: 2 },
  { id: "SEC-3", name: "Collections", description: "Grid showcase of featured collections", visible: true, order: 3 },
  { id: "SEC-4", name: "Promotional Ad Banner", description: "Full-width image ad between sections", visible: true, order: 4 },
  { id: "SEC-5", name: "Offer of the Week", description: "Featured product deal section", visible: true, order: 5 },
  { id: "SEC-6", name: "About Strip", description: "Brand values and USP strip", visible: false, order: 6 },
  { id: "SEC-7", name: "Testimonials", description: "Customer review quotes carousel", visible: false, order: 7 },
];

const INITIAL_PAGES: StaticPage[] = [
  { id: "PG-1", title: "About Us", slug: "about", lastEdited: "2026-08-10", content: "Laural is a premier Sri Lankan fashion brand dedicated to quiet luxury and sustainable craftsmanship. Founded in 2019, we blend contemporary aesthetics with timeless silhouettes." },
  { id: "PG-2", title: "FAQ", slug: "faq", lastEdited: "2026-08-05", content: "**How long does shipping take?**\nStandard delivery takes 2-4 business days. Express delivery is available at checkout.\n\n**What is your return policy?**\nWe accept returns within 14 days of delivery. Items must be unworn and in original packaging." },
  { id: "PG-3", title: "Terms & Conditions", slug: "terms-conditions", lastEdited: "2026-07-28", content: "By accessing and using the Laural website, you accept and agree to be bound by the terms and provision of this agreement." },
  { id: "PG-4", title: "Privacy Policy", slug: "privacy-policy", lastEdited: "2026-07-28", content: "Laural is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information." },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function HeroTab() {
  const [slides, setSlides] = useState(INITIAL_HERO);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<HeroSlide>>({});
  const [saved, setSaved] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const startEdit = (slide: HeroSlide) => {
    setEditingId(slide.id);
    setEditData({ ...slide });
  };

  const cancelEdit = () => { setEditingId(null); setEditData({}); };

  const saveEdit = () => {
    setSlides(prev => prev.map(s => s.id === editingId ? { ...s, ...editData } : s));
    setEditingId(null);
    setEditData({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleActive = (id: string) =>
    setSlides(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));

  const moveSlide = (id: string, dir: "up" | "down") => {
    setSlides(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex(s => s.id === id);
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const newOrder = sorted[swapIdx].order;
      sorted[swapIdx].order = sorted[idx].order;
      sorted[idx].order = newOrder;
      return [...sorted];
    });
  };

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: `HS-${Date.now()}`,
      title: "New Slide",
      subtitle: "Edit this subtitle.",
      cta: "Shop Now",
      ctaLink: "/shop",
      image: "/hero-placeholder.jpg",
      active: false,
      order: slides.length + 1,
    };
    setSlides(prev => [...prev, newSlide]);
    startEdit(newSlide);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="font-inter text-sm text-stone-500">Manage the hero carousel slides shown at the top of the homepage.</p>
        <div className="flex items-center gap-3">
          {saved && <span className="text-emerald-600 font-inter text-sm font-medium flex items-center gap-1"><Check size={14}/>Saved</span>}
          <button onClick={addSlide} className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg font-inter font-medium text-sm hover:bg-stone-800 transition-colors shadow-sm">
            <Plus size={16}/> Add Slide
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {[...slides].sort((a, b) => a.order - b.order).map((slide) => (
          <div key={slide.id} className={`bg-white border rounded-xl shadow-sm overflow-hidden ${slide.active ? 'border-stone-200' : 'border-stone-100 opacity-70'}`}>
            {editingId === slide.id ? (
              <div className="p-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider">Title</label>
                    <input value={editData.title || ""} onChange={e => setEditData(p => ({...p, title: e.target.value}))} className="border border-stone-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-1 focus:ring-stone-900"/>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider">Subtitle</label>
                    <input value={editData.subtitle || ""} onChange={e => setEditData(p => ({...p, subtitle: e.target.value}))} className="border border-stone-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-1 focus:ring-stone-900"/>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider">CTA Button Text</label>
                    <input value={editData.cta || ""} onChange={e => setEditData(p => ({...p, cta: e.target.value}))} className="border border-stone-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-1 focus:ring-stone-900"/>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider">CTA Link</label>
                    <input value={editData.ctaLink || ""} onChange={e => setEditData(p => ({...p, ctaLink: e.target.value}))} className="border border-stone-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-1 focus:ring-stone-900"/>
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider">Slide Image</label>
                    <div className="flex gap-3 items-center">
                      {editData.image && (
                        <div className="relative w-20 h-14 bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                          <Image src={editData.image} alt="preview" fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex flex-col gap-2 flex-1">
                        <input value={editData.image || ""} onChange={e => setEditData(p => ({...p, image: e.target.value}))} placeholder="/path/to/image.jpg" className="border border-stone-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-1 focus:ring-stone-900 font-mono text-xs"/>
                        <button type="button" onClick={() => setShowPicker(true)} className="flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-lg font-inter font-semibold text-xs transition-colors w-fit">
                          <ImageIcon size={13}/> Pick from Media Library
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 justify-end border-t border-stone-100 pt-4">
                  <button onClick={cancelEdit} className="px-4 py-2 border border-stone-200 text-stone-700 rounded-lg font-inter text-sm hover:bg-stone-50 transition-colors">Cancel</button>
                  <button onClick={saveEdit} className="px-4 py-2 bg-stone-900 text-white rounded-lg font-inter text-sm hover:bg-stone-800 transition-colors flex items-center gap-2"><Save size={14}/>Save Slide</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-1 text-muted">
                  <button onClick={() => moveSlide(slide.id, "up")} className="p-0.5 hover:text-stone-900"><ChevronUp size={14}/></button>
                  <button onClick={() => moveSlide(slide.id, "down")} className="p-0.5 hover:text-stone-900"><ChevronDown size={14}/></button>
                </div>
                <GripVertical size={16} className="text-stone-300 shrink-0"/>
                <div className="w-16 h-10 bg-stone-100 rounded-md overflow-hidden shrink-0 flex items-center justify-center">
                  <ImageIcon size={16} className="text-stone-300"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-inter font-bold text-sm text-stone-900 truncate">{slide.title}</p>
                  <p className="font-inter text-xs text-stone-500 truncate">{slide.subtitle}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${slide.active ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                    {slide.active ? "Live" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleActive(slide.id)} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors" title={slide.active ? "Deactivate" : "Activate"}>
                    {slide.active ? <Eye size={15}/> : <EyeOff size={15}/>}
                  </button>
                  <button onClick={() => startEdit(slide)} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors">
                    <Edit3 size={15}/>
                  </button>
                  <button onClick={() => setSlides(prev => prev.filter(s => s.id !== slide.id))} className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={15}/>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Media Picker */}
      {showPicker && (
        <MediaPickerModal
          title="Select Hero Slide Image"
          onClose={() => setShowPicker(false)}
          onSelect={(url) => {
            setEditData(p => ({ ...p, image: url }));
            setShowPicker(false);
          }}
        />
      )}
    </div>
  );
}

function BannersTab() {
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Banner>>({});

  const TYPE_COLORS: Record<string, string> = {
    PROMO: "bg-purple-100 text-purple-700",
    SALE: "bg-orange-100 text-orange-700",
    ANNOUNCEMENT: "bg-blue-100 text-blue-700",
  };

  const startEdit = (b: Banner) => { setEditingId(b.id); setEditData({...b}); };
  const cancelEdit = () => { setEditingId(null); setEditData({}); };
  const saveEdit = () => {
    setBanners(prev => prev.map(b => b.id === editingId ? { ...b, ...editData } : b));
    setEditingId(null);
    setEditData({});
  };

  const activate = (id: string) =>
    setBanners(prev => prev.map(b => ({ ...b, active: b.id === id })));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="font-inter text-sm text-stone-500">Manage the top promotional announcement bar. Only one banner can be active at a time.</p>
        <button onClick={() => { const nb: Banner = { id: `BNR-${Date.now()}`, text: "New announcement", link: "/", bgColor: "#1c1c1c", active: false, type: "PROMO"}; setBanners(p=>[...p, nb]); startEdit(nb); }} className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg font-inter font-medium text-sm hover:bg-stone-800 transition-colors shadow-sm">
          <Plus size={16}/> Add Banner
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {banners.map(banner => (
          <div key={banner.id} className={`bg-white border rounded-xl shadow-sm overflow-hidden ${banner.active ? 'border-stone-900 ring-1 ring-stone-900/10' : 'border-stone-200'}`}>
            {editingId === banner.id ? (
              <div className="p-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider">Banner Text</label>
                    <input value={editData.text||""} onChange={e=>setEditData(p=>({...p,text:e.target.value}))} className="border border-stone-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-1 focus:ring-stone-900"/>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider">Link URL</label>
                    <input value={editData.link||""} onChange={e=>setEditData(p=>({...p,link:e.target.value}))} className="border border-stone-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-1 focus:ring-stone-900"/>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider">Background Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={editData.bgColor||"#1c1c1c"} onChange={e=>setEditData(p=>({...p,bgColor:e.target.value}))} className="w-10 h-10 rounded border border-stone-200 p-0.5 cursor-pointer"/>
                      <input value={editData.bgColor||""} onChange={e=>setEditData(p=>({...p,bgColor:e.target.value}))} className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-1 focus:ring-stone-900 font-mono"/>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider">Banner Type</label>
                    <select value={editData.type||"PROMO"} onChange={e=>setEditData(p=>({...p,type:e.target.value as any}))} className="border border-stone-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-1 focus:ring-stone-900">
                      <option value="PROMO">Promo</option>
                      <option value="SALE">Sale</option>
                      <option value="ANNOUNCEMENT">Announcement</option>
                    </select>
                  </div>
                </div>
                {editData.text && (
                  <div className="p-3 rounded-lg text-center text-sm font-inter font-medium text-white" style={{backgroundColor: editData.bgColor||"#1c1c1c"}}>
                    Preview: {editData.text}
                  </div>
                )}
                <div className="flex gap-3 justify-end border-t border-stone-100 pt-4">
                  <button onClick={cancelEdit} className="px-4 py-2 border border-stone-200 text-stone-700 rounded-lg font-inter text-sm hover:bg-stone-50">Cancel</button>
                  <button onClick={saveEdit} className="px-4 py-2 bg-stone-900 text-white rounded-lg font-inter text-sm hover:bg-stone-800 flex items-center gap-2"><Save size={14}/>Save</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4">
                <div className="w-3 h-8 rounded shrink-0" style={{backgroundColor: banner.bgColor}}/>
                <div className="flex-1 min-w-0">
                  <p className="font-inter font-bold text-sm text-stone-900 truncate">{banner.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${TYPE_COLORS[banner.type]}`}>{banner.type}</span>
                    <span className="font-inter text-xs text-stone-400 truncate">{banner.link}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {banner.active ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">LIVE</span>
                  ) : (
                    <button onClick={() => activate(banner.id)} className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold rounded-full hover:bg-stone-200 transition-colors">Set Live</button>
                  )}
                  <button onClick={() => startEdit(banner)} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"><Edit3 size={15}/></button>
                  <button onClick={() => setBanners(p=>p.filter(b=>b.id!==banner.id))} className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15}/></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function HomepageTab() {
  const [sections, setSections] = useState(INITIAL_SECTIONS);

  const toggleVisible = (id: string) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));

  const move = (id: string, dir: "up" | "down") => {
    setSections(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex(s => s.id === id);
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const newOrder = sorted[swapIdx].order;
      sorted[swapIdx].order = sorted[idx].order;
      sorted[idx].order = newOrder;
      return [...sorted];
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="font-inter text-sm text-stone-500">Drag to reorder or toggle visibility of each homepage section.</p>
      <div className="flex flex-col gap-3">
        {[...sections].sort((a, b) => a.order - b.order).map((sec, idx) => (
          <div key={sec.id} className={`bg-white border rounded-xl shadow-sm p-4 flex items-center gap-4 transition-all ${sec.visible ? 'border-stone-200' : 'border-stone-100 opacity-60'}`}>
            <div className="flex flex-col gap-1 text-stone-300">
              <button onClick={() => move(sec.id, "up")} className="hover:text-stone-700 transition-colors"><ChevronUp size={14}/></button>
              <button onClick={() => move(sec.id, "down")} className="hover:text-stone-700 transition-colors"><ChevronDown size={14}/></button>
            </div>
            <GripVertical size={16} className="text-stone-200 shrink-0"/>
            <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center shrink-0">
              <span className="font-inter font-bold text-sm text-stone-500">{idx + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-inter font-bold text-sm text-stone-900">{sec.name}</p>
              <p className="font-inter text-xs text-stone-400">{sec.description}</p>
            </div>
            <button
              onClick={() => toggleVisible(sec.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold font-inter rounded-full border transition-all ${sec.visible ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'}`}
            >
              {sec.visible ? <Eye size={12}/> : <EyeOff size={12}/>}
              {sec.visible ? "Visible" : "Hidden"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PagesTab() {
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [saved, setSaved] = useState(false);

  const startEdit = (page: StaticPage) => { setEditingId(page.id); setEditContent(page.content); };
  const cancelEdit = () => { setEditingId(null); setEditContent(""); };
  const saveEdit = () => {
    setPages(prev => prev.map(p => p.id === editingId ? { ...p, content: editContent, lastEdited: new Date().toISOString().slice(0, 10) } : p));
    setEditingId(null);
    setEditContent("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const editingPage = pages.find(p => p.id === editingId);

  if (editingId && editingPage) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-inter font-bold text-lg text-stone-900">Editing: {editingPage.title}</h3>
            <p className="font-inter text-xs text-stone-400 font-mono">/{editingPage.slug}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={cancelEdit} className="px-4 py-2 border border-stone-200 text-stone-700 rounded-lg font-inter text-sm hover:bg-stone-50">Cancel</button>
            <button onClick={saveEdit} className="px-4 py-2 bg-stone-900 text-white rounded-lg font-inter text-sm hover:bg-stone-800 flex items-center gap-2"><Save size={14}/>Save Page</button>
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex gap-2 p-3 border-b border-stone-100 bg-stone-50 flex-wrap">
            {["B", "I", "H1", "H2", "—", "Link"].map(tool => (
              <button key={tool} className="px-2.5 py-1 bg-white border border-stone-200 text-stone-700 font-inter font-bold text-xs rounded hover:bg-stone-100 transition-colors shadow-sm">{tool}</button>
            ))}
          </div>
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            rows={20}
            className="w-full p-5 font-mono text-sm text-stone-800 outline-none resize-none leading-relaxed"
            placeholder="Enter page content using Markdown..."
          />
        </div>
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
          <p className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Preview</p>
          <div className="font-inter text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">{editContent}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg font-inter text-sm flex items-center gap-2">
          <Check size={16}/> Page saved successfully.
        </div>
      )}
      <p className="font-inter text-sm text-stone-500">Edit static pages that replace WordPress content. These appear on the public storefront.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.map(page => (
          <div key={page.id} className="bg-white border border-stone-200 rounded-xl shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-inter font-bold text-stone-900">{page.title}</h3>
                <p className="font-inter text-xs text-stone-400 font-mono mt-0.5">/{page.slug}</p>
              </div>
              <a href={`/${page.slug}`} target="_blank" rel="noreferrer" className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors" title="Preview on site">
                <ExternalLink size={14}/>
              </a>
            </div>
            <p className="font-inter text-xs text-stone-500 leading-relaxed line-clamp-3">{page.content}</p>
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <span className="font-inter text-xs text-stone-400">Last edited: {page.lastEdited}</span>
              <button onClick={() => startEdit(page)} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white font-inter font-medium text-xs rounded-lg hover:bg-stone-800 transition-colors shadow-sm">
                <Edit3 size={12}/> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "hero", label: "Hero Slides", icon: ImageIcon },
  { id: "banners", label: "Promo Banners", icon: Megaphone },
  { id: "homepage", label: "Homepage Layout", icon: Layout },
  { id: "pages", label: "Static Pages", icon: FileText },
];

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState("hero");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Content Management"
        subtitle="Manage homepage sections, promotional banners, hero slides, and static pages."
        actionLabel="View Storefront"
      />

      {/* Tab Navigation */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-1.5 flex gap-1">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-inter font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-stone-900 text-white shadow-sm"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              <Icon size={16}/>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "hero" && <HeroTab/>}
        {activeTab === "banners" && <BannersTab/>}
        {activeTab === "homepage" && <HomepageTab/>}
        {activeTab === "pages" && <PagesTab/>}
      </div>
    </div>
  );
}
