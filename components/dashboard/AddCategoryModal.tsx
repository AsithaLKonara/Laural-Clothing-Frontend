"use client";

import { useState } from "react";
import { X, ImagePlus } from "lucide-react";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [parent, setParent] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  if (!isOpen) return null;

  function handleNameChange(val: string) {
    setName(val);
    if (!slugEdited) setSlug(generateSlug(val));
  }

  function handleSave() {
    // TODO: integrate with backend
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
          <div>
            <h2 className="font-inter font-bold text-lg text-stone-900">Add New Category</h2>
            <p className="font-inter text-xs text-stone-500 mt-0.5">Create a new product category or sub-category.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-lg text-stone-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
          
          <div className="flex flex-col gap-2">
            <label className="font-inter text-xs font-semibold text-stone-700">Category Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="e.g. Graphic Tees"
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-inter text-xs font-semibold text-stone-700">Category Slug</label>
            <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100 transition-all">
              <span className="px-3 py-2.5 bg-stone-50 text-stone-500 text-sm border-r border-stone-200 font-mono">/category/</span>
              <input
                type="text"
                value={slug}
                onChange={e => { setSlug(e.target.value); setSlugEdited(true); }}
                className="flex-1 px-3 py-2.5 text-sm outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-inter text-xs font-semibold text-stone-700">Parent Category</label>
              <select 
                value={parent} 
                onChange={e => setParent(e.target.value)} 
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter bg-white"
              >
                <option value="">None (Top Level)</option>
                <option value="t-shirts">T-Shirts</option>
                <option value="shirts">Shirts</option>
                <option value="dresses">Dresses</option>
                <option value="pants">Pants</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-inter text-xs font-semibold text-stone-700">Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value)} 
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter bg-white"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-inter text-xs font-semibold text-stone-700">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              placeholder="Brief description for internal use and SEO..."
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-inter text-xs font-semibold text-stone-700">Category Cover Image</label>
            <label className="h-32 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-stone-50 hover:border-accent transition-all group">
              <ImagePlus size={24} className="text-stone-400 group-hover:text-accent transition-colors" />
              <span className="font-inter text-xs text-stone-500 group-hover:text-accent transition-colors font-medium">Click to upload image</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 px-6 py-4 bg-stone-50 shrink-0 flex items-center justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-white border border-stone-300 rounded-lg font-inter font-medium text-sm text-stone-700 hover:bg-stone-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-5 py-2 bg-stone-900 text-white rounded-lg font-inter font-medium text-sm hover:bg-stone-800 transition-colors shadow-md shadow-stone-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Category
          </button>
        </div>
      </div>
    </div>
  );
}
