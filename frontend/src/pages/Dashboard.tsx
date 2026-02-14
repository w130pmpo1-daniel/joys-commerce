import { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';
import type { DashboardStats, Order, Product } from '../services/api';

const StatCard = ({ title, value, icon, trend }: { title: string; value: string | number; icon: string; trend?: string }) => (
  <div className="bg-white rounded-xl p-6 border border-prodex-border shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-prodex-muted mb-1">{title}</p>
        <p className="text-2xl font-bold text-prodex-text">{value}</p>
        {trend && (
          <p className="text-xs text-green-600 mt-1">{trend}</p>
        )}
      </div>
      <div className="w-12 h-12 rounded-lg bg-prodex-bg-alt flex items-center justify-center text-xl">
        {icon}
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-prodex-muted">Loading...</div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-prodex-text">Dashboard</h1>
        <p className="text-prodex-muted">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats?.total_users ?? 0} icon="👥" trend="+12%" />
        <StatCard title="Total Products" value={stats?.total_products ?? 0} icon="📦" trend="+5%" />
        <StatCard title="Total Orders" value={stats?.total_orders ?? 0} icon="🛒" trend="+8%" />
        <StatCard title="Total Revenue" value={`$${(stats?.total_revenue ?? 0).toLocaleString()}`} icon="💰" trend="+15%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-prodex-border shadow-sm">
          <h2 className="text-lg font-semibold text-prodex-text mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {stats?.recent_orders.length === 0 ? (
              <p className="text-prodex-muted text-sm">No orders yet</p>
            ) : (
              stats?.recent_orders.map((order: Order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-prodex-border last:border-0">
                  <div>
                    <p className="font-medium text-prodex-text">{order.order_number}</p>
                    <p className="text-sm text-prodex-muted">{order.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-prodex-text">${order.total_amount.toFixed(2)}</p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-prodex-border shadow-sm">
          <h2 className="text-lg font-semibold text-prodex-text mb-4">Top Products</h2>
          <div className="space-y-4">
            {stats?.top_products.length === 0 ? (
              <p className="text-prodex-muted text-sm">No products yet</p>
            ) : (
              stats?.top_products.map((product: Product) => (
                <div key={product.id} className="flex items-center justify-between py-3 border-b border-prodex-border last:border-0">
                  <div>
                    <p className="font-medium text-prodex-text">{product.name}</p>
                    <p className="text-sm text-prodex-muted">{product.category || 'Uncategorized'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-prodex-text">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-prodex-muted">{product.stock} in stock</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
