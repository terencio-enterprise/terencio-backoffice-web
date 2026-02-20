import { ArrowLeft, MousePointerClick, MailOpen, AlertTriangle, Link, Zap } from "lucide-react";
import { useCampaignDetails, useCampaignLogs } from "@/hooks/useMarketing";
import { EmptyState, Spinner, StatCard, StatusBadge } from "../components/MarketingShared";
import { Card } from "@/components/ui/card";

export function CampaignDetails({ campaignId, companyId, onBack }: { campaignId: number, companyId: string, onBack: () => void }) {
  const { data: campaigns } = useCampaignLogs(companyId);
  const campaign = campaigns.find(c => c.id === campaignId);
  
  const { recipients, links, isLoading } = useCampaignDetails(companyId, campaignId);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}>
           <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{campaign?.name || `Campaign #${campaignId}`}</h2>
            {campaign && <StatusBadge status={campaign.status} />}
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>ID: #{campaignId} • Sent: {campaign ? new Date(campaign.sentAt).toLocaleString() : '-'}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Open Rate" value={`${campaign?.openRate || 0}%`} icon={<MailOpen />} trendUp={true} />
        <StatCard title="Click Through Rate" value={`${campaign?.clickRate || 0}%`} icon={<MousePointerClick />} trendUp={true} />
        <StatCard title="Bounce Rate" value={`${campaign?.bounceRate || 0}%`} icon={<AlertTriangle />} trendUp={false} subtext="Keep below 2%" />
        <StatCard title="Revenue Attributed" value={`$${campaign?.revenueAttributed?.toLocaleString() || 0}`} icon={<Zap />} trendUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recipient Log */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Delivery & Tracking Log</h3>
          </div>
          <div className="overflow-x-auto flex-1 max-h-[400px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="sticky top-0 border-b text-xs uppercase tracking-wider font-semibold backdrop-blur-md" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Device / Client</th>
                  <th className="px-6 py-4">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: 'var(--border)' }}>
                {isLoading ? (
                  <tr><td colSpan={4}><Spinner /></td></tr>
                ) : recipients.length > 0 ? recipients.map(r => (
                  <tr key={r.id} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                    <td className="px-6 py-3">
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{r.email}</p>
                    </td>
                    <td className="px-6 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-6 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{r.device || 'N/A'}</td>
                    <td className="px-6 py-3 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{new Date(r.lastActivity).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4}><EmptyState message="No recipients data available." /></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Link Performance */}
        <Card className="overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <h3 className="font-semibold flex items-center" style={{ color: 'var(--text-primary)' }}>
              <Link size={16} className="mr-2 text-gray-400" />
              Top Links Clicked
            </h3>
          </div>
          <div className="p-0 overflow-y-auto flex-1 max-h-[400px] custom-scrollbar">
            {isLoading ? (
              <Spinner />
            ) : links.length > 0 ? (
              <ul className="divide-y" style={{ divideColor: 'var(--border)' }}>
                {links.map((link, i) => (
                  <li key={i} className="p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <p className="text-sm font-medium truncate mb-2" style={{ color: 'var(--text-primary)' }} title={link.url}>{link.url}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span style={{ color: 'var(--text-secondary)' }}>{link.uniqueClicks.toLocaleString()} Unique Clicks</span>
                      <span className="font-bold" style={{ color: 'var(--info)' }}>{link.ctr}% CTR</span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden" style={{ backgroundColor: 'var(--surface-alt)' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(link.ctr * 5, 100)}%`, backgroundColor: 'var(--info)' }}></div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
               <EmptyState message="No links clicked yet." />
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}