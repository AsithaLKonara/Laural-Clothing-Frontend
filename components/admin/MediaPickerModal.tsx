"use client";

import { useState, useRef } from "react";
import { Search, X, Check, Loader2, Upload, CheckCircle2 } from "lucide-react";
import { useMedia, useUploadMedia } from "@/hooks/useMedia";
import Image from "next/image";

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
  const [page, setPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: mediaResponse, isLoading } = useMedia(folder !== "All" ? folder : undefined, page, 20);
  const { mutateAsync: uploadMedia } = useUploadMedia();

  const serverFiles = mediaResponse?.data || [];
  const totalPages = mediaResponse?.totalPages || 1;

  const files = serverFiles.map((f: any) => ({
    id: f.id,
    name: f.name,
    type: f.type,
    folder: f.folder,
    size: f.size.toString(),
    dimensions: f.dimensions,
    url: f.url,
    uploadedAt: f.createdAt,
    usedIn: f.usedIn || [],
  }));

  const filtered = files.filter((f: any) => {
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase());
    return matchSearch && f.type === "image";
  });

  const handleUploadFiles = async (chosenFiles: File[]) => {
    if (chosenFiles.length === 0) return;
    setIsUploading(true);
    
    try {
      for (const file of chosenFiles) {
        await uploadMedia({ file, folder: folder !== "All" ? folder : "Uncategorized" });
      }
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleUploadFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
          <h2 className="font-inter font-bold text-lg text-stone-900">{title}</h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Top Area: Upload & Toolbar */}
        <div className="p-6 border-b border-stone-100 shrink-0 flex flex-col gap-4 bg-white">
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-4 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all ${
              isDragging
                ? "border-stone-900 bg-stone-50"
                : "border-stone-200 hover:border-stone-400 hover:bg-stone-50/50"
            }`}
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-stone-400 shrink-0">
              {isUploading ? <Loader2 size={20} className="animate-spin text-stone-900" /> : <Upload size={20} />}
            </div>
            <div className="text-center sm:text-left flex-1">
              <p className="font-inter font-bold text-stone-800 text-sm">{isUploading ? "Uploading..." : "Drag & drop files here to upload directly to this folder"}</p>
            </div>
            <button 
              className="bg-white border border-stone-200 text-stone-700 px-4 py-2 rounded-lg font-inter text-sm font-medium hover:bg-stone-50 transition-colors shadow-sm shrink-0 disabled:opacity-50"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Select Files
            </button>
            <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => handleUploadFiles(Array.from(e.target.files || []))}/>
          </div>
          
          {uploadSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-lg font-inter text-xs flex items-center gap-2">
              <CheckCircle2 size={14}/> Files uploaded successfully.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
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
                  onClick={() => { setFolder(f); setPage(1); }}
                  className={`px-3 py-1.5 text-xs font-inter font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    folder === f ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-stone-400">
              <Loader2 size={32} className="animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center text-stone-400 font-inter text-sm">
              No images found matching your filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-4">
                {filtered.map((file: any) => (
                  <button
                    key={file.id}
                    onClick={() => onSelect(file.url, file)}
                    onMouseEnter={() => setHoveredId(file.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="group relative aspect-square bg-stone-100 rounded-xl overflow-hidden border-2 border-transparent hover:border-stone-900 transition-all focus:outline-none focus:border-stone-900 shadow-sm hover:shadow-md"
                  >
                    <Image src={file.url} alt={file.name} fill className="object-cover" />
                    
                    <div className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 transition-opacity ${hoveredId === file.id ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                        <Check size={16} className="text-stone-900" />
                      </div>
                      <span className="font-inter font-bold text-white text-[10px] uppercase tracking-wider">Select</span>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="font-inter text-[9px] text-white truncate font-medium">{file.name}</p>
                      <p className="font-inter text-[8px] text-white/70">{(Number(file.size) / 1024).toFixed(0)} KB</p>
                    </div>
                  </button>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between py-4 mt-4">
                  <p className="font-inter text-xs text-stone-500">Page {page} of {totalPages}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-stone-200 bg-white rounded-lg font-inter text-xs font-medium hover:bg-stone-50 disabled:opacity-50">Prev</button>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 border border-stone-200 bg-white rounded-lg font-inter text-xs font-medium hover:bg-stone-50 disabled:opacity-50">Next</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
