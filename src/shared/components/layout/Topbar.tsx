import { Bell, ChevronRight, Moon, Search, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

interface TopbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export function Topbar({ isDarkMode, setIsDarkMode }: TopbarProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const moduleName = location.pathname.split('/').filter(Boolean).pop() || 'overview';
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };
  
  return (
    <header className="h-16 border-b flex items-center justify-between px-4 lg:px-8 shrink-0 noSelect" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-4 flex-1">
        <div className="hidden md:flex items-center text-sm gap-2" style={{ color: 'var(--text-secondary)' }}>
          <span>{t('branding.name')}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>{t(`menu.${moduleName}`, moduleName)}</span>
        </div>
        <div className="max-w-md w-full ml-4 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              placeholder={t('topbar.search')} 
              className="w-full pl-10 pr-4 py-2 border-none rounded-lg text-sm focus:ring-2 transition-all outline-none"
              style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button 
          onClick={toggleLanguage}
          className="p-2 rounded-lg transition-colors cursor-pointer text-xs font-bold"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title={i18n.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          {i18n.language === 'es' ? 'ES' : 'EN'}
        </button>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg transition-colors cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="relative p-2 rounded-lg transition-colors cursor-pointer" style={{ color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2" style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--surface)' }}></span>
        </button>
        <div className="h-8 w-[1px] mx-2 hidden sm:block" style={{ backgroundColor: 'var(--border)' }}></div>
      </div>
    </header>
  );
}