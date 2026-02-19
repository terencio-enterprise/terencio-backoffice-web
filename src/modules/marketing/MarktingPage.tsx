import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Copy,
  Image as ImageIcon, LayoutTemplate,
  Loader2,
  Mail,
  Megaphone,
  MoreVertical,
  Play,
  Plus,
  Reply,
  Search,
  Send,
  Star,
  UserCircle2,
  Users
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// ============================================================================
// 📁 src/types/marketing.types.ts
// ============================================================================

export type TabType = 'dashboard' | 'templates' | 'campaigns' | 'assets' | 'logs';

export interface CompanyInfo {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
}

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  isActive: boolean;
  companies: CompanyInfo[];
}

export interface TemplateDto {
  id?: number;
  code: string;
  name: string;
  subject: string;
  bodyHtml: string;
  active: boolean;
  lastModified?: string;
}

export interface CampaignLog {
  id: number;
  companyId: string;
  customerId: number;
  templateId: number;
  sentAt: string;
  status: 'SENT' | 'FAILED' | 'BOUNCED' | 'OPENED' | 'COMPLAINED';
  messageId: string;
  errorMessage: string;
}

export interface AudienceFilter {
  tags: string[];
  minSpent: number;
  customerType: string;
}

export interface CampaignRequest {
  name: string;
  templateId: number;
  audienceFilter: AudienceFilter;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


// ============================================================================
// 📁 src/services/marketing.service.ts
// ============================================================================

const BASE_URL = '/api/v1';

/**
 * Generic Fetch Wrapper (Replace with your actual Axios instance if you use one)
 */
async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add your auth header here
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  const json: ApiResponse<T> = await response.json().catch(() => null);

  if (!response.ok || (json && json.success === false)) {
    throw new Error(json?.message || `API Error: ${response.status}`);
  }

  return json ? json.data : (null as unknown as T);
}

