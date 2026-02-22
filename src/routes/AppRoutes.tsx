import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { LoginPage } from '../modules/auth/LoginPage';

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const auth = useContext(AuthContext);
//   if (!auth) return null;
//   if (auth.loading) return <div className="p-10 text-center font-bold">Verifying Session...</div>;
//   return auth.user ? <>{children}</> : <Navigate to="/login" replace />;
// };

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  
  // Admin Routes (Authenticated)
  {
    path: '/c/:companyId',
    // element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="crm" replace /> },
      { path: 'crm', element: <div className="text-2xl font-bold">Customer Directory</div> },
      { path: 'crm/:uuid', element: <div className="text-2xl font-bold">Customer Profile View</div> },
      {
        path: 'marketing',
        children: [
          { path: 'overview', element: <div className="text-2xl font-bold">Marketing Dashboard</div> },
          { path: 'campaigns', element: <div className="text-2xl font-bold">Campaign List</div> },
          { path: 'templates', element: <div className="text-2xl font-bold">Template Gallery</div> },
          { path: 'settings', element: <div className="text-2xl font-bold">Module Config</div> }
        ]
      }
    ]
  },

  // Public Routes (Unauthenticated)
  {
    path: '/p',
    children: [
      { path: 'preferences', element: <div className="p-20 text-center text-3xl font-black">Preferences Center</div> },
      { path: ':companyId/lead', element: <div className="p-20 text-center text-3xl font-black">Lead Capture Form</div> }
    ]
  },

  // Root Redirect
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '*', element: <Navigate to="/" replace /> }
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}