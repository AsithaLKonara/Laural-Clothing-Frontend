"use client";

import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/Badges";
import FilterBar from "@/components/dashboard/FilterBar";
import AddCategoryModal from "@/components/dashboard/AddCategoryModal";

export default function CategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const categories = [
    { id: "CAT-001", name: "T-Shirts", slug: "t-shirts", parent: "—", products: 48, status: "Active" },
    { id: "CAT-002", name: "Shirts", slug: "shirts", parent: "—", products: 32, status: "Active" },
    { id: "CAT-003", name: "Dresses", slug: "dresses", parent: "—", products: 24, status: "Active" },
    { id: "CAT-004", name: "Pants", slug: "pants", parent: "—", products: 19, status: "Active" },
    { id: "CAT-005", name: "Oversized Tees", slug: "oversized-tees", parent: "T-Shirts", products: 14, status: "Active" },
    { id: "CAT-006", name: "Polo Shirts", slug: "polo-shirts", parent: "Shirts", products: 8, status: "Active" },
    { id: "CAT-007", name: "Maxi Dresses", slug: "maxi-dresses", parent: "Dresses", products: 6, status: "Draft" },
    { id: "CAT-008", name: "Accessories", slug: "accessories", parent: "—", products: 0, status: "Draft" },
  ];

  const columns = [
    { header: "ID", accessor: "id" as const, className: "font-mono text-stone-500 text-xs" },
    { header: "Category Name", accessor: "name" as const, className: "font-semibold text-stone-900" },
    { header: "Slug", accessor: "slug" as const, className: "font-mono text-xs text-stone-500" },
    { header: "Parent", accessor: "parent" as const, className: "text-stone-600" },
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
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-accent/50">
        <option>All Status</option>
        <option>Active</option>
        <option>Draft</option>
      </select>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-accent/50">
        <option>All Categories</option>
        <option>Top Level</option>
        <option>Sub-Categories</option>
      </select>
      <button 
        onClick={() => setModalOpen(true)}
        className="bg-stone-900 text-white hover:bg-stone-800 active:scale-95 px-5 py-2 rounded-lg font-inter text-sm font-semibold transition-all whitespace-nowrap ml-auto shadow-md shadow-stone-900/20 flex items-center gap-2"
      >
        + Add Category
      </button>
    </>
  );

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full gap-6">
      <PageHeader
        title="Categories"
        description="Manage product categories and sub-categories for your catalog."
      />

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Categories", value: "8" },
          { label: "Active", value: "6" },
          { label: "Draft", value: "2" },
          { label: "Total Products Categorized", value: "151" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider font-inter">{s.label}</p>
            <p className="text-3xl font-bold text-stone-900 mt-1 font-inter">{s.value}</p>
          </div>
        ))}
      </div>

      <FilterBar placeholder="Search categories..." filters={filters} />

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <DataTable
          data={categories}
          columns={columns}
          keyExtractor={(row) => row.id}
          pagination={{ currentPage: 1, totalPages: 1 }}
        />
      </div>
      
      <AddCategoryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
