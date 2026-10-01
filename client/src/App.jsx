import React, { useState } from 'react';
import { Bell, Sun, Menu, TrendingUp, Leaf, Users, BarChart2, Droplets, ChevronRight } from 'lucide-react';
import { MobileNav, DesktopSidebar } from './components/Navigation';
import WeatherCard from './components/WeatherCard';
import SoilMetricsCard from './components/SoilMetricsCard';
import CropAdvisor from './components/CropAdvisor';
import CropTimeline from './components/CropTimeline';
import GovtSchemes from './components/GovtSchemes';
import ChatBot, { FloatingChatButton } from './components/ChatBot';

// ── Quick Stats for Home Dashboard ────────────────────────────────────────────
const quickStats = [
  { label: 'Active Crops', value: '3', unit: 'fields', icon: '🌾', color: 'bg-emerald-50 border-emerald-200', textColor: 'text-emerald-700' },
  { label: 'Pending Tasks', value: '7', unit: 'today', icon: '⏰', color: 'bg-orange-50 border-orange-200', textColor: 'text-orange-700' },
  { label: 'MSP Season', value: 'Rabi', unit: '2026-27', icon: '💰', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
  { label: 'Schemes Active', value: '8', unit: 'available', icon: '📋', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' },
];

// ── Alert Banner ──────────────────────────────────────────────────────────────
function AlertBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-start gap-3">
      <span className="text-lg flex-shrink-0 mt-0.5">⚠️</span>
      <div className="flex-1">
        <p className="text-xs font-semibold text-amber-800">Krishi Alert: October Advisory</p>
        <p className="text-xs text-amber-700 mt-0.5">
          Rabi season starting — ideal time for Wheat & Mustard sowing in North India. 
          Soil temperature should be 20–25°C for best germination.
        </p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="text-amber-500 hover:text-amber-700 text-lg leading-none flex-shrink-0"
      >×</button>
    </div>
  );
}

// ── Home Page ─────────────────────────────────────────────────────────────────
function HomePage({ onTabChange }) {
  return (
    <div className="space-y-5">
      <AlertBanner />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {quickStats.map((stat, i) => (
          <div key={i} className={`card p-4 border ${stat.color}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <TrendingUp size={14} className="text-gray-300" />
            </div>
            <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-gray-400">{stat.unit}</p>
          </div>
        ))}
      </div>

      {/* Weather Card */}
      <WeatherCard />

      {/* Soil Metrics */}
      <SoilMetricsCard />

      {/* Quick Actions */}
      <div className="card p-5">
        <h3 className="section-title mb-4">⚡ Quick Actions</h3>
        <div className="space-y-2">
          {[
            { label: 'Get Crop Recommendation', sub: 'For your state & soil type', icon: '🌾', tab: 'crops' },
            { label: 'View Crop Schedule', sub: 'Irrigation & fertilizer timeline', icon: '📅', tab: 'tasks' },
            { label: 'Check Govt Schemes', sub: 'PM-KISAN, PMFBY, PM-KUSUM', icon: '📋', tab: 'schemes' },
            { label: 'Check Live Weather', sub: 'Open-Meteo live forecast', icon: '🌤️', tab: 'weather' },
          ].map(({ label, sub, icon, tab }) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all text-left group"
            >
              <span className="text-xl">{icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Season Calendar Card */}
      <div className="card p-5">
        <h3 className="section-title mb-4">🗓️ Crop Season Calendar 2026-27</h3>
        <div className="space-y-2.5">
          {[
            { season: 'Kharif', period: 'June – October', crops: 'Paddy, Maize, Cotton, Soybean', color: 'bg-green-100 border-green-300 text-green-800' },
            { season: 'Rabi', period: 'October – March', crops: 'Wheat, Mustard, Chickpea, Barley', color: 'bg-blue-100 border-blue-300 text-blue-800', active: true },
            { season: 'Zaid', period: 'March – June', crops: 'Sugarcane, Vegetables, Watermelon', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
          ].map(({ season, period, crops, color, active }) => (
            <div key={season} className={`p-3 rounded-xl border ${color} ${active ? 'ring-2 ring-offset-1 ring-emerald-400' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold">{season}</span>
                {active && <span className="badge bg-emerald-500 text-white text-[9px]">Current Season</span>}
                <span className="text-[10px] opacity-70 ml-auto">{period}</span>
              </div>
              <p className="text-[11px] opacity-80">{crops}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Desktop Header ────────────────────────────────────────────────────────────
function DesktopHeader({ activeTab, onChatOpen }) {
  const tabTitles = {
    home: 'Farm Dashboard',
    crops: 'Crop Advisor & Profitability',
    weather: 'Live Weather & Forecast',
    tasks: 'Crop Timeline & Tasks',
    schemes: 'Government Schemes',
  };

  return (
    <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{tabTitles[activeTab] || 'Dashboard'}</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Rabi Season 2026-27
        </div>
        <button className="relative p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [chatOpen, setChatOpen] = useState(false);
  const [scheduleViewCrop, setScheduleViewCrop] = useState(null);

  const handleScheduleView = (crop) => {
    setScheduleViewCrop(crop);
    setActiveTab('tasks');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onTabChange={setActiveTab} />;
      case 'crops':
        return <CropAdvisor onScheduleView={handleScheduleView} />;
      case 'weather':
        return (
          <div className="space-y-5">
            <WeatherCard />
            <div className="card p-5">
              <h3 className="section-title mb-4">🌾 Weather Impact on Crops</h3>
              <div className="space-y-3">
                {[
                  { icon: '☀️', label: 'High Temperature', advice: 'Increase irrigation frequency. Give evening irrigation to reduce heat stress.', color: 'bg-orange-50 border-orange-200' },
                  { icon: '🌧️', label: 'Heavy Rain Expected', advice: 'Drain field immediately. Avoid fertilizer application 2-3 days before/after rain.', color: 'bg-blue-50 border-blue-200' },
                  { icon: '🌫️', label: 'High Humidity (>80%)', advice: 'Risk of fungal diseases. Spray preventive fungicide (Mancozeb) on susceptible crops.', color: 'bg-gray-50 border-gray-200' },
                  { icon: '💨', label: 'Strong Winds', advice: 'Delay pesticide spraying. Install windbreaks for nursery beds. Support tall crops.', color: 'bg-purple-50 border-purple-200' },
                ].map(({ icon, label, advice, color }) => (
                  <div key={label} className={`p-3.5 rounded-xl border ${color}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xl">{icon}</span>
                      <p className="text-sm font-semibold text-gray-800">{label}</p>
                    </div>
                    <p className="text-xs text-gray-600 ml-8">{advice}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'tasks':
        return <CropTimeline initialCrop={scheduleViewCrop} />;
      case 'schemes':
        return <GovtSchemes />;
      default:
        return <HomePage onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Desktop Sidebar */}
      <DesktopSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onChatOpen={() => setChatOpen(true)}
      />

      {/* Desktop Header */}
      <div className="lg:ml-64">
        <DesktopHeader activeTab={activeTab} onChatOpen={() => setChatOpen(true)} />

        {/* Main Content */}
        <main className="px-4 lg:px-8 py-5 pb-28 lg:pb-8 max-w-4xl">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onChatOpen={() => setChatOpen(true)}
      />

      {/* Floating AI Button */}
      <FloatingChatButton onClick={() => setChatOpen(true)} />

      {/* AI Chatbot Modal */}
      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
