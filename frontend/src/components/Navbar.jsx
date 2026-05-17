import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Menu, LogOut, Sparkles, X, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/hire-help", label: "Hire Help" },
    { to: "/find-work", label: "Find Work" },
    { to: "/ai", label: "AI Search", icon: Sparkles, color: "text-violet-600" },
    { to: "/emergency", label: "Emergency", color: "text-red-500" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-linear-to-br from-violet-600 to-indigo-600 text-white p-2.5 rounded-2xl group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-violet-200">
                <MapPin size={26} strokeWidth={2.5} />
              </div>
              <span className="font-black text-2xl tracking-tighter text-slate-900">
                HYPER<span className="text-violet-600">LOCAL</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className={`text-[13px] font-black uppercase tracking-widest transition-colors ${link.color || 'text-slate-500 hover:text-violet-600'} ${link.to === '/ai' ? 'flex items-center gap-1.5 bg-violet-50 px-4 py-2 rounded-full' : ''}`}
              >
                {link.icon && <link.icon size={14} />} {link.label}
              </Link>
            ))}

            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            {/* Auth Buttons */}
            {token ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-[13px] font-black text-white bg-slate-900 px-6 py-3 rounded-2xl hover:bg-violet-600 transition-all shadow-xl shadow-slate-200 active:scale-95 uppercase tracking-widest">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login-worker" className="text-[13px] font-black text-slate-900 border-2 border-slate-100 px-6 py-2.5 rounded-2xl hover:border-violet-600 transition-all uppercase tracking-widest">
                  Login
                </Link>
                <Link to="/register" className="text-[13px] font-black text-white bg-violet-600 px-6 py-3 rounded-2xl hover:bg-violet-700 shadow-xl shadow-violet-200 transition-all active:scale-95 uppercase tracking-widest">
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            {token && (
              <Link to="/dashboard" className="p-2 bg-slate-900 text-white rounded-xl">
                <LayoutDashboard size={20} />
              </Link>
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out border-t border-slate-100 overflow-hidden ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2 bg-white">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider ${link.color || 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                {link.icon && <link.icon size={18} />}
                {link.label}
              </div>
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
            {token ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full text-center py-3 text-red-500 font-bold uppercase tracking-widest border-2 border-red-50 rounded-xl">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login-worker" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-3 border-2 border-slate-100 text-slate-900 rounded-xl font-bold uppercase tracking-widest">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-3 bg-violet-600 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-violet-200">
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
