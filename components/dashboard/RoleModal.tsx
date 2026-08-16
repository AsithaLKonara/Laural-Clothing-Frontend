"use client";

import { useState, useEffect } from "react";
import { X, Shield, ChevronDown, ChevronRight } from "lucide-react";

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

// ─── Full module registry grouped by category ─────────────────────────────────
const MODULE_GROUPS = [
  {
    group: "Orders & Fulfillment",
    color: "bg-blue-50 text-blue-800",
    modules: [
      "Orders — View",
      "Orders — Create",
      "Orders — Edit Status",
      "Orders — Cancel / Refund",
      "Returns & RMA — View",
      "Returns & RMA — Approve / Reject",
      "Returns & RMA — Issue Refund",
      "Shipping — View Queue",
      "Shipping — Dispatch (Fardar)",
      "Shipping — Print Labels",
    ],
  },
  {
    group: "Point of Sale (POS)",
    color: "bg-violet-50 text-violet-800",
    modules: [
      "POS — Open / Close Shift",
      "POS — Sales Mode",
      "POS — Returns Mode",
      "POS — Exchange Mode",
      "POS — Dispatch Mode",
      "POS — Hold & Resume Sale",
      "POS — Apply Discounts",
      "POS — View Sales History",
    ],
  },
  {
    group: "Catalog & Products",
    color: "bg-amber-50 text-amber-800",
    modules: [
      "Products — View",
      "Products — Create",
      "Products — Edit",
      "Products — Delete",
      "Categories — Manage",
      "Collections — Manage",
    ],
  },
  {
    group: "Inventory",
    color: "bg-green-50 text-green-800",
    modules: [
      "Inventory — View Stock Levels",
      "Inventory — Receive Stock (PO)",
      "Inventory — Stock Transfers",
      "Inventory — Report Damage / Loss",
      "Inventory — Adjust Stock",
    ],
  },
  {
    group: "Payments",
    color: "bg-emerald-50 text-emerald-800",
    modules: [
      "Payments — View Transactions",
      "Payments — Process Refund",
      "Payments — Retry Failed Payment",
      "Payments — View Gateway Reports",
    ],
  },
  {
    group: "Customers & Loyalty",
    color: "bg-pink-50 text-pink-800",
    modules: [
      "Customers — View",
      "Customers — Edit",
      "Customers — Suspend",
      "Loyalty — View Points",
      "Loyalty — Adjust Points",
      "Loyalty — Manage Tiers",
    ],
  },
  {
    group: "Promotions & Marketing",
    color: "bg-orange-50 text-orange-800",
    modules: [
      "Promotions — View",
      "Promotions — Create Coupon",
      "Promotions — Create Campaign",
      "Promotions — Deactivate",
    ],
  },
  {
    group: "Reviews",
    color: "bg-sky-50 text-sky-800",
    modules: [
      "Reviews — View",
      "Reviews — Approve",
      "Reviews — Reject",
      "Reviews — Reply",
    ],
  },
  {
    group: "Reports & Analytics",
    color: "bg-indigo-50 text-indigo-800",
    modules: [
      "Reports — View Dashboard",
      "Reports — Export Data",
      "Reports — View Financial",
    ],
  },
  {
    group: "Content Management (CMS)",
    color: "bg-teal-50 text-teal-800",
    modules: [
      "CMS — View",
      "CMS — Edit Hero Slides",
      "CMS — Edit Promo Banners",
      "CMS — Edit Homepage Layout",
      "CMS — Edit Static Pages",
    ],
  },
  {
    group: "Media Library",
    color: "bg-cyan-50 text-cyan-800",
    modules: [
      "Media — View Library",
      "Media — Upload Files",
      "Media — Delete Files",
      "Media — Assign to Sections",
    ],
  },
  {
    group: "Branches",
    color: "bg-stone-100 text-stone-800",
    modules: [
      "Branches — View",
      "Branches — Create",
      "Branches — Edit",
      "Branches — Delete",
    ],
  },
  {
    group: "System Administration",
    color: "bg-red-50 text-red-800",
    modules: [
      "System — View Audit Logs",
      "System — Manage Users",
      "System — Manage Roles",
      "System — Platform Settings",
    ],
  },
];

const PERMISSIONS = ["View", "Create", "Edit", "Delete"];

