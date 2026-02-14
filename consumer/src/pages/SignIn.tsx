import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import type { LoginData } from '../services/api';

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await authApi.login(formData);
      localStorage.setItem('customer', JSON.stringify(res.data.customer));
      localStorage.setItem('token', res.data.access_token);
      navigate('/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EBEBEE]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#151515] mb-6">Sign In</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-[#151515] mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-4 py-2 border border-[#BFC0CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D48E8]"
            />
          </div>
          
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-[#3D48E8] hover:underline">
              Forgot password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#3D48E8] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-center mt-4 text-sm text-[#5B5A59]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#3D48E8] hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
