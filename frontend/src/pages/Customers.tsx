import { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';
import type { Customer, CustomerFormData } from '../services/api';
import GenericForm from '../components/GenericForm';

const customerFields = [
  { name: 'name', label: 'Customer Name', type: 'text' as const, required: true },
  { name: 'email', label: 'Email', type: 'email' as const },
  { name: 'phone', label: 'Phone', type: 'text' as const },
  { name: 'address', label: 'Address', type: 'textarea' as const },
  { name: 'city', label: 'City', type: 'text' as const },
  { name: 'country', label: 'Country', type: 'text' as const },
  { name: 'is_active', label: 'Active', type: 'checkbox' as const },
];

const emptyCustomer: CustomerFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  is_active: true,
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const fetchCustomers = () => {
    dashboardApi.getCustomers()
      .then((res) => setCustomers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreate = (data: CustomerFormData) => {
    dashboardApi.createCustomer(data)
      .then(() => {
        setShowForm(false);
        fetchCustomers();
      })
      .catch(console.error);
  };

  const handleUpdate = (data: CustomerFormData) => {
    if (!editingCustomer) return;
    dashboardApi.updateCustomer(editingCustomer.id, data)
      .then(() => {
        setEditingCustomer(null);
        fetchCustomers();
      })
      .catch(console.error);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    dashboardApi.deleteCustomer(id)
      .then(() => fetchCustomers())
      .catch(console.error);
  };

  if (loading) return <div className="text-prodex-muted">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-prodex-text">Customers</h1>
          <p className="text-prodex-muted">Manage your customer database</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-prodex-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          + Add Customer
        </button>
      </div>

      <div className="bg-white rounded-xl border border-prodex-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-prodex-bg-alt">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-prodex-border">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-prodex-muted">
                  No customers found. Add your first customer!
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-prodex-bg-alt">
                  <td className="px-6 py-4 font-medium text-prodex-text">{customer.name}</td>
                  <td className="px-6 py-4 text-prodex-muted">{customer.email || '-'}</td>
                  <td className="px-6 py-4 text-prodex-muted">{customer.phone || '-'}</td>
                  <td className="px-6 py-4 text-prodex-muted">{customer.city || '-'}</td>
                  <td className="px-6 py-4 text-prodex-muted">{customer.country || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {customer.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingCustomer(customer)}
                        className="p-2 text-prodex-primary hover:bg-prodex-bg-alt rounded-lg"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
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
          title="Add Customer"
          fields={customerFields}
          initialData={emptyCustomer as unknown as Record<string, unknown>}
          onSubmit={(data) => handleCreate(data as unknown as CustomerFormData)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingCustomer && (
        <GenericForm
          title="Edit Customer"
          fields={customerFields}
          initialData={editingCustomer as unknown as Record<string, unknown>}
          onSubmit={(data) => handleUpdate(data as unknown as CustomerFormData)}
          onCancel={() => setEditingCustomer(null)}
        />
      )}
    </div>
  );
}
