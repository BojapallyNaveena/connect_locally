import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Send, User, Search, Phone, Video, Info, MoreVertical, MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000');

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState('list');
  
  const scrollRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login-worker'); return; }
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const jobId = urlParams.get('jobId');
    fetchProfileAndConversations(userId);
  }, []);

  const fetchProfileAndConversations = async (autoSelectId) => {
    try {
      const profileRes = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(profileRes.data);
      socket.emit('join_chat', profileRes.data.id);
      
      const convRes = await axios.get('http://localhost:5000/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(convRes.data);

      if (autoSelectId) {
        const otherUser = await axios.get(`http://localhost:5000/api/auth/profile/${autoSelectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        selectChat(otherUser.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      // Check if message is part of current active chat
      const isFromActiveChat = activeChat && (
        String(data.senderId) === String(activeChat.id) || 
        String(data.receiverId) === String(activeChat.id)
      );
      
      if (isFromActiveChat) {
        setMessages(prev => [...prev, { 
          SenderId: data.senderId, 
          message: data.message, 
          createdAt: data.createdAt || new Date() 
        }]);
      }
      
      // Refresh conversation list to show new message/notification
      fetchProfileAndConversations();
    };
    socket.on('receive_message', handleReceiveMessage);
    return () => socket.off('receive_message');
  }, [activeChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectChat = async (otherUser) => {
    setActiveChat(otherUser);
    setMobileView('chat');
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${otherUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat || !user) return;
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');
    const data = { message, receiverId: activeChat.id, senderId: user.id, jobId: jobId };
    socket.emit('send_message', data);
    setMessages(prev => [...prev, { SenderId: user.id, message, createdAt: new Date() }]);
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/messages', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProfileAndConversations();
    } catch(err) { console.error(err); }
  };

  if (loading) return <div className="h-screen bg-slate-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="h-screen bg-slate-50 dark:bg-black flex overflow-hidden relative">
      <div className={`${mobileView === 'chat' ? 'hidden' : 'flex'} md:flex w-full md:w-[380px] border-r border-slate-200 dark:border-white/5 bg-white dark:bg-black flex flex-col h-full`}>
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Messages</h1>
          <button onClick={() => navigate('/dashboard')} className="p-2 text-slate-500 hover:text-violet-600"><ArrowLeft size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div key={conv.id} onClick={() => selectChat(conv)} className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-l-4 ${activeChat?.id === conv.id ? 'bg-violet-50 dark:bg-violet-600/10 border-violet-600' : 'hover:bg-slate-50 dark:hover:bg-white/5 border-transparent'}`}>
              <div className="w-12 h-12 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white font-bold">{conv.name?.[0].toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{conv.name}</h3>
                </div>
                <p className="text-xs text-slate-500 truncate">{conv.lastJob ? `Re: ${conv.lastJob}` : (conv.role || 'User')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`${mobileView === 'list' ? 'hidden' : 'flex'} md:flex flex-1 flex flex-col bg-slate-50 dark:bg-black`}>
        {activeChat ? (
          <>
            <div className="p-4 bg-white dark:bg-black/40 border-b border-slate-200 dark:border-white/5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setMobileView('list')} className="md:hidden p-2 text-slate-500"><ArrowLeft size={20} /></button>
                <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-violet-600 font-bold">{activeChat.name?.[0].toUpperCase()}</div>
                <div><h2 className="font-bold text-slate-900 dark:text-white">{activeChat.name}</h2></div>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50 dark:bg-black">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.SenderId === user.id ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-3 rounded-3xl text-sm ${msg.SenderId === user.id ? 'bg-violet-600 text-white rounded-br-none shadow-lg shadow-violet-600/20' : 'bg-white dark:bg-white/10 text-slate-800 dark:text-white rounded-bl-none border border-slate-100 dark:border-white/5'}`}>
                    {msg.message}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 font-bold px-2 uppercase tracking-widest">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
            <div className="p-6 bg-white dark:bg-black/40 border-t border-slate-200 dark:border-white/5">
              <form onSubmit={handleSend} className="relative flex items-center gap-3">
                <input type="text" value={message} onChange={e => setMessage(e.target.value)} className="flex-1 pl-6 pr-14 py-4 bg-slate-100 dark:bg-white/5 border-none rounded-2xl text-sm" placeholder={`Message ${activeChat.name}...`} />
                <button type="submit" className="absolute right-2 p-3 bg-violet-600 text-white rounded-xl"><Send size={18} /></button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-violet-100 dark:bg-violet-600/10 rounded-3xl flex items-center justify-center text-5xl mb-6">💬</div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Your Workspace Chat</h2>
          </div>
        )}
      </div>
    </div>
  );
}
