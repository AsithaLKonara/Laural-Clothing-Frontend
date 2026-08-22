"use client";

import { Plus, Edit2, Trash2, MapPin } from "lucide-react";
import { useState } from "react";

const DUMMY_ADDRESSES = [
  {
    id: "1",
    isDefaultShipping: true,
    isDefaultBilling: true,
    firstName: "Kasun",
    lastName: "Perera",
    company: "",
    address1: "No 45, Galle Road",
    address2: "Colombo 03",
    city: "Colombo",
    postalCode: "00300",
    phone: "+94 77 123 4567"
  },
  {
    id: "2",
    isDefaultShipping: false,
    isDefaultBilling: false,
    firstName: "Kasun",
    lastName: "Perera",
    company: "Tech Solutions",
    address1: "Level 4, Access Tower",
    address2: "Union Place",
    city: "Colombo",
    postalCode: "00200",
    phone: "+94 77 123 4567"
  }
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(DUMMY_ADDRESSES);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-inria text-3xl text-stone-900 mb-1">Addresses</h1>
          <p className="font-inter text-sm text-stone-500">Manage your shipping and billing addresses.</p>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-stone-50 font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors"
        >
          <Plus size={16} /> Add New Address
        </button>
      </div>

      {isAdding && (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
          <h3 className="font-inria text-xl text-stone-900 mb-4">Add New Address</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-inter font-medium text-xs text-stone-600">First Name</label>
              <input type="text" className="w-full h-10 px-3 bg-white border border-stone-300 rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-inter font-medium text-xs text-stone-600">Last Name</label>
              <input type="text" className="w-full h-10 px-3 bg-white border border-stone-300 rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter" />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="font-inter font-medium text-xs text-stone-600">Address Line 1</label>
              <input type="text" className="w-full h-10 px-3 bg-white border border-stone-300 rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter" />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="font-inter font-medium text-xs text-stone-600">Address Line 2 (Optional)</label>
              <input type="text" className="w-full h-10 px-3 bg-white border border-stone-300 rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-inter font-medium text-xs text-stone-600">City</label>
              <input type="text" className="w-full h-10 px-3 bg-white border border-stone-300 rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-inter font-medium text-xs text-stone-600">Postal Code</label>
              <input type="text" className="w-full h-10 px-3 bg-white border border-stone-300 rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-inter font-medium text-xs text-stone-600">Phone Number</label>
              <input type="tel" className="w-full h-10 px-3 bg-white border border-stone-300 rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter" />
            </div>

            <div className="flex flex-col gap-3 md:col-span-2 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-stone-900 cursor-pointer" />
                <span className="font-inter text-sm text-stone-700">Set as default shipping address</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-stone-900 cursor-pointer" />
                <span className="font-inter text-sm text-stone-700">Set as default billing address</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 md:col-span-2 mt-4 pt-4 border-t border-stone-200">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 font-inter font-medium text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                className="px-6 py-2 bg-stone-900 text-stone-50 font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address.id} className="flex flex-col border border-stone-200 rounded-xl overflow-hidden hover:border-stone-300 transition-colors">
            
            {(address.isDefaultShipping || address.isDefaultBilling) && (
              <div className="flex gap-2 px-5 py-3 bg-stone-50 border-b border-stone-200">
                {address.isDefaultShipping && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Default Shipping
                  </span>
                )}
                {address.isDefaultBilling && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Default Billing
                  </span>
                )}
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="text-stone-400" size={18} />
                  <h3 className="font-inter font-semibold text-stone-900">
                    {address.firstName} {address.lastName}
                  </h3>
                </div>
                
                <div className="flex flex-col gap-1 font-inter text-sm text-stone-600 ml-7">
                  {address.company && <p>{address.company}</p>}
                  <p>{address.address1}</p>
                  {address.address2 && <p>{address.address2}</p>}
                  <p>{address.city}, {address.postalCode}</p>
                  <p className="mt-2 text-stone-900">{address.phone}</p>
                </div>
              </div>

              <div className="flex gap-4 mt-6 pt-4 border-t border-stone-100 ml-7">
                <button className="flex items-center gap-1.5 font-inter font-medium text-sm text-stone-600 hover:text-stone-900 transition-colors">
                  <Edit2 size={14} /> Edit
                </button>
                <button className="flex items-center gap-1.5 font-inter font-medium text-sm text-red-500 hover:text-red-700 transition-colors">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
