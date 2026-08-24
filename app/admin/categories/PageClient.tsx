"use client";

import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/Badges";
import FilterBar from "@/components/dashboard/FilterBar";
import CategoryFormModal from "@/components/dashboard/CategoryFormModal";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import { Category } from "@/types/category";
import { globalDialog } from "@/store/dialog.store";

export default function CategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | undefined>(undefined);

  const { data: response, isLoading } = useCategories();
  const categories = response?.data || [];
  
  const deleteCategoryMutation = useDeleteCategory();

  const handleEdit = (category: Category) => {
    setCategoryToEdit(category);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setCategoryToEdit(undefined);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (await globalDialog.confirm("Are you sure you want to delete this category?")) {
      await deleteCategoryMutation.mutateAsync(id);
    }
  };

  const columns = [
    { header: "ID", accessor: (row: any) => row.id.substring(0, 8), className: "font-mono text-stone-500 text-xs" },
    { 
      header: "Category Name", 
      accessor: (row: any) => (
        <button onClick={() => handleEdit(row)} className="font-semibold text-stone-900 hover:text-accent transition-colors text-left">
          {row.name}
        </button>
      )
    },
    { header: "Slug", accessor: "slug" as const, className: "font-mono text-xs text-stone-500" },
    { 
      header: "Products", 
      accessor: (row: any) => row._count?.products || 0,
      className: "font-bold text-stone-800" 
    },
    {
      header: "Status",
      accessor: (row: any) => (
        <StatusBadge label="Active" variant="success" />
      ),
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleEdit(row)} className="text-xs text-blue-600 hover:underline font-medium">Edit</button>
          <span className="text-stone-300">·</span>
          <button onClick={() => handleDelete(row.id)} disabled={deleteCategoryMutation.isPending} className="text-xs text-red-500 hover:underline font-medium disabled:opacity-50">Delete</button>
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
      <button 
        onClick={handleAdd}
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
          { label: "Total Categories", value: categories.length.toString() },
          { label: "Active", value: categories.length.toString() },
          { label: "Draft", value: "0" },
          { label: "Total Products Categorized", value: categories.reduce((sum: number, c: any) => sum + (c._count?.products || 0), 0).toString() },
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
      
      <CategoryFormModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        categoryToEdit={categoryToEdit} 
      />
    </div>
  );
}
