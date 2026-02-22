import { ArrowLeft, MousePointerClick, MailOpen, AlertTriangle, Send, Calendar, Play, RefreshCw, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useActiveContext } from '@/hooks/useScope';
import { MarketingService } from '@/services/marketing.service';
import { EmptyState, Spinner, StatCard, StatusBadge } from '../components/MarketingShared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CampaignResponse, CampaignAudienceMember } from '@/types/marketing';

export function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { companyId } = useActiveContext();
  
  const [campaign, setCampaign] = useState<CampaignResponse | null>(null);
  const [audience, setAudience] = useState<CampaignAudienceMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    if (!companyId || !id) return;
    try {
      const camp = await MarketingService.getCampaign(companyId, Number(id));
      setCampaign(camp);
      const aud = await MarketingService.getCampaignAudience(companyId, Number(id));
      setAudience(aud);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetails(); }, [companyId, id]);

  const action = async (fn: () => Promise<any>) => {
    try {
      await fn();
      alert('Action triggered successfully. (Check background process)');
      fetchDetails();
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  if (loading) return <Spinner />;
  if (!campaign) return <EmptyState message="Campaign not found" />;

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('..')} className="w-8 h-8 flex items-center justify-center rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
             <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              {campaign.name} <StatusBadge status={campaign.status} />
            </h1>
            {campaign.scheduledAt && <p className="text-sm text-gray-500 mt-1">Scheduled: {new Date(campaign.scheduledAt).toLocaleString()}</p>}
          </div>
        </div>

        <div className="flex gap-3">
          {(campaign.status === 'DRAFT' || campaign.status === 'SCHEDULED') && (
            <>
              <Button variant="outline" onClick={() => action(() => MarketingService.scheduleCampaign(companyId!, campaign.id, new Date(Date.now() + 86400000).toISOString()))}>
                <Calendar size={18} className="mr-2" /> Schedule Tomrrow
              </Button>
              <Button onClick={() => action(() => MarketingService.launchCampaign(companyId!, campaign.id))}>
                <Play size={18} fill="currentColor" className="mr-2" /> Launch Now
              </Button>
            </>
          )}
          {campaign.status === 'COMPLETED' && (
            <Button onClick={() => action(() => MarketingService.relaunchCampaign(companyId!, campaign.id))}>
              <RefreshCw size={18} className="mr-2" /> Relaunch to Pending
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Sent" value={campaign.metricsSent.toLocaleString()} icon={<Send />} />
        <StatCard title="Opened" value={campaign.metricsOpened.toLocaleString()} icon={<MailOpen />} trendUp={true} />
        <StatCard title="Clicked" value={campaign.metricsClicked.toLocaleString()} icon={<MousePointerClick />} trendUp={true} />
        <StatCard title="Bounced" value={campaign.metricsBounced.toLocaleString()} icon={<AlertTriangle />} trendUp={false} />
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-alt)' }}>
          <h3 className="font-semibold flex items-center gap-2"><Users size={18}/> Audience List</h3>
          <span className="text-sm text-gray-500">{audience.length} Customers</span>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b bg-gray-50 dark:bg-gray-900 text-xs uppercase tracking-wider sticky top-0" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: 'var(--border)' }}>
              {audience.map(a => (
                <tr key={a.customerId} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{a.name}</td>
                  <td className="px-6 py-3" style={{ color: 'var(--text-secondary)' }}>{a.email}</td>
                  <td className="px-6 py-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
              {audience.length === 0 && (
                <tr><td colSpan={3}><EmptyState message="No audience found." /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
