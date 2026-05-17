import { useState } from 'react';
import { ShieldAlert, Phone, MapPin, Truck, Zap, Droplets, Wrench, Siren, ArrowRight, Star, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const EMERGENCY_SERVICES = [
  { id: 1, title: 'Ambulance', icon: <HeartPulse className="text-red-500" size={32}/>, color: 'bg-red-50', border: 'border-red-100', number: '108', desc: 'Medical emergency services' },
  { id: 2, title: 'Fire Station', icon: <Siren className="text-orange-500" size={32}/>, color: 'bg-orange-50', border: 'border-orange-100', number: '101', desc: 'Fire & rescue operations' },
  { id: 3, title: 'Police', icon: <ShieldAlert className="text-blue-500" size={32}/>, color: 'bg-blue-50', border: 'border-blue-100', number: '100', desc: 'Law enforcement assistance' },
  { id: 4, title: 'Disaster Mgmt', icon: <Truck className="text-amber-500" size={32}/>, color: 'bg-amber-50', border: 'border-amber-100', number: '1070', desc: 'Natural disaster support' },
];

const QUICK_HELP_WORKERS = [
  { name: 'Ramesh K.', role: 'Emergency Electrician', distance: '1.2 km', rating: 4.9, icon: <Zap size={20}/> },
  { name: 'Sita M.', role: '24/7 Plumber', distance: '0.8 km', rating: 4.8, icon: <Droplets size={20}/> },
  { name: 'Imran P.', role: 'On-Call Mechanic', distance: '2.5 km', rating: 4.7, icon: <Wrench size={20}/> },
];

export default function Emergency() {
  const [activeTab, setActiveTab] = useState('emergency');

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 text-sm font-black rounded-full mb-6 border border-red-500/20 animate-pulse">
            <ShieldAlert size={18} /> HYPERLOCAL EMERGENCY HUB
          </div>
          <h1 className="text-5xl font-black mb-6 tracking-tight">
            Need Help <span className="text-red-500">Fast?</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Direct access to emergency services and top-rated local technicians who are available 24/7 for urgent assistance.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12">
           <button onClick={() => setActiveTab('emergency')} className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'emergency' ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
             Public Emergency
           </button>
           <button onClick={() => setActiveTab('quick-help')} className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'quick-help' ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
             Quick Tech Help
           </button>
        </div>

        {activeTab === 'emergency' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {EMERGENCY_SERVICES.map(service => (
              <div key={service.id} className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:bg-white/10 transition-all group flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 ${service.color} rounded-3xl flex items-center justify-center shadow-inner`}>
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-1">{service.title}</h3>
                    <p className="text-slate-500 text-sm">{service.desc}</p>
                    <div className="mt-3 text-3xl font-black text-red-500 tracking-tighter">
                      CALL: {service.number}
                    </div>
                  </div>
                </div>
                <button className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
             <div className="bg-white/5 rounded-[40px] border border-white/10 p-8">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black flex items-center gap-3">
                    <Zap className="text-yellow-400" /> Nearby Emergency Pros
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">3 Pro's Online</span>
               </div>
               
               <div className="space-y-4">
                  {QUICK_HELP_WORKERS.map((worker, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-red-500/50 transition-all group">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-linear-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                             {worker.icon}
                          </div>
                          <div>
                             <h4 className="font-bold text-lg">{worker.name}</h4>
                             <p className="text-slate-400 text-xs font-medium">{worker.role} · {worker.distance} away</p>
                             <div className="flex items-center gap-1 mt-1 text-yellow-500">
                                <Star size={12} fill="currentColor" />
                                <span className="text-[10px] font-bold">{worker.rating} Verified Rating</span>
                             </div>
                          </div>
                       </div>
                       <Link to="/chat" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-xs transition-all shadow-lg shadow-red-600/20 active:scale-95">
                         Chat & Book Now
                       </Link>
                    </div>
                  ))}
               </div>
             </div>
             
             {/* Map Integration Placeholder */}
             <div className="bg-white/5 rounded-[40px] border border-white/10 h-64 overflow-hidden relative group">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${78.3}%2C${17.3}%2C${78.6}%2C${17.5}&layer=mapnik`}
                  className="w-full h-full border-0 grayscale invert opacity-40 group-hover:opacity-60 transition-opacity"
                  title="Emergency Map"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-6 left-6">
                   <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Live Location Tracking</p>
                   <h4 className="font-bold text-white text-lg">Real-time ETA and Route</h4>
                </div>
             </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-16 text-center">
           <p className="text-slate-500 text-sm mb-6">Always call local police or ambulance for life-threatening emergencies.</p>
           <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-bold transition-all">
             <ArrowRight size={18} className="rotate-180" /> Back to Dashboard
           </Link>
        </div>
      </div>
    </div>
  );
}
