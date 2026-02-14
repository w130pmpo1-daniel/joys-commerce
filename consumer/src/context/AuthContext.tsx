import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

interface AuthContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  login: (customer: Customer) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer');
    const token = localStorage.getItem('token');
    if (storedCustomer && token) {
      setCustomer(JSON.parse(storedCustomer));
    }
    setLoading(false);
  }, []);

  const login = (customerData: Customer) => {
    setCustomer(customerData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customer');
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ 
      customer, 
      isAuthenticated: !!customer, 
      login, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
