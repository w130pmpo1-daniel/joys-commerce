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
  thumbnail: string | null;
  gallery: string | null;
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

// Helper to proxy image URLs to bypass CORS
export const getProxyImageUrl = (imageUrl: string | null): string => {
  if (!imageUrl) return '';
  // If already a local path or data URL, return as is
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('/')) return imageUrl;
  // Shopify CDN images work directly without proxy
  if (imageUrl.includes('cdn.shopify.com')) return imageUrl;
  // Proxy other external URLs through backend
  return `http://localhost:8000/proxy-image?url=${encodeURIComponent(imageUrl)}`;
};

export const categoryApi = {
  getCategories: () => api.get<Category[]>('/categories'),
  getCategory: (id: number) => api.get<Category>(`/categories/${id}`),
};

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartAPIResponse {
  id: number;
  customer_id: number | null;
  session_id: string | null;
  items: Array<{
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
      thumbnail: string | null;
      image_url: string | null;
      price: number;
    };
  }>;
  total_amount: number;
}

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2) + Date.now().toString();
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

const getCustomerId = (): number | null => {
  const token = getStoredToken();
  if (!token) return null;
  const customer = localStorage.getItem('customer');
  if (!customer) return null;
  try {
    return JSON.parse(customer).id || null;
  } catch {
    return null;
  }
};

const mapAPIResponseToCartItems = (res: CartAPIResponse): CartItem[] => {
  return res.items.map(item => ({
    product: {
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      thumbnail: item.product.thumbnail,
      image_url: item.product.image_url,
      description: null,
      stock: 0,
      category: null,
      sku: null,
      brand: null,
      model: null,
      specifications: null,
      features: null,
      gallery: null,
      is_active: true,
      created_at: '',
      updated_at: ''
    },
    quantity: item.quantity
  }));
};

export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    const customerId = getCustomerId();
    const sessionId = getSessionId();
    const params = customerId ? `customer_id=${customerId}` : `session_id=${sessionId}`;
    try {
      const res = await api.get<CartAPIResponse>(`/cart?${params}`);
      return mapAPIResponseToCartItems(res.data);
    } catch {
      return [];
    }
  },
  addToCart: async (product: Product, quantity: number = 1): Promise<CartItem[]> => {
    const customerId = getCustomerId();
    const sessionId = getSessionId();
    try {
      const res = await api.post<CartAPIResponse>('/cart/add', {
        product_id: product.id,
        quantity,
        customer_id: customerId,
        session_id: customerId ? null : sessionId
      });
      return mapAPIResponseToCartItems(res.data);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      return cartApi.getCart();
    }
  },
  updateQuantity: async (_productId: number, _quantity: number): Promise<CartItem[]> => {
    return cartApi.getCart();
  },
  removeFromCart: async (_productId: number): Promise<CartItem[]> => {
    return cartApi.getCart();
  },
  clearCart: async (): Promise<CartItem[]> => {
    const customerId = getCustomerId();
    const sessionId = getSessionId();
    const params = customerId ? `customer_id=${customerId}` : `session_id=${sessionId}`;
    try {
      await api.delete(`/cart/clear?${params}`);
    } catch {}
    return [];
  },
};

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

export interface OrderCreate {
  order_number: string;
  customer_name: string;
  customer_email?: string;
  total_amount: number;
  status?: string;
}

export const orderApi = {
  createOrder: (data: OrderCreate) => api.post<Order>('/orders', data),
  getOrders: () => api.get<Order[]>('/orders'),
  getOrder: (id: number) => api.get<Order>(`/orders/${id}`),
};

export default api;
