import { Navigate, Route, Routes } from 'react-router-dom';
import LoginView from '../modules/auth/LoginView';
import DashboardView from '../modules/dashboard/components/DashboardView';
import DevicesView from '../modules/devices/components/DevicesView';
import EmployeesView from '../modules/employees/components/EmployeesView';
import StoresView from '../modules/stores/components/StoresView';
import { ComingSoonView } from '../components/ComingSoonView';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { MainLayout } from '../components/MainLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/devices" element={<DevicesView />} />
        <Route path="/stores" element={<StoresView />} />
        <Route path="/employees" element={<EmployeesView />} />
        <Route path="/inventory" element={<ComingSoonView module="inventory" />} />
        <Route path="/sales" element={<ComingSoonView module="sales" />} />
        <Route path="/analytics" element={<ComingSoonView module="analytics" />} />
        <Route path="/settings" element={<ComingSoonView module="settings" />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
