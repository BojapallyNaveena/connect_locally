import { Link } from 'react-router-dom';
import { Search, Building, Users, Sparkles, ArrowRight, MapPin, Star } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-fuchsia-50/20 dark:from-black dark:via-black dark:to-black relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-5 animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-5 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Status Badge */}
          <div className="flex justify-center mb-8 reveal-scale-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-slate-700 dark:text-white/80">
              <span className="flex h-2 w-2 rounded-full bg-green-400 dark:bg-white animate-ping"></span>
              <span className="text-sm font-medium tracking-wide">AI-Powered Local Job Platform</span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              <span className="inline-block reveal-fade-up">Connect Locally.</span>
              <br />
              <span className="inline-block reveal-fade-up delay-100 text-transparent bg-clip-text bg-linear-to-r from-violet-600 to-fuchsia-600 dark:from-white dark:to-white/40">
                Work Instantly.
              </span>
            </h1>
            <p className="mt-4 text-xl text-slate-600 dark:text-white/60 max-w-3xl mx-auto mb-8 font-light leading-relaxed reveal-fade-up delay-200">
              HyperLocal Connect bridges the gap between local opportunities and skilled workers.
              Find work or hire help within a 15km radius with AI-powered matching.
            </p>
          </div>

          {/* Two Main Options */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center max-w-5xl mx-auto">
            {/* Find Work Card */}
            <div className="flex-1 rounded-3xl p-8 card-premium reveal-fade-up delay-300 group">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Search className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Find Work</h3>
                <p className="text-slate-600 dark:text-white/60">Discover local opportunities that match your skills</p>
              </div>

              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-white/70">
                  <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-white rounded-full"></div>
                  <span>Browse jobs within 15km</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-white/70">
                  <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-white rounded-full"></div>
                  <span>AI-powered job matching</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-white/70">
                  <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-white rounded-full"></div>
                  <span>Direct chat with employers</span>
                </div>
              </div>

              <Link
                to="/find-work"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-blue-600/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3"
              >
                Start Finding Work
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Hire Help Card */}
            <div className="flex-1 rounded-3xl p-8 card-premium reveal-fade-up delay-400 group">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Building className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Hire Help</h3>
                <p className="text-slate-600 dark:text-white/60">Find skilled local workers for your projects</p>
              </div>

              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-white/70">
                  <div className="w-1.5 h-1.5 bg-fuchsia-500 dark:bg-white rounded-full"></div>
                  <span>Post jobs instantly</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-white/70">
                  <div className="w-1.5 h-1.5 bg-fuchsia-500 dark:bg-white rounded-full"></div>
                  <span>Access verified local talent</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-white/70">
                  <div className="w-1.5 h-1.5 bg-fuchsia-500 dark:bg-white rounded-full"></div>
                  <span>AI assistant for hiring</span>
                </div>
              </div>

              <Link
                to="/hire-help"
                className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-fuchsia-600/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3"
              >
                Start Hiring
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-black border-t border-slate-100 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-6 reveal-fade-up">
              Why Choose <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-600 to-fuchsia-600 dark:from-white dark:to-white/40">HyperLocal Connect</span>?
            </h2>
            <p className="text-xl text-slate-500 dark:text-white/50 max-w-3xl mx-auto reveal-fade-up delay-100">
              We're building the future of local work with AI intelligence and human connection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Hyperlocal Focus",
                desc: "Find opportunities and talent within a 15-20km radius. Save time and reduce transportation costs.",
                color: "from-blue-500 to-cyan-500",
                delay: "delay-100"
              },
              {
                icon: Sparkles,
                title: "AI-Powered Matching",
                desc: "Our AI assistant understands natural language and finds the perfect matches from our database.",
                color: "from-violet-500 to-purple-500",
                delay: "delay-200"
              },
              {
                icon: Users,
                title: "Verified Community",
                desc: "Aadhar verification, ratings, and reviews ensure a safe and trusted environment for everyone.",
                color: "from-fuchsia-500 to-pink-500",
                delay: "delay-300"
              }
            ].map((feature, idx) => (
              <div key={idx} className={`group bg-slate-50 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-500 border border-slate-100 dark:border-white/5 card-premium reveal-fade-up ${feature.delay}`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg mb-6 text-white group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-white/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-slate-50 dark:bg-black border-t border-slate-100 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1,200+", label: "Active Jobs", delay: "delay-100" },
              { number: "850+", label: "Local Workers", delay: "delay-200" },
              { number: "4.8", label: "Avg Rating", icon: Star, delay: "delay-300" },
              { number: "15km", label: "Service Radius", delay: "delay-400" }
            ].map((stat, idx) => (
              <div key={idx} className={`bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow card-premium reveal-fade-up ${stat.delay}`}>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-1">
                  {stat.number}
                  {stat.icon && <stat.icon className="text-amber-500" size={24} />}
                </div>
                <div className="text-slate-600 dark:text-white/60 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-black dark:to-black border-t dark:border-white/10 reveal-fade-up">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="text-white/80 dark:text-white/60 mx-auto mb-4 animate-float-slow" size={48} />
          <h2 className="text-4xl font-heading font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-violet-100 dark:text-white/60 mb-10 font-light">
            Join thousands of locals finding work and hiring help through our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/find-work" className="px-8 py-4 bg-white text-violet-600 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all">
              Find Work Now
            </Link>
            <Link to="/hire-help" className="px-8 py-4 bg-violet-700/50 text-white rounded-full font-bold text-lg hover:bg-violet-700 backdrop-blur-sm transition-all border border-white/30">
              Hire Local Talent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}