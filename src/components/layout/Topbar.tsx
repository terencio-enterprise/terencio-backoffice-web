import { Bell, ChevronDown, ChevronRight, Moon, Search, Sun } from "lucide-react";

interface TopbarProps {
  activeModule: string;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export function Topbar({ activeModule, isDarkMode, setIsDarkMode }: TopbarProps) {
  return (
    <header className="h-16 border-b flex items-center justify-between px-4 lg:px-8 shrink-0" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-4 flex-1">
        <div className="hidden md:flex items-center text-sm gap-2" style={{ color: 'var(--text-secondary)' }}>
          <span>RetailOS</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>{activeModule}</span>
        </div>
        <div className="max-w-md w-full ml-4 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              placeholder="Search orders, staff, inventory..." 
              className="w-full pl-10 pr-4 py-2 border-none rounded-lg text-sm focus:ring-2 transition-all outline-none"
              style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="relative p-2 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2" style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--surface)' }}></span>
        </button>
        <div className="h-8 w-[1px] mx-2 hidden sm:block" style={{ backgroundColor: 'var(--border)' }}></div>
        <div className="hidden sm:flex items-center gap-2 cursor-pointer p-1.5 rounded-lg transition-colors" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          <div className="text-right">
            <p className="text-xs font-bold leading-none">Main Store</p>
            <p className="text-[10px] font-medium leading-none mt-1" style={{ color: 'var(--success)' }}>Status: Open</p>
          </div>
          <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        </div>
      </div>
    </header>
  );
}