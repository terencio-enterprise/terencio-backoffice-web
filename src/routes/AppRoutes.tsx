import { LoginPage } from '@/features/auth/views/LoginPage';
import { CompanyPage } from '@/features/company/views/CompanyPage';
import { CompanyLayout } from '@/shared/components/layout/CompanyLayout';
import { useAuth } from '@/shared/hooks/useAuth';
import { Store } from 'lucide-react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';

function RootRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const firstCompany = user.companies?.[0];
  
  if (!firstCompany) {
    return (
      <div className="h-screen flex items-center justify-center p-8 text-center bg-[var(--background)]">
        <div>
          <h1 className="text-xl font-bold mb-2">No Properties Found</h1>
          <p className="text-[var(--text-secondary)]">Your account does not have any companies assigned.</p>
        </div>
      </div>
    );
  }

  return <Navigate to={`/${firstCompany.id}`} replace />;
}

function ProtectedGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-[var(--accent)]">
            <Store className="w-9 h-9 text-white" />
          </div>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Initializing...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedGuard />,
    children: [
      {
        path: '/',
        element: <CompanyLayout />,
        children: [
          { index: true, element: <RootRedirect /> },
          {
            path: ':companyId',
            children: [
              { index: true, element: <CompanyPage /> },
              { path: 'marketing', element: <div>Marketing Dashboard</div> },
              { path: 'inventory', element: <div>Inventory View</div> },
              { path: 'settings', element: <div>Settings View</div> },
            ]
          }
        ]
      }
    ]
  },

  { path: '*', element: <Navigate to="/" replace /> }
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}