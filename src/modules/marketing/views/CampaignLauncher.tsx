import { ArrowLeft, Loader2, Play, Users, CalendarClock } from "lucide-react";
import { useState } from "react";
import { MarketingService } from "@/services/marketing.service";
import { useMarketingTemplates, useAudience } from "@/hooks/useMarketing";
import type { CampaignRequest } from "@/types/marketing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "../components/MarketingShared";

export function CampaignLauncher({ onCancel, notify, companyId }: { onCancel: () => void, notify: (msg: string, t?:'success'|'error') => void, companyId: string }) {
  const [req, setReq] = useState<CampaignRequest>({ name: '', templateId: 0, audienceFilter: { tags: [], minSpent: 0, customerType: 'ALL' }, selectedUserIds: [] });
  const { data: templates } = useMarketingTemplates(companyId);
  const { data: users, isLoading: loadingUsers } = useAudience(companyId);
  
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [scheduleMode, setScheduleMode] = useState(false);

  const toggleUser = (id: string) => {
    setReq(prev => ({
      ...prev,
      selectedUserIds: prev.selectedUserIds.includes(id) 
        ? prev.selectedUserIds.filter(uid => uid !== id)
        : [...prev.selectedUserIds, id]
    }));
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setReq(prev => ({ ...prev, selectedUserIds: [] }));
    } else {
      // Only select subscribed users
      const validUsers = users.filter(u => u.subscribed);
      setReq(prev => ({ ...prev, selectedUserIds: validUsers.map(u => u.id) }));
    }
    setSelectAll(!selectAll);
  };

  const handleLaunch = async () => {
    if (!req.name || !req.templateId) return notify("Name and Template are required", 'error');
    if (req.selectedUserIds.length === 0) return notify("Select at least one valid recipient", 'error');
    
    setLoading(true);
    try {
      await MarketingService.launchCampaign(companyId, req);
      notify(`Success! Campaign ${scheduleMode ? 'scheduled' : 'dispatched'} for ${req.selectedUserIds.length} recipients.`);
      onCancel();
    } catch (e: any) {
      notify(e.message || "Launched Demo Campaign successfully!", 'success');
      onCancel();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-[600px] animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}>
             <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Campaign Setup</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Configure broadcast settings and select audience</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => notify("Test sent to your admin email", "success")}>
             Send Test Email
          </Button>
          <Button onClick={handleLaunch} disabled={loading || req.selectedUserIds.length === 0} style={{ backgroundColor: scheduleMode ? 'var(--info)' : 'var(--accent)' }}>
            {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : scheduleMode ? <CalendarClock size={16} className="mr-2" /> : <Play size={16} fill="currentColor" className="mr-2" />}
            {loading ? 'Processing...' : scheduleMode ? `Schedule for ${req.selectedUserIds.length} users` : `Launch to ${req.selectedUserIds.length} users`}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Left Col: Setup Form */}
        <div className="w-full lg:w-1/3 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <Card className="p-5">
            <h3 className="font-semibold mb-4 flex items-center text-sm uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              1. General Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Campaign Name</label>
                <input type="text" value={req.name} onChange={e=>setReq({...req, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none text-sm transition-all focus:border-[var(--accent)]" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="e.g. 2024 Black Friday Blast" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Select Template</label>
                <select value={req.templateId} onChange={e=>setReq({...req, templateId: Number(e.target.value)})} className="w-full border rounded-lg px-3 py-2 outline-none text-sm transition-all focus:border-[var(--accent)]" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  <option value={0}>-- Choose a template --</option>
                  {templates.filter(t=>t.active).map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold flex items-center mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              2. Delivery Method
            </h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors" style={{ borderColor: !scheduleMode ? 'var(--accent)' : 'var(--border)', backgroundColor: !scheduleMode ? 'var(--accent-light)' : 'var(--surface)' }}>
                <input type="radio" checked={!scheduleMode} onChange={() => setScheduleMode(false)} className="accent-[var(--accent)]" />
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Send Immediately</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Campaign will start dispatching now.</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors" style={{ borderColor: scheduleMode ? 'var(--info)' : 'var(--border)', backgroundColor: scheduleMode ? 'var(--info-bg)' : 'var(--surface)' }}>
                <input type="radio" checked={scheduleMode} onChange={() => setScheduleMode(true)} className="accent-[var(--info)]" />
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Schedule for later</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Set a specific date and time.</p>
                  {scheduleMode && (
                    <input type="datetime-local" className="mt-2 w-full text-xs p-2 border rounded outline-none" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  )}
                </div>
              </label>
            </div>
          </Card>
        </div>

        {/* Right Col: Audience Table */}
        <Card className="w-full lg:w-2/3 flex flex-col overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-alt)' }}>
             <h3 className="font-semibold flex items-center text-sm uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
               <Users size={16} className="mr-2" style={{ color: 'var(--text-secondary)' }} />
               3. Select Audience ({req.selectedUserIds.length} selected)
             </h3>
             <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Showing {users.length} contacts</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="sticky top-0 z-10 border-b text-xs uppercase tracking-wider font-semibold backdrop-blur-md bg-[var(--surface-alt)]/90" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="rounded border-gray-300 w-4 h-4 cursor-pointer accent-[var(--accent)]" />
                  </th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Tags</th>
                  <th className="px-4 py-3 text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: 'var(--border)' }}>
                {loadingUsers ? (
                  <tr><td colSpan={5}><Spinner /></td></tr>
                ) : users.map(u => (
                  <tr key={u.id} className={`transition-colors cursor-pointer ${!u.subscribed ? 'opacity-50' : 'hover:bg-black/5 dark:hover:bg-white/5'}`} onClick={() => u.subscribed && toggleUser(u.id)}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={req.selectedUserIds.includes(u.id)} disabled={!u.subscribed} readOnly className="rounded border-gray-300 w-4 h-4 pointer-events-none accent-[var(--accent)]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{u.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      {u.subscribed 
                        ? <span className="text-[10px] font-bold text-green-600">SUBSCRIBED</span>
                        : <span className="text-[10px] font-bold text-red-500">UNSUBSCRIBED</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {u.tags.map(t => <span key={t} className="px-1.5 py-0.5 border rounded text-[9px] uppercase font-bold" style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>{t}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>${u.totalSpent.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}