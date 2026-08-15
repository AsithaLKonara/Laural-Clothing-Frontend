"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/Badges";

export default function AuditPage() {
  const router = useRouter();

  const logs = [
    { id: "AUD-1004", timestamp: "Oct 24, 14:32:10", user: "admin@laural.com", action: "DELETE", resource: "Product", details: "Deleted product LC-TSH-001" },
    { id: "AUD-1003", timestamp: "Oct 24, 14:28:45", user: "admin@laural.com", action: "UPDATE", resource: "Settings", details: "Updated tax rate to 18%" },
    { id: "AUD-1002", timestamp: "Oct 24, 12:15:00", user: "kandy@laural.com", action: "CREATE", resource: "StockTransfer", details: "Initiated transfer TRN-9921" },
    { id: "AUD-1001", timestamp: "Oct 24, 10:00:12", user: "system", action: "SYSTEM", resource: "PaymentWebhook", details: "Processed Koko webhook for LC-10241" },
  ];

  const columns = [
    { header: "Timestamp", accessor: "timestamp" as const },
    { header: "User", accessor: "user" as const },
    { 
      header: "Action", 
      accessor: (row: any) => (
        <StatusBadge 
          label={row.action} 
          variant={row.action === "DELETE" ? "error" : row.action === "UPDATE" ? "warning" : row.action === "CREATE" ? "success" : "neutral"} 
        />
      ) 
    },
    { header: "Resource", accessor: "resource" as const },
    { header: "Details", accessor: "details" as const },
  ];

  const filters = (
    <>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
        <option>All Actions</option>
        <option>CREATE</option>
        <option>UPDATE</option>
        <option>DELETE</option>
        <option>SYSTEM</option>
      </select>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
        <option>Last 24 Hours</option>
        <option>Last 7 Days</option>
        <option>Last 30 Days</option>
      </select>
    </>
  );

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full">
      <PageHeader 
        title="Audit Logs" 
        description="Immutable record of all system-level modifications and critical operations."
      />

      <FilterBar 
        placeholder="Search logs by user, resource, or details..." 
        filters={filters} 
      />

      <DataTable 
        data={logs}
        columns={columns}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => console.log("Navigate to", row.id)}
        pagination={{ currentPage: 1, totalPages: 120 }}
      />
    </div>
  );
}
