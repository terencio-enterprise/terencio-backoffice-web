import { cn } from "@/core/lib/utils";
import { useAuth } from "@/shared/hooks/useAuth";
import { BarChart3, LayoutDashboard, LogOut, Megaphone, Package, Settings, Store, Users, X } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const menuGroups = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "" },
      { id: "reports", label: "Analytics & Reports", icon: BarChart3, path: "/reports" },
    ]
  },
  {
    label: "Operations",
    items: [
      { id: "marketing", label: "Marketing", icon: Megaphone, path: "/marketing" },
      { id: "inventory", label: "Inventory", icon: Package, path: "/inventory" },
      { id: "crm", label: "Customers", icon: Users, path: "/crm" },
    ]
  },
  {
    label: "System",
    items: [
      { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
    ]
  }
];

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isDesktopCollapsed: boolean;
  companyId: string;
}

export function CompanySidebar({ isMobileOpen, setIsMobileOpen, isDesktopCollapsed, companyId }: SidebarProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isPathActive = useCallback((path: string) => {
    const fullPath = `/c/${companyId}${path}`;
    if (path === "") return location.pathname === `/c/${companyId}` || location.pathname === `/c/${companyId}/`;
    return location.pathname.startsWith(fullPath);
  }, [location.pathname, companyId]);

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        isDesktopCollapsed ? "lg:w-20" : "w-72 lg:w-72"
      )} 
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Header / Brand */}
      <div className={cn("h-16 flex items-center px-6 border-b shrink-0 noSelect", isDesktopCollapsed ? "lg:justify-center lg:px-0" : "justify-between")} style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm shrink-0" style={{ backgroundColor: 'var(--accent)' }}>
            <Store className="w-4 h-4" style={{ color: 'var(--text-inverse)' }} />
          </div>
          <div className={cn("transition-opacity duration-200 overflow-hidden", isDesktopCollapsed ? "lg:hidden lg:w-0 lg:opacity-0" : "w-auto opacity-100")}>
            <h1 className="font-bold text-lg leading-none tracking-tight whitespace-nowrap">Terencio</h1>
            <p className="text-[9px] uppercase tracking-widest font-bold mt-0.5 whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>{t('branding.enterprise')}</p>
          </div>
        </div>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileOpen(false)} 
          className="lg:hidden p-1.5 rounded-md hover:bg-[var(--surface-hover)] transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-8 custom-scrollbar overflow-x-hidden" style={{ paddingLeft: isDesktopCollapsed ? '0.75rem' : '1rem', paddingRight: isDesktopCollapsed ? '0.75rem' : '1rem' }}>
        {menuGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col">
            <h3 className={cn("mb-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200", isDesktopCollapsed ? "lg:text-center lg:text-[10px] lg:opacity-50" : "px-3")} style={{ color: 'var(--text-tertiary)' }}>
              {isDesktopCollapsed ? "•••" : group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const fullPath = `/c/${companyId}${item.path}`;
                const isActive = isPathActive(item.path);
                
                return (
                  <button
                    key={item.id}
                    title={isDesktopCollapsed ? item.label : undefined}
                    onClick={() => {
                      navigate(fullPath);
                      if (window.innerWidth < 1024) setIsMobileOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all cursor-pointer noSelect group",
                      isActive && "shadow-sm",
                      isDesktopCollapsed ? "lg:justify-center py-3 lg:px-0 px-3" : "px-3 py-2.5"
                    )}
                    style={{
                      backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                      color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--surface-alt)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    <item.icon 
                      className={cn("w-5 h-5 transition-transform shrink-0", !isActive && "group-hover:scale-110")} 
                      style={{ color: isActive ? 'var(--text-inverse)' : 'var(--text-tertiary)' }}
                    />
                    <span className={cn("whitespace-nowrap transition-opacity duration-200", isDesktopCollapsed ? "lg:hidden lg:w-0 lg:opacity-0" : "w-auto opacity-100")}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile / Footer */}
      <div className="p-4 border-t shrink-0 noSelect" style={{ borderColor: 'var(--border)' }}>
        <div className={cn("flex items-center rounded-xl transition-colors hover:bg-[var(--surface-alt)]", isDesktopCollapsed ? "lg:justify-center p-2 lg:p-0" : "p-2 gap-3")}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-sm shrink-0" 
               style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
            {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </div>
          <div className={cn("flex-1 min-w-0 transition-opacity duration-200", isDesktopCollapsed ? "lg:hidden lg:w-0 lg:opacity-0" : "w-auto opacity-100")}>
            <p className="text-sm font-semibold truncate leading-tight whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
              {user?.fullName || user?.username || 'User'}
            </p>
            <p className="text-xs truncate mt-0.5 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
              {user?.username || 'Administrator'}
            </p>
          </div>
          <button 
            onClick={logout}
            className={cn("p-2 rounded-lg transition-colors cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30", isDesktopCollapsed ? "lg:hidden" : "")} 
            style={{ color: 'var(--text-tertiary)' }} 
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'} 
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
            title={t('auth.logout')}
          >
            <LogOut className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );
}