// Default permission presets per role name
function getDefaultMatrix(roleName: string): Record<string, Record<string, boolean>> {
  const matrix: Record<string, Record<string, boolean>> = {};
  const all = MODULE_GROUPS.flatMap(g => g.modules);

  const isSuperAdmin = roleName === "Super Admin";
  const isBranchAdmin = roleName === "Branch Admin";
  const isCashier = roleName === "Cashier";
  const isInventory = roleName === "Inventory Manager";
  const isMarketing = roleName === "Marketing Manager";
  const isWarehouse = roleName === "Warehouse Staff";

  const CASHIER_ALLOWED = new Set([
    "POS — Open / Close Shift",
    "POS — Sales Mode",
    "POS — Returns Mode",
    "POS — Exchange Mode",
    "POS — Hold & Resume Sale",
    "POS — Apply Discounts",
    "POS — View Sales History",
    "Orders — View",
    "Customers — View",
  ]);

  const INVENTORY_ALLOWED = new Set([
    "Inventory — View Stock Levels",
    "Inventory — Receive Stock (PO)",
    "Inventory — Stock Transfers",
    "Inventory — Report Damage / Loss",
    "Inventory — Adjust Stock",
    "Products — View",
    "Categories — Manage",
    "Collections — Manage",
    "Shipping — View Queue",
  ]);

  const MARKETING_ALLOWED = new Set([
    "Promotions — View",
    "Promotions — Create Coupon",
    "Promotions — Create Campaign",
    "Promotions — Deactivate",
    "Reviews — View",
    "Reviews — Approve",
    "Reviews — Reject",
    "Reviews — Reply",
    "CMS — View",
    "CMS — Edit Hero Slides",
    "CMS — Edit Promo Banners",
    "CMS — Edit Homepage Layout",
    "CMS — Edit Static Pages",
    "Media — View Library",
    "Media — Upload Files",
    "Media — Assign to Sections",
    "Customers — View",
    "Reports — View Dashboard",
  ]);

  const WAREHOUSE_ALLOWED = new Set([
    "Inventory — View Stock Levels",
    "Inventory — Receive Stock (PO)",
    "Inventory — Report Damage / Loss",
    "Shipping — View Queue",
    "Shipping — Dispatch (Fardar)",
    "Shipping — Print Labels",
    "Orders — View",
    "Returns & RMA — View",
  ]);

  all.forEach(mod => {
    let granted = false;
    if (isSuperAdmin || isBranchAdmin) granted = true;
    else if (isCashier) granted = CASHIER_ALLOWED.has(mod);
    else if (isInventory) granted = INVENTORY_ALLOWED.has(mod);
    else if (isMarketing) granted = MARKETING_ALLOWED.has(mod);
    else if (isWarehouse) granted = WAREHOUSE_ALLOWED.has(mod);

    matrix[mod] = { View: granted, Create: granted, Edit: granted, Delete: isSuperAdmin };
  });

  return matrix;
}

