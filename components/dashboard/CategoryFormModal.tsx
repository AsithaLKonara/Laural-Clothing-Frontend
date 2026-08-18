"use client";

import { useState } from "react";
import { X, ImagePlus } from "lucide-react";

import { useEffect } from "react";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";
import { Category } from "@/types/category";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category;
}

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function CategoryFormModal({ isOpen, onClose, categoryToEdit }: CategoryFormModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  useEffect(() => {
    if (categoryToEdit && isOpen) {
      setName(categoryToEdit.name || "");
      setSlug(categoryToEdit.slug || "");
      setDescription(categoryToEdit.description || "");
      setSlugEdited(true);
    } else if (!categoryToEdit && isOpen) {
      setName("");
      setSlug("");
      setDescription("");
      setSlugEdited(false);
    }
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  function handleNameChange(val: string) {
    setName(val);
    if (!slugEdited) setSlug(generateSlug(val));
  }

  async function handleSave() {
    try {
      const payload = {
        name,
        slug: slug || undefined,
        description,
      };

      if (categoryToEdit) {
        await updateCategoryMutation.mutateAsync({ id: categoryToEdit.id, data: payload });
      } else {
        await createCategoryMutation.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save category", error);
    }
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
            <h2 className="font-inter font-bold text-lg text-stone-900">{categoryToEdit ? "Edit Category" : "Add New Category"}</h2>
            <p className="font-inter text-xs text-stone-500 mt-0.5">{categoryToEdit ? "Update category details." : "Create a new product category."}</p>
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
              <span className="px-3 py-2.5 bg-stone-50 text-stone-500 text-sm border-r border-stone-200 font-mono">/categories/</span>
              <input
                type="text"
                value={slug}
                onChange={e => { setSlug(e.target.value); setSlugEdited(true); }}
                className="flex-1 px-3 py-2.5 text-sm outline-none font-mono"
              />
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
            disabled={!name.trim() || createCategoryMutation.isPending || updateCategoryMutation.isPending}
            className="px-5 py-2 bg-stone-900 text-white rounded-lg font-inter font-medium text-sm hover:bg-stone-800 transition-colors shadow-md shadow-stone-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createCategoryMutation.isPending || updateCategoryMutation.isPending ? "Saving..." : "Save Category"}
          </button>
        </div>
      </div>
    </div>
  );
}
