import MarketingModule from '@/modules/marketing/MarktingPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { PlaceholderPage } from '../components/layout/PlaceholderPage';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { ScopedView } from '../components/layout/ScopedView';
import { LoginPage } from '../modules/auth/LoginPage';
import { CompanyPage } from '../modules/company/CompanyPage';
import { StorePage } from '../modules/store/StorePage';


export function AppRoutes() {
  return (
    <Routes>
      {/* Login Route - Public */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Routes with Hierarchical Slugs */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        {/* Company-level routes: /:companySlug */}
        <Route path="/:companySlug" element={
          <ScopedView requiresCompany>
            <CompanyPage />
          </ScopedView>
        } />
        
        <Route path="/:companySlug/marketing" element={
          <ScopedView requiresCompany>
            <MarketingModule />
          </ScopedView>
        } />

        <Route path="/:companySlug/inventory" element={
          <ScopedView requiresCompany>
            <PlaceholderPage module="Company Inventory" />
          </ScopedView>
        } />

        <Route path="/:companySlug/reports" element={
          <ScopedView requiresCompany>
            <PlaceholderPage module="Company Reports" />
          </ScopedView>
        } />

        <Route path="/:companySlug/settings" element={
          <ScopedView requiresCompany>
            <PlaceholderPage module="Company Settings" />
          </ScopedView>
        } />
        
        {/* Store-level routes: /:companySlug/:storeSlug */}
        <Route path="/:companySlug/:storeSlug" element={
          <ScopedView requiresStore>
            <StorePage />
          </ScopedView>
        } />

        <Route path="/:companySlug/:storeSlug/pos" element={
          <ScopedView requiresStore>
            <PlaceholderPage module="Point of Sale" />
          </ScopedView>
        } />

        <Route path="/:companySlug/:storeSlug/inventory" element={
          <ScopedView requiresStore>
            <PlaceholderPage module="Inventory" />
          </ScopedView>
        } />

        <Route path="/:companySlug/:storeSlug/reports" element={
          <ScopedView requiresStore>
            <PlaceholderPage module="Store Reports" />
          </ScopedView>
        } />

        <Route path="/:companySlug/:storeSlug/settings" element={
          <ScopedView requiresStore>
            <PlaceholderPage module="Store Settings" />
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
