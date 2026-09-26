"use client";
import AdminStatCards from "@/components/admin/AdminStatCards";

import { useState, useRef } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import DataTable from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/Badges";
import ProductFormModal from "@/components/dashboard/ProductFormModal";
import BulkEditModal from "@/components/admin/BulkEditModal";
import Link from "next/link";
import { Barcode, Edit, ArchiveRestore, CheckCircle2, Printer, X } from "lucide-react";
import BarcodeLib from "react-barcode";
import { useReactToPrint } from "react-to-print";
import { useProducts, useDeleteProduct, useBulkEditProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import { globalDialog } from "@/store/dialog.store";
import { toast } from "@/store/toast.store";

export default function ProductsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);
  const [printingProduct, setPrintingProduct] = useState<{name: string, variants: any[]} | null>(null);
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
          <button
            onClick={() => setPrintingProduct({ name: row.name, variants: row.variants || [] })}
            className="text-stone-500 hover:text-stone-900 transition-colors"
            title="Print Variant Barcodes"
          >
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

        <div className="mb-6"><AdminStatCards metrics={[
  { title: "Total", value: meta?.total?.toString() || products.length.toString(), theme: "white-blue" },
  { title: "Active", value: products.filter((p: any) => p.status === "ACTIVE").length.toString(), theme: "white-stone" },
  { title: "Pending", value: products.filter((p: any) => p.status === "DRAFT").length.toString(), theme: "orange" }
]} /></div>
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
        <ProductVariantsBarcodeModal
          productName={printingProduct.name}
          variants={printingProduct.variants}
          onClose={() => setPrintingProduct(null)}
        />
      )}
    </>
  );
}

// ── Per-variant + Bulk Barcode Print Modal ───────────────────────────────────
function ProductVariantsBarcodeModal({
  productName,
  variants,
  onClose,
}: {
  productName: string;
  variants: any[];
  onClose: () => void;
}) {
  const bulkRef = useRef<HTMLDivElement>(null);
  const singleRef = useRef<HTMLDivElement>(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number | null>(null);

  const handleBulkPrint = useReactToPrint({
    contentRef: bulkRef,
    documentTitle: `Barcodes-${productName}`,
  });

  const handleSinglePrint = useReactToPrint({
    contentRef: singleRef,
    documentTitle: `Barcode-${selectedVariantIdx !== null ? variants[selectedVariantIdx]?.barcode : ""}`,
  });

  const variantsWithBarcodes = variants.filter((v: any) => v.barcode);
  const selectedVariant = selectedVariantIdx !== null ? variants[selectedVariantIdx] : null;

  const getDisplayCode = (barcode: string) =>
    barcode && barcode.length > 12 ? barcode.substring(0, 12) : barcode;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-stone-50 shrink-0">
          <div>
            <h2 className="font-inter font-bold text-lg text-stone-900">Variant Barcodes</h2>
            <p className="text-sm text-stone-500 font-inter mt-0.5">
              {productName} &mdash; {variantsWithBarcodes.length} variant{variantsWithBarcodes.length !== 1 ? "s" : ""} with barcodes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleBulkPrint()}
              disabled={variantsWithBarcodes.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Printer size={15} />
              Print All ({variantsWithBarcodes.length})
            </button>
            <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Variant List */}
          <div className="w-56 border-r border-stone-200 overflow-y-auto shrink-0 bg-stone-50">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider px-4 pt-4 pb-2">
              Select Variant
            </p>
            {variants.length === 0 ? (
              <p className="text-sm text-stone-400 font-inter px-4 py-6 text-center">No variants found</p>
            ) : (
              variants.map((v: any, i: number) => (
                <button
                  key={v.id || i}
                  onClick={() => setSelectedVariantIdx(i)}
                  className={`w-full text-left px-4 py-3 border-b border-stone-100 transition-colors text-sm font-inter ${
                    selectedVariantIdx === i
                      ? "bg-stone-900 text-white"
                      : "hover:bg-stone-100 text-stone-700"
                  }`}
                >
                  <p className="font-semibold text-xs mb-0.5">{v.size} / {v.color}</p>
                  <p className={`text-[10px] font-mono truncate ${selectedVariantIdx === i ? "text-stone-300" : "text-stone-400"}`}>
                    {v.barcode ? v.barcode : "No barcode"}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Preview Panel */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-stone-100 overflow-y-auto">
            {selectedVariant ? (
              <>
                {selectedVariant.barcode ? (
                  <div className="flex flex-col items-center gap-5 w-full">
                    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 flex flex-col items-center w-full max-w-xs">
                      <div ref={singleRef} className="flex flex-col items-center bg-white p-2 w-full">
                        <p className="font-sans font-bold text-sm text-center mb-1 text-stone-900">{productName}</p>
                        <p className="font-sans text-xs text-center text-stone-500 mb-2">{selectedVariant.size} / {selectedVariant.color}</p>
                        <BarcodeLib value={getDisplayCode(selectedVariant.barcode)} format="CODE128" width={2} height={60} displayValue fontSize={13} margin={5} />
                      </div>
                    </div>
                    <button onClick={() => handleSinglePrint()} className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white font-inter font-semibold text-sm rounded-lg hover:bg-stone-800 transition-colors">
                      <Printer size={15} /> Print This Barcode
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-stone-400">
                    <Barcode size={40} className="opacity-20" />
                    <p className="font-inter text-sm">No barcode on this variant</p>
                    <p className="font-inter text-xs">Edit the product to auto-generate barcodes</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 text-stone-400">
                <Barcode size={40} className="opacity-20" />
                <p className="font-inter text-sm font-medium">Select a variant</p>
                <p className="font-inter text-xs">Click a variant on the left to preview its barcode</p>
              </div>
            )}
          </div>
        </div>

        {/* Bulk print area — off-screen so it renders properly for react-to-print */}
        <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '21cm', pointerEvents: 'none' }} aria-hidden="true">
          <div ref={bulkRef} style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: 'white', fontFamily: 'sans-serif' }}>
            {variantsWithBarcodes.map((v: any, i: number) => (
              <div key={v.id || i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #e7e5e4', padding: '10px', borderRadius: '8px', background: 'white' }}>
                <p style={{ fontWeight: 700, fontSize: '10px', textAlign: 'center', color: '#1c1917', marginBottom: '2px', margin: '0 0 2px 0' }}>{productName}</p>
                <p style={{ fontSize: '9px', textAlign: 'center', color: '#78716c', marginBottom: '4px', margin: '0 0 4px 0' }}>{v.size} / {v.color}</p>
                <BarcodeLib value={getDisplayCode(v.barcode)} format="CODE128" width={1.2} height={40} displayValue fontSize={9} margin={2} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
