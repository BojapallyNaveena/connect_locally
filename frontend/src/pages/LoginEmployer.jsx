import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Mail, Lock, ArrowRight, PlusCircle } from 'lucide-react';
import axios from 'axios';
import API_URL from '../utils/api';

export default function LoginEmployer() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Login failed. Check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-violet-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200 mb-4">
            <PlusCircle size={32} />
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-slate-900">Employer Login</h2>
          <p className="mt-2 text-slate-500 text-sm">Sign in to post jobs and find local talent</p>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-xs font-semibold">
            <PlusCircle size={12} /> Post Jobs & Hire
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center border border-red-100 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input name="email" type="email" required
                className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white transition-all"
                placeholder="you@company.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input name="password" type="password" required
                className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign in & Post Jobs'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-slate-500">
            Looking for work instead?{' '}
            <Link to="/login-worker" className="font-bold text-violet-600 hover:text-violet-700">Worker Login →</Link>
          </p>
          <p className="text-sm text-slate-500">
            No account?{' '}
            <Link to="/register" className="font-bold text-violet-600 hover:text-violet-700">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
