import { cn } from "@/lib/utils";
import { LogOut, Store, User } from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
  menuItems: MenuItem[];
}

export function Sidebar({ isOpen, setIsOpen, activeModule, setActiveModule, menuItems }: SidebarProps) {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )} style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--accent)' }}>
          <Store className="w-6 h-6" style={{ color: 'var(--text-inverse)' }} />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight">RetailOS</h1>
          <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-tertiary)' }}>Enterprise</p>
        </div>
      </div>

      <nav className="px-4 mt-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveModule(item.id);
              if (window.innerWidth < 1024) setIsOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeModule === item.id ? "" : ""
            )}
            style={activeModule === item.id 
              ? { backgroundColor: 'var(--accent-light)', color: 'var(--accent)' } 
              : { color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => !activeModule || activeModule !== item.id ? e.currentTarget.style.backgroundColor = 'var(--surface-hover)' : null}
            onMouseLeave={(e) => !activeModule || activeModule !== item.id ? e.currentTarget.style.backgroundColor = 'transparent' : null}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
            {activeModule === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--surface-alt)' }}>
            <User className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Alex Rivera</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>Admin Profile</p>
          </div>
          <button className="transition-colors" style={{ color: 'var(--text-tertiary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}