export default function RoleModal({ isOpen, onClose, initialData }: RoleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

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

    const m = getDefaultMatrix(initialData?.name || "");
    setMatrix(m);

    // Expand all groups by default
    const expanded: Record<string, boolean> = {};
    MODULE_GROUPS.forEach(g => { expanded[g.group] = true; });
    setExpandedGroups(expanded);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const togglePermission = (mod: string, perm: string) => {
    setMatrix(prev => ({
      ...prev,
      [mod]: { ...prev[mod], [perm]: !prev[mod]?.[perm] }
    }));
  };

  const toggleGroupAll = (group: typeof MODULE_GROUPS[0], checked: boolean) => {
    const updates: Record<string, Record<string, boolean>> = {};
    group.modules.forEach(mod => {
      updates[mod] = {};
      PERMISSIONS.forEach(p => { updates[mod][p] = checked; });
    });
    setMatrix(prev => ({ ...prev, ...updates }));
  };

  const isGroupFullyChecked = (group: typeof MODULE_GROUPS[0]) =>
    group.modules.every(mod => PERMISSIONS.every(p => matrix[mod]?.[p]));

  const toggleExpand = (groupName: string) =>
    setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));

  const grantedCount = Object.values(matrix).reduce((acc, perms) =>
    acc + Object.values(perms).filter(Boolean).length, 0);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[860px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
          <div>
            <h2 className="font-inter font-bold text-lg text-stone-900 flex items-center gap-2">
              <Shield size={18} className="text-stone-900" />
              {initialData ? "Edit Role Permissions" : "Create New Role"}
            </h2>
            <p className="font-inter text-xs text-stone-400 mt-0.5">{grantedCount} permissions granted across {MODULE_GROUPS.length} module groups</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-lg text-stone-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

          {/* Role Info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-inter font-bold text-stone-900 border-b border-stone-100 pb-2">Role Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Role Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Area Manager"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-100 transition-all font-inter"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-900 font-inter bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="What is this role responsible for?"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-100 transition-all font-inter resize-none"
                />
              </div>
            </div>
          </div>

          {/* Permission Matrix */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-inter font-bold text-stone-900">Permission Matrix</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => MODULE_GROUPS.forEach(g => toggleGroupAll(g, true))}
                  className="px-3 py-1 text-xs font-inter font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-700 transition-colors"
                >
                  Grant All
                </button>
                <button
                  onClick={() => MODULE_GROUPS.forEach(g => toggleGroupAll(g, false))}
                  className="px-3 py-1 text-xs font-inter font-semibold bg-white border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Revoke All
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {MODULE_GROUPS.map(group => {
                const isExpanded = expandedGroups[group.group];
                const allChecked = isGroupFullyChecked(group);
                const someChecked = group.modules.some(mod => PERMISSIONS.some(p => matrix[mod]?.[p]));

                return (
                  <div key={group.group} className="border border-stone-200 rounded-xl overflow-hidden">
                    
                    {/* Group Header */}
                    <div
                      className="flex items-center gap-3 px-4 py-3 bg-stone-50 cursor-pointer hover:bg-stone-100 transition-colors"
                      onClick={() => toggleExpand(group.group)}
                    >
                      <input
                        type="checkbox"
                        checked={allChecked}
                        ref={el => { if (el) el.indeterminate = !allChecked && someChecked; }}
                        onChange={e => { e.stopPropagation(); toggleGroupAll(group, e.target.checked); }}
                        onClick={e => e.stopPropagation()}
                        className="w-4 h-4 accent-stone-900 cursor-pointer rounded"
                      />
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${group.color}`}>
                        {group.group}
                      </span>
                      <span className="font-inter text-xs text-stone-400 ml-auto">
                        {group.modules.filter(mod => PERMISSIONS.some(p => matrix[mod]?.[p])).length}/{group.modules.length} modules
                      </span>
                      {isExpanded ? <ChevronDown size={14} className="text-stone-400" /> : <ChevronRight size={14} className="text-stone-400" />}
                    </div>

                    {/* Module Rows */}
                    {isExpanded && (
                      <table className="w-full text-left text-sm">
                        <thead className="border-y border-stone-100 bg-stone-50/50">
                          <tr>
                            <th className="px-4 py-2 font-inter font-semibold text-[10px] text-stone-400 uppercase tracking-wider w-1/2">Module / Feature</th>
                            {PERMISSIONS.map(p => (
                              <th key={p} className="px-3 py-2 font-inter font-semibold text-[10px] text-stone-400 uppercase tracking-wider text-center">{p}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {group.modules.map(mod => (
                            <tr key={mod} className="border-t border-stone-50 hover:bg-stone-50/80 transition-colors">
                              <td className="px-4 py-2.5 font-inter text-sm text-stone-700">{mod}</td>
                              {PERMISSIONS.map(perm => (
                                <td key={perm} className="px-3 py-2.5 text-center">
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
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 px-6 py-4 bg-stone-50 shrink-0 flex items-center justify-between">
          <p className="font-inter text-xs text-stone-400">{grantedCount} permission flags granted</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-white border border-stone-300 rounded-lg font-inter font-medium text-sm text-stone-700 hover:bg-stone-50 transition-colors shadow-sm">
              Cancel
            </button>
            <button
              onClick={onClose}
              disabled={!name.trim()}
              className="px-5 py-2 bg-stone-900 text-white rounded-lg font-inter font-medium text-sm hover:bg-stone-800 transition-colors shadow-md shadow-stone-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {initialData ? "Save Permissions" : "Create Role"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
