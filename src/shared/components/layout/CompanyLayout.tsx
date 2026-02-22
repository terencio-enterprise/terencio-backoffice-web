import type { CompanyResponse } from "@/core/types/organization";
import { CompanyService } from "@/features/company/services/company.service";
import { useTheme } from "@/shared/hooks/useTheme";
import { useScopeStore } from "@/store/useScopeStore";
import { LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { CompanySidebar } from "./CompanySidebar";
import { Topbar } from "./Topbar";

export function CompanyLayout() {
  const { companyId } = useParams();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const { isDarkMode, setIsDarkMode } = useTheme();
  
  const setActiveCompany = useScopeStore((state) => state.setActiveCompany);
  
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;

    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const data = await CompanyService.getCompanyInfo(companyId);
        setCompany(data);
        setActiveCompany(data); 
      } catch (error) {
        console.error("Failed to load company context:", error);
        setCompany(null);
        setActiveCompany(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId, setActiveCompany]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleToggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setIsDesktopCollapsed(prev => !prev);
    } else {
      setIsMobileOpen(prev => !prev);
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4">
        <LayoutDashboard className="animate-spin-slow w-8 h-8" style={{ color: 'var(--accent)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Loading Workspace...</p>
      </div>
    </div>
  );

  if (!company) return (
    <div className="h-screen w-full flex items-center justify-center bg-[var(--background)]">
      <div className="text-center p-8 rounded-2xl border bg-[var(--surface)] shadow-lg" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--danger)' }}>404</h1>
        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Company not found</p>
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>The workspace you are looking for does not exist or access is denied.</p>
      </div>
    </div>
  );

  return (
    <div className={isDarkMode ? "dark" : ""}>
      {/* Root Container */}
      <div className="flex h-screen w-full overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}>
        
        {/* Mobile Sidebar Backdrop */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar (Fixed on Desktop, Drawer on Mobile) */}
        <CompanySidebar 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          isDesktopCollapsed={isDesktopCollapsed}
          companyId={companyId ?? ''}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-0">
          {/* Sticky Topbar */}
          <Topbar 
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            onToggleSidebar={handleToggleSidebar}
          />

          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
            <div className="mx-auto max-w-[1600px] w-full h-full">
              <Outlet context={{ company }} />
            </div>
          </main>
        </div>

        {/* Global Keyframes & Scrollbar styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-spin-slow { animation: spin-slow 3s linear infinite; }
          .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary); }
        `}} />
      </div>
    </div>
  );
}