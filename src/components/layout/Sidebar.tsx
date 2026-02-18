import { useAuth } from "@/hooks/useAuth";
import { useActiveContext } from "@/hooks/useScope";
import { cn } from "@/lib/utils";
import { LogOut, Store, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { ScopeSelector } from "./ScopeSelector";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  menuItems: MenuItem[];
}

export function Sidebar({ isOpen, setIsOpen, menuItems }: SidebarProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { companySlug, storeSlug } = useActiveContext();
  
  const buildPath = (basePath: string) => {
    if (!companySlug) return basePath;
    
    if (storeSlug) {
      return `/${companySlug}/${storeSlug}${basePath}`;
    } else {
      return `/${companySlug}${basePath}`;
    }
  };

  const isPathActive = (basePath: string) => {
    // Handle empty path (overview/home)
    if (basePath === '') {
      // Check if we're at the root company or store level
      const pathParts = location.pathname.split('/').filter(Boolean);
      if (storeSlug) {
        return pathParts.length === 2 && pathParts[0] === companySlug && pathParts[1] === storeSlug;
      } else {
        return pathParts.length === 1 && pathParts[0] === companySlug;
      }
    }
    
    // For other paths, check if pathname ends with the path
    return location.pathname.endsWith(basePath);
  };
  
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )} style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="p-6 flex items-center gap-3 noSelect">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--accent)' }}>
          <Store className="w-6 h-6" style={{ color: 'var(--text-inverse)' }} />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight">Terencio</h1>
          <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-tertiary)' }}>{t('branding.enterprise')}</p>
        </div>
      </div>

      {/* Scope Selector */}
      <div className="px-4 mb-4">
        <ScopeSelector />
      </div>

      <nav className="px-4 mt-4 space-y-1">
        {menuItems.map((item) => {
          const fullPath = buildPath(item.path);
          const isActive = isPathActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => {
                navigate(fullPath);
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer noSelect"
              style={isActive
                ? { backgroundColor: 'var(--accent-light)', color: 'var(--accent)' } 
                : { color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => !isActive ? e.currentTarget.style.backgroundColor = 'var(--surface-hover)' : null}
              onMouseLeave={(e) => !isActive ? e.currentTarget.style.backgroundColor = 'transparent' : null}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t noSelect" style={{ borderColor: 'var(--border-light)' }}>
        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--surface-alt)' }}>
            <User className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.fullName || user?.username || 'User'}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>Company Admin</p>
          </div>
          <button 
            onClick={logout}
            className="transition-colors cursor-pointer" 
            style={{ color: 'var(--text-tertiary)' }} 
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'} 
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
            title={t('auth.logout')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}