import { Navigate, Route, Routes } from 'react-router-dom';
import { ComingSoonView } from '../components/ComingSoonView';
import { MainLayout } from '../components/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ScopedView } from '../components/layout/ScopedView';
import LoginView from '../modules/auth/LoginView';
import { CompanyView } from '../modules/company/CompanyView';
import { StoreView } from '../modules/store/StoreView';

export function AppRoutes() {
  return (
    <Routes>
      {/* Login Route - Public */}
      <Route path="/login" element={<LoginView />} />
      
      {/* Protected Routes with Hierarchical Slugs */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        {/* Company-level routes: /:companySlug */}
        <Route path="/:companySlug" element={
          <ScopedView requiresCompany>
            <CompanyView />
          </ScopedView>
        } />
        
        <Route path="/:companySlug/marketing" element={
          <ScopedView requiresCompany>
            <ComingSoonView module="Marketing" />
          </ScopedView>
        } />

        <Route path="/:companySlug/inventory" element={
          <ScopedView requiresCompany>
            <ComingSoonView module="Company Inventory" />
          </ScopedView>
        } />

        <Route path="/:companySlug/reports" element={
          <ScopedView requiresCompany>
            <ComingSoonView module="Company Reports" />
          </ScopedView>
        } />

        <Route path="/:companySlug/settings" element={
          <ScopedView requiresCompany>
            <ComingSoonView module="Company Settings" />
          </ScopedView>
        } />
        
        {/* Store-level routes: /:companySlug/:storeSlug */}
        <Route path="/:companySlug/:storeSlug" element={
          <ScopedView requiresStore>
            <StoreView />
          </ScopedView>
        } />

        <Route path="/:companySlug/:storeSlug/pos" element={
          <ScopedView requiresStore>
            <ComingSoonView module="Point of Sale" />
          </ScopedView>
        } />

        <Route path="/:companySlug/:storeSlug/inventory" element={
          <ScopedView requiresStore>
            <ComingSoonView module="Inventory" />
          </ScopedView>
        } />

        <Route path="/:companySlug/:storeSlug/reports" element={
          <ScopedView requiresStore>
            <ComingSoonView module="Store Reports" />
          </ScopedView>
        } />

        <Route path="/:companySlug/:storeSlug/settings" element={
          <ScopedView requiresStore>
            <ComingSoonView module="Store Settings" />
          </ScopedView>
        } />
      </Route>
      
      {/* Root redirect - will be handled by ScopeContext initialization */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
