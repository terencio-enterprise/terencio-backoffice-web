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
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { cn } from "./lib/utils";
import DashboardView from "./modules/dashboard/components/DashboardView";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pos", label: "POS Management", icon: Smartphone },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "employees", label: "Employees", icon: Users },
    { id: "sales", label: "Sales & Orders", icon: CreditCard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={cn("min-h-screen flex flex-col lg:flex-row transition-colors", isDarkMode ? "dark" : "")} style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}>
      
      {/* Mobile Toggle (Visible only on small screens) */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
            <Store className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />
          </div>
          <span className="font-bold text-lg">RetailOS</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Main Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        menuItems={menuItems}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar 
          activeModule={activeModule}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          {activeModule === "dashboard" ? (
            <DashboardView />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--surface-alt)' }}>
                <Settings className="w-10 h-10 animate-spin-slow" style={{ color: 'var(--text-tertiary)' }} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Module Under Construction</h2>
                <p className="max-w-sm mx-auto mt-2" style={{ color: 'var(--text-secondary)' }}>
                  The {activeModule} system is being integrated. Use the Dashboard to view current operational health.
                </p>
              </div>
              <button 
                onClick={() => setActiveModule("dashboard")}
                className="font-medium hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Return to Dashboard
              </button>
            </div>
          )}
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
  );
}