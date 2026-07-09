import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../utils/api';
import { User, Mail, MapPin, Briefcase, Star, Clock, ShieldCheck, Camera, Edit3, Save, X, Phone, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [formData, setFormData] = useState({ name: '', address: '', skills: '', bio: '', phoneNumber: '', aadharNumber: '' });
  
  const token = localStorage.getItem('token');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        setProfileImage(base64);
        try {
          await axios.put(`${API_URL}/api/auth/profile`, { profileImage: base64 }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          console.error("Failed to save image to DB", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/login-worker'); return; }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setProfileImage(res.data.profileImage || '');
      setFormData({
        name: res.data.name || '',
        address: res.data.address || '',
        skills: res.data.skills ? (Array.isArray(res.data.skills) ? res.data.skills.join(', ') : res.data.skills) : '',
        bio: res.data.bio || '',
        phoneNumber: res.data.phoneNumber || '',
        aadharNumber: res.data.aadharNumber || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/auth/profile`, { ...formData, profileImage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      alert('Profile updated and saved to database!');
      fetchProfile();
    } catch (err) {
      alert('Failed to update profile');
    }
  };


  const [showAadharModal, setShowAadharModal] = useState(false);
  const [aadharStep, setAadharStep] = useState(1); // 1: Number, 2: OTP
  const [aadharNum, setAadharNum] = useState('');
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyType, setVerifyType] = useState('aadhar');

  const startAadharVerify = async () => {
    if (verifyType === 'aadhar' && aadharNum.length !== 12) return alert("Please enter a valid 12-digit Aadhaar Number");
    setVerifying(true);
    try {
      await axios.post(`${API_URL}/api/auth/send-otp`, { type: verifyType }, { headers: { Authorization: `Bearer ${token}` } });
      setAadharStep(2);
    } catch (err) { alert("Failed to send OTP"); }
    finally { setVerifying(false); }
  };

  const confirmAadharVerify = async () => {
    setVerifying(true);
    try {
      await axios.post(`${API_URL}/api/auth/verify-otp`, { otp, type: verifyType }, { headers: { Authorization: `Bearer ${token}` } });
      setShowAadharModal(false);
      alert(`${verifyType.charAt(0).toUpperCase() + verifyType.slice(1)} Verified Successfully! ✅`);
      fetchProfile();
    } catch (err) { alert("Invalid OTP"); }
    finally { setVerifying(false); }
  };

  if (loading) return (
    <div className="h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
    </div>
  );

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Verification Modal */}
        {showAadharModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-black w-full max-w-md rounded-[32px] p-8 border border-slate-100 dark:border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black dark:text-white capitalize">{verifyType} Verification</h3>
                <button onClick={() => setShowAadharModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full dark:text-white"><X size={20}/></button>
              </div>
              
              {aadharStep === 1 ? (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-bold leading-relaxed">
                      {verifyType === 'aadhar' 
                        ? "Enter your 12-digit Aadhaar number. A 6-digit OTP will be sent to your linked mobile number."
                        : `We will send a 6-digit verification code to your ${verifyType}.`}
                    </p>
                  </div>
                  {verifyType === 'aadhar' && (
                    <input 
                      type="text" placeholder="XXXX XXXX XXXX" maxLength={12} value={aadharNum} onChange={e => setAadharNum(e.target.value)}
                      className="w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-lg font-bold tracking-widest text-center dark:text-white"
                    />
                  )}
                  <button onClick={startAadharVerify} disabled={verifying} className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black shadow-xl shadow-violet-600/20 active:scale-95 transition-all">
                    {verifying ? 'Sending OTP...' : 'Get OTP'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-center text-sm font-bold text-slate-500">Enter the OTP sent to your {verifyType}</p>
                  <input 
                    type="text" placeholder="000000" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-2xl font-black tracking-[1em] text-center dark:text-white"
                  />
                  <button onClick={confirmAadharVerify} disabled={verifying} className="w-full py-4 bg-green-600 text-white rounded-2xl font-black shadow-xl shadow-green-600/20 active:scale-95 transition-all">
                    {verifying ? 'Verifying...' : 'Verify Now'}
                  </button>
                  <button onClick={() => setAadharStep(1)} className="w-full text-xs font-bold text-slate-400">Back</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header Card */}
        <div className="bg-white dark:bg-black rounded-[40px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 overflow-hidden mb-8">
          <div className="h-48 bg-linear-to-r from-violet-600 to-indigo-700 relative">
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 70% 50%, #a78bfa 0%, transparent 60%)'}}></div>
            <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
            <button 
              onClick={() => document.getElementById('profile-upload').click()}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white border border-white/20 transition-all"
            >
              <Camera size={20} />
            </button>
          </div>
          
          <div className="px-6 lg:px-12 pb-12 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 mb-8 text-center md:text-left">
              <div className="relative group cursor-pointer" onClick={() => document.getElementById('profile-upload').click()}>
                <div className="w-32 h-32 md:w-40 md:h-40 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-[32px] md:rounded-[40px] border-[6px] border-white dark:border-black shadow-2xl flex items-center justify-center text-4xl md:text-5xl font-extrabold text-white overflow-hidden">
                  {profileImage ? <img src={profileImage} alt="profile" className="w-full h-full object-cover" /> : initials}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-[32px] md:rounded-[40px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                   <Camera size={32} className="text-white" />
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 border-4 border-white dark:border-black rounded-full shadow-lg"></div>
              </div>
              
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{user.name}</h1>
                  {user.isAadharVerified && <BadgeCheck size={24} className="text-blue-500" />}
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 lg:gap-4 text-sm text-slate-500 dark:text-slate-400 font-bold tracking-tight">
                  <div className="flex items-center gap-1.5"><MapPin size={16} className="text-violet-500" /> {user.address || 'Location not set'}</div>
                  <div className="flex items-center gap-1.5 uppercase"><Briefcase size={16} className="text-fuchsia-500" /> {user.role}</div>
                  <div className="flex items-center gap-1.5"><Star size={16} className="text-yellow-500 fill-yellow-500" /> {user.rating?.toFixed(1) || 'N/A'}</div>
                </div>
              </div>
              
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="w-full md:w-auto px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-sm hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 dark:shadow-white/10"
              >
                {isEditing ? <><X size={18}/> Cancel</> : <><Edit3 size={18}/> Edit Profile</>}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                    <input 
                      type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Location / Address</label>
                    <input 
                      type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                    <input 
                      type="tel" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Aadhar Number</label>
                    <input 
                      type="text" value={formData.aadharNumber} onChange={e => setFormData({...formData, aadharNumber: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Skills (comma separated)</label>
                    <input 
                      type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                      placeholder="e.g. Plumbing, Electrician, Teaching"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Bio / Description</label>
                    <textarea 
                      value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white h-32 resize-none"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black text-lg hover:bg-violet-700 shadow-xl shadow-violet-600/20 transition-all flex items-center justify-center gap-2">
                  <Save size={20} /> Save Changes
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                  <section>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">About Me</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {user.bio || 'No bio provided yet. Click Edit Profile to add one!'}
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills ? formData.skills.split(',').map((skill, i) => (
                        <span key={i} className="px-4 py-2 bg-violet-50 dark:bg-violet-600/10 text-violet-600 dark:text-violet-400 rounded-xl text-xs font-bold border border-violet-100 dark:border-violet-500/20">
                          {skill.trim()}
                        </span>
                      )) : <span className="text-slate-400 text-sm">No skills added yet.</span>}
                    </div>
                  </section>
                  
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Recent Reviews</h3>
                      <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                        <Star size={16} fill="currentColor" /> 4.9 (24 Reviews)
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { name: 'Arjun V.', date: '2 days ago', text: 'Professional work and very punctual. Highly recommended for any electrical issues!', rating: 5 },
                        { name: 'Priya S.', date: '1 week ago', text: 'Good service, but arrived 10 mins late. Overall satisfied with the result.', rating: 4 },
                      ].map((rev, i) => (
                        <div key={i} className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                          <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-slate-800 dark:text-white text-sm">{rev.name}</h4>
                             <div className="flex gap-0.5 text-amber-500">
                                {[...Array(rev.rating)].map((_, j) => <Star key={j} size={10} fill="currentColor" />)}
                             </div>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic">"{rev.text}"</p>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rev.date} · VERIFIED CUSTOMER</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Trust & Verification</h4>
                    <ul className="space-y-4">
                      <li className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${user.isAadharVerified ? 'bg-green-100 dark:bg-green-500/20 text-green-600' : 'bg-slate-100 dark:bg-white/5 text-slate-400'} rounded-lg flex items-center justify-center`}>
                            <ShieldCheck size={18} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Aadhar {user.isAadharVerified ? 'Verified' : 'Pending'}</span>
                        </div>
                        {!user.isAadharVerified && (
                          <button 
                            onClick={() => { setVerifyType('aadhar'); setShowAadharModal(true); setAadharStep(1); }} 
                            className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-black rounded-lg shadow-lg shadow-violet-600/20 transition-all uppercase"
                          >
                            Verify Now
                          </button>
                        )}
                      </li>
                      <li className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${user.isEmailVerified ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600' : 'bg-slate-100 dark:bg-white/5 text-slate-400'} rounded-lg flex items-center justify-center`}>
                            <Mail size={18} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Email {user.isEmailVerified ? 'Verified' : 'Pending'}</span>
                        </div>
                        {!user.isEmailVerified && (
                          <button onClick={() => { setVerifyType('email'); setShowAadharModal(true); setAadharStep(1); }} className="px-3 py-1 bg-blue-500 text-white text-[9px] font-black rounded-lg uppercase">Verify</button>
                        )}
                      </li>
                      <li className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${user.isPhoneVerified ? 'bg-green-100 dark:bg-green-500/20 text-green-600' : 'bg-slate-100 dark:bg-white/5 text-slate-400'} rounded-lg flex items-center justify-center`}>
                            <Phone size={18} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.phoneNumber || 'Phone Not Added'}</span>
                        </div>
                        {!user.isPhoneVerified && user.phoneNumber && (
                          <button onClick={() => { setVerifyType('phone'); setShowAadharModal(true); setAadharStep(1); }} className="px-3 py-1 bg-green-500 text-white text-[9px] font-black rounded-lg uppercase">Verify</button>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
