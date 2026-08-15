"use client";

import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/Badges";
import AddProductModal from "@/components/dashboard/AddProductModal";
import Link from "next/link";

export default function ProductsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const products = [
    { sku: "LC-TSH-001", name: "Black Oversized T-Shirt", category: "T-Shirts", price: "Rs. 2,500", stock: 124, status: "Active" },
    { sku: "LC-SHT-042", name: "Classic Linen Shirt", category: "Shirts", price: "Rs. 4,900", stock: 45, status: "Active" },
    { sku: "LC-DRS-018", name: "Summer Floral Dress", category: "Dresses", price: "Rs. 6,500", stock: 0, status: "Out of Stock" },
    { sku: "LC-PNT-092", name: "Cargo Pants", category: "Pants", price: "Rs. 5,200", stock: 12, status: "Low Stock" },
    { sku: "LC-TSH-045", name: "Ribbed Tank Top", category: "T-Shirts", price: "Rs. 1,800", stock: 88, status: "Active" },
    { sku: "LC-JKT-011", name: "Denim Jacket", category: "Outerwear", price: "Rs. 8,500", stock: 20, status: "Active" },
    { sku: "LC-DRS-031", name: "Pleated Midi Skirt", category: "Dresses", price: "Rs. 4,200", stock: 5, status: "Low Stock" },
    { sku: "LC-TSH-002", name: "Basic White Tee", category: "T-Shirts", price: "Rs. 2,000", stock: 0, status: "Draft" },
  ];

  const columns = [
    { header: "SKU", accessor: "sku" as const, className: "font-mono font-medium text-stone-500 text-xs" },
    {
      header: "Product",
      accessor: (row: any) => (
        <Link href={`/admin/products/${row.sku}`} className="font-semibold text-stone-900 hover:text-accent transition-colors">
          {row.name}
        </Link>
      ),
    },
    { header: "Category", accessor: "category" as const },
    { header: "Price", accessor: "price" as const, className: "font-semibold text-stone-800" },
    {
      header: "Stock",
      accessor: (row: any) => (
        <span className={row.stock === 0 ? "text-red-600 font-bold" : row.stock <= 10 ? "text-amber-600 font-bold" : "text-stone-900"}>
          {row.stock}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row: any) => {
        let variant: "success" | "warning" | "error" | "neutral" = "success";
        if (row.status === "Out of Stock") variant = "error";
        else if (row.status === "Low Stock") variant = "warning";
        else if (row.status === "Draft") variant = "neutral";
        return <StatusBadge label={row.status} variant={variant} />;
      },
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <div className="flex gap-2 text-xs">
          <Link href={`/admin/products/${row.sku}`} className="text-blue-600 hover:underline font-medium">Edit</Link>
          <span className="text-stone-300">·</span>
          <button className="text-red-500 hover:underline font-medium">Archive</button>
        </div>
      ),
    },
  ];

  const filters = (
    <>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-accent/50">
        <option>All Categories</option>
        <option>T-Shirts</option>
        <option>Shirts</option>
        <option>Dresses</option>
        <option>Pants</option>
      </select>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-accent/50">
        <option>All Status</option>
        <option>Active</option>
        <option>Low Stock</option>
        <option>Out of Stock</option>
        <option>Draft</option>
      </select>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-stone-900 text-white hover:bg-stone-800 active:scale-95 px-5 py-2 rounded-lg font-inter text-sm font-semibold transition-all whitespace-nowrap ml-auto shadow-md shadow-stone-900/20 flex items-center gap-2"
      >
        + Add Product
      </button>
    </>
  );

  return (
    <>
      <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full">
        <PageHeader
          title="Products"
          description="Manage your product catalog, categories, and inventory base."
        />

        <FilterBar
          placeholder="Search products by name or SKU..."
          filters={filters}
        />

        <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden mt-6">
          <DataTable
            data={products}
            columns={columns}
            keyExtractor={(row) => row.sku}
            pagination={{ currentPage: 1, totalPages: 8 }}
          />
        </div>
      </div>

      <AddProductModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
