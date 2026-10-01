import React from 'react';
import {
  Home, Leaf, CloudSun, CheckSquare, BookOpen, MessageCircle,
  TrendingUp, Droplets, Sun, BarChart2, Settings, Bell, User
} from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'crops', label: 'Crops', icon: Leaf },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'schemes', label: 'Schemes', icon: BookOpen },
];

// ── Mobile Bottom Navigation ──────────────────────────────────────────────────
export function MobileNav({ activeTab, setActiveTab, onChatOpen }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
      <div className="flex items-center justify-around px-2 pb-safe pt-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 ${
              activeTab === id
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={20} strokeWidth={activeTab === id ? 2.5 : 1.8} />
            <span className={`text-[10px] font-medium ${activeTab === id ? 'text-emerald-600' : ''}`}>
              {label}
            </span>
          </button>
        ))}
        {/* AI Mitra button */}
        <button
          onClick={onChatOpen}
          className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
        >
          <MessageCircle size={20} strokeWidth={1.8} />
          <span className="text-[10px] font-medium">AI Mitra</span>
        </button>
      </div>
    </nav>
  );
}

// ── Desktop Sidebar ────────────────────────────────────────────────────────────
export function DesktopSidebar({ activeTab, setActiveTab, onChatOpen }) {
  const sidebarItems = [
    ...navItems,
    { id: 'schemes', label: 'Schemes', icon: BookOpen },
  ];

  // Deduplicate
  const uniqueItems = navItems;

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 z-40 shadow-sm">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-xl">🌾</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-base leading-tight">Krishi Mitra</h1>
            <p className="text-[10px] text-emerald-600 font-medium tracking-wide">SMART FARMING PLATFORM</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-3">Main Menu</p>
        {uniqueItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              activeTab === id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Icon size={18} strokeWidth={activeTab === id ? 2.5 : 2} />
            {label}
            {id === 'home' && activeTab === id && (
              <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
            )}
          </button>
        ))}

        <div className="pt-4">
          <p className="px-3 text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-3">AI Tools</p>
          <button
            onClick={onChatOpen}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-700 hover:bg-purple-50 transition-all duration-150 border border-purple-200 bg-purple-50/50"
          >
            <MessageCircle size={18} />
            Krishi Mitra AI
            <span className="ml-auto badge bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5">BETA</span>
          </button>
        </div>
      </nav>

      {/* Bottom User Section */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <User size={15} className="text-emerald-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">Kisan Dashboard</p>
            <p className="text-[10px] text-gray-400">Season 2026-27</p>
          </div>
          <Settings size={14} className="text-gray-400 flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}
