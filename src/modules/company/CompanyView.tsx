import { Card } from "@/components/ui/card";
import { useActiveContext, useScope } from "@/hooks/useScope";
import { Building2, MapPin, Store, TrendingUp, Users } from "lucide-react";

export function CompanyView() {
  const { companyName } = useActiveContext();
  const { activeCompany, switchStore } = useScope();

  const handleStoreClick = (storeId: string) => {
    const store = activeCompany?.stores.find(s => s.id === storeId);
    if (store) {
      switchStore(store);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{companyName}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Company Overview & Operations
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--accent-light)' }}>
          <Building2 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <span className="font-semibold" style={{ color: 'var(--accent)' }}>Company Level</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Stores</p>
              <p className="text-3xl font-bold mt-2">{activeCompany?.stores.length || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-light)' }}>
              <Store className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Active Employees</p>
              <p className="text-3xl font-bold mt-2">-</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--success-light)' }}>
              <Users className="w-6 h-6" style={{ color: 'var(--success)' }} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Monthly Revenue</p>
              <p className="text-3xl font-bold mt-2">-</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--info-light)' }}>
              <TrendingUp className="w-6 h-6" style={{ color: 'var(--info)' }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Store Selection Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Select a Store</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Choose a store to view detailed operations, inventory, and point of sale systems
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCompany?.stores.map((store) => (
            <Card
              key={store.id}
              className="p-6 cursor-pointer transition-all hover:shadow-lg"
              style={{ borderColor: 'var(--border)' }}
              onClick={() => handleStoreClick(store.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-light)' }}>
                  <MapPin className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1">{store.name}</h3>
                  <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                    /{store.slug}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Active</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {(!activeCompany?.stores || activeCompany.stores.length === 0) && (
            <Card className="p-8 col-span-full text-center">
              <Store className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-lg font-medium mb-2">No Stores Available</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                There are no stores configured for this company yet.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Company Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 cursor-pointer transition-all hover:shadow-md" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold mb-2">Marketing Dashboard</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Manage campaigns, promotions, and customer engagement across all stores
            </p>
          </Card>

          <Card className="p-6 cursor-pointer transition-all hover:shadow-md" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold mb-2">Company Reports</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              View aggregated analytics and performance metrics
            </p>
          </Card>

          <Card className="p-6 cursor-pointer transition-all hover:shadow-md" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold mb-2">Employee Management</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Manage staff, roles, and permissions across locations
            </p>
          </Card>

          <Card className="p-6 cursor-pointer transition-all hover:shadow-md" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold mb-2">Company Settings</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Configure company-wide preferences and integrations
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
