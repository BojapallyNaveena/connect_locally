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
    { to: "/ai", label: "AI Search", icon: Sparkles, color: "text-violet-600 dark:text-violet-400" },
    { to: "/emergency", label: "Emergency", color: "text-red-500" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-xs animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-2.5 rounded-2xl group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-violet-200 dark:shadow-none">
                <MapPin size={26} strokeWidth={2.5} />
              </div>
              <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
                HYPER<span className="text-violet-600 dark:text-violet-400">LOCAL</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className={`text-[13px] font-black uppercase tracking-widest transition-colors nav-link ${link.color || 'text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-white'} ${link.to === '/ai' ? 'flex items-center gap-1.5 bg-violet-50 dark:bg-white/5 px-4 py-2 rounded-full' : ''}`}
              >
                {link.icon && <link.icon size={14} />} {link.label}
              </Link>
            ))}

            <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-2"></div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-[13px] font-black text-white bg-slate-900 dark:bg-white dark:text-black px-6 py-3 rounded-2xl hover:bg-violet-600 dark:hover:bg-violet-400 dark:hover:text-white transition-all shadow-xl active:scale-95 uppercase tracking-widest">
                Dashboard
              </Link>
              {token && (
                <button onClick={handleLogout} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            <Link to="/dashboard" className="p-2 bg-slate-900 dark:bg-white dark:text-black text-white rounded-xl">
              <LayoutDashboard size={20} />
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out border-t border-slate-100 dark:border-white/10 overflow-hidden ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2 bg-white dark:bg-black">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider ${link.color || 'text-slate-600 dark:text-white/70 hover:bg-slate-55 dark:hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3">
                {link.icon && <link.icon size={18} />}
                {link.label}
              </div>
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 dark:border-white/10 mt-4 space-y-3">
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-3 bg-slate-900 dark:bg-white dark:text-black text-white rounded-xl font-bold uppercase tracking-widest">
              Dashboard
            </Link>
            {token && (
              <button onClick={handleLogout} className="w-full text-center py-3 text-red-500 font-bold uppercase tracking-widest border-2 border-red-50 rounded-xl">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
