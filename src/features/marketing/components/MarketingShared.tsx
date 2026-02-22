import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search } from 'lucide-react';
import React from 'react';

export const Spinner = () => (
  <div className="flex justify-center items-center w-full h-32">
    <Loader2 className="animate-spin" style={{ color: 'var(--accent)' }} size={28} />
  </div>
);

export const EmptyState = ({ message, subtext }: { message: string, subtext?: string }) => (
  <div className="flex flex-col items-center justify-center py-16 space-y-3" style={{ color: 'var(--text-tertiary)' }}>
    <Search size={40} className="opacity-40" />
    <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{message}</h3>
    {subtext && <p className="text-sm font-medium">{subtext}</p>}
  </div>
);

export function StatCard({ title, value, subtext, icon, trendUp }: { title: string, value: string | number, subtext?: string, icon: React.ReactNode, trendUp?: boolean }) {
  return (
    <Card className="p-5 transition-all hover:shadow-md" style={{ borderColor: 'var(--border)' }}>
      <div className="flex justify-between items-start mb-3">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{title}</p>
        <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-secondary)' }}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{value}</h3>
      {subtext && (
        <p className="text-xs mt-2 font-semibold w-max px-2 py-0.5 rounded-md" 
           style={{ 
             color: trendUp ? 'var(--success)' : trendUp === false ? 'var(--danger)' : 'var(--text-secondary)', 
             backgroundColor: trendUp ? 'var(--success-light)' : trendUp === false ? 'var(--danger-bg)' : 'var(--surface-alt)' 
           }}>
          {subtext}
        </p>
      )}
    </Card>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const mapping: Record<string, "default" | "success" | "danger" | "warning"> = {
    'COMPLETED': 'success',
    'SCHEDULED': 'default',
    'SENDING': 'warning',
    'FAILED': 'danger',
    'DRAFT': 'default',
    'DELIVERED': 'default',
    'OPENED': 'success',
    'CLICKED': 'success',
    'BOUNCED': 'danger',
    'COMPLAINED': 'danger'
  };
  return <Badge variant={mapping[status] || 'default'} className="uppercase text-[10px] tracking-wider px-2 py-0.5">{status}</Badge>;
}
