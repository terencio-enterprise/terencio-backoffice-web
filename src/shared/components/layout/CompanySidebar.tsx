// CompanySidebar.tsx

import { cn } from "@/core/lib/utils";
import { useAuth } from "@/shared/hooks/useAuth";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Package,
  Settings,
  Store,
  Users,
  X,
} from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { CompanySelector } from "./CompanySelector";

const menuGroups = [
  {
    labelKey: "sidebar.groups.overview",
    items: [
      { id: "dashboard", labelKey: "sidebar.dashboard", icon: LayoutDashboard, path: "" },
      { id: "reports", labelKey: "sidebar.reports", icon: BarChart3, path: "/reports" },
    ],
  },
  {
    labelKey: "sidebar.groups.operations",
    items: [
      { id: "marketing", labelKey: "sidebar.marketing", icon: Megaphone, path: "/marketing" },
      { id: "inventory", labelKey: "sidebar.inventory", icon: Package, path: "/inventory" },
      { id: "crm", labelKey: "sidebar.customers", icon: Users, path: "/crm" },
    ],
  },
  {
    labelKey: "sidebar.groups.system",
    items: [
      { id: "settings", labelKey: "sidebar.settings", icon: Settings, path: "/settings" },
    ],
  },
];

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isDesktopCollapsed: boolean;
  toggleDesktop: () => void;
  companyId: string;
}

export function CompanySidebar({
  isMobileOpen,
  setIsMobileOpen,
  isDesktopCollapsed,
  toggleDesktop,
  companyId,
}: SidebarProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isPathActive = useCallback(
    (path: string) => {
      const fullPath = `/c/${companyId}${path}`;
      if (path === "") {
        return (
          location.pathname === `/c/${companyId}` ||
          location.pathname === `/c/${companyId}/`
        );
      }
      return location.pathname.startsWith(fullPath);
    },
    [location.pathname, companyId]
  );

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-300 ease-in-out",
        "lg:relative lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        isDesktopCollapsed ? "w-16 lg:w-16" : "w-72 lg:w-72"
      )}
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div
        className={cn(
          "h-16 flex items-center border-b shrink-0",
          isDesktopCollapsed ? "justify-center" : "justify-between px-5"
        )}
        style={{ borderColor: "var(--border)" }}
      >
        {!isDesktopCollapsed && (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <Store className="w-4 h-4" style={{ color: "var(--text-inverse)" }} />
            </div>
            <div className="leading-tight">
              <h1 className="font-semibold text-sm">Terencio</h1>
              <p
                className="text-[10px] uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                {t("branding.enterprise")}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDesktop}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md cursor-pointer hover:bg-[var(--surface-hover)]"
            style={{ color: "var(--text-secondary)" }}
            aria-label={t("sidebar.toggle")}
          >
            {isDesktopCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-md cursor-pointer hover:bg-[var(--surface-hover)]"
            style={{ color: "var(--text-secondary)" }}
            aria-label={t("common.close")}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className={cn("px-3 pt-3", isDesktopCollapsed && "px-2")}>
        <CompanySelector collapsed={isDesktopCollapsed} />
      </div>

      <nav className="flex-1 overflow-y-auto py-6 space-y-6 px-2">
        {menuGroups.map((group) => (
          <div key={group.labelKey}>
            {!isDesktopCollapsed && (
              <p
                className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                {t(group.labelKey)}
              </p>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const fullPath = `/c/${companyId}${item.path}`;
                const isActive = isPathActive(item.path);

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(fullPath);
                      if (window.innerWidth < 1024) setIsMobileOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center rounded-md text-sm transition-all duration-150 cursor-pointer",
                      isDesktopCollapsed
                        ? "justify-center h-10"
                        : "gap-3 px-3 py-2",
                      isActive && "font-medium"
                    )}
                    style={{
                      backgroundColor: isActive
                        ? "var(--accent-light)"
                        : "transparent",
                      color: isActive
                        ? "var(--accent)"
                        : "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.backgroundColor = "var(--surface-hover)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!isDesktopCollapsed && <span>{t(item.labelKey)}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t p-1.5" style={{ borderColor: "var(--border)" }}>
        <div
          className={cn(
            "flex items-center rounded-md transition-colors cursor-pointer hover:bg-[var(--surface-hover)]",
            isDesktopCollapsed ? "justify-center p-2" : "gap-3 p-2"
          )}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{
              backgroundColor: "var(--surface-alt)",
              color: "var(--accent)",
            }}
          >
            {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
          </div>

          {!isDesktopCollapsed && (
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {user?.fullName || user?.username || t("common.user")}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "var(--text-secondary)" }}
              >
                {user?.username || t("common.administrator")}
              </p>
            </div>
          )}

          {!isDesktopCollapsed && (
            <button
              onClick={logout}
              className="p-1.5 rounded-md cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30"
              style={{ color: "var(--text-tertiary)" }}
              aria-label={t("auth.logout")}
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}