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
  );
}

export default App;