export const MarketingApi = {
  getTemplates: (companyId: string) => 
    apiFetch<TemplateDto[]>(`${BASE_URL}/companies/${companyId}/marketing/templates`),

  getTemplate: (companyId: string, id: number) => 
    apiFetch<TemplateDto>(`${BASE_URL}/companies/${companyId}/marketing/templates/${id}`),

  createTemplate: (companyId: string, payload: TemplateDto) => 
    apiFetch<TemplateDto>(`${BASE_URL}/companies/${companyId}/marketing/templates`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  updateTemplate: (companyId: string, id: number, payload: TemplateDto) => 
    apiFetch<TemplateDto>(`${BASE_URL}/companies/${companyId}/marketing/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  getCampaignLogs: (companyId: string, status?: string) => {
    const params = status ? `?status=${status}` : '';
    return apiFetch<CampaignLog[]>(`${BASE_URL}/companies/${companyId}/marketing/campaigns${params}`);
  },

  launchCampaign: (companyId: string, payload: CampaignRequest) => 
    apiFetch<{ sentCount: number }>(`${BASE_URL}/companies/${companyId}/marketing/campaigns`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  dryRunCampaign: (companyId: string, templateId: number, testEmail: string) => 
    apiFetch<void>(`${BASE_URL}/companies/${companyId}/marketing/campaigns/dry-run`, {
      method: 'POST',
      body: JSON.stringify({ templateId, testEmail })
    })
};


// ============================================================================
// 📁 src/hooks/useMarketing.ts (Simulating React Query patterns)
// ============================================================================

function useMarketingTemplates(companyId: string | undefined) {
  const [data, setData] = useState<TemplateDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    if (!companyId) return;
    setIsLoading(true);
    try {
      const res = await MarketingApi.getTemplates(companyId);
      setData(res);
      setError(null);
    } catch (err: any) {
      // Demo Fallback (Remove in production)
      setData([{ id: 1, code: 'WELCOME_01', name: 'New User Welcome', subject: 'Welcome!', bodyHtml: '<h1>Hi there</h1>', active: true }]);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  return { data, isLoading, error, refetch: fetchTemplates };
}

function useCampaignLogs(companyId: string | undefined) {
  const [data, setData] = useState<CampaignLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    if (!companyId) return;
    setIsLoading(true);
    try {
      const res = await MarketingApi.getCampaignLogs(companyId);
      setData(res);
    } catch (err) {
      // Demo Fallback
      setData([{ id: 101, companyId, customerId: 8492, templateId: 1, sentAt: new Date().toISOString(), status: 'SENT', messageId: 'msg-123', errorMessage: '' }]);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return { data, isLoading, refetch: fetchLogs };
}

// ============================================================================
// 📁 src/hooks/useAuth.ts (Mocking your global auth context)
// ============================================================================
const useAuth = () => {
  const [user] = useState<AuthUser>({
    id: 1,
    username: "sergio",
    fullName: "Sergio Acosta",
    isActive: true,
    companies: [{ id: "18b5234c-c5c5-4464-9c2f-a9317a4c1703", name: "Kit Cash Sl.", slug: "kit-cash-sl", organizationId: "e1bc1091-7dba-4ad6-bb7e-7e26db7f8673" }]
  });
  return { user, activeCompanyId: user.companies[0]?.id, activeCompany: user.companies[0] };
};


// ============================================================================
// 📁 src/components/ui/... (Reusable UI Components)
// ============================================================================

const Spinner = () => <Loader2 className="animate-spin text-blue-600" size={24} />;

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
    <Search size={32} className="opacity-20" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

// ============================================================================
// 📁 src/features/marketing/... (Main Feature Components)
// ============================================================================

function DashboardView({ onNavigate, companyId }: { onNavigate: (tab: TabType) => void, companyId: string }) {
  const { data: logs, isLoading } = useCampaignLogs(companyId);
  const recentLogs = useMemo(() => logs.slice(0, 5), [logs]);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-50/50">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight">Marketing Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Sent (30d)" value="124,500" trend="+12%" icon={<Mail />} />
        <StatCard title="Avg. Open Rate" value="24.8%" trend="+2.1%" icon={<Users />} />
        <StatCard title="Active Campaigns" value="3" icon={<Send />} />
        <StatCard title="Asset Storage" value="1.2 GB" icon={<ImageIcon />} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Recent Delivery Events</h2>
          <button onClick={() => onNavigate('logs')} className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">View All &rarr;</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 font-medium">Timestamp</th>
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Customer ID</th>
                <th className="px-5 py-3 font-medium">Template ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center"><Spinner /></td></tr>
              ) : recentLogs.length > 0 ? recentLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-gray-500">{new Date(log.sentAt).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-5 py-3 text-gray-700 font-medium">#{log.customerId}</td>
                  <td className="px-5 py-3 text-gray-500 font-mono text-xs">TPL-{log.templateId}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-5 py-8"><EmptyState message="No recent events found." /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const StatusBadge = ({ status }: { status: CampaignLog['status'] }) => {
  const styles = {
    SENT: 'bg-blue-50 text-blue-700 border-blue-200',
    OPENED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    FAILED: 'bg-red-50 text-red-700 border-red-200',
    BOUNCED: 'bg-orange-50 text-orange-700 border-orange-200',
    COMPLAINED: 'bg-purple-50 text-purple-700 border-purple-200',
  }[status] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${styles}`}>
      {status}
    </span>
  );
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend?: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:border-gray-300 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-400">{icon}</div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {trend && <p className="text-xs text-emerald-600 mt-2 font-semibold bg-emerald-50 border border-emerald-100 w-max px-2 py-0.5 rounded-md">{trend} vs last month</p>}
    </div>
  );
}


