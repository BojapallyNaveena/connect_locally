import { Link } from 'react-router-dom';
import { MapPin, Globe, Share2, Link2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-violet-100 text-violet-600 p-1.5 rounded-lg">
                <MapPin size={20} strokeWidth={2.5} />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight text-slate-900">
                HyperLocalConnect
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              Empowering locals. Encouraging independence. Connecting opportunities nearby. Join our community to find or offer flexible work in your area.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-violet-600 transition-colors">
                <span className="sr-only">Social</span>
                <Share2 size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-violet-600 transition-colors">
                <span className="sr-only">Network</span>
                <Link2 size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-violet-600 transition-colors">
                <span className="sr-only">Website</span>
                <Globe size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Find Jobs</Link></li>
              <li><Link to="/" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Post a Job</Link></li>
              <li><Link to="/" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">How it works</Link></li>
              <li><Link to="/" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Help Center</Link></li>
              <li><Link to="/" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Safety Center</Link></li>
              <li><Link to="/" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} HyperLocal Connect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
