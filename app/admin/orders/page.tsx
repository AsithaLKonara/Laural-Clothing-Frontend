"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import DataTable from "@/components/dashboard/DataTable";
import { OrderStatusBadge, BranchBadge, PaymentGatewayBadge } from "@/components/dashboard/Badges";

export default function OrdersPage() {
  const router = useRouter();

  const orders = [
    { id: "LC-10241", customer: "Kasun Perera", branch: "Kandy", total: "Rs.8,500", gateway: "Koko", status: "Paid", orderStatus: "Paid" },
    { id: "LC-10240", customer: "Nethmi", branch: "Colombo", total: "Rs.5,200", gateway: "Mintpay", status: "Paid", orderStatus: "Paid" },
    { id: "LC-10239", customer: "Guest", branch: "Kandy", total: "Rs.3,900", gateway: "COD", status: "pending", orderStatus: "Pending" },
    { id: "LC-10238", customer: "Dilshan", branch: "Gampaha", total: "Rs.7,800", gateway: "OnePay", status: "Paid", orderStatus: "Paid" },
    { id: "LC-10237", customer: "Anu", branch: "Colombo", total: "Rs.9,200", gateway: "Payzy", status: "failed", orderStatus: "Failed" },
  ];

  const columns = [
    { header: "Order", accessor: "id" as const },
    { header: "Customer", accessor: "customer" as const },
    { 
      header: "Branch", 
      accessor: (row: any) => <BranchBadge branch={row.branch} /> 
    },
    { header: "Total", accessor: "total" as const },
    { 
      header: "Payment", 
      accessor: (row: any) => <PaymentGatewayBadge gateway={row.gateway} status={row.status.toLowerCase()} /> 
    },
    { 
      header: "Status", 
      accessor: (row: any) => <OrderStatusBadge status={row.orderStatus} /> 
    },
  ];

  const filters = (
    <>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
        <option>All Statuses</option>
        <option>Paid</option>
        <option>Pending</option>
        <option>Failed</option>
      </select>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
        <option>All Branches</option>
        <option>Online</option>
        <option>Colombo</option>
        <option>Kandy</option>
      </select>
      <select className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm font-inter text-stone-700 outline-none focus:ring-1 focus:ring-stone-400">
        <option>All Gateways</option>
        <option>Koko</option>
        <option>Mintpay</option>
        <option>OnePay</option>
        <option>Payzy</option>
        <option>COD</option>
      </select>
    </>
  );

  return (
    <div className="flex flex-col p-4 md:p-10 max-w-[1280px] mx-auto w-full">
      <PageHeader 
        title="Orders" 
        description="Manage and track all customer orders across channels."
      />

      <FilterBar 
        placeholder="Search order, phone, customer, tracking..." 
        filters={filters} 
      />

      <DataTable 
        data={orders}
        columns={columns}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => router.push(`/admin/orders/${row.id}`)}
        pagination={{ currentPage: 1, totalPages: 12 }}
      />
    </div>
  );
}
