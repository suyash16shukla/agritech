import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Globe, ChevronDown, Bot, User, Sparkles } from 'lucide-react';
import { aiAPI } from '../utils/api';
import { getTranslation } from '../utils/translations';

const QUICK_PROMPTS_BY_LANG = {
  hindi: [
    { text: 'गेहूँ में पीला रतुआ कैसे रोकें?', label: 'पीला रतुआ' },
    { text: 'सरसों में माहू (चेपा) का सबसे अच्छा कीटनाशक क्या है?', label: 'सरसों माहू' },
    { text: 'धान में जिंक की कमी कैसे दूर करें?', label: 'धान जिंक कमी' },
    { text: 'मिट्टी की उर्वरता बढ़ाने के प्राकृतिक उपाय?', label: 'मिट्टी सुधार' },
    { text: 'पीएम किसान योजना में ई-केवाईसी कैसे करें?', label: 'पीएम-किसान KYC' },
  ],
  english: [
    { text: 'How to control yellow rust in wheat?', label: 'Yellow Rust' },
    { text: 'Best organic fertilizer for tomato plants?', label: 'Tomato Care' },
    { text: 'Stem borer management in paddy crops', label: 'Paddy Borer' },
    { text: 'How to reduce alkaline soil pH naturally?', label: 'Soil pH' },
    { text: 'Eligibility rules for PM-KISAN subsidy', label: 'PM-KISAN' },
  ],
  hinglish: [
    { text: 'Gehun mein peela ratua kaise rokein?', label: 'Yellow Rust' },
    { text: 'Sarson mein aphid/maahu ka best ilaj?', label: 'Mustard Aphid' },
    { text: 'Dhan mein stem borer ki rokhtham', label: 'Stem Borer' },
    { text: 'Khad kab aur kitna dalna chahiye?', label: 'Khad Schedule' },
    { text: 'PM-KISAN ki kist check karne ka tareeka', label: 'PM-KISAN Kist' },
  ]
};

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 items-center px-4 py-3 bg-white border border-gray-200 rounded-2xl rounded-bl-md w-20 shadow-xs">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end chat-message`}>
      <div className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs ${
        isUser ? 'bg-emerald-600' : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'
      }`}>
        {isUser ? <User size={15} className="text-white" /> : <span className="text-sm">🌾</span>}
      </div>

      <div className={`max-w-[85%] px-4 py-3 text-xs md:text-sm leading-relaxed ${
        isUser
          ? 'bg-emerald-600 text-white rounded-2xl rounded-br-xs shadow-sm'
          : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-xs shadow-xs'
      }`}>
        {msg.content.split('\n').map((line, i) => (
          <p key={i} className={line === '' ? 'h-2' : 'mb-1 last:mb-0'}>
            {line}
          </p>
        ))}
        <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-black/5">
          {msg.engine && (
            <span className={`text-[9px] ${isUser ? 'text-emerald-200' : 'text-purple-600 font-medium'}`}>
              {msg.engine}
            </span>
          )}
          <span className={`text-[9px] ml-auto ${isUser ? 'text-emerald-200' : 'text-gray-400'}`}>
            {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ChatBot({ isOpen, onClose, currentLanguage = 'hinglish', onLanguageChange = null }) {
  const [language, setLanguage] = useState(currentLanguage);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync with prop
  useEffect(() => {
    if (currentLanguage) {
      setLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  // Initial welcome message
  useEffect(() => {
    const greetingText = getTranslation(language).chat.greeting;
    setMessages([
      {
        role: 'bot',
        content: greetingText,
        engine: 'Gemini 2.5 Flash',
        timestamp: new Date().toISOString(),
      }
    ]);
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleLanguageSelect = (newLang) => {
    setLanguage(newLang);
    setLangMenuOpen(false);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

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
        engine: data.engine || 'Gemini 2.5 Flash',
        timestamp: data.timestamp || new Date().toISOString(),
      }]);
    } catch (err) {
      const fallbackAdvisory = 'Namaste Kisan Bhai, abhi server se connect hone mein thoda samay lag raha hai. Aap fasal ke bare mein zila KVK ya Krishi Kendra se bhi sampark kar sakte hain.';
      setMessages(prev => [...prev, {
        role: 'bot',
        content: err.response?.data?.response || fallbackAdvisory,
        engine: 'Krishi Expert Core',
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

  const quickPrompts = QUICK_PROMPTS_BY_LANG[language] || QUICK_PROMPTS_BY_LANG.hinglish;
  const t = getTranslation(language).chat;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl h-[88vh] lg:h-[82vh] max-h-[720px] bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 px-5 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl shadow-inner">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Krishi Mitra AI</h3>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
              <p className="text-[11px] text-purple-200">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-white text-xs font-semibold transition-colors"
              >
                <Globe size={13} />
                <span>{LANG_OPTIONS.find(l => l.value === language)?.label}</span>
                <ChevronDown size={11} />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20 min-w-[130px] p-1 animate-fade-in">
                  {LANG_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleLanguageSelect(opt.value)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl transition-colors ${
                        language === opt.value
                          ? 'bg-purple-50 text-purple-700 font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{opt.flag}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chat message stream */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-slate-50/70">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {loading && (
            <div className="flex gap-2.5 items-end">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-sm flex-shrink-0 shadow-xs">
                🌾
              </div>
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-4 py-2 border-t border-gray-100 bg-white">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt.text)}
                disabled={loading}
                className="flex-shrink-0 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200 transition-colors disabled:opacity-50"
              >
                {prompt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="px-4 py-3 bg-white border-t border-gray-100">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.inputPlaceholder}
              className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-2.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-gray-50 max-h-24 min-h-[46px]"
              rows={1}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-11 h-11 flex-shrink-0 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating AI trigger button
export function FloatingChatButton({ onClick, unread = false }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 lg:bottom-6 z-40 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center group"
      aria-label="Open Krishi Mitra AI"
    >
      <div className="relative">
        <MessageCircle size={26} strokeWidth={1.8} />
        {unread && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        )}
      </div>
      <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
        AI Mitra 🌾
      </div>
    </button>
  );
}
