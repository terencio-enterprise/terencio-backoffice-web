import { Card } from "@/components/ui/card";
import { useActiveContext } from "@/hooks/useScope";
import {
    AlertCircle,
    BarChart3,
    DollarSign,
    MapPin,
    Package,
    ShoppingCart,
    TrendingUp,
    Users
} from "lucide-react";

export function StoreView() {
  const { companyName, storeName } = useActiveContext();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{companyName}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>/</span>
            <h1 className="text-3xl font-bold tracking-tight">{storeName}</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Store Operations & Performance Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--success-light)' }}>
          <MapPin className="w-5 h-5" style={{ color: 'var(--success)' }} />
          <span className="font-semibold" style={{ color: 'var(--success)' }}>Store Level</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Today's Sales</p>
              <p className="text-2xl font-bold mt-2">$0.00</p>
              <p className="text-xs mt-1" style={{ color: 'var(--success)' }}>+0% vs yesterday</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--success-light)' }}>
              <DollarSign className="w-6 h-6" style={{ color: 'var(--success)' }} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Transactions</p>
              <p className="text-2xl font-bold mt-2">0</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Today</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-light)' }}>
              <ShoppingCart className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Active Staff</p>
              <p className="text-2xl font-bold mt-2">0</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>On duty now</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--info-light)' }}>
              <Users className="w-6 h-6" style={{ color: 'var(--info)' }} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Low Stock Items</p>
              <p className="text-2xl font-bold mt-2">0</p>
              <p className="text-xs mt-1" style={{ color: 'var(--warning)' }}>Needs attention</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--warning-light)' }}>
              <AlertCircle className="w-6 h-6" style={{ color: 'var(--warning)' }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Store Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Store Operations</h2>
          <div className="grid gap-4">
            <Card 
              className="p-6 cursor-pointer transition-all hover:shadow-md group"
              style={{ borderColor: 'var(--border)' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-light)' }}>
                  <ShoppingCart className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Point of Sale</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Process transactions and manage sales
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-6 cursor-pointer transition-all hover:shadow-md"
              style={{ borderColor: 'var(--border)' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--info-light)' }}>
                  <Package className="w-6 h-6" style={{ color: 'var(--info)' }} />
                </div>
                <div>
<h3 className="font-semibold mb-1">Inventory Management</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Track stock levels and manage products
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-6 cursor-pointer transition-all hover:shadow-md"
              style={{ borderColor: 'var(--border)' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--success-light)' }}>
                  <BarChart3 className="w-6 h-6" style={{ color: 'var(--success)' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Store Reports</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    View sales analytics and performance metrics
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sales Chart Placeholder */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
          <Card className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: 'var(--text-tertiary)' }} />
                <p className="text-lg font-medium mb-2">Sales Chart</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Sales data visualization will appear here
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                No recent activity to display
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
