"use client";

import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/Badges";
import FilterBar from "@/components/dashboard/FilterBar";
import AddCollectionModal from "@/components/dashboard/AddCollectionModal";

export default function CollectionsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const collections = [
    { id: "COL-001", name: "Summer 2026", slug: "summer-2026", type: "Manual", products: 24, status: "Active" },
    { id: "COL-002", name: "Best Sellers", slug: "best-sellers", type: "Automated", products: 10, status: "Active" },
    { id: "COL-003", name: "New Arrivals", slug: "new-arrivals", type: "Automated", products: 15, status: "Active" },
    { id: "COL-004", name: "Clearance Sale", slug: "clearance-sale", type: "Manual", products: 42, status: "Active" },
    { id: "COL-005", name: "Winter 2026", slug: "winter-2026", type: "Manual", products: 0, status: "Draft" },
  ];

  const columns = [
    { header: "ID", accessor: "id" as const, className: "font-mono text-stone-500 text-xs" },
    { header: "Collection Name", accessor: "name" as const, className: "font-semibold text-stone-900" },
    { header: "Slug", accessor: "slug" as const, className: "font-mono text-xs text-stone-500" },
    { header: "Type", accessor: "type" as const, className: "text-stone-600 font-inter text-sm" },
    { header: "Products", accessor: "products" as const, className: "font-bold text-stone-800" },
    {
      header: "Status",
      accessor: (row: any) => (
        <StatusBadge label={row.status} variant={row.status === "Active" ? "success" : "neutral"} />
      ),
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          <button className="text-xs text-blue-600 hover:underline font-medium">Edit</button>
          <span className="text-stone-300">·</span>
          <button className="text-xs text-red-500 hover:underline font-medium">Delete</button>
        </div>
      ),
    },
  ];

  const filters = (
    <>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-900/50">
        <option>All Status</option>
        <option>Active</option>
        <option>Draft</option>
      </select>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-900/50">
        <option>All Types</option>
        <option>Manual</option>
        <option>Automated</option>
      </select>
      <button 
        onClick={() => setModalOpen(true)}
        className="bg-stone-900 text-white hover:bg-stone-800 active:scale-95 px-5 py-2 rounded-lg font-inter text-sm font-semibold transition-all whitespace-nowrap ml-auto shadow-md shadow-stone-900/20 flex items-center gap-2"
      >
        + Add Collection
      </button>
    </>
  );

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full gap-6">
      <PageHeader
        title="Collections"
        description="Curate products into thematic collections for easier discovery."
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Collections", value: "5" },
          { label: "Active", value: "4" },
          { label: "Draft", value: "1" },
          { label: "Automated", value: "2" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider font-inter">{s.label}</p>
            <p className="text-3xl font-bold text-stone-900 mt-1 font-inter">{s.value}</p>
          </div>
        ))}
      </div>

      <FilterBar placeholder="Search collections..." filters={filters} />

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <DataTable
          data={collections}
          columns={columns}
          keyExtractor={(row) => row.id}
          pagination={{ currentPage: 1, totalPages: 1 }}
        />
      </div>
      
      <AddCollectionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
