"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Search, Plus, Trash2, CreditCard, Banknote, Building, Loader2, Truck } from "lucide-react";
import { useOrder } from "@/hooks/useOrder";
import { useBranches } from "@/hooks/useInventory";
import { useProducts } from "@/hooks/useProducts";
import Image from "next/image";

interface CartItem {
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function QuickDispatchPage() {
  const router = useRouter();
  const { searchCustomer, createQuickDispatch } = useOrder();
  const { data: branches = [], isLoading: branchesLoading } = useBranches();
  
  // Form State
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
  });
  
  const [branchId, setBranchId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingFee, setShippingFee] = useState(400);
  
  const [searchTerm, setSearchTerm] = useState("");
  const { data: productsData, isLoading: productsLoading } = useProducts(searchTerm.length > 2 ? { search: searchTerm } : undefined);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneSearch = async () => {
    if (phone.length < 9) return;
    setIsSearchingCustomer(true);
    const existing = await searchCustomer(phone);
    if (existing) {
      const address = existing.addresses?.[0] || {};
      setCustomer({
        firstName: existing.firstName || "",
        lastName: existing.lastName || "",
        email: existing.email || "",
        addressLine1: address.addressLine1 || "",
        addressLine2: address.addressLine2 || "",
        city: address.city || "",
        postalCode: address.postalCode || "",
      });
    }
    setIsSearchingCustomer(false);
  };

  const addToCart = (variant: any, productName: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.variantId === variant.id);
      if (existing) {
        return prev.map(item => item.variantId === variant.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        variantId: variant.id,
        name: `${productName} - ${variant.name || 'Default'}`,
        price: variant.salePrice || variant.price,
        quantity: 1,
        image: variant.featuredImage
      }];
    });
    setSearchTerm("");
  };

  const updateQuantity = (variantId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.variantId === variantId) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (variantId: string) => {
    setCart(prev => prev.filter(item => item.variantId !== variantId));
  };

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!phone || !customer.firstName || !customer.addressLine1 || !customer.city) {
      setError("Please fill in all required customer details (Phone, First Name, Address, City).");
      return;
    }
    if (!branchId) {
      setError("Please select a dispatching branch.");
      return;
    }
    if (cart.length === 0) {
      setError("Please add at least one item to the order.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createQuickDispatch.mutateAsync({
        customer: { phone, ...customer },
        branchId,
        items: cart.map(item => ({ variantId: item.variantId, quantity: item.quantity, price: item.price })),
        paymentMethod,
        subtotal,
        shippingFee,
        tax: 0,
        total
      });
      router.push('/admin/orders');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-8 max-w-[1280px] mx-auto w-full min-h-screen bg-stone-50/50">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="p-2 bg-white border border-stone-200 rounded-full text-stone-500 hover:text-stone-900 transition-colors shadow-sm">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="font-playfair text-2xl font-bold text-stone-900">Quick Dispatch</h1>
          <p className="font-inter text-sm text-stone-500">Manually enter a walk-in or phone order and dispatch immediately.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-inter text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer & Branch */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-inter font-bold text-lg text-stone-900 mb-4">Customer Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="font-inter text-xs font-semibold text-stone-500 uppercase">Phone Number *</label>
                <div className="flex gap-2">
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    onBlur={handlePhoneSearch}
                    placeholder="e.g. 0771234567" 
                    className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-inter outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
                  />
                  {isSearchingCustomer && <div className="flex items-center px-2 text-stone-400"><Loader2 className="animate-spin" size={18}/></div>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-inter text-xs font-semibold text-stone-500 uppercase">First Name *</label>
                <input value={customer.firstName} onChange={e => setCustomer({...customer, firstName: e.target.value})} className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-inter outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-inter text-xs font-semibold text-stone-500 uppercase">Last Name</label>
                <input value={customer.lastName} onChange={e => setCustomer({...customer, lastName: e.target.value})} className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-inter outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"/>
              </div>
              
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="font-inter text-xs font-semibold text-stone-500 uppercase">Email Address</label>
                <input type="email" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-inter outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"/>
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="font-inter text-xs font-semibold text-stone-500 uppercase">Address Line 1 *</label>
                <input value={customer.addressLine1} onChange={e => setCustomer({...customer, addressLine1: e.target.value})} className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-inter outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"/>
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="font-inter text-xs font-semibold text-stone-500 uppercase">Address Line 2</label>
                <input value={customer.addressLine2} onChange={e => setCustomer({...customer, addressLine2: e.target.value})} className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-inter outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"/>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-inter text-xs font-semibold text-stone-500 uppercase">City *</label>
                <input value={customer.city} onChange={e => setCustomer({...customer, city: e.target.value})} className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-inter outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-inter text-xs font-semibold text-stone-500 uppercase">Postal Code</label>
                <input value={customer.postalCode} onChange={e => setCustomer({...customer, postalCode: e.target.value})} className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-inter outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"/>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-inter font-bold text-lg text-stone-900 mb-4 flex items-center gap-2"><Building size={18}/> Fulfilling Branch</h2>
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-xs font-semibold text-stone-500 uppercase">Select Branch *</label>
              <select 
                value={branchId} 
                onChange={e => setBranchId(e.target.value)} 
                className="border border-stone-200 rounded-xl px-4 py-3 text-sm font-inter outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all bg-white"
                disabled={branchesLoading}
              >
                <option value="">-- Choose Branch --</option>
                {branches.map((b: any) => (
                  <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Items & Summary */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <h2 className="font-inter font-bold text-lg text-stone-900 mb-4">Order Items</h2>
            
            {/* Product Search */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={16} className="text-stone-400" />
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search products by name or SKU..." 
                className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm font-inter outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 bg-stone-50 focus:bg-white transition-all"
              />
              
              {searchTerm.length > 2 && productsData && productsData.data.length > 0 && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-stone-200 rounded-xl shadow-xl max-h-[300px] overflow-y-auto">
                  {productsData.data.map((prod: any) => (
                    <div key={prod.id} className="p-2 border-b border-stone-100 last:border-0">
                      <p className="font-inter font-semibold text-xs text-stone-900 px-2 py-1">{prod.name}</p>
                      {prod.variants.map((v: any) => (
                        <div key={v.id} className="flex items-center justify-between p-2 hover:bg-stone-50 rounded-lg group cursor-pointer" onClick={() => addToCart(v, prod.name)}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 relative rounded bg-stone-100 overflow-hidden shrink-0">
                              {v.featuredImage && <Image src={v.featuredImage} alt="" fill className="object-cover"/>}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-inter text-sm text-stone-700">{v.name || 'Default'}</span>
                              <span className="font-mono text-xs text-stone-400">{v.sku}</span>
                            </div>
                          </div>
                          <button type="button" className="text-stone-400 group-hover:text-stone-900 transition-colors p-1">
                            <Plus size={16}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Items */}
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto mb-6 min-h-[150px]">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
                  <Search size={32} className="mb-2 opacity-20"/>
                  <p className="font-inter text-sm text-stone-500">No items added.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.variantId} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
                    <div className="w-12 h-16 bg-stone-100 rounded overflow-hidden relative shrink-0">
                      {item.image && <Image src={item.image} alt="" fill className="object-cover"/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-inter font-semibold text-sm text-stone-900 truncate" title={item.name}>{item.name}</p>
                      <p className="font-inter text-xs text-stone-500">Rs. {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg p-1">
                        <button type="button" onClick={() => updateQuantity(item.variantId, -1)} className="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded transition-colors font-bold">-</button>
                        <span className="font-mono text-sm w-4 text-center">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.variantId, 1)} className="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded transition-colors font-bold">+</button>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item.variantId)} className="text-stone-400 hover:text-red-500 p-1">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="font-inter text-xs font-semibold text-stone-500 uppercase mb-2 block">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setPaymentMethod('COD')} className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all ${paymentMethod === 'COD' ? 'bg-stone-900 border-stone-900 text-white' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                  <Truck size={18}/>
                  <span className="font-inter text-[10px] font-bold">COD</span>
                </button>
                <button type="button" onClick={() => setPaymentMethod('BANK_TRANSFER')} className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all ${paymentMethod === 'BANK_TRANSFER' ? 'bg-stone-900 border-stone-900 text-white' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                  <Banknote size={18}/>
                  <span className="font-inter text-[10px] font-bold">TRANSFER</span>
                </button>
                <button type="button" onClick={() => setPaymentMethod('CARD_MANUAL')} className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all ${paymentMethod === 'CARD_MANUAL' ? 'bg-stone-900 border-stone-900 text-white' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                  <CreditCard size={18}/>
                  <span className="font-inter text-[10px] font-bold">CARD (POS)</span>
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-stone-50 rounded-xl p-4 flex flex-col gap-2 mb-6 border border-stone-200">
              <div className="flex justify-between items-center font-inter text-sm text-stone-600">
                <span>Subtotal</span>
                <span className="font-mono">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center font-inter text-sm text-stone-600">
                <span>Shipping Fee</span>
                <input 
                  type="number" 
                  value={shippingFee}
                  onChange={e => setShippingFee(Number(e.target.value) || 0)}
                  className="w-24 text-right bg-white border border-stone-200 rounded px-2 py-1 font-mono text-sm outline-none focus:border-stone-500"
                />
              </div>
              <div className="h-px w-full bg-stone-200 my-1"></div>
              <div className="flex justify-between items-center font-inter font-bold text-lg text-stone-900">
                <span>Total</span>
                <span className="font-mono">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-inter font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
              {isSubmitting ? "Creating Order..." : "Create Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
