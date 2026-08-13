interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, trend, trendType = 'positive', icon }: StatCardProps) {
  
  const getTrendConfig = () => {
    switch(trendType) {
      case 'positive': return { color: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500', prefix: '↑' };
      case 'negative': return { color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500', prefix: '↓' };
      case 'neutral': return { color: 'text-stone-500', bg: 'bg-stone-100', dot: 'bg-stone-400', prefix: '' };
    }
  };

  const trendConfig = getTrendConfig();

  return (
    <div className="flex flex-col p-5 gap-3 w-full bg-white border border-stone-200 rounded-xl shadow-sm hover:shadow-md hover:border-stone-300 transition-all">
      <div className="flex items-start justify-between">
        <span className="font-inter font-semibold text-[11px] leading-[13px] text-stone-500 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400">
            {icon}
          </div>
        )}
      </div>
      <span className="font-inter font-bold text-[26px] leading-[32px] text-stone-900 tracking-tight">
        {value}
      </span>
      {trend && (
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold font-inter ${trendConfig.bg} ${trendConfig.color}`}>
            {trendConfig.prefix} {trend}
          </span>
        </div>
      )}
    </div>
  );
}
