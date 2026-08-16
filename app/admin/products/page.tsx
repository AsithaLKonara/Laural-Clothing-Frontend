"use client";

import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/Badges";
import AddProductModal from "@/components/dashboard/AddProductModal";
import BarcodePrintModal from "@/components/admin/BarcodePrintModal";
import BulkEditModal from "@/components/admin/BulkEditModal";
import Link from "next/link";
import { Barcode, Edit, ArchiveRestore, CheckCircle2 } from "lucide-react";

export default function ProductsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [printingProduct, setPrintingProduct] = useState<{sku: string, name: string} | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);

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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.sku));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (sku: string) => {
    setSelectedProducts(prev => prev.includes(sku) ? prev.filter(p => p !== sku) : [...prev, sku]);
  };

  const columns = [
    {
      header: <input type="checkbox" checked={selectedProducts.length === products.length && products.length > 0} onChange={handleSelectAll} className="rounded text-stone-900 focus:ring-stone-900 border-stone-300" />,
      accessor: (row: any) => <input type="checkbox" checked={selectedProducts.includes(row.sku)} onChange={() => handleSelectOne(row.sku)} onClick={e => e.stopPropagation()} className="rounded text-stone-900 focus:ring-stone-900 border-stone-300" />
    },
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
        <div className="flex gap-2 text-xs items-center">
          <Link href={`/admin/products/${row.sku}`} className="text-blue-600 hover:underline font-medium">Edit</Link>
          <span className="text-stone-300">·</span>
          <button className="text-red-500 hover:underline font-medium">Archive</button>
          <span className="text-stone-300">·</span>
          <button onClick={() => setPrintingProduct({ sku: row.sku, name: row.name })} className="text-stone-500 hover:text-stone-900 transition-colors tooltip" title="Print Barcode">
            <Barcode size={16} />
          </button>
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
      
      {/* Floating Bulk Action Bar */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10 z-40">
          <span className="font-inter font-medium text-sm">{selectedProducts.length} selected</span>
          <div className="w-px h-6 bg-stone-700"></div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowBulkEditModal(true)} className="font-inter font-semibold text-sm bg-stone-800 text-white px-4 py-2 rounded-full hover:bg-stone-700 transition-colors flex items-center gap-2">
              <Edit size={14} /> Bulk Edit
            </button>
            <button onClick={() => setSelectedProducts([])} className="font-inter font-semibold text-sm bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-500 transition-colors flex items-center gap-2">
              <CheckCircle2 size={14} /> Publish
            </button>
            <button onClick={() => setSelectedProducts([])} className="font-inter font-semibold text-sm bg-stone-800 text-white px-4 py-2 rounded-full hover:bg-stone-700 transition-colors flex items-center gap-2">
              <ArchiveRestore size={14} /> Archive
            </button>
          </div>
        </div>
      )}

      {showBulkEditModal && (
        <BulkEditModal 
          selectedProducts={products.filter(p => selectedProducts.includes(p.sku))}
          onClose={() => setShowBulkEditModal(false)}
          onSuccess={() => {
            setShowBulkEditModal(false);
            setSelectedProducts([]);
          }}
        />
      )}

      {printingProduct && (
        <BarcodePrintModal 
          productSku={printingProduct.sku} 
          productName={printingProduct.name} 
          onClose={() => setPrintingProduct(null)} 
        />
      )}
    </>
  );
}
