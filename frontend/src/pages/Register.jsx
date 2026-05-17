import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Mail, Lock, User, Briefcase, Building, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function Register() {
  const [role, setRole] = useState('worker'); // student, worker, employer, ngo
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
      const res = await axios.post('http://localhost:5000/api/auth/register', { ...formData, role });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-violet-500/20 rounded-full blur-3xl mix-blend-multiply"></div>

      <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 relative z-10 border border-slate-100">
        <div className="text-center">
          <div className="mx-auto flex justify-center">
            <div className="bg-violet-600 text-white p-3 rounded-2xl shadow-lg shadow-violet-200">
              <MapPin size={32} strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-heading font-extrabold text-slate-900">
            Join HyperLocal Connect
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Create an account to start earning or hiring locally
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center border border-red-100">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-900">I want to...</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('worker')}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                  role === 'worker' ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-200 hover:border-violet-300 text-slate-600'
                }`}
              >
                <div className={`p-2 rounded-lg ${role === 'worker' ? 'bg-violet-200' : 'bg-slate-100'}`}>
                  <Briefcase size={20} />
                </div>
                <div className="text-left">
                  <div className="font-bold">Find Work</div>
                  <div className="text-xs opacity-80">Students, freelancers</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole('employer')}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                  role === 'employer' ? 'border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700' : 'border-slate-200 hover:border-fuchsia-300 text-slate-600'
                }`}
              >
                <div className={`p-2 rounded-lg ${role === 'employer' ? 'bg-fuchsia-200' : 'bg-slate-100'}`}>
                  <Building size={20} />
                </div>
                <div className="text-left">
                  <div className="font-bold">Hire Local</div>
                  <div className="text-xs opacity-80">Business, individuals</div>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow text-slate-900 bg-slate-50 focus:bg-white"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow text-slate-900 bg-slate-50 focus:bg-white"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow text-slate-900 bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-violet-600 hover:text-violet-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
