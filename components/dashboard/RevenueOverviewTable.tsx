import { PaymentGatewayBadge } from "./Badges";

interface GatewayData {
  gw: string;
  amount: number;
  count: number;
  pct: number;
}

export default function RevenueOverviewTable({ data }: { data?: GatewayData[] }) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `Rs. ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `Rs. ${(value / 1000).toFixed(1)}K`;
    return `Rs. ${value.toFixed(0)}`;
  };

  const gateways = data || [];

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
          {gateways.length > 0 ? gateways.map(g => g.gw).join(' · ') : 'No data'}
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col p-2">
        {gateways.length > 0 ? gateways.map((g) => (
          <div key={g.gw} className="flex justify-between items-center px-2 py-3 hover:bg-stone-50 rounded-lg transition-colors cursor-default">
            <PaymentGatewayBadge gateway={g.gw} status="paid" />
            <span className="font-inter font-medium text-[11px] leading-[13px] text-stone-900">
              {formatCurrency(g.amount)}
            </span>
          </div>
        )) : (
          <div className="text-center py-4 text-stone-400 text-xs">No transactions in period</div>
        )}
      </div>

    </div>
  );
}
