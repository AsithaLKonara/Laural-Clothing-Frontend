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
      case 'success': return 'bg-success-soft text-success border-success/30 ring-success/20';
      case 'warning': return 'bg-warning-soft text-warning border-warning/30 ring-warning/20';
      case 'error': return 'bg-error-soft text-error border-error/30 ring-error/20';
      case 'info': return 'bg-info-soft text-info border-info/30 ring-info/20';
      case 'purple': return 'bg-accent-soft text-accent border-accent/30 ring-accent/20';
      default: return 'bg-background text-muted border-border ring-border/20';
    }
  };

  const getDotColor = () => {
    switch (variant) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      case 'info': return 'bg-info';
      case 'purple': return 'bg-accent';
      default: return 'bg-muted';
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
      icon = <CheckCircle2 size={12} className="text-success" />;
      variant = 'success';
      break;
    case 'pending': 
      icon = <Clock size={12} className="text-warning" />;
      variant = 'warning';
      break;
    case 'failed': 
      icon = <XCircle size={12} className="text-error" />;
      variant = 'error';
      break;
    case 'refunded': 
      icon = <Undo2 size={12} className="text-muted" />;
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
      icon={<MapPin size={11} className="text-muted" />} 
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
