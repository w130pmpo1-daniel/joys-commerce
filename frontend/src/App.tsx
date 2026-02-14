import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Categories from './pages/Categories';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AdminLogin from './pages/AdminLogin';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const admin = localStorage.getItem('admin');
  if (!admin) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
}

function AppContent() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const admin = localStorage.getItem('admin');
    const path = window.location.pathname;
    if (!admin && path !== '/signin') {
      navigate('/signin', { replace: true });
    } else if (admin && path === '/signin') {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/signin" element={<AdminLogin />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="categories" element={<Categories />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter basename="/admin">
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
