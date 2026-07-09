import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../utils/api';
import { MapPin, Briefcase, IndianRupee, AlignLeft, AlertCircle } from 'lucide-react';

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Delivery',
    paymentAmount: '',
    paymentMode: 'Cash',
    urgency: 'Medium',
    address: '',
    lat: '28.6139',
    lng: '77.2090'
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to post a job');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        payment: {
          amount: parseFloat(formData.paymentAmount),
          mode: formData.paymentMode
        },
        urgency: formData.urgency,
        address: formData.address,
        location: {
          coordinates: [parseFloat(formData.lng), parseFloat(formData.lat)]
        }
      };

      await axios.post(`${API_URL}/api/jobs`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto bg-white dark:bg-black p-10 rounded-[40px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 relative overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[100px] -z-10"></div>
        
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Post a New Job</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold mb-10 text-sm uppercase tracking-widest">Find local help in minutes.</p>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 text-red-500 p-4 rounded-2xl border border-red-100 dark:border-red-500/20 mb-8 flex items-center text-sm font-bold">
            <AlertCircle className="mr-2" size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Job Title</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <input 
                  type="text" required name="title" value={formData.title} onChange={handleChange}
                  className="pl-12 w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white font-bold"
                  placeholder="e.g. Need a Graphic Designer for Poster"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Description</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <textarea 
                  required name="description" value={formData.description} onChange={handleChange} rows="4"
                  className="pl-12 w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white font-bold resize-none"
                  placeholder="Describe the task details..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white font-bold appearance-none cursor-pointer">
                  <option>Delivery</option><option>Event Support</option><option>Poster Design</option>
                  <option>Tutoring</option><option>Data Entry</option><option>Photography</option>
                  <option>Cleaning</option><option>Marketing</option><option>Home Services</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Urgency</label>
                <select name="urgency" value={formData.urgency} onChange={handleChange} className="w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white font-bold appearance-none cursor-pointer">
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Budget (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <input 
                    type="number" required name="paymentAmount" value={formData.paymentAmount} onChange={handleChange}
                    className="pl-12 w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white font-bold"
                    placeholder="500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Payment Mode</label>
                <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white font-bold appearance-none cursor-pointer">
                  <option>Cash</option><option>UPI</option><option>Wallet</option><option>Online</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Job Location (Address)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <input 
                  type="text" required name="address" value={formData.address} onChange={handleChange}
                  className="pl-12 w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white font-bold"
                  placeholder="e.g. Hyderabad, Telangana"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-violet-600 text-white font-black py-5 rounded-2xl hover:bg-violet-700 hover:shadow-2xl hover:shadow-violet-600/30 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 text-lg shadow-xl shadow-violet-600/20"
          >
            {loading ? 'Publishing...' : 'Post Job Now'}
          </button>
        </form>
      </div>
    </div>
  );
}
