"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/Badges";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { useBranches } from "@/hooks/useInventory";

export default function BranchesPage() {
  const { data: realBranches, isLoading } = useBranches();

  const branches = realBranches?.map((b: any) => ({
    id: b.code,
    name: b.name,
    location: b.address || "Unknown",
    manager: "N/A", // To be implemented with Users
    terminals: 0,
    staff: 0,
    status: b.isActive ? "Operational" : "Inactive",
    revenue: "Rs. 0",
  })) || [];

  const columns = [
    { header: "ID", accessor: "id" as const, className: "font-mono text-stone-500 text-xs" },
    { header: "Branch Name", accessor: "name" as const, className: "font-semibold text-stone-900" },
    { header: "Location", accessor: "location" as const },
    { header: "Manager", accessor: "manager" as const },
    {
      header: "POS Terminals",
      accessor: (row: any) => (
        <span className="font-bold text-stone-800">{row.terminals}</span>
      ),
    },
    { header: "Staff", accessor: "staff" as const },
    { header: "Revenue (This Month)", accessor: "revenue" as const, className: "font-bold text-stone-800" },
    {
      header: "Status",
      accessor: (row: any) => (
        <StatusBadge
          label={row.status}
          variant={row.status === "Operational" ? "success" : "neutral"}
        />
      ),
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <div className="flex gap-2">
          <button className="text-xs text-blue-600 hover:underline font-medium">View</button>
          <span className="text-stone-300">·</span>
          <button className="text-xs text-stone-500 hover:underline font-medium">Edit</button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full gap-6">
      <PageHeader
        title="Branches"
        description="Manage physical store locations, POS terminals, and branch staff."
        action={
          <button className="bg-stone-900 text-white hover:bg-stone-800 px-4 py-2.5 rounded-lg font-inter text-sm font-medium transition-colors">
            + Add Branch
          </button>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Branches" value="3" trend="1 Coming Soon" trendType="neutral" />
        <StatCard label="Active POS Terminals" value="6" trend="Across all branches" trendType="positive" />
        <StatCard label="Total Staff" value="25" trend="All active branches" trendType="neutral" />
        <StatCard label="Total Revenue" value="Rs. 2.69M" trend="This month" trendType="positive" />
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {branches.filter(b => b.status === "Operational").map((branch) => (
          <div key={branch.id} className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-stone-300 transition-all flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-inter font-bold text-stone-900 text-lg">{branch.name}</h3>
                <p className="font-inter text-sm text-stone-500">{branch.location}</p>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_6px_2px_rgba(16,185,129,0.3)]"></div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100">
              <div className="flex flex-col">
                <span className="font-inter text-xs text-stone-400 uppercase tracking-wider">Terminals</span>
                <span className="font-inter font-bold text-stone-900 text-xl">{branch.terminals}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-inter text-xs text-stone-400 uppercase tracking-wider">Staff</span>
                <span className="font-inter font-bold text-stone-900 text-xl">{branch.staff}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-inter text-xs text-stone-400 uppercase tracking-wider">Revenue</span>
                <span className="font-inter font-bold text-stone-900 text-sm">{branch.revenue}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <span className="font-inter text-xs text-stone-500">Manager: <span className="text-stone-700 font-medium">{branch.manager}</span></span>
              <button className="text-xs font-medium text-blue-600 hover:underline">View Details →</button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Data Table */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-inter font-bold text-stone-900">All Branches</h3>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-stone-500">Loading branches...</div>
        ) : (
          <DataTable
            columns={columns}
            data={branches}
            keyExtractor={(row) => row.id}
            onRowClick={(row) => console.log("Branch selected:", row)}
          />
        )}
      </div>
    </div>
  );
}
