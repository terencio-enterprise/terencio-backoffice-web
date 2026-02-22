import { Download, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PosStatusList } from "./PosStatusList";
import { SalesChart } from "./SalesChart";
import { StatsGrid } from "./StatsGrid";

export function DashboardPage() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('dashboard.title')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors cursor-pointer noSelect" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}>
            <Download className="w-4 h-4" /> {t('common.export')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer noSelect" style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}>
            <Plus className="w-4 h-4" /> {t('dashboard.newReport')}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesChart />
        <PosStatusList />
      </div>
    </div>
  );
}