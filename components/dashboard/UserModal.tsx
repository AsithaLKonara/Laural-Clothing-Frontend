"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, Info } from "lucide-react";

interface UserData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  branch: string;
  status: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UserData | null;
}

const ROLES = ["Super Admin", "Branch Admin", "Cashier", "Inventory Manager"];
const BRANCHES = ["Global (All Branches)", "Colombo Main", "Kandy City Centre", "Gampaha Branch", "Online Store"];

export default function UserModal({ isOpen, onClose, initialData }: UserModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES[2]); // Default to Cashier
  const [branch, setBranch] = useState(BRANCHES[1]); // Default to Colombo Main
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
      setEmail(initialData.email);
      setRole(initialData.role);
      setBranch(initialData.branch);
      setStatus(initialData.status);
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setRole(ROLES[2]);
      setBranch(BRANCHES[1]);
      setStatus("Active");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  function handleSave() {
    onClose();
  }

  // Handle cross-dependencies
  function handleRoleChange(newRole: string) {
    setRole(newRole);
    if (newRole === "Super Admin") {
      setBranch("Global (All Branches)");
    } else if (branch === "Global (All Branches)") {
      setBranch(BRANCHES[1]); // Reset if demoted from Super Admin
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

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-inter text-xs font-semibold text-stone-700">First Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="e.g. Jane"
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-inter text-xs font-semibold text-stone-700">Last Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="e.g. Doe"
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-inter text-xs font-semibold text-stone-700">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jane@laural.lk"
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter"
            />
            <p className="font-inter text-xs text-stone-400">An invitation link will be sent to this email to set up their password.</p>
          </div>

          <div className="h-px bg-stone-100 w-full my-2"></div>

          <div className="flex flex-col gap-2">
            <label className="font-inter text-xs font-semibold text-stone-700">Role Assignment</label>
            <select 
              value={role} 
              onChange={e => handleRoleChange(e.target.value)} 
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter bg-white"
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-inter text-xs font-semibold text-stone-700">Branch Assignment</label>
            <select 
              value={branch} 
              onChange={e => setBranch(e.target.value)} 
              disabled={role === "Super Admin"}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all font-inter bg-white disabled:bg-stone-100 disabled:text-stone-500"
            >
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            {role === "Super Admin" && (
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 p-2.5 rounded-lg mt-1">
                <Info size={14} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="font-inter text-xs text-blue-700 leading-relaxed">
                  Super Admins are automatically assigned to Global scope and can access all branch data.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-inter text-xs font-semibold text-stone-700">Account Status</label>
            <div className="flex items-center gap-4 bg-stone-50 border border-stone-200 p-3 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" value="Active" checked={status === "Active"} onChange={() => setStatus("Active")} className="w-4 h-4 accent-stone-900" />
                <span className="text-sm font-inter text-stone-800">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" value="Suspended" checked={status === "Suspended"} onChange={() => setStatus("Suspended")} className="w-4 h-4 accent-stone-900" />
                <span className="text-sm font-inter text-stone-800 text-red-600 font-medium">Suspended</span>
              </label>
            </div>
          </div>

        </div>

        <div className="border-t border-stone-200 px-6 py-4 bg-stone-50 shrink-0 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-stone-300 rounded-lg font-inter font-medium text-sm text-stone-700 hover:bg-stone-50 transition-colors shadow-sm">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!firstName.trim() || !email.trim()}
            className="px-5 py-2 bg-stone-900 text-white rounded-lg font-inter font-medium text-sm hover:bg-stone-800 transition-colors shadow-md shadow-stone-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initialData ? "Save Changes" : "Send Invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}
