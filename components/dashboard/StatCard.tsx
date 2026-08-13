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
      case 'positive': return { color: 'text-success', bg: 'bg-success-soft', dot: 'bg-success', prefix: '↑' };
      case 'negative': return { color: 'text-error', bg: 'bg-error-soft', dot: 'bg-error', prefix: '↓' };
      case 'neutral': return { color: 'text-muted', bg: 'bg-background', dot: 'bg-muted', prefix: '' };
    }
  };

  const trendConfig = getTrendConfig();

  return (
    <div className="flex flex-col p-5 gap-3 w-full bg-surface border border-border rounded-xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <span className="font-inter font-semibold text-[11px] leading-[13px] text-muted uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted">
            {icon}
          </div>
        )}
      </div>
      <span className="font-inter font-bold text-[26px] leading-[32px] text-foreground tracking-tight">
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
