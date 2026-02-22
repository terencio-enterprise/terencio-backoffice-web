import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function PosStatusList() {
  const { t } = useTranslation();

  const POS_DEVICES = [
    { id: "POS-001", location: t('dashboard.locations.mainCounter'), status: t('badges.online'), lastSync: "2 mins ago", version: "v2.4.1" },
    { id: "POS-002", location: t('dashboard.locations.barSection'), status: t('badges.online'), lastSync: "5 mins ago", version: "v2.4.1" },
    { id: "POS-003", location: t('dashboard.locations.outdoorPatio'), status: t('badges.offline'), lastSync: "1 hour ago", version: "v2.3.9" },
    { id: "POS-004", location: t('dashboard.locations.kitchenPickup'), status: t('badges.online'), lastSync: "1 min ago", version: "v2.4.1" },
  ];

  return (
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
  );
}
