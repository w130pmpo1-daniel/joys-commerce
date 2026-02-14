import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredToken, authApi } from '../services/api';

interface Customer {
  id: number;
  email: string;
  username: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
}

export default function Profile() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      navigate('/signin');
      return;
    }
    
    const stored = localStorage.getItem('customer');
    if (stored) {
      const c = JSON.parse(stored);
      setCustomer(c);
      setFormData({
        email: c.email || '',
        username: c.username || '',
        name: c.name || '',
        phone: c.phone || '',
        address: c.address || '',
        city: c.city || '',
        country: c.country || '',
      });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const token = getStoredToken();
      await authApi.updateProfile(token!, formData);
      setCustomer({ ...customer!, ...formData });
      localStorage.setItem('customer', JSON.stringify({ ...customer!, ...formData }));
      setSuccess('Profile updated successfully!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customer');
    navigate('/signin');
  };

  if (!customer) {
    return <div className="min-h-screen bg-[#EBEBEE] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#EBEBEE]">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-[#3D48E8]">Prodex Store</Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-[#5B5A59] hover:text-[#3D48E8]">Home</Link>
            <button onClick={handleLogout} className="text-[#3D48E8] hover:underline">Logout</button>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#151515] mb-6">My Profile</h1>
        
        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">{success}</div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#151515] mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-[#BFC0CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D48E8]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#151515] mb-1">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className="w-full px-4 py-2 border border-[#BFC0CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D48E8]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#151515] mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-[#BFC0CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D48E8]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#151515] mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-[#BFC0CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D48E8]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#151515] mb-1">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-[#BFC0CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D48E8]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#151515] mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-[#BFC0CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D48E8]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#151515] mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border border-[#BFC0CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D48E8]"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#3D48E8] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  );
}
