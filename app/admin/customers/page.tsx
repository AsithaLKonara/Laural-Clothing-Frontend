"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/Badges";

export default function CustomersPage() {
  const router = useRouter();

  const customers = [
    { id: "CUST-001", name: "Kasun Perera", phone: "0771234567", email: "kasun@example.com", type: "Registered", orders: 12, spent: "Rs.45,000", lastActive: "2 hours ago" },
    { id: "CUST-002", name: "Nethmi Fernando", phone: "0719876543", email: "nethmi@example.com", type: "Registered", orders: 8, spent: "Rs.32,500", lastActive: "1 day ago" },
    { id: "CUST-003", name: "Guest User", phone: "0765551234", email: "-", type: "Guest", orders: 1, spent: "Rs.3,900", lastActive: "Just now" },
    { id: "CUST-004", name: "Dilshan Silva", phone: "0778889999", email: "dilshan@example.com", type: "Registered", orders: 25, spent: "Rs.112,000", lastActive: "3 days ago" },
  ];

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
