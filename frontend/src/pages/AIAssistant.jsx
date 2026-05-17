import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Search, MapPin, IndianRupee, Zap, BookOpen, Loader, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SUGGESTION_CHIPS = [
  '🛵 Delivery jobs near me',
  '📚 Tutoring for math',
  '🧹 Cleaning jobs this week',
  '🎨 Poster design urgent',
  '📷 Photography events',
  '🏠 Home services needed',
  '👷 Find skilled workers',
  '🎓 Tutors available now'
];

const CATEGORY_ICONS = {
  Delivery: '🛵', 'Event Support': '🎪', 'Poster Design': '🎨',
  Tutoring: '📚', 'Data Entry': '💻', Photography: '📷',
  Cleaning: '🧹', Marketing: '📢', 'Home Services': '🏠', Other: '📌'
};

const ROLE_ICONS = {
  student: '🎓', worker: '👷', employer: '💼', ngo: '🏢'
};

const URGENCY_COLORS = {
  High: 'text-red-400 bg-red-400/10', Medium: 'text-amber-400 bg-amber-400/10', Low: 'text-green-400 bg-green-400/10'
};

export default function AIAssistant() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [indexStatus, setIndexStatus] = useState(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hi! 👋 I'm your HyperLocal AI Assistant.\n\nI can search through all available jobs and workers using semantic AI — just describe what you're looking for in plain language!",
      sources: [],
      isIntro: true
    }
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/rag/status')
      .then(res => {
        setIndexStatus(res.data);
        setApiKeyConfigured(true);
      })
      .catch(err => {
        setApiKeyConfigured(false);
        setIndexStatus({ status: 'no-api-key', totalIndexed: 0 });
      });
  }, []);

  const sendQuery = async (queryText) => {
    const query = queryText || input.trim();
    if (!query || loading) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setMessages(prev => [...prev, { role: 'ai', content: '🔐 Please **log in** first to use the AI Assistant.', sources: [] }]);
      return;
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/rag/chat', { query }, { headers: { Authorization: `Bearer ${token}` } });
      setMessages(prev => [...prev, { role: 'ai', content: res.data.answer, sources: res.data.sources || [] }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: '🤖 Demo Mode: Semantic search requires a Gemini API key. Try asking about "delivery" or "tutor" to see example matches.', sources: [] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b border-slate-200 dark:border-white/5 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 text-slate-500 hover:text-violet-600 dark:text-slate-400"><ArrowLeft size={20} /></button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">AI Assistant</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Powered by Gemini AI</p>
              </div>
            </div>
          </div>
          {indexStatus && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 text-violet-500 rounded-full text-[10px] font-bold border border-violet-500/20">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
              {indexStatus.status === 'ready' ? `${indexStatus.totalIndexed} ITEMS INDEXED` : 'DEMO MODE'}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)]">
        <div className="flex-1 overflow-y-auto space-y-6 pb-4 no-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-8 h-8 bg-linear-to-br from-violet-600 to-fuchsia-600 rounded-xl flex-shrink-0 flex items-center justify-center mt-1">
                  <Sparkles size={14} className="text-white" />
                </div>
              )}
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-violet-600 text-white rounded-2xl rounded-tr-none' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl rounded-tl-none'} p-4 shadow-sm`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {msg.sources.map((src, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-black/40 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs">{CATEGORY_ICONS[src.category] || '📌'}</span>
                          <span className="text-xs font-bold truncate">{src.title || src.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{src.address || src.skills}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-linear-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center animate-pulse">
                <Sparkles size={14} className="text-white" />
              </div>
              <div className="bg-white dark:bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                <Loader size={14} className="animate-spin text-violet-500" />
                <span className="text-xs font-bold text-slate-500">AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="pt-4 mt-auto">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {SUGGESTION_CHIPS.map((chip, i) => (
                <button key={i} onClick={() => sendQuery(chip)} className="text-[10px] font-bold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 px-4 py-2 rounded-full hover:border-violet-500 transition-all active:scale-95">
                  {chip}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); sendQuery(); }} className="relative">
            <input 
              type="text" value={input} onChange={e => setInput(e.target.value)}
              className="w-full pl-6 pr-16 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl outline-none focus:border-violet-500 transition-all text-sm"
              placeholder="Describe what you need..."
            />
            <button type="submit" className="absolute right-2 top-2 p-2.5 bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-600/20 active:scale-95">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
