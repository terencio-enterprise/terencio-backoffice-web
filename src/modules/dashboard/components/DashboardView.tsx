import React from "react";
import { CreditCard, Package, Users, BarChart3, Download, Plus } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SALES_DATA = [
  { name: "Mon", sales: 4000, orders: 240 },
  { name: "Tue", sales: 3000, orders: 198 },
  { name: "Wed", sales: 2000, orders: 980 },
  { name: "Thu", sales: 2780, orders: 390 },
  { name: "Fri", sales: 1890, orders: 480 },
  { name: "Sat", sales: 2390, orders: 380 },
  { name: "Sun", sales: 3490, orders: 430 },
];

const POS_DEVICES = [
  { id: "POS-001", location: "Main Counter", status: "Online", lastSync: "2 mins ago", version: "v2.4.1" },
  { id: "POS-002", location: "Bar Section", status: "Online", lastSync: "5 mins ago", version: "v2.4.1" },
  { id: "POS-003", location: "Outdoor Patio", status: "Offline", lastSync: "1 hour ago", version: "v2.3.9" },
  { id: "POS-004", location: "Kitchen Pickup", status: "Online", lastSync: "1 min ago", version: "v2.4.1" },
];

export default function DashboardView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Overview</h2>
          <p className="text-slate-500">Real-time performance across all retail branches.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> New Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$128,430", trend: "+12.5%", icon: CreditCard, color: "text-indigo-600" },
          { label: "Active Orders", value: "1,240", trend: "+4.3%", icon: Package, color: "text-emerald-600" },
          { label: "Staff on Duty", value: "42", trend: "0%", icon: Users, color: "text-blue-600" },
          { label: "Avg. Transaction", value: "$48.20", trend: "-2.1%", icon: BarChart3, color: "text-amber-600" },
        ].map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className={cn("text-xs mt-1 font-medium", stat.trend.startsWith("+") ? "text-emerald-600" : stat.trend === "0%" ? "text-slate-400" : "text-rose-600")}>
                  {stat.trend} <span className="text-slate-400 font-normal">vs last month</span>
                </p>
              </div>
              <div className={cn("p-2 rounded-lg bg-slate-50 dark:bg-slate-800", stat.color)}>
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
            <h3 className="font-semibold text-lg">Sales Performance</h3>
            <select className="text-sm border-none bg-slate-50 dark:bg-slate-800 rounded-md px-2 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: "#64748b"}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: "#64748b"}} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">POS Device Status</h3>
          <div className="space-y-4">
            {POS_DEVICES.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", device.status === "Online" ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                  <div>
                    <p className="text-sm font-medium">{device.location}</p>
                    <p className="text-xs text-slate-500">{device.id} • {device.version}</p>
                  </div>
                </div>
                <Badge variant={device.status === "Online" ? "success" : "default"}>{device.status}</Badge>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-indigo-600 font-medium hover:underline">View All Devices</button>
        </Card>
      </div>
    </div>
  );
}