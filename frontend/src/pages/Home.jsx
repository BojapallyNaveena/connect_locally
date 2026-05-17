import { Link } from 'react-router-dom';
import { Search, MapPin, TrendingUp, ShieldCheck, ArrowRight, Sparkles, Users, Zap, Brain, MessageCircle, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Human + AI Collaboration */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-900 via-violet-900 to-slate-800 pt-24 pb-32 lg:pt-36 lg:pb-40">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Floating AI Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-16 h-16 bg-violet-400/20 rounded-full flex items-center justify-center animate-bounce">
            <Brain className="text-violet-300" size={24} />
          </div>
          <div className="absolute bottom-32 left-20 w-12 h-12 bg-fuchsia-400/20 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="text-fuchsia-300" size={18} />
          </div>
          <div className="absolute top-1/2 right-10 w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center animate-ping">
            <MessageCircle className="text-blue-300" size={14} />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Status Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-ping"></span>
              <span className="text-sm font-medium">AI-Powered Job Matching</span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white tracking-tight mb-6">
              Human + AI
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 via-fuchsia-400 to-blue-400">
                Working Together
              </span>
            </h1>
            <p className="mt-4 text-xl text-slate-300 max-w-3xl mx-auto mb-8 font-light leading-relaxed">
              HyperLocal Connect combines the warmth of human connection with the intelligence of AI.
              Find perfect matches, get smart recommendations, and build meaningful opportunities in your community.
            </p>
          </div>

          {/* Human + AI Illustration */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              {/* Human Side */}
              <div className="flex items-center gap-8 bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Users className="text-white" size={32} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Local Talent</h3>
                  <p className="text-slate-300 text-sm">Skilled workers, students, freelancers</p>
                </div>

                {/* Connection Line */}
                <div className="flex items-center">
                  <div className="w-16 h-0.5 bg-linear-to-r from-blue-400 to-violet-400"></div>
                  <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center animate-pulse">
                    <Zap className="text-white" size={16} />
                  </div>
                  <div className="w-16 h-0.5 bg-linear-to-r from-violet-400 to-fuchsia-400"></div>
                </div>

                {/* AI Side */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Brain className="text-white" size={32} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Smart AI</h3>
                  <p className="text-slate-300 text-sm">Instant matching, recommendations</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/ai" className="group px-8 py-4 bg-linear-to-r from-violet-600 to-fuchsia-600 text-white rounded-full font-bold text-lg hover:shadow-xl hover:shadow-violet-600/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              <Sparkles size={20} />
              Try AI Assistant
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all border border-white/20">
              Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-slate-900 mb-6">
              Powered by <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-600 to-fuchsia-600">AI Intelligence</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto">
              Our AI assistant understands natural language and searches through thousands of jobs and profiles to find your perfect match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Smart Job Search",
                desc: "Ask in plain English: 'Find urgent tutoring jobs near me' or 'Skilled photographers available this weekend'",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "Talent Discovery",
                desc: "AI finds both job opportunities and skilled workers. Connect with the right people instantly.",
                color: "from-violet-500 to-purple-500"
              },
              {
                icon: MessageCircle,
                title: "Intelligent Chat",
                desc: "Get personalized recommendations, compare options, and chat directly with matches.",
                color: "from-fuchsia-500 to-pink-500"
              }
            ].map((feature, idx) => (
              <div key={idx} className="group bg-slate-50 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50">
                <div className={`w-16 h-16 bg-linear-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg mb-6 text-white group-hover:scale-110 transition-transform`}>
                  <feature.icon size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-slate-900 mb-6">How Human + AI Works</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              A seamless blend of human expertise and AI intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Human Posts Need",
                desc: "Local businesses, individuals, and organizations post their requirements with details about the work, pay, and timeline.",
                icon: "🏢"
              },
              {
                step: "2",
                title: "AI Finds Matches",
                desc: "Our AI assistant searches through available talent and job opportunities using semantic understanding to find perfect matches.",
                icon: "🤖"
              },
              {
                step: "3",
                title: "Humans Connect",
                desc: "Matched parties chat directly, agree on terms, and complete the work. Community ratings build trust.",
                icon: "🤝"
              }
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-20 h-20 bg-linear-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg">
                  {step.icon}
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 bg-violet-600 text-white rounded-full font-bold text-sm mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats & Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1,200+", label: "Active Jobs" },
              { number: "850+", label: "Skilled Workers" },
              { number: "4.8", label: "Avg Rating", icon: Star },
              { number: "15km", label: "Local Radius" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-1">
                  {stat.number}
                  {stat.icon && <stat.icon className="text-amber-500" size={24} />}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden bg-linear-to-r from-violet-600 to-fuchsia-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <Sparkles className="text-white/80 mx-auto mb-4" size={48} />
          </div>
          <h2 className="text-4xl font-heading font-bold text-white mb-6">
            Experience the Future of Local Work
          </h2>
          <p className="text-xl text-violet-100 mb-10 font-light">
            Join a community where human potential meets AI intelligence to create amazing opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ai" className="px-8 py-4 bg-white text-violet-600 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
              <Brain size={20} />
              Chat with AI Assistant
            </Link>
            <Link to="/register" className="px-8 py-4 bg-violet-700/50 text-white rounded-full font-bold text-lg hover:bg-violet-700 backdrop-blur-sm transition-all border border-white/30">
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
