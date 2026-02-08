import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BarChart3, CreditCard, Download, Package, Plus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from "recharts";

export default function DashboardView() {
  const { t } = useTranslation();
  
  const SALES_DATA = [
    { name: t('dashboard.days.mon'), sales: 4000, orders: 240 },
    { name: t('dashboard.days.tue'), sales: 3000, orders: 198 },
    { name: t('dashboard.days.wed'), sales: 2000, orders: 980 },
    { name: t('dashboard.days.thu'), sales: 2780, orders: 390 },
    { name: t('dashboard.days.fri'), sales: 1890, orders: 480 },
    { name: t('dashboard.days.sat'), sales: 2390, orders: 380 },
    { name: t('dashboard.days.sun'), sales: 3490, orders: 430 },
  ];
  
  const POS_DEVICES = [
    { id: "POS-001", location: t('dashboard.locations.mainCounter'), status: t('badges.online'), lastSync: "2 mins ago", version: "v2.4.1" },
    { id: "POS-002", location: t('dashboard.locations.barSection'), status: t('badges.online'), lastSync: "5 mins ago", version: "v2.4.1" },
    { id: "POS-003", location: t('dashboard.locations.outdoorPatio'), status: t('badges.offline'), lastSync: "1 hour ago", version: "v2.3.9" },
    { id: "POS-004", location: t('dashboard.locations.kitchenPickup'), status: t('badges.online'), lastSync: "1 min ago", version: "v2.4.1" },
  ];
  
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 noSelect">
        {[
          { label: t('dashboard.totalRevenue'), value: "$128,430", trend: "+12.5%", icon: CreditCard, colorVar: "--accent" },
          { label: t('dashboard.activeOrders'), value: "1,240", trend: "+4.3%", icon: Package, colorVar: "--success" },
          { label: t('dashboard.staffOnDuty'), value: "42", trend: "0%", icon: Users, colorVar: "--info" },
          { label: t('dashboard.avgTransaction'), value: "$48.20", trend: "-2.1%", icon: BarChart3, colorVar: "--warning" },
        ].map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className="text-xs mt-1 font-medium" style={{ color: stat.trend.startsWith("+") ? "var(--success-text)" : stat.trend === "0%" ? "var(--text-tertiary)" : "var(--danger-text)" }}>
                  {stat.trend} <span className="font-normal" style={{ color: 'var(--text-tertiary)' }}>{t('dashboard.vsLastMonth')}</span>
                </p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--surface-alt)', color: `var(${stat.colorVar})` }}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">{t('dashboard.salesPerformance')}</h3>
            <select className="text-sm border-none rounded-md px-2 py-1 outline-none" style={{ backgroundColor: 'var(--surface-alt)' }}>
              <option>{t('dashboard.last7Days')}</option>
              <option>{t('dashboard.last30Days')}</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: "var(--text-secondary)"}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: "var(--text-secondary)"}} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">{t('dashboard.posDeviceStatus')}</h3>
          <div className="space-y-4">
            {POS_DEVICES.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", device.status === t('badges.online') ? "animate-pulse" : "")} style={{ backgroundColor: device.status === t('badges.online') ? "var(--success)" : "var(--text-tertiary)" }} />
                  <div>
                    <p className="text-sm font-medium">{device.location}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{device.id} • {device.version}</p>
                  </div>
                </div>
                <Badge variant={device.status === t('badges.online') ? "success" : "default"}>{device.status}</Badge>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-medium hover:underline" style={{ color: 'var(--accent)' }}>{t('dashboard.viewAllDevices')}</button>
        </Card>
      </div>
    </div>
  );
}