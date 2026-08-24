"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, Info, Loader2 } from "lucide-react";
import roleService, { RoleItem, SystemUserItem } from "@/services/role.service";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: SystemUserItem | null;
  availableRoles?: RoleItem[];
}

const DEFAULT_BRANCHES = [
  "Global (All Branches)",
  "Colombo Main",
  "Kandy City Centre",
  "Gampaha Branch",
  "Online Store",
];

export default function UserModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  availableRoles = [],
}: UserModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [branch, setBranch] = useState(DEFAULT_BRANCHES[1]);
  const [status, setStatus] = useState("ACTIVE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      const parts = (initialData.name || "").split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(initialData.email);
      setPhone(initialData.phone || "");
      setSelectedRoleId(initialData.roleIds?.[0] || availableRoles[0]?.id || "");
      setBranch(initialData.branch || DEFAULT_BRANCHES[1]);
      setStatus(initialData.status || "ACTIVE");
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setSelectedRoleId(availableRoles[0]?.id || "");
      setBranch(DEFAULT_BRANCHES[1]);
      setStatus("ACTIVE");
    }
    setError(null);
  }, [initialData, isOpen, availableRoles]);

  if (!isOpen) return null;

  const currentRole = availableRoles.find((r) => r.id === selectedRoleId);
  const isSuperAdmin = currentRole?.name === "Super Admin";

  async function handleSave() {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName || !email.trim()) {
      setError("Name and Email are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (initialData?.id) {
        await roleService.updateUser(initialData.id, {
          name: fullName,
          email: email.trim(),
          phone: phone.trim() || undefined,
          status,
          roleIds: selectedRoleId ? [selectedRoleId] : undefined,
        });
      } else {
        await roleService.createUser({
          name: fullName,
          email: email.trim(),
          phone: phone.trim() || undefined,
          status,
          roleIds: selectedRoleId ? [selectedRoleId] : undefined,
        });
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to save user.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
          <div>
            <h2 className="font-inter font-bold text-lg text-stone-900 flex items-center gap-2">
              <UserPlus size={18} className="text-stone-900" />
              {initialData ? "Edit User Access" : "Invite System User"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-lg text-stone-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 custom-scrollbar">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-xs font-semibold text-stone-700">First Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Jane"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-900 bg-white font-inter"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-xs font-semibold text-stone-700">Last Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Doe"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-900 bg-white font-inter"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-inter text-xs font-semibold text-stone-700">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!initialData?.id}
              placeholder="jane@laural.lk"
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-900 bg-white font-inter disabled:bg-stone-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-inter text-xs font-semibold text-stone-700">Phone (Optional)</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+94770000000"
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-900 bg-white font-inter"
            />
          </div>

          <div className="h-px bg-stone-100 w-full"></div>

          <div className="flex flex-col gap-1.5">
            <label className="font-inter text-xs font-semibold text-stone-700">Role Assignment</label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-900 bg-white font-inter"
            >
              {availableRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.level || "Custom"} Access)
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-inter text-xs font-semibold text-stone-700">Branch Scope</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              disabled={isSuperAdmin}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-900 bg-white font-inter disabled:bg-stone-100 disabled:text-stone-500"
            >
              {DEFAULT_BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {isSuperAdmin && (
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 p-2.5 rounded-lg mt-1">
                <Info size={14} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="font-inter text-xs text-blue-700 leading-relaxed">
                  Super Admins are automatically assigned to Global scope and can access all branches.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-inter text-xs font-semibold text-stone-700">Account Status</label>
            <div className="flex items-center gap-4 bg-stone-50 border border-stone-200 p-3 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="ACTIVE"
                  checked={status === "ACTIVE" || status === "Active"}
                  onChange={() => setStatus("ACTIVE")}
                  className="w-4 h-4 accent-stone-900"
                />
                <span className="text-sm font-inter text-stone-800">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="SUSPENDED"
                  checked={status === "SUSPENDED" || status === "Suspended"}
                  onChange={() => setStatus("SUSPENDED")}
                  className="w-4 h-4 accent-stone-900"
                />
                <span className="text-sm font-inter text-stone-800 text-red-600 font-medium">Suspended</span>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 px-6 py-4 bg-stone-50 shrink-0 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-white border border-stone-300 rounded-lg font-inter font-medium text-sm text-stone-700 hover:bg-stone-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !firstName.trim() || !email.trim()}
            className="px-5 py-2 bg-stone-900 text-white rounded-lg font-inter font-medium text-sm hover:bg-stone-800 transition-colors shadow-md shadow-stone-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {initialData ? "Save Changes" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}
