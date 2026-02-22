import { LoginPage } from '@/features/auth/views/LoginPage';
import { CompanyLayout } from '@/shared/components/layout/CompanyLayout';
import { useAuth } from '@/shared/hooks/useAuth';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';

function RootRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const firstCompany = user.companies?.[0];
  if (!firstCompany) return <div>No companies assigned</div>;

  return <Navigate to={`/c/${firstCompany.id}/overview`} replace />;
}

function ProtectedGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },

  {
    element: <ProtectedGuard />,
    children: [
      { path: '/', element: <RootRedirect /> },

      {
        path: '/c/:companyId',
        element: <CompanyLayout />,
        children: [
          { index: true, element: <Navigate to="overview" replace /> },

          { path: 'overview', element: <div>Company Dashboard</div> },

          /* CRM */
          { path: 'crm', element: <div>Customer List</div> },
          { path: 'crm/:uuid', element: <div>Customer Detail</div> },

          /* MARKETING */
          {
            path: 'marketing',
            children: [
              { index: true, element: <Navigate to="overview" replace /> },
              { path: 'overview', element: <div>Marketing Dashboard</div> },

              { path: 'campaigns', element: <div>Campaign List</div> },
              { path: 'campaigns/new', element: <div>Campaign Wizard</div> },
              { path: 'campaigns/:id', element: <div>Campaign Report</div> },

              { path: 'library/templates', element: <div>Template Gallery</div> },
              { path: 'library/templates/new', element: <div>Template Editor</div> },
              { path: 'library/templates/:id', element: <div>Template Editor</div> },

              { path: 'library/assets', element: <div>Media Library</div> },

              { path: 'settings', element: <div>Marketing Settings</div> },
            ]
          },

          /* OTHER MODULES */
          { path: 'inventory', element: <div>Inventory</div> },
          { path: 'settings', element: <div>Company Settings</div> },
        ]
      }
    ]
  },

  /* PUBLIC ROUTES */
  { path: '/p/preferences', element: <div>Preference Center</div> },
  { path: '/p/unsubscribe-confirm', element: <div>Unsubscribed</div> },
  { path: '/p/:companyId/lead', element: <div>Public Lead Form</div> },

  { path: '*', element: <Navigate to="/" replace /> }
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}