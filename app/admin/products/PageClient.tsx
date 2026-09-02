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
import { globalDialog } from "@/store/dialog.store";

export default function ProductsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);
  const [printingProduct, setPrintingProduct] = useState<{sku: string, name: string} | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);

  const [page, setPage] = useState(1);
  const take = 12;

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: response, isLoading } = useProducts({
    skip: (page - 1) * take,
    take: take,
    search: searchQuery || undefined,
    category: categoryFilter === "All Categories" ? undefined : (categoryFilter || undefined),
    status: statusFilter === "All Status" ? undefined : (statusFilter || undefined)
  } as any);
  const products = response?.data || [];
  const meta = response?.meta || { total: 0, skip: 0, take: take };
  const totalPages = Math.ceil(meta.total / (meta.take || take)) || 1;
  const deleteProductMutation = useDeleteProduct();
  const bulkEditProductsMutation = useBulkEditProducts();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(products.map((p: Product) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (sku: string) => {
    setSelectedProducts(prev => prev.includes(sku) ? prev.filter(p => p !== sku) : [...prev, sku]);
  };

  const handleDelete = async (id: string) => {
    if (await globalDialog.confirm("Are you sure you want to archive this product?")) {
      await deleteProductMutation.mutateAsync(id);
      toast.success("Product archived successfully");
    }
  };

  const handleBulkPublish = async () => {
    if (selectedProducts.length === 0) return;
    try {
      await bulkEditProductsMutation.mutateAsync({ productIds: selectedProducts, data: { status: 'ACTIVE' } });
      toast.success(`${selectedProducts.length} products published successfully.`);
      setSelectedProducts([]);
    } catch (e) {
      toast.error('Failed to publish products');
    }
  };

  const handleBulkArchive = async () => {
    if (selectedProducts.length === 0) return;
    if (await globalDialog.confirm(`Are you sure you want to archive ${selectedProducts.length} products?`)) {
      try {
        await bulkEditProductsMutation.mutateAsync({ productIds: selectedProducts, data: { status: 'ARCHIVED' } });
        toast.success(`${selectedProducts.length} products archived successfully.`);
        setSelectedProducts([]);
      } catch (e) {
        toast.error('Failed to archive products');
      }
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
    { header: "Category", accessor: (row: any) => row.category?.name || <span className="text-stone-400">Uncategorized</span> },
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
        const totalQuantity = row.variants?.reduce((sum: number, v: any) => sum + (v.quantity || 0), 0) || 0;
        return (
          <span className={totalQuantity === 0 ? "text-red-600 font-bold" : totalQuantity <= 10 ? "text-amber-600 font-bold" : "text-stone-900"}>
            {totalQuantity}
          </span>
        );
      }
    },
    {
      header: "Status",
      accessor: (row: any) => {
        const statusStr = row.status || "ACTIVE";
        if (statusStr === "DRAFT") return <StatusBadge label="Draft" variant="warning" />;
        if (statusStr === "ARCHIVED") return <StatusBadge label="Archived" variant="neutral" />;
        const inStock = row.variants?.some((v: any) => v.stockStatus === 'instock' && v.quantity > 0) ?? false;
        return <StatusBadge label={inStock ? "In Stock" : "Out of Stock"} variant={inStock ? "success" : "error"} />;
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
      <select 
        value={categoryFilter}
        onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
        className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-accent/50"
      >
        <option value="">All Categories</option>
        {/* In reality, you'd map from useCategories here, but hardcoding for now as it was before */}
        <option value="T-Shirts">T-Shirts</option>
        <option value="Shirts">Shirts</option>
        <option value="Dresses">Dresses</option>
        <option value="Pants">Pants</option>
      </select>
      <select 
        value={statusFilter}
        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-accent/50"
      >
        <option value="">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="LOW_STOCK">Low Stock</option>
        <option value="OUT_OF_STOCK">Out of Stock</option>
        <option value="DRAFT">Draft</option>
        <option value="ARCHIVED">Archived</option>
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
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
        />

        <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden mt-6">
          <DataTable
            data={products}
            columns={columns}
            keyExtractor={(row) => row.id}
            pagination={{ 
              currentPage: page, 
              totalPages: totalPages,
              onPageChange: (newPage) => setPage(newPage)
            }}
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
            <button onClick={handleBulkPublish} disabled={bulkEditProductsMutation.isPending} className="font-inter font-semibold text-sm bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-500 transition-colors flex items-center gap-2 disabled:opacity-50">
              <CheckCircle2 size={14} /> Publish
            </button>
            <button onClick={handleBulkArchive} disabled={bulkEditProductsMutation.isPending} className="font-inter font-semibold text-sm bg-stone-800 text-white px-4 py-2 rounded-full hover:bg-stone-700 transition-colors flex items-center gap-2 disabled:opacity-50">
              <ArchiveRestore size={14} /> Archive
            </button>
          </div>
        </div>
      )}

      {showBulkEditModal && (
        <BulkEditModal 
          selectedProducts={products.filter((p: Product) => selectedProducts.includes(p.id)).map((p: Product) => ({ id: p.id, sku: (p as any).sku || p.id, name: p.name }))}
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
