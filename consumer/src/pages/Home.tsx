import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredToken } from '../services/api';

export default function Home() {
  const [customer, setCustomer] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    getStoredToken();
    const storedCustomer = localStorage.getItem('customer');
    if (storedCustomer) {
      setCustomer(JSON.parse(storedCustomer));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customer');
    setCustomer(null);
  };

  return (
    <div className="min-h-screen bg-[#EBEBEE]">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#3D48E8]">Prodex Store</h1>
          <nav className="flex items-center gap-4">
            {customer ? (
              <>
                <Link to="/profile" className="text-[#5B5A59] hover:text-[#3D48E8]">Profile</Link>
                <span className="text-[#5B5A59]">Hello, {customer.name || customer.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-[#3D48E8] hover:bg-[#EBEBEE] rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="px-4 py-2 text-[#3D48E8] hover:bg-[#EBEBEE] rounded-lg transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-[#3D48E8] text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#151515] mb-4">Welcome to Prodex Store</h2>
          <p className="text-lg text-[#5B5A59] mb-8">Your one-stop shop for everything</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-[#151515] mb-2">Products</h3>
              <p className="text-[#5B5A59]">Browse our wide selection of products</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">🛒</div>
              <h3 className="text-lg font-semibold text-[#151515] mb-2">Easy Shopping</h3>
              <p className="text-[#5B5A59]">Simple and secure checkout process</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">🚚</div>
              <h3 className="text-lg font-semibold text-[#151515] mb-2">Fast Delivery</h3>
              <p className="text-[#5B5A59]">Get your orders delivered quickly</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
