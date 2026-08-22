"use client";

import { Plus, Edit2, Trash2, MapPin } from "lucide-react";
import { useState } from "react";
import { useAddresses, useAddAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from "@/hooks/useAddress";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddressInput } from "@/services/address.service";

const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  isDefault: z.boolean(),
  type: z.enum(["SHIPPING", "BILLING"]),
});

export default function AddressesPage() {
  const { data: addresses = [], isLoading } = useAddresses();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: "SHIPPING",
      isDefault: false
    }
  });

  const openAddForm = () => {
    reset({ type: "SHIPPING", isDefault: false });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (address: any) => {
    reset({
      firstName: address.firstName,
      lastName: address.lastName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      postalCode: address.postalCode || "",
      phone: address.phone,
      isDefault: address.isDefault,
      type: address.type as "SHIPPING" | "BILLING",
    });
    setEditingId(address.id);
    setIsFormOpen(true);
  };

  const onSubmit = (data: z.infer<typeof addressSchema>) => {
    const payload = {
      ...data,
      addressLine2: data.addressLine2 || null,
      postalCode: data.postalCode || null,
    };

    if (editingId) {
      updateAddress.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          setIsFormOpen(false);
          setEditingId(null);
        }
      });
    } else {
      addAddress.mutate(payload, {
        onSuccess: () => {
          setIsFormOpen(false);
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-inria text-3xl text-stone-900 mb-1">Addresses</h1>
          <p className="font-inter text-sm text-stone-500">Manage your shipping and billing addresses.</p>
        </div>
        
        {!isFormOpen && (
          <button 
            onClick={openAddForm}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-stone-50 font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors"
          >
            <Plus size={16} /> Add New Address
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
          <h3 className="font-inria text-xl text-stone-900 mb-4">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="font-inter font-medium text-xs text-stone-600">Address Type</label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2">
                  <input type="radio" value="SHIPPING" {...register("type")} className="accent-stone-900" />
                  <span className="text-sm font-inter">Shipping</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" value="BILLING" {...register("type")} className="accent-stone-900" />
                  <span className="text-sm font-inter">Billing</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-inter font-medium text-xs text-stone-600">First Name</label>
              <input type="text" {...register("firstName")} className={`w-full h-10 px-3 bg-white border ${errors.firstName ? 'border-red-500' : 'border-stone-300'} rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter`} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-inter font-medium text-xs text-stone-600">Last Name</label>
              <input type="text" {...register("lastName")} className={`w-full h-10 px-3 bg-white border ${errors.lastName ? 'border-red-500' : 'border-stone-300'} rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter`} />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="font-inter font-medium text-xs text-stone-600">Address Line 1</label>
              <input type="text" {...register("addressLine1")} className={`w-full h-10 px-3 bg-white border ${errors.addressLine1 ? 'border-red-500' : 'border-stone-300'} rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter`} />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="font-inter font-medium text-xs text-stone-600">Address Line 2 (Optional)</label>
              <input type="text" {...register("addressLine2")} className="w-full h-10 px-3 bg-white border border-stone-300 rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-inter font-medium text-xs text-stone-600">City</label>
              <input type="text" {...register("city")} className={`w-full h-10 px-3 bg-white border ${errors.city ? 'border-red-500' : 'border-stone-300'} rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter`} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-inter font-medium text-xs text-stone-600">Postal Code</label>
              <input type="text" {...register("postalCode")} className="w-full h-10 px-3 bg-white border border-stone-300 rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-inter font-medium text-xs text-stone-600">Phone Number</label>
              <input type="tel" {...register("phone")} className={`w-full h-10 px-3 bg-white border ${errors.phone ? 'border-red-500' : 'border-stone-300'} rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter`} />
            </div>

            <div className="flex flex-col gap-3 md:col-span-2 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("isDefault")} className="w-4 h-4 accent-stone-900 cursor-pointer" />
                <span className="font-inter text-sm text-stone-700">Set as default address for this type</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 md:col-span-2 mt-4 pt-4 border-t border-stone-200">
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 font-inter font-medium text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={addAddress.isPending || updateAddress.isPending}
                className="px-6 py-2 bg-stone-900 text-stone-50 font-inter font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50"
              >
                {editingId ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-stone-500 font-poppins">
          Loading addresses...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="flex flex-col border border-stone-200 rounded-xl overflow-hidden hover:border-stone-300 transition-colors bg-white">
              
              <div className="flex gap-2 px-5 py-3 bg-stone-50 border-b border-stone-200 justify-between items-center">
                <div className="flex gap-2 items-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${address.type === 'SHIPPING' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                    {address.type}
                  </span>
                  {address.isDefault && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-200 text-stone-800">
                      Default
                    </span>
                  )}
                </div>
                {!address.isDefault && (
                  <button 
                    onClick={() => setDefaultAddress.mutate({ id: address.id, type: address.type })}
                    disabled={setDefaultAddress.isPending}
                    className="text-xs font-inter text-stone-500 hover:text-stone-900 underline underline-offset-2"
                  >
                    Set as default
                  </button>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="text-stone-400" size={18} />
                    <h3 className="font-inter font-semibold text-stone-900">
                      {address.firstName} {address.lastName}
                    </h3>
                  </div>
                  
                  <div className="flex flex-col gap-1 font-inter text-sm text-stone-600 ml-7">
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.city}{address.postalCode ? `, ${address.postalCode}` : ''}</p>
                    <p className="mt-2 text-stone-900 font-medium">{address.phone}</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-6 pt-4 border-t border-stone-100 ml-7">
                  <button 
                    onClick={() => openEditForm(address)}
                    className="flex items-center gap-1.5 font-inter font-medium text-sm text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this address?')) {
                        deleteAddress.mutate(address.id);
                      }
                    }}
                    className="flex items-center gap-1.5 font-inter font-medium text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {addresses.length === 0 && !isFormOpen && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-stone-50 rounded-xl border border-dashed border-stone-300">
              <MapPin className="text-stone-300 mb-4" size={32} />
              <h3 className="font-inria text-xl text-stone-900 mb-2">No addresses found</h3>
              <p className="text-sm font-inter text-stone-500 text-center max-w-sm mb-6">
                You haven't saved any addresses yet. Add one to speed up checkout.
              </p>
              <button 
                onClick={openAddForm}
                className="px-6 py-2.5 bg-white border border-stone-300 rounded-lg text-sm font-medium hover:bg-stone-50"
              >
                Add Address
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
