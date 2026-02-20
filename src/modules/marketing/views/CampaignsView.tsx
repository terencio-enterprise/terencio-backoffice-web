import { Play } from "lucide-react";
import { useState } from "react";
import { useCampaignLogs } from "@/hooks/useMarketing";
import { EmptyState, Spinner, StatusBadge } from "../components/MarketingShared";
import { CampaignLauncher } from "./CampaignLauncher";
import { CampaignDetails } from "./CampaignDetails";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CampaignsView({ notify, companyId, searchParams, setSearchParams }: { notify: (msg: string, t?:'success'|'error') => void, companyId: string, searchParams: URLSearchParams, setSearchParams: any }) {
  const [isLaunching, setIsLaunching] = useState(searchParams.get('action') === 'new');
  const { data: logs, isLoading, refetch } = useCampaignLogs(companyId);

  const selectedCampaignId = searchParams.get('id');

  const closeLauncher = () => {
    setIsLaunching(false);
    searchParams.delete('action');
    setSearchParams(searchParams);
    refetch();
  };

  if (isLaunching) {
    return <CampaignLauncher onCancel={closeLauncher} notify={notify} companyId={companyId} />;
  }

  if (selectedCampaignId) {
    return <CampaignDetails campaignId={Number(selectedCampaignId)} companyId={companyId} onBack={() => {
      searchParams.delete('id');
      setSearchParams(searchParams);
    }} />
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Campaign Manager</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Launch, schedule and track marketing broadcasts</p>
        </div>
        <Button onClick={() => setIsLaunching(true)}>
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
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Recipients</th>
                <th className="px-6 py-4 text-right">Open Rate</th>
                <th className="px-6 py-4 text-right">Click Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: 'var(--border)' }}>
              {isLoading ? (
                 <tr><td colSpan={6}><Spinner /></td></tr>
              ) : logs.length > 0 ? logs.map(log => (
                <tr key={log.id} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" onClick={() => {
                  searchParams.set('id', log.id.toString());
                  setSearchParams(searchParams);
                }}>
                  <td className="px-6 py-4 font-bold" style={{ color: 'var(--text-primary)' }}>{log.name}</td>
                  <td className="px-6 py-4"><StatusBadge status={log.status} /></td>
                  <td className="px-6 py-4 font-medium" style={{ color: 'var(--text-secondary)' }}>{new Date(log.sentAt).toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-xs text-right" style={{ color: 'var(--text-secondary)' }}>{log.recipientsCount.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-xs text-right" style={{ color: 'var(--text-secondary)' }}>{log.openRate}%</td>
                  <td className="px-6 py-4 font-mono text-xs text-right" style={{ color: 'var(--text-secondary)' }}>{log.clickRate}%</td>
                </tr>
              )) : (
                 <tr><td colSpan={6}><EmptyState message="No campaign history available." /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}