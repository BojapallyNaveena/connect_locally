import { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, IndianRupee, Search, SlidersHorizontal, X, Star, Clock, Briefcase, ChevronRight, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../utils/api';

const CATEGORIES = ['All', 'Delivery', 'Event Support', 'Poster Design', 'Tutoring', 'Data Entry', 'Photography', 'Cleaning', 'Marketing', 'Home Services', 'Other'];
const URGENCY_COLORS = { High: 'bg-red-100 text-red-700', Medium: 'bg-amber-100 text-amber-700', Low: 'bg-green-100 text-green-700' };

export default function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map' for mobile
  const [userLocation, setUserLocation] = useState({ lat: 17.3850, lng: 78.4867 });
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyType, setVerifyType] = useState('aadhar'); // 'aadhar', 'email', 'phone'
  const [verifyStep, setVerifyStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [aadharNum, setAadharNum] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyData, setApplyData] = useState({ experience: '', phoneNumber: '', aadharNumber: '' });
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobs();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(p => setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }));
    }
  }, []);

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
  }, []);

  async function fetchJobs() {
    try {
      const res = await axios.get(`${API_URL}/api/jobs`);
      const jobsData = Array.isArray(res.data) ? res.data : [];
      setJobs(jobsData);
      setFilteredJobs(jobsData);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      setJobs([]);
      setFilteredJobs([]);
    } finally { setLoading(false); }
  };

  const handleApplyClick = (job) => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login-worker');
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const startVerification = async () => {
    setVerifying(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/auth/send-otp`, { type: verifyType }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setVerifyStep(2);
    } catch (err) {
      alert("Failed to send OTP");
    } finally {
      setVerifying(false);
    }
  };

  const confirmVerification = async () => {
    setVerifying(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/auth/verify-otp`, { otp, type: verifyType }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      alert(`${verifyType.toUpperCase()} Verified!`);
      setShowVerifyModal(false);
      setVerifyStep(1);
      setOtp('');
      // After verification, reopen the apply modal
      setShowApplyModal(true);
    } catch (err) {
      alert("Invalid OTP. Use 123456 for demo.");
    } finally {
      setVerifying(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/applications`, { 
        jobId: selectedJob.id,
        experience: applyData.experience,
        phoneNumber: applyData.phoneNumber,
        aadharNumber: applyData.aadharNumber
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Application sent successfully! Track it on your dashboard.');
      setShowApplyModal(false);
      setApplyData({ experience: '', phoneNumber: '', aadharNumber: '' });
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.details) {
        const d = err.response.data.details;
        setShowApplyModal(false);
        // Determine which one to verify first
        if (!d.aadhar) setVerifyType('aadhar');
        else if (!d.email) setVerifyType('email');
        else if (!d.phone) setVerifyType('phone');
        setShowVerifyModal(true);
      } else {
        alert(err.response?.data?.message || 'Failed to apply');
      }
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    let res = jobs;
    if (activeCategory !== 'All') res = res.filter(j => j.category === activeCategory);
    if (search) res = res.filter(j => j.title.toLowerCase().includes(search.toLowerCase()));
    setFilteredJobs(res);
  }, [search, activeCategory, jobs]);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="h-screen bg-slate-50 dark:bg-black flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-300 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black w-full max-w-md rounded-[40px] p-8 lg:p-10 shadow-2xl border border-slate-100 dark:border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-3xl rounded-full"></div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{verifyType} Verification</h3>
              <button onClick={() => setShowVerifyModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full dark:text-white"><X size={20}/></button>
            </div>

            {verifyStep === 1 ? (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                  <p className="text-[10px] text-blue-700 dark:text-blue-300 font-bold leading-relaxed uppercase tracking-widest">
                    {verifyType === 'aadhar' 
                      ? "Enter your 12-digit Aadhaar number to proceed."
                      : `We will send a 6-digit verification code to your ${verifyType}.`}
                  </p>
                </div>
                {verifyType === 'aadhar' && (
                  <input 
                    type="text" placeholder="XXXX XXXX XXXX" maxLength={12} value={aadharNum} onChange={e => setAadharNum(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-lg font-bold tracking-widest text-center dark:text-white"
                  />
                )}
                <button onClick={startVerification} disabled={verifying} className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black shadow-xl shadow-violet-600/20 active:scale-95 transition-all uppercase tracking-widest text-[10px]">
                  {verifying ? 'Sending OTP...' : 'Get OTP'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Enter the OTP sent to your {verifyType}</p>
                <input 
                  type="text" placeholder="000000" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)}
                  className="w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-2xl font-black tracking-[1em] text-center dark:text-white"
                />
                <button onClick={confirmVerification} disabled={verifying} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-600/20 active:scale-95 transition-all uppercase tracking-widest text-[10px]">
                  {verifying ? 'Verifying...' : 'Verify Now'}
                </button>
                <button onClick={() => setVerifyStep(1)} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Back</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-200 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black w-full max-w-lg rounded-[40px] p-8 lg:p-12 shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-3xl rounded-full"></div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Apply for {selectedJob?.title}</h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-8">Share your details with the employer</p>
            
            <form onSubmit={handleApplySubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Work Experience</label>
                <textarea 
                  required value={applyData.experience} onChange={e => setApplyData({...applyData, experience: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 font-bold dark:text-white h-32 resize-none"
                  placeholder="Tell us about your previous work..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                  <input 
                    type="tel" required value={applyData.phoneNumber} onChange={e => setApplyData({...applyData, phoneNumber: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 font-bold dark:text-white"
                    placeholder="9988776655"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Aadhar Number (Optional)</label>
                  <input 
                    type="text" value={applyData.aadharNumber} onChange={e => setApplyData({...applyData, aadharNumber: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 font-bold dark:text-white"
                    placeholder="XXXX-XXXX-XXXX"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowApplyModal(false)} className="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
                <button type="submit" disabled={applying} className="flex-1 py-4 bg-violet-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-violet-600/20 active:scale-95 disabled:opacity-50">
                  {applying ? 'Sending...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Toggle */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 md:hidden">
        <button onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')} className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold shadow-2xl transition-all">
          {viewMode === 'list' ? <><MapPin size={18}/> Map View</> : <><Filter size={18}/> List View</>}
        </button>
      </div>

      {/* Main List Area */}
      <div className={`${viewMode === 'map' ? 'hidden' : 'flex'} md:flex flex-col flex-1 h-full overflow-hidden`}>
        <div className="p-6 bg-white dark:bg-black border-b border-slate-200 dark:border-white/5 flex items-center gap-4 sticky top-0 z-50">
          <button onClick={() => navigate('/dashboard')} className="p-2 text-slate-500 hover:text-violet-600 dark:text-slate-400"><ArrowLeft size={20} /></button>
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-3 text-slate-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-white/5 border-none rounded-2xl text-sm dark:text-white" placeholder="Search jobs nearby..." />
          </div>
          <button onClick={fetchJobs} className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-500 hover:text-violet-600 dark:text-slate-400 transition-all">
            <Clock size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Available Jobs ({filteredJobs.length})</h2>
            <button onClick={() => { setActiveCategory('All'); setSearch(''); }} className="text-[10px] font-bold text-violet-600 hover:underline">Clear Filters</button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeCategory === c ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-white/5'}`}>{c}</button>
            ))}
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 font-bold uppercase tracking-widest">No jobs found in this area</p>
            </div>
          ) : filteredJobs.map(job => (
            <div key={job.id} className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-violet-500/30 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">{job.title}</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${URGENCY_COLORS[job.urgency]}`}>{job.urgency}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{job.description}</p>
              
              <div className="flex items-center justify-between text-xs font-bold mb-6">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white"><IndianRupee size={14} /> {job.paymentAmount}</div>
                <div className="flex items-center gap-1 text-slate-400"><MapPin size={14} /> {job.address}</div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate(`/chat?userId=${job.postedById}&jobId=${job.id}`); }}
                  className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white rounded-2xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Message
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleApplyClick(job); }}
                  className="flex-1 py-3 bg-violet-600 text-white rounded-2xl text-xs font-bold hover:bg-violet-700 shadow-lg shadow-violet-600/20 transition-all active:scale-95"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className={`${viewMode === 'list' ? 'hidden' : 'flex'} md:flex flex-1 h-full bg-slate-200`}>
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.lng-0.1}%2C${userLocation.lat-0.1}%2C${userLocation.lng+0.1}%2C${userLocation.lat+0.1}&layer=mapnik`}
          className="w-full h-full border-0 grayscale dark:invert dark:hue-rotate-180 dark:opacity-60"
          title="Jobs Map"
        />
      </div>
    </div>
  );
}
