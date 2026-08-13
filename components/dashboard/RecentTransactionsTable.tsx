import { OrderStatusBadge, BranchBadge, PaymentGatewayBadge } from "./Badges";

export default function RecentTransactionsTable() {
  const transactions = [
    {
      id: "POS-10492",
      customer: "Madhavi",
      branch: "Kandy",
      amount: "Rs.9,400",
      paymentMethod: "Cash",
      paymentStatus: "Paid",
      orderStatus: "Completed"
    },
    {
      id: "LC-10245",
      customer: "Nimal",
      branch: "Online",
      amount: "Rs.12,500",
      paymentMethod: "Koko",
      paymentStatus: "Paid",
      orderStatus: "Processing"
    },
    {
      id: "LC-10244",
      customer: "Supun",
      branch: "Online",
      amount: "Rs.4,500",
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Pending"
    },
    {
      id: "POS-10491",
      customer: "Guest",
      branch: "Colombo",
      amount: "Rs.18,000",
      paymentMethod: "Card",
      paymentStatus: "Paid",
      orderStatus: "Completed"
    }
  ];

  return (
    <div className="w-full bg-white border border-stone-300 rounded-xl shadow-sm flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-stone-300">
        <h4 className="font-inter font-bold text-[15px] leading-[18px] text-stone-900">
          Recent Transactions
        </h4>
        <button className="text-[12px] text-blue-600 font-medium hover:underline">View All</button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b border-stone-300 bg-stone-50 text-[10px] font-inter font-medium text-stone-500 uppercase tracking-wider">
        <div>Order</div>
        <div>Customer</div>
        <div>Branch</div>
        <div>Amount</div>
        <div>Payment</div>
        <div>Status</div>
      </div>

      {/* Table Body */}
      <div className="flex flex-col">
        {transactions.map((tx, idx) => (
          <div 
            key={tx.id} 
            className={`grid grid-cols-6 gap-4 px-6 py-4 items-center hover:bg-stone-50 transition-colors ${idx !== transactions.length - 1 ? 'border-b border-stone-200' : ''}`}
          >
            <div className="font-inter font-medium text-[12px] text-stone-900">{tx.id}</div>
            <div className="font-inter text-[12px] text-stone-600">{tx.customer}</div>
            <div>
              <BranchBadge branch={tx.branch} />
            </div>
            <div className="font-inter font-medium text-[12px] text-stone-700">{tx.amount}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
              <PaymentGatewayBadge 
                gateway={tx.paymentMethod} 
                status={tx.paymentStatus.toLowerCase() as 'paid'|'pending'|'failed'|'refunded'} 
              />
            </div>
            <div>
              <OrderStatusBadge status={tx.orderStatus} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
