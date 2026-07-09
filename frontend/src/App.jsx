import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FindWork from './pages/FindWork';
import HireHelp from './pages/HireHelp';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import PostJob from './pages/PostJob';
import Chat from './pages/Chat';
import Payments from './pages/Payments';
import AIAssistant from './pages/AIAssistant';
import LoginEmployer from './pages/LoginEmployer';
import LoginWorker from './pages/LoginWorker';
import Profile from './pages/Profile';
import Emergency from './pages/Emergency';
import Admin from './pages/Admin';


// Layout with Navbar + Footer
function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [loadingScreen, setLoadingScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingScreen(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loadingScreen) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    const revealElements = document.querySelectorAll(
      '.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-scale-in'
    );
    revealElements.forEach(el => observer.observe(el));

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, [loadingScreen]);

  useEffect(() => {
    const syncTheme = () => {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#000000';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '#f8fafc';
      }
    };

    syncTheme();
    window.addEventListener('storage', syncTheme);
    return () => window.removeEventListener('storage', syncTheme);
  }, []);

  return (
    <>
      {loadingScreen && (
        <div 
          className="fixed inset-0 z-55 bg-[#000000] flex flex-col items-center justify-center"
          style={{
            animation: 'fadeOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) 1.5s forwards'
          }}
        >
          <div className="flex flex-col items-center gap-4 animate-logo-scale">
            <div className="bg-white text-black p-5 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.15)] flex items-center justify-center">
              <svg className="w-16 h-16 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <h1 className="text-white text-2xl font-heading font-black tracking-widest uppercase mt-4">HyperLocal</h1>
          </div>
        </div>
      )}
      
      <Router>

      <Routes>
        {/* Dashboard: full-screen layout, no Navbar/Footer */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* All other pages: use Navbar + Footer layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/find-work" element={<FindWork />} />
          <Route path="/hire-help" element={<HireHelp />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="/login-employer" element={<LoginEmployer />} />
          <Route path="/login-worker" element={<LoginWorker />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;
