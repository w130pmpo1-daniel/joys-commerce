import { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';
import type { Order, OrderFormData } from '../services/api';
import GenericForm from '../components/GenericForm';

const orderStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const orderFields = [
  { name: 'order_number', label: 'Order Number', type: 'text' as const, required: true },
  { name: 'customer_name', label: 'Customer Name', type: 'text' as const, required: true },
  { name: 'customer_email', label: 'Customer Email', type: 'email' as const },
  { name: 'total_amount', label: 'Total Amount', type: 'number' as const, required: true },
  { name: 'status', label: 'Status', type: 'select' as const, options: orderStatusOptions },
];

const emptyOrder: OrderFormData = {
  order_number: '',
  customer_name: '',
  customer_email: '',
  total_amount: 0,
  status: 'pending',
};

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

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const fetchOrders = () => {
    dashboardApi.getOrders()
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreate = (data: OrderFormData) => {
    dashboardApi.createOrder(data)
      .then(() => {
        setShowForm(false);
        fetchOrders();
      })
      .catch(console.error);
  };

  const handleUpdate = (data: OrderFormData) => {
    if (!editingOrder) return;
    dashboardApi.updateOrder(editingOrder.id, data)
      .then(() => {
        setEditingOrder(null);
        fetchOrders();
      })
      .catch(console.error);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    dashboardApi.deleteOrder(id)
      .then(() => fetchOrders())
      .catch(console.error);
  };

  if (loading) return <div className="text-prodex-muted">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-prodex-text">Orders</h1>
          <p className="text-prodex-muted">Manage customer orders</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-prodex-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          + Create Order
        </button>
      </div>

      <div className="bg-white rounded-xl border border-prodex-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-prodex-bg-alt">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Order #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-prodex-border">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-prodex-muted">
                  No orders found. Create your first order!
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-prodex-bg-alt">
                  <td className="px-6 py-4 font-medium text-prodex-text">{order.order_number}</td>
                  <td className="px-6 py-4 text-prodex-text">{order.customer_name}</td>
                  <td className="px-6 py-4 text-prodex-muted">{order.customer_email || '-'}</td>
                  <td className="px-6 py-4 font-medium text-prodex-text">${order.total_amount.toFixed(2)}</td>
                  <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-6 py-4 text-prodex-muted">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingOrder(order)}
                        className="p-2 text-prodex-primary hover:bg-prodex-bg-alt rounded-lg"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <GenericForm
          title="Create Order"
          fields={orderFields}
          initialData={emptyOrder as unknown as Record<string, unknown>}
          onSubmit={(data) => handleCreate(data as unknown as OrderFormData)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingOrder && (
        <GenericForm
          title="Edit Order"
          fields={orderFields}
          initialData={editingOrder as unknown as Record<string, unknown>}
          onSubmit={(data) => handleUpdate(data as unknown as OrderFormData)}
          onCancel={() => setEditingOrder(null)}
        />
      )}
    </div>
  );
}
