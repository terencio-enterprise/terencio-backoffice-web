import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BarChart3, Mail, MousePointerClick, Play, Users } from "lucide-react";
import { useMemo } from "react";
import { useCampaignLogs } from "@/hooks/useMarketing";
import { EmptyState, Spinner, StatCard, StatusBadge } from "../components/MarketingShared";

export function DashboardView({ onNavigate, companyId }: { onNavigate: (tab: string) => void, companyId: string }) {
  const { data: logs, isLoading } = useCampaignLogs(companyId);
  const recentLogs = useMemo(() => logs.slice(0, 5), [logs]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Marketing Overview</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Performance summary for the last 30 days</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onNavigate('analytics')}>
            <BarChart3 size={16} className="mr-2" /> View Reports
          </Button>
          <Button onClick={() => onNavigate('campaigns&action=new')}>
            <Play size={16} fill="currentColor" className="mr-2" /> Create Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sent" value="124,500" subtext="+12% vs last month" trendUp={true} icon={<Mail />} />
        <StatCard title="Global Open Rate" value="24.8%" subtext="+2.1% vs last month" trendUp={true} icon={<Users />} />
        <StatCard title="Global Click Rate" value="5.2%" subtext="-0.4% vs last month" trendUp={false} icon={<MousePointerClick />} />
        <StatCard title="Revenue Attributed" value="$21,350" subtext="+18% vs last month" trendUp={true} icon={<ArrowUpRight />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="px-5 py-4 flex justify-between items-center border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Campaigns</h3>
            <button onClick={() => onNavigate('campaigns')} className="text-sm font-medium hover:underline transition-colors" style={{ color: 'var(--accent)' }}>View All &rarr;</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="border-b" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <tr>
                  <th className="px-5 py-3 font-medium">Campaign Name</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Sent At</th>
                  <th className="px-5 py-3 font-medium text-right">Recipients</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: 'var(--border)' }}>
                {isLoading ? (
                  <tr><td colSpan={4}><Spinner /></td></tr>
                ) : recentLogs.length > 0 ? recentLogs.map(log => (
                  <tr key={log.id} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" onClick={() => onNavigate(`campaigns&id=${log.id}`)}>
                    <td className="px-5 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{log.name}</td>
                    <td className="px-5 py-3"><StatusBadge status={log.status} /></td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(log.sentAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 font-mono text-right" style={{ color: 'var(--text-secondary)' }}>{log.recipientsCount.toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4}><EmptyState message="No recent campaigns found." /></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions / Tips panel */}
        <Card className="p-6 bg-gradient-to-br from-[var(--surface)] to-[var(--surface-alt)] flex flex-col justify-between" style={{ borderColor: 'var(--border)' }}>
          <div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
              <ArrowUpRight size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Grow your audience</h3>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Configure your signup forms and popups to capture more leads directly from your storefront.
            </p>
          </div>
          <Button variant="outline" className="w-full" onClick={() => onNavigate('audience')}>
            Manage Audience
          </Button>
        </Card>
      </div>
    </div>
  );
}