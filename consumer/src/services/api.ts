import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Customer {
  id: number;
  email: string;
  username: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  name?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  customer: Customer;
}

export const authApi = {
  register: (data: RegisterData) => api.post<Customer>('/auth/register', data),
  login: (data: LoginData) => api.post<Token>('/auth/login', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, new_password: string) => api.post('/auth/reset-password', { token, new_password }),
  getMe: (token: string) => api.get<Customer>('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
  updateProfile: (token: string, data: Partial<Customer>) => api.put<Customer>('/auth/profile', data, { headers: { Authorization: `Bearer ${token}` } }),
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export const getStoredToken = () => localStorage.getItem('token');

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  sku: string | null;
  brand: string | null;
  model: string | null;
  image_url: string | null;
  specifications: string | null;
  features: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export const productApi = {
  getProducts: (category?: string) => {
    const url = category ? `/products?category=${encodeURIComponent(category)}` : '/products';
    return api.get<Product[]>(url);
  },
  getProduct: (id: number) => api.get<Product>(`/products/${id}`),
};

export const categoryApi = {
  getCategories: () => api.get<Category[]>('/categories'),
  getCategory: (id: number) => api.get<Category>(`/categories/${id}`),
};

export interface CartItem {
  product: Product;
  quantity: number;
}

export const cartApi = {
  getCart: (): CartItem[] => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },
  addToCart: (product: Product, quantity: number = 1) => {
    const cart = cartApi.getCart();
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },
  updateQuantity: (productId: number, quantity: number) => {
    const cart = cartApi.getCart();
    const item = cart.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        return cartApi.removeFromCart(productId);
      }
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    return cart;
  },
  removeFromCart: (productId: number) => {
    const cart = cartApi.getCart().filter(item => item.product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },
  clearCart: () => {
    localStorage.setItem('cart', JSON.stringify([]));
    return [];
  },
};

export default api;
