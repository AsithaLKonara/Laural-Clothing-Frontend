"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/Badges";

export default function RolesPage() {
  const router = useRouter();

  const roles = [
    { id: "ROL-001", name: "Super Admin", description: "Full system access including global settings and all branches.", users: 2, level: "High", status: "Active" },
    { id: "ROL-002", name: "Branch Admin", description: "Full access within an assigned branch. Cannot view other branches.", users: 12, level: "Medium", status: "Active" },
    { id: "ROL-003", name: "Cashier", description: "Access to POS and current shift management only.", users: 45, level: "Low", status: "Active" },
    { id: "ROL-004", name: "Inventory Manager", description: "Access to catalog, inventory, and stock transfers.", users: 0, level: "Medium", status: "Inactive" },
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
  ];

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full">
      <PageHeader 
        title="Roles & Permissions" 
        description="Configure RBAC policies and define fine-grained access control."
      />

      <FilterBar 
        placeholder="Search roles..." 
        filters={<></>} 
      />

      <DataTable 
        data={roles}
        columns={columns}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => console.log("Navigate to", row.id)}
        pagination={{ currentPage: 1, totalPages: 1 }}
      />
    </div>
  );
}
