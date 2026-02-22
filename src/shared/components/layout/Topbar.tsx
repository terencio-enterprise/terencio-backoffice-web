import { Bell, ChevronRight, Menu, Moon, Search, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

interface TopbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  onToggleSidebar: () => void;
}

export function Topbar({ isDarkMode, setIsDarkMode, onToggleSidebar }: TopbarProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  
  // Extract clean module name from URL for breadcrumb
  const pathSegments = location.pathname.split('/').filter(Boolean);
  // Example path: /c/{companyId}/marketing -> "marketing"
  let companyId = '';
  let moduleName = 'Overview';
  let modulePath = '';

  if (pathSegments.length >= 2 && pathSegments[0] === 'c') {
      companyId = pathSegments[1];
      modulePath = `/c/${companyId}`;
  }
  if (pathSegments.length > 2) {
      moduleName = pathSegments[2];
      modulePath = `/c/${companyId}/${moduleName}`;
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };
  
  return (
    <header 
      className="h-16 border-b flex items-center justify-between px-4 md:px-6 shrink-0 z-10 transition-colors noSelect sticky top-0" 
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
        
        {/* Mobile Sidebar Toggle (Hidden on Desktop) */}
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-md transition-colors hover:bg-[var(--surface-hover)] cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <div className="hidden sm:flex items-center text-sm font-medium gap-2 shrink-0" style={{ color: 'var(--text-secondary)' }}>
          <Link 
            to={companyId ? `/c/${companyId}` : "/"} 
            className="transition-colors hover:underline cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            {t('branding.name')}
          </Link>
          <ChevronRight className="w-4 h-4 opacity-50" />
          <Link 
            to={modulePath || (companyId ? `/c/${companyId}` : "/")}
            className="capitalize transition-colors hover:underline cursor-pointer" 
            style={{ color: 'var(--text-primary)' }}
          >
             {t(`menu.${moduleName}`, moduleName)}
          </Link>
        </div>

        {/* Global Search */}
        <div className="max-w-md w-full ml-auto md:ml-4 lg:ml-8 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors group-focus-within:text-[var(--accent)]" style={{ color: 'var(--text-tertiary)' }} />
          <input 
            type="text" 
            placeholder={t('topbar.search')} 
            className="w-full pl-9 pr-4 py-2 border rounded-full text-sm outline-none transition-all duration-300 focus:shadow-sm focus:border-[var(--accent)]"
            style={{ 
              backgroundColor: 'var(--background)', 
              borderColor: 'var(--border)',
              color: 'var(--text-primary)' 
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 md:gap-3 ml-4 shrink-0">
        
        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="p-2 rounded-full transition-colors cursor-pointer text-xs font-bold hover:bg-[var(--surface-alt)]"
          style={{ color: 'var(--text-secondary)' }}
          title={i18n.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          {i18n.language === 'es' ? 'ES' : 'EN'}
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full transition-colors cursor-pointer hover:bg-[var(--surface-alt)]"
          style={{ color: 'var(--text-secondary)' }}
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
        </button>

        {/* Separator */}
        <div className="h-6 w-[1px] mx-1" style={{ backgroundColor: 'var(--border)' }}></div>

        {/* Notifications */}
        <button 
          className="relative p-2 rounded-full transition-colors cursor-pointer hover:bg-[var(--surface-alt)]" 
          style={{ color: 'var(--text-secondary)' }}
        >
          <Bell className="w-4 h-4 md:w-5 md:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border-2" 
                style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--surface)' }}></span>
        </button>
      </div>
    </header>
  );
}