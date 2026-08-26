"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge, BranchBadge } from "@/components/dashboard/Badges";

import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";

export default function UsersPage() {
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  // Branch filter isn't directly supported by backend yet, but we can add it or ignore for now.
  // The service only supports search and role Filter right now.

  const { data: users = [], isLoading } = useUsers({ 
    search: searchQuery || undefined, 
    role: roleFilter === "All Roles" ? undefined : (roleFilter || undefined)
  });

  const columns = [
    { header: "Name", accessor: "name" as const },
    { header: "Email", accessor: "email" as const },
    { 
      header: "Role", 
      accessor: (row: any) => (
        <StatusBadge 
          label={row.role} 
          variant={row.role === "Super Admin" ? "purple" : row.role === "Branch Admin" ? "info" : "neutral"} 
        />
      ) 
    },
    { 
      header: "Branch", 
      accessor: (row: any) => row.branch === "All Branches" || row.branch === "Global (All Branches)" ? <span className="text-sm font-medium text-stone-600">All Branches</span> : <BranchBadge branch={row.branch} /> 
    },
    { 
      header: "Status", 
      accessor: (row: any) => (
        <StatusBadge 
          label={row.status} 
          variant={row.status === "ACTIVE" || row.status === "Active" ? "success" : "error"} 
          dot 
        />
      ) 
    },
    { header: "Last Login", accessor: (row: any) => row.lastLogin || "Never" },
  ];

  const filters = (
    <>
      <select 
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400"
      >
        <option value="">All Roles</option>
        <option value="Super Admin">Super Admin</option>
        <option value="Branch Admin">Branch Admin</option>
        <option value="Cashier">Cashier</option>
      </select>
      {/* Keeping branch static as mock since it's not in backend yet */}
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
        <option>All Branches</option>
        <option>Kandy</option>
        <option>Colombo</option>
        <option>Gampaha</option>
      </select>
    </>
  );

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full">
      <PageHeader 
        title="System Users" 
        description="Manage access, roles, and branch assignments for all internal users."
      />

      <FilterBar 
        placeholder="Search by name, email, or phone..." 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters} 
      />

      <DataTable 
        data={users}
        columns={columns}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => console.log("Navigate to", row.id)}
        pagination={{ currentPage: 1, totalPages: 1 }}
      />
    </div>
  );
}
