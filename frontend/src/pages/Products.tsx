import { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';
import type { Product, ProductFormData } from '../services/api';
import ProductForm from '../components/ProductForm';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = () => {
    dashboardApi.getProducts()
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = (data: ProductFormData) => {
    dashboardApi.createProduct(data)
      .then(() => {
        setShowForm(false);
        fetchProducts();
      })
      .catch(console.error);
  };

  const handleUpdate = (data: ProductFormData) => {
    if (!editingProduct) return;
    dashboardApi.updateProduct(editingProduct.id, data)
      .then(() => {
        setEditingProduct(null);
        fetchProducts();
      })
      .catch(console.error);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    dashboardApi.deleteProduct(id)
      .then(() => fetchProducts())
      .catch(console.error);
  };

  if (loading) return <div className="text-prodex-muted">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-prodex-text">Products</h1>
          <p className="text-prodex-muted">Manage your product inventory</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-prodex-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-prodex-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-prodex-bg-alt">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-prodex-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-prodex-border">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-prodex-muted">
                  No products found. Add your first product!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-prodex-bg-alt">
                  <td className="px-6 py-4 font-medium text-prodex-text">{product.name}</td>
                  <td className="px-6 py-4 text-prodex-muted">{product.sku || '-'}</td>
                  <td className="px-6 py-4 text-prodex-text">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-prodex-text">{product.stock}</td>
                  <td className="px-6 py-4 text-prodex-muted">{product.category || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2 text-prodex-primary hover:bg-prodex-bg-alt rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
        <ProductForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleUpdate}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
