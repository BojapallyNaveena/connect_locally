import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Mail, Lock, User, ArrowRight, ArrowLeft, Sparkles, MapPin } from 'lucide-react';
import axios from 'axios';
import API_URL from '../utils/api';

export default function FindWork() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/api/auth/login`, formData);
        localStorage.setItem('token', res.data.token);
        navigate('/jobs');
        window.location.reload();
      } else {
        const res = await axios.post(`${API_URL}/api/auth/register`, {
          ...formData,
          role: 'worker'
        });
        localStorage.setItem('token', res.data.token);
        navigate('/jobs');
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || `${isLogin ? 'Login' : 'Registration'} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50 flex">
      {/* Left Side - Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-cyan-600 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>

          <div className="mb-8">
            <Search className="text-white mb-4" size={48} />
            <h1 className="text-4xl font-bold text-white mb-4">Find Your Next Opportunity</h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Discover local jobs that match your skills. Our AI assistant helps you find the perfect work within your area.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-white/90">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <MapPin size={16} />
              </div>
              <span>Jobs within 15km radius</span>
            </div>
            <div className="flex items-center text-white/90">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <Sparkles size={16} />
              </div>
              <span>AI-powered job matching</span>
            </div>
            <div className="flex items-center text-white/90">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <Search size={16} />
              </div>
              <span>Search in natural language</span>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <h3 className="text-white font-semibold mb-2">💡 Pro Tip</h3>
            <p className="text-blue-100 text-sm">
              Try asking our AI assistant: "Find urgent tutoring jobs near me" or "Photography gigs this weekend"
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login/Register */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center text-slate-600 hover:text-slate-800 mb-4">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
            <Search className="text-blue-600 mx-auto mb-4" size={48} />
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Work</h1>
            <p className="text-slate-600">Discover local opportunities</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
            {/* Tab Switcher */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  !isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {isLogin ? 'Welcome Back!' : 'Create Your Account'}
              </h2>
              <p className="text-slate-600 mt-1">
                {isLogin ? 'Sign in to find your next opportunity' : 'Join to start finding local work'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100 mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      name="name"
                      type="text"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-slate-900 bg-slate-50 focus:bg-white"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-slate-900 bg-slate-50 focus:bg-white"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-slate-900 bg-slate-50 focus:bg-white"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-blue-600/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {isLogin ? 'Sign up here' : 'Sign in here'}
                </button>
              </p>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 text-blue-700 font-semibold mb-1">
                <Sparkles size={16} />
                AI Assistant Ready
              </div>
              <p className="text-blue-600 text-sm">
                Once logged in, use our AI assistant to search jobs with natural language like "find math tutoring jobs near me".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}