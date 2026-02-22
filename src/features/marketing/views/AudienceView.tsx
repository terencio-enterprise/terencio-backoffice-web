import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAudience } from "@/hooks/useMarketing";
import { Download, Plus, UserCheck, UserMinus, Users } from "lucide-react";
import { EmptyState, Spinner, StatCard } from "../components/MarketingShared";

export function AudienceView({ companyId }: { companyId: string }) {
  const { data: users, isLoading } = useAudience(companyId);

  const activeSubscribers = users.filter(u => u.subscribed).length;
  const unsubscribed = users.filter(u => !u.subscribed).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Audience & Contacts</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage your CRM, lists, and segments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button>
            <Plus size={16} className="mr-2" /> Add Contacts
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Contacts" value={users.length.toLocaleString()} icon={<Users size={20} />} />
        <StatCard title="Active Subscribers" value={activeSubscribers.toLocaleString()} icon={<UserCheck size={20} />} trendUp={true} subtext="Healthy" />
        <StatCard title="Unsubscribed" value={unsubscribed.toLocaleString()} icon={<UserMinus size={20} />} trendUp={false} />
      </div>

      <Card className="overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>All Contacts</h3>
          <input 
            type="text" 
            placeholder="Search by email or name..." 
            className="text-sm border rounded-md px-3 py-1.5 outline-none w-64"
            style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              <tr>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Tags</th>
                <th className="px-6 py-3 font-medium text-right">LTV</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {isLoading ? (
                <tr><td colSpan={5}><Spinner /></td></tr>
              ) : users.length > 0 ? users.map(u => (
                <tr key={u.id} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="px-6 py-3">
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{u.email}</p>
                  </td>
                  <td className="px-6 py-3">
                    {u.subscribed 
                      ? <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>Subscribed</span>
                      : <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold" style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-tertiary)' }}>Unsubscribed</span>
                    }
                  </td>
                  <td className="px-6 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>{u.type}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {u.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 border rounded-md text-[10px] uppercase font-bold tracking-wider" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-3 font-mono text-right" style={{ color: 'var(--text-secondary)' }}>${u.totalSpent.toFixed(2)}</td>
                </tr>
              )) : (
                <tr><td colSpan={5}><EmptyState message="No contacts found." /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}