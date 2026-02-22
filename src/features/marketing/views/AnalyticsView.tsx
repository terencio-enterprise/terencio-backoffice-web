import { Card } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { StatCard } from "../components/MarketingShared";
import { Mail, MousePointerClick, Users } from "lucide-react";

export function AnalyticsView() {
  const timeSeriesData = [
    { date: 'Feb 1', opens: 4000, clicks: 2400 },
    { date: 'Feb 5', opens: 3000, clicks: 1398 },
    { date: 'Feb 10', opens: 2000, clicks: 9800 },
    { date: 'Feb 15', opens: 2780, clicks: 3908 },
    { date: 'Feb 20', opens: 1890, clicks: 4800 },
    { date: 'Feb 25', opens: 2390, clicks: 3800 },
    { date: 'Feb 28', opens: 3490, clicks: 4300 },
  ];

  const deviceData = [
    { name: 'Apple Mail', value: 45 },
    { name: 'Gmail Mobile', value: 30 },
    { name: 'Gmail Desktop', value: 15 },
    { name: 'Outlook', value: 10 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Performance Analytics</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Deep dive into your marketing engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Opens" value="142,051" icon={<Mail />} />
        <StatCard title="Total Clicks" value="28,410" icon={<MousePointerClick />} />
        <StatCard title="Unsubscribe Rate" value="0.2%" icon={<Users />} trendUp={false} subtext="Healthy range" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Engagement Over Time (30 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--info)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--info)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: "var(--text-secondary)"}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: "var(--text-secondary)"}} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="opens" stroke="var(--accent)" fillOpacity={1} fill="url(#colorOpens)" strokeWidth={2} name="Opens" />
                <Area type="monotone" dataKey="clicks" stroke="var(--info)" fillOpacity={1} fill="url(#colorClicks)" strokeWidth={2} name="Clicks" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex flex-col">
          <h3 className="font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Client Breakdown</h3>
          <div className="flex-1 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: "var(--text-secondary)"}} width={100} />
                <Tooltip cursor={{fill: 'var(--surface-hover)'}} contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="var(--accent)" radius={[0, 4, 4, 0]} barSize={24} name="Percentage (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}