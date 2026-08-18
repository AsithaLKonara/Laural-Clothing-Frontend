"use client";

import React, { useState, useEffect } from "react";
import { X, Layers } from "lucide-react";
import { useCreateCollection, useUpdateCollection } from "@/hooks/useAdminCollections";
import { Collection } from "@/services/collections.service";

interface AddCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionToEdit?: Collection;
}

export default function AddCollectionModal({ isOpen, onClose, collectionToEdit }: AddCollectionModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collectionType, setCollectionType] = useState<"MANUAL" | "AUTOMATED">("MANUAL");
  
  // Basic state for a single rule to demonstrate functionality
  const [ruleField, setRuleField] = useState("price");
  const [ruleOp, setRuleOp] = useState(">");
  const [ruleVal, setRuleVal] = useState("");

  const createMutation = useCreateCollection();
  const updateMutation = useUpdateCollection();

  useEffect(() => {
    if (collectionToEdit && isOpen) {
      setTitle(collectionToEdit.title || "");
      setDescription(collectionToEdit.description || "");
      setCollectionType(collectionToEdit.type || "MANUAL");
      
      const rules = collectionToEdit.rules;
      if (Array.isArray(rules) && rules.length > 0) {
        setRuleField(rules[0].field || "price");
        setRuleOp(rules[0].operator || ">");
        setRuleVal(rules[0].value || "");
      }
    } else if (isOpen) {
      setTitle("");
      setDescription("");
      setCollectionType("MANUAL");
      setRuleField("price");
      setRuleOp(">");
      setRuleVal("");
    }
  }, [collectionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    let rules: any[] = [];
    if (collectionType === "AUTOMATED" && ruleVal.trim()) {
      rules.push({ field: ruleField, operator: ruleOp, value: ruleVal });
    }

    const payload = {
      title,
      description,
      type: collectionType,
      rules: rules.length > 0 ? rules : undefined,
    };

    try {
      if (collectionToEdit) {
        await updateMutation.mutateAsync({ id: collectionToEdit.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (e) {
      console.error("Failed to save collection", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-stone-50 shrink-0">
          <div>
            <h2 className="font-inter font-bold text-xl text-stone-900 flex items-center gap-2">
              <Layers className="text-stone-700" size={24} /> {collectionToEdit ? "Edit Collection" : "Create Collection"}
            </h2>
            <p className="font-inter text-sm text-stone-500 mt-1">Organize products into thematic groups.</p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-inter text-sm font-semibold text-stone-700">Collection Title <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Summer 2026, Best Sellers"
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-inter outline-none focus:ring-2 focus:ring-stone-900 bg-white"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-inter text-sm font-semibold text-stone-700">Description</label>
            <textarea 
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional description for your internal reference or SEO."
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-inter outline-none focus:ring-2 focus:ring-stone-900 bg-white resize-none"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-stone-100">
            <label className="font-inter text-sm font-semibold text-stone-700">Collection Type</label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${collectionType === 'MANUAL' ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900' : 'border-stone-200 hover:border-stone-400'}`}>
                <input type="radio" name="collection_type" value="MANUAL" checked={collectionType === 'MANUAL'} onChange={() => setCollectionType('MANUAL')} className="sr-only" />
                <span className="font-inter font-bold text-sm text-stone-900 mb-1">Manual</span>
                <span className="font-inter text-xs text-stone-500">You will manually select which products belong in this collection.</span>
              </label>

              <label className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${collectionType === 'AUTOMATED' ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900' : 'border-stone-200 hover:border-stone-400'}`}>
                <input type="radio" name="collection_type" value="AUTOMATED" checked={collectionType === 'AUTOMATED'} onChange={() => setCollectionType('AUTOMATED')} className="sr-only" />
                <span className="font-inter font-bold text-sm text-stone-900 mb-1">Automated</span>
                <span className="font-inter text-xs text-stone-500">Products are automatically added based on rules (e.g. tags, price).</span>
              </label>
            </div>
          </div>
          
          {collectionType === 'AUTOMATED' && (
            <div className="flex flex-col gap-3 p-4 bg-stone-50 border border-stone-200 rounded-xl animate-in fade-in slide-in-from-top-2">
              <label className="font-inter text-sm font-semibold text-stone-700">Conditions</label>
              <div className="flex items-center gap-3">
                <select 
                  value={ruleField}
                  onChange={e => setRuleField(e.target.value)}
                  className="border border-stone-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-1 focus:ring-stone-900 bg-white"
                >
                  <option value="price">Price</option>
                  <option value="tag" disabled>Product Tag (Coming Soon)</option>
                </select>
                <select 
                  value={ruleOp}
                  onChange={e => setRuleOp(e.target.value)}
                  className="border border-stone-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-1 focus:ring-stone-900 bg-white"
                >
                  <option value="=">is equal to</option>
                  <option value="<">is less than</option>
                  <option value=">">is greater than</option>
                </select>
                <input 
                  type="text" 
                  value={ruleVal}
                  onChange={e => setRuleVal(e.target.value)}
                  placeholder="e.g. 50" 
                  className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-1 focus:ring-stone-900 bg-white" 
                />
              </div>
            </div>
          )}

        </div>

        <div className="p-6 border-t border-stone-200 bg-stone-50 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 bg-white border border-stone-200 text-stone-700 font-inter font-medium text-sm rounded-lg hover:bg-stone-50 transition-colors shadow-sm">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={!title.trim() || createMutation.isPending || updateMutation.isPending}
            className="px-8 py-2.5 bg-stone-900 text-white font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Collection"}
          </button>
        </div>
      </div>
    </div>
  );
}
