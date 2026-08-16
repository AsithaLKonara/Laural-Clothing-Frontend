"use client";

import { use, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/Badges";
import BarcodePrintModal from "@/components/admin/BarcodePrintModal";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Image as ImageIcon, Box, Tag, Layers, Barcode, Trash2, PlusCircle } from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [productImages, setProductImages] = useState<string[]>(['/products/default.jpg']);

  const addImage = (url: string) => {
    setProductImages(prev => [...prev, url]);
    setShowMediaPicker(false);
  };

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full gap-6">
      
      {/* Back Link */}
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors w-fit">
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <PageHeader 
        title={`Black Oversized T-Shirt (${id})`}
        action={
          <div className="flex gap-2">
            <button 
              onClick={() => setShowBarcodeModal(true)}
              className="px-3 py-1.5 bg-white border border-stone-200 text-stone-700 font-inter font-medium text-xs rounded shadow-sm hover:bg-stone-50 flex items-center gap-2 transition-colors"
            >
              <Barcode size={14} /> Print Barcode
            </button>
            <StatusBadge label="Active" variant="success" />
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
                <input type="text" defaultValue="Black Oversized T-Shirt" className="border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-400" />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Description</label>
                <textarea rows={4} defaultValue="Premium heavy-weight cotton oversized t-shirt." className="border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-400 resize-none"></textarea>
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

          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-stone-900 font-bold text-lg font-inter flex items-center gap-2">
              <Layers size={18} className="text-stone-400" /> Variants (Size & Color)
            </h3>
            
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="pb-2 font-inter text-xs font-semibold text-stone-500">Variant</th>
                  <th className="pb-2 font-inter text-xs font-semibold text-stone-500">Price</th>
                  <th className="pb-2 font-inter text-xs font-semibold text-stone-500">SKU</th>
                  <th className="pb-2 font-inter text-xs font-semibold text-stone-500">Stock</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone-100">
                  <td className="py-3 font-inter text-sm font-medium">S / Black</td>
                  <td className="py-3 font-inter text-sm">Rs. 2,500</td>
                  <td className="py-3 font-inter text-sm text-stone-500 font-mono">LC-TSH-001-S</td>
                  <td className="py-3 font-inter text-sm">45</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 font-inter text-sm font-medium">M / Black</td>
                  <td className="py-3 font-inter text-sm">Rs. 2,500</td>
                  <td className="py-3 font-inter text-sm text-stone-500 font-mono">LC-TSH-001-M</td>
                  <td className="py-3 font-inter text-sm">12</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Col: Pricing & Organization */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-stone-900 font-bold text-lg font-inter">Pricing</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">Rs.</span>
                  <input type="text" defaultValue="2,500" className="w-full border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-stone-400" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Compare at price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">Rs.</span>
                  <input type="text" placeholder="0.00" className="w-full border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-stone-400" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Cost per item</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">Rs.</span>
                  <input type="text" defaultValue="1,200" className="w-full border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-stone-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-stone-900 font-bold text-lg font-inter">Organization</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Category</label>
                <select className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-400 bg-white">
                  <option>T-Shirts</option>
                  <option>Shirts</option>
                  <option>Dresses</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs font-semibold text-stone-700">Collections</label>
                <select multiple defaultValue={["Summer 2026", "Best Sellers"]} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-400 min-h-[100px] bg-white">
                  <option value="Summer 2026">Summer 2026</option>
                  <option value="Best Sellers">Best Sellers</option>
                  <option value="New Arrivals">New Arrivals</option>
                  <option value="Clearance Sale">Clearance Sale</option>
                </select>
                <p className="text-xs text-stone-500 font-inter mt-1">Hold CMD/CTRL to select multiple collections.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {showBarcodeModal && (
        <BarcodePrintModal 
          productSku={id} 
          productName="Black Oversized T-Shirt" 
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
