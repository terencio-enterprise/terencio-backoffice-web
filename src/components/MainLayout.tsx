import {
    BarChart3,
    CreditCard,
    LayoutDashboard,
    Menu,
    Package,
    Settings,
    Smartphone,
    Store,
    Users,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./layout/Sidebar";
import { Topbar } from "./layout/Topbar";

export function MainLayout() {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('terencio_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('terencio_theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('terencio_theme', 'light');
    }
  }, [isDarkMode]);

  const menuItems = [
    { id: "dashboard", label: t('menu.dashboard'), icon: LayoutDashboard, path: "/dashboard" },
    { id: "devices", label: t('menu.devices'), icon: Smartphone, path: "/devices" },
    { id: "stores", label: t('menu.stores'), icon: Store, path: "/stores" },
    { id: "inventory", label: t('menu.inventory'), icon: Package, path: "/inventory" },
    { id: "employees", label: t('menu.employees'), icon: Users, path: "/employees" },
    { id: "sales", label: t('menu.sales'), icon: CreditCard, path: "/sales" },
    { id: "analytics", label: t('menu.analytics'), icon: BarChart3, path: "/analytics" },
    { id: "settings", label: t('menu.settings'), icon: Settings, path: "/settings" },
  ];

  return (
    <div className={isDarkMode ? "dark" : ""} style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}>
      <div className="min-h-screen flex flex-col lg:flex-row transition-colors">
        
        {/* Mobile Toggle (Visible only on small screens) */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b noSelect" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
              <Store className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />
            </div>
            <span className="font-bold text-lg">Terencio</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="cursor-pointer">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Main Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
          menuItems={menuItems}
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
