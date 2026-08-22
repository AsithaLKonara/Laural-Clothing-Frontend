import { OrderStatusBadge, BranchBadge, PaymentGatewayBadge } from "./Badges";

interface TransactionData {
  id: string;
  customer: string;
  branch: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
}

export default function RecentTransactionsTable({ transactions }: { transactions?: TransactionData[] }) {
  const data = transactions || [];

  const formatCurrency = (value: number) => {
    return `Rs. ${value.toLocaleString()}`;
  };

  return (
    <div className="w-full bg-white border border-stone-300 rounded-xl shadow-sm flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-stone-300">
        <h4 className="font-inter font-bold text-[15px] leading-[18px] text-stone-900">
          Recent Transactions
        </h4>
        <button className="text-[12px] text-blue-600 font-medium hover:underline">View All</button>
      </div>

      {/* Table Header & Body Scroll Wrapper */}
      <div className="overflow-x-auto w-full custom-scrollbar">
        <div className="min-w-[700px]">
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
            {data.length > 0 ? data.map((tx, idx) => (
              <div 
                key={tx.id} 
                className={`grid grid-cols-6 gap-4 px-6 py-4 items-center hover:bg-stone-50 transition-colors ${idx !== data.length - 1 ? 'border-b border-stone-200' : ''}`}
              >
                <div className="font-inter font-medium text-[12px] text-stone-900 truncate" title={tx.id}>{tx.id.split('-')[0] + '-' + tx.id.slice(tx.id.length - 5).toUpperCase()}</div>
                <div className="font-inter text-[12px] text-stone-600 truncate" title={tx.customer}>{tx.customer}</div>
                <div>
                  <BranchBadge branch={tx.branch} />
                </div>
                <div className="font-inter font-medium text-[12px] text-stone-700">{formatCurrency(tx.amount)}</div>
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
            )) : (
              <div className="px-6 py-10 text-center text-stone-400 text-sm">No recent transactions found</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
