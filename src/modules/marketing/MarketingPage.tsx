import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useActiveContext } from '@/hooks/useScope';

// Views
import { AnalyticsView } from './views/AnalyticsView';
import { AssetManager } from './views/AssetManager';
import { AudienceView } from './views/AudienceView';
import { CampaignsView } from './views/CampaignsView';
import { DashboardView } from './views/DashboardView';
import { TemplatesManager } from './views/TemplatesManager';
import { Spinner } from './components/MarketingShared';

export function MarketingPage() {
  const { companyId } = useActiveContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Give scope context a moment to resolve from URL before showing empty state
  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const notify = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({msg, type});
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const changeTab = (tab: string) => {
    setSearchParams({ tab });
  };

  if (!companyId) {
    if (isInitializing) return <Spinner />;
    return <div className="flex h-full items-center justify-center"><p style={{ color: 'var(--text-secondary)' }}>No active company context. Please select a company from the sidebar.</p></div>;
  }

  return (
    <div className="flex flex-col h-full w-full font-sans">
      
      {/* 100% Width Sleek Navigation Tabs */}
      <div className="flex space-x-6 border-b mb-6 px-2 sticky top-0 bg-[var(--background)] z-20" style={{ borderColor: 'var(--border)' }}>
        <TabItem active={activeTab === 'overview'} onClick={() => changeTab('overview')} label="Overview" />
        <TabItem active={activeTab === 'campaigns'} onClick={() => changeTab('campaigns')} label="Campaigns" />
        <TabItem active={activeTab === 'audience'} onClick={() => changeTab('audience')} label="Audience" />
        <TabItem active={activeTab === 'templates'} onClick={() => changeTab('templates')} label="Templates" />
        <TabItem active={activeTab === 'analytics'} onClick={() => changeTab('analytics')} label="Analytics" />
        <TabItem active={activeTab === 'assets'} onClick={() => changeTab('assets')} label="Assets" />
      </div>

      {/* Main Feature Content Container */}
      <div className="flex-1 min-h-0 w-full max-w-[1600px] mx-auto pb-10">
        {activeTab === 'overview' && <DashboardView onNavigate={changeTab} companyId={companyId} />}
        {activeTab === 'campaigns' && <CampaignsView notify={notify} companyId={companyId} searchParams={searchParams} setSearchParams={setSearchParams} />}
        {activeTab === 'audience' && <AudienceView companyId={companyId} />}
        {activeTab === 'templates' && <TemplatesManager notify={notify} companyId={companyId} />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'assets' && <AssetManager />}
      </div>

      {/* Global Toast Notifications */}
      {notification && (
        <div className={`fixed bottom-8 right-8 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center space-x-3 z-50 font-semibold text-sm border animate-in slide-in-from-bottom-5`} style={{ backgroundColor: notification.type === 'error' ? 'var(--danger)' : 'var(--text-primary)', borderColor: notification.type === 'error' ? 'var(--danger)' : 'var(--text-primary)' }}>
          {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />}
          <span>{notification.msg}</span>
        </div>
      )}
    </div>
  );
}

function TabItem({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`pb-3 px-1 text-sm font-bold transition-all relative cursor-pointer outline-none tracking-wide ${active ? '' : 'hover:opacity-70'}`}
      style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ backgroundColor: 'var(--accent)' }} />
      )}
    </button>
  );
}