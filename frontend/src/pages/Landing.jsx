import { Link } from 'react-router-dom';
import { Search, Building, Users, Sparkles, ArrowRight, MapPin, Star } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-white/5 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 left-40 w-96 h-96 bg-white/5 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Status Badge */}
          <div className="flex justify-center mb-8 reveal-scale-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/80">
              <span className="flex h-2 w-2 rounded-full bg-white animate-ping"></span>
              <span className="text-sm font-medium tracking-wide">AI-Powered Local Job Platform</span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white tracking-tight mb-6 leading-tight">
              <span className="inline-block reveal-fade-up">Connect Locally.</span>
              <br />
              <span className="inline-block reveal-fade-up delay-100 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                Work Instantly.
              </span>
            </h1>
            <p className="mt-4 text-xl text-white/60 max-w-3xl mx-auto mb-8 font-light leading-relaxed reveal-fade-up delay-200">
              HyperLocal Connect bridges the gap between local opportunities and skilled workers.
              Find work or hire help within a 15km radius with AI-powered matching.
            </p>
          </div>

          {/* Two Main Options */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center max-w-5xl mx-auto">
            {/* Find Work Card */}
            <div className="flex-1 rounded-3xl p-8 card-premium reveal-fade-up delay-300 group">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500">
                  <Search className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Find Work</h3>
                <p className="text-white/60">Discover local opportunities that match your skills</p>
              </div>

              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <span>Browse jobs within 15km</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <span>AI-powered job matching</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <span>Direct chat with employers</span>
                </div>
              </div>

              <Link
                to="/find-work"
                className="w-full btn-premium py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 group-hover:gap-3"
              >
                Start Finding Work
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Hire Help Card */}
            <div className="flex-1 rounded-3xl p-8 card-premium reveal-fade-up delay-400 group">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500">
                  <Building className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Hire Help</h3>
                <p className="text-white/60">Find skilled local workers for your projects</p>
              </div>

              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <span>Post jobs instantly</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <span>Access verified local talent</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <span>AI assistant for hiring</span>
                </div>
              </div>

              <Link
                to="/hire-help"
                className="w-full btn-premium py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 group-hover:gap-3"
              >
                Start Hiring
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-white mb-6 reveal-fade-up">
              Why Choose <span className="text-white/70">HyperLocal Connect</span>?
            </h2>
            <p className="text-xl text-white/50 max-w-3xl mx-auto reveal-fade-up delay-100">
              We're building the future of local work with AI intelligence and human connection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Hyperlocal Focus",
                desc: "Find opportunities and talent within a 15-20km radius. Save time and reduce transportation costs.",
                delay: "delay-100"
              },
              {
                icon: Sparkles,
                title: "AI-Powered Matching",
                desc: "Our AI assistant understands natural language and finds the perfect matches from our database.",
                delay: "delay-200"
              },
              {
                icon: Users,
                title: "Verified Community",
                desc: "Aadhar verification, ratings, and reviews ensure a safe and trusted environment for everyone.",
                delay: "delay-300"
              }
            ].map((feature, idx) => (
              <div key={idx} className={`group bg-[#0c0c0c] rounded-3xl p-8 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(255,255,255,0.05)] transition-all duration-500 border border-white/5 reveal-fade-up ${feature.delay}`}>
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg mb-6 text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <feature.icon size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1,200+", label: "Active Jobs", delay: "delay-100" },
              { number: "850+", label: "Local Workers", delay: "delay-200" },
              { number: "4.8", label: "Avg Rating", icon: Star, delay: "delay-300" },
              { number: "15km", label: "Service Radius", delay: "delay-400" }
            ].map((stat, idx) => (
              <div key={idx} className={`bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 hover:shadow-lg hover:border-white/10 transition-all reveal-fade-up ${stat.delay}`}>
                <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-1">
                  {stat.number}
                  {stat.icon && <stat.icon className="text-white" size={24} />}
                </div>
                <div className="text-white/60 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black border-t border-white/10 reveal-fade-up">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="text-white/60 mx-auto mb-4 animate-float-slow" size={48} />
          <h2 className="text-4xl font-heading font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/60 mb-10 font-light">
            Join thousands of locals finding work and hiring help through our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/find-work" className="px-8 py-4 btn-premium rounded-full font-bold text-lg">
              Find Work Now
            </Link>
            <Link to="/hire-help" className="px-8 py-4 btn-premium-outline rounded-full font-bold text-lg backdrop-blur-sm">
              Hire Local Talent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}