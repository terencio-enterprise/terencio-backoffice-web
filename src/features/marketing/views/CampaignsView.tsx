import { Play } from 'lucide-react';
import { useCampaigns } from '@/hooks/useMarketing';
import { EmptyState, Spinner, StatusBadge } from '../components/MarketingShared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useActiveContext } from '@/hooks/useScope';

export function CampaignsView() {
  const { companyId } = useActiveContext();
  const navigate = useNavigate();
  const { data: campaigns, isLoading } = useCampaigns(companyId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Campaign Manager</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Launch, schedule and track marketing broadcasts</p>
        </div>
        <Button onClick={() => navigate('new')}>
          <Play size={16} fill="currentColor" className="mr-2" /> Create Campaign
        </Button>
      </div>
      
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b text-xs uppercase tracking-wider font-semibold" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              <tr>
                <th className="px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Recipients</th>
                <th className="px-6 py-4 text-right">Opens</th>
                <th className="px-6 py-4 text-right">Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: 'var(--border)' }}>
              {isLoading ? (
                 <tr><td colSpan={5}><Spinner /></td></tr>
              ) : campaigns.length > 0 ? campaigns.map(c => (
                <tr key={c.id} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" onClick={() => navigate(c.id.toString())}>
                  <td className="px-6 py-4 font-bold" style={{ color: 'var(--text-primary)' }}>{c.name}</td>
                  <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-6 py-4 font-mono text-xs text-right" style={{ color: 'var(--text-secondary)' }}>{c.metricsSent.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-xs text-right text-purple-600 font-medium">{c.metricsOpened.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-xs text-right text-green-600 font-medium">{c.metricsClicked.toLocaleString()}</td>
                </tr>
              )) : (
                 <tr><td colSpan={5}><EmptyState message="No campaigns found." /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
