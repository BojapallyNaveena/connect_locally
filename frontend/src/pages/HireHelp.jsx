import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Mail, Lock, User, ArrowRight, ArrowLeft, Sparkles, Users } from 'lucide-react';
import axios from 'axios';

export default function HireHelp() {
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
        const res = await axios.post('http://localhost:5000/api/auth/login', formData);
        localStorage.setItem('token', res.data.token);
        navigate('/post-job');
        window.location.reload();
      } else {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
          ...formData,
          role: 'employer'
        });
        localStorage.setItem('token', res.data.token);
        navigate('/post-job');
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || `${isLogin ? 'Login' : 'Registration'} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 to-slate-50 flex">
      {/* Left Side - Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-fuchsia-600 to-pink-600 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>

          <div className="mb-8">
            <Building className="text-white mb-4" size={48} />
            <h1 className="text-4xl font-bold text-white mb-4">Find the Perfect Talent</h1>
            <p className="text-fuchsia-100 text-lg leading-relaxed">
              Connect with skilled local workers. Our AI assistant helps you find the right people for your projects.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-white/90">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <Users size={16} />
              </div>
              <span>Access verified local talent</span>
            </div>
            <div className="flex items-center text-white/90">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <Sparkles size={16} />
              </div>
              <span>AI-powered candidate matching</span>
            </div>
            <div className="flex items-center text-white/90">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <Building size={16} />
              </div>
              <span>Post jobs instantly</span>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <h3 className="text-white font-semibold mb-2">💡 Pro Tip</h3>
            <p className="text-fuchsia-100 text-sm">
              Try asking our AI assistant: "Find experienced plumbers in my area" or "Get candidates for weekend photography"
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
            <Building className="text-fuchsia-600 mx-auto mb-4" size={48} />
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Hire Help</h1>
            <p className="text-slate-600">Find skilled local workers</p>
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
                {isLogin ? 'Sign in to post jobs and hire talent' : 'Join to start hiring local workers'}
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
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-shadow text-slate-900 bg-slate-50 focus:bg-white"
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
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-shadow text-slate-900 bg-slate-50 focus:bg-white"
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
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-shadow text-slate-900 bg-slate-50 focus:bg-white"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-fuchsia-600/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  className="text-fuchsia-600 hover:text-fuchsia-700 font-semibold"
                >
                  {isLogin ? 'Sign up here' : 'Sign in here'}
                </button>
              </p>
            </div>

            <div className="mt-8 p-4 bg-fuchsia-50 rounded-xl border border-fuchsia-100">
              <div className="flex items-center gap-2 text-fuchsia-700 font-semibold mb-1">
                <Sparkles size={16} />
                AI Assistant Ready
              </div>
              <p className="text-fuchsia-600 text-sm">
                Once logged in, use our AI assistant to find candidates with queries like "find experienced electricians nearby".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}