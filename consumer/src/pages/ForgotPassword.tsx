import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      const res = await authApi.forgotPassword(email);
      setMessage(res.data.message);
    } catch {
      setError('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EBEBEE]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#151515] mb-6">Forgot Password</h1>
        <p className="text-sm text-[#5B5A59] mb-6 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">{message}</div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#151515] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#BFC0CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D48E8]"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#3D48E8] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <p className="text-center mt-4 text-sm text-[#5B5A59]">
          Remember your password?{' '}
          <Link to="/signin" className="text-[#3D48E8] hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
