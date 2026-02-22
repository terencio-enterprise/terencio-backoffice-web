import { LoginPage } from '@/features/auth/views/LoginPage';
import { CompanyPage } from '@/features/company/views/CompanyPage';
import { DashboardPage } from '@/features/dashboard/views/DashboardPage';
import { StorePage } from '@/features/store/views/StorePage';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { useAuth } from '@/shared/hooks/useAuth';
import { Store } from 'lucide-react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';


function ProtectedGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-[var(--accent)]">
            <Store className="w-9 h-9 text-white" />
          </div>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  // Public Routes
  { path: '/login', element: <LoginPage /> },

  // Protected App Shell
  {
    element: <ProtectedGuard />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          // Base Redirect (Handled by Layout or logic below)
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          
          // Contextual Routes: /:companySlug or /:companySlug/:storeSlug
          {
            path: ':companySlug',
            children: [
              { index: true, element: <CompanyPage /> },
              { path: ':storeSlug', element: <StorePage /> },
              
              // Nested Modules within Store/Company
              { path: 'inventory', element: <div>Inventory View</div> },
              { path: 'reports', element: <div>Reports View</div> },
              { path: 'settings', element: <div>Settings View</div> },
              { path: ':storeSlug/pos', element: <div>POS Terminal</div> }
            ]
          }
        ]
      }
    ]
  },

  // Fallback
  { path: '*', element: <Navigate to="/" replace /> }
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}