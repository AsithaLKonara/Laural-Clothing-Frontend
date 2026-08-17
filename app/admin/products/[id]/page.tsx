"use client";

import { use, useState, useEffect } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/Badges";
import BarcodePrintModal from "@/components/admin/BarcodePrintModal";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Image as ImageIcon, Box, Tag, Layers, Barcode, Trash2, PlusCircle, Save } from "lucide-react";
import { useProduct, useUpdateProduct } from "@/hooks/useProducts";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const { data: product, isLoading } = useProduct(id);
  const updateProductMutation = useUpdateProduct();

  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: 0
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: (product.price / 100).toString(),
        quantity: product.quantity || 0,
      });
      if (product.featuredImage) {
        setProductImages([product.featuredImage, ...(product.gallery || [])]);
      }
    }
  }, [product]);

  const addImage = (url: string) => {
    setProductImages(prev => [...prev, url]);
    setShowMediaPicker(false);
  };

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await updateProductMutation.mutateAsync({
        id,
        data: {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price || "0") * 100,
          quantity: formData.quantity,
          featuredImage: productImages[0] || null,
          gallery: productImages.slice(1),
        }
      });
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product.");
    }
  };

  if (isLoading) {
    return <div className="p-10 max-w-[1280px] mx-auto w-full font-inter text-stone-500">Loading product...</div>;
  }

  if (!product) {
    return <div className="p-10 max-w-[1280px] mx-auto w-full font-inter text-red-500">Product not found.</div>;
  }

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full gap-6">
      
      {/* Back Link */}
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors w-fit">
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <PageHeader 
        title={`${formData.name} (${id})`}
        action={
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              disabled={updateProductMutation.isPending}
              className="px-4 py-2 bg-stone-900 text-white font-inter font-semibold text-sm rounded shadow-sm hover:bg-stone-800 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save size={16} /> {updateProductMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
            <button 
              onClick={() => setShowBarcodeModal(true)}
              className="px-3 py-1.5 bg-white border border-stone-200 text-stone-700 font-inter font-medium text-xs rounded shadow-sm hover:bg-stone-50 flex items-center gap-2 transition-colors"
            >
              <Barcode size={14} /> Print Barcode
            </button>
            <StatusBadge label={product.stockStatus} variant={product.stockStatus === "instock" ? "success" : "warning"} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Main Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-stone-900 font-bold text-lg font-inter flex items-center gap-2">
              <Tag size={18} className="text-stone-400" /> Basic Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 col-span-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Product Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-400" 
                />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Description</label>
                <textarea 
                  rows={4} 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-400 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-stone-900 font-bold text-lg font-inter flex items-center gap-2">
              <ImageIcon size={18} className="text-stone-400" /> Media
            </h3>
            <div className="flex flex-wrap gap-3">
              {productImages.map((img, idx) => (
                <div key={idx} className="relative group w-24 h-24 bg-stone-100 border border-stone-200 rounded-lg overflow-hidden">
                  <Image src={img} alt={`Product image ${idx + 1}`} fill className="object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-stone-900 text-white text-[8px] font-bold px-1 py-0.5 rounded uppercase">Main</span>
                  )}
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setShowMediaPicker(true)}
                className="w-24 h-24 border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center gap-1 text-stone-400 hover:border-stone-500 hover:text-stone-600 hover:bg-stone-50 transition-all cursor-pointer"
              >
                <PlusCircle size={18} />
                <span className="font-inter text-[10px] font-semibold text-center">Add from Library</span>
              </button>
            </div>
          </div>
          
          {/* Note about variants since we are using flat model currently */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col gap-2">
            <h3 className="text-stone-900 font-bold text-sm font-inter">Advanced Variants</h3>
            <p className="text-sm text-stone-500 font-inter">
              Currently using basic product model. Advanced variants (Size/Color) tracking are mocked in this view.
            </p>
          </div>

        </div>

        {/* Right Col: Pricing & Organization */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-stone-900 font-bold text-lg font-inter">Pricing & Inventory</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">Rs.</span>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-stone-400" 
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Total Quantity</label>
                <input 
                  type="number" 
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-400" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-stone-900 font-bold text-lg font-inter">Organization</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Category ID</label>
                <input 
                  type="text" 
                  value={product.categoryId || "Uncategorized"}
                  disabled
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none bg-stone-50 text-stone-500" 
                />
              </div>
            </div>
          </div>

        </div>

      </div>

      {showBarcodeModal && (
        <BarcodePrintModal 
          productSku={product.sku || product.id} 
          productName={product.name} 
          onClose={() => setShowBarcodeModal(false)} 
        />
      )}

      {showMediaPicker && (
        <MediaPickerModal
          title="Add Product Image"
          onClose={() => setShowMediaPicker(false)}
          onSelect={(url) => addImage(url)}
        />
      )}

    </div>
  );
}
