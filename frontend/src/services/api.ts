import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface DashboardStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  recent_orders: Order[];
  top_products: Product[];
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  sku: string | null;
  brand: string | null;
  thumbnail: string | null;
  image_url: string | null;
  gallery: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  sku?: string;
  is_active?: boolean;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderFormData {
  order_number: string;
  customer_name: string;
  customer_email?: string;
  total_amount: number;
  status?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerFormData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  is_active?: boolean;
}

export interface Admin {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  is_superuser: boolean;
}

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminToken {
  access_token: string;
  token_type: string;
  admin: Admin;
}

export const adminApi = {
  login: (data: AdminLoginData) => api.post<AdminToken>('/auth/admin/login', data),
};

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
  
  getProducts: () => api.get<Product[]>('/products'),
  getProduct: (id: number) => api.get<Product>(`/products/${id}`),
  createProduct: (data: ProductFormData) => api.post<Product>('/products', data),
  updateProduct: (id: number, data: ProductFormData) => api.put<Product>(`/products/${id}`, data),
  deleteProduct: (id: number) => api.delete(`/products/${id}`),
  
  getOrders: () => api.get<Order[]>('/orders'),
  getOrder: (id: number) => api.get<Order>(`/orders/${id}`),
  createOrder: (data: OrderFormData) => api.post<Order>('/orders', data),
  updateOrder: (id: number, data: OrderFormData) => api.put<Order>(`/orders/${id}`, data),
  deleteOrder: (id: number) => api.delete(`/orders/${id}`),
  
  getCategories: () => api.get<Category[]>('/categories'),
  getCategory: (id: number) => api.get<Category>(`/categories/${id}`),
  createCategory: (data: CategoryFormData) => api.post<Category>('/categories', data),
  updateCategory: (id: number, data: CategoryFormData) => api.put<Category>(`/categories/${id}`, data),
  deleteCategory: (id: number) => api.delete(`/categories/${id}`),
  
  getCustomers: () => api.get<Customer[]>('/customers'),
  getCustomer: (id: number) => api.get<Customer>(`/customers/${id}`),
  createCustomer: (data: CustomerFormData) => api.post<Customer>('/customers', data),
  updateCustomer: (id: number, data: CustomerFormData) => api.put<Customer>(`/customers/${id}`, data),
  deleteCustomer: (id: number) => api.delete(`/customers/${id}`),
};

export default api;
