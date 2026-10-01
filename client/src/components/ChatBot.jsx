import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Globe, ChevronDown, Bot, User, AlertCircle, Sparkles } from 'lucide-react';
import { aiAPI } from '../utils/api';

const QUICK_PROMPTS = [
  { text: 'गेहूँ में पीला रतुआ कैसे रोकें?', label: 'Yellow Rust' },
  { text: 'Tomato mein kaunsi khad dalni chahiye?', label: 'Tomato Fertilizer' },
  { text: 'Paddy mein stem borer ka ilaj?', label: 'Stem Borer' },
  { text: 'Soil pH zyada hai, kya karein?', label: 'High pH Fix' },
  { text: 'PM-KISAN scheme kaise apply karein?', label: 'PM-KISAN Help' },
  { text: 'Sarson mein aphid control kaise karein?', label: 'Aphid Control' },
];

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-4 py-3 bg-white border border-gray-200 rounded-2xl rounded-bl-md w-20">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end chat-message`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-emerald-600' : 'bg-gradient-to-br from-purple-500 to-indigo-600'
      }`}>
        {isUser ? <User size={14} className="text-white" /> : <span className="text-sm">🌾</span>}
      </div>
      {/* Bubble */}
      <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-emerald-600 text-white rounded-2xl rounded-br-md'
          : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-md shadow-sm'
      }`}>
        {msg.content.split('\n').map((line, i) => (
          <p key={i} className={line === '' ? 'h-2' : 'mb-0.5'}>{line}</p>
        ))}
        <p className={`text-[10px] mt-2 ${isUser ? 'text-emerald-200' : 'text-gray-400'}`}>
          {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

export default function ChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: 'Namaste! 🙏 Main Krishi Mitra AI hoon — aapka digital krishi sahayak.\n\nMujhse poochh sakte hain:\n• Fasal ki beemari aur ilaj\n• Khaad aur paani ka schedule\n• Mitti ki janch aur sudhar\n• Sarkar ki yojanayen\n\nAap kisi bhi bhasha mein baat kar sakte hain — Hindi, Hinglish, ya English! 🌾',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('hinglish');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userMsg = text.trim();
    if (!userMsg || loading) return;

    setInput('');
    const userMessage = { role: 'user', content: userMsg, timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.slice(1).map(m => ({ role: m.role, content: m.content }));
      const { data } = await aiAPI.chat(userMsg, language, history.slice(0, -1));
      setMessages(prev => [...prev, {
        role: 'bot',
        content: data.response,
        timestamp: data.timestamp,
      }]);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'AI service unavailable. Please check GEMINI_API_KEY in server .env file.';
      setMessages(prev => [...prev, {
        role: 'bot',
        content: `❌ ${errorMsg}`,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const LANG_OPTIONS = [
    { value: 'hinglish', label: 'Hinglish', flag: '🇮🇳' },
    { value: 'hindi', label: 'हिंदी', flag: '🇮🇳' },
    { value: 'english', label: 'English', flag: '🇬🇧' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg h-[90vh] lg:h-[80vh] max-h-[700px] bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
            🌾
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-sm">Krishi Mitra AI</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <p className="text-xs text-purple-200">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs transition-colors"
            >
              <Globe size={12} />
              {LANG_OPTIONS.find(l => l.value === language)?.label}
              <ChevronDown size={10} />
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg overflow-hidden z-10 min-w-[120px]">
                {LANG_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setLanguage(opt.value); setLangMenuOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-emerald-50 transition-colors ${language === opt.value ? 'text-emerald-700 font-semibold bg-emerald-50' : 'text-gray-700'}`}
                  >
                    {opt.flag} {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          {loading && (
            <div className="flex gap-2 items-end">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm flex-shrink-0">
                🌾
              </div>
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-4 py-2 border-t border-gray-100 bg-white">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt.text)}
                disabled={loading}
                className="flex-shrink-0 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-200 transition-colors disabled:opacity-50"
              >
                {prompt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-4 py-3 bg-white border-t border-gray-100">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Apna sawaal likhein... (Type in Hindi or English)"
              className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-gray-50 max-h-24 min-h-[48px]"
              rows={1}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-11 h-11 flex-shrink-0 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Send size={16} />
              }
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

// Floating AI button (shown on all pages)
export function FloatingChatButton({ onClick, unread = false }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 lg:bottom-6 z-40 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center group"
      aria-label="Open Krishi Mitra AI"
    >
      <div className="relative">
        <MessageCircle size={24} strokeWidth={1.8} />
        {unread && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        )}
      </div>
      <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        AI Mitra 🌾
      </div>
    </button>
  );
}
