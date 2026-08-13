"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import { BarChart3, TrendingUp, Users, ShoppingBag, Box, MapPin, CreditCard } from "lucide-react";

export default function ReportsPage() {
  const reportCards = [
    { title: "Sales & Revenue", description: "Comprehensive breakdown of online and POS sales, AOV, and revenue trends.", icon: TrendingUp },
    { title: "Payments", description: "Payment gateway performance, success rates, and fee analysis.", icon: CreditCard },
    { title: "Inventory", description: "Stock health, valuation, low stock alerts, and transfer logs.", icon: Box },
    { title: "Branches", description: "Performance comparison across physical locations and POS terminals.", icon: MapPin },
    { title: "POS", description: "Cashier shifts, cash management, and POS-specific transaction reports.", icon: ShoppingBag },
    { title: "Customers", description: "New vs returning customers, demographics, and lifetime value.", icon: Users },
    { title: "Loyalty", description: "Points issued, redeemed, outstanding liabilities, and campaign ROI.", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col p-10 max-w-[1280px] mx-auto w-full">
      <PageHeader 
        title="Reports & Analytics" 
        description="Access comprehensive data reports across all business domains."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {reportCards.map((report, idx) => (
          <div key={idx} className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors text-stone-600">
              <report.icon size={24} />
            </div>
            <h3 className="text-lg font-semibold font-poppins text-stone-900 mb-2">{report.title}</h3>
            <p className="text-sm font-inter text-stone-500">{report.description}</p>
            <div className="mt-4 pt-4 border-t border-stone-100 text-sm font-medium font-inter text-primary flex items-center gap-2">
              View Reports &rarr;
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
