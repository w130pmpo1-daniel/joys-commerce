import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/products', label: 'Products', icon: '📦' },
  { path: '/orders', label: 'Orders', icon: '🛒' },
  { path: '/customers', label: 'Customers', icon: '👥' },
  { path: '/categories', label: 'Categories', icon: '🏷️' },
  { path: '/analytics', label: 'Analytics', icon: '📈' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

interface Admin {
  email: string;
  full_name: string | null;
  username: string;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('admin_token');
    navigate('/admin/signin');
  };

  return (
    <aside className="w-64 bg-white border-r border-prodex-border h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-prodex-border">
        <h1 className="text-xl font-bold text-prodex-primary">Prodex</h1>
        <p className="text-xs text-prodex-muted">Admin Dashboard</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-prodex-primary text-white'
                  : 'text-prodex-muted hover:bg-prodex-bg-alt hover:text-prodex-text'
              }`
            }
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-prodex-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-prodex-accent flex items-center justify-center text-white font-medium">
              {admin?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-prodex-text">{admin?.full_name || admin?.username || 'Admin'}</p>
              <p className="text-xs text-prodex-muted">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-red-500 hover:text-red-700"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
