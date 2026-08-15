"use client";

import { useState, useEffect } from "react";
import { X, Shield } from "lucide-react";

interface RoleData {
  id?: string;
  name: string;
  description: string;
  status: string;
}

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: RoleData | null;
}

const MODULES = [
  "Products Catalog",
  "Inventory & Stock",
  "Orders & Fulfillment",
  "Point of Sale (POS)",
  "Customers & Loyalty",
  "Promotions & Coupons",
  "Reports & Analytics",
  "System Settings",
  "Access Control",
];

const PERMISSIONS = ["View", "Create", "Edit", "Delete"];

export default function RoleModal({ isOpen, onClose, initialData }: RoleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  
  // Matrix state: { "Products Catalog": { "View": true, "Create": false, ... } }
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setStatus(initialData.status);
    } else {
      setName("");
      setDescription("");
      setStatus("Active");
    }

    // Initialize matrix
    const initialMatrix: Record<string, Record<string, boolean>> = {};
    MODULES.forEach(mod => {
      initialMatrix[mod] = {};
      PERMISSIONS.forEach(perm => {
        // If editing a powerful role, check some defaults, otherwise false
        const isHighPower = initialData?.name === "Super Admin" || initialData?.name === "Branch Admin";
        initialMatrix[mod][perm] = isHighPower;
      });
    });
    setMatrix(initialMatrix);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  function togglePermission(mod: string, perm: string) {
    setMatrix(prev => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        [perm]: !prev[mod][perm]
      }
    }));
  }

  function handleSave() {
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-[800px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
          <div>
            <h2 className="font-inter font-bold text-lg text-stone-900 flex items-center gap-2">
              <Shield size={18} className="text-stone-900" /> 
              {initialData ? "Edit Role Permissions" : "Create New Role"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-lg text-stone-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
          
          <div className="flex flex-col gap-6">
            <h3 className="font-inter font-bold text-stone-900 border-b border-stone-100 pb-2">Role Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Role Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Area Manager"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Status</label>
                <select 
                  value={status} 
                  onChange={e => setStatus(e.target.value)} 
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-inter text-xs font-semibold text-stone-700">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                placeholder="What is this role responsible for?"
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-inter font-bold text-stone-900 border-b border-stone-100 pb-2">Permission Matrix</h3>
            
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-xs text-stone-500 uppercase tracking-wide w-1/3">Module</th>
                    {PERMISSIONS.map(perm => (
                      <th key={perm} className="px-4 py-3 font-semibold text-xs text-stone-500 uppercase tracking-wide text-center">{perm}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODULES.map(mod => (
                    <tr key={mod} className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-stone-900 font-inter">{mod}</td>
                      {PERMISSIONS.map(perm => (
                        <td key={perm} className="px-4 py-3 text-center">
                          <label className="inline-flex cursor-pointer p-1">
                            <input
                              type="checkbox"
                              checked={matrix[mod]?.[perm] || false}
                              onChange={() => togglePermission(mod, perm)}
                              className="w-4 h-4 accent-stone-900 cursor-pointer"
                            />
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div className="border-t border-stone-200 px-6 py-4 bg-stone-50 shrink-0 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-stone-300 rounded-lg font-inter font-medium text-sm text-stone-700 hover:bg-stone-50 transition-colors shadow-sm">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-5 py-2 bg-stone-900 text-white rounded-lg font-inter font-medium text-sm hover:bg-stone-800 transition-colors shadow-md shadow-stone-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initialData ? "Save Permissions" : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
}
