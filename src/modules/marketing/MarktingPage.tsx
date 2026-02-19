import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Image as ImageIcon, LayoutTemplate,
  Mail,
  Megaphone,
  MoreVertical,
  Paperclip,
  Plus,
  Reply,
  Search,
  Send, Settings,
  Star,
  Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// --- MOCK DATA & TYPES ---

type TabType = 'dashboard' | 'templates' | 'campaigns' | 'assets' | 'logs';

interface Template {
  id: number;
  code: string;
  name: string;
  subject: string;
  bodyHtml: string;
  active: boolean;
}

interface Asset {
  id: string;
  filename: string;
  contentType: string;
  size: string;
  publicUrl: string;
  createdAt: string;
}

interface CampaignLog {
  id: number;
  campaignName: string;
  templateName: string;
  status: 'COMPLETED' | 'RUNNING' | 'FAILED';
  sentAt: string;
  stats: {
    sent: number;
    delivered: number;
    bounced: number;
    opened: number;
  }
}

const MOCK_TEMPLATES: Template[] = [
  {
    id: 1,
    code: 'WELCOME_01',
    name: 'New User Welcome',
    subject: 'Welcome to our platform, {{first_name}}! 🎉',
    bodyHtml: '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">\n  <h1 style="color: #2563eb;">Welcome aboard!</h1>\n  <p>Hi {{first_name}},</p>\n  <p>We are thrilled to have you here. Here are a few things to get you started:</p>\n  <ul>\n    <li>Complete your profile</li>\n    <li>Check out our latest assets</li>\n    <li>Say hi to the community</li>\n  </ul>\n  <br/>\n  <a href="#" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started</a>\n</div>',
    active: true
  },
  {
    id: 2,
    code: 'PROMO_SUMMER',
    name: 'Summer Sale Promo',
    subject: '☀️ Huge Summer Savings inside!',
    bodyHtml: '<div style="text-align: center; font-family: Arial;">\n  <h2>Summer Sale is ON</h2>\n  <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=300&fit=crop" style="max-width: 100%; border-radius: 8px;" />\n  <p style="font-size: 18px; margin-top: 20px;">Get up to 50% off on all items!</p>\n</div>',
    active: true
  }
];

const MOCK_ASSETS: Asset[] = [
  { id: '1', filename: 'logo-main.png', contentType: 'image/png', size: '45 KB', publicUrl: 'https://placehold.co/400x100?text=Company+Logo', createdAt: '2024-02-15' },
  { id: '2', filename: 'summer-banner.jpg', contentType: 'image/jpeg', size: '240 KB', publicUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=300&fit=crop', createdAt: '2024-05-10' },
  { id: '3', filename: 'product-shot-1.png', contentType: 'image/png', size: '1.2 MB', publicUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', createdAt: '2024-06-01' },
];

const MOCK_CAMPAIGNS: CampaignLog[] = [
  { id: 101, campaignName: 'Q1 Onboarding Boost', templateName: 'New User Welcome', status: 'COMPLETED', sentAt: '2024-03-01 10:00', stats: { sent: 1500, delivered: 1490, bounced: 10, opened: 850 } },
  { id: 102, campaignName: 'Summer Blowout', templateName: 'Summer Sale Promo', status: 'RUNNING', sentAt: '2024-06-15 08:30', stats: { sent: 45000, delivered: 44000, bounced: 200, opened: 12000 } },
];

// --- COMPONENTS ---

const Notification = ({ message, onClose }: { message: string, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center space-x-2 z-50 animate-in slide-in-from-bottom-5">
      <CheckCircle2 size={18} className="text-green-400" />
      <span>{message}</span>
    </div>
  );
};

export default function MarketingModule() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => setNotification(msg);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 flex items-center space-x-3 border-b">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Megaphone size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">Marketing</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<BarChart3 size={18}/>} label="Dashboard" />
          <NavItem active={activeTab === 'campaigns'} onClick={() => setActiveTab('campaigns')} icon={<Send size={18}/>} label="Campaigns" />
          <NavItem active={activeTab === 'templates'} onClick={() => setActiveTab('templates')} icon={<LayoutTemplate size={18}/>} label="Email Templates" />
          <NavItem active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} icon={<ImageIcon size={18}/>} label="Asset Manager" />
          <NavItem active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<Clock size={18}/>} label="Delivery Logs" />
        </nav>

        <div className="p-4 border-t text-sm text-gray-500 flex items-center space-x-2">
          <Settings size={16} />
          <span>Module Settings</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
        {activeTab === 'templates' && <TemplatesManager notify={notify} />}
        {activeTab === 'assets' && <AssetManager notify={notify} />}
        {activeTab === 'campaigns' && <CampaignsView notify={notify} templates={MOCK_TEMPLATES} />}
        {activeTab === 'logs' && <DeliveryLogsView />}
      </main>

      {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
    </div>
  );
}

