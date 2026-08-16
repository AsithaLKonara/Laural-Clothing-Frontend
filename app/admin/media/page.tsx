"use client";

import { useState, useRef } from "react";
import {
  Search, Upload, Grid, List, Trash2, Copy, Download, CheckCircle2,
  Image as ImageIcon, Film, Filter, FolderOpen, X, ZoomIn, ExternalLink,
  FileImage, AlertCircle, ArrowRight
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MediaFile {
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

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const FOLDERS = ["All", "Products", "Hero", "Banners", "About", "Uncategorized"];

const DUMMY_MEDIA: MediaFile[] = [
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

// ─── Detail Panel ──────────────────────────────────────────────────────────────

interface DetailPanelProps {
  file: MediaFile;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const ASSIGN_DESTINATIONS = [
  { label: "Hero Slide Image", page: "/admin/cms" },
  { label: "Promo Banner", page: "/admin/cms" },
  { label: "Product Image", page: "/admin/products" },
  { label: "Category Cover", page: "/admin/categories" },
  { label: "Collection Cover", page: "/admin/collections" },
  { label: "CMS Static Page", page: "/admin/cms" },
];

function AssignToSection({ file }: { file: MediaFile }) {
  const [destination, setDestination] = useState("");
  const [assigned, setAssigned] = useState(false);

  const handleAssign = () => {
    if (!destination) return;
    setAssigned(true);
    setTimeout(() => setAssigned(false), 2500);
  };

  return (
    <div className="flex flex-col gap-2">
      <select
        value={destination}
        onChange={e => setDestination(e.target.value)}
        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:border-stone-900 bg-white"
      >
        <option value="">Select a destination...</option>
        {ASSIGN_DESTINATIONS.map(d => (
          <option key={d.label} value={d.label}>{d.label}</option>
        ))}
      </select>
      <button
        onClick={handleAssign}
        disabled={!destination}
        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-inter font-semibold text-xs transition-all disabled:opacity-40 ${
          assigned ? "bg-emerald-600 text-white" : "bg-stone-900 text-white hover:bg-stone-700"
        }`}
      >
        {assigned ? (
          <><CheckCircle2 size={13}/> Assigned successfully!</>
        ) : (
          <><ArrowRight size={13}/> Assign This Image</>
        )}
      </button>
      {assigned && destination && (
        <p className="font-inter text-xs text-stone-400 text-center">
          Image URL copied to clipboard — open <span className="font-bold text-stone-700">{destination}</span> to paste it.
        </p>
      )}
    </div>
  );
}


function DetailPanel({ file, onClose, onDelete }: DetailPanelProps) {
  const [copied, setCopied] = useState(false);
  const copyUrl = () => { navigator.clipboard.writeText(file.url); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[380px] bg-white border-l border-stone-200 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right-4 duration-200">
      <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-stone-50 shrink-0">
        <h3 className="font-inter font-bold text-stone-900 truncate pr-4">{file.name}</h3>
        <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors shrink-0">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Preview */}
        <div className="bg-stone-100 flex items-center justify-center h-56 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={file.url} alt={file.name} className="max-h-full max-w-full object-contain" />
        </div>

        {/* Metadata */}
        <div className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 text-sm font-inter">
            {[
              ["Type", file.type.toUpperCase()],
              ["Folder", file.folder],
              ["Size", file.size],
              ["Dimensions", file.dimensions],
              ["Uploaded", file.uploadedAt],
              ["Used in", file.usedIn.length > 0 ? `${file.usedIn.length} place(s)` : "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">{label}</span>
                <span className="text-stone-800 font-medium">{value}</span>
              </div>
            ))}
          </div>

          {file.usedIn.length > 0 && (
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
              <p className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Used In</p>
              <div className="flex flex-col gap-1">
                {file.usedIn.map(u => (
                  <span key={u} className="font-inter text-xs text-stone-700 flex items-center gap-1.5">
                    <FolderOpen size={11} className="text-stone-400"/> {u}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* URL Copy */}
          <div className="flex flex-col gap-1.5">
            <label className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider">File URL</label>
            <div className="flex gap-2">
              <input readOnly value={file.url} className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono text-stone-600 outline-none"/>
              <button onClick={copyUrl} className={`px-3 py-2 rounded-lg font-inter font-medium text-xs transition-all flex items-center gap-1.5 shadow-sm ${copied ? 'bg-emerald-600 text-white' : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'}`}>
                {copied ? <CheckCircle2 size={13}/> : <Copy size={13}/>}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Assign To */}
          <div className="flex flex-col gap-1.5">
            <label className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider">Assign To</label>
            <AssignToSection file={file} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-5 border-t border-stone-200 bg-white flex gap-3 shrink-0">
        <a href={file.url} download className="flex-1 flex items-center justify-center gap-2 bg-stone-900 text-white py-2.5 rounded-lg font-inter font-medium text-sm hover:bg-stone-800 transition-colors shadow-sm">
          <Download size={15}/> Download
        </a>
        <button
          onClick={() => { onDelete(file.id); onClose(); }}
          className="px-4 py-2.5 border border-red-200 text-red-600 bg-red-50 rounded-lg font-inter font-medium text-sm hover:bg-red-100 transition-colors"
        >
          <Trash2 size={15}/>
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminMediaPage() {
  const [files, setFiles] = useState(DUMMY_MEDIA);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeFolder, setActiveFolder] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailFile, setDetailFile] = useState<MediaFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = files.filter(f => {
    const matchFolder = activeFolder === "All" || f.folder === activeFolder;
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase());
    return matchFolder && matchSearch;
  });

  const toggleSelect = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const bulkDelete = () => {
    setFiles(prev => prev.filter(f => !selectedIds.includes(f.id)));
    setSelectedIds([]);
  };

  const deleteOne = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;
    const newMedia: MediaFile[] = droppedFiles.map((f, idx) => ({
      id: `M-NEW-${Date.now()}-${idx}`,
      name: f.name,
      type: f.type.startsWith("video") ? "video" : "image",
      folder: "Uncategorized",
      size: `${(f.size / 1024).toFixed(0)} KB`,
      dimensions: "—",
      url: "/products/default.jpg",
      uploadedAt: new Date().toISOString().slice(0, 10),
      usedIn: [],
    }));
    setFiles(prev => [...newMedia, ...prev]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(e.target.files || []);
    if (chosen.length === 0) return;
    const newMedia: MediaFile[] = chosen.map((f, idx) => ({
      id: `M-NEW-${Date.now()}-${idx}`,
      name: f.name,
      type: f.type.startsWith("video") ? "video" : "image",
      folder: "Uncategorized",
      size: `${(f.size / 1024).toFixed(0)} KB`,
      dimensions: "—",
      url: "/products/default.jpg",
      uploadedAt: new Date().toISOString().slice(0, 10),
      usedIn: [],
    }));
    setFiles(prev => [...newMedia, ...prev]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const totalSize = files.reduce((acc, f) => {
    const num = parseFloat(f.size.replace(/[^\d.]/g, ""));
    const isKB = f.size.includes("KB");
    const isMB = f.size.includes("MB");
    return acc + (isMB ? num * 1024 : isKB ? num : 0);
  }, 0);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Media Library"
        subtitle="Upload, manage, and optimize images and videos for products and CMS blocks."
        actionLabel="Upload Files"
      />

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Files", value: files.length, color: "text-stone-900" },
          { label: "Images", value: files.filter(f => f.type === "image").length, color: "text-blue-600" },
          { label: "Unused Files", value: files.filter(f => f.usedIn.length === 0).length, color: "text-orange-600" },
          { label: "Storage Used", value: `${(totalSize / 1024).toFixed(1)} MB`, color: "text-purple-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col gap-1">
            <span className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider">{label}</span>
            <span className={`font-inter text-3xl font-black ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Upload Success */}
      {uploadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl font-inter text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16}/> Files uploaded successfully and added to the library.
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
          isDragging
            ? "border-stone-900 bg-stone-50 scale-[1.01]"
            : "border-stone-200 hover:border-stone-400 hover:bg-stone-50/50"
        }`}
      >
        <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center">
          <Upload size={24} className="text-stone-500"/>
        </div>
        <div className="text-center">
          <p className="font-inter font-semibold text-stone-700">Drag & drop files here</p>
          <p className="font-inter text-sm text-stone-400 mt-1">or click to browse • JPG, PNG, WEBP, MP4 supported</p>
        </div>
        <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileInput}/>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by filename..."
            className="w-full h-10 pl-10 pr-4 bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-900 text-sm font-inter"
          />
        </div>

        {/* Folder Tabs */}
        <div className="flex gap-1.5 flex-wrap flex-1">
          {FOLDERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFolder(f)}
              className={`px-3 py-1.5 text-xs font-inter font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeFolder === f ? "bg-stone-900 text-white" : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex gap-2 shrink-0">
          <button onClick={() => setView("grid")} className={`p-2 rounded-lg border transition-colors ${view === "grid" ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 text-stone-500 hover:bg-stone-50"}`}>
            <Grid size={16}/>
          </button>
          <button onClick={() => setView("list")} className={`p-2 rounded-lg border transition-colors ${view === "list" ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 text-stone-500 hover:bg-stone-50"}`}>
            <List size={16}/>
          </button>
        </div>
      </div>

      {/* Count row */}
      <div className="flex items-center justify-between -mt-2">
        <p className="font-inter text-sm text-stone-500">{filtered.length} file{filtered.length !== 1 ? "s" : ""}</p>
        {filtered.filter(f => f.usedIn.length === 0).length > 0 && (
          <button className="font-inter text-xs text-orange-600 hover:underline flex items-center gap-1">
            <AlertCircle size={12}/> {filtered.filter(f => f.usedIn.length === 0).length} unused files
          </button>
        )}
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(file => {
            const isSelected = selectedIds.includes(file.id);
            return (
              <div
                key={file.id}
                className={`group relative bg-white border rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "border-stone-900 ring-2 ring-stone-900/20" : "border-stone-200 hover:border-stone-400"
                }`}
              >
                {/* Thumbnail */}
                <div
                  className="relative aspect-square bg-stone-100 flex items-center justify-center overflow-hidden"
                  onClick={() => setDetailFile(file)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
                  </div>
                  {file.usedIn.length === 0 && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Unused</div>
                  )}
                </div>

                {/* Checkbox */}
                <div
                  className="absolute top-2 right-2"
                  onClick={e => { e.stopPropagation(); toggleSelect(file.id); }}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                    isSelected ? "bg-stone-900 border-stone-900" : "bg-white/80 border-stone-300 opacity-0 group-hover:opacity-100"
                  }`}>
                    {isSelected && <CheckCircle2 size={12} className="text-white"/>}
                  </div>
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <p className="font-inter text-xs font-semibold text-stone-800 truncate">{file.name}</p>
                  <p className="font-inter text-[10px] text-stone-400 mt-0.5">{file.size} · {file.dimensions}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="py-3 px-5 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={e => setSelectedIds(e.target.checked ? filtered.map(f => f.id) : [])}
                    className="rounded text-stone-900 border-stone-300"
                  />
                </th>
                <th className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider py-3 px-3">File</th>
                <th className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider py-3 px-3">Folder</th>
                <th className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider py-3 px-3">Dimensions</th>
                <th className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider py-3 px-3">Size</th>
                <th className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider py-3 px-3">Used In</th>
                <th className="font-inter text-xs font-semibold text-stone-500 uppercase tracking-wider py-3 px-3">Uploaded</th>
                <th className="py-3 px-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map(file => {
                const isSelected = selectedIds.includes(file.id);
                return (
                  <tr key={file.id} className={`hover:bg-stone-50 transition-colors ${isSelected ? "bg-stone-50" : ""}`}>
                    <td className="py-3 px-5">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(file.id)} className="rounded text-stone-900 border-stone-300"/>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-100 rounded-lg overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover"/>
                        </div>
                        <div>
                          <p className="font-inter font-semibold text-sm text-stone-900">{file.name}</p>
                          <p className="font-inter text-xs text-stone-400 uppercase">{file.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-inter text-sm text-stone-600">{file.folder}</td>
                    <td className="py-3 px-3 font-inter text-sm text-stone-500 font-mono text-xs">{file.dimensions}</td>
                    <td className="py-3 px-3 font-inter text-sm text-stone-500">{file.size}</td>
                    <td className="py-3 px-3">
                      {file.usedIn.length === 0 ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-orange-100 text-orange-700 rounded">Unused</span>
                      ) : (
                        <span className="font-inter text-sm text-stone-600">{file.usedIn.length} place(s)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-inter text-sm text-stone-400">{file.uploadedAt}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1">
                        <button onClick={() => setDetailFile(file)} className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"><ZoomIn size={14}/></button>
                        <button onClick={() => deleteOne(file.id)} className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center font-inter text-sm text-stone-400">No media found.</div>
          )}
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10 z-40">
          <span className="font-inter font-medium text-sm">{selectedIds.length} file{selectedIds.length !== 1 ? "s" : ""} selected</span>
          <div className="w-px h-6 bg-stone-700"/>
          <button
            onClick={bulkDelete}
            className="font-inter font-semibold text-sm bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-400 transition-colors flex items-center gap-2"
          >
            <Trash2 size={14}/> Delete Selected
          </button>
          <button onClick={() => setSelectedIds([])} className="text-stone-400 hover:text-white transition-colors">
            <X size={18}/>
          </button>
        </div>
      )}

      {/* Detail Panel */}
      {detailFile && (
        <DetailPanel
          file={detailFile}
          onClose={() => setDetailFile(null)}
          onDelete={deleteOne}
        />
      )}
    </div>
  );
}
