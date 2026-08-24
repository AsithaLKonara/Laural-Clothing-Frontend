"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import { BarChart3, TrendingUp, Users, ShoppingBag, Box, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
  const reportCards = [
    { title: "Sales & Revenue", description: "Comprehensive breakdown of online and POS sales, AOV, and revenue trends.", icon: TrendingUp, href: "/admin/reports/sales" },
    { title: "Payments", description: "Payment gateway performance, success rates, and fee analysis.", icon: CreditCard, href: "/admin/reports/payments" },
    { title: "Inventory", description: "Stock health, valuation, low stock alerts, and transfer logs.", icon: Box, href: "/admin/reports/inventory" },
    { title: "Branches", description: "Performance comparison across physical locations and POS terminals.", icon: MapPin, href: "/admin/reports/branches" },
    { title: "POS", description: "Cashier shifts, cash management, and POS-specific transaction reports.", icon: ShoppingBag, href: null },
    { title: "Customers", description: "New vs returning customers, demographics, and lifetime value.", icon: Users, href: null },
    { title: "Loyalty", description: "Points issued, redeemed, outstanding liabilities, and campaign ROI.", icon: BarChart3, href: null },
  ] as const;

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full">
      <PageHeader 
        title="Reports & Analytics" 
        description="Access comprehensive data reports across all business domains."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {reportCards.map((report, idx) => {
          const content = (
            <div className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer group h-full flex flex-col">
              <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors text-stone-600">
                <report.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold font-poppins text-stone-900 mb-2">{report.title}</h3>
              <p className="text-sm font-inter text-stone-500 flex-1">{report.description}</p>
              <div className="mt-4 pt-4 border-t border-stone-100 text-sm font-medium font-inter text-primary flex items-center gap-2">
                View Reports &rarr;
              </div>
            </div>
          );

          return report.href ? (
            <Link href={report.href} key={idx}>
              {content}
            </Link>
          ) : (
            <div key={idx} className="opacity-50 cursor-not-allowed">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
