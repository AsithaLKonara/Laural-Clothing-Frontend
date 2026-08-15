"use client";

import PageHeader from "@/components/dashboard/PageHeader";

export default function SettingsPage() {
  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full">
      <PageHeader 
        title="Global Settings" 
        description="Manage store configurations, regional settings, and integrations."
      />

      <div className="mt-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0 flex flex-col space-y-1">
          <button className="text-left px-4 py-2 text-sm font-medium rounded-lg bg-stone-100 text-stone-900 transition-colors">General Information</button>
          <button className="text-left px-4 py-2 text-sm font-medium rounded-lg text-stone-600 hover:bg-stone-50 transition-colors">Currency & Tax</button>
          <button className="text-left px-4 py-2 text-sm font-medium rounded-lg text-stone-600 hover:bg-stone-50 transition-colors">Shipping Settings</button>
          <button className="text-left px-4 py-2 text-sm font-medium rounded-lg text-stone-600 hover:bg-stone-50 transition-colors">Payment Gateways</button>
          <button className="text-left px-4 py-2 text-sm font-medium rounded-lg text-stone-600 hover:bg-stone-50 transition-colors">Notifications</button>
        </div>

        <div className="flex-1 bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
          <h3 className="text-lg font-semibold font-poppins text-stone-900 mb-6">General Information</h3>
          
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Store Name</label>
              <input type="text" defaultValue="Laural Clothing" className="w-full h-10 px-3 border border-stone-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-inter" />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Support Email</label>
              <input type="email" defaultValue="support@laural.com" className="w-full h-10 px-3 border border-stone-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-inter" />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Support Phone</label>
              <input type="text" defaultValue="+94 77 123 4567" className="w-full h-10 px-3 border border-stone-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-inter" />
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button className="px-6 py-2 bg-primary hover:bg-stone-800 transition-colors text-white text-sm font-medium rounded-md shadow-sm">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
