import { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';
import type { Category, CategoryFormData } from '../services/api';
import GenericForm from '../components/GenericForm';

const categoryFields = [
  { name: 'name', label: 'Category Name', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
];

const emptyCategory: CategoryFormData = {
  name: '',
  description: '',
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = () => {
    dashboardApi.getCategories()
      .then((res) => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = (data: CategoryFormData) => {
    dashboardApi.createCategory(data)
      .then(() => {
        setShowForm(false);
        fetchCategories();
      })
      .catch(console.error);
  };

  const handleUpdate = (data: CategoryFormData) => {
    if (!editingCategory) return;
    dashboardApi.updateCategory(editingCategory.id, data)
      .then(() => {
        setEditingCategory(null);
        fetchCategories();
      })
      .catch(console.error);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    dashboardApi.deleteCategory(id)
      .then(() => fetchCategories())
      .catch(console.error);
  };

  if (loading) return <div className="text-prodex-muted">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-prodex-text">Categories</h1>
          <p className="text-prodex-muted">Organize your products with categories</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-prodex-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-prodex-border shadow-sm p-8 text-center">
            <p className="text-prodex-muted">No categories found. Add your first category!</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl border border-prodex-border shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-prodex-text">{category.name}</h3>
                  <p className="text-sm text-prodex-muted mt-1">{category.description || 'No description'}</p>
                  <p className="text-xs text-prodex-muted mt-2">
                    Created: {new Date(category.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="p-2 text-prodex-primary hover:bg-prodex-bg-alt rounded-lg"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <GenericForm
          title="Add Category"
          fields={categoryFields}
          initialData={emptyCategory as unknown as Record<string, unknown>}
          onSubmit={(data) => handleCreate(data as unknown as CategoryFormData)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingCategory && (
        <GenericForm
          title="Edit Category"
          fields={categoryFields}
          initialData={editingCategory as unknown as Record<string, unknown>}
          onSubmit={(data) => handleUpdate(data as unknown as CategoryFormData)}
          onCancel={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
}