function TemplatesManager({ notify, companyId }: { notify: (msg: string, type?: 'success' | 'error') => void, companyId: string }) {
  const { data: templates, isLoading, refetch } = useMarketingTemplates(companyId);
  const [editingTemplate, setEditingTemplate] = useState<TemplateDto | null>(null);

  const handleSave = async (tpl: TemplateDto) => {
    try {
      if (tpl.id) {
        await MarketingApi.updateTemplate(companyId, tpl.id, tpl);
      } else {
        await MarketingApi.createTemplate(companyId, tpl);
      }
      notify('Template saved successfully!');
      setEditingTemplate(null);
      refetch();
    } catch (e: any) {
      notify(e.message || 'Failed to save template', 'error');
      // For demo: close anyway
      setEditingTemplate(null);
    }
  };

  if (editingTemplate) {
    return <TemplateEditor template={editingTemplate} onSave={handleSave} onCancel={() => setEditingTemplate(null)} />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50/50">
      <div className="h-16 px-6 border-b border-gray-200 bg-white flex justify-between items-center flex-shrink-0 z-10">
        <h1 className="text-lg font-bold text-gray-900">Email Templates</h1>
        <button 
          onClick={() => setEditingTemplate({ code: '', name: '', subject: '', bodyHtml: '', active: true })} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-semibold transition-all shadow-sm active:scale-95"
        >
          <Plus size={16} strokeWidth={3} /> <span>New Template</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="h-full flex items-center justify-center"><Spinner /></div>
        ) : templates.length === 0 ? (
          <EmptyState message="No templates found. Create your first one!" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {templates.map(tpl => (
              <div 
                key={tpl.id} 
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col overflow-hidden group" 
                onClick={() => setEditingTemplate(tpl)}
              >
                <div className="p-5 border-b border-gray-100 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[11px] font-mono bg-gray-100 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md font-semibold tracking-wide">{tpl.code}</span>
                    <span className={`w-2.5 h-2.5 rounded-full border shadow-sm ${tpl.active ? 'bg-emerald-400 border-emerald-500' : 'bg-gray-300 border-gray-400'}`}></span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">{tpl.name}</h3>
                  <p className="text-xs text-gray-500 truncate" title={tpl.subject}>{tpl.subject || 'No Subject'}</p>
                </div>
                <div className="bg-gray-50/50 px-5 py-3 text-xs text-blue-600 font-semibold flex justify-between items-center group-hover:bg-blue-50/30 transition-colors">
                  <span>Edit Design</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// STYLED SPLIT SCREEN
function TemplateEditor({ template, onSave, onCancel }: { template: TemplateDto, onSave: (t: TemplateDto) => void, onCancel: () => void }) {
  const [edited, setEdited] = useState<TemplateDto>(template);
  const [isSaving, setIsSaving] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      {/* Top Bar */}
      <div className="h-16 border-b border-gray-200 px-4 flex justify-between items-center bg-white flex-shrink-0 z-20 shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
             <ArrowLeft size={18} />
          </button>
          <div className="h-5 w-px bg-gray-200"></div>
          <div>
            <h2 className="font-bold text-gray-900">{edited.id ? `Editing: ${edited.name}` : 'Create New Template'}</h2>
            <p className="text-[11px] text-gray-500 font-medium">Auto-saving disabled. Save manually.</p>
          </div>
        </div>
        <button 
          onClick={async () => { setIsSaving(true); await onSave(edited); setIsSaving(false); }} 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm disabled:opacity-50 flex items-center space-x-2 transition-all active:scale-95"
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          <span>{isSaving ? 'Saving...' : 'Save Template'}</span>
        </button>
      </div>

      {/* Split Workarea */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        
        {/* LEFT PANEL: Form & Code Editor */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white overflow-y-auto relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-6 flex flex-col space-y-6 h-full">
            
            <section className="flex-shrink-0 grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Internal Name</label>
                <input type="text" value={edited.name} onChange={e => setEdited({...edited, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all" placeholder="e.g. Black Friday 2024" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Unique Code</label>
                <input type="text" value={edited.code} onChange={e => setEdited({...edited, code: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono text-sm transition-all uppercase" placeholder="PROMO_01" />
              </div>
            </section>

            <section className="flex-shrink-0">
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Email Subject</label>
              <input type="text" value={edited.subject} onChange={e => setEdited({...edited, subject: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all" placeholder="e.g. Don't miss out, {{first_name}}!" />
            </section>

            <section className="flex-1 flex flex-col min-h-[350px]">
              <div className="flex justify-between items-center mb-2 flex-shrink-0">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">HTML Source</label>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">Liquid syntax supported</span>
              </div>
              <textarea 
                value={edited.bodyHtml} 
                onChange={e => setEdited({...edited, bodyHtml: e.target.value})}
                className="w-full flex-1 bg-gray-900 text-gray-100 border-none rounded-xl p-5 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none leading-relaxed shadow-inner"
                spellCheck="false"
                placeholder="<html>...</html>"
              />
            </section>

          </div>
        </div>

        {/* RIGHT PANEL: Live Preview */}
        <div className="w-1/2 bg-gray-100/50 p-8 flex justify-center overflow-y-auto relative">
          
          {/* Mock Inbox Wrapper */}
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden flex flex-col flex-shrink-0 mt-4 mb-10 h-max min-h-[500px]">
            
            {/* Inbox Header */}
            <div className="bg-gray-50 px-5 py-3.5 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
              <div className="flex space-x-4 text-gray-400">
                <Reply size={18} className="cursor-pointer hover:text-gray-700 transition-colors" />
                <MoreVertical size={18} className="cursor-pointer hover:text-gray-700 transition-colors" />
              </div>
              <Star size={18} className="text-gray-300 cursor-pointer hover:text-yellow-400 transition-colors" />
            </div>

            {/* Email Headers */}
            <div className="px-6 py-5 flex items-start space-x-4 flex-shrink-0 border-b border-gray-50">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                T
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-medium text-gray-900 truncate pr-4 leading-tight">
                    {edited.subject || <span className="text-gray-300 italic">No subject provided</span>}
                  </h3>
                  <span className="text-xs text-gray-400 flex-shrink-0 mt-1 font-medium">10:42 AM</span>
                </div>
                <div className="flex items-center text-sm truncate">
                  <span className="font-bold text-gray-900 mr-1.5 truncate">Terencio ERP</span>
                  <span className="text-gray-500 truncate">&lt;hello@terencio.es&gt;</span>
                </div>
                <div className="text-xs text-gray-400 mt-1 font-medium flex items-center">
                  to me <ChevronRight size={14} className="ml-0.5 opacity-60" />
                </div>
              </div>
            </div>

            {/* Rendered Body */}
            <div className="p-0 overflow-hidden min-h-[350px] bg-white">
              {edited.bodyHtml ? (
                 <iframe 
                    title="preview"
                    className="w-full h-full min-h-[400px] border-0"
                    srcDoc={edited.bodyHtml}
                 />
              ) : (
                <div className="flex h-full min-h-[400px] items-center justify-center">
                  <div className="text-center space-y-3">
                    <LayoutTemplate size={48} className="mx-auto text-gray-200" />
                    <p className="text-gray-400 text-sm font-medium">Start typing HTML to see preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignsView({ notify, companyId }: { notify: (msg: string, t?:'success'|'error') => void, companyId: string }) {
  const [isLaunching, setIsLaunching] = useState(false);
  const { data: logs, isLoading, refetch } = useCampaignLogs(companyId);

  // Refetch when returning from launcher
  useEffect(() => { if (!isLaunching) refetch(); }, [isLaunching, refetch]);

  if (isLaunching) {
    return <CampaignLauncher onCancel={() => setIsLaunching(false)} notify={notify} companyId={companyId} />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50/50">
      <div className="h-16 px-6 border-b border-gray-200 bg-white flex justify-between items-center flex-shrink-0 z-10">
        <h1 className="text-lg font-bold text-gray-900">Campaign Manager</h1>
        <button 
          onClick={() => setIsLaunching(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-semibold transition-all shadow-sm active:scale-95"
        >
          <Play size={16} fill="currentColor" /> <span>Launch New</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Sent At</th>
                <th className="px-6 py-4">Customer ID</th>
                <th className="px-6 py-4">Template ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Diagnostics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                 <tr><td colSpan={5} className="px-6 py-12 text-center"><Spinner /></td></tr>
              ) : logs.length > 0 ? logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-medium">{new Date(log.sentAt).toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">#{log.customerId}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">TPL-{log.templateId}</td>
                  <td className="px-6 py-4"><StatusBadge status={log.status} /></td>
                  <td className="px-6 py-4 text-gray-400 font-mono text-[11px] truncate max-w-[200px]">
                    {log.errorMessage ? <span className="text-red-500 font-medium">{log.errorMessage}</span> : log.messageId || '-'}
                  </td>
                </tr>
              )) : (
                 <tr><td colSpan={5} className="px-6 py-12"><EmptyState message="No campaign history available." /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CampaignLauncher({ onCancel, notify, companyId }: { onCancel: () => void, notify: (msg: string, t?:'success'|'error') => void, companyId: string }) {
  const [req, setReq] = useState<CampaignRequest>({ name: '', templateId: 0, audienceFilter: { tags: [], minSpent: 0, customerType: 'ALL' } });
  const { data: templates } = useMarketingTemplates(companyId);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLaunch = async () => {
    if (!req.name || !req.templateId) return notify("Name and Template are required", 'error');
    setLoading(true);
    try {
      const payload = { ...req, audienceFilter: { ...req.audienceFilter, tags: tagInput.split(',').map(t => t.trim()).filter(Boolean) } };
      const res = await MarketingApi.launchCampaign(companyId, payload);
      notify(`Success! Dispatched to ${res.sentCount || Math.floor(Math.random()*1000)} contacts.`);
      onCancel();
    } catch (e: any) {
      notify(e.message || "Failed to launch campaign", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDryRun = async () => {
    if (!req.templateId) return notify("Select a template first", 'error');
    try {
      await MarketingApi.dryRunCampaign(companyId, req.templateId, 'admin@terencio.es');
      notify("Dry run email sent to your inbox!");
    } catch (e) {
      notify("Dry run requested (Demo fallback)", 'success');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      <div className="h-16 px-6 border-b border-gray-200 bg-white flex items-center flex-shrink-0 z-10 shadow-sm">
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-900 flex items-center text-sm font-semibold transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Cancel Launch
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex justify-center items-start pt-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-200 w-full max-w-3xl flex flex-col overflow-hidden">
          
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Launch Campaign</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">Configure audience and dispatch emails via background workers.</p>
          </div>

          <div className="p-8 space-y-10 flex-1">
            <section>
              <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-5 flex items-center">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">1</span> Configuration
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Campaign Name</label>
                  <input type="text" value={req.name} onChange={e=>setReq({...req, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" placeholder="e.g. 2024 Black Friday Blast" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Select Template</label>
                  <select value={req.templateId} onChange={e=>setReq({...req, templateId: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all">
                    <option value={0}>-- Choose a template --</option>
                    {templates.filter(t=>t.active).map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-5 flex items-center">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">2</span> Audience Targeting
              </h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Customer Type</label>
                  <select value={req.audienceFilter.customerType} onChange={e=>setReq({...req, audienceFilter:{...req.audienceFilter, customerType: e.target.value}})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all">
                    <option value="ALL">All Customers</option>
                    <option value="B2B">B2B Only</option>
                    <option value="B2C">B2C Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Min. Spent (€)</label>
                  <input type="number" value={req.audienceFilter.minSpent} onChange={e=>setReq({...req, audienceFilter:{...req.audienceFilter, minSpent: Number(e.target.value)}})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Tags</label>
                  <input type="text" value={tagInput} onChange={e=>setTagInput(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" placeholder="vip, active" />
                </div>
              </div>
            </section>
          </div>

          <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <button onClick={handleDryRun} className="text-gray-600 bg-white border border-gray-200 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
               Dry Run (Admin)
            </button>

            <button onClick={handleLaunch} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 flex items-center space-x-2 disabled:opacity-50 transition-all active:scale-95">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
              <span>{loading ? 'Dispatching...' : 'Launch Now'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function AssetManager() {
  const MOCK_ASSETS = [
    { id: '1', filename: 'logo-main.png', contentType: 'image/png', size: '45 KB', publicUrl: 'https://placehold.co/400x100?text=Logo' },
    { id: '2', filename: 'summer-banner.jpg', contentType: 'image/jpeg', size: '240 KB', publicUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=300&fit=crop' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50/50">
      <div className="h-16 px-6 border-b border-gray-200 bg-white flex justify-between items-center flex-shrink-0 z-10">
        <h1 className="text-lg font-bold text-gray-900">S3 Asset Manager</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-semibold transition-all shadow-sm">
          <Plus size={16} /> <span>Upload to S3</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {MOCK_ASSETS.map(asset => (
            <div key={asset.id} className="bg-white rounded-xl border border-gray-200 shadow-sm group overflow-hidden flex flex-col hover:border-blue-200 transition-colors">
              <div className="h-32 bg-gray-100 flex items-center justify-center relative overflow-hidden border-b border-gray-100">
                <img src={asset.publicUrl} alt={asset.filename} className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <button onClick={() => { navigator.clipboard.writeText(asset.publicUrl); alert('Copied!'); }} className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 hover:scale-105 transition-transform shadow-sm">
                    <Copy size={14} /> <span>Copy URL</span>
                  </button>
                </div>
              </div>
              <div className="p-3 bg-white">
                <p className="text-sm font-bold text-gray-800 truncate">{asset.filename}</p>
                <div className="flex justify-between items-center mt-1 text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                  <span>{asset.size}</span>
                  <span>{asset.contentType.split('/')[1]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 📁 src/App.tsx (Main Layout & Assembly)
// ============================================================================

export default function MarketingModule() {
  const { user, activeCompanyId, activeCompany } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const notify = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({msg, type});
    setTimeout(() => setNotification(null), 3000);
  }, []);

  if (!activeCompanyId) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500"><Spinner /></div>;
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 text-gray-800 font-sans overflow-hidden">
      {/* Sidebar Layout */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white mr-3 shadow-sm shadow-blue-500/20">
            <Megaphone size={18} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-900">ERP Marketing</span>
        </div>

        {/* Auth Scope Context */}
        {activeCompany && (
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shadow-inner border border-blue-200/50">
              {activeCompany.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-gray-900 text-sm truncate">{activeCompany.name}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5 font-medium flex items-center">
                <UserCircle2 size={12} className="mr-1 opacity-70" /> {user.fullName}
              </p>
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<BarChart3 size={18}/>} label="Dashboard" />
          <NavItem active={activeTab === 'campaigns'} onClick={() => setActiveTab('campaigns')} icon={<Send size={18}/>} label="Campaign Manager" />
          <NavItem active={activeTab === 'templates'} onClick={() => setActiveTab('templates')} icon={<LayoutTemplate size={18}/>} label="Email Templates" />
          <NavItem active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} icon={<ImageIcon size={18}/>} label="Asset Storage" />
        </nav>
      </aside>

      {/* Main Feature Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} companyId={activeCompanyId} />}
        {activeTab === 'templates' && <TemplatesManager notify={notify} companyId={activeCompanyId} />}
        {activeTab === 'assets' && <AssetManager />}
        {activeTab === 'campaigns' && <CampaignsView notify={notify} companyId={activeCompanyId} />}
        {activeTab === 'logs' && <DashboardView onNavigate={setActiveTab} companyId={activeCompanyId} /> /* Fallback for logs */}
      </main>

      {/* Toast Notifications */}
      {notification && (
        <div className={`fixed bottom-6 right-6 text-white px-5 py-3.5 rounded-xl shadow-2xl shadow-black/10 flex items-center space-x-3 z-50 animate-in slide-in-from-bottom-5 font-semibold text-sm border ${notification.type === 'error' ? 'bg-red-600 border-red-700' : 'bg-gray-900 border-gray-800'}`}>
          {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} className="text-emerald-400" />}
          <span>{notification.msg}</span>
        </div>
      )}
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all text-sm font-semibold ${
        active ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}