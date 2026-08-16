"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/Badges";
import { useCustomers } from "@/hooks/useCustomers";

export default function CustomersPage() {
  const router = useRouter();

  const { data: customers = [], isLoading } = useCustomers();

  const columns = [
    { header: "Name", accessor: "name" as const },
    { header: "Phone", accessor: "phone" as const },
    { header: "Email", accessor: "email" as const },
    { 
      header: "Type", 
      accessor: (row: any) => (
        <StatusBadge 
          label={row.type} 
          variant={row.type === "Registered" ? "success" : "neutral"} 
          dot 
        />
      ) 
    },
    { header: "Orders", accessor: "orders" as const },
    { header: "Total Spent", accessor: "spent" as const },
    { header: "Last Active", accessor: "lastActive" as const },
  ];

  const filters = (
    <>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
        <option>All Types</option>
        <option>Registered</option>
        <option>Guest</option>
      </select>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
        <option>Sort By: Newest</option>
        <option>Sort By: Highest Spend</option>
        <option>Sort By: Most Orders</option>
      </select>
    </>
  );

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full">
      <PageHeader 
        title="Customers" 
        description="View and manage registered customers and guest checkout histories."
      />

      <FilterBar 
        placeholder="Search by name, phone, or email..." 
        filters={filters} 
      />

      <DataTable 
        data={customers}
        columns={columns}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => console.log("Navigate to", row.id)}
        pagination={{ currentPage: 1, totalPages: 5 }}
      />
    </div>
  );
}
