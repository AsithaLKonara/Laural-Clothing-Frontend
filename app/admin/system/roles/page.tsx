"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/Badges";
import { Plus, Users, Shield } from "lucide-react";
import RoleModal from "@/components/dashboard/RoleModal";
import UserModal from "@/components/dashboard/UserModal";

export default function AccessControlPage() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("roles");
  
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const roles = [
    { id: "ROL-001", name: "Super Admin", description: "Full system access — all modules, all branches, all settings. Can manage roles and users.", users: 2, level: "High", status: "Active" },
    { id: "ROL-002", name: "Branch Admin", description: "Full access within assigned branch. Orders, POS, inventory, returns, reports. Cannot edit system settings.", users: 12, level: "High", status: "Active" },
    { id: "ROL-003", name: "Cashier", description: "POS-only access: open/close shift, sales, returns, exchanges, holds. No admin dashboard.", users: 45, level: "Low", status: "Active" },
    { id: "ROL-004", name: "Inventory Manager", description: "Catalog, stock levels, receive PO, stock transfers, damage reports. No POS or financial access.", users: 8, level: "Medium", status: "Active" },
    { id: "ROL-005", name: "Warehouse Staff", description: "Limited to shipping queue, dispatch via Fardar, print labels, receive returns at warehouse.", users: 6, level: "Low", status: "Active" },
    { id: "ROL-006", name: "Marketing Manager", description: "Full access to Promotions, CMS, Media Library, Reviews moderation, and customer viewing.", users: 3, level: "Medium", status: "Active" },
    { id: "ROL-007", name: "Customer Support", description: "View orders, process returns/RMA, view customer profiles. Read-only on most modules.", users: 9, level: "Low", status: "Active" },
    { id: "ROL-008", name: "Finance Auditor", description: "Read-only access to Payments, Reports/Analytics, and Audit Logs. No create or edit permissions.", users: 2, level: "Medium", status: "Active" },
  ];


  const columns = [
    { header: "Role Name", accessor: "name" as const },
    { header: "Description", accessor: "description" as const },
    { header: "Assigned Users", accessor: "users" as const },
    { 
      header: "Permissions Level", 
      accessor: (row: any) => (
        <StatusBadge 
          label={row.level} 
          variant={row.level === "High" ? "error" : row.level === "Medium" ? "warning" : "info"} 
        />
      ) 
    },
    {
      header: "Status", 
      accessor: (row: any) => (
        <StatusBadge 
          label={row.status} 
          variant={row.status === "Active" ? "success" : "neutral"} 
          dot 
        />
      ) 
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          <button 
            className="text-xs text-blue-600 hover:underline font-medium"
            onClick={(e) => { e.stopPropagation(); setEditingRole(row); setRoleModalOpen(true); }}
          >
            Edit Permissions
          </button>
        </div>
      ),
    },
  ];

  const users = [
    { id: "USR-001", firstName: "Asitha", lastName: "Lakmal", email: "asitha@laural.lk", role: "Super Admin", branch: "Global (All Branches)", status: "Active" },
    { id: "USR-002", firstName: "John", lastName: "Doe", email: "john@laural.lk", role: "Branch Admin", branch: "Colombo Main", status: "Active" },
    { id: "USR-003", firstName: "Jane", lastName: "Smith", email: "jane@laural.lk", role: "Cashier", branch: "Kandy City Centre", status: "Active" },
    { id: "USR-004", firstName: "Mark", lastName: "Silva", email: "mark@laural.lk", role: "Inventory Manager", branch: "Gampaha Branch", status: "Suspended" },
  ];

  const userColumns = [
    { header: "Name", accessor: (row: any) => <span className="font-semibold text-stone-900">{row.firstName} {row.lastName}</span> },
    { header: "Email", accessor: "email" as const },
    { header: "Role", accessor: "role" as const, className: "font-semibold text-stone-700" },
    { header: "Branch", accessor: "branch" as const },
    { 
      header: "Status", 
      accessor: (row: any) => (
        <StatusBadge 
          label={row.status} 
          variant={row.status === "Active" ? "success" : "error"} 
          dot 
        />
      ) 
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          <button 
            className="text-xs text-blue-600 hover:underline font-medium"
            onClick={(e) => { e.stopPropagation(); setEditingUser(row); setUserModalOpen(true); }}
          >
            Manage Access
          </button>
        </div>
      ),
    },
  ];

  const pageActions = (
    <button 
      onClick={() => activeTab === "roles" ? setRoleModalOpen(true) : setUserModalOpen(true)}
      className="bg-stone-900 text-white hover:bg-stone-800 active:scale-95 px-5 py-2 rounded-lg font-inter text-sm font-semibold transition-all whitespace-nowrap shadow-md shadow-stone-900/20 flex items-center gap-2"
    >
      <Plus size={16} /> {activeTab === "roles" ? "Create Role" : "Invite User"}
    </button>
  );

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full">
      <PageHeader 
        title="Access Control Center" 
        description="Manage system users, define roles, and configure granular permissions across the platform."
        action={pageActions}
      />
      
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-stone-200 mb-6">
        <button 
          onClick={() => setActiveTab("roles")}
          className={`pb-3 font-inter text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "roles" ? "border-stone-900 text-stone-900" : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          <Shield size={16} /> Roles & Permissions
        </button>
        <button 
          onClick={() => setActiveTab("users")}
          className={`pb-3 font-inter text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "users" ? "border-stone-900 text-stone-900" : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          <Users size={16} /> System Users
        </button>
      </div>

      <FilterBar 
        placeholder={activeTab === "roles" ? "Search roles..." : "Search users by name or email..."} 
        filters={
          activeTab === "users" ? (
            <>
              <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
                <option>All Branches</option>
                <option>Colombo Main</option>
                <option>Kandy City Centre</option>
                <option>Global</option>
              </select>
              <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
                <option>All Roles</option>
                <option>Super Admin</option>
                <option>Branch Admin</option>
                <option>Cashier</option>
              </select>
            </>
          ) : <></>
        }
      />

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        {activeTab === "roles" ? (
          <DataTable 
            data={roles}
            columns={columns}
            keyExtractor={(row) => row.id}
            pagination={{ currentPage: 1, totalPages: 1 }}
          />
        ) : (
          <DataTable 
            data={users}
            columns={userColumns}
            keyExtractor={(row) => row.id}
            pagination={{ currentPage: 1, totalPages: 1 }}
          />
        )}
      </div>

      <RoleModal 
        isOpen={roleModalOpen} 
        onClose={() => { setRoleModalOpen(false); setEditingRole(null); }} 
        initialData={editingRole} 
      />
      <UserModal 
        isOpen={userModalOpen} 
        onClose={() => { setUserModalOpen(false); setEditingUser(null); }} 
        initialData={editingUser} 
      />
    </div>
  );
}
