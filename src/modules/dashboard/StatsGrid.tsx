import { Card } from "@/components/ui/card";
import { BarChart3, CreditCard, Package, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export function StatsGrid() {
  const { t } = useTranslation();

  const stats = [
    { label: t('dashboard.totalRevenue'), value: "$128,430", trend: "+12.5%", icon: CreditCard, colorVar: "--accent" },
    { label: t('dashboard.activeOrders'), value: "1,240", trend: "+4.3%", icon: Package, colorVar: "--success" },
    { label: t('dashboard.staffOnDuty'), value: "42", trend: "0%", icon: Users, colorVar: "--info" },
    { label: t('dashboard.avgTransaction'), value: "$48.20", trend: "-2.1%", icon: BarChart3, colorVar: "--warning" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 noSelect">
      {stats.map((stat, i) => (
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
  );
}
