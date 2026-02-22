import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, BarChart3, Mail, MousePointerClick, Play, Users } from 'lucide-react';
import { useCampaigns } from '@/hooks/useMarketing';
import { EmptyState, Spinner, StatCard, StatusBadge } from '../components/MarketingShared';
import { useNavigate } from 'react-router-dom';
import { useActiveContext } from '@/hooks/useScope';

export function DashboardView() {
  const { companyId } = useActiveContext();
  const navigate = useNavigate();
  const { data: campaigns, isLoading } = useCampaigns(companyId);
  const recentCampaigns = campaigns.slice(0, 5);

  const totalSent = campaigns.reduce((acc, curr) => acc + curr.metricsSent, 0);
  const totalOpened = campaigns.reduce((acc, curr) => acc + curr.metricsOpened, 0);
  const avgOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Marketing Overview</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Performance summary across all campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('campaigns/new')}>
            <Play size={16} fill="currentColor" className="mr-2" /> Create Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sent" value={totalSent.toLocaleString()} icon={<Mail />} />
        <StatCard title="Global Open Rate" value={avgOpenRate + '%'} icon={<Users />} />
        <StatCard title="Total Campaigns" value={campaigns.length} icon={<BarChart3 />} />
        <StatCard title="Active Segments" value="3" icon={<ArrowUpRight />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="px-5 py-4 flex justify-between items-center border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Campaigns</h3>
            <button onClick={() => navigate('campaigns')} className="text-sm font-medium hover:underline transition-colors" style={{ color: 'var(--accent)' }}>View All &rarr;</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="border-b" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <tr>
                  <th className="px-5 py-3 font-medium">Campaign Name</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: 'var(--border)' }}>
                {isLoading ? (
                  <tr><td colSpan={3}><Spinner /></td></tr>
                ) : recentCampaigns.length > 0 ? recentCampaigns.map(c => (
                  <tr key={c.id} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" onClick={() => navigate(campaigns/ + c.id)}>
                    <td className="px-5 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{c.name}</td>
                    <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3 font-mono text-right" style={{ color: 'var(--text-secondary)' }}>{c.metricsSent.toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={3}><EmptyState message="No recent campaigns found." /></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