// --- SUB-VIEWS ---

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-left ${
        active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function DashboardView({ onNavigate }: { onNavigate: (tab: TabType) => void }) {
  return (
    <div className="p-8 overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Marketing Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Sent (30d)" value="124,500" trend="+12%" icon={<Mail />} />
        <StatCard title="Avg. Open Rate" value="24.8%" trend="+2.1%" icon={<Users />} />
        <StatCard title="Active Campaigns" value="3" icon={<Send />} />
        <StatCard title="Asset Storage" value="1.2 GB" icon={<ImageIcon />} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Recent Campaigns</h2>
          <button onClick={() => onNavigate('campaigns')} className="text-blue-600 text-sm font-medium hover:underline">View All</button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-sm text-gray-500">
              <th className="pb-3 font-medium">Campaign Name</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Sent</th>
              <th className="pb-3 font-medium">Opened</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CAMPAIGNS.map(c => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="py-4 font-medium text-gray-900">{c.campaignName}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    c.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-4 text-gray-600">{c.stats.sent.toLocaleString()}</td>
                <td className="py-4 text-gray-600">{((c.stats.opened / c.stats.delivered) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend?: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && <p className="text-xs text-green-600 mt-1 font-medium">{trend} vs last month</p>}
      </div>
      <div className="p-3 bg-gray-50 rounded-lg text-gray-400">
        {icon}
      </div>
    </div>
  );
}

// --- TEMPLATES MANAGER & SPLIT SCREEN ---
function TemplatesManager({ notify }: { notify: (msg: string) => void }) {
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  if (editingTemplate) {
    return <TemplateEditor template={editingTemplate} onSave={(t) => { setEditingTemplate(null); notify('Template saved successfully'); }} onCancel={() => setEditingTemplate(null)} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Email Templates</h1>
          <p className="text-gray-500 text-sm">Manage and design your HTML email campaigns.</p>
        </div>
        <button onClick={() => setEditingTemplate({ id: Date.now(), code: 'NEW_TPL', name: 'New Template', subject: '', bodyHtml: '', active: true })} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors">
          <Plus size={18} /> <span>Create Template</span>
        </button>
      </div>
      
      <div className="p-6 flex-1 overflow-auto bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
        {MOCK_TEMPLATES.map(tpl => (
          <div key={tpl.id} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col overflow-hidden" onClick={() => setEditingTemplate(tpl)}>
            <div className="p-5 border-b flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">{tpl.code}</span>
                <span className={`w-2 h-2 rounded-full ${tpl.active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              </div>
              <h3 className="font-semibold text-lg mb-1">{tpl.name}</h3>
              <p className="text-sm text-gray-500 truncate" title={tpl.subject}>Subject: {tpl.subject}</p>
            </div>
            <div className="bg-gray-50 p-3 text-sm text-center text-blue-600 font-medium">
              Edit Template <ChevronRight size={16} className="inline" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplateEditor({ template, onSave, onCancel }: { template: Template, onSave: (t: Template) => void, onCancel: () => void }) {
  const [edited, setEdited] = useState<Template>(template);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Editor Header */}
      <div className="border-b p-4 flex justify-between items-center bg-gray-50">
        <div className="flex items-center space-x-4">
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-800">Cancel</button>
          <div className="h-6 w-px bg-gray-300"></div>
          <h2 className="font-semibold text-lg">{edited.id > 100000 ? 'New Template' : 'Editing: ' + edited.name}</h2>
        </div>
        <button onClick={() => onSave(edited)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium">Save Changes</button>
      </div>

      {/* Split Screen Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: Code & Settings Form */}
        <div className="w-1/2 flex flex-col border-r bg-white overflow-y-auto">
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Name</label>
                <input type="text" value={edited.name} onChange={e => setEdited({...edited, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Black Friday 2024" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unique Code</label>
                <input type="text" value={edited.code} onChange={e => setEdited({...edited, code: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject Line</label>
              <input type="text" value={edited.subject} onChange={e => setEdited({...edited, subject: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Supports {{variables}}" />
            </div>

            <div className="flex-1 flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">HTML Body</label>
                <span className="text-xs text-gray-500">Supports Liquid/Variables</span>
              </div>
              <textarea 
                value={edited.bodyHtml} 
                onChange={e => setEdited({...edited, bodyHtml: e.target.value})}
                className="w-full flex-1 border rounded-lg p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-50 text-gray-800"
                placeholder="<html>...</html>"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Live Gmail Clone Preview */}
        <div className="w-1/2 bg-gray-200 p-8 flex justify-center overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-fit min-h-[500px] border border-gray-300">
            
            {/* Gmail-like Header Toolbar */}
            <div className="bg-[#f2f6fc] px-4 py-3 flex items-center justify-between border-b border-gray-200">
              <div className="flex space-x-4 text-gray-600">
                <Reply size={18} className="cursor-pointer hover:text-gray-900" />
                <MoreVertical size={18} className="cursor-pointer hover:text-gray-900" />
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <Star size={18} className="cursor-pointer hover:text-yellow-400" />
                <span className="text-xs font-medium bg-gray-200 px-2 py-1 rounded">Inbox</span>
              </div>
            </div>

            {/* Email Metadata */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                M
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-xl font-normal text-gray-900 leading-tight">
                    {edited.subject || <span className="text-gray-400 italic">(No Subject)</span>}
                  </h3>
                  <span className="text-xs text-gray-500">10:42 AM (2 mins ago)</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-bold text-gray-800 mr-2">Marketing Team</span>
                  <span className="text-gray-500 mr-1">&lt;hello@company.com&gt;</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  to me <ChevronRight size={12} className="inline opacity-50" />
                </div>
              </div>
            </div>

            {/* Rendered HTML Content */}
            <div 
              className="p-6 overflow-auto email-preview-content"
              style={{ minHeight: '300px' }}
              dangerouslySetInnerHTML={{ __html: edited.bodyHtml || '<div style="color:#9ca3af; text-align:center; padding-top: 50px;">Start typing HTML to see preview</div>' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ASSET MANAGER ---
function AssetManager({ notify }: { notify: (msg: string) => void }) {
  const copyUrl = (url: string) => {
    // Fallback for document.execCommand
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      notify('Public URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b bg-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Asset Manager</h1>
          <p className="text-gray-500 text-sm">S3 Cloud public resources for campaigns.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium">
          <Plus size={18} /> <span>Upload Asset</span>
        </button>
      </div>
      
      <div className="p-6 flex-1 overflow-auto bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {MOCK_ASSETS.map(asset => (
            <div key={asset.id} className="bg-white rounded-xl border shadow-sm group overflow-hidden flex flex-col">
              <div className="h-32 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                {asset.contentType.startsWith('image/') ? (
                  <img src={asset.publicUrl} alt={asset.filename} className="object-cover w-full h-full" />
                ) : (
                  <Paperclip size={32} className="text-gray-400" />
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => copyUrl(asset.publicUrl)} className="bg-white text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-1 hover:bg-gray-100">
                    <Copy size={14} /> <span>Copy URL</span>
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate" title={asset.filename}>{asset.filename}</p>
                <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                  <span>{asset.size}</span>
                  <span className="uppercase">{asset.contentType.split('/')[1]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- CAMPAIGNS & LAUNCHER ---
function CampaignsView({ notify, templates }: { notify: (msg: string) => void, templates: Template[] }) {
  const [isLaunching, setIsLaunching] = useState(false);

  if (isLaunching) {
    return <CampaignLauncher onCancel={() => setIsLaunching(false)} notify={notify} templates={templates} />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b bg-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-gray-500 text-sm">Launch new blasts and view history.</p>
        </div>
        <button onClick={() => setIsLaunching(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium">
          <Send size={18} /> <span>New Campaign</span>
        </button>
      </div>
      
      <div className="p-6 flex-1 overflow-auto bg-gray-50">
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium text-gray-600">Campaign Name</th>
                <th className="p-4 font-medium text-gray-600">Template</th>
                <th className="p-4 font-medium text-gray-600">Sent At</th>
                <th className="p-4 font-medium text-gray-600">Status</th>
                <th className="p-4 font-medium text-gray-600">Stats</th>
                <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_CAMPAIGNS.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium">{c.campaignName}</td>
                  <td className="p-4 text-gray-600">{c.templateName}</td>
                  <td className="p-4 text-gray-600">{c.sentAt}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        c.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {c.status}
                      </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col text-sm">
                      <span>Sent: {c.stats.sent.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">Open Rate: {((c.stats.opened/c.stats.sent)*100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-blue-600 hover:underline text-sm font-medium">View Logs</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CampaignLauncher({ onCancel, notify, templates }: { onCancel: () => void, notify: (msg: string) => void, templates: Template[] }) {
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [excludePrevious, setExcludePrevious] = useState(true);

  const handleLaunch = () => {
    if (!name || !templateId) {
      alert("Please fill all required fields"); // Replaced with custom notify if needed, but simple validaton here
      return;
    }
    notify(`Campaign "${name}" launched successfully!`);
    onCancel();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <button onClick={onCancel} className="text-gray-500 hover:text-gray-900 mb-6 flex items-center space-x-1 text-sm font-medium">
        <ChevronRight size={16} className="rotate-180" /> <span>Back to Campaigns</span>
      </button>

      <div className="bg-white rounded-xl shadow-md border p-8">
        <h2 className="text-2xl font-bold mb-6 border-b pb-4">Launch New Campaign</h2>

        <div className="space-y-6">
          {/* Section 1: Setup */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">1. Campaign Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 2024 Black Friday Blast" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Template</label>
                <select value={templateId} onChange={e=>setTemplateId(e.target.value)} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">-- Choose a template --</option>
                  {templates.filter(t=>t.active).map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Audience Filter (Matching Backend DTO) */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">2. Audience Definition</h3>
            <div className="grid gap-4 md:grid-cols-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white outline-none">
                  <option>All Customers</option>
                  <option>B2B Only</option>
                  <option>B2C Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min. Spent ($)</label>
                <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Comma separated)</label>
                <input type="text" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" placeholder="vip, active" />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3 mt-4 border border-blue-100">
              <input 
                type="checkbox" 
                id="exclude" 
                checked={excludePrevious} 
                onChange={e => setExcludePrevious(e.target.checked)}
                className="mt-1"
              />
              <div>
                <label htmlFor="exclude" className="font-medium text-blue-900 block cursor-pointer">Exclude previous recipients</label>
                <p className="text-sm text-blue-700 mt-0.5">Do not send this email to leads who already received this exact template in the past to prevent spamming.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-8 flex items-center justify-between border-t">
            <button className="text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 flex items-center space-x-2">
               <span className="bg-gray-200 text-xs px-2 py-0.5 rounded uppercase tracking-wider">Dry Run</span>
               <span>Test send to me</span>
            </button>

            <div className="space-x-3">
              <button onClick={onCancel} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleLaunch} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm flex items-center space-x-2">
                <Send size={18} />
                <span>Launch Campaign</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- LOGS & ANALYTICS ---
function DeliveryLogsView() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b bg-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Delivery Logs</h1>
          <p className="text-gray-500 text-sm">Detailed events per lead (Sent, Bounced, Delivered).</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input type="text" placeholder="Search email or lead ID..." className="pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64" />
        </div>
      </div>
      
      <div className="p-6 flex-1 overflow-auto bg-gray-50">
        <div className="bg-white border rounded-xl shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium text-gray-600">Timestamp</th>
                <th className="p-4 font-medium text-gray-600">Lead / Email</th>
                <th className="p-4 font-medium text-gray-600">Template</th>
                <th className="p-4 font-medium text-gray-600">Event</th>
                <th className="p-4 font-medium text-gray-600">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-gray-50">
                <td className="p-4 text-gray-500">2024-06-15 08:31:42</td>
                <td className="p-4"><div className="font-medium">john.doe@example.com</div><div className="text-xs text-gray-400">ID: 8492</div></td>
                <td className="p-4">Summer Sale Promo</td>
                <td className="p-4"><span className="text-green-600 bg-green-50 px-2 py-1 rounded font-medium text-xs">DELIVERED</span></td>
                <td className="p-4 text-gray-500">-</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-4 text-gray-500">2024-06-15 08:31:45</td>
                <td className="p-4"><div className="font-medium">fake.email@bounce.com</div><div className="text-xs text-gray-400">ID: 9102</div></td>
                <td className="p-4">Summer Sale Promo</td>
                <td className="p-4"><span className="text-red-600 bg-red-50 px-2 py-1 rounded font-medium text-xs">BOUNCED</span></td>
                <td className="p-4 text-red-600 text-xs">550 5.1.1 User unknown</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-4 text-gray-500">2024-06-15 08:35:10</td>
                <td className="p-4"><div className="font-medium">john.doe@example.com</div><div className="text-xs text-gray-400">ID: 8492</div></td>
                <td className="p-4">Summer Sale Promo</td>
                <td className="p-4"><span className="text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium text-xs">OPENED</span></td>
                <td className="p-4 text-gray-500">User agent: Mozilla/5.0...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}