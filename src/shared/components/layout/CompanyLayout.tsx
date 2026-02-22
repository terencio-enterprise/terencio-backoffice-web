import type { CompanyResponse } from "@/core/types/organization";
import { CompanyService } from "@/features/company/services/company.service";
import { useTheme } from "@/shared/hooks/useTheme";
import { useScopeStore } from "@/store/useScopeStore";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { CompanySidebar } from "./CompanySidebar";
import { Topbar } from "./Topbar";

export function CompanyLayout() {
  const { companyId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode, setIsDarkMode } = useTheme();
  
  const setGlobalCompany = useScopeStore((state) => state.setCompany);
  
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;

    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const data = await CompanyService.getCompanyInfo(companyId);
        setCompany(data);
        setGlobalCompany(companyId); 
      } catch (error) {
        console.error("Failed to load company context:", error);
        setCompany(null);
        setGlobalCompany(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId, setGlobalCompany]);

  console.log(company);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-background text-text-secondary">
      {/* Replace with a proper Spinner component later */}
      <LayoutDashboard className="animate-spin-slow w-8 h-8" />
    </div>
  );

  if (!company) return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-danger">404</h1>
        <p className="text-text-secondary">Company not found or access denied.</p>
      </div>
    </div>
  );

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen flex flex-col lg:flex-row bg-background text-text-primary transition-colors">
        
        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-surface border-border noSelect">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-accent">
              <LayoutDashboard className="w-5 h-5 text-text-inverse" />
            </div>
            <span className="font-bold text-lg">Terencio</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="cursor-pointer">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Main Sidebar */}
        <CompanySidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
          companyId={companyId ?? ''}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <Topbar 
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />

          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
            <Outlet context={{ company }} />
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