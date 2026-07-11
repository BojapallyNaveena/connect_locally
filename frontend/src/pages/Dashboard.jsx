import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, MapPin, Users, Briefcase, ShoppingBag, MessageSquare, 
  Sparkles, Calendar, Gift, LogOut, Bell, Settings, Star, PlusCircle, 
  IndianRupee, ChevronRight, Search, Sun, Moon, ShieldAlert, BarChart3, TrendingUp, AlertTriangle, Menu, X, User
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../utils/api';
import { translations } from '../utils/translations';

const CATEGORY_ICONS = { Delivery: '🛵', 'Event Support': '🎪', 'Poster Design': '🎨', Tutoring: '📚', 'Data Entry': '💻', Photography: '📷', Cleaning: '🧹', Marketing: '📢', 'Home Services': '🏠', Other: '📌' };

export default function Dashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState(0);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const t = translations[lang];

  const isEmployer = user?.role === 'employer';

  const NAV_ITEMS = isEmployer ? [
    { icon: LayoutDashboard, label: 'Dashboard', sub: 'Overview', path: '/dashboard' },
    { icon: PlusCircle, label: 'Post Job', sub: 'Hire Help', path: '/dashboard' },
    { icon: MessageSquare, label: 'Messages', sub: 'Chat History', path: '/chat' },
    { icon: BarChart3, label: 'Status', sub: 'Applicants', path: '/dashboard' },
    { icon: IndianRupee, label: 'Payments', sub: 'History', path: '/dashboard' },
    { icon: User, label: 'Profile', sub: 'My Identity', path: '/profile' },
  ] : [
    { icon: LayoutDashboard, label: 'Dashboard', sub: 'Overview', path: '/dashboard' },
    { icon: MapPin, label: 'Find Jobs', sub: 'Nearby', path: '/jobs' },
    { icon: MessageSquare, label: 'Messages', sub: 'Chat History', path: '/chat' },
    { icon: Briefcase, label: 'Status', sub: 'Applications', path: '/dashboard' },
    { icon: IndianRupee, label: 'Payments', sub: 'History', path: '/dashboard' },
    { icon: User, label: 'Profile', sub: 'My Identity', path: '/profile' },
  ];

  const [postJobData, setPostJobData] = useState({
    title: '', description: '', category: 'Delivery', paymentAmount: '', 
    paymentMode: 'Cash', urgency: 'Medium', address: '', lat: '17.3850', lng: '78.4867'
  });
  const [postJobLoading, setPostJobLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#000000';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new Event('storage'));
  }, [darkMode]);

  useEffect(() => {
    if (!token) { navigate('/login-worker'); return; }
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [profileRes, appsRes, jobsRes, payRes] = await Promise.all([
        axios.get(`${API_URL}/api/auth/profile`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/applications/me`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/jobs?status=Open`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/payments/history`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
      ]);
      const jobsResAll = await axios.get(`${API_URL}/api/jobs?postedBy=${profileRes.data.id}`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }));
      
      setUser(profileRes.data);
      setApplications(appsRes.data);
      setPostedJobs(jobsResAll.data);
      setPaymentHistory(payRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPostJobLoading(true);
    try {
      const payload = {
        title: postJobData.title,
        description: postJobData.description,
        category: postJobData.category,
        payment: { amount: parseFloat(postJobData.paymentAmount), mode: postJobData.paymentMode },
        urgency: postJobData.urgency,
        address: postJobData.address,
        location: { coordinates: [parseFloat(postJobData.lng), parseFloat(postJobData.lat)] }
      };
      await axios.post(`${API_URL}/api/jobs`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Job posted successfully!');
      setPostJobData({ title: '', description: '', category: 'Delivery', paymentAmount: '', paymentMode: 'Cash', urgency: 'Medium', address: '', lat: '17.3850', lng: '78.4867' });
      setActiveNav(0);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post job');
    } finally {
      setPostJobLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  const pendingCount = applications.filter(a => a.status === 'Pending').length;

  const handleHire = async (appId, status) => {
    try {
      await axios.put(`${API_URL}/api/applications/status-update`, { applicationId: appId, status: status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Worker ${status === 'Approved' ? 'Approved' : 'Rejected'} Successfully!`);
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div></div>;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-black overflow-hidden font-sans transition-colors duration-300 relative">
      
      {showMobileMenu && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 lg:hidden" onClick={() => setShowMobileMenu(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 w-[240px] shrink-0 bg-[#0f1535] dark:bg-black text-white flex flex-col h-full border-r border-white/5 transition-transform duration-300 z-110 ${showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-6 py-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <MapPin size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg leading-tight tracking-tight">Hyperlocal<br /><span className="text-violet-400">Connect</span></span>
          </div>
          <button className="lg:hidden p-2 text-slate-400" onClick={() => setShowMobileMenu(false)}><X size={20} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {NAV_ITEMS.map((item, i) => (
            <Link key={i} to={item.path} onClick={() => { setActiveNav(i); setShowMobileMenu(false); }} className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${activeNav === i ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <item.icon size={20} className={activeNav === i ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <div className="leading-tight">
                <div className="text-sm font-semibold">{item.label}</div>
                {item.sub && <div className="text-[10px] opacity-60 font-medium">{item.sub}</div>}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 bg-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-sm font-bold shadow-md border-2 border-white/10">{initials}</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{user?.role || 'Member'}</p>
            </div>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold transition-all mb-2">
            {darkMode ? <Sun size={14} /> : <Moon size={14} />} Theme
          </button>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-red-500/30">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-black w-full">
        <header className="h-20 shrink-0 bg-white dark:bg-[#0f1535] border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 -ml-2 text-slate-500" onClick={() => setShowMobileMenu(true)}><Menu size={24} /></button>
            <div className="flex flex-col">
              <h1 className="text-lg font-black text-slate-800 dark:text-white leading-tight">
                {user?.name} <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full border ${isEmployer ? 'border-violet-500/30 text-violet-500' : 'border-emerald-500/30 text-emerald-500'} uppercase`}>{user?.role}</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.welcome}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
              <MapPin size={14} className="text-violet-500" />
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-tighter">Hyderabad, TS</span>
            </div>
            <div className="w-10 h-10 bg-linear-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/20">{initials}</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8">
          {NAV_ITEMS[activeNav].label === 'Dashboard' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Hero Map Card */}
                <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 h-[280px]">
                  <iframe src={`https://www.openstreetmap.org/export/embed.html?bbox=${78.3}%2C${17.3}%2C${78.6}%2C${17.5}&layer=mapnik`} className="w-full h-full border-0 grayscale dark:invert dark:opacity-40" />
                  <div className="absolute inset-0 bg-linear-to-r from-[#0f172a] via-[#0f172a]/70 to-transparent p-8 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/20 text-violet-400 text-[10px] font-bold rounded-full mb-4 border border-violet-500/30"><Sparkles size={12} /> AI POWERED</div>
                      <h2 className="text-3xl font-extrabold text-white leading-tight mb-2">Connecting Communities<br /><span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-400">Building a Better Future</span></h2>
                    </div>
                  </div>
                </div>

                {/* Action Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                  {[
                    { icon: <MapPin size={24}/>, title: 'Explore', desc: 'Find help', color: 'bg-blue-500', path: '/jobs' },
                    { icon: <PlusCircle size={24}/>, title: 'Post Job', desc: 'Hire help', color: 'bg-violet-600', path: '/post-job' },
                    { icon: <Users size={24}/>, title: 'Workers', desc: 'Top talent', color: 'bg-emerald-500', path: '/jobs' },
                    { icon: <ShieldAlert size={24}/>, title: 'Emergency', desc: 'Quick help', color: 'bg-red-500', path: '/emergency' },
                  ].map((card, i) => (
                    <Link key={i} to={card.path} className="group bg-white dark:bg-white/5 p-5 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm hover:-translate-y-2 transition-all duration-300">
                      <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>{card.icon}</div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">{card.title}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{card.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                {/* AI Section */}
                <div className="bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5 p-6 relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-linear-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg"><Sparkles size={24} className="text-white" /></div>
                    <h3 className="font-bold dark:text-white">AI Assistant</h3>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 mb-6">
                     <p className="text-xs text-slate-600 dark:text-slate-300">Need help finding a worker or job? Just ask me anything!</p>
                  </div>
                  <Link to="/ai" className="flex items-center justify-center gap-3 w-full py-4 bg-linear-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold rounded-2xl shadow-xl shadow-violet-500/20 active:scale-95 transition-all">Chat with AI</Link>
                </div>

                {/* Status Section Mini */}
                <div className="bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5 p-6">
                   <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
                     <TrendingUp size={18} className={isEmployer ? "text-violet-500" : "text-emerald-500"} /> 
                     Recent Pulse
                   </h3>
                   <div className="space-y-4">
                      {isEmployer ? postedJobs.slice(0, 3).map(j => <p key={j.id} className="text-xs font-bold dark:text-white">Job: {j.title}</p>) : applications.slice(0, 3).map(a => <p key={a.id} className="text-xs font-bold dark:text-white">Applied: {a.Job?.title}</p>)}
                   </div>
                   <button onClick={() => setActiveNav(isEmployer ? 3 : 3)} className="w-full mt-4 text-[10px] font-black text-violet-600 uppercase tracking-widest hover:underline">View All Status</button>
                </div>
              </div>
            </div>
          ) : NAV_ITEMS[activeNav].label === 'Payments' ? (
            <div className="bg-white dark:bg-black rounded-[40px] border border-slate-200 dark:border-white/5 p-8 lg:p-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] -z-10"></div>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Payment History</h2>
               <div className="space-y-6">
                 {paymentHistory.length > 0 ? paymentHistory.map((pay, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 group hover:border-violet-500/30 transition-all">
                     <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner">₹</div>
                       <div>
                         <p className="font-black text-slate-900 dark:text-white">{pay.Job?.title}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{isEmployer ? `Paid to ${pay.receiver?.name}` : `Received from ${pay.payer?.name}`}</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-xl font-black text-slate-900 dark:text-white">₹{pay.amount}</p>
                       <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Successful</p>
                     </div>
                   </div>
                 )) : (
                   <div className="text-center py-20">
                     <p className="text-slate-400 font-bold uppercase tracking-widest">No transaction history found</p>
                   </div>
                 )}
               </div>
            </div>
          ) : NAV_ITEMS[activeNav].label === 'Status' ? (
            <div className="bg-white dark:bg-black rounded-[40px] border border-slate-200 dark:border-white/5 p-8 lg:p-12 shadow-2xl overflow-hidden relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] -z-10"></div>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">{isEmployer ? "Applicant Management" : "My Applications Status"}</h2>
               <div className="space-y-10">
                  {isEmployer ? (
                    postedJobs.map(job => (
                      <div key={job.id} className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="h-8 w-1.5 bg-violet-600 rounded-full"></div>
                          <h3 className="text-xl font-black text-slate-800 dark:text-white">{job.title}</h3>
                          <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase text-slate-400 rounded-lg">{job.Applications?.length || 0} APPLICANTS</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {job.Applications?.length > 0 ? job.Applications.map((app, j) => (
                            <div key={j} className="group flex flex-col p-6 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-slate-100 dark:border-white/5 hover:border-violet-500/30 transition-all shadow-sm">
                              <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-linear-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">{app.User?.name?.[0]}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-black text-slate-900 dark:text-white truncate">{app.User?.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.status}</p>
                                </div>
                              </div>
                              
                              {app.deliveryFile && (
                                <div className="mb-4 p-4 bg-white dark:bg-black rounded-2xl border border-dashed border-violet-500/30">
                                  <p className="text-[10px] font-black text-violet-600 uppercase mb-2">Work Delivered:</p>
                                  <img src={app.deliveryFile} className="w-full h-32 object-cover rounded-xl shadow-sm" alt="Work" />
                                </div>
                              )}

                              <div className="flex gap-3">
                                <button onClick={() => navigate(`/chat?userId=${app.UserId}&jobId=${job.id}`)} className="flex-1 py-3 bg-white dark:bg-white/5 text-violet-600 rounded-2xl border border-slate-100 dark:border-white/5 font-bold text-xs hover:bg-violet-50 transition-all flex items-center justify-center gap-2">
                                  <MessageSquare size={16} /> Chat
                                </button>
                                {app.status === 'Pending' ? (
                                  <>
                                    <button onClick={() => handleHire(app.id, 'Approved')} className="flex-1 py-3 bg-violet-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-violet-600/20 active:scale-95 transition-all">Approve</button>
                                    <button onClick={() => handleHire(app.id, 'Rejected')} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><X size={18}/></button>
                                  </>
                                ) : (
                                  <div className="flex-1 flex flex-col gap-2">
                                    <div className={`flex-1 flex items-center justify-center py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest ${app.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                      {app.status === 'Approved' ? 'APPROVED ✅' : 'REJECTED ❌'}
                                    </div>
                                    {app.status === 'Approved' && (
                                      <button onClick={() => navigate(`/payments?jobId=${job.id}&receiverId=${app.UserId}&amount=${job.paymentAmount}`)} className="w-full py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">Release Payment</button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )) : <p className="text-xs text-slate-400 font-bold px-6 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 w-full">No applications received yet.</p>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {applications.map((app, i) => (
                        <div key={i} className="flex flex-col p-8 bg-slate-50 dark:bg-white/5 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm group hover:-translate-y-1 transition-all">
                          <div className="flex gap-6 items-center mb-6">
                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shadow-inner ${app.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : app.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                              {app.status === 'Approved' ? '✅' : app.status === 'Rejected' ? '❌' : '⏳'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 truncate">{app.Job?.title}</h4>
                              <div className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : app.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                {app.status}
                              </div>
                            </div>
                            <button onClick={() => navigate(`/chat?userId=${app.Job?.postedById}&jobId=${app.JobId}`)} className="p-5 bg-violet-600 text-white rounded-[24px] shadow-2xl shadow-violet-600/30 opacity-0 group-hover:opacity-100 transition-all active:scale-95">
                              <MessageSquare size={24}/>
                            </button>
                          </div>

                          {app.status === 'Approved' && !app.deliveryFile && (
                            <div className="p-6 bg-white dark:bg-black rounded-[32px] border border-violet-500/30">
                              <p className="text-[10px] font-black text-violet-600 uppercase mb-4">Deliver your work:</p>
                              <div className="relative group/file">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onloadend = async () => {
                                      try {
                                        await axios.put(`${API_URL}/api/applications/submit-work`, { applicationId: app.id, file: reader.result }, {
                                          headers: { Authorization: `Bearer ${token}` }
                                        });
                                        alert("Work submitted successfully!");
                                        fetchData();
                                      } catch (err) { alert("Submission failed"); }
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="py-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover/file:border-violet-500 transition-all">
                                  <Briefcase className="text-slate-400 group-hover/file:text-violet-500 transition-all" size={24} />
                                  <p className="text-[10px] font-black text-slate-400 group-hover/file:text-violet-600 uppercase tracking-widest">Click to upload poster/file</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {app.deliveryFile && (
                            <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 rounded-[32px] border border-emerald-500/30">
                              <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">Work Delivered! 🎉</p>
                              <img src={app.deliveryFile} className="w-full h-32 object-cover rounded-xl shadow-lg" alt="Poster" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
               </div>
            </div>
          ) : NAV_ITEMS[activeNav].label === 'Post Job' ? (
            <div className="max-w-4xl mx-auto bg-white dark:bg-black p-8 lg:p-12 rounded-[40px] shadow-2xl border border-slate-200 dark:border-white/5">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Post a New Requirement</h2>
              <form onSubmit={handlePostJob} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6 md:col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Job Title</label>
                    <input required className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-violet-500 font-bold dark:text-white" placeholder="e.g. Need a Graphic Designer" value={postJobData.title} onChange={e => setPostJobData({...postJobData, title: e.target.value})} />
                  </div>
                  <div className="space-y-6 md:col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
                    <textarea required className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-violet-500 font-bold dark:text-white h-32" placeholder="Details about the job..." value={postJobData.description} onChange={e => setPostJobData({...postJobData, description: e.target.value})} />
                  </div>
                  <div className="space-y-6">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Category</label>
                    <select className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl font-bold dark:text-white appearance-none border-none outline-none" value={postJobData.category} onChange={e => setPostJobData({...postJobData, category: e.target.value})}>
                      {['Delivery', 'Event Support', 'Poster Design', 'Tutoring', 'Data Entry', 'Photography', 'Cleaning', 'Marketing', 'Home Services', 'Other'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-6">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Budget (₹)</label>
                    <input type="number" required className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-violet-500 font-bold dark:text-white" placeholder="500" value={postJobData.paymentAmount} onChange={e => setPostJobData({...postJobData, paymentAmount: e.target.value})} />
                  </div>
                </div>
                <button type="submit" disabled={postJobLoading} className="w-full py-5 bg-violet-600 text-white font-black rounded-2xl shadow-xl shadow-violet-600/30 hover:bg-violet-700 transition-all active:scale-95 disabled:opacity-50">
                  {postJobLoading ? 'Publishing...' : 'Confirm & Post Job'}
                </button>
              </form>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
               <p className="text-slate-400 font-bold uppercase tracking-widest">Section under development</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
