import { PaymentGatewayBadge } from "./Badges";

export default function RevenueOverviewTable() {
  const gateways = [
    { name: "Koko", amount: "Rs.245K" },
    { name: "Mintpay", amount: "Rs.184K" },
    { name: "OnePay", amount: "Rs.152K" },
    { name: "Payzy", amount: "Rs.126K" },
    { name: "COD", amount: "Rs.132K" },
  ];

  return (
    <div className="w-full h-full bg-white flex flex-col shrink-0">
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-stone-300 flex items-center shrink-0">
        <h4 className="font-inter font-bold text-[15px] leading-[18px] text-stone-900">
          Payments
        </h4>
      </div>

      {/* Subheader */}
      <div className="px-4 py-2 border-b border-stone-300 flex items-center justify-center bg-stone-50 shrink-0">
        <span className="font-inter text-[11px] leading-[13px] text-stone-600">
          Koko · Mintpay · OnePay · Payzy · COD
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col p-2">
        {gateways.map((g) => (
          <div key={g.name} className="flex justify-between items-center px-2 py-3 hover:bg-stone-50 rounded-lg transition-colors cursor-default">
            <PaymentGatewayBadge gateway={g.name} status="paid" />
            <span className="font-inter font-medium text-[11px] leading-[13px] text-stone-900">
              {g.amount}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
