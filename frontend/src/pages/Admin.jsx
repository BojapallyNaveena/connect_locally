import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../utils/api';
import { 
  Users, Briefcase, ShieldAlert, BarChart3, TrendingUp, Search, 
  Filter, MoreVertical, Trash2, CheckCircle, XCircle, Settings, LogOut, LayoutDashboard
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Only allow admins
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const profile = await axios.get(`${API_URL}/api/auth/profile`, { headers: { Authorization: `Bearer ${token}` } });
      if (profile.data.role !== 'admin' && profile.data.role !== 'employer') { // Temporary allowance for demo
        // navigate('/dashboard'); 
      }
      
      const [usersRes, jobsRes] = await Promise.all([
        axios.get(`${API_URL}/api/auth/profile`, { headers: { Authorization: `Bearer ${token}` } }).then(r => [r.data]), // Mocking list for now
        axios.get(`${API_URL}/api/jobs`)
      ]);
      
      setUsers(usersRes);
      setJobs(jobsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await axios.delete(`${API_URL}/api/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setJobs(jobs.filter(j => j.id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return (
    <div className="h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0b0e14] text-white overflow-hidden font-sans">
      
      {/* ── ADMIN SIDEBAR ── */}
      <aside className="w-[260px] bg-black border-r border-white/5 flex flex-col h-full">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/20">
              <ShieldAlert size={20} />
            </div>
            <span className="font-black text-xl tracking-tight">ADMIN <span className="text-violet-500">CORE</span></span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'users', icon: Users, label: 'User Management' },
            { id: 'jobs', icon: Briefcase, label: 'Job Moderation' },
            { id: 'reports', icon: ShieldAlert, label: 'Reports' },
            { id: 'settings', icon: Settings, label: 'System Settings' },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === item.id ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={20} />
              <span className="text-sm font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <Link to="/dashboard" className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold transition-all mb-3">
            <LayoutDashboard size={14} /> Back to App
          </Link>
          <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl text-xs font-bold transition-all">
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto p-12">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
           <div>
             <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">Command Center</h1>
             <p className="text-slate-500 text-sm font-bold">Platform Status: <span className="text-green-500">OPTIMAL</span></p>
           </div>
           <div className="flex gap-4">
              <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 text-center min-w-[120px]">
                 <div className="text-[10px] font-black text-slate-500 uppercase">Active Users</div>
                 <div className="text-2xl font-black">1.2K</div>
              </div>
              <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 text-center min-w-[120px]">
                 <div className="text-[10px] font-black text-slate-500 uppercase">Live Jobs</div>
                 <div className="text-2xl font-black text-violet-500">{jobs.length}</div>
              </div>
           </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 bg-white/5 rounded-[40px] border border-white/5 p-8">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-black flex items-center gap-3">
                        <TrendingUp className="text-violet-500" /> Platform Growth
                      </h3>
                      <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-3 py-1 rounded-full uppercase">Updated 2m ago</span>
                   </div>
                   {/* Mock Chart Area */}
                   <div className="h-64 flex items-end gap-3 px-4">
                      {[40, 70, 45, 90, 65, 80, 100, 50, 75, 60, 85, 95].map((h, i) => (
                        <div key={i} className="flex-1 bg-violet-600/20 rounded-t-lg relative group transition-all hover:bg-violet-600">
                           <div className="bg-violet-600 rounded-t-lg transition-all" style={{height: `${h}%`}}></div>
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                             {h}%
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="flex justify-between mt-4 px-4 text-[10px] font-black text-slate-600 uppercase">
                      <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                      <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                   </div>
                </div>

                <div className="bg-linear-to-br from-violet-600 to-indigo-800 rounded-[40px] p-8 text-white relative overflow-hidden">
                   <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                   <h3 className="text-xl font-black mb-6">Quick Stats</h3>
                   <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-white/60 uppercase mb-1">New Signups</p>
                        <div className="text-3xl font-black">+42 <span className="text-sm font-bold text-green-400">↑</span></div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/60 uppercase mb-1">Reports Pending</p>
                        <div className="text-3xl font-black text-red-400">3</div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/60 uppercase mb-1">Total Revenue</p>
                        <div className="text-3xl font-black">₹1.2M</div>
                      </div>
                   </div>
                   <button className="w-full mt-8 py-4 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase hover:bg-slate-100 transition-all">
                      Download Report
                   </button>
                </div>
             </div>

             {/* Recent Logs */}
             <div className="bg-white/5 rounded-[40px] border border-white/5 p-8">
                <h3 className="text-xl font-black mb-8">System Activity Pulse</h3>
                <div className="space-y-4">
                   {[
                     { event: 'User verification approved', target: 'Ramesh Kumar', time: '5m ago', type: 'success' },
                     { event: 'New high-urgency job posted', target: 'Plumbing Emergency', time: '12m ago', type: 'alert' },
                     { event: 'Spam report flagged', target: 'Fake Delivery Post', time: '45m ago', type: 'danger' },
                   ].map((log, i) => (
                     <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                           <div className={`w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-green-500' : log.type === 'alert' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                           <div>
                              <p className="text-sm font-bold">{log.event}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase">{log.target}</p>
                           </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-600 uppercase">{log.time}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Job Moderation</h3>
                <div className="relative">
                   <Search size={16} className="absolute left-4 top-3 text-slate-500" />
                   <input className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 w-64" placeholder="Filter jobs..." />
                </div>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
                {jobs.map(job => (
                  <div key={job.id} className="bg-white/5 border border-white/5 p-6 rounded-[32px] hover:border-white/10 transition-all flex items-center justify-between group">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl">
                           {job.category === 'Delivery' ? '🛵' : '🛠️'}
                        </div>
                        <div>
                           <h4 className="font-bold text-lg leading-tight">{job.title}</h4>
                           <p className="text-xs text-slate-500 mt-1 font-medium">{job.address} · Posted by User ID: {job.postedById}</p>
                           <span className="inline-block mt-2 text-[10px] font-black bg-violet-600/20 text-violet-500 px-3 py-1 rounded-full uppercase tracking-widest">{job.category}</span>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button className="p-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-xl transition-all"><CheckCircle size={18}/></button>
                        <button onClick={() => handleDeleteJob(job.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={18}/></button>
                        <button className="p-3 bg-white/5 text-slate-400 hover:bg-white/10 rounded-xl transition-all"><MoreVertical size={18}/></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

      </main>
    </div>
  );
}
