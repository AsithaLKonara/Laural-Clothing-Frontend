"use client";

import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full">
      <PageHeader 
        title="Global Settings" 
        description="Manage store configurations, regional settings, and integrations."
      />

      <div className="mt-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0 flex flex-col space-y-1">
          <button 
            onClick={() => setActiveTab("general")}
            className={`text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "general" ? "bg-stone-100 text-stone-900" : "text-stone-600 hover:bg-stone-50"}`}
          >
            General Information
          </button>
          <button 
            onClick={() => setActiveTab("currency")}
            className={`text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "currency" ? "bg-stone-100 text-stone-900" : "text-stone-600 hover:bg-stone-50"}`}
          >
            Currency & Tax
          </button>
          <button 
            onClick={() => setActiveTab("shipping")}
            className={`text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "shipping" ? "bg-stone-100 text-stone-900" : "text-stone-600 hover:bg-stone-50"}`}
          >
            Shipping Settings
          </button>
          <button 
            onClick={() => setActiveTab("payment")}
            className={`text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "payment" ? "bg-stone-100 text-stone-900" : "text-stone-600 hover:bg-stone-50"}`}
          >
            Payment Gateways
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "notifications" ? "bg-stone-100 text-stone-900" : "text-stone-600 hover:bg-stone-50"}`}
          >
            Notifications
          </button>
        </div>

        <div className="flex-1 bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
          {activeTab === "general" && (
            <>
              <h3 className="text-lg font-semibold font-poppins text-stone-900 mb-6">General Information</h3>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Store Name</label>
                  <input type="text" defaultValue="Laural Clothing" className="w-full h-10 px-3 border border-stone-300 rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Support Email</label>
                  <input type="email" defaultValue="support@laural.com" className="w-full h-10 px-3 border border-stone-300 rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Support Phone</label>
                  <input type="text" defaultValue="+94 77 123 4567" className="w-full h-10 px-3 border border-stone-300 rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter" />
                </div>
                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button className="px-6 py-2 bg-stone-900 hover:bg-stone-800 transition-colors text-white text-sm font-medium rounded-md shadow-sm">
                    Save Changes
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "currency" && (
            <>
              <h3 className="text-lg font-semibold font-poppins text-stone-900 mb-6">Currency & Tax</h3>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Default Currency</label>
                  <select className="w-full h-10 px-3 border border-stone-300 rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter bg-white">
                    <option value="LKR">Sri Lankan Rupee (LKR)</option>
                    <option value="USD">US Dollar (USD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Tax Rate (%)</label>
                  <input type="number" defaultValue="15" className="w-full h-10 px-3 border border-stone-300 rounded-md outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-inter" />
                </div>
                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button className="px-6 py-2 bg-stone-900 hover:bg-stone-800 transition-colors text-white text-sm font-medium rounded-md shadow-sm">
                    Save Settings
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "shipping" && (
            <>
              <h3 className="text-lg font-semibold font-poppins text-stone-900 mb-6">Shipping Settings</h3>
              <div className="space-y-6 max-w-2xl">
                <p className="text-sm text-stone-500 font-inter">Configure default shipping rates and zones here.</p>
                {/* Placeholders for future forms */}
                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button className="px-6 py-2 bg-stone-900 hover:bg-stone-800 transition-colors text-white text-sm font-medium rounded-md shadow-sm">
                    Save
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "payment" && (
            <>
              <h3 className="text-lg font-semibold font-poppins text-stone-900 mb-6">Payment Gateways</h3>
              <div className="space-y-6 max-w-2xl">
                <p className="text-sm text-stone-500 font-inter">Manage Koko, Payzy, Mintpay, and direct card integrations.</p>
                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button className="px-6 py-2 bg-stone-900 hover:bg-stone-800 transition-colors text-white text-sm font-medium rounded-md shadow-sm">
                    Save
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <h3 className="text-lg font-semibold font-poppins text-stone-900 mb-6">Notification Preferences</h3>
              <div className="space-y-6 max-w-2xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-stone-900" />
                  <span className="text-sm font-inter text-stone-700">Email alerts for new orders</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-stone-900" />
                  <span className="text-sm font-inter text-stone-700">Email alerts for low stock</span>
                </label>
                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button className="px-6 py-2 bg-stone-900 hover:bg-stone-800 transition-colors text-white text-sm font-medium rounded-md shadow-sm">
                    Save Preferences
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
