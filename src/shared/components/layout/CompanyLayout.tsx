
import { useTheme } from "@/shared/hooks/useTheme";
import {
  BarChart3,
  LayoutDashboard,
  Megaphone,
  Menu,
  Package,
  Settings,
  X
} from "lucide-react";
import { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { CompanySidebar } from "./CompanySidebar";
import { Topbar } from "./Topbar";


export function CompanyLayout() {
  const { companyId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode, setIsDarkMode } = useTheme();

  const menuItems = [
        { id: "overview", label: "Company Overview", icon: LayoutDashboard, path: "" },
        { id: "marketing", label: "Marketing", icon: Megaphone, path: "/marketing" },
        { id: "inventory", label: "Inventory", icon: Package, path: "/inventory" },
        { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
        { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
      ];

  return (
    <div className={isDarkMode ? "dark" : ""} style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}>
      <div className="min-h-screen flex flex-col lg:flex-row transition-colors">
        
        {/* Mobile Toggle (Visible only on small screens) */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b noSelect" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
              <LayoutDashboard className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />
            </div>
            <span className="font-bold text-lg">Terencio</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="cursor-pointer">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Main Sidebar */}
        <CompanySidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
          menuItems={menuItems}
          companyId={companyId ?? ''}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <Topbar 
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />

          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
            <Outlet />
          </div>
        </main>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-spin-slow { animation: spin-slow 8s linear infinite; }
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); }
        `}} />
      </div>
    </div>
  );
}
