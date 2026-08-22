"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge, BranchBadge } from "@/components/dashboard/Badges";

export default function UsersPage() {
  const router = useRouter();

  const users = [
    { id: "USR-001", name: "Super Admin", email: "admin@laural.com", role: "Super Admin", branch: "All Branches", status: "Active", lastLogin: "10 mins ago" },
    { id: "USR-002", name: "Kandy Manager", email: "kandy@laural.com", role: "Branch Admin", branch: "Kandy", status: "Active", lastLogin: "2 hours ago" },
    { id: "USR-003", name: "Kasun Perera", email: "kasun.p@laural.com", role: "Cashier", branch: "Kandy", status: "Active", lastLogin: "4 hours ago" },
    { id: "USR-004", name: "Colombo Manager", email: "colombo@laural.com", role: "Branch Admin", branch: "Colombo", status: "Inactive", lastLogin: "5 days ago" },
  ];

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
      accessor: (row: any) => row.branch === "All Branches" ? <span className="text-sm font-medium text-stone-600">All Branches</span> : <BranchBadge branch={row.branch} /> 
    },
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
    { header: "Last Login", accessor: "lastLogin" as const },
  ];

  const filters = (
    <>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
        <option>All Roles</option>
        <option>Super Admin</option>
        <option>Branch Admin</option>
        <option>Cashier</option>
      </select>
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
        placeholder="Search by name or email..." 
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
