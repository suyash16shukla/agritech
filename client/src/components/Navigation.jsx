import React from 'react';
import {
  Home, Leaf, CloudSun, CheckSquare, BookOpen, MessageCircle,
  User, Settings, ShieldCheck, ChevronRight
} from 'lucide-react';
import { getTranslation } from '../utils/translations';

// ── Mobile Bottom Navigation ──────────────────────────────────────────────────
export function MobileNav({ activeTab, setActiveTab, onChatOpen, farmer = null, language = 'hinglish' }) {
  const t = getTranslation(language).nav;

  const mobileNavItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'crops', label: t.crops, icon: Leaf },
    { id: 'weather', label: t.weather, icon: CloudSun },
    { id: 'tasks', label: t.tasks, icon: CheckSquare },
    { id: 'schemes', label: t.schemes, icon: BookOpen },
    { id: 'kisanDashboard', label: t.kisanDashboard, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 lg:hidden shadow-lg">
      <div className="flex items-center justify-around px-1 pb-safe pt-1.5">
        {mobileNavItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-700 bg-emerald-50 font-bold scale-105'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] leading-tight ${isActive ? 'text-emerald-700 font-bold' : 'font-medium'}`}>
                {label}
              </span>
            </button>
          );
        })}

        {/* AI Mitra button */}
        <button
          onClick={onChatOpen}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200"
        >
          <div className="relative">
            <MessageCircle size={19} strokeWidth={2} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping" />
          </div>
          <span className="text-[10px] font-bold text-purple-700">AI Mitra</span>
        </button>
      </div>
    </nav>
  );
}

// ── Desktop Sidebar ────────────────────────────────────────────────────────────
export function DesktopSidebar({ activeTab, setActiveTab, onChatOpen, farmer = null, language = 'hinglish' }) {
  const t = getTranslation(language);
  const navT = t.nav;

  const desktopNavItems = [
    { id: 'home', label: navT.home, icon: Home },
    { id: 'crops', label: navT.crops, icon: Leaf },
    { id: 'weather', label: navT.weather, icon: CloudSun },
    { id: 'tasks', label: navT.tasks, icon: CheckSquare },
    { id: 'schemes', label: navT.schemes, icon: BookOpen },
    { id: 'kisanDashboard', label: navT.kisanDashboard, icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 z-40 shadow-sm">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-md text-white text-xl">
            🌾
          </div>
          <div>
            <h1 className="font-extrabold text-gray-900 text-base leading-tight">
              {t.appName}
            </h1>
            <p className="text-[9px] text-emerald-600 font-bold tracking-wider uppercase">
              {t.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
          {navT.mainMenu}
        </p>

        {desktopNavItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span>{label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </button>
          );
        })}

        {/* AI Tools Section */}
        <div className="pt-5">
          <p className="px-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            {navT.aiTools}
          </p>
          <button
            onClick={onChatOpen}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-purple-700 hover:bg-purple-50 transition-all duration-150 border border-purple-200 bg-purple-50/40 shadow-xs group"
          >
            <div className="relative">
              <MessageCircle size={18} className="text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <span>Krishi Mitra AI</span>
            <span className="ml-auto badge bg-purple-200/80 text-purple-800 text-[9px] font-bold px-1.5 py-0.5">
              2.5 FLASH
            </span>
          </button>
        </div>
      </nav>

      {/* Interactive Bottom User / Kisan Dashboard Card */}
      <div className="px-3 py-3 border-t border-gray-100">
        <button
          onClick={() => setActiveTab('kisanDashboard')}
          className={`w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-200 text-left border ${
            activeTab === 'kisanDashboard'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
              : 'bg-gray-50/70 border-gray-200/60 hover:bg-emerald-50 hover:border-emerald-200'
          }`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
            farmer ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {farmer ? '👨‍🌾' : <User size={16} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">
              {farmer?.name || navT.kisanDashboard}
            </p>
            <p className="text-[10px] text-emerald-600 font-medium truncate">
              {farmer ? `${farmer.acreage} Acres • ${farmer.district || farmer.state}` : 'Click to Register Farm'}
            </p>
          </div>
          <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
        </button>
      </div>
    </aside>
  );
}
