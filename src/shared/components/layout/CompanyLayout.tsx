import type { CompanyResponse } from "@/core/types/organization";
import { CompanyService } from "@/features/company/services/company.service";
import { useTheme } from "@/shared/hooks/useTheme";
import { NotFoundPage } from "@/shared/view/NotFoundPage";
import { useScopeStore } from "@/store/useScopeStore";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { LoadingScreen } from "../ui/LoadingScreen";
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

  if (loading) return <LoadingScreen />

  if (!company) return <NotFoundPage />

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
          toggleDesktop={() => setIsDesktopCollapsed(prev => !prev)}
          companyId={companyId ?? ''}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-0">
          {/* Sticky Topbar */}
          <Topbar 
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            onToggleSidebar={() => setIsMobileOpen(true)}
          />

          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
            <div className="mx-auto max-w-[1600px] w-full h-full">
              <Outlet context={{ company }} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}