import React from "react";
import { cn } from "@/lib/utils";
import { Store, User, LogOut } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
  menuItems: any[];
}

export function Sidebar({ isOpen, setIsOpen, activeModule, setActiveModule, menuItems }: SidebarProps) {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
          <Store className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight">RetailOS</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Enterprise</p>
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
              activeModule === item.id 
                ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" 
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
            {activeModule === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Alex Rivera</p>
            <p className="text-xs text-slate-500 truncate">Admin Profile</p>
          </div>
          <button className="text-slate-400 hover:text-rose-500 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}