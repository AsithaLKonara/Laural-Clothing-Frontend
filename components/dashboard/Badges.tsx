import { CheckCircle2, Clock, XCircle, Undo2, MapPin } from "lucide-react";

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple';
  icon?: React.ReactNode;
  dot?: boolean;
}

export function StatusBadge({ label, variant = 'neutral', icon, dot = false }: BadgeProps) {
  const getStyles = () => {
    switch (variant) {
      case 'success': return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100';
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100';
      case 'error': return 'bg-red-50 text-red-600 border-red-200 ring-red-100';
      case 'info': return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100';
      case 'purple': return 'bg-violet-50 text-violet-700 border-violet-200 ring-violet-100';
      default: return 'bg-stone-100 text-stone-600 border-stone-200 ring-stone-100';
    }
  };

  const getDotColor = () => {
    switch (variant) {
      case 'success': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      case 'purple': return 'bg-violet-500';
      default: return 'bg-stone-400';
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold font-inter tracking-wide uppercase ${getStyles()}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDotColor()}`} />}
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
    </div>
  );
}

// Pre-configured semantic badges based on business context rules

export function PaymentGatewayBadge({ gateway, status = 'paid' }: { gateway: string, status?: 'paid' | 'pending' | 'failed' | 'refunded' }) {
  let icon;
  let variant: 'success' | 'warning' | 'error' | 'neutral' = 'neutral';
  
  switch(status) {
    case 'paid': 
      icon = <CheckCircle2 size={12} className="text-emerald-600" />;
      variant = 'success';
      break;
    case 'pending': 
      icon = <Clock size={12} className="text-amber-600" />;
      variant = 'warning';
      break;
    case 'failed': 
      icon = <XCircle size={12} className="text-red-600" />;
      variant = 'error';
      break;
    case 'refunded': 
      icon = <Undo2 size={12} className="text-stone-500" />;
      break;
  }

  return (
    <div className="flex flex-col">
      <StatusBadge label={gateway} variant={variant} icon={icon} />
    </div>
  );
}

export function BranchBadge({ branch }: { branch: string }) {
  return (
    <StatusBadge 
      label={branch} 
      variant="neutral" 
      icon={<MapPin size={11} className="text-stone-400" />} 
    />
  );
}

export function OrderStatusBadge({ status }: { status: string }) {
  let variant: 'success' | 'warning' | 'info' | 'neutral' | 'error' = 'neutral';
  
  if (['Delivered', 'Completed', 'Paid'].includes(status)) variant = 'success';
  else if (['Processing', 'Packed', 'Shipped', 'In Transit'].includes(status)) variant = 'info';
  else if (['Pending', 'Awaiting Payment'].includes(status)) variant = 'warning';
  else if (['Cancelled', 'Failed', 'Returned'].includes(status)) variant = 'error';
  
  return <StatusBadge label={status} variant={variant} dot />;
}
