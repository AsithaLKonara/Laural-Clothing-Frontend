"use client";

import { useState } from "react";
import { Search, X, Check, FolderOpen } from "lucide-react";

export interface MediaFile {
  id: string;
  name: string;
  type: "image" | "video";
  folder: string;
  size: string;
  dimensions: string;
  url: string;
  uploadedAt: string;
  usedIn: string[];
}

// Shared mock library — in production this would come from an API
export const SHARED_MEDIA_LIBRARY: MediaFile[] = [
  { id: "M-001", name: "black-tshirt-front.jpg", type: "image", folder: "Products", size: "184 KB", dimensions: "1200×1200", url: "/products/default.jpg", uploadedAt: "2026-08-14", usedIn: ["Black Oversized T-Shirt"] },
  { id: "M-002", name: "black-tshirt-hover.jpg", type: "image", folder: "Products", size: "201 KB", dimensions: "1200×1200", url: "/products/hover.jpg", uploadedAt: "2026-08-14", usedIn: ["Black Oversized T-Shirt"] },
  { id: "M-003", name: "hero-summer-2026.jpg", type: "image", folder: "Hero", size: "512 KB", dimensions: "1920×800", url: "/products/default.jpg", uploadedAt: "2026-08-10", usedIn: ["Hero Slide 1"] },
  { id: "M-004", name: "banner-sale-aug.jpg", type: "image", folder: "Banners", size: "98 KB", dimensions: "1400×200", url: "/products/hover.jpg", uploadedAt: "2026-08-08", usedIn: ["August Sale Banner"] },
  { id: "M-005", name: "floral-dress-main.jpg", type: "image", folder: "Products", size: "256 KB", dimensions: "1200×1600", url: "/products/default.jpg", uploadedAt: "2026-08-07", usedIn: ["Summer Floral Dress"] },
  { id: "M-006", name: "about-team.jpg", type: "image", folder: "About", size: "620 KB", dimensions: "2000×1200", url: "/products/hover.jpg", uploadedAt: "2026-08-01", usedIn: ["About Page"] },
  { id: "M-007", name: "linen-shirt-1.jpg", type: "image", folder: "Products", size: "178 KB", dimensions: "1200×1200", url: "/products/default.jpg", uploadedAt: "2026-07-28", usedIn: ["Classic Linen Shirt"] },
  { id: "M-008", name: "hero-quiet-luxury.jpg", type: "image", folder: "Hero", size: "490 KB", dimensions: "1920×800", url: "/products/hover.jpg", uploadedAt: "2026-07-25", usedIn: [] },
  { id: "M-009", name: "cargo-pants-detail.jpg", type: "image", folder: "Products", size: "210 KB", dimensions: "1200×1200", url: "/products/default.jpg", uploadedAt: "2026-07-20", usedIn: ["Cargo Pants"] },
  { id: "M-010", name: "storefront-bg.jpg", type: "image", folder: "Uncategorized", size: "1.1 MB", dimensions: "2560×1440", url: "/products/hover.jpg", uploadedAt: "2026-07-15", usedIn: [] },
  { id: "M-011", name: "collection-banner-luxury.jpg", type: "image", folder: "Banners", size: "340 KB", dimensions: "1400×600", url: "/products/default.jpg", uploadedAt: "2026-07-10", usedIn: ["Quiet Luxury Collection"] },
  { id: "M-012", name: "promo-eid.jpg", type: "image", folder: "Banners", size: "265 KB", dimensions: "1400×400", url: "/products/hover.jpg", uploadedAt: "2026-06-28", usedIn: [] },
];

const FOLDERS = ["All", "Products", "Hero", "Banners", "About", "Uncategorized"];

interface MediaPickerModalProps {
  onSelect: (url: string, file: MediaFile) => void;
  onClose: () => void;
  title?: string;
}

export default function MediaPickerModal({ onSelect, onClose, title = "Pick from Media Library" }: MediaPickerModalProps) {
  const [folder, setFolder] = useState("All");
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = SHARED_MEDIA_LIBRARY.filter(f => {
    const matchFolder = folder === "All" || f.folder === folder;
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase());
    return matchFolder && matchSearch && f.type === "image";
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
          <h2 className="font-inter font-bold text-lg text-stone-900">{title}</h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 border-b border-stone-100 shrink-0">
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search images..."
              className="w-full h-9 pl-9 pr-3 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-stone-900 text-sm font-inter"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FOLDERS.map(f => (
              <button
                key={f}
                onClick={() => setFolder(f)}
                className={`px-3 py-1.5 text-xs font-inter font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  folder === f ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center text-stone-400 font-inter text-sm">
              No images found matching your filters.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filtered.map(file => (
                <button
                  key={file.id}
                  onClick={() => onSelect(file.url, file)}
                  onMouseEnter={() => setHoveredId(file.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative aspect-square bg-stone-100 rounded-xl overflow-hidden border-2 border-transparent hover:border-stone-900 transition-all focus:outline-none focus:border-stone-900 shadow-sm hover:shadow-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  
                  <div className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 transition-opacity ${hoveredId === file.id ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      <Check size={16} className="text-stone-900" />
                    </div>
                    <span className="font-inter font-bold text-white text-[10px] uppercase tracking-wider">Select</span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="font-inter text-[9px] text-white truncate font-medium">{file.name}</p>
                    <p className="font-inter text-[8px] text-white/70">{file.size}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 shrink-0 flex items-center justify-between">
          <p className="font-inter text-xs text-stone-400">{filtered.length} image{filtered.length !== 1 ? "s" : ""} available · Click an image to select it</p>
          <button onClick={onClose} className="px-4 py-2 border border-stone-200 text-stone-700 rounded-lg font-inter text-sm hover:bg-stone-100 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
