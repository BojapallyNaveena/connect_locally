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
    { to: "/ai", label: "AI Search", icon: Sparkles, color: "text-violet-650" },
    { to: "/emergency", label: "Emergency", color: "text-red-500" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-white text-black p-2.5 rounded-2xl group-hover:rotate-12 transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <MapPin size={26} strokeWidth={2.5} />
              </div>
              <span className="font-black text-2xl tracking-tighter text-white">
                HYPER<span className="text-white/60">LOCAL</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className={`text-[12px] font-black uppercase tracking-widest transition-colors nav-link ${link.color || 'text-white/60 hover:text-white'} ${link.to === '/ai' ? 'flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10' : ''}`}
              >
                {link.icon && <link.icon size={14} />} {link.label}
              </Link>
            ))}

            <div className="h-6 w-px bg-white/10 mx-2"></div>

            {/* Auth Buttons */}
            {token ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-[12px] font-black text-black bg-white px-6 py-3 rounded-2xl hover:bg-black hover:text-white hover:border hover:border-white transition-all shadow-lg active:scale-95 uppercase tracking-widest">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="p-3 text-white/60 hover:text-white transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login-worker" className="text-[12px] font-black text-white border border-white/20 px-6 py-2.5 rounded-2xl hover:border-white transition-all uppercase tracking-widest">
                  Login
                </Link>
                <Link to="/register" className="text-[12px] font-black text-black bg-white px-6 py-3 rounded-2xl hover:bg-black hover:text-white hover:border hover:border-white transition-all active:scale-95 uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            {token && (
              <Link to="/dashboard" className="p-2 bg-white text-black rounded-xl">
                <LayoutDashboard size={20} />
              </Link>
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out border-t border-white/10 overflow-hidden ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2 bg-black/95 backdrop-blur-lg">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider ${link.color || 'text-white/70 hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3">
                {link.icon && <link.icon size={18} />}
                {link.label}
              </div>
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 mt-4 space-y-3">
            {token ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-3 bg-white text-black rounded-xl font-bold uppercase tracking-widest">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full text-center py-3 text-white font-bold uppercase tracking-widest border border-white/20 rounded-xl">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login-worker" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-3 border border-white/20 text-white rounded-xl font-bold uppercase tracking-widest">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-3 bg-white text-black rounded-xl font-bold uppercase tracking-widest shadow-lg">
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
