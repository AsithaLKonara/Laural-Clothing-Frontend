"use client";

import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/Badges";
import ProductFormModal from "@/components/dashboard/ProductFormModal";
import BarcodePrintModal from "@/components/admin/BarcodePrintModal";
import BulkEditModal from "@/components/admin/BulkEditModal";
import Link from "next/link";
import { Barcode, Edit, ArchiveRestore, CheckCircle2 } from "lucide-react";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { Product } from "@/types/product";

export default function ProductsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);
  const [printingProduct, setPrintingProduct] = useState<{sku: string, name: string} | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);

  const { data: response, isLoading } = useProducts();
  const products = response?.data || [];
  const deleteProductMutation = useDeleteProduct();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (sku: string) => {
    setSelectedProducts(prev => prev.includes(sku) ? prev.filter(p => p !== sku) : [...prev, sku]);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to archive/delete this product?")) {
      await deleteProductMutation.mutateAsync(id);
    }
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setProductToEdit(undefined);
    setModalOpen(true);
  };

  const columns = [
    {
      header: <input type="checkbox" checked={selectedProducts.length === products.length && products.length > 0} onChange={handleSelectAll} className="rounded text-stone-900 focus:ring-stone-900 border-stone-300" />,
      accessor: (row: any) => <input type="checkbox" checked={selectedProducts.includes(row.id)} onChange={() => handleSelectOne(row.id)} onClick={e => e.stopPropagation()} className="rounded text-stone-900 focus:ring-stone-900 border-stone-300" />
    },
    { 
      header: "SKU", 
      accessor: (row: any) => row.sku || 'N/A', 
      className: "font-mono text-stone-500 text-xs" 
    },
    {
      header: "Product",
      accessor: (row: any) => (
        <button onClick={() => handleEdit(row)} className="font-semibold text-stone-900 hover:text-accent transition-colors text-left">
          {row.name}
        </button>
      ),
    },
    { header: "Category", accessor: "categoryId" as const },
    { 
      header: "Price", 
      accessor: (row: any) => {
        const price = row.variants?.[0]?.price || 0;
        return `Rs ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      },
      className: "font-semibold text-stone-800" 
    },
    { 
      header: "Stock", 
      accessor: (row: any) => {
        const inStock = row.variants?.some((v: any) => v.stockStatus === 'instock') ?? true;
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            inStock ? "bg-success-soft text-success border border-success/20" : "bg-error/10 text-error border border-error/20"
          }`}>
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        );
      }
    },
    {
      header: "Status",
      accessor: (row: any) => {
        let variant: "success" | "warning" | "error" | "neutral" = "success";
        if (row.stockStatus === "outofstock") variant = "error";
        else if (row.stockStatus === "lowstock") variant = "warning";
        else variant = "success";
        return <StatusBadge label={row.stockStatus} variant={variant} />;
      },
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <div className="flex gap-2 text-xs items-center">
          <button onClick={() => handleEdit(row)} className="text-blue-600 hover:underline font-medium">Edit</button>
          <span className="text-stone-300">·</span>
          <button onClick={() => handleDelete(row.id)} disabled={deleteProductMutation.isPending} className="text-red-500 hover:underline font-medium disabled:opacity-50">Archive</button>
          <span className="text-stone-300">·</span>
          <button onClick={() => setPrintingProduct({ sku: row.sku || row.id, name: row.name })} className="text-stone-500 hover:text-stone-900 transition-colors tooltip" title="Print Barcode">
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
        onClick={handleAdd}
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
            keyExtractor={(row) => row.id}
            pagination={{ currentPage: 1, totalPages: 8 }}
          />
        </div>
      </div>

      <ProductFormModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        productToEdit={productToEdit}
      />
      
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
          selectedProducts={products.filter(p => selectedProducts.includes(p.id)).map(p => ({ sku: (p as any).sku || p.id, name: p.name }))}
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
