import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from "recharts";

export function SalesChart() {
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

  return (
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
  );
